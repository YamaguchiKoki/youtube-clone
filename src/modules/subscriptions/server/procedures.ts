import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";


export const subscriptionsRouter = createTRPCRouter({
  subscribe: protectedProcedure
    .input(z.object({
      creatorId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { creatorId } = input;

      if (creatorId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot subscribe to yourself" });
      }

      const [createdSubscription] = await db
        .insert(subscriptions)
        .values({
          viewerId: ctx.user.id,
          creatorId,
        })
        .returning();

      return createdSubscription;
    }),
  unsubscribe: protectedProcedure
    .input(z.object({
      creatorId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { creatorId } = input;
      const { id: userId } = ctx.user;

      if (creatorId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot unsubscribe from yourself" });
      }

      const [deletedSubscription] = await db
        .delete(subscriptions)
        .where(and(
          eq(subscriptions.viewerId, userId),
          eq(subscriptions.creatorId, creatorId),
        ))
        .returning();

      return deletedSubscription;
    }),
});
