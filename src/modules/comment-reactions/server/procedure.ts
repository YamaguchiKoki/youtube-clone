import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";


export const commentReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({
      commentId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;

      const [existingReactionLike] = await db
        .select()
        .from(commentReactions)
        .where(and(
          eq(commentReactions.commentId, commentId),
          eq(commentReactions.userId, userId),
          eq(commentReactions.type, "like"),
        ));

      if (existingReactionLike) {
        const deleted = await db
          .delete(commentReactions)
          .where(and(
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.userId, userId),
          ))
          .returning();

        return deleted;
      }

      const [createdCommentReaction] = await db
        .insert(commentReactions)
        .values({
          commentId,
          userId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [commentReactions.commentId, commentReactions.userId],
          set: {
            type: "like",
          },
        })
        .returning();

      return createdCommentReaction;
    }),
  dislike: protectedProcedure
    .input(z.object({
      commentId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;

      const [existingReactionDislike] = await db
        .select()
        .from(commentReactions)
        .where(and(
          eq(commentReactions.commentId, commentId),
          eq(commentReactions.userId, userId),
          eq(commentReactions.type, "dislike"),
        ));

      if (existingReactionDislike) {
        const deleted = await db
          .delete(commentReactions)
          .where(and(
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.userId, userId),
          ))
          .returning();

        return deleted;
      }

      const [createdCommentReaction] = await db
        .insert(commentReactions)
        .values({
          commentId,
          userId,
          type: "dislike",
        })
        .onConflictDoUpdate({
          target: [commentReactions.commentId, commentReactions.userId],
          set: {
            type: "dislike",
          },
        })
        .returning();

      return createdCommentReaction;
    }),
});
