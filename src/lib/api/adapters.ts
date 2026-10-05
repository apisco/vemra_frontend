import type { AccountProfile } from "@/types/api/auth";
import type { ApiEnvelope, ImageRef } from "@/types/api/common";
import type {
  AppliedFilter,
  Listing,
  ListingFilters,
  ListingSummary,
} from "@/types/api/listing";
import type {
  MaintenanceRequest,
  TenantApplication,
  TenantMaintenance,
  TenantProfile,
} from "@/types/api/tenant";

/**
 * Adapters from the deployed Vemra backend (resource-oriented, money in minor
 * units, snake-ish DTOs) to the frontend's screen-shaped view models.
 *
 * The backend routes live under `/api/v1/properties`, `/api/v1/lease…`, etc.;
 * the frontend calls those directly and maps the payload here. Fields the
 * backend does not provide (contact, owner, verification badge, highlight) are
 * left as null/empty so the UI renders its empty state.
 */

export interface BackendPropertyMedia {
  url: string;
  isMain?: boolean;
  order?: number;
}

export interface BackendPropertyLocation {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface BackendProperty {
  id: string;
  title: string;
  description?: string;
  location?: BackendPropertyLocation;
  propertyType?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  squareFeet?: number | null;
  amenities?: readonly string[];
  annualRent?: { amountMinor: string | number; currency: string };
  status?: string;
  media?: readonly BackendPropertyMedia[];
}

export interface BackendPropertyList {
  properties: readonly BackendProperty[];
  pagination: { limit: number; offset: number; count: number };
}

export type BackendPropertyEnvelope = ApiEnvelope<BackendPropertyList>;
export type BackendSinglePropertyEnvelope = ApiEnvelope<BackendProperty>;

const MINOR_UNITS_PER_MAJOR = 100;

export function toMoney(
  money: { amountMinor: string | number; currency: string } | undefined,
) {
  if (money === undefined) {
    return { amount: 0, currency: "NGN" };
  }
  const minor = Number(money.amountMinor);
  return {
    amount: Number.isFinite(minor) ? minor / MINOR_UNITS_PER_MAJOR : 0,
    currency: money.currency,
  };
}

export function locationLabel(location: BackendPropertyLocation | undefined): string {
  if (location === undefined) {
    return "—";
  }
  return [location.city, location.state].filter(Boolean).join(", ") || "—";
}

function coverImage(
  media: readonly BackendPropertyMedia[] | undefined,
  title: string,
): ImageRef | null {
  if (media === undefined || media.length === 0) {
    return null;
  }
  const main = media.find((item) => item.isMain) ?? media[0];
  return main === undefined ? null : { url: main.url, alt: title };
}

function photos(
  media: readonly BackendPropertyMedia[] | undefined,
  title: string,
): readonly ImageRef[] {
  if (media === undefined) {
    return [];
  }
  return [...media]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => ({ url: item.url, alt: title }));
}

export function toListingSummary(property: BackendProperty): ListingSummary {
  return {
    id: property.id,
    title: property.title,
    propertyType: property.propertyType ?? "Property",
    location: locationLabel(property.location),
    rent: toMoney(property.annualRent),
    rentPeriod: "year",
    bedrooms: property.bedrooms ?? null,
    highlight: null,
    coverImage: coverImage(property.media, property.title),
    isVerified: false,
    isAvailableNow: property.status === "published",
    contact: null,
  };
}

export function toListing(property: BackendProperty): Listing {
  return {
    ...toListingSummary(property),
    description: property.description ?? "",
    bathrooms: property.bathrooms ?? null,
    floorArea:
      property.squareFeet === undefined || property.squareFeet === null
        ? null
        : `${property.squareFeet} sq ft`,
    availableFrom: null,
    photos: photos(property.media, property.title),
    amenities: property.amenities ?? [],
    owner: null,
    stats: [],
  };
}

