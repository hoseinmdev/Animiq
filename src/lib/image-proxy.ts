// Only ever proxy the CDNs our own gallery images actually come from —
// otherwise this route would be an open proxy for arbitrary URLs.
const ALLOWED_IMAGE_HOSTS = new Set(["cdn.nekosapi.com", "safebooru.org"]);

export function resolveProxyableImageUrl(rawUrl: string | null): URL | null {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") return null;
    if (!ALLOWED_IMAGE_HOSTS.has(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}
