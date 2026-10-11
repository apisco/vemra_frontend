import { request } from "@/lib/api/http";
import type { RequestOptions } from "@/lib/api/http";

export type ClientRequestOptions = Omit<RequestOptions, "method" | "body">;

export function clientGet<T>(
  path: string,
  options: ClientRequestOptions = {},
): Promise<T> {
  return request<T>(path, { ...options, method: "GET" });
}
