import { VideoGetManyOutput } from "@/modules/videos/type";
import { VideoInfo } from "@/modules/videos/ui/components/video-info";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoGridCardProps {
  video: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoGridCard = ({
  video,
  onRemove,
}: VideoGridCardProps) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <Link href={`/videos/${video.id}`}>
        <VideoThumbnail
          title={video.title}
          imageUrl={video.thumbnailUrl}
          previewUrl={video.previewUrl}
          duration={video.duration ?? 0}
        />
      </Link>
      <VideoInfo video={video} onRemove={onRemove} />
    </div>
  )
}

export const VideoGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full">
        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-10 rounded-full flex-none" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="flex-none">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}
