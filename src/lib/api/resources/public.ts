import "server-only";

import { cache } from "react";

import { CACHE_TAGS, ENDPOINTS, REVALIDATE } from "@/lib/api/endpoints";
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

/**
 * Public reads for the marketing pages.
 *
 * Unlike the dashboard resources these are tagged and revalidated rather than
 * `no-store`: nothing here is per-user, so a shared cache is both correct and
 * much cheaper. A Server Action that publishes a listing revalidates
 * `CACHE_TAGS.listings`.
 *
 * These read without forwarding the session cookie, so the routes stay
 * statically renderable (ISR) instead of being opted into dynamic rendering by
 * `cookies()`.
 */

export interface BrowseResult extends Paginated<ListingSummary> {
  /** Filters the backend actually applied, for the empty-search screen. */
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

/**
 * Public marketing content is non-critical and every screen already has a
 * designed empty/fallback state, so a missing or unreachable endpoint degrades
 * to that fallback instead of failing the render (or the build's prerender).
 * `404`s are treated as "no data" because the public endpoint set is still
 * settling; network/timeout failures are equally transient. Other HTTP errors
 * (auth, server faults) still surface.
 */
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
    publicRead(
      () =>
        apiGetPublic<BrowseResult>(ENDPOINTS.public.listings, {
          query: { ...filters },
          revalidate: REVALIDATE.listings,
          tags: [CACHE_TAGS.listings],
        }),
      EMPTY_BROWSE_RESULT,
    ),
);

export const getListing = cache(
  async (listingId: string): Promise<Listing | null> =>
    publicRead(
      () =>
        apiGetOptionalPublic<Listing>(ENDPOINTS.public.listing(listingId), {
          revalidate: REVALIDATE.listing,
          tags: [CACHE_TAGS.listings, CACHE_TAGS.listing(listingId)],
        }),
      null,
    ),
);

export const getFeaturedListing = cache(
  async (): Promise<ListingSummary | null> =>
    publicRead(
      () =>
        apiGetOptionalPublic<ListingSummary>(ENDPOINTS.public.featuredListing, {
          revalidate: REVALIDATE.listings,
          tags: [CACHE_TAGS.listings],
        }),
      null,
    ),
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
    publicRead(
      () =>
        apiGetOptionalPublic<PlatformStats>(ENDPOINTS.public.platformStats, {
          revalidate: REVALIDATE.platformStats,
          tags: [CACHE_TAGS.platformStats],
        }),
      null,
    ),
);

export const getDashboardPreview = cache(
  async (): Promise<DashboardPreview | null> =>
    publicRead(
      () =>
        apiGetOptionalPublic<DashboardPreview>(
          ENDPOINTS.public.dashboardPreview,
          {
            revalidate: REVALIDATE.platformStats,
            tags: [CACHE_TAGS.platformStats],
          },
        ),
      null,
    ),
);
