import "server-only";

import { cache } from "react";

import {
  toTenantApplication,
  toTenantMaintenance,
  toTenantPayment,
  toTenantProfile,
  unwrapData,
  type BackendApplication,
  type BackendMaintenanceRequest,
} from "@/lib/api/adapters";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { recoverableRead, safeRead } from "@/lib/api/resilient";
import type { ReadResult } from "@/lib/api/resilient";
import {
  leaseListSchema,
  leaseSchema,
  notificationPreferencesSchema,
  paymentListSchema,
  parseOrThrow,
  tenantDashboardSchema,
  walletSchema,
  withdrawalListSchema,
  type LeaseSummary,
  type NotificationPreferences,
  type ParsedLease,
  type Wallet,
} from "@/lib/api/schemas";
import { apiGet, apiGetOptional } from "@/lib/api/server";
import { isUuid } from "@/lib/validation";
import type { AccountProfile } from "@/types/api/auth";
import type { Money } from "@/types/api/common";
import type {
  Conversation,
  ConversationSummary,
  NotificationFeed,
  ReferralProgram,
  SavedProperty,
  TenantApplication,
  TenantDashboard,
  TenantMaintenance,
  TenantPayment,
  TenantProfile,
} from "@/types/api/tenant";

const ACTIVE_LEASE_STATUSES = new Set(["ACTIVE", "SIGNED", "DRAFT"]);

function rowsOf(payload: unknown, key: string): readonly unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload !== null && typeof payload === "object") {
    const value = (payload as Record<string, unknown>)[key];
    if (Array.isArray(value)) {
      return value;
    }
  }
  return [];
}

export const getTenantLeases = cache(
  async (): Promise<ReadResult<readonly LeaseSummary[]>> =>
    safeRead("tenant leases", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.tenant.leases);
      const payload = unwrapData<unknown>(body);
      return parseOrThrow("leases", leaseListSchema, rowsOf(payload, "leases"));
    }),
);

export type LeaseSelection =
  | { kind: "resolved"; leaseId: string; leases: readonly LeaseSummary[] }
  | { kind: "choose"; leases: readonly LeaseSummary[] }
  | { kind: "none" }
  | { kind: "invalid" }
  | { kind: "error"; message: string; requestId: string | null; isWaking: boolean };

export async function resolveLeaseSelection(
  requested: string | null,
): Promise<LeaseSelection> {
  if (requested !== null && !isUuid(requested)) {
    return { kind: "invalid" };
  }

  const result = await getTenantLeases();
  if (!result.ok) {
    return {
      kind: "error",
      message: result.message,
      requestId: result.requestId,
      isWaking: result.isWaking,
    };
  }

  const leases = result.data;
  const active = leases.filter(
    (lease) =>
      lease.status === undefined || ACTIVE_LEASE_STATUSES.has(lease.status),
  );

  if (requested !== null) {
    return leases.some((lease) => lease.id === requested)
      ? { kind: "resolved", leaseId: requested, leases }
      : { kind: "invalid" };
  }

  if (active.length === 1) {
    const only = active[0] as LeaseSummary;
    return { kind: "resolved", leaseId: only.id, leases };
  }
  if (active.length > 1) {
    return { kind: "choose", leases: active };
  }
  return { kind: "none" };
}

export const getTenantDashboard = cache(
  async (): Promise<ReadResult<TenantDashboard>> =>
    safeRead("tenant dashboard", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.identity.tenantDashboard);
      const parsed = parseOrThrow(
        "tenant dashboard",
        tenantDashboardSchema,
        unwrapData<unknown>(body) ?? {},
      );

      const toMoney = (value: { minor: number; currency: string }): Money => ({
        minor: value.minor,
        currency: value.currency,
      });

      return {
        tenantName: parsed.tenantName ?? "",
        unit:
          parsed.unit === null || parsed.unit === undefined
            ? null
            : {
                id: parsed.unit.id,
                name: parsed.unit.name ?? "",
                propertyId: parsed.unit.propertyId ?? "",
              },
        rentDue:
          parsed.rentDue === null || parsed.rentDue === undefined
            ? null
            : {
                dueDate: parsed.rentDue.dueDate ?? "",
                amount: toMoney(parsed.rentDue.amount),
              },
        nextPayment:
          parsed.nextPayment === null || parsed.nextPayment === undefined
            ? null
            : {
                amount: toMoney(parsed.nextPayment.amount),
                allowsInstallments:
                  parsed.nextPayment.allowsInstallments ?? false,
              },
        planProgress:
          parsed.planProgress === null || parsed.planProgress === undefined
            ? null
            : {
                paidAmount: toMoney(parsed.planProgress.paidAmount),
                totalAmount: toMoney(parsed.planProgress.totalAmount),
                paidInstallments: parsed.planProgress.paidInstallments ?? 0,
                totalInstallments: parsed.planProgress.totalInstallments ?? 0,
              },
      } satisfies TenantDashboard;
    }),
);

export const getTenantPayments = cache(
  async (): Promise<ReadResult<readonly TenantPayment[]>> =>
    safeRead("tenant payments", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.tenant.payments);
      const parsed = parseOrThrow(
        "payments",
        paymentListSchema,
        unwrapData<unknown>(body) ?? { payments: [] },
      );
      return parsed.payments.map((payment) =>
        toTenantPayment({
          id: payment.id,
          reference: payment.reference,
          amountMinor: String(payment.amountMinor),
          currency: payment.currency,
          status: payment.status,
          createdAt: payment.createdAt,
        }),
      );
    }),
);

