import type { paths } from "@/types/api/generated";

type JsonResponse<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath],
  TStatus extends number,
> = paths[TPath][TMethod] extends {
  responses: Record<TStatus, { content: { "application/json": infer TBody } }>;
}
  ? TBody
  : never;

type JsonRequest<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath],
> = paths[TPath][TMethod] extends {
  requestBody?: { content: { "application/json": infer TBody } };
}
  ? TBody
  : never;

export type PropertySearchResponse = JsonResponse<
  "/api/v1/properties",
  "get",
  200
>;

export type PropertyDetailResponse = JsonResponse<
  "/api/v1/properties/{propertyId}",
  "get",
  200
>;

export type CreatePropertyRequest = JsonRequest<"/api/v1/properties", "post">;

export type UpdatePropertyRequest = JsonRequest<
  "/api/v1/properties/{propertyId}",
  "patch"
>;

export type MyListingsResponse = JsonResponse<
  "/api/v1/properties/me/listings",
  "get",
  200
>;

export type ApplicationListResponse = JsonResponse<
  "/api/v1/applications",
  "get",
  200
>;

export type CreateApplicationRequest = JsonRequest<
  "/api/v1/applications",
  "post"
>;

export type MaintenanceListResponse = JsonResponse<
  "/api/v1/maintenance",
  "get",
  200
>;

export type CreateMaintenanceRequest = JsonRequest<
  "/api/v1/maintenance",
  "post"
>;

export type MeResponse = JsonResponse<"/api/v1/me", "get", 200>;

export type LeaseDetailResponse = JsonResponse<
  "/api/v1/leases/{leaseId}",
  "get",
  200
>;

export type LeasePayResponse = JsonResponse<
  "/api/v1/leases/{id}/pay",
  "post",
  200
>;

export type WalletResponse = JsonResponse<"/api/v1/wallet", "get", 200>;

export type PaymentsResponse = JsonResponse<"/api/v1/payments", "get", 200>;

export type WithdrawalsResponse = JsonResponse<
  "/api/v1/withdrawals",
  "get",
  200
>;

export type CreateWithdrawalRequest = JsonRequest<
  "/api/v1/withdrawals",
  "post"
>;

export type NotificationPreferencesResponse = JsonResponse<
  "/api/v1/notifications/preferences",
  "get",
  200
>;

export type MediaTicketRequest = JsonRequest<
  "/api/v1/properties/{propertyId}/media/ticket",
  "post"
>;

export type AttachMediaRequest = JsonRequest<
  "/api/v1/properties/{propertyId}/media",
  "post"
>;

export type PayoutAccountRequest = JsonRequest<
  "/api/v1/wallet/payout-accounts",
  "post"
>;

export type ApiErrorResponse =
  paths["/api/v1/does-not-exist"]["get"]["responses"][404]["content"]["application/json"];

export type SpecProperty = NonNullable<
  PropertySearchResponse["data"]
>["properties"][number];

export type SpecPropertyList = NonNullable<PropertySearchResponse["data"]>;

export type SpecApplicationList = NonNullable<
  ApplicationListResponse["data"]
>["data"];

export type SpecMaintenanceIssue = NonNullable<
  MaintenanceListResponse["data"]
>[number];

export type SpecLease = NonNullable<LeaseDetailResponse["data"]>;

export type SpecAccount = NonNullable<MeResponse["data"]>;
