import { db } from '@/db';
import { users } from '@/db/schema';
import { ratelimit } from '@/lib/ratelimit';
import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import superjson from 'superjson';


export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const { userId } = await auth();
  return { clerkUserId: userId };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});


export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;



export const protectedProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;

  if (!ctx.clerkUserId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authorized',
    });
  }

  const [user] = await db.select().from(users).where(eq(users.clerkId, ctx.clerkUserId));

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authorized',
    });
  }

  const { success } = await ratelimit.limit(user.id);

  if (!success) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests',
    });
  }

  return opts.next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
