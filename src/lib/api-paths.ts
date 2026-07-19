export const DISCOVERY_BATCH_SIZE = 24;
export const SAFEBOORU_RESULTS_PER_PAGE = 24;

// Neither Nekos API nor Safebooru sends CORS headers, so the browser can't
// call them directly — these are same-origin routes that proxy them
// server-side, where CORS doesn't apply. See src/app/api/*/route.ts.
export const apiPaths = {
  discoveryFeed: "/api/discovery",
  characterSearch: "/api/search",
} as const;
