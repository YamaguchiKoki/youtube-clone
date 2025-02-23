import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { VideoGetManyOutput } from "@/modules/videos/type";
import { VideoMenu } from "@/modules/videos/ui/components/video-menu";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { useMemo } from "react";

const videoRowCardVariants = cva("group flex min-w-0", {
  variants: {
    size: {
      default: "gap-4",
      compact: "gap-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const thumbnailVariants = cva("relative flex-none", {
  variants: {
    size: {
      default: "w-[38%]",
      compact: "w-[168px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
  video: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoRowCardSkelton = () => {
  return (
    <div>
      <Skeleton />
    </div>
  )
}

export const VideoRowCard = ({ video, size, onRemove }: VideoRowCardProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(video.viewCount);
  }, [video.viewCount]);

  const compactLikes = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(video.likeCount);
  }, [video.likeCount]);

  return (
    <div className={cn(videoRowCardVariants({ size }))}>
      <Link href={`/videos/${video.id}`} className={thumbnailVariants({ size })}>
        <VideoThumbnail
          title={video.title}
          imageUrl={video.thumbnailUrl}
          previewUrl={video.previewUrl}
          duration={video.duration ?? 0}
        />
      </Link>
      {/* INFO */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-x-2">
          <Link href={`/videos/${video.id}`} className="flex-1 min-w-0">
            <h3
              className={cn(
                "line-clamp-2 font-medium",
                size === "compact" ? "text-sm" : "text-base"
              )}
            >
              {video.title}
            </h3>
            {size === "default" && (
              <p className="mt-1 text-sm text-muted-foreground">
                {compactViews} views ・ {compactLikes} likes
              </p>
            )}
            {size === "default" && (
              <>
                <div className="flex items-center gap-2 my-3">
                  <UserAvatar
                    imageUrl={video.user.imageUrl}
                    name={video.user.name}
                    size="sm"
                  />
                  <UserInfo
                    name={video.user.name}
                    size="sm"
                  />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="w-fit text-xs line-clamp-2">
                      {video.description ?? "No description"}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="bg-black/70"
                  >
                    <p>
                      From the video description
                    </p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            {size === "compact" && (
              <UserInfo
                name={video.user.name}
                size="sm"
              />
            )}
            {size === "compact" && (
              <p className="text-xs text-muted-foreground mt-1">
                {compactViews} views ・ {compactLikes} likes
              </p>
            )}
          </Link>
          <div className="flex-none">
            <VideoMenu
              videoId={video.id}
              onRemove={onRemove}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