export function toBackendListingQuery(
  filters: ListingFilters,
): Record<string, string | number> {
  const query: Record<string, string | number> = { status: "published" };
  if (filters.minRent !== undefined) {
    query.minPriceMinor = Math.round(filters.minRent * MINOR_UNITS_PER_MAJOR);
  }
  if (filters.maxRent !== undefined) {
    query.maxPriceMinor = Math.round(filters.maxRent * MINOR_UNITS_PER_MAJOR);
  }
  if (filters.bedrooms !== undefined) {
    query.bedrooms = filters.bedrooms;
  }
  const pageSize = filters.pageSize ?? 20;
  const page = filters.page ?? 1;
  query.limit = pageSize;
  query.offset = (page - 1) * pageSize;
  return query;
}

export function toAppliedFilters(filters: ListingFilters): AppliedFilter[] {
  const applied: AppliedFilter[] = [];
  if (filters.bedrooms !== undefined) {
    applied.push({ id: "bedrooms", label: `${filters.bedrooms}+ beds` });
  }
  if (filters.minRent !== undefined) {
    applied.push({ id: "minRent", label: `From ₦${filters.minRent.toLocaleString()}` });
  }
  if (filters.maxRent !== undefined) {
    applied.push({ id: "maxRent", label: `Up to ₦${filters.maxRent.toLocaleString()}` });
  }
  return applied;
}

/**
 * Some backend modules (`maintenance`) wrap their payload as
 * `{ status: 'success', data }` instead of the standard `{ data, requestId }`,
 * and others (`messaging`, `notifications`) return the payload raw. Unwrap all
 * three shapes so callers always receive the payload.
 */
export function unwrapData<T>(body: unknown): T {
  if (
    body !== null &&
    typeof body === "object" &&
    "data" in (body as Record<string, unknown>)
  ) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export interface BackendApplication {
  id: string;
  propertyId: string;
  applicantId: string;
  status: string;
  documents?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface BackendApplicationList {
  applications: readonly BackendApplication[];
  pagination: { limit: number; offset: number; count: number };
}

const APPLICATION_STATUS: Record<string, TenantApplication["status"]> = {
  PENDING: "under_review",
  APPROVED: "approved",
  REJECTED: "declined",
  WITHDRAWN: "declined",
};

export function toTenantApplication(
  application: BackendApplication,
): TenantApplication {
  return {
    id: application.id,
    listing: null,
    status: APPLICATION_STATUS[application.status] ?? "submitted",
    submittedAt: application.createdAt,
    moveInDate: null,
    decisionWindow: null,
    reviewers: [],
  };
}

export interface BackendMaintenanceRequest {
  id: string;
  propertyId: string;
  reporterId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
}

const MAINTENANCE_URGENCY: Record<string, MaintenanceRequest["urgency"]> = {
  LOW: "low",
  MEDIUM: "normal",
  HIGH: "high",
  EMERGENCY: "high",
};

const MAINTENANCE_STATUS: Record<string, MaintenanceRequest["status"]> = {
  REPORTED: "open",
  ASSIGNED: "scheduled",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "resolved",
};

export function toMaintenanceRequest(
  request: BackendMaintenanceRequest,
): MaintenanceRequest {
  const resolved =
    request.status === "RESOLVED" || request.status === "CLOSED";
  return {
    id: request.id,
    title: request.title,
    category: request.priority,
    urgency: MAINTENANCE_URGENCY[request.priority] ?? "normal",
    status: MAINTENANCE_STATUS[request.status] ?? "open",
    description: request.description,
    submittedAt: request.createdAt,
    resolvedAt: resolved ? request.updatedAt : null,
    unit: null,
  };
}

export function toTenantMaintenance(
  requests: readonly BackendMaintenanceRequest[],
): TenantMaintenance {
  return {
    options: {
      categories: [],
      urgencies: [
        { value: "low", label: "Low" },
        { value: "normal", label: "Normal" },
        { value: "high", label: "High" },
      ],
      units: [],
    },
    requests: requests.map(toMaintenanceRequest),
  };
}

export function toTenantProfile(account: AccountProfile | null): TenantProfile {
  return {
    fullName: account?.displayName ?? "",
    email: account?.email ?? "",
    phone: account?.phone ?? null,
    role: account?.roles[0] ?? "TENANT",
    avatar: null,
    isVerified: account?.emailVerified ?? false,
    verificationNote: null,
  };
}

