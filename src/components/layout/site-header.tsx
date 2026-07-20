import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 sm:px-6">
        <Sparkles className="size-5 text-primary" />
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-semibold text-primary">
            Anime Gallery
          </h1>
          <p className="text-sm text-muted-foreground">
            A cozy, pastel corner for browsing anime art.
          </p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
