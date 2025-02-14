import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;

  // サーバーコンポーネントでprefetchを行う→クライアントコンポーネントでuseSuspenseQueryを使う
  void trpc.categories.getMany.prefetch();

  // page.tsxではviewのみ呼び出す そのView内では単一のsectionのみ呼び出す。データフェッチはsectionで行う。そうすることで、独立したエラーバウンダリを作成可能
  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
};

export default Page;
