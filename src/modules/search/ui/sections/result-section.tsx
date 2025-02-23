"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { VideoGridCard } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";

interface ResultSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const ResultSection = ({
  query,
  categoryId,
}: ResultSectionProps) => {
  const isMobile = useIsMobile();
  const [results, reslutQuery] = trpc.search.getMany.useSuspenseInfiniteQuery({
    query,
    categoryId,
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {results.pages
          .flatMap((page) => page.items)
          .map((item) => (
            <VideoGridCard
              key={item.id}
              video={item}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.pages
          .flatMap((page) => page.items)
          .map((item) => (
            <VideoRowCard
              key={item.id}
              video={item}
            />
          ))}
        </div>
      )}
      <InfiniteScroll
        fetchNextPage={reslutQuery.fetchNextPage}
        hasNextPage={reslutQuery.hasNextPage}
        isFetchingNextPage={reslutQuery.isFetchingNextPage}
      />
    </>
  )
}
