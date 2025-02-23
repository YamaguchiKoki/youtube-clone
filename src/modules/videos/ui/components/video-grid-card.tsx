import { VideoGetManyOutput } from "@/modules/videos/type";
import { VideoInfo } from "@/modules/videos/ui/components/video-info";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import Link from "next/link";

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
