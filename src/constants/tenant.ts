import { BellIcon } from "@/components/icons/bell-icon";
import { CreditCardIcon } from "@/components/icons/credit-card-icon";
import { EllipsisIcon } from "@/components/icons/ellipsis-icon";
import { FileTextIcon } from "@/components/icons/file-text-icon";
import { GiftIcon } from "@/components/icons/gift-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { HouseIcon } from "@/components/icons/house-icon";
import { LayoutGridIcon } from "@/components/icons/layout-grid-icon";
import { MessageCircleIcon } from "@/components/icons/message-circle-icon";
import { SettingsIcon } from "@/components/icons/settings-icon";
import { ShieldIcon } from "@/components/icons/shield-icon";
import { WalletIcon } from "@/components/icons/wallet-icon";
import { WrenchIcon } from "@/components/icons/wrench-icon";
import type { ResponsiveCopy } from "@/components/ui/responsive-text";
import type {
  DashboardNavItem,
  DashboardUser,
  MetricTone,
} from "@/types/dashboard";

export type { DashboardNavItem, DashboardUser, MetricTone };

export const TENANT_ROUTES = {
  overview: "/tenant",
  messages: "/tenant/messages",
  paymentPlan: "/tenant/payment-plan",
  paymentHistory: "/tenant/payment-history",
  maintenance: "/tenant/maintenance",
  rentSavings: "/tenant/rent-savings",
  cautionDeposit: "/tenant/caution-deposit",
  savedProperties: "/tenant/saved-properties",
  myRentals: "/tenant/my-rentals",
  referrals: "/tenant/referrals",
  notifications: "/tenant/notifications",
  settings: "/tenant/settings",
  profile: "/tenant/profile",
} as const;

export const TENANT_NAV: readonly DashboardNavItem[] = [
  { href: TENANT_ROUTES.overview, label: "Overview", icon: LayoutGridIcon },
  { href: TENANT_ROUTES.messages, label: "Messages", icon: MessageCircleIcon },
  {
    href: TENANT_ROUTES.paymentPlan,
    label: "Payment plan",
    icon: CreditCardIcon,
  },
  {
    href: TENANT_ROUTES.paymentHistory,
    label: "Payment history",
    icon: FileTextIcon,
  },
  { href: TENANT_ROUTES.maintenance, label: "Maintenance", icon: WrenchIcon },
  { href: TENANT_ROUTES.rentSavings, label: "Rent savings", icon: WalletIcon },
  {
    href: TENANT_ROUTES.cautionDeposit,
    label: "Caution deposit",
    icon: ShieldIcon,
  },
  {
    href: TENANT_ROUTES.savedProperties,
    label: "Saved properties",
    icon: HeartIcon,
  },
  { href: TENANT_ROUTES.myRentals, label: "My rentals", icon: HouseIcon },
  { href: TENANT_ROUTES.referrals, label: "Referrals", icon: GiftIcon },
  { href: TENANT_ROUTES.notifications, label: "Notifications", icon: BellIcon },
  { href: TENANT_ROUTES.settings, label: "Settings", icon: SettingsIcon },
];

export const TENANT_NAV_TABLET: readonly DashboardNavItem[] = [
  { href: TENANT_ROUTES.overview, label: "Overview", icon: LayoutGridIcon },
  { href: TENANT_ROUTES.messages, label: "Messages", icon: MessageCircleIcon },
  { href: TENANT_ROUTES.myRentals, label: "My Rentals", icon: HouseIcon },
  { href: TENANT_ROUTES.settings, label: "Settings", icon: SettingsIcon },
];

export const TENANT_NAV_MOBILE: readonly DashboardNavItem[] = [
  { href: TENANT_ROUTES.overview, label: "Overview", icon: LayoutGridIcon },
  { href: TENANT_ROUTES.messages, label: "Messages", icon: MessageCircleIcon },
  {
    href: TENANT_ROUTES.paymentPlan,
    label: "Payments",
    icon: CreditCardIcon,
  },
  { href: TENANT_ROUTES.maintenance, label: "Maintenance", icon: WrenchIcon },
  { href: TENANT_ROUTES.settings, label: "More", icon: EllipsisIcon },
];

