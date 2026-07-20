import Image from "next/image";

export function SiteBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <Image
        src="/bg-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Poster reads best against the dark palette; light mode keeps it as a faint wash so pastel surfaces stay legible. */}
      <div className="absolute inset-0 bg-background/95 dark:bg-background/70" />
    </div>
  );
}
