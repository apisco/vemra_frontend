/**
 * Transport configuration for the backend API.
 *
 * NOT DERIVED FROM FIGMA. Base URLs, timeouts, retry policy, header names and
 * the auth scheme have no design source — they are frontend/infra decisions.
 * Figma-derived material lives in `src/config/screen-contracts.ts`.
 *
 * There is deliberately no endpoint map here. Figma contains no URL paths or
 * HTTP verbs, so endpoint names can only come from a backend contract. Add
 * them when that contract exists, not before.
 *
 * `NEXT_PUBLIC_` values are inlined into the browser bundle at build time, so
 * they must be read statically — never `process.env[someVariable]`, which
 * Next.js cannot inline — and must never hold a secret. Server-only values
 * (service tokens, internal hostnames) stay unprefixed and belong in a
 * separate server-only module.
 */

const DEFAULT_BASE_URL = "http://localhost:8000";
const DEFAULT_PREFIX = "/api/v1";
const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_RETRY_ATTEMPTS = 1;
const DEFAULT_RETRY_DELAY_MS = 500;

function readString(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed === undefined || trimmed === "" ? fallback : trimmed;
}

function readNumber(value: string | undefined, fallback: number): number {
  const trimmed = value?.trim();
  if (trimmed === undefined || trimmed === "") {
    return fallback;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "true" || normalized === "1") {
    return true;
  }
  if (normalized === "false" || normalized === "0") {
    return false;
  }
  return fallback;
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function ensureLeadingSlash(value: string): string {
  return value.startsWith("/") ? value : `/${value}`;
}

const baseUrl = stripTrailingSlash(
  readString(process.env.NEXT_PUBLIC_API_BASE_URL, DEFAULT_BASE_URL),
);

const prefix = stripTrailingSlash(
  ensureLeadingSlash(
    readString(process.env.NEXT_PUBLIC_API_PREFIX, DEFAULT_PREFIX),
  ),
);

/**
 * While the screens are still mocked this defaults to `true` so nothing tries
 * to reach a backend that is not running yet. Set
 * `NEXT_PUBLIC_USE_MOCK_DATA=false` once an endpoint group is live.
 */
const useMockData = readBoolean(process.env.NEXT_PUBLIC_USE_MOCK_DATA, true);

export const API_CONFIG = {
  /** Origin only, no trailing slash — e.g. `https://api.vemra.com`. */
  baseUrl,
  /**
   * Version prefix, leading slash, no trailing slash — e.g. `/api/v1`.
   * Set `NEXT_PUBLIC_API_PREFIX=/` for a backend that serves no prefix;
   * an empty value falls back to the default rather than clearing it.
   */
  prefix,
  /** Origin + prefix. Prepend this to every request path. */
  root: `${baseUrl}${prefix}`,
  /** Abort a request after this many ms. `0` disables the timeout. */
  timeoutMs: readNumber(
    process.env.NEXT_PUBLIC_API_TIMEOUT_MS,
    DEFAULT_TIMEOUT_MS,
  ),
  /** Extra attempts after the first failure, for idempotent requests only. */
  retryAttempts: readNumber(
    process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS,
    DEFAULT_RETRY_ATTEMPTS,
  ),
  /** Base backoff between retries in ms. */
  retryDelayMs: readNumber(
    process.env.NEXT_PUBLIC_API_RETRY_DELAY_MS,
    DEFAULT_RETRY_DELAY_MS,
  ),
  /** Send cookies cross-origin. Required if auth uses an httpOnly cookie. */
  withCredentials: readBoolean(
    process.env.NEXT_PUBLIC_API_WITH_CREDENTIALS,
    true,
  ),
  useMockData,
} as const;

/** Spread into every JSON request. */
export const DEFAULT_API_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
} as const;

export const API_HEADER_NAMES = {
  authorization: "Authorization",
  /** Correlates a browser request with its backend log entry. */
  requestId: "X-Request-Id",
  /** Picks the acting role when an account holds more than one. */
  activeRole: "X-Vemra-Role",
} as const;

export const AUTH_SCHEME = "Bearer";

export type QueryValue = string | number | boolean | null | undefined;

/**
 * Joins a request path onto `API_CONFIG.root` and appends any query values
 * that are set. `null`, `undefined` and empty-string entries are dropped so
 * optional filters can be passed through without pre-filtering.
 */
export function apiUrl(
  path: string,
  query?: Record<string, QueryValue>,
): string {
  const url = `${API_CONFIG.root}${ensureLeadingSlash(path)}`;
  if (query === undefined) {
    return url;
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== null && value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const search = params.toString();
  return search === "" ? url : `${url}?${search}`;
}
