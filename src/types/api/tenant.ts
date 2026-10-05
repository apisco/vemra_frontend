import type {
  ImageRef,
  Iso8601,
  Money,
  PersonRef,
} from "@/types/api/common";
import type { ListingSummary } from "@/types/api/listing";

export interface UnitRef {
  id: string;
  name: string;
  propertyId: string;
}

export type TenancyStatus = "active" | "ended" | "pending";

export interface Tenancy {
  id: string;
  unit: UnitRef;
  status: TenancyStatus;
  landlord: PersonRef | null;
  rent: Money;
  rentPeriod: "year" | "month";
  startDate: Iso8601;
  endDate: Iso8601 | null;
  nextRentDueDate: Iso8601 | null;
}

export interface RentDue {
  dueDate: Iso8601;
  amount: Money;
}

export interface NextPayment {
  amount: Money;
  allowsInstallments: boolean;
}

export interface PaymentPlanProgress {
  paidAmount: Money;
  totalAmount: Money;
  paidInstallments: number;
  totalInstallments: number;
}

export interface TenantDashboard {
  tenantName: string;
  unit: UnitRef | null;
  rentDue: RentDue | null;
  nextPayment: NextPayment | null;
  planProgress: PaymentPlanProgress | null;
}

export type InstallmentStatus = "paid" | "upcoming" | "overdue";

export interface Installment {
  id: string;
  sequence: number;
  amount: Money;
  dueDate: Iso8601;
  paidAt: Iso8601 | null;
  status: InstallmentStatus;
}

export interface PaymentPlan {
  id: string;
  periodStart: Iso8601;
  totalAmount: Money;
  paidAmount: Money;
  installments: readonly Installment[];
  isActive: boolean;
}

export type PaymentStatus = "cleared" | "pending" | "held" | "failed";

export interface TenantPayment {
  id: string;
  label: string;
  amount: Money;
  date: Iso8601;
  status: PaymentStatus;
  method: string | null;
  reference: string | null;
}

export interface CheckoutSummary {
  label: string;
  amount: Money;
  unit: UnitRef | null;
  landlordName: string | null;
  dueDate: Iso8601 | null;
  installmentSequence: number | null;
  installmentTotal: number | null;
}

export type PaymentMethodKind = "card" | "bank" | "wallet";

export interface PaymentMethodOption {
  value: PaymentMethodKind;
  label: string;
  description: string | null;
  isAvailable: boolean;
}

export interface CheckoutOptions {
  summary: CheckoutSummary;
  methods: readonly PaymentMethodOption[];
}

export interface CardPaymentPayload {
  method: PaymentMethodKind;
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardName: string;
}

export type PaymentOutcome = "succeeded" | "declined" | "requires_action";

export interface PaymentResult {
  outcome: PaymentOutcome;
  paymentId: string | null;
  declineCode: string | null;
  declineReason: string | null;
  redirectUrl: string | null;
}

export interface TenantContact extends PersonRef {
  role: string;
  note: string | null;
  isVerified: boolean;
  canContact: boolean;
  responseTime: string | null;
}

export interface TenantRentals {
  current: Tenancy | null;
  history: readonly Tenancy[];
}

export type DepositStage =
  | "held"
  | "pending_inspection"
  | "eligible_for_refund"
  | "refunded";

export interface DepositTimelineEntry {
  stage: DepositStage;
  label: string;
  isComplete: boolean;
  occurredAt: Iso8601 | null;
}

export interface DepositDeduction {
  id: string;
  amount: Money;
  reason: string;
  recordedAt: Iso8601;
}

export interface CautionDeposit {
  id: string;
  amount: Money;
  unit: UnitRef | null;
  status: string;
  paidAt: Iso8601 | null;
  tenancyStart: Iso8601 | null;
  tenancyEnd: Iso8601 | null;
  timeline: readonly DepositTimelineEntry[];
  deductions: readonly DepositDeduction[];
  hasPendingDecision: boolean;
}

export type DepositDecisionOutcome = "full_refund" | "partial_refund" | "withheld";

