export type GallerySource = "nekos" | "safebooru";

// Both APIs return wildly different shapes; every component above the
// service layer only ever sees this one, so the UI never has to branch
// on which API an image came from.
export interface GalleryImage {
  id: string;
  source: GallerySource;
  imageUrl: string;
  width: number | null;
  height: number | null;
  tags: string[];
  artist: string | null;
  sourceUrl: string | null;
  dominantColor: string | null;
}
