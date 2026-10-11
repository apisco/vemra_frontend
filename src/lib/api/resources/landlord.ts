import "server-only";

import { cache } from "react";

import {
  toApplicationQueue,
  toLandlordProperty,
  toLandlordPropertySummary,
  toMaintenanceOverview,
  unwrapData,
} from "@/lib/api/adapters";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { recoverableRead, safeRead } from "@/lib/api/resilient";
import type { ReadResult } from "@/lib/api/resilient";
import {
  landlordDashboardSchema,
  notificationPreferencesSchema,
  parseOrThrow,
  readPayoutAccounts,
  walletSchema,
  withdrawalListSchema,
  type NotificationPreferences,
  type ParsedPayoutAccount,
  type Wallet,
  type Withdrawal,
} from "@/lib/api/schemas";
import { apiGet, apiGetOptional } from "@/lib/api/server";
import type { Money } from "@/types/api/common";
import type {
  ApplicationQueue,
  LandlordDashboard,
  LandlordProperty,
  LandlordPropertySummary,
  MaintenanceOverview,
} from "@/types/api/landlord";

const ZERO: Money = { minor: 0, currency: "NGN" };

function toMoney(
  value: { minor: number; currency: string } | null | undefined,
): Money {
  return value === null || value === undefined
    ? ZERO
    : { minor: value.minor, currency: value.currency };
}

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

export const getLandlordDashboard = cache(
  async (): Promise<ReadResult<LandlordDashboard>> =>
    safeRead("landlord dashboard", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.identity.landlordDashboard);
      const parsed = parseOrThrow(
        "landlord dashboard",
        landlordDashboardSchema,
        unwrapData<unknown>(body) ?? {},
      );

      return {
        landlordName: parsed.landlordName ?? "",
        propertyCount: parsed.propertyCount ?? 0,
        occupiedCount: parsed.occupiedCount ?? 0,
        vacantCount: parsed.vacantCount ?? 0,
        vacantSince: parsed.vacantSince ?? null,
        vacantUnitName: parsed.vacantUnitName ?? null,
        readyToWithdraw: toMoney(parsed.readyToWithdraw),
        clearedPaymentCount: parsed.clearedPaymentCount ?? 0,
        monthlyRentRoll: toMoney(parsed.monthlyRentRoll),
        nextRentDue:
          parsed.nextRentDue === null || parsed.nextRentDue === undefined
            ? null
            : {
                dueDate: parsed.nextRentDue.dueDate ?? "",
                unitName: parsed.nextRentDue.unitName ?? "",
                amount: toMoney(parsed.nextRentDue.amount),
              },
        revenueSeries: (parsed.revenueSeries ?? []).map((point) => ({
          periodStart: point.periodStart ?? "",
          amount: toMoney(point.amount),
        })),
        assignedAdmin: null,
        propertyAdmins: [],
      } satisfies LandlordDashboard;
    }),
);

export const getLandlordProperties = cache(
  async (): Promise<ReadResult<readonly LandlordPropertySummary[]>> =>
    safeRead("landlord properties", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.landlord.properties);
      const payload = unwrapData<unknown>(body);
      return rowsOf(payload, "properties").map(toLandlordPropertySummary);
    }),
);

export const getLandlordProperty = cache(
  async (propertyId: string): Promise<LandlordProperty | null> => {
    const body = await apiGetOptional<unknown>(
      ENDPOINTS.landlord.property(propertyId),
    );
    if (body === null) {
      return null;
    }
    const payload = unwrapData<unknown>(body);
    const property =
      payload !== null && typeof payload === "object" && "data" in payload
        ? (payload as { data: unknown }).data
        : payload;
    return property === null || property === undefined
      ? null
      : toLandlordProperty(property);
  },
);

export const getApplicationQueue = cache(
  async (): Promise<ReadResult<ApplicationQueue>> =>
    safeRead("landlord applications", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.landlord.applications);
      const payload = unwrapData<unknown>(body);
      return toApplicationQueue(rowsOf(payload, "data"));
    }),
);

export const getMaintenanceOverview = cache(
  async (): Promise<MaintenanceOverview> =>
    recoverableRead(
      "landlord maintenance",
      async () => {
        const body = await apiGet<unknown>(ENDPOINTS.landlord.maintenance);
        const payload = unwrapData<unknown>(body);
        const rows = rowsOf(payload, "issues");
        return toMaintenanceOverview(
          rows.length > 0 ? rows : rowsOf(payload, "maintenance"),
        );
      },
      {
        openCount: 0,
        openNote: null,
        scheduledCount: 0,
        scheduledNote: null,
        resolvedThisMonth: 0,
        resolvedNote: null,
        reports: [],
      },
    ),
);

export const getLandlordWallet = cache(
  async (): Promise<ReadResult<Wallet>> =>
    safeRead("landlord wallet", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.landlord.wallet);
      return parseOrThrow("wallet", walletSchema, unwrapData<unknown>(body));
    }),
);

export const getPayoutAccounts = cache(
  async (): Promise<ReadResult<readonly ParsedPayoutAccount[]>> =>
    safeRead("payout accounts", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.landlord.payoutAccounts);
      return readPayoutAccounts(unwrapData<unknown>(body));
    }),
);

export const getWithdrawals = cache(
  async (): Promise<ReadResult<readonly Withdrawal[]>> =>
    safeRead("withdrawals", async () => {
      const body = await apiGet<unknown>(ENDPOINTS.landlord.withdrawals);
      const parsed = parseOrThrow(
        "withdrawals",
        withdrawalListSchema,
        unwrapData<unknown>(body) ?? { withdrawals: [] },
      );
      return parsed.withdrawals;
    }),
);

export const getLandlordNotificationPreferences = cache(
  async (): Promise<ReadResult<NotificationPreferences>> =>
    safeRead("notification preferences", async () => {
      const body = await apiGet<unknown>(
        ENDPOINTS.landlord.notificationPreferences,
      );
      return parseOrThrow(
        "notification preferences",
        notificationPreferencesSchema,
        unwrapData<unknown>(body),
      );
    }),
);
