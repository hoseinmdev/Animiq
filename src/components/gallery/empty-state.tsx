import { GhostIcon } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
      <GhostIcon className="size-8 text-muted-foreground" />
      <p className="font-heading text-xl text-foreground">No art found</p>
      <p className="text-sm text-muted-foreground">
        Try a different character or series name.
      </p>
    </div>
  );
}
