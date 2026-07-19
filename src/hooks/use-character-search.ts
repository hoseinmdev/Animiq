import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCharacterSearch } from "@/services/safebooru-service";
import { retryDelay, retryOnServerError } from "@/lib/query-retry";
import { SAFEBOORU_RESULTS_PER_PAGE } from "@/lib/api-paths";

export function useCharacterSearch(query: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["character-search", query],
    queryFn: ({ pageParam, signal }) => fetchCharacterSearch(query, pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length === SAFEBOORU_RESULTS_PER_PAGE ? lastPageParam + 1 : undefined,
    staleTime: 60_000,
    retry: retryOnServerError,
    retryDelay,
    enabled,
  });
}
