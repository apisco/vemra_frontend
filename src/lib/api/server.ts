import "server-only";

import { API_HEADER_NAMES, AUTH_SCHEME } from "@/config/api";
import { isNotFound } from "@/lib/api/errors";
import { request } from "@/lib/api/http";
import type { HttpMethod, RequestOptions } from "@/lib/api/http";
import { getAccessToken } from "@/lib/api/session";
import type { ApiEnvelope } from "@/types/api/common";

export type ServerRequestOptions = Omit<RequestOptions, "method">;


async function withSession(
  options: ServerRequestOptions,
): Promise<RequestOptions> {
  const token = await getAccessToken();
  if (token === null) {
    return options;
  }
  return {
    ...options,
    headers: {
      ...options.headers,
      [API_HEADER_NAMES.authorization]: `${AUTH_SCHEME} ${token}`,
    },
  };
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


export async function apiGetDataOptional<T>(
  path: string,
  options: ServerRequestOptions = {},
): Promise<T | null> {
  const envelope = await apiGetOptional<ApiEnvelope<T>>(path, options);
  return envelope?.data ?? null;
}

export async function apiPostData<T>(
  path: string,
  body?: unknown,
  options: ServerRequestOptions = {},
): Promise<T> {
  return (await apiPost<ApiEnvelope<T>>(path, body, options)).data;
}

export async function apiPatchData<T>(
  path: string,
  body?: unknown,
  options: ServerRequestOptions = {},
): Promise<T> {
  return (await apiPatch<ApiEnvelope<T>>(path, body, options)).data;
}
