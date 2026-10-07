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
  Tenancy,
  TenantApplication,
  TenantDashboard,
  TenantMaintenance,
  TenantPayment,
  TenantProfile,
  TenantRentals,
  TenantSettings,
} from "@/types/api/tenant";



const getActiveLeaseId = cache(async (): Promise<string | null> => {
  try {
    const body = await apiGet<unknown>(ENDPOINTS.tenant.leases);
    const payload = unwrapData<unknown>(body);
    const rows = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as { leases?: unknown })?.leases)
        ? (payload as { leases: readonly unknown[] }).leases
        : [];
    const first = rows[0];
    return first !== null && typeof first === "object" && "id" in first
      ? String((first as { id: unknown }).id)
      : null;
  } catch {
    return null;
  }
});

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
    recoverableRead(
      "tenant payment plan",
      async () => {
        const leaseId = await getActiveLeaseId();
        return leaseId === null
          ? null
          : apiGetOptional<PaymentPlan>(
              ENDPOINTS.tenant.paymentPlan(leaseId),
            );
      },
      null,
    ),
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
  async (): Promise<CheckoutOptions | null> => null,
);

export const getTenantRentals = cache(
  async (): Promise<TenantRentals> =>
    recoverableRead<TenantRentals>(
      "tenant rentals",
      async () => {
        const body = await apiGet<unknown>(ENDPOINTS.tenant.leases);
        const payload = unwrapData<unknown>(body);
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as { leases?: unknown })?.leases)
            ? (payload as { leases: readonly unknown[] }).leases
            : [];
        const history = rows as readonly Tenancy[];
        const current: Tenancy | null = history[0] ?? null;
        return { current, history };
      },
      { current: null, history: [] },
    ),
);

export const getSavedProperties = cache(
  async (): Promise<readonly SavedProperty[]> =>
    recoverableRead(
      "saved properties",
      async () => {
        const body = await apiGet<unknown>(ENDPOINTS.tenant.savedProperties);
        const payload = unwrapData<unknown>(body);
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as { properties?: unknown })?.properties)
            ? (payload as { properties: readonly unknown[] }).properties
            : [];
        return rows
          .map((row) => {
            if (row === null || typeof row !== "object" || !("id" in row)) {
              return null;
            }
            const record = row as Record<string, unknown>;
            return {
              id: String(record.id),
              savedAt:
                typeof record.savedAt === "string" ? record.savedAt : "",
              listing: (record.listing ?? null) as unknown as SavedProperty["listing"],
            } satisfies SavedProperty;
          })
          .filter((row): row is SavedProperty => row !== null);
      },
      [],
    ),
);

export const getCautionDeposit = cache(
  async (): Promise<CautionDeposit | null> =>
    recoverableRead(
      "tenant caution deposit",
      async () => {
        const leaseId = await getActiveLeaseId();
        return leaseId === null
          ? null
          : apiGetOptional<CautionDeposit>(
              ENDPOINTS.tenant.cautionDeposit(leaseId),
            );
      },
      null,
    ),
);

export const getDepositDecision = cache(
  async (): Promise<DepositDecision | null> =>
    recoverableRead(
      "tenant deposit decision",
      async () => {
        const leaseId = await getActiveLeaseId();
        return leaseId === null
          ? null
          : apiGetOptional<DepositDecision>(
              ENDPOINTS.tenant.depositDecision(leaseId),
            );
      },
      null,
    ),
);

export const getRentChange = cache(
  async (): Promise<RentChange | null> =>
    recoverableRead(
      "tenant rent change",
      async () => {
        const leaseId = await getActiveLeaseId();
        return leaseId === null
          ? null
          : apiGetOptional<RentChange>(ENDPOINTS.tenant.rentChange(leaseId));
      },
      null,
    ),
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
    recoverableRead(
      "conversations",
      async () => {
        const body = await apiGet<unknown>(ENDPOINTS.tenant.conversations);
        const payload = unwrapData<unknown>(body);
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as { conversations?: unknown })?.conversations)
            ? (payload as { conversations: readonly unknown[] }).conversations
            : [];
        return rows as readonly ConversationSummary[];
      },
      [],
    ),
);

export const getConversation = cache(
  async (conversationId: string): Promise<Conversation | null> =>
    apiGetOptional<Conversation>(
      ENDPOINTS.tenant.conversation(conversationId),
    ),
);

export const getNotifications = cache(
  async (): Promise<NotificationFeed> =>
    recoverableRead(
      "notifications",
      async () => {
        const body = await apiGet<unknown>(ENDPOINTS.tenant.notifications);
        const payload = unwrapData<unknown>(body);
        if (Array.isArray(payload)) {
          return { items: payload, unreadCount: 0 } as NotificationFeed;
        }
        const record = payload as
          | { items?: unknown; unreadCount?: unknown }
          | null;
        return {
          items: Array.isArray(record?.items) ? record.items : [],
          unreadCount:
            typeof record?.unreadCount === "number" ? record.unreadCount : 0,
        } as NotificationFeed;
      },
      { items: [], unreadCount: 0 },
    ),
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
    recoverableRead(
      "tenant lease",
      async () => {
        const leaseId = await getActiveLeaseId();
        return leaseId === null
          ? null
          : apiGetOptional<Lease>(ENDPOINTS.tenant.lease(leaseId));
      },
      null,
    ),
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
    recoverableRead(
      "tenant settings",
      async () => {
        const body = await apiGet<unknown>(ENDPOINTS.tenant.settings);
        const payload = unwrapData<unknown>(body) as Partial<TenantSettings> | null;
        return {
          notificationGroups: Array.isArray(payload?.notificationGroups)
            ? payload.notificationGroups
            : [],
        };
      },
      { notificationGroups: [] },
    ),
);
