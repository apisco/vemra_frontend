import {
  apiErrorMessage,
  errorCode,
  errorRequestId,
  isApiError,
} from "@/lib/api/errors";
import { captureError } from "@/lib/observability/sentry";

export type ActionFailure = {
  ok: false;
  message: string;
  requestId?: string | null;
  code?: string | null;
  fieldErrors?: Readonly<Record<string, string>>;
};

export type ActionResult<T> = { ok: true; data: T } | ActionFailure;

export function toActionFailure(error: unknown): ActionFailure {
  const fieldErrors = isApiError(error) ? error.fieldErrors : null;
  const requestId = errorRequestId(error);
  const code = errorCode(error);

  captureError(error, { requestId, code, scope: "server-action" });

  if (requestId !== null) {
    console.warn(`[action] failed (requestId=${requestId}, code=${code ?? "none"})`);
  }

  return {
    ok: false,
    message: apiErrorMessage(error),
    ...(requestId === null ? {} : { requestId }),
    ...(code === null ? {} : { code }),
    ...(fieldErrors === null ? {} : { fieldErrors }),
  };
}
