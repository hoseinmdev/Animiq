import { CloudAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <CloudAlert className="size-8 text-destructive" />
      <p className="font-heading text-xl text-foreground">Couldn&apos;t load images</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        The image source is either rate-limiting us or timing out. It usually recovers in
        a few seconds.
      </p>
      <Button variant="outline" onClick={onRetry} className="rounded-full">
        Try again
      </Button>
    </div>
  );
}
