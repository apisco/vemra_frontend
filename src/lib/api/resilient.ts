import "server-only";

import { isApiError, isNotFound } from "@/lib/api/errors";

/**
 * A dashboard read is *recoverable* when the endpoint is absent (`404`) or the
 * backend is unreachable (`network`/`timeout`) — the same conditions the public
 * marketing reads tolerate (see `resources/public.ts`). Real faults (auth,
 * `5xx`, validation) still surface to `error.tsx` rather than being hidden.
 */
export function isRecoverableReadError(error: unknown): boolean {
  return (
    isNotFound(error) ||
    (isApiError(error) &&
      (error.kind === "network" || error.kind === "timeout"))
  );
}

/**
 * Runs a read and degrades to a designed empty state when the endpoint is
 * missing or unreachable, so a not-yet-implemented backend renders an empty
 * dashboard instead of failing the Server Component render.
 */
export async function recoverableRead<T>(
  label: string,
  run: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await run();
  } catch (error) {
    if (isRecoverableReadError(error)) {
      console.warn(
        `[api] ${label} unavailable; serving fallback: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return fallback;
    }
    throw error;
  }
}
