'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { hc } from './client';

export function usePrefetchedQuery<T>(
  endpoint: keyof typeof hc,
  params?: Parameters<(typeof hc)[typeof endpoint]>[0]
) {
  return useSuspenseQuery({
    queryKey: [endpoint, params],
    queryFn: () => hc[endpoint](params)
  });
}
