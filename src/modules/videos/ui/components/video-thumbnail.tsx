import { formatDuration } from "@/lib/utils"
import Image from "next/image"

interface VideoThumbnailProps {
  title: string
  imageUrl?: string | null
  previewUrl?: string | null
  duration: number
}

export const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) => {
  return (
    // Thumbnail wrapper
    <div className="relative group">
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          unoptimized={!!previewUrl}
          src={imageUrl ?? "/placeholder.svg"}
          alt={title}
          fill
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          unoptimized={!!previewUrl}
          src={previewUrl ?? "/placeholder.svg"}
          alt={title}
          fill
          className="size-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>
      {/* // Video duration box */}
      <div className="absolute bottom-2 right-2 px-1 py-0.5 bg-black/80 text-white text-xs font-medium">
        {formatDuration(duration)}
      </div>

    </div>
  )
}