export const TENANT_USER: DashboardUser = {
  name: "Aisha Bello",
  role: "Tenant",
  initials: "AB",
};

export const TENANT_DASHBOARD = {
  greeting: "Hi Aisha",
  unit: "Unit 4B · Maple and 9th",
  action: {
    label: { base: "Pay Rent", md: "Make a payment" },
    href: TENANT_ROUTES.paymentPlan,
  },
} as const;

export interface TenantMetric {
  label: ResponsiveCopy;
  value: string;
  detail: ResponsiveCopy;
  tone: MetricTone;
}

export const TENANT_METRICS: readonly TenantMetric[] = [
  {
    label: { base: "Rent due" },
    value: "Sep 5",
    detail: { base: "4 days from today" },
    tone: "warning",
  },
  {
    label: { base: "Next payment" },
    value: "₦1,450",
    detail: {
      base: "Full month or continue plan",
      md: "Full month or installment",
      lg: "Full month or continue your plan",
    },
    tone: "default",
  },
  {
    label: {
      base: "On a payment plan",
      md: "Payment plan active",
      lg: "On a payment plan",
    },
    value: "₦900 of ₦1,450",
    detail: { base: "2 of 3 installments paid" },
    tone: "brand",
  },
];

export interface Installment {
  label: string;
  status: string;
  amount: string;
  badge: string;
  isPaid: boolean;
}

export const TENANT_PAYMENT_PLAN = {
  title: { base: "September Rent Plan", md: "Payment plan · September rent" },
  editLabel: { base: "Edit", md: "Edit plan" },
  editHref: TENANT_ROUTES.paymentPlan,
  paidValue: "₦900 paid",
  totalValue: "of ₦1,450 total",
  summaryShort: "₦900 paid of ₦1,450",
  progressLabel: "September rent paid",
  progressPercent: 62,
  installments: [
    {
      label: "Installment 1",
      status: "Paid on Aug 20",
      amount: "₦500",
      badge: "Paid",
      isPaid: true,
    },
    {
      label: "Installment 2",
      status: "Paid on Aug 29",
      amount: "₦400",
      badge: "Paid",
      isPaid: true,
    },
    {
      label: "Installment 3",
      status: "Due on Sep 5",
      amount: "₦550",
      badge: "Upcoming",
      isPaid: false,
    },
  ] satisfies Installment[],
  primaryAction: "Pay final installment",
  secondaryAction: "Split next month instead",
} as const;

export interface TenantContact {
  name: string;
  initials: string;
  detail: ResponsiveCopy;
  isVerified: boolean;
}

export const TENANT_CONTACTS = {
  title: "Contacts",
  people: [
    {
      name: "Daniel Osei",
      initials: "DO",
      detail: {
        base: "Property owner · View only",
        lg: "Property owner · Verified · View only · No direct contact",
      },
      isVerified: true,
    },
    {
      name: "Priya Nandan",
      initials: "PN",
      detail: {
        base: "Assigned Property Admin · Assigned by Vemra",
        md: "Assigned Property Admin · Assigned by Vemra · Responds fast",
        lg: "Assigned Property Admin · Assigned by Vemra · Responds in ~2 hrs",
      },
      isVerified: false,
    },
  ] satisfies TenantContact[],
  verifiedLabel: "VERIFIED",
} as const;

export interface RecentPayment {
  label: string;
  date: string;
  status: string;
}

export const TENANT_RECENT_PAYMENTS = {
  title: { base: "Payments", lg: "Recent payments" },
  viewAllLabel: "View all",
  href: TENANT_ROUTES.paymentHistory,
  rows: [
    { label: "Installment 2", date: "Aug 29", status: "Cleared" },
    { label: "Installment 1", date: "Aug 20", status: "Cleared" },
    { label: "August rent", date: "Aug 4", status: "Cleared" },
  ] satisfies RecentPayment[],
} as const;
