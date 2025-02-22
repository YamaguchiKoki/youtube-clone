import { DEFAULT_LIMIT } from "@/constants";
import { CommentItem } from "@/modules/comments/ui/components/comment-item";
import { trpc } from "@/trpc/client";
import { CornerDownRightIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentRepliesProps {
  videoId: string;
  parentId: string;
}

export const CommentReplies = ({
  videoId,
  parentId,
}: CommentRepliesProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.comments.getMany.useInfiniteQuery(
      {
        videoId,
        parentId,
        limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <div className="pl-14">
      <div className="flex flex-col gap-4 mt-2">
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          data?.pages.flatMap((page) => page.items).map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              variant="reply"
            />
          ))
        }
      </div>
      {hasNextPage && (
        <Button
          variant="tertiary"
          size="sm"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          <CornerDownRightIcon />
          Show more replies
        </Button>
      )}
    </div>
  );
};
