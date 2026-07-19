const toBase64 = (input: string) =>
  typeof window === "undefined"
    ? Buffer.from(input).toString("base64")
    : window.btoa(input);

const svgDataUri = (svg: string) => `data:image/svg+xml;base64,${toBase64(svg)}`;

// Safebooru gives us no color data, so this pastel shimmer is the fallback
// blur target when there's nothing better to use.
export function shimmerPlaceholder(width = 400, height = 600) {
  return svgDataUri(`
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="oklch(0.93 0.02 320)" />
  <rect width="${width}" height="${height}" fill="oklch(0.97 0.01 320)" opacity="0.6" />
</svg>`);
}

// Nekos images ship a real dominant color, which makes a much more honest
// blur-up target than a generic shimmer.
export function colorPlaceholder(hex: string, width = 400, height = 600) {
  return svgDataUri(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="${hex}" /></svg>`,
  );
}
