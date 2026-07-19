import { NextResponse, type NextRequest } from "next/server";
import { SAFEBOORU_RESULTS_PER_PAGE } from "@/lib/api-paths";
import type { GalleryImage } from "@/types/gallery";

const SAFEBOORU_URL = "https://safebooru.org/index.php";

interface SafebooruPostDto {
  id: number;
  file_url: string;
  sample_url: string;
  sample: boolean;
  width: number;
  height: number;
  sample_width: number;
  sample_height: number;
  tags: string;
}

// Booru tags are space-separated, snake_case, single words — "Gojo Satoru"
// has to become "gojo_satoru" or the query matches nothing.
function toBooruTag(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, "_");
}

function normalize(dto: SafebooruPostDto): GalleryImage {
  const usingSample = dto.sample && dto.sample_width > 0;

  return {
    id: `safebooru-${dto.id}`,
    source: "safebooru",
    imageUrl: dto.sample_url || dto.file_url,
    width: usingSample ? dto.sample_width : dto.width,
    height: usingSample ? dto.sample_height : dto.height,
    tags: dto.tags.split(" ").filter(Boolean),
    artist: null,
    sourceUrl: `https://safebooru.org/index.php?page=post&s=view&id=${dto.id}`,
    dominantColor: null,
  };
}

// Safebooru sends no CORS headers either, so this proxies it server-side
// the same way /api/discovery proxies Nekos.
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const page = request.nextUrl.searchParams.get("page") ?? "0";

  const params = new URLSearchParams({
    page: "dapi",
    s: "post",
    q: "index",
    json: "1",
    // rating:safe is redundant on a site that's safe-for-work site-wide, but
    // cheap defense-in-depth against any mislabeled or future content.
    tags: `${toBooruTag(query)} rating:safe`,
    limit: String(SAFEBOORU_RESULTS_PER_PAGE),
    pid: page,
  });

  const response = await fetch(`${SAFEBOORU_URL}?${params}`, { cache: "no-store" });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Safebooru request failed" },
      { status: response.status },
    );
  }

  // Safebooru returns an empty body (not "[]") when a query has zero results.
  const body = await response.text();
  const posts: SafebooruPostDto[] = body ? JSON.parse(body) : [];

  return NextResponse.json(posts.map(normalize));
}
