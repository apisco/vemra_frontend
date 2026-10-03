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
  MetricTone,
} from "@/types/dashboard";

export const LANDLORD_ROUTES = {
  overview: "/landlord",
  properties: "/landlord/properties",
  newProperty: "/landlord/properties/new",
  applications: "/landlord/applications",
  maintenance: "/landlord/maintenance",
  cautionDeposits: "/landlord/caution-deposits",
  tenants: "/landlord/tenants",
  payoutAccount: "/landlord/payout-account",
  statement: "/landlord/statement",
  propertyAdmins: "/landlord/property-admins",
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
  { href: LANDLORD_ROUTES.tenants, label: "Tenants", icon: UsersIcon },
  {
    href: LANDLORD_ROUTES.propertyAdmins,
    label: "Property Admins",
    icon: UsersIcon,
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
  {
    href: LANDLORD_ROUTES.propertyAdmins,
    label: "Property Admins",
    icon: UsersIcon,
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

export interface LandlordMetric {
  label: string;
  value: string;
  detail: ResponsiveCopy;
  tone: MetricTone;
  isCompactHidden: boolean;
}

export const LANDLORD_METRICS: readonly LandlordMetric[] = [
  {
    label: "Occupied units",
    value: "5 of 6",
    detail: { base: "Unit 3C vacant since Aug 14" },
    tone: "default",
    isCompactHidden: false,
  },
  {
    label: "Ready to withdraw",
    value: "₦6,275",
    detail: {
      base: "From 4 cleared payments",
      md: "From 4 cleared rent payments",
    },
    tone: "brand",
    isCompactHidden: false,
  },
  {
    label: "Next rent due",
    value: "Sep 3",
    detail: { base: "Unit 2A · Maple & 9th" },
    tone: "warning",
    isCompactHidden: false,
  },
  {
    label: "Monthly rent roll",
    value: "₦8,150",
    detail: { base: "Across 6 units" },
    tone: "default",
    isCompactHidden: true,
  },
];

export interface RevenueBar {
  heightClass: string;
  isHighlighted: boolean;
}

export const LANDLORD_REVENUE_ROLL = {
  title: "Monthly revenue roll",
  value: "₦8,150",
  caption: "Expected total",
  bars: [
    { heightClass: "h-7.5", isHighlighted: false },
    { heightClass: "h-10", isHighlighted: false },
    { heightClass: "h-8.75", isHighlighted: false },
    { heightClass: "h-12.5", isHighlighted: true },
    { heightClass: "h-13.75", isHighlighted: true },
  ] satisfies RevenueBar[],
} as const;

export const LANDLORD_WITHDRAW_WIDGET = {
  label: "Available to withdraw",
  amount: "₦6,275",
  note: "Clears to your linked account in 1–2 business days",
  primaryAction: {
    label: "Withdraw funds",
    href: LANDLORD_ROUTES.payoutAccount,
  },
  secondaryAction: {
    label: "View statement",
    href: LANDLORD_ROUTES.statement,
  },
} as const;

export interface PropertyAdminSummary {
  name: string;
  detail: string;
}

export const LANDLORD_PROPERTY_ADMINS = {
  title: "Vemra Property Admins",
  people: [
    { name: "Priya Nandan", detail: "3 units · Maple & 9th" },
    { name: "Tunde Alabi", detail: "2 units · Birchwood Lane" },
  ] satisfies PropertyAdminSummary[],
} as const;

export const LANDLORD_ASSIGNED_ADMIN = {
  eyebrow: "Assigned Property Admin",
  name: "Priya Nandan",
  detail: "Assigned by Vemra",
  badge: "Assigned",
  managedLabel: "Managed properties",
  managedCount: "3 active",
  managedProperties: [
    "Maple & 9th, Unit 4B",
    "Maple & 9th, Unit 2A",
    "Maple & 9th, Unit 3C",
  ],
  profileAction: {
    label: "View profile",
    href: LANDLORD_ROUTES.propertyAdmins,
  },
} as const;

export type PropertyStatus = "occupied" | "vacant";

export interface PropertyRow {
  property: string;
  admin: string;
  status: string;
  statusTone: PropertyStatus;
  rentDue: string;
  rent: string;
  isCompactHidden: boolean;
}

export const LANDLORD_PROPERTIES_TABLE = {
  title: "Properties overview",
  caption: "Properties you own, their assigned Property Admin and rent status",
  headers: {
    property: "Property",
    admin: "Property admin",
    status: "Status",
    rentDue: "Rent due",
    rent: "Rent",
  },
  rows: [
    {
      property: "Maple & 9th, Unit 4B",
      admin: "Priya Nandan",
      status: "Occupied",
      statusTone: "occupied",
      rentDue: "Sep 5",
      rent: "₦1,450",
      isCompactHidden: false,
    },
    {
      property: "Maple & 9th, Unit 2A",
      admin: "Priya Nandan",
      status: "Occupied",
      statusTone: "occupied",
      rentDue: "Sep 3",
      rent: "₦1,200",
      isCompactHidden: false,
    },
    {
      property: "Birchwood Lane, Unit 1",
      admin: "Tunde Alabi",
      status: "Occupied",
      statusTone: "occupied",
      rentDue: "Sep 10",
      rent: "₦1,800",
      isCompactHidden: false,
    },
    {
      property: "Maple & 9th, Unit 3C",
      admin: "Priya Nandan",
      status: "Vacant",
      statusTone: "vacant",
      rentDue: "--",
      rent: "₦1,300",
      isCompactHidden: false,
    },
    {
      property: "Cedar Heights, Unit 12",
      admin: "Daniel Osei",
      status: "Occupied",
      statusTone: "occupied",
      rentDue: "Sep 15",
      rent: "₦2,400",
      isCompactHidden: true,
    },
  ] satisfies PropertyRow[],
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

export interface PropertyListingAdmin {
  name: string;
  note: string;
  isAssigned: boolean;
}

export interface PropertyListing {
  id: string;
  name: string;
  tenant: string | null;
  vacancyNote: string | null;
  admin: PropertyListingAdmin;
  rent: string;
  rentValue: string;
  status: string;
  statusTone: PropertyStatus;
  action: { label: ResponsiveCopy; href: string };
  listedSince: string;
  adminSince: string;
  bedrooms: string;
  description: string;
  imageAlt: string;
  photos: readonly string[];
}

const ASSIGNED_BY_VEMRA = "Assigned by Vemra";

const UNASSIGNED_ADMIN: PropertyListingAdmin = {
  name: "Unassigned",
  note: "Only Vemra or Super Admin can assign a Property Admin.",
  isAssigned: false,
};

const MANAGE_ACTION = { label: { base: "Manage" }, href: "" };

export const LANDLORD_PROPERTY_LISTINGS: readonly PropertyListing[] = [
  {
    id: "unit-2a-maple-9th",
    name: "Unit 2A · Maple & 9th",
    tenant: "Kwame Boateng",
    vacancyNote: null,
    admin: { name: "Priya Nandan", note: ASSIGNED_BY_VEMRA, isAssigned: true },
    rent: "₦1,450",
    rentValue: "1,450",
    status: "Occupied",
    statusTone: "occupied",
    action: {
      ...MANAGE_ACTION,
      href: `${LANDLORD_ROUTES.properties}/unit-2a-maple-9th`,
    },
    listedSince: "Mar 2024",
    adminSince: "Jan 2024",
    bedrooms: "2 Bedrooms",
    description:
      "A corner 2-bedroom on the second floor with a shared courtyard view. Newly fitted kitchen, in-unit laundry and one parking space. Five-minute walk to the 9th Street transit stop.",
    imageAlt: "Living room at Unit 2A, Maple & 9th",
    photos: [
      "/marketing/listing-maple-9th.png",
      "/marketing/hero-maple-9th.png",
      "/marketing/listing-elm-way.png",
      "/marketing/listing-pinecrest.png",
    ],
  },
  {
    id: "unit-4b-maple-9th",
    name: "Unit 4B · Maple & 9th",
    tenant: "Aisha Bello",
    vacancyNote: null,
    admin: { name: "Priya Nandan", note: ASSIGNED_BY_VEMRA, isAssigned: true },
    rent: "₦1,450",
    rentValue: "1,450",
    status: "Occupied",
    statusTone: "occupied",
    action: {
      ...MANAGE_ACTION,
      href: `${LANDLORD_ROUTES.properties}/unit-4b-maple-9th`,
    },
    listedSince: "Jan 2024",
    adminSince: "Jan 2024",
    bedrooms: "2 Bedrooms",
    description:
      "A quiet 2-bedroom on the fourth floor with morning light through the living room windows. Recently repainted, with in-unit laundry and a dedicated parking space. Five-minute walk to the 9th Street transit stop.",
    imageAlt: "Living room at Unit 4B, Maple & 9th",
    photos: [
      "/marketing/hero-maple-9th.png",
      "/marketing/listing-maple-9th.png",
      "/marketing/listing-elm-way.png",
      "/marketing/listing-pinecrest.png",
    ],
  },
  {
    id: "unit-3c-maple-9th",
    name: "Unit 3C · Maple & 9th",
    tenant: null,
    vacancyNote: "Vacant since Aug 14",
    admin: { name: "Priya Nandan", note: ASSIGNED_BY_VEMRA, isAssigned: true },
    rent: "₦1,290",
    rentValue: "1,290",
    status: "Vacant",
    statusTone: "vacant",
    action: {
      ...MANAGE_ACTION,
      href: `${LANDLORD_ROUTES.properties}/unit-3c-maple-9th`,
    },
    listedSince: "Feb 2024",
    adminSince: "Jan 2024",
    bedrooms: "1 Bedroom",
    description:
      "A third-floor 1-bedroom with a full-height window in the living room. Freshly cleaned and ready for viewings, with in-unit laundry on the same floor. Five-minute walk to the 9th Street transit stop.",
    imageAlt: "Living room at Unit 3C, Maple & 9th",
    photos: [
      "/marketing/listing-oak-boulevard.png",
      "/marketing/listing-maple-9th.png",
      "/marketing/listing-pinecrest.png",
      "/marketing/listing-elm-way.png",
    ],
  },
  {
    id: "12-birchwood-lane",
    name: "12 Birchwood Lane",
    tenant: "Grace Adeyemi",
    vacancyNote: null,
    admin: { name: "Tunde Alabi", note: ASSIGNED_BY_VEMRA, isAssigned: true },
    rent: "₦1,325",
    rentValue: "1,325",
    status: "Occupied",
    statusTone: "occupied",
    action: {
      ...MANAGE_ACTION,
      href: `${LANDLORD_ROUTES.properties}/12-birchwood-lane`,
    },
    listedSince: "Nov 2023",
    adminSince: "Nov 2023",
    bedrooms: "3 Bedrooms",
    description:
      "A 3-bedroom terrace with a walled front garden and covered parking for two cars. Separate utility room, and the primary bedroom opens onto a small balcony.",
    imageAlt: "Front elevation of 12 Birchwood Lane",
    photos: [
      "/marketing/listing-cedar-heights.png",
      "/marketing/listing-elm-way.png",
      "/marketing/listing-pinecrest.png",
      "/marketing/listing-riverview.png",
    ],
  },
  {
    id: "14-birchwood-lane",
    name: "14 Birchwood Lane",
    tenant: "Samuel Owusu",
    vacancyNote: null,
    admin: { name: "Tunde Alabi", note: ASSIGNED_BY_VEMRA, isAssigned: true },
    rent: "₦1,325",
    rentValue: "1,325",
    status: "Occupied",
    statusTone: "occupied",
    action: {
      ...MANAGE_ACTION,
      href: `${LANDLORD_ROUTES.properties}/14-birchwood-lane`,
    },
    listedSince: "Nov 2023",
    adminSince: "Nov 2023",
    bedrooms: "3 Bedrooms",
    description:
      "The mirrored pair to number 12 — a 3-bedroom terrace with a walled front garden, covered parking and a separate utility room off the kitchen.",
    imageAlt: "Front elevation of 14 Birchwood Lane",
    photos: [
      "/marketing/listing-elm-way.png",
      "/marketing/listing-cedar-heights.png",
      "/marketing/listing-pinecrest.png",
      "/marketing/listing-riverview.png",
    ],
  },
  {
    id: "7-riverside-court",
    name: "7 Riverside Court",
    tenant: "Femi Adigun",
    vacancyNote: null,
    admin: UNASSIGNED_ADMIN,
    rent: "₦1,600",
    rentValue: "1,600",
    status: "Occupied",
    statusTone: "occupied",
    action: {
      label: { base: "Manage", lg: "Manage listing" },
      href: `${LANDLORD_ROUTES.properties}/7-riverside-court`,
    },
    listedSince: "Jun 2024",
    adminSince: "",
    bedrooms: "3 Bedrooms",
    description:
      "A riverside 3-bedroom with a double-height living room and a private jetty step. Underfloor heating throughout, and the kitchen opens onto a deck over the water.",
    imageAlt: "Riverside elevation of 7 Riverside Court",
    photos: [
      "/marketing/listing-riverview.png",
      "/marketing/listing-pinecrest.png",
      "/marketing/listing-oak-boulevard.png",
      "/marketing/listing-cedar-heights.png",
    ],
  },
];

export const LANDLORD_PROPERTIES_SCREEN = {
  title: "Properties",
  summary: "6 properties across 3 locations",
  addAction: {
    label: { base: "+ Add", md: "Add property" } satisfies ResponsiveCopy,
    href: LANDLORD_ROUTES.newProperty,
  },
  caption: "Every property you own, with its tenant, Property Admin and rent",
  tenantLabel: "Tenant",
  vacantTenantPlaceholder: "—",
  headers: {
    property: "Property",
    tenant: "Tenant",
    admin: {
      base: "Vemra Property Admin",
      lg: "Property Admin",
    } satisfies ResponsiveCopy,
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
  admin: {
    title: "Assigned Property Admin",
    metaPrefix: "Assigned by Vemra · Property Admin since",
    action: {
      label: "View profile",
      href: LANDLORD_ROUTES.propertyAdmins,
    },
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
