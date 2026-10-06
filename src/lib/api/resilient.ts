import "server-only";

import { isApiError, isNotFound } from "@/lib/api/errors";


export function isRecoverableReadError(error: unknown): boolean {
  return (
    isNotFound(error) ||
    (isApiError(error) &&
      (error.kind === "network" || error.kind === "timeout"))
  );
}


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
