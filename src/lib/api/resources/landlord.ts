import "server-only";

import { cache } from "react";

import { ENDPOINTS } from "@/lib/api/endpoints";
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
  LandlordTenant,
  MaintenanceOverview,
  PaymentBreakdown,
  PayoutAccount,
  PropertyAdmin,
  RentApprovalRequest,
  Statement,
} from "@/types/api/landlord";
import type { NotificationPreferenceGroup } from "@/types/api/tenant";

/** Landlord reads. Per-user, so `no-store`; `cache()` dedupes per render. */

export const getLandlordDashboard = cache(
  async (): Promise<LandlordDashboard> =>
    recoverableRead(
      "landlord dashboard",
      () => apiGet<LandlordDashboard>(ENDPOINTS.landlord.dashboard),
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
      () =>
        apiGet<readonly LandlordPropertySummary[]>(
          ENDPOINTS.landlord.properties,
        ),
      [],
    ),
);

export const getLandlordProperty = cache(
  async (propertyId: string): Promise<LandlordProperty | null> =>
    apiGetOptional<LandlordProperty>(ENDPOINTS.landlord.property(propertyId)),
);

export const getRentApproval = cache(
  async (propertyId: string): Promise<RentApprovalRequest | null> =>
    apiGetOptional<RentApprovalRequest>(
      ENDPOINTS.landlord.rentApproval(propertyId),
    ),
);

export const getApplicationQueue = cache(
  async (): Promise<ApplicationQueue> =>
    apiGet<ApplicationQueue>(ENDPOINTS.landlord.applications),
);

export const getLandlordApplication = cache(
  async (applicationId: string): Promise<LandlordApplication | null> =>
    apiGetOptional<LandlordApplication>(
      ENDPOINTS.landlord.application(applicationId),
    ),
);

export const getMaintenanceOverview = cache(
  async (): Promise<MaintenanceOverview> =>
    apiGet<MaintenanceOverview>(ENDPOINTS.landlord.maintenance),
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

export const getPropertyAdmins = cache(
  async (): Promise<readonly PropertyAdmin[]> =>
    apiGet<readonly PropertyAdmin[]>(ENDPOINTS.landlord.propertyAdmins),
);

export const getLandlordTenants = cache(
  async (): Promise<readonly LandlordTenant[]> =>
    apiGet<readonly LandlordTenant[]>(ENDPOINTS.landlord.tenants),
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
