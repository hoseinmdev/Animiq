import { useQuery } from "@tanstack/react-query";
import { fetchImageInfo } from "@/services/image-service";
import { retryDelay, retryOnServerError } from "@/lib/query-retry";

export function useImageInfo(imageUrl: string | null) {
  return useQuery({
    queryKey: ["image-info", imageUrl],
    queryFn: ({ signal }) => fetchImageInfo(imageUrl as string, signal),
    enabled: Boolean(imageUrl),
    staleTime: Infinity, // a given image's size never changes
    retry: retryOnServerError,
    retryDelay,
  });
}
