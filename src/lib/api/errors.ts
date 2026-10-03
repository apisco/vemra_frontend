export type ApiErrorKind = "network" | "timeout" | "http" | "parse";

export interface ApiErrorInit {
  kind: ApiErrorKind;
  message: string;
  status?: number | null;
  code?: string | null;
  fieldErrors?: Readonly<Record<string, string>> | null;
  details?: unknown;
  requestId?: string | null;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly code: string | null;
  readonly fieldErrors: Readonly<Record<string, string>> | null;
  readonly details: unknown;
  readonly requestId: string | null;

  constructor({
    kind,
    message,
    status = null,
    code = null,
    fieldErrors = null,
    details = undefined,
    requestId = null,
    cause,
  }: ApiErrorInit) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.details = details;
    this.requestId = requestId;
  }

  get isRetryable(): boolean {
    if (this.kind === "network" || this.kind === "timeout") {
      return true;
    }
    if (this.status === null) {
      return false;
    }
    return this.status === 429 || this.status >= 500;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isUnauthorized(error: unknown): boolean {
  return isApiError(error) && error.status === 401;
}

export function isForbidden(error: unknown): boolean {
  return isApiError(error) && error.status === 403;
}

export function isNotFound(error: unknown): boolean {
  return isApiError(error) && error.status === 404;
}

export function isValidationError(error: unknown): boolean {
  return isApiError(error) && (error.status === 400 || error.status === 422);
}

export function apiErrorMessage(error: unknown): string {
  if (!isApiError(error)) {
    return "Something went wrong. Please try again.";
  }

  switch (error.kind) {
    case "timeout":
      return "The request took too long. Check your connection and try again.";
    case "network":
      return "Could not reach Vemra. Check your connection and try again.";
    case "parse":
      return "Vemra sent an unexpected response. Please try again.";
    case "http":
      break;
  }

  if (error.status === 401) {
    return "Your session has expired. Please log in again.";
  }
  if (error.status === 403) {
    return "You do not have access to this.";
  }
  if (error.status === 404) {
    return "We could not find what you were looking for.";
  }
  if (error.status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (error.status !== null && error.status >= 500) {
    return "Vemra is having trouble right now. Please try again shortly.";
  }

  return error.message;
}
