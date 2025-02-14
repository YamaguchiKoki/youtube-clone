import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
export default async function Home() {
  // サーバーコンポーネントでprefetchを行う→クライアントコンポーネントでuseSuspenseQueryを使う
  void trpc.hello.prefetch({ text: 'client' });

  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary fallback={<div>Error</div>}>
          <p>
          </p>
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