export const getLatestPaymentForLease = cache(
  async (leaseId: string): Promise<ReadResult<ParsedPaymentStatus | null>> =>
    safeRead("payment status", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.tenant.payments, {
        query: { leaseId, limit: 5 },
      });
      const parsed = parseOrThrow(
        "payments",
        paymentListSchema,
        unwrapData<unknown>(body) ?? { payments: [] },
      );
      const forLease = parsed.payments.filter(
        (payment) => payment.leaseId === leaseId,
      );
      if (forLease.length === 0) {
        return null;
      }
      const latest = forLease.reduce((newest, candidate) =>
        candidate.createdAt > newest.createdAt ? candidate : newest,
      );
      return {
        reference: latest.reference,
        status: latest.status.toUpperCase(),
        amount: { minor: latest.amountMinor, currency: latest.currency },
        createdAt: latest.createdAt,
      };
    }),
);

export interface ParsedPaymentStatus {
  reference: string;
  status: string;
  amount: Money;
  createdAt: string;
}

export const getTenantWallet = cache(
  async (): Promise<ReadResult<Wallet>> =>
    safeRead("tenant wallet", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.tenant.wallet);
      return parseOrThrow("wallet", walletSchema, unwrapData<unknown>(body));
    }),
);

export const getTenantWithdrawals = cache(
  async () =>
    safeRead("tenant withdrawals", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.tenant.withdrawals);
      const parsed = parseOrThrow(
        "withdrawals",
        withdrawalListSchema,
        unwrapData<unknown>(body) ?? { withdrawals: [] },
      );
      return parsed.withdrawals;
    }),
);

export const getLease = cache(
  async (leaseId: string): Promise<ReadResult<ParsedLease>> =>
    safeRead("tenant lease", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.tenant.lease(leaseId));
      return parseOrThrow("lease", leaseSchema, unwrapData<unknown>(body));
    }),
);

export const getPaymentPlan = cache(
  async (leaseId: string): Promise<ReadResult<unknown | null>> =>
    safeRead("tenant payment plan", async () => {
      const body = await apiGetOptional<unknown>(
        ENDPOINTS.tenant.paymentPlan(leaseId),
      );
      return body === null ? null : unwrapData<unknown>(body);
    }),
);

export const getDeposit = cache(
  async (leaseId: string): Promise<ReadResult<unknown | null>> =>
    safeRead("tenant caution deposit", async () => {
      const body = await apiGetOptional<unknown>(
        ENDPOINTS.tenant.deposit(leaseId),
      );
      return body === null ? null : unwrapData<unknown>(body);
    }),
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
          : rowsOf(payload, "properties");
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
              listing: (record.listing ??
                null) as unknown as SavedProperty["listing"],
            } satisfies SavedProperty;
          })
          .filter((row): row is SavedProperty => row !== null);
      },
      [],
    ),
);

export const getTenantMaintenance = cache(
  async (): Promise<TenantMaintenance> =>
    recoverableRead(
      "tenant maintenance",
      async () => {
        const body = await apiGet<unknown>(ENDPOINTS.tenant.maintenance);
        const payload = unwrapData<unknown>(body);
        const rows = rowsOf(payload, "issues");
        return toTenantMaintenance(
          (rows.length > 0
            ? rows
            : rowsOf(payload, "maintenance")) as readonly BackendMaintenanceRequest[],
        );
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
        return rowsOf(payload, "conversations") as readonly ConversationSummary[];
      },
      [],
    ),
);

export const getConversation = cache(
  async (conversationId: string): Promise<Conversation | null> =>
    apiGetOptional<Conversation>(
      ENDPOINTS.tenant.conversationMessages(conversationId),
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
          | { items?: unknown; notifications?: unknown; unreadCount?: unknown }
          | null;
        const items = Array.isArray(record?.items)
          ? record.items
          : Array.isArray(record?.notifications)
            ? record.notifications
            : [];
        return {
          items,
          unreadCount:
            typeof record?.unreadCount === "number" ? record.unreadCount : 0,
        } as NotificationFeed;
      },
      { items: [], unreadCount: 0 },
    ),
);

export const getNotificationPreferences = cache(
  async (): Promise<ReadResult<NotificationPreferences>> =>
    safeRead("notification preferences", async () => {
      const body = await apiGet<unknown>(
        ENDPOINTS.tenant.notificationPreferences,
      );
      return parseOrThrow(
        "notification preferences",
        notificationPreferencesSchema,
        unwrapData<unknown>(body),
      );
    }),
);

export const getReferralProgram = cache(
  async (): Promise<ReferralProgram | null> =>
    recoverableRead(
      "referrals",
      async () =>
        apiGetOptional<ReferralProgram>(ENDPOINTS.tenant.referrals),
      null,
    ),
);

export const getTenantApplications = cache(
  async (): Promise<ReadResult<readonly TenantApplication[]>> =>
    safeRead("tenant applications", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.tenant.applications);
      const payload = unwrapData<unknown>(body);
      const rows = rowsOf(payload, "data");
      return rows
        .filter(
          (row): row is BackendApplication =>
            row !== null && typeof row === "object" && "id" in row,
        )
        .map(toTenantApplication);
    }),
);

export const getTenantProfile = cache(
  async (): Promise<ReadResult<TenantProfile>> =>
    safeRead("tenant profile", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.identity.me);
      return toTenantProfile(unwrapData<AccountProfile>(body));
    }),
);
