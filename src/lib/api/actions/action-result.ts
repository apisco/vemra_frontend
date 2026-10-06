import { apiErrorMessage, isApiError } from "@/lib/api/errors";

export type ActionFailure = {
  ok: false;
  message: string;
  fieldErrors?: Readonly<Record<string, string>>;
};

export type ActionResult<T> = { ok: true; data: T } | ActionFailure;


export function toActionFailure(error: unknown): ActionFailure {
  const fieldErrors = isApiError(error) ? error.fieldErrors : null;

  return {
    ok: false,
    message: apiErrorMessage(error),
    ...(fieldErrors === null ? {} : { fieldErrors }),
  };
}
