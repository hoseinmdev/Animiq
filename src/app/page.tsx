"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SearchBar } from "@/components/search/search-bar";
import { MasonryGrid } from "@/components/gallery/masonry-grid";
import { ImagePreviewDialog } from "@/components/gallery/image-preview-dialog";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useDiscoveryFeed } from "@/hooks/use-discovery-feed";
import { useCharacterSearch } from "@/hooks/use-character-search";
import { fadeUp } from "@/config/motion-variants";
import type { GalleryImage } from "@/types/gallery";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const debouncedQuery = useDebouncedValue(query);
  const isSearching = debouncedQuery.trim().length > 0;

  const discovery = useDiscoveryFeed(!isSearching);
  const search = useCharacterSearch(debouncedQuery, isSearching);
  const searchResults = useMemo(() => search.data?.pages.flat() ?? [], [search.data]);

  const active = isSearching
    ? {
        items: searchResults,
        isLoading: search.isLoading,
        isError: search.isError,
        isFetchingNextPage: search.isFetchingNextPage,
        hasNextPage: Boolean(search.hasNextPage),
        onLoadMore: () => search.fetchNextPage(),
        onRetry: () => search.refetch(),
      }
    : {
        items: discovery.data ?? [],
        isLoading: discovery.isLoading,
        isError: discovery.isError,
        isFetchingNextPage: discovery.isFetchingNextPage,
        hasNextPage: Boolean(discovery.hasNextPage),
        onLoadMore: () => discovery.fetchNextPage(),
        onRetry: () => discovery.refetch(),
      };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <SearchBar value={query} onChange={setQuery} />
          <p className="text-sm text-muted-foreground">
            {isSearching ? `Results for "${debouncedQuery}"` : "Fresh picks for you"}
          </p>
        </div>

        <div className="mt-8">
          {/* Key is stable across queries within a mode, so retyping a search
              refreshes results in place instead of replaying the transition
              on every keystroke — only switching modes crossfades. */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isSearching ? "search" : "discovery"}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <MasonryGrid {...active} onSelectImage={setSelectedImage} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <SiteFooter />

      <ImagePreviewDialog
        image={selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      />
    </>
  );
}
