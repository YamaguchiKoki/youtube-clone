"use client";

import { trpc } from "@/trpc/client";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CommentItem } from "@/modules/comments/ui/components/comment-item";

interface CommentsSectionProps {
  videoId: string;
}

const CommentsSectionSkelton = () => {
  return (
    <div>
      <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md" />
    </div>
  )
}

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  return (
    <Suspense fallback={<CommentsSectionSkelton />}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  )
}

export const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {
  const [ comments ] = trpc.comments.getMany.useSuspenseQuery({ videoId: videoId });
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1>
          0 comments
        </h1>
        <CommentForm videoId={videoId} />
        <div className="flex flex-col gap-4 mt-2">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  )
}
