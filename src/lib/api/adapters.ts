import type { AccountProfile } from "@/types/api/auth";
import type {
  ApiEnvelope,
  ImageRef,
  Money,
  PersonRef,
} from "@/types/api/common";
import type {
  LandlordDashboard,
  LandlordProperty,
  LandlordPropertySummary,
  NextRentDue,
  PropertyAdmin,
  PropertyAdminRef,
  RevenuePoint,
} from "@/types/api/landlord";
import type {
  AppliedFilter,
  Listing,
  ListingFilters,
  ListingSummary,
} from "@/types/api/listing";
import type {
  MaintenanceRequest,
  NextPayment,
  PaymentPlanProgress,
  PaymentStatus,
  RentDue,
  TenantApplication,
  TenantDashboard,
  TenantMaintenance,
  TenantPayment,
  TenantProfile,
  UnitRef,
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

/* --------------------------------------------------------------------- *
 * Live role dashboards, landlord listings, and payment history.
 *
 * These backend payloads are untyped in the OpenAPI document, so the mappers
 * below read the documented camelCase fields with snake_case fallbacks and
 * normalise money from minor-unit strings (`amountMinor`) or major-unit
 * numbers. Unknown/missing fields degrade to sensible empty values.
 * --------------------------------------------------------------------- */

function readRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function readField(
  record: Record<string, unknown>,
  ...keys: string[]
): unknown {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

export function toMoneyValue(value: unknown): Money {
  if (typeof value === "number" && Number.isFinite(value)) {
    return { amount: value, currency: "NGN" };
  }
  const record = readRecord(value);
  const currency = readString(record.currency) ?? "NGN";
  const minor = readNumber(readField(record, "amountMinor", "amount_minor"));
  if (minor !== null) {
    return { amount: minor / MINOR_UNITS_PER_MAJOR, currency };
  }
  const major = readNumber(readField(record, "amount", "value"));
  return { amount: major ?? 0, currency };
}

function toPersonRef(value: unknown): PersonRef | null {
  const record = readRecord(value);
  const id = readString(record.id);
  const name = readString(
    readField(record, "name", "displayName", "display_name", "fullName", "full_name"),
  );
  if (id === null && name === null) {
    return null;
  }
  const resolved = name ?? "";
  return {
    id: id ?? "",
    name: resolved,
    initials: readString(record.initials) ?? initialsOf(resolved),
    avatarUrl: readString(readField(record, "avatarUrl", "avatar_url", "avatar")),
  };
}

function toPropertyAdminRef(value: unknown): PropertyAdminRef | null {
  const base = toPersonRef(value);
  if (base === null) {
    return null;
  }
  const record = readRecord(value);
  return {
    ...base,
    assignedAt: readString(readField(record, "assignedAt", "assigned_at")),
    note: readString(readField(record, "note")),
  };
}

function toPropertyAdmin(value: unknown): PropertyAdmin {
  const base = toPersonRef(value) ?? {
    id: "",
    name: "",
    initials: "?",
    avatarUrl: null,
  };
  const record = readRecord(value);
  const properties = readField(record, "properties");
  return {
    ...base,
    unitsManaged: readNumber(readField(record, "unitsManaged", "units_managed")) ?? 0,
    properties: Array.isArray(properties)
      ? properties
          .map((entry) =>
            typeof entry === "string"
              ? entry
              : readString(readRecord(entry).name) ?? "",
          )
          .filter((entry) => entry !== "")
      : [],
    assignedAt: readString(readField(record, "assignedAt", "assigned_at")),
    isCertified: Boolean(readField(record, "isCertified", "is_certified")),
  };
}

function toUnitRef(value: unknown): UnitRef | null {
  const record = readRecord(value);
  const id = readString(record.id);
  if (id === null) {
    return null;
  }
  return {
    id,
    name: readString(readField(record, "name", "title")) ?? "",
    propertyId: readString(readField(record, "propertyId", "property_id")) ?? "",
  };
}

function toImageRef(value: unknown, alt: string): ImageRef | null {
  const record = readRecord(value);
  const url = readString(readField(record, "url", "src", "href"));
  return url === null ? null : { url, alt: readString(record.alt) ?? alt };
}

function toImageList(value: unknown, alt: string): readonly ImageRef[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .slice()
    .sort(
      (a, b) =>
        (readNumber(readRecord(a).order) ?? 0) -
        (readNumber(readRecord(b).order) ?? 0),
    )
    .map((item) => toImageRef(item, alt))
    .filter((item): item is ImageRef => item !== null);
}

function toRentDue(value: unknown): RentDue | null {
  const record = readRecord(value);
  if (Object.keys(record).length === 0) {
    return null;
  }
  const amount = readField(record, "amount", "price", "rent");
  return {
    dueDate: readString(readField(record, "dueDate", "due_date")) ?? "",
    amount: amount === undefined ? toMoneyValue(record) : toMoneyValue(amount),
  };
}

function toNextPayment(value: unknown): NextPayment | null {
  const record = readRecord(value);
  if (Object.keys(record).length === 0) {
    return null;
  }
  return {
    amount: toMoneyValue(readField(record, "amount") ?? record),
    allowsInstallments: Boolean(
      readField(record, "allowsInstallments", "allows_installments"),
    ),
  };
}

function toPlanProgress(value: unknown): PaymentPlanProgress | null {
  const record = readRecord(value);
  if (Object.keys(record).length === 0) {
    return null;
  }
  return {
    paidAmount: toMoneyValue(readField(record, "paidAmount", "paid_amount")),
    totalAmount: toMoneyValue(readField(record, "totalAmount", "total_amount")),
    paidInstallments:
      readNumber(readField(record, "paidInstallments", "paid_installments")) ?? 0,
    totalInstallments:
      readNumber(readField(record, "totalInstallments", "total_installments")) ?? 0,
  };
}

export function toTenantDashboard(value: unknown): TenantDashboard {
  const record = readRecord(value);
  return {
    tenantName: readString(readField(record, "tenantName", "tenant_name", "name")) ?? "",
    unit: toUnitRef(readField(record, "unit")),
    rentDue: toRentDue(readField(record, "rentDue", "rent_due")),
    nextPayment: toNextPayment(readField(record, "nextPayment", "next_payment")),
    planProgress: toPlanProgress(readField(record, "planProgress", "plan_progress")),
  };
}

function mapPaymentStatus(value: unknown): PaymentStatus {
  const status = (readString(value) ?? "").toUpperCase();
  if (["CLEARED", "SUCCESS", "SUCCEEDED", "PAID", "COMPLETED"].includes(status)) {
    return "cleared";
  }
  if (["FAILED", "FAILURE", "CANCELLED", "REVERSED"].includes(status)) {
    return "failed";
  }
  if (status === "HELD" || status === "ESCROW") {
    return "held";
  }
  return "pending";
}

export function toTenantPayment(value: unknown): TenantPayment {
  const record = readRecord(value);
  return {
    id: readString(record.id) ?? "",
    label:
      readString(readField(record, "label", "description", "reference")) ??
      "Rent payment",
    amount: toMoneyValue(record),
    date: readString(readField(record, "date", "createdAt", "created_at")) ?? "",
    status: mapPaymentStatus(readField(record, "status")),
    method: readString(readField(record, "method", "channel", "provider")),
    reference: readString(readField(record, "reference", "referenceId", "reference_id")),
  };
}

function toNextRentDue(value: unknown): NextRentDue | null {
  const record = readRecord(value);
  if (Object.keys(record).length === 0) {
    return null;
  }
  return {
    dueDate: readString(readField(record, "dueDate", "due_date")) ?? "",
    unitName: readString(readField(record, "unitName", "unit_name")) ?? "",
    amount: toMoneyValue(readField(record, "amount") ?? record),
  };
}

function toRevenueSeries(value: unknown): readonly RevenuePoint[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((point) => {
    const record = readRecord(point);
    return {
      periodStart: readString(readField(record, "periodStart", "period_start")) ?? "",
      amount: toMoneyValue(readField(record, "amount") ?? record),
    };
  });
}

export function toLandlordDashboard(value: unknown): LandlordDashboard {
  const record = readRecord(value);
  const assignedAdmin = toPropertyAdmin(readField(record, "assignedAdmin", "assigned_admin"));
  const admins = readField(record, "propertyAdmins", "property_admins");
  return {
    landlordName:
      readString(readField(record, "landlordName", "landlord_name", "name")) ?? "",
    propertyCount: readNumber(readField(record, "propertyCount", "property_count")) ?? 0,
    occupiedCount: readNumber(readField(record, "occupiedCount", "occupied_count")) ?? 0,
    vacantCount: readNumber(readField(record, "vacantCount", "vacant_count")) ?? 0,
    vacantSince: readString(readField(record, "vacantSince", "vacant_since")),
    vacantUnitName: readString(readField(record, "vacantUnitName", "vacant_unit_name")),
    readyToWithdraw: toMoneyValue(
      readField(record, "readyToWithdraw", "ready_to_withdraw"),
    ),
    clearedPaymentCount:
      readNumber(readField(record, "clearedPaymentCount", "cleared_payment_count")) ?? 0,
    monthlyRentRoll: toMoneyValue(
      readField(record, "monthlyRentRoll", "monthly_rent_roll"),
    ),
    nextRentDue: toNextRentDue(readField(record, "nextRentDue", "next_rent_due")),
    revenueSeries: toRevenueSeries(readField(record, "revenueSeries", "revenue_series")),
    assignedAdmin: assignedAdmin.id === "" && assignedAdmin.name === "" ? null : assignedAdmin,
    propertyAdmins: Array.isArray(admins) ? admins.map(toPropertyAdmin) : [],
  };
}

export function toLandlordPropertySummary(
  value: unknown,
): LandlordPropertySummary {
  const record = readRecord(value);
  const tenant = toPersonRef(readField(record, "tenant"));
  const status = (readString(record.status) ?? "").toLowerCase();
  const name = readString(readField(record, "name", "title")) ?? "";
  const media = readField(record, "media", "photos", "images");
  return {
    id: readString(record.id) ?? "",
    name,
    tenant,
    admin: toPropertyAdminRef(
      readField(record, "admin", "propertyAdmin", "property_admin"),
    ),
    rent: toMoneyValue(readField(record, "rent", "annualRent", "annual_rent")),
    rentPeriod:
      (readString(readField(record, "rentPeriod", "rent_period")) ?? "").toLowerCase() ===
      "month"
        ? "month"
        : "year",
    status:
      status === "occupied" || status === "vacant"
        ? status
        : tenant
          ? "occupied"
          : "vacant",
    vacantSince: readString(readField(record, "vacantSince", "vacant_since")),
    nextRentDueDate:
      readString(readField(record, "nextRentDueDate", "next_rent_due_date")) ??
      readString(
        readRecord(readField(record, "nextRentDue", "next_rent_due")).dueDate,
      ),
    coverImage: toImageList(media, name)[0] ?? null,
  };
}

export function toLandlordProperty(value: unknown): LandlordProperty {
  const record = readRecord(value);
  const summary = toLandlordPropertySummary(value);
  const media = readField(record, "media", "photos", "images");
  const amenities = readField(record, "amenities");
  const address = readField(record, "address");
  const addressText =
    typeof address === "string"
      ? address
      : [
          readString(readRecord(address).line1),
          readString(readRecord(address).city),
          readString(readRecord(address).state),
        ]
          .filter(Boolean)
          .join(", ");
  return {
    ...summary,
    description: readString(readField(record, "description", "summary")) ?? "",
    bedrooms: readNumber(
      readField(record, "bedrooms", "bedroomCount", "bedroom_count"),
    ),
    bathrooms: readNumber(
      readField(record, "bathrooms", "bathroomCount", "bathroom_count"),
    ),
    address: addressText,
    listedSince: readString(
      readField(record, "listedSince", "listed_since", "createdAt", "created_at"),
    ),
    photos: toImageList(media, summary.name),
    amenities: Array.isArray(amenities)
      ? amenities.filter((item): item is string => typeof item === "string")
      : [],
    isPubliclyListed:
      Boolean(readField(record, "isPubliclyListed", "is_publicly_listed")) ||
      (readString(record.status) ?? "").toLowerCase() === "published",
  };
}