export interface DepositDecision {
  id: string;
  outcome: DepositDecisionOutcome;
  depositAmount: Money;
  deductedAmount: Money;
  refundAmount: Money;
  deductions: readonly DepositDeduction[];
  decidedAt: Iso8601;
  respondBy: Iso8601 | null;
  summary: string;
}

export interface RentChange {
  id: string;
  currentRent: Money;
  newRent: Money;
  rentPeriod: "year" | "month";
  effectiveFrom: Iso8601;
  reason: string | null;
  approvedAt: Iso8601;
  unit: UnitRef | null;
}

export type MaintenanceStatus =
  | "open"
  | "scheduled"
  | "in_progress"
  | "resolved";

export type MaintenanceUrgency = "low" | "normal" | "high";

export interface MaintenanceRequest {
  id: string;
  title: string;
  category: string;
  urgency: MaintenanceUrgency;
  status: MaintenanceStatus;
  description: string;
  submittedAt: Iso8601;
  resolvedAt: Iso8601 | null;
  unit: UnitRef | null;
}

export interface MaintenanceOptions {
  categories: readonly string[];
  urgencies: readonly { value: MaintenanceUrgency; label: string }[];
  units: readonly UnitRef[];
}

export interface TenantMaintenance {
  options: MaintenanceOptions;
  requests: readonly MaintenanceRequest[];
}

export interface MaintenancePayload {
  unitId: string;
  category: string;
  urgency: MaintenanceUrgency;
  description: string;
}

export interface ConversationSummary {
  id: string;
  participant: PersonRef;
  participantRole: string;
  lastMessagePreview: string;
  lastMessageAt: Iso8601;
  unreadCount: number;
}

export interface Message {
  id: string;
  body: string;
  sentAt: Iso8601;
  isOwn: boolean;
  authorName: string;
}

export interface Conversation {
  id: string;
  participant: PersonRef;
  participantRole: string;
  messages: readonly Message[];
}

export interface TenantNotification {
  id: string;
  title: string;
  body: string | null;
  createdAt: Iso8601;
  isRead: boolean;
  href: string | null;
  category: string | null;
}

export interface NotificationFeed {
  items: readonly TenantNotification[];
  unreadCount: number;
}

export type ReferralStatus = "pending" | "joined" | "completed";

export interface Referral {
  id: string;
  name: string;
  status: ReferralStatus;
  joinedAt: Iso8601 | null;
  completedAt: Iso8601 | null;
  reward: Money | null;
}

export interface ReferralProgram {
  shareUrl: string;
  referredCount: number;
  successfulCount: number;
  rewardsEarned: Money;
  referrals: readonly Referral[];
}

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "declined";

export interface TenantApplication {
  id: string;
  listing: ListingSummary | null;
  status: ApplicationStatus;
  submittedAt: Iso8601 | null;
  moveInDate: Iso8601 | null;
  /** Expected turnaround copy from the backend, e.g. `"2–3 days"`. */
  decisionWindow: string | null;
  reviewers: readonly PersonRef[];
}

export interface ApplicationPayload {
  listingId: string;
  fullName: string;
  moveInDate: string;
  employer: string;
  note: string;
}

export type LeaseStatus = "pending" | "ready" | "signed";

export interface Lease {
  id: string;
  status: LeaseStatus;
  unit: UnitRef | null;
  landlordName: string | null;
  rent: Money;
  rentPeriod: "year" | "month";
  startDate: Iso8601 | null;
  endDate: Iso8601 | null;
  documentUrl: string | null;
  signedAt: Iso8601 | null;
}

export interface SavedProperty {
  id: string;
  savedAt: Iso8601;
  listing: ListingSummary;
}

export interface TenantProfile {
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  avatar: ImageRef | null;
  isVerified: boolean;
  verificationNote: string | null;
}

export interface NotificationPreference {
  id: string;
  label: string;
  description: string | null;
  isEnabled: boolean;
}

export interface NotificationPreferenceGroup {
  id: string;
  title: string;
  preferences: readonly NotificationPreference[];
}

export interface TenantSettings {
  notificationGroups: readonly NotificationPreferenceGroup[];
}
