import { request } from "@/lib/api/http";
import type { HttpMethod, RequestOptions } from "@/lib/api/http";

export type ClientRequestOptions = Omit<RequestOptions, "method">;

function send<T>(
  method: HttpMethod,
  path: string,
  options: ClientRequestOptions,
): Promise<T> {
  return request<T>(path, { ...options, method });
}

export function clientGet<T>(
  path: string,
  options: ClientRequestOptions = {},
): Promise<T> {
  return send<T>("GET", path, options);
}

export function clientPost<T>(
  path: string,
  body?: unknown,
  options: ClientRequestOptions = {},
): Promise<T> {
  return send<T>("POST", path, { ...options, body });
}

export function clientPatch<T>(
  path: string,
  body?: unknown,
  options: ClientRequestOptions = {},
): Promise<T> {
  return send<T>("PATCH", path, { ...options, body });
}

export function clientDelete<T>(
  path: string,
  options: ClientRequestOptions = {},
): Promise<T> {
  return send<T>("DELETE", path, options);
}
