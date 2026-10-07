import "server-only";

import { cache } from "react";

import { CACHE_TAGS, ENDPOINTS, REVALIDATE } from "@/lib/api/endpoints";
import {
  toAppliedFilters,
  toBackendListingQuery,
  toListing,
  toListingSummary,
  unwrapData,
  type BackendPropertyEnvelope,
  type BackendSinglePropertyEnvelope,
} from "@/lib/api/adapters";
import { isApiError, isNotFound } from "@/lib/api/errors";
import { apiGetOptionalPublic, apiGetPublic } from "@/lib/api/server";
import type { Paginated } from "@/types/api/common";
import type {
  AppliedFilter,
  Listing,
  ListingFilters,
  ListingSummary,
  PublicProfile,
} from "@/types/api/listing";
import type { DashboardPreview, PlatformStats } from "@/types/api/platform";



export interface BrowseResult extends Paginated<ListingSummary> {
  
  appliedFilters: readonly AppliedFilter[];
}

const EMPTY_BROWSE_RESULT: BrowseResult = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 0,
  hasMore: false,
  appliedFilters: [],
};


async function publicRead<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    const recoverable =
      isNotFound(error) ||
      (isApiError(error) &&
        (error.kind === "network" || error.kind === "timeout"));

    if (recoverable) {
      console.warn(
        `[api] public read unavailable; serving fallback: ${error instanceof Error ? error.message : String(error)}`,
      );
      return fallback;
    }
    throw error;
  }
}

export const getListings = cache(
  async (filters: ListingFilters = {}): Promise<BrowseResult> =>
    publicRead(async () => {
      const envelope = await apiGetPublic<BackendPropertyEnvelope>(
        ENDPOINTS.public.listings,
        {
          query: toBackendListingQuery(filters),
          revalidate: REVALIDATE.listings,
          tags: [CACHE_TAGS.listings],
        },
      );
      const { properties, pagination } = envelope.data;
      const pageSize = pagination.limit;
      const page =
        pageSize > 0 ? Math.floor(pagination.offset / pageSize) + 1 : 1;
      return {
        items: properties.map(toListingSummary),
        total: pagination.offset + pagination.count,
        page,
        pageSize,
        hasMore: pagination.count === pageSize,
        appliedFilters: toAppliedFilters(filters),
      };
    }, EMPTY_BROWSE_RESULT),
);

export const getListing = cache(
  async (listingId: string): Promise<Listing | null> =>
    publicRead(async () => {
      const envelope = await apiGetOptionalPublic<BackendSinglePropertyEnvelope>(
        ENDPOINTS.public.listing(listingId),
        {
          revalidate: REVALIDATE.listing,
          tags: [CACHE_TAGS.listings, CACHE_TAGS.listing(listingId)],
        },
      );
      return envelope === null ? null : toListing(envelope.data);
    }, null),
);

export const getFeaturedListing = cache(
  async (): Promise<ListingSummary | null> =>
    publicRead(async () => {
      const envelope = await apiGetPublic<BackendPropertyEnvelope>(
        ENDPOINTS.public.featuredListing,
        {
          query: { status: "published", limit: 1, offset: 0 },
          revalidate: REVALIDATE.listings,
          tags: [CACHE_TAGS.listings],
        },
      );
      const first = envelope.data.properties[0];
      return first === undefined ? null : toListingSummary(first);
    }, null),
);

export const getPublicProfile = cache(
  async (profileId: string): Promise<PublicProfile | null> =>
    publicRead(
      () =>
        apiGetOptionalPublic<PublicProfile>(ENDPOINTS.public.profile(profileId), {
          revalidate: REVALIDATE.profile,
          tags: [CACHE_TAGS.profile(profileId)],
        }),
      null,
    ),
);

export const getPlatformStats = cache(
  async (): Promise<PlatformStats | null> =>
    publicRead(async () => {
      const body = await apiGetOptionalPublic<unknown>(
        ENDPOINTS.public.platformStats,
        {
          revalidate: REVALIDATE.platformStats,
          tags: [CACHE_TAGS.platformStats],
        },
      );
      if (body === null) {
        return null;
      }
      const record = unwrapData<unknown>(body) as { stats?: unknown } | null;
      return record !== null && Array.isArray(record.stats)
        ? ({ stats: record.stats } as PlatformStats)
        : null;
    }, null),
);

export const getDashboardPreview = cache(
  async (): Promise<DashboardPreview | null> =>
    publicRead(async () => {
      const body = await apiGetOptionalPublic<unknown>(
        ENDPOINTS.public.dashboardPreview,
        {
          revalidate: REVALIDATE.platformStats,
          tags: [CACHE_TAGS.platformStats],
        },
      );
      if (body === null) {
        return null;
      }
      const record = unwrapData<unknown>(body) as {
        tenant?: unknown;
        landlord?: unknown;
      } | null;
      const isPanel = (value: unknown): boolean =>
        value !== null && typeof value === "object" && "title" in value;
      return record !== null && isPanel(record.tenant) && isPanel(record.landlord)
        ? (record as unknown as DashboardPreview)
        : null;
    }, null),
);
