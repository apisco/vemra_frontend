import "server-only";

import { isNotFound } from "@/lib/api/errors";
import { request } from "@/lib/api/http";
import type { HttpMethod, RequestOptions } from "@/lib/api/http";
import { sessionCookieHeader } from "@/lib/api/session";

export type ServerRequestOptions = Omit<RequestOptions, "method">;

async function withSession(
  options: ServerRequestOptions,
): Promise<RequestOptions> {
  const cookie = await sessionCookieHeader();
  if (cookie === null) {
    return options;
  }
  return { ...options, headers: { ...options.headers, Cookie: cookie } };
}

async function send<T>(
  method: HttpMethod,
  path: string,
  options: ServerRequestOptions,
): Promise<T> {
  return request<T>(path, { ...(await withSession(options)), method });
}

export async function apiGet<T>(
  path: string,
  options: ServerRequestOptions = {},
): Promise<T> {
  return send<T>("GET", path, options);
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  options: ServerRequestOptions = {},
): Promise<T> {
  return send<T>("POST", path, { ...options, body });
}

export async function apiPut<T>(
  path: string,
  body?: unknown,
  options: ServerRequestOptions = {},
): Promise<T> {
  return send<T>("PUT", path, { ...options, body });
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
  options: ServerRequestOptions = {},
): Promise<T> {
  return send<T>("PATCH", path, { ...options, body });
}

export async function apiDelete<T>(
  path: string,
  options: ServerRequestOptions = {},
): Promise<T> {
  return send<T>("DELETE", path, options);
}

export async function apiGetPublic<T>(
  path: string,
  options: ServerRequestOptions = {},
): Promise<T> {
  return request<T>(path, { ...options, method: "GET" });
}

export async function apiGetOptionalPublic<T>(
  path: string,
  options: ServerRequestOptions = {},
): Promise<T | null> {
  try {
    return await apiGetPublic<T>(path, options);
  } catch (error) {
    if (isNotFound(error)) {
      return null;
    }
    throw error;
  }
}

export async function apiGetOptional<T>(
  path: string,
  options: ServerRequestOptions = {},
): Promise<T | null> {
  try {
    return await apiGet<T>(path, options);
  } catch (error) {
    if (isNotFound(error)) {
      return null;
    }
    throw error;
  }
}
