import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() ?? "";

export const SENTRY_ENABLED = dsn !== "";

const SENSITIVE_KEYS = [
  "access_token",
  "refresh_token",
  "authorization",
  "idempotency-key",
  "cardnumber",
  "cvc",
  "expiry",
  "nin",
  "password",
  "storagepath",
  "secure_url",
];

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return SENSITIVE_KEYS.some((needle) => lower.includes(needle));
}

export function scrub(value: unknown, depth = 0): unknown {
  if (depth > 4 || value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => scrub(entry, depth + 1));
  }
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) =>
      isSensitiveKey(key)
        ? [key, "[redacted]"]
        : [key, scrub(entry, depth + 1)],
    ),
  );
}

export function initSentry(): void {
  if (!SENTRY_ENABLED) {
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    tracesSampleRate: 0,
    beforeSend(event) {
      if (event.request?.headers !== undefined) {
        event.request.headers = scrub(event.request.headers) as Record<
          string,
          string
        >;
      }
      if (event.request?.data !== undefined) {
        event.request.data = scrub(event.request.data);
      }
      if (event.extra !== undefined) {
        event.extra = scrub(event.extra) as Record<string, unknown>;
      }
      return event;
    },
  });
}

export interface CaptureContext {
  requestId?: string | null;
  code?: string | null;
  scope?: string;
}

export function captureError(
  error: unknown,
  context: CaptureContext = {},
): void {
  if (!SENTRY_ENABLED) {
    return;
  }

  Sentry.withScope((scope) => {
    if (context.requestId !== undefined && context.requestId !== null) {
      scope.setTag("api.requestId", context.requestId);
    }
    if (context.code !== undefined && context.code !== null) {
      scope.setTag("api.errorCode", context.code);
    }
    if (context.scope !== undefined) {
      scope.setTag("vemra.scope", context.scope);
    }
    Sentry.captureException(error);
  });
}
