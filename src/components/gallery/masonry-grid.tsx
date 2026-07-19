"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { galleryCard, staggerChildren } from "@/config/motion-variants";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useColumnCount } from "@/hooks/use-column-count";
import { GalleryCard } from "./gallery-card";
import { GallerySkeleton } from "./gallery-skeleton";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import type { GalleryImage } from "@/types/gallery";

interface MasonryGridProps {
  items: GalleryImage[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
  onSelectImage: (image: GalleryImage) => void;
}

// CSS `columns-*` rebalances every column whenever the child count changes,
// which visibly reshuffles already-loaded images each time infinite scroll
// appends a new batch. Splitting into fixed columns by index (item i always
// lands in column i % columnCount) keeps earlier images pinned in place —
// new items only ever append to the end of a column.
function splitIntoColumns(items: GalleryImage[], columnCount: number): GalleryImage[][] {
  const columns: GalleryImage[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => columns[index % columnCount].push(item));
  return columns;
}

export function MasonryGrid({
  items,
  isLoading,
  isError,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  onRetry,
  onSelectImage,
}: MasonryGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver(sentinelRef, onLoadMore, hasNextPage && !isLoading && !isError);

  const columnCount = useColumnCount();
  const columns = useMemo(
    () => splitIntoColumns(items, columnCount),
    [items, columnCount],
  );

  if (isLoading) return <GallerySkeleton />;
  if (isError && !items.length) return <ErrorState onRetry={onRetry} />;
  if (!items.length) return <EmptyState />;

  return (
    <div>
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="flex gap-4"
      >
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-1 flex-col gap-4">
            {column.map((image) => (
              <motion.div key={image.id} variants={galleryCard}>
                <GalleryCard image={image} onSelect={() => onSelectImage(image)} />
              </motion.div>
            ))}
          </div>
        ))}
      </motion.div>

      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && <GallerySkeleton count={4} />}
      {isError && !isFetchingNextPage && <ErrorState onRetry={onRetry} />}
    </div>
  );
}
