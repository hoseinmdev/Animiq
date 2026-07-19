import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchDiscoveryBatch } from "@/services/nekos-service";
import { retryDelay, retryOnServerError } from "@/lib/query-retry";
import type { GalleryImage } from "@/types/gallery";

export function useDiscoveryFeed(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["discovery-feed"],
    queryFn: ({ signal }) => fetchDiscoveryBatch(signal),
    initialPageParam: 0,
    // No real cursor exists — every batch is a fresh random draw, so more
    // pages are always available until the user stops scrolling.
    getNextPageParam: (_lastPage, allPages) => allPages.length,
    staleTime: 60_000,
    retry: retryOnServerError,
    retryDelay,
    enabled,
    // Random batches can overlap; dedupe here so the render layer never has
    // to know that's a quirk of this particular source.
    select: (data) => {
      const seen = new Set<string>();
      const images: GalleryImage[] = [];
      for (const image of data.pages.flat()) {
        if (seen.has(image.id)) continue;
        seen.add(image.id);
        images.push(image);
      }
      return images;
    },
  });
}
