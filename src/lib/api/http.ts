import {
  API_CONFIG,
  API_HEADER_NAMES,
  DEFAULT_API_HEADERS,
  apiUrl,
} from "@/config/api";
import type { QueryValue } from "@/config/api";
import { ApiError } from "@/lib/api/errors";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const IDEMPOTENT_METHODS: ReadonlySet<HttpMethod> = new Set<HttpMethod>([
  "GET",
  "PUT",
  "DELETE",
]);

export interface RequestOptions {
  method?: HttpMethod;
  query?: Record<string, QueryValue>;
  body?: unknown;
  headers?: Readonly<Record<string, string>>;
  signal?: AbortSignal;
  timeoutMs?: number;
  retryAttempts?: number;
  role?: string;
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: readonly string[];
}

interface NextFetchInit extends RequestInit {
  next?: { revalidate?: number | false; tags?: string[] };
}

function newRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolveSignal(
  signal: AbortSignal | undefined,
  timeoutMs: number,
): AbortSignal | undefined {
  const timeout =
    timeoutMs > 0 && typeof AbortSignal.timeout === "function"
      ? AbortSignal.timeout(timeoutMs)
      : undefined;

  if (signal === undefined) {
    return timeout;
  }
  if (timeout === undefined) {
    return signal;
  }
  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any([signal, timeout]);
  }
  return signal;
}

function isJsonResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("json");
}

interface ErrorEnvelope {
  message: string | null;
  code: string | null;
  fieldErrors: Record<string, string> | null;
}

function readErrorEnvelope(payload: unknown): ErrorEnvelope {
  const empty: ErrorEnvelope = { message: null, code: null, fieldErrors: null };

  if (typeof payload === "string") {
    return { ...empty, message: payload.trim() === "" ? null : payload };
  }
  if (payload === null || typeof payload !== "object") {
    return empty;
  }

  const record = payload as Record<string, unknown>;
  const nested =
    typeof record.error === "object" && record.error !== null
      ? (record.error as Record<string, unknown>)
      : record;

  const message = [nested.message, nested.detail, nested.title].find(
    (value): value is string => typeof value === "string" && value !== "",
  );

  const code = [nested.code, nested.type].find(
    (value): value is string => typeof value === "string" && value !== "",
  );

  const rawFields = nested.errors ?? nested.fieldErrors ?? nested.fields;
  let fieldErrors: Record<string, string> | null = null;

  if (typeof rawFields === "object" && rawFields !== null) {
    const entries = Object.entries(rawFields as Record<string, unknown>).flatMap(
      ([field, value]) => {
        if (typeof value === "string") {
          return [[field, value] as const];
        }
        if (Array.isArray(value) && typeof value[0] === "string") {
          return [[field, value[0]] as const];
        }
        return [];
      },
    );
    if (entries.length > 0) {
      fieldErrors = Object.fromEntries(entries);
    }
  }

  
  
  
  if (fieldErrors === null && Array.isArray(nested.details)) {
    const entries = (nested.details as unknown[]).flatMap((detail) => {
      if (detail === null || typeof detail !== "object") {
        return [];
      }
      const { field, reason } = detail as { field?: unknown; reason?: unknown };
      if (typeof field !== "string" || typeof reason !== "string") {
        return [];
      }
      const key = field.includes(".") ? (field.split(".").pop() ?? field) : field;
      return [[key, reason] as const];
    });
    if (entries.length > 0) {
      fieldErrors = Object.fromEntries(entries);
    }
  }

  return { message: message ?? null, code: code ?? null, fieldErrors };
}

async function readBody(response: Response): Promise<unknown> {
  try {
    return isJsonResponse(response)
      ? await response.json()
      : await response.text();
  } catch {
    return undefined;
  }
}

function buildInit(
  options: RequestOptions,
  method: HttpMethod,
  requestId: string,
): NextFetchInit {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const isCacheable =
    options.revalidate !== undefined || options.tags !== undefined;

  const headers: Record<string, string> = {
    ...DEFAULT_API_HEADERS,
    ...(isCacheable ? {} : { [API_HEADER_NAMES.requestId]: requestId }),
    ...options.headers,
  };

  if (isFormData) {
    delete headers["Content-Type"];
  }

  if (options.role !== undefined) {
    headers[API_HEADER_NAMES.activeRole] = options.role;
  }

  const init: NextFetchInit = {
    method,
    headers,
    signal: resolveSignal(
      options.signal,
      options.timeoutMs ?? API_CONFIG.timeoutMs,
    ),
  };

  if (API_CONFIG.withCredentials) {
    init.credentials = "include";
  }

  if (options.body !== undefined && method !== "GET") {
    init.body = isFormData
      ? (options.body as FormData)
      : JSON.stringify(options.body);
  }

  if (options.revalidate !== undefined || options.tags !== undefined) {
    init.next = {
      ...(options.revalidate !== undefined
        ? { revalidate: options.revalidate }
        : {}),
      ...(options.tags !== undefined ? { tags: [...options.tags] } : {}),
    };
  } else {
    init.cache = options.cache ?? "no-store";
  }

  return init;
}


function isDynamicServerUsage(cause: unknown): boolean {
  return (
    cause instanceof Error &&
    (cause as { digest?: unknown }).digest === "DYNAMIC_SERVER_USAGE"
  );
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const method = options.method ?? "GET";
  const url = apiUrl(path, options.query);
  const requestId = newRequestId();

  const budget = options.retryAttempts ?? API_CONFIG.retryAttempts;
  const maxAttempts = IDEMPOTENT_METHODS.has(method)
    ? Math.max(0, budget) + 1
    : 1;

  let lastError: ApiError | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (attempt > 0) {
      await sleep(API_CONFIG.retryDelayMs * 2 ** (attempt - 1));
    }

    let response: Response;
    try {
      response = await fetch(url, buildInit(options, method, requestId));
    } catch (cause) {
      if (isDynamicServerUsage(cause)) {
        throw cause;
      }

      const isTimeout =
        cause instanceof DOMException && cause.name === "TimeoutError";
      const isAbort =
        cause instanceof DOMException && cause.name === "AbortError";

      if (isAbort && options.signal?.aborted === true) {
        throw cause;
      }

      lastError = new ApiError({
        kind: isTimeout ? "timeout" : "network",
        message: isTimeout
          ? `Request to ${path} timed out.`
          : `Request to ${path} could not reach the server.`,
        requestId,
        cause,
      });
      continue;
    }

    if (response.ok) {
      if (response.status === 204 || response.status === 205) {
        return null as T;
      }

      const raw = await response.text();
      if (raw.trim() === "") {
        return null as T;
      }

      try {
        return JSON.parse(raw) as T;
      } catch (cause) {
        throw new ApiError({
          kind: "parse",
          message: `Response from ${path} was not valid JSON.`,
          status: response.status,
          details: raw.slice(0, 500),
          requestId,
          cause,
        });
      }
    }

    const payload = await readBody(response);
    const envelope = readErrorEnvelope(payload);

    lastError = new ApiError({
      kind: "http",
      message:
        envelope.message ??
        `Request to ${path} failed with ${response.status} ${response.statusText}.`,
      status: response.status,
      code: envelope.code,
      fieldErrors: envelope.fieldErrors,
      details: payload,
      requestId,
    });

    if (!lastError.isRetryable) {
      throw lastError;
    }
  }

  throw (
    lastError ??
    new ApiError({
      kind: "network",
      message: `Request to ${path} failed.`,
      requestId,
    })
  );
}
