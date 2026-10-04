import { apiErrorMessage, isApiError } from "@/lib/api/errors";

export type ActionFailure = {
  ok: false;
  message: string;
  fieldErrors?: Readonly<Record<string, string>>;
};

export type ActionResult<T> = { ok: true; data: T } | ActionFailure;

/**
 * Converts any thrown value into a serializable failure for a form.
 *
 * Per-field messages come from `ApiError.fieldErrors`, which the HTTP layer
 * already derives from the backend envelope (`details: [{ field, reason }]`),
 * so there is a single parser for the error contract.
 */
export function toActionFailure(error: unknown): ActionFailure {
  const fieldErrors = isApiError(error) ? error.fieldErrors : null;

  return {
    ok: false,
    message: apiErrorMessage(error),
    ...(fieldErrors === null ? {} : { fieldErrors }),
  };
}
