import "server-only";

import { cache } from "react";

import {
  toTenantApplication,
  toTenantMaintenance,
  toTenantPayment,
  toTenantProfile,
  unwrapData,
  type BackendMaintenanceRequest,
} from "@/lib/api/adapters";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { isApiError } from "@/lib/api/errors";
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
  Referral,
  ReferralProgram,
  ReferralStatus,
  SavedProperty,
  TenantApplication,
  TenantDashboard,
  TenantMaintenance,
  TenantPayment,
  TenantProfile,
} from "@/types/api/tenant";

const ACTIVE_LEASE_STATUSES = new Set(["ACTIVE", "SIGNED", "DRAFT"]);

function rowsOf(payload: unknown, ...keys: string[]): readonly unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload !== null && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of keys) {
      const value = record[key];
      if (Array.isArray(value)) {
        return value;
      }
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
        let body: unknown;
        try {
          body = await apiGet<unknown>(ENDPOINTS.tenant.savedProperties);
        } catch (error) {
          // A 400 naming `PropertyId` means the backend matched this call as
          // `/properties/{propertyId}` and rejected the literal "saved" as a
          // UUID. Degrade to an empty list so the page still renders; the real
          // fix is registering `/properties/saved` ahead of the param route.
          if (isApiError(error) && error.status === 400) {
            console.warn(
              "[api] saved properties: GET /properties/saved was rejected with 400; check backend route ordering. Serving fallback.",
            );
            return [];
          }
          throw error;
        }

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

const REFERRAL_STATUSES: Readonly<Record<string, ReferralStatus>> = {
  PENDING: "pending",
  QUALIFIED: "joined",
  REWARDED: "completed",
};

function readRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function readAmountMinor(value: unknown): number | null {
  return typeof value === "string" && /^\d+$/.test(value)
    ? Number(value)
    : null;
}

function toReferral(value: unknown): Referral | null {
  const record = readRecord(value);
  const id = typeof record.id === "string" ? record.id : null;
  if (id === null) {
    return null;
  }

  const rewardMinor = readAmountMinor(record.rewardMinor);
  return {
    id,
    name:
      (typeof record.name === "string" && record.name !== ""
        ? record.name
        : null) ??
      (typeof record.referredId === "string" && record.referredId !== ""
        ? record.referredId
        : "Referral"),
    status:
      typeof record.status === "string"
        ? (REFERRAL_STATUSES[record.status.toUpperCase()] ?? "pending")
        : "pending",
    joinedAt: typeof record.createdAt === "string" ? record.createdAt : null,
    completedAt:
      typeof record.qualifiedAt === "string" ? record.qualifiedAt : null,
    reward:
      rewardMinor === null
        ? null
        : {
            minor: rewardMinor,
            currency:
              typeof record.currency === "string" ? record.currency : "NGN",
          },
  };
}

/**
 * `GET /referrals` returns a bare array of referral rows while the counts live
 * on `/referrals/stats` and the code on `/referrals/code`, so the three are
 * composed into the single `ReferralProgram` the screen expects. An array-only
 * payload used to be cast straight to `ReferralProgram`, which then crashed
 * reading `.referrals.map` off it.
 */
export const getReferralProgram = cache(
  async (): Promise<ReferralProgram | null> =>
    recoverableRead(
      "referrals",
      async () => {
        const [list, stats, code] = await Promise.all([
          apiGetOptional<unknown>(ENDPOINTS.tenant.referrals),
          apiGetOptional<unknown>(ENDPOINTS.tenant.referralStats),
          apiGetOptional<unknown>(ENDPOINTS.tenant.referralCode),
        ]);

        if (list === null && stats === null && code === null) {
          return null;
        }

        const listRecord = readRecord(list);
        const rows = Array.isArray(list)
          ? list
          : Array.isArray(listRecord.referrals)
            ? (listRecord.referrals as readonly unknown[])
            : [];

        const referrals = rows
          .map(toReferral)
          .filter((referral): referral is Referral => referral !== null);

        const statsRecord = readRecord(stats);
        const codeRecord = readRecord(code);
        const rewardsEarnedMinor = readAmountMinor(statsRecord.totalRewardMinor);

        return {
          shareUrl: typeof codeRecord.code === "string" ? codeRecord.code : "",
          referredCount:
            typeof statsRecord.totalReferrals === "number"
              ? statsRecord.totalReferrals
              : referrals.length,
          successfulCount:
            typeof statsRecord.rewardedCount === "number"
              ? statsRecord.rewardedCount
              : referrals.filter((referral) => referral.status === "completed")
                  .length,
          rewardsEarned: {
            minor: rewardsEarnedMinor ?? 0,
            currency:
              typeof statsRecord.currency === "string"
                ? statsRecord.currency
                : "NGN",
          },
          referrals,
        } satisfies ReferralProgram;
      },
      null,
    ),
);

export const getTenantApplications = cache(
  async (): Promise<ReadResult<readonly TenantApplication[]>> =>
    safeRead("tenant applications", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.tenant.applications);
      const payload = unwrapData<unknown>(body);
      const rows = rowsOf(
        payload,
        "data",
        "applications",
        "items",
        "results",
        "rows",
      );

      if (rows.length === 0) {
        // The list items are untyped in the spec and the endpoint has drifted
        // from it, so surface the envelope's keys when nothing is found.
        console.warn(
          "[api] tenant applications: no rows found; payload keys =",
          payload !== null && typeof payload === "object"
            ? Object.keys(payload as Record<string, unknown>)
            : typeof payload,
        );
      }

      return rows
        .filter(
          (row): row is Record<string, unknown> =>
            row !== null && typeof row === "object",
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
