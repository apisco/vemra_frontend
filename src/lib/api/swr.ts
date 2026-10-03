"use client";

import type { SWRConfiguration } from "swr";

import { clientGet } from "@/lib/api/client";
import type { QueryValue } from "@/config/api";
import { isApiError } from "@/lib/api/errors";

export type SwrKey = string | readonly [string, Record<string, QueryValue>];

export function swrFetcher<T>(key: SwrKey): Promise<T> {
  return typeof key === "string"
    ? clientGet<T>(key)
    : clientGet<T>(key[0], { query: key[1] });
}

export const SWR_DEFAULTS: SWRConfiguration = {
  fetcher: swrFetcher,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  shouldRetryOnError: (error: unknown) =>
    !isApiError(error) || error.isRetryable,
  errorRetryCount: 2,
  dedupingInterval: 2000,
};
