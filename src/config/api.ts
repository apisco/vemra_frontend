

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

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function ensureLeadingSlash(value: string): string {
  return value.startsWith("/") ? value : `/${value}`;
}

if (
  process.env.NODE_ENV === "production" &&
  (process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "") === ""
) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL must be set in production; refusing to fall back to localhost.",
  );
}

const baseUrl = stripTrailingSlash(
  readString(process.env.NEXT_PUBLIC_API_BASE_URL, DEFAULT_BASE_URL),
);

const prefix = stripTrailingSlash(
  ensureLeadingSlash(
    readString(process.env.NEXT_PUBLIC_API_PREFIX, DEFAULT_PREFIX),
  ),
);

export const API_CONFIG = {
  
  baseUrl,
  
  prefix,
  
  root: `${baseUrl}${prefix}`,
  
  timeoutMs: readNumber(
    process.env.NEXT_PUBLIC_API_TIMEOUT_MS,
    DEFAULT_TIMEOUT_MS,
  ),
  
  retryAttempts: readNumber(
    process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS,
    DEFAULT_RETRY_ATTEMPTS,
  ),
  
  retryDelayMs: readNumber(
    process.env.NEXT_PUBLIC_API_RETRY_DELAY_MS,
    DEFAULT_RETRY_DELAY_MS,
  ),
  
  withCredentials:
    process.env.NEXT_PUBLIC_API_WITH_CREDENTIALS?.trim().toLowerCase() !==
    "false",
} as const;


export const DEFAULT_API_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
} as const;

export const API_HEADER_NAMES = {
  authorization: "Authorization",
  
  requestId: "X-Request-Id",
  
  activeRole: "X-Vemra-Role",
} as const;

export const AUTH_SCHEME = "Bearer";

export type QueryValue = string | number | boolean | null | undefined;


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
