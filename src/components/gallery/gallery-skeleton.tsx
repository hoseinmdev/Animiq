import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Uneven heights so the loading state already reads as a masonry grid.
const TILE_HEIGHTS = ["h-64", "h-80", "h-56", "h-96", "h-72", "h-60"];

export function GallerySkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "mb-4 w-full break-inside-avoid rounded-2xl",
            TILE_HEIGHTS[index % TILE_HEIGHTS.length],
          )}
        />
      ))}
    </div>
  );
}
