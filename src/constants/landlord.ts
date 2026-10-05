import { FileTextIcon } from "@/components/icons/file-text-icon";
import { HouseIcon } from "@/components/icons/house-icon";
import { LayoutGridIcon } from "@/components/icons/layout-grid-icon";
import { SettingsIcon } from "@/components/icons/settings-icon";
import { ShieldIcon } from "@/components/icons/shield-icon";
import { UsersIcon } from "@/components/icons/users-icon";
import { WalletIcon } from "@/components/icons/wallet-icon";
import { WrenchIcon } from "@/components/icons/wrench-icon";
import type { ResponsiveCopy } from "@/components/ui/responsive-text";
import type {
  DashboardNavItem,
  DashboardUser,
} from "@/types/dashboard";

export const LANDLORD_ROUTES = {
  overview: "/landlord",
  properties: "/landlord/properties",
  newProperty: "/landlord/properties/new",
  applications: "/landlord/applications",
  maintenance: "/landlord/maintenance",
  cautionDeposits: "/landlord/caution-deposits",
  payoutAccount: "/landlord/payout-account",
  statement: "/landlord/statement",
  settings: "/landlord/settings",
  profile: "/landlord/profile",
  rentApproval: "/landlord/properties/unit-4b-maple-9th/rent-approval",
} as const;

export const LANDLORD_NAV: readonly DashboardNavItem[] = [
  { href: LANDLORD_ROUTES.overview, label: "Overview", icon: LayoutGridIcon },
  { href: LANDLORD_ROUTES.properties, label: "Properties", icon: HouseIcon },
  {
    href: LANDLORD_ROUTES.maintenance,
    label: "Maintenance",
    icon: WrenchIcon,
  },
  {
    href: LANDLORD_ROUTES.cautionDeposits,
    label: "Caution deposits",
    icon: ShieldIcon,
  },
  {
    href: LANDLORD_ROUTES.payoutAccount,
    label: "Payout account",
    icon: WalletIcon,
  },
  { href: LANDLORD_ROUTES.statement, label: "Statement", icon: FileTextIcon },
  { href: LANDLORD_ROUTES.settings, label: "Settings", icon: SettingsIcon },
];

export const LANDLORD_NAV_TABLET: readonly DashboardNavItem[] = [
  { href: LANDLORD_ROUTES.overview, label: "Overview", icon: LayoutGridIcon },
  { href: LANDLORD_ROUTES.properties, label: "Properties", icon: HouseIcon },
  {
    href: LANDLORD_ROUTES.maintenance,
    label: "Maintenance",
    icon: WrenchIcon,
  },
  {
    href: LANDLORD_ROUTES.cautionDeposits,
    label: "Caution deposits",
    icon: ShieldIcon,
  },
  { href: LANDLORD_ROUTES.settings, label: "Settings", icon: SettingsIcon },
];

export const LANDLORD_NAV_MOBILE: readonly DashboardNavItem[] = [
  { href: LANDLORD_ROUTES.overview, label: "Overview", icon: LayoutGridIcon },
  { href: LANDLORD_ROUTES.properties, label: "Properties", icon: HouseIcon },
  { href: LANDLORD_ROUTES.applications, label: "Updates", icon: UsersIcon },
  {
    href: LANDLORD_ROUTES.payoutAccount,
    label: "Payouts",
    icon: WalletIcon,
  },
  { href: LANDLORD_ROUTES.settings, label: "Settings", icon: SettingsIcon },
];

export const LANDLORD_USER: DashboardUser = {
  name: "Daniel Osei",
  role: "Landlord",
  initials: "DO",
};

export const LANDLORD_DASHBOARD = {
  greeting: "Good afternoon, Daniel",
  summary: "6 properties · 5 occupied · 1 vacant",
  withdrawAction: {
    label: "Withdraw funds",
    href: LANDLORD_ROUTES.payoutAccount,
  },
  addPropertyAction: {
    label: "Add property",
    href: LANDLORD_ROUTES.newProperty,
  },
} as const;

export interface GettingStartedStep {
  title: string;
  detail: string;
  isCurrent: boolean;
}

export const LANDLORD_DASHBOARD_EMPTY = {
  greeting: {
    base: "Welcome, Daniel",
    md: "Welcome to Vemra",
  } satisfies ResponsiveCopy,
  summary: {
    base: "Your landlord dashboard gets active once you list a property.",
    md: "Your dashboard will fill in once you list your first property.",
  } satisfies ResponsiveCopy,
  emptyState: {
    title: "No properties yet",
    description: {
      base: "Once you list a property and a tenant moves in, you'll see occupancy stats, clearing times, and withdrawable rental revenue here.",
      md: "Once you list a property and a tenant moves in, you'll see occupancy, rent status, and withdrawable funds here.",
    } satisfies ResponsiveCopy,
    action: {
      label: "List your first property",
      href: LANDLORD_ROUTES.newProperty,
    },
  },
  checklist: {
    title: "Getting started",
    steps: [
      {
        title: "List your first property",
        detail: "Takes about 5 minutes",
        isCurrent: true,
      },
      {
        title: "Connect payout account",
        detail: "Clear and withdraw rent directly",
        isCurrent: false,
      },
      {
        title: "Meet your Property Admin",
        detail: "Vemra assigns one when needed",
        isCurrent: false,
      },
    ] satisfies GettingStartedStep[],
  },
} as const;

export const LANDLORD_LIST_PROPERTY = {
  title: "List a property",
  description: "Add the details renters will use to find your property.",
  reviewTitle: "Review your listing",
  reviewDescription: "Check the details before publishing your property.",
  publishedTitle: "Your property is live",
  publishedDescription:
    "Your listing is now available for renters to discover on Vemra.",
  fields: {
    address: {
      label: "Property address",
      placeholder: "12 Maple Street, Lagos",
    },
    rent: {
      label: "Monthly rent",
      placeholder: "1,450",
    },
    bedrooms: {
      label: "Bedrooms",
      placeholder: "2",
    },
    description: {
      label: "Description",
      placeholder: "Tell renters what makes this property a great home.",
    },
  },
  continueLabel: "Review listing",
  publishLabel: "Publish listing",
  editLabel: "Edit details",
  viewPropertiesLabel: "View properties",
  cancelLabel: "Cancel",
} as const;

export const LANDLORD_PROPERTIES_SCREEN = {
  title: "Properties",
  summary: "6 properties across 3 locations",
  addAction: {
    label: { base: "+ Add", md: "Add property" } satisfies ResponsiveCopy,
    href: LANDLORD_ROUTES.newProperty,
  },
  caption: "Every property you own, with its rent and status",
  headers: {
    property: "Property",
    rent: "Rent",
    status: "Status",
    action: "Action",
  },
  filters: [
    { id: "all", label: "All" },
    { id: "occupied", label: "Occupied" },
    { id: "vacant", label: "Vacant" },
  ],
} as const;

export const LANDLORD_MANAGE_LISTING = {
  breadcrumbLabel: "Properties",
  listedSincePrefix: "Listed since",
  details: {
    title: "Listing details",
    addressLabel: "Address",
    rentLabel: "Monthly rent (₦)",
    bedroomsLabel: "Bedrooms",
    descriptionLabel: "Description",
  },
  gallery: {
    label: "Listing photos",
  },
  danger: {
    title: "Remove from public listings",
    description:
      "The property will no longer receive applications. Active tenants are unaffected.",
    action: "Unlist",
  },
  footer: {
    cancel: "Cancel",
    save: "Save changes",
  },
} as const;
