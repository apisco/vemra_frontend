import type { ImageRef, Iso8601, Money, PersonRef } from "@/types/api/common";
import type {
  MaintenanceStatus,
  MaintenanceUrgency,
  NotificationPreferenceGroup,
  UnitRef,
} from "@/types/api/tenant";


export type PropertyStatus = "occupied" | "vacant";


export interface PropertyAdminRef extends PersonRef {
  assignedAt: Iso8601 | null;
  note: string | null;
}

export interface PropertyAdmin extends PersonRef {
  unitsManaged: number;
  properties: readonly string[];
  assignedAt: Iso8601 | null;
  isCertified: boolean;
}

export interface RevenuePoint {
  /** First day of the month the bar represents. */
  periodStart: Iso8601;
  amount: Money;
}

export interface NextRentDue {
  dueDate: Iso8601;
  unitName: string;
  amount: Money;
}

export interface LandlordDashboard {
  landlordName: string;
  propertyCount: number;
  occupiedCount: number;
  vacantCount: number;
  vacantSince: Iso8601 | null;
  vacantUnitName: string | null;
  readyToWithdraw: Money;
  clearedPaymentCount: number;
  monthlyRentRoll: Money;
  nextRentDue: NextRentDue | null;
  revenueSeries: readonly RevenuePoint[];
  assignedAdmin: PropertyAdmin | null;
  propertyAdmins: readonly PropertyAdmin[];
}

export interface LandlordPropertySummary {
  id: string;
  name: string;
  tenant: PersonRef | null;
  admin: PropertyAdminRef | null;
  rent: Money;
  rentPeriod: "year" | "month";
  status: PropertyStatus;
  vacantSince: Iso8601 | null;
  nextRentDueDate: Iso8601 | null;
  coverImage: ImageRef | null;
}

export interface LandlordProperty extends LandlordPropertySummary {
  description: string;
  bedrooms: number | null;
  bathrooms: number | null;
  address: string;
  listedSince: Iso8601 | null;
  photos: readonly ImageRef[];
  amenities: readonly string[];
  isPubliclyListed: boolean;
}

export interface PropertyPayload {
  address: string;
  rent: string;
  bedrooms: string;
  bathrooms: string;
  availableFrom: string;
  description: string;
  amenities: readonly string[];
}

export type RentApprovalStatus = "pending" | "approved" | "rejected";

export interface AuditEntry {
  id: string;
  title: string;
  detail: string;
  occurredAt: Iso8601;
}

export interface RentApprovalRequest {
  id: string;
  property: UnitRef;
  status: RentApprovalStatus;
  currentRent: Money;
  proposedRent: Money;
  rentPeriod: "year" | "month";
  changeRatio: number;
  effectiveFrom: Iso8601;
  reason: string;
  supportingNote: string | null;
  proposedBy: PersonRef | null;
  submittedAt: Iso8601;
  admin: PropertyAdmin | null;
  auditTrail: readonly AuditEntry[];
}

export type LandlordApplicationStatus =
  | "new"
  | "reviewed"
  | "approved"
  | "declined";

export interface ApplicationSummary {
  id: string;
  applicant: PersonRef;
  /** One-line summary, e.g. move-in date and occupation. */
  summary: string;
  status: LandlordApplicationStatus;
  submittedAt: Iso8601;
}

export interface ApplicationDocument {
  id: string;
  label: string;
  status: string;
  isVerified: boolean;
}

export interface LandlordApplication {
  id: string;
  applicant: PersonRef;
  status: LandlordApplicationStatus;
  listingName: string;
  employer: string | null;
  moveInDate: Iso8601 | null;
  submittedAt: Iso8601;
  note: string | null;
  documents: readonly ApplicationDocument[];
}

export interface ApplicationQueue {
  listingName: string | null;
  items: readonly ApplicationSummary[];
  counts: Readonly<Record<LandlordApplicationStatus | "all", number>>;
}

export type ApplicationDecision = "approve" | "decline" | "request_details";

export interface LandlordMaintenanceReport {
  id: string;
  propertyName: string;
  issue: string;
  category: string;
  urgency: MaintenanceUrgency;
  tenant: PersonRef | null;
  loggedAt: Iso8601;
  status: MaintenanceStatus;
}

export interface MaintenanceOverview {
  openCount: number;
  openNote: string | null;
  scheduledCount: number;
  scheduledNote: string | null;
  resolvedThisMonth: number;
  resolvedNote: string | null;
  reports: readonly LandlordMaintenanceReport[];
}

export type DepositLedgerStatus = "held" | "under_review" | "refunded";

export interface DepositLedgerEntry {
  id: string;
  propertyName: string;
  tenant: PersonRef | null;
  amount: Money;
  securedAt: Iso8601;
  status: DepositLedgerStatus;
}

export interface DeductionRecommendation {
  id: string;
  depositId: string;
  admin: PersonRef | null;
  propertyName: string;
  tenant: PersonRef | null;
  recommendedAmount: Money;
  escrowBalance: Money;
  reason: string;
  recommendedAt: Iso8601;
}

export interface CautionDepositsOverview {
  totalHeld: Money;
  activeTenancies: number;
  listingCount: number;
  pendingClaimCount: number;
  pendingClaimNote: string | null;
  recommendations: readonly DeductionRecommendation[];
  ledger: readonly DepositLedgerEntry[];
}

export interface PayoutAccount {
  id: string;
  bankName: string;
  /** Last four digits only. */
  maskedNumber: string;
  accountInitials: string;
  connectedAt: Iso8601;
  isVerified: boolean;
  withdrawalMethod: string;
  typicalArrival: string;
  /** Ratio, e.g. `0.025` for 2.5%. */
  platformFeeRatio: number;
  availableBalance: Money;
}

export type StatementEntryStatus =
  | "held"
  | "cleared"
  | "withdrawn"
  | "failed";

export interface StatementEntry {
  id: string;
  description: string;
  counterparty: string | null;
  date: Iso8601;
  status: StatementEntryStatus;
  amount: Money;
  isCredit: boolean;
}

export interface StatementSummary {
  held: Money;
  heldNote: string | null;
  cleared: Money;
  clearedPaymentCount: number;
  withdrawnThisMonth: Money;
  withdrawalCount: number;
}

export interface Statement {
  summary: StatementSummary;
  entries: readonly StatementEntry[];
}

export interface BreakdownLine {
  id: string;
  label: string;
  amount: Money;
}

export interface PaymentBreakdown {
  propertyName: string | null;
  lines: readonly BreakdownLine[];
  total: Money;
  methods: readonly {
    id: string;
    label: string;
    description: string | null;
    isRecommended: boolean;
  }[];
}

export interface LandlordTenant extends PersonRef {
  unitName: string;
  rent: Money;
  tenancyStart: Iso8601;
  nextRentDueDate: Iso8601 | null;
  status: string;
}

export interface LandlordProfile {
  fullName: string;
  email: string;
  phone: string | null;
  avatar: ImageRef | null;
}

export interface LandlordSettings {
  profile: LandlordProfile;
  notificationGroups: readonly NotificationPreferenceGroup[];
}
