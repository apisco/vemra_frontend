import "server-only";

import {
  apiErrorMessage,
  errorRequestId,
  isApiError,
  isTimeout,
} from "@/lib/api/errors";

export function isRecoverableReadError(error: unknown): boolean {
  if (!isApiError(error)) {
    return false;
  }
  if (error.kind === "network" || error.kind === "timeout") {
    return true;
  }
  return typeof error.status === "number" && error.status >= 500;
}

function describe(label: string, error: unknown): string {
  const requestId = errorRequestId(error);
  const message = error instanceof Error ? error.message : String(error);
  return requestId === null
    ? `[api] ${label}: ${message}`
    : `[api] ${label}: ${message} (requestId=${requestId})`;
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
      console.warn(`${describe(label, error)}; serving fallback`);
      return fallback;
    }
    throw error;
  }
}

export interface ReadFailure {
  ok: false;
  message: string;
  requestId: string | null;
  isWaking: boolean;
}

export type ReadResult<T> = { ok: true; data: T } | ReadFailure;

export async function safeRead<T>(
  label: string,
  run: () => Promise<T>,
): Promise<ReadResult<T>> {
  try {
    return { ok: true, data: await run() };
  } catch (error) {
    console.warn(describe(label, error));
    return {
      ok: false,
      message: apiErrorMessage(error),
      requestId: errorRequestId(error),
      isWaking: isTimeout(error),
    };
  }
}

export function readOrNull<T>(result: ReadResult<T>): T | null {
  return result.ok ? result.data : null;
}
