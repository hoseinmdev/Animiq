import { useState } from "react";
import { toast } from "sonner";
import { downloadImage } from "@/services/image-service";

export function useImageDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  async function download(imageUrl: string) {
    setIsDownloading(true);
    try {
      await downloadImage(imageUrl);
      toast.success("Image downloaded");
    } catch {
      toast.error("Couldn't download image");
    } finally {
      setIsDownloading(false);
    }
  }

  return { download, isDownloading };
}
