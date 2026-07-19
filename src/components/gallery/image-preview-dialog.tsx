"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useImageInfo } from "@/hooks/use-image-info";
import { useImageDownload } from "@/hooks/use-image-download";
import { formatBytes, getQualityLabel } from "@/lib/format";
import type { GalleryImage } from "@/types/gallery";

interface ImagePreviewDialogProps {
  image: GalleryImage | null;
  onOpenChange: (open: boolean) => void;
}

export function ImagePreviewDialog({ image, onOpenChange }: ImagePreviewDialogProps) {
  // Nekos never gives us dimensions up front — fall back to whatever the
  // browser measures once the full-size image actually loads.
  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const { data: info, isLoading: isLoadingInfo } = useImageInfo(image?.imageUrl ?? null);
  const { download, isDownloading } = useImageDownload();

  const width = image?.width ?? naturalSize?.width ?? null;
  const height = image?.height ?? naturalSize?.height ?? null;
  const label = image?.artist ?? image?.tags[0]?.replaceAll("_", " ") ?? "anime art";

  return (
    <Dialog
      open={Boolean(image)}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setNaturalSize(null);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="capitalize">{label}</DialogTitle>
        </DialogHeader>

        {image && (
          <>
            <div className="relative max-h-[60vh] w-full overflow-hidden rounded-xl bg-muted">
              <Image
                src={image.imageUrl}
                alt={label}
                width={image.width ?? 800}
                height={image.height ?? 1200}
                className="max-h-[60vh] w-full object-contain"
                onLoad={(event) => {
                  if (image.width && image.height) return;
                  const target = event.currentTarget;
                  setNaturalSize({
                    width: target.naturalWidth,
                    height: target.naturalHeight,
                  });
                }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {width && height ? `${width} × ${height} px` : "Measuring..."}
              </Badge>
              <Badge variant="secondary">{getQualityLabel(width, height)}</Badge>
              <Badge variant="secondary">
                {isLoadingInfo ? "Calculating size..." : formatBytes(info?.bytes ?? null)}
              </Badge>
            </div>

            <Button
              onClick={() => download(image.imageUrl)}
              disabled={isDownloading}
              className="w-full rounded-full"
            >
              {isDownloading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Download
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
