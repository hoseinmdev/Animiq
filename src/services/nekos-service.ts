import { apiPaths } from "@/lib/api-paths";
import { ApiError } from "@/lib/api-error";
import type { GalleryImage } from "@/types/gallery";

// Nekos has no offset/cursor pagination — every call is a fresh random
// batch, so "loading more" just means calling this again and letting the
// caller dedupe against what it already has.
export async function fetchDiscoveryBatch(signal?: AbortSignal): Promise<GalleryImage[]> {
  const response = await fetch(apiPaths.discoveryFeed, { signal });

  if (!response.ok) {
    throw new ApiError(
      `Discovery feed request failed with status ${response.status}`,
      response.status,
    );
  }

  return response.json();
}
