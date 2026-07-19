import { ApiError } from "@/lib/api-error";

export interface ImageInfo {
  bytes: number | null;
  contentType: string | null;
}

function proxyUrl(imageUrl: string) {
  return `/api/download?url=${encodeURIComponent(imageUrl)}`;
}

export async function fetchImageInfo(
  imageUrl: string,
  signal?: AbortSignal,
): Promise<ImageInfo> {
  const response = await fetch(proxyUrl(imageUrl), { method: "HEAD", signal });

  if (!response.ok) {
    throw new ApiError(
      `Image info request failed with status ${response.status}`,
      response.status,
    );
  }

  const contentLength = response.headers.get("content-length");
  return {
    bytes: contentLength ? Number(contentLength) : null,
    contentType: response.headers.get("content-type"),
  };
}

export async function downloadImage(imageUrl: string): Promise<void> {
  const response = await fetch(proxyUrl(imageUrl));

  if (!response.ok) {
    throw new ApiError(
      `Image download failed with status ${response.status}`,
      response.status,
    );
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = imageUrl.split("/").pop() || "image";
  link.click();

  URL.revokeObjectURL(objectUrl);
}
