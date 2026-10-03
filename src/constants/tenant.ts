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
  name: "Tenant",
  role: "Tenant",
  initials: "T",
};
