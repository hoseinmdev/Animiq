import { apiPaths } from "@/lib/api-paths";
import { ApiError } from "@/lib/api-error";
import type { GalleryImage } from "@/types/gallery";

export async function fetchCharacterSearch(
  query: string,
  page: number,
  signal?: AbortSignal,
): Promise<GalleryImage[]> {
  const params = new URLSearchParams({ q: query, page: String(page) });
  const response = await fetch(`${apiPaths.characterSearch}?${params}`, { signal });

  if (!response.ok) {
    throw new ApiError(
      `Character search request failed with status ${response.status}`,
      response.status,
    );
  }

  return response.json();
}
