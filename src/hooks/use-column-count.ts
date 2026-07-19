import { useEffect, useState } from "react";

// Mirrors the sm/lg/xl breakpoints the grid used to express as
// `columns-1 sm:columns-2 lg:columns-3 xl:columns-4` in Tailwind.
const BREAKPOINTS: [query: string, columns: number][] = [
  ["(min-width: 1280px)", 4],
  ["(min-width: 1024px)", 3],
  ["(min-width: 640px)", 2],
];

export function useColumnCount() {
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const queries = BREAKPOINTS.map(
      ([query, count]) => [window.matchMedia(query), count] as const,
    );

    function update() {
      const match = queries.find(([mql]) => mql.matches);
      setColumns(match ? match[1] : 1);
    }

    update();
    queries.forEach(([mql]) => mql.addEventListener("change", update));
    return () => queries.forEach(([mql]) => mql.removeEventListener("change", update));
  }, []);

  return columns;
}
