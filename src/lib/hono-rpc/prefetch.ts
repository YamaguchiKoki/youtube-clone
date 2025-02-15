import { cache } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { hc } from './client'; // Hono RPCのクライアントをインポート

const queryClient = new QueryClient();

export const prefetch = cache(async <T>(
  endpoint: keyof typeof hc,
  params?: Parameters<(typeof hc)[typeof endpoint]>[0]
) => {
  await queryClient.prefetchQuery({
    queryKey: [endpoint, params],
    queryFn: () => hc[endpoint](params)
  });
  return queryClient.getQueryData<T>([endpoint, params]);
});
