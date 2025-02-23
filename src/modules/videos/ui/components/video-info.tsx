import { UserAvatar } from "@/components/user-avatar";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { VideoGetManyOutput } from "@/modules/videos/type";
import { VideoMenu } from "@/modules/videos/ui/components/video-menu";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";

interface VideoInfoProps {
  video: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoInfo = ({
  video,
  onRemove,
}: VideoInfoProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(video.viewCount);
  }, [video.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(video.createdAt, {
      addSuffix: true,
    });
  }, [video.createdAt]);

  return (
    <div className="flex gap-3">
      <Link href={`/users/${video.user.id}`}>
        <UserAvatar
          name={video.user.name}
          imageUrl={video.user.imageUrl}
          size="sm"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/videos/${video.id}`}>
          <h3 className="line-clamp-1 font-medium lg:line-clamp-2 text-base break-words">
            {video.title}
          </h3>
        </Link>
        <Link href={`/users/${video.user.id}`}>
          <UserInfo
            name={video.user.name}
            size="sm"
          />
        </Link>
        <Link href={`/videos/${video.id}`}>
          <p className="text-sm text-gray-600 line-clamp-1">
            {compactViews} views ・ {compactDate}
          </p>
        </Link>
      </div>
      <div className="flex-shrink-0">
        <VideoMenu
          videoId={video.id}
          onRemove={onRemove}
        />
      </div>
    </div>
  )
}
