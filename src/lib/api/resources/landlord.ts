import "server-only";

import { cache } from "react";

import { ENDPOINTS } from "@/lib/api/endpoints";
import {
  toApplicationQueue,
  toLandlordDashboard,
  toLandlordProperty,
  toLandlordPropertySummary,
  toMaintenanceOverview,
  unwrapData,
} from "@/lib/api/adapters";
import { recoverableRead } from "@/lib/api/resilient";
import { apiGet, apiGetOptional } from "@/lib/api/server";
import type {
  ApplicationQueue,
  CautionDepositsOverview,
  LandlordApplication,
  LandlordDashboard,
  LandlordProperty,
  LandlordPropertySummary,
  LandlordSettings,
  MaintenanceOverview,
  PaymentBreakdown,
  PayoutAccount,
  RentApprovalRequest,
  Statement,
} from "@/types/api/landlord";
import type { NotificationPreferenceGroup } from "@/types/api/tenant";



export const getLandlordDashboard = cache(
  async (): Promise<LandlordDashboard> =>
    recoverableRead(
      "landlord dashboard",
      async () =>
        toLandlordDashboard(
          unwrapData<unknown>(
            await apiGet<unknown>(ENDPOINTS.identity.landlordDashboard),
          ),
        ),
      {
        landlordName: "",
        propertyCount: 0,
        occupiedCount: 0,
        vacantCount: 0,
        vacantSince: null,
        vacantUnitName: null,
        readyToWithdraw: { amount: 0, currency: "NGN" },
        clearedPaymentCount: 0,
        monthlyRentRoll: { amount: 0, currency: "NGN" },
        nextRentDue: null,
        revenueSeries: [],
        assignedAdmin: null,
        propertyAdmins: [],
      },
    ),
);

export const getLandlordProperties = cache(
  async (): Promise<readonly LandlordPropertySummary[]> =>
    recoverableRead(
      "landlord properties",
      async () => {
        const body = await apiGet<unknown>(ENDPOINTS.landlord.properties);
        const payload = unwrapData<{ properties?: readonly unknown[] }>(body);
        const rows = Array.isArray(payload?.properties) ? payload.properties : [];
        return rows.map(toLandlordPropertySummary);
      },
      [],
    ),
);

export const getLandlordProperty = cache(
  async (propertyId: string): Promise<LandlordProperty | null> =>
    recoverableRead(
      "landlord property",
      async () => {
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
      null,
    ),
);

export const getRentApproval = cache(
  async (propertyId: string): Promise<RentApprovalRequest | null> =>
    apiGetOptional<RentApprovalRequest>(
      ENDPOINTS.landlord.rentApproval(propertyId),
    ),
);

export const getApplicationQueue = cache(
  async (): Promise<ApplicationQueue> =>
    recoverableRead(
      "landlord applications",
      async () => {
        const body = await apiGet<unknown>(ENDPOINTS.landlord.applications);
        const payload = unwrapData<{ applications?: readonly unknown[] }>(body);
        const rows = Array.isArray(payload?.applications)
          ? payload.applications
          : [];
        return toApplicationQueue(rows);
      },
      {
        listingName: null,
        items: [],
        counts: { all: 0, new: 0, reviewed: 0, approved: 0, declined: 0 },
      },
    ),
);

export const getLandlordApplication = cache(
  async (applicationId: string): Promise<LandlordApplication | null> =>
    apiGetOptional<LandlordApplication>(
      ENDPOINTS.landlord.application(applicationId),
    ),
);

export const getMaintenanceOverview = cache(
  async (): Promise<MaintenanceOverview> =>
    recoverableRead(
      "landlord maintenance",
      async () => {
        const body = await apiGet<unknown>(ENDPOINTS.landlord.maintenance);
        const rows = unwrapData<readonly unknown[]>(body);
        return toMaintenanceOverview(Array.isArray(rows) ? rows : []);
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

export const getCautionDeposits = cache(
  async (): Promise<CautionDepositsOverview> =>
    apiGet<CautionDepositsOverview>(ENDPOINTS.landlord.cautionDeposits),
);

export const getPayoutAccount = cache(
  async (): Promise<PayoutAccount | null> =>
    apiGetOptional<PayoutAccount>(ENDPOINTS.landlord.payoutAccount),
);

export const getStatement = cache(
  async (): Promise<Statement> => apiGet<Statement>(ENDPOINTS.landlord.statement),
);

export const getPaymentBreakdown = cache(
  async (): Promise<PaymentBreakdown | null> =>
    apiGetOptional<PaymentBreakdown>(ENDPOINTS.landlord.paymentBreakdown),
);

export const getLandlordSettings = cache(
  async (): Promise<LandlordSettings> =>
    apiGet<LandlordSettings>(ENDPOINTS.landlord.settings),
);

export const getLandlordNotificationPreferences = cache(
  async (): Promise<readonly NotificationPreferenceGroup[]> =>
    apiGet<readonly NotificationPreferenceGroup[]>(
      ENDPOINTS.landlord.notificationPreferences,
    ),
);
