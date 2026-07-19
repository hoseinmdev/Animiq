// Nekos API's own `rating=safe` filter is unreliable in practice — testing
// turned up images tagged "exposed_girl_breasts" classified as safe. This
// blocklist is a second, client-side gate on top of the API's rating param.
// It's defense-in-depth, not an exhaustive content classifier.
const UNSAFE_TAGS = new Set([
  "exposed_anus",
  "exposed_penis",
  "exposed_pussy",
  "exposed_breasts",
  "exposed_girl_breasts",
  "exposed_nipples",
  "nipples",
  "pussy",
  "dick",
  "penis",
  "testicles",
  "sex",
  "cum",
  "ejaculation",
  "anal",
  "pubic_hair",
]);

export function isImageSafe(tags: string[]): boolean {
  return tags.every((tag) => !UNSAFE_TAGS.has(tag.toLowerCase()));
}
