import { ApiError } from "./api-error";

const MAX_RETRIES = 3;

// Free public APIs throw transient 502/504s under load; a 4xx means the
// request itself was wrong, so retrying it would just fail the same way.
export function retryOnServerError(failureCount: number, error: unknown) {
  if (error instanceof ApiError && error.status < 500) return false;
  return failureCount < MAX_RETRIES;
}

export function retryDelay(attemptIndex: number) {
  return Math.min(1000 * 2 ** attemptIndex, 8000);
}
