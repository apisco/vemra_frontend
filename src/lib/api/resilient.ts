import "server-only";

import { isApiError, isNotFound } from "@/lib/api/errors";


export function isRecoverableReadError(error: unknown): boolean {
  if (isNotFound(error)) {
    return true;
  }
  if (!isApiError(error)) {
    return false;
  }
  if (error.kind === "network" || error.kind === "timeout") {
    return true;
  }
  return typeof error.status === "number" && error.status >= 500;
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
