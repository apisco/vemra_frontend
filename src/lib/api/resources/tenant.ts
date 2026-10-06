import "server-only";

import { cache } from "react";

import { ENDPOINTS } from "@/lib/api/endpoints";
import {
  toTenantApplication,
  toTenantDashboard,
  toTenantMaintenance,
  toTenantPayment,
  toTenantProfile,
  unwrapData,
  type BackendApplicationList,
  type BackendMaintenanceRequest,
} from "@/lib/api/adapters";
import { recoverableRead } from "@/lib/api/resilient";
import { apiGet, apiGetDataOptional, apiGetOptional } from "@/lib/api/server";
import type { AccountProfile } from "@/types/api/auth";
import type {
  CautionDeposit,
  CheckoutOptions,
  Conversation,
  ConversationSummary,
  DepositDecision,
  Lease,
  NotificationFeed,
  PaymentPlan,
  ReferralProgram,
  RentChange,
  SavedProperty,
  TenantApplication,
  TenantDashboard,
  TenantMaintenance,
  TenantPayment,
  TenantProfile,
  TenantRentals,
  TenantSettings,
} from "@/types/api/tenant";

/**
 * Tenant reads.
 *
 * All per-user and therefore uncached by the fetch layer (`no-store`); `cache()`
 * here only dedupes within a single render pass.
 *
 * Reads that can legitimately have no record yet — a tenant with no lease, no
 * deposit, no plan — go through `apiGetOptional` so a `404` becomes `null` and
 * the screen shows its empty state instead of an error.
 */

export const getTenantDashboard = cache(
  async (): Promise<TenantDashboard> =>
    recoverableRead(
      "tenant dashboard",
      async () =>
        toTenantDashboard(
          unwrapData<unknown>(
            await apiGet<unknown>(ENDPOINTS.identity.tenantDashboard),
          ),
        ),
      {
        tenantName: "",
        unit: null,
        rentDue: null,
        nextPayment: null,
        planProgress: null,
      },
    ),
);

export const getPaymentPlan = cache(
  async (): Promise<PaymentPlan | null> =>
    apiGetOptional<PaymentPlan>(ENDPOINTS.tenant.paymentPlan),
);

export const getTenantPayments = cache(
  async (): Promise<readonly TenantPayment[]> =>
    recoverableRead(
      "tenant payments",
      async () => {
        const body = await apiGet<unknown>(ENDPOINTS.tenant.payments);
        const payload = unwrapData<{ payments?: readonly unknown[] }>(body);
        const rows = Array.isArray(payload?.payments) ? payload.payments : [];
        return rows.map(toTenantPayment);
      },
      [],
    ),
);

export const getCheckoutOptions = cache(
  async (): Promise<CheckoutOptions | null> =>
    apiGetOptional<CheckoutOptions>(ENDPOINTS.tenant.checkout),
);

export const getTenantRentals = cache(
  async (): Promise<TenantRentals> =>
    apiGet<TenantRentals>(ENDPOINTS.tenant.rentals),
);

export const getSavedProperties = cache(
  async (): Promise<readonly SavedProperty[]> =>
    apiGet<readonly SavedProperty[]>(ENDPOINTS.tenant.savedProperties),
);

export const getCautionDeposit = cache(
  async (): Promise<CautionDeposit | null> =>
    apiGetOptional<CautionDeposit>(ENDPOINTS.tenant.cautionDeposit),
);

export const getDepositDecision = cache(
  async (): Promise<DepositDecision | null> =>
    apiGetOptional<DepositDecision>(ENDPOINTS.tenant.depositDecision),
);

export const getRentChange = cache(
  async (): Promise<RentChange | null> =>
    apiGetOptional<RentChange>(ENDPOINTS.tenant.rentChange),
);

export const getTenantMaintenance = cache(
  async (): Promise<TenantMaintenance> =>
    recoverableRead(
      "tenant maintenance",
      async () => {
        const body = await apiGet<unknown>(ENDPOINTS.tenant.maintenance);
        const requests =
          unwrapData<readonly BackendMaintenanceRequest[]>(body) ?? [];
        return toTenantMaintenance(requests);
      },
      { options: { categories: [], urgencies: [], units: [] }, requests: [] },
    ),
);

export const getConversations = cache(
  async (): Promise<readonly ConversationSummary[]> =>
    apiGet<readonly ConversationSummary[]>(ENDPOINTS.tenant.conversations),
);

export const getConversation = cache(
  async (conversationId: string): Promise<Conversation | null> =>
    apiGetOptional<Conversation>(
      ENDPOINTS.tenant.conversation(conversationId),
    ),
);

export const getNotifications = cache(
  async (): Promise<NotificationFeed> =>
    apiGet<NotificationFeed>(ENDPOINTS.tenant.notifications),
);

export const getReferralProgram = cache(
  async (): Promise<ReferralProgram | null> =>
    apiGetOptional<ReferralProgram>(ENDPOINTS.tenant.referrals),
);

export const getTenantApplications = cache(
  async (): Promise<readonly TenantApplication[]> =>
    recoverableRead(
      "tenant applications",
      async () => {
        const body = await apiGet<unknown>(ENDPOINTS.tenant.applications);
        const list = unwrapData<BackendApplicationList>(body);
        return (list?.applications ?? []).map(toTenantApplication);
      },
      [],
    ),
);

export const getLease = cache(
  async (): Promise<Lease | null> =>
    apiGetOptional<Lease>(ENDPOINTS.tenant.lease),
);

export const getTenantProfile = cache(
  async (): Promise<TenantProfile> =>
    recoverableRead(
      "tenant profile",
      async () => {
        const account = await apiGetDataOptional<AccountProfile>(
          ENDPOINTS.identity.me,
        );
        return toTenantProfile(account);
      },
      toTenantProfile(null),
    ),
);

export const getTenantSettings = cache(
  async (): Promise<TenantSettings> =>
    apiGet<TenantSettings>(ENDPOINTS.tenant.settings),
);
