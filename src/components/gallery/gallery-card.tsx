"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cardHover } from "@/config/motion-variants";
import { colorPlaceholder, shimmerPlaceholder } from "@/lib/image-placeholder";
import type { GalleryImage } from "@/types/gallery";

const FALLBACK_WIDTH = 400;
const FALLBACK_HEIGHT = 600;
const VISIBLE_TAGS = 3;

export function GalleryCard({
  image,
  onSelect,
}: {
  image: GalleryImage;
  onSelect: () => void;
}) {
  const blurDataURL = image.dominantColor
    ? colorPlaceholder(image.dominantColor)
    : shimmerPlaceholder();
  const label = image.artist ?? image.tags[0]?.replaceAll("_", " ") ?? "anime art";

  return (
    <motion.article
      initial="rest"
      animate="rest"
      whileHover="hover"
      variants={cardHover}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border"
    >
      <Image
        src={image.imageUrl}
        alt={label}
        width={image.width ?? FALLBACK_WIDTH}
        height={image.height ?? FALLBACK_HEIGHT}
        sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
        className="h-auto w-full object-cover"
        placeholder="blur"
        blurDataURL={blurDataURL}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="line-clamp-1 font-heading text-sm font-medium text-white capitalize">
          {label}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {image.tags.slice(0, VISIBLE_TAGS).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-white/40 text-white capitalize"
            >
              {tag.replaceAll("_", " ")}
            </Badge>
          ))}
        </div>
      </div>

      {image.sourceUrl && (
        <a
          href={image.sourceUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="View source"
          onClick={(event) => event.stopPropagation()}
          className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <ExternalLink className="size-3.5 text-white" />
        </a>
      )}
    </motion.article>
  );
}
