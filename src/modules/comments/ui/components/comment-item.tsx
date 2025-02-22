import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { CommentGetManyOutput } from "@/modules/comments/type";
import { trpc } from "@/trpc/client";
import { formatDistanceToNow } from "date-fns";
import { MessageSquareIcon, MoreVerticalIcon, ThumbsDownIcon, ThumbsUpIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
interface CommentItemProps {
  comment: CommentGetManyOutput["items"][number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const { userId } = useAuth();
  const clerk = useClerk();
  const utils = trpc.useUtils();
  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success("Comment deleted");
      utils.comments.getMany.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to delete comment");

      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const like = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to like comment");

      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to dislike comment");

      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar
            size="lg"
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/users/${comment.userId}`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-medium pb-0.5">
                {comment.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.value}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Button
                disabled={like.isPending}
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => like.mutate({ commentId: comment.id })}
              >
                <ThumbsUpIcon
                  className={cn(
                    comment.viewerReaction === "like" && "fill-black",
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.likeCount}
              </span>
              <Button
                disabled={dislike.isPending}
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => dislike.mutate({ commentId: comment.id })}
              >
                <ThumbsDownIcon
                  className={cn(
                    comment.viewerReaction === "dislike" && "fill-black",
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.dislikeCount}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              <MessageSquareIcon className="size-4"/>
              Reply
            </DropdownMenuItem>
            {comment.user.clerkId === userId && (
              <DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })}>
                <TrashIcon className="size-4"/>
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
