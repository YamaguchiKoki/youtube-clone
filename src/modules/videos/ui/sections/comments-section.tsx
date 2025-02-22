"use client";

import { trpc } from "@/trpc/client";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CommentItem } from "@/modules/comments/ui/components/comment-item";
import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Loader2Icon } from "lucide-react";

interface CommentsSectionProps {
  videoId: string;
}

const CommentsSectionSkelton = () => {
  return (
    <div className="mt-6 flex justify-center items-center">
      <Loader2Icon className=" size-7 text-muted-foreground animate-spin" />
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
  const [ comments, query ] = trpc.comments.getMany.useSuspenseInfiniteQuery({
    videoId: videoId,
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">
          {comments.pages[0].total} comments
        </h1>
        <CommentForm videoId={videoId} />
        <div className="flex flex-col gap-4 mt-2">
          {comments.pages.flatMap((page) => page.items).map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          <InfiniteScroll
            isManual
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
          />
        </div>
      </div>
    </div>
  )
}
