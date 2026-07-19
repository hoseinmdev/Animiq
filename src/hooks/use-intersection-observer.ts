import { useEffect, type RefObject } from "react";

export function useIntersectionObserver(
  targetRef: RefObject<Element | null>,
  onIntersect: () => void,
  enabled = true,
) {
  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onIntersect(),
      { rootMargin: "400px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef, onIntersect, enabled]);
}
