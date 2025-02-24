"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { VideoGridCard } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { ErrorBoundary } from "react-error-boundary";

interface ResultSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const ResultSection = ({
  query,
  categoryId,
}: ResultSectionProps) => {
  return (
    <Suspense
      key={`${query}-${categoryId}`}
      fallback={<ResultSectionSkeleton />}
    >
      <ErrorBoundary fallback={<ResultSectionSkeleton />}>
        <ResultSectionSuspense query={query} categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const ResultSectionSuspense = ({
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

export const ResultSectionSkeleton = () => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      isMobile
        ? "flex flex-col gap-4 gap-y-10"
        : "flex flex-col gap-4"
    )}>
      {Array.from({ length: 10 }).map((_, index) => (
        isMobile ? (
          <VideoGridCardSkeleton key={index} />
        ) : (
          <VideoRowCardSkeleton key={index} />
        )
      ))}
    </div>
  )
}
