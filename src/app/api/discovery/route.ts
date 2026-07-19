import { NextResponse } from "next/server";
import { DISCOVERY_BATCH_SIZE } from "@/lib/api-paths";
import { isImageSafe } from "@/lib/content-safety";
import type { GalleryImage } from "@/types/gallery";

const NEKOS_RANDOM_URL = "https://api.nekosapi.com/v4/images/random";

interface NekosImageDto {
  id: number;
  url: string;
  color_dominant: [number, number, number] | null;
  artist_name: string | null;
  tags: string[];
  source_url: string | null;
}

function toHex([r, g, b]: [number, number, number]) {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function normalize(dto: NekosImageDto): GalleryImage {
  return {
    id: `nekos-${dto.id}`,
    source: "nekos",
    imageUrl: dto.url,
    width: null,
    height: null,
    tags: dto.tags,
    artist: dto.artist_name,
    sourceUrl: dto.source_url,
    dominantColor: dto.color_dominant ? toHex(dto.color_dominant) : null,
  };
}

// Nekos API sends no CORS headers, so the browser can't call it directly —
// this route fetches it server-side, where CORS doesn't apply.
export async function GET() {
  const params = new URLSearchParams({
    limit: String(DISCOVERY_BATCH_SIZE),
    rating: "safe",
  });

  const response = await fetch(`${NEKOS_RANDOM_URL}?${params}`, { cache: "no-store" });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Nekos API request failed" },
      { status: response.status },
    );
  }

  const items: NekosImageDto[] = await response.json();
  const images = items.map(normalize).filter((image) => isImageSafe(image.tags));

  return NextResponse.json(images);
}
