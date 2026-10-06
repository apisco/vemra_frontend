export interface NavLink {
  href: string;
  label: string;
  short: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { href: "/browse", label: "Browse rentals", short: "Browse" },
  { href: "/for-landlords", label: "For landlords", short: "Landlords" },
  { href: "/for-tenants", label: "For tenants", short: "Tenants" },
  { href: "/verification", label: "Verification", short: "Verification" },
];

export const HEADER_CTA = {
  href: "/list-your-property",
  label: "List your property",
  short: "List property",
} as const;

export const LOGIN_LINK = { href: "/login", label: "Log in" } as const;

export interface FooterLink {
  href: string;
  label: string;
  showOnTablet: boolean;
}

export const FOOTER_LINKS: readonly FooterLink[] = [
  { href: "/for-landlords", label: "For landlords", showOnTablet: true },
  { href: "/for-tenants", label: "For tenants", showOnTablet: true },
  { href: "/about", label: "About", showOnTablet: false },
  { href: "/terms", label: "Terms of Service", showOnTablet: true },
  { href: "/privacy", label: "Privacy Policy", showOnTablet: true },
  { href: "/help", label: "Help center", showOnTablet: false },
];

export const FOOTER_HELP_LINK = { href: "/help", label: "Help center" } as const;

export const COPYRIGHT = "© 2026 Vemra. All rights reserved.";

export const HERO = {
  overline: "Rent management, out in the open",
  heading: "Know who holds your keys before you hand over rent.",
  subheading:
    "Vemra serves as your digital caretaker connecting landlords and tenants.",
  subheadingTablet:
    "Vemra connects landlords and tenants who live there — with one shared record of who's paid, who's due, and who's responsible.",
  subheadingMobile:
    "Vemra keeps landlord and tenant communication separate while giving both sides the same verified record.",
  primaryCta: { href: "/browse", label: "Find a home to rent" },
  secondaryCta: { href: "/list-your-property", label: "List your property" },
  trustNote:
    "Every listed landlord is identity-verified before a tenant ever pays.",
  trustNoteTablet:
    "Every listed landlord is identity-verified, and every Property Admin is created and assigned by Vemra.",
  trustNoteMobile: "Verified identity before any payment.",
} as const;

export interface RoleRow {
  title: string;
  subtitle: string;
  description: string;
  descriptionMobile: string;
  descriptionTablet: string;
  tags: readonly string[];
  tagsMobile: readonly string[];
}

export const ROLE_ROWS: readonly RoleRow[] = [
  {
    title: "Landlords",
    subtitle: "The Property Owner",
    description:
      "List a property, have Vemra assign a Property Admin when needed, and track occupancy, vacancy, and cleared rent.",
    descriptionTablet:
      "List a property, have a Vemra admin assigned to manage it, and see which units are occupied, which are vacant, and how much is ready to withdraw.",
    descriptionMobile:
      "List a property, receive an assigned Vemra admin, and track occupants, vacancy, and withdrawals.",
    tags: ["Occupancy overview", "Withdrawals", "Admin assignment"],
    tagsMobile: ["Occupancy", "Withdrawals"],
  },
  {
    title: "Property Admins",
    subtitle: "The Property Admin",
    description:
      "Manage the properties assigned to you, handle tenant questions, and keep the landlord's dashboard current without needing to be copied on every message.",
    descriptionTablet:
      "Manage properties assigned to you, handle tenant questions, and keep the landlord's dashboard current.",
    descriptionMobile:
      "Manage assigned listings and keep the landlord's dashboard current.",
    tags: ["Assigned properties", "Tenant contact"],
    tagsMobile: ["Assigned listings"],
  },
  {
    title: "Tenants",
    subtitle: "The Resident",
    description:
      "See exactly who your landlord is before you pay a deposit. Track when rent is due, and set up a payment plan if you need to split the next one.",
    descriptionTablet:
      "See exactly who your landlord and property admin are before you pay. Track when rent is due and set up payment plans.",
    descriptionMobile:
      "Confirm landlord identity before you pay a deposit. Set up payment plans.",
    tags: ["Rent due date", "Payment plans", "Landlord lookup"],
    tagsMobile: ["Payment plans"],
  },
];

export const ROLES_SECTION = {
  heading: "Two sides, one record",
  subheading:
    "Vemra keeps landlord and tenant communication separate while giving both sides the same verified record.",
  subheadingMobile:
    "A rental usually breaks down in the gaps. Vemra gives everyone the same facts.",
} as const;

export interface PanelRow {
  label: string;
  value: string;
  isEmphasised?: boolean;
  showOnMobile?: boolean;
  showOnTablet?: boolean;
}

export const TENANT_PANEL = {
  title: "Tenant — 4B Maple & 9th",
  badge: "Active lease",
  rows: [
    { label: "Rent due", value: "Sep 5", showOnTablet: true },
    { label: "Next payment", value: "₦1,450", showOnTablet: true },
  ] satisfies PanelRow[],
  progress: {
    label: "Payment plan progress",
    labelMobile: "Payment plan:",
    value: "₦900 of ₦1,450 (62%)",
    percent: 62,
  },
} as const;

export const LANDLORD_PANEL = {
  title: "Landlord — 6 properties",
  badge: "5 Active Listings",
  rows: [
    { label: "Occupied units", value: "5 of 6", showOnTablet: true },
    {
      label: "Ready to withdraw",
      value: "₦6,275",
      isEmphasised: true,
      showOnMobile: true,
      showOnTablet: true,
    },
    { label: "Next rent due", value: "Unit 2A · Sep 3" },
  ] satisfies PanelRow[],
} as const;

export const DASHBOARD_SECTION = {
  heading: "A dashboard for each side of the lease",
  headingMobile: "A dashboard for each side",
  subheading:
    "Tenants see what they owe and when. Landlords see what's coming in and what's ready to withdraw.",
} as const;

export const TRUST_SECTION = {
  heading: "See who you're paying, before you pay them",
  body: "With Vemra, you're never sending money into a black box. Landlords are fully vetted using verified public deeds and government registries. Tenants enjoy historical transparency that prevents fraud and double-listing.",
  checks: [
    "Landlord identity confirmed with government ID and property title",
    "Assigned admin linked to the property they manage",
    "Rent history visible to the tenant before any payment is made",
  ],
} as const;

export const CTA_BAND = {
  heading: "Bring your rental onto one record.",
  cta: { href: "/signup", label: "Get started" },
} as const;

export const BROWSE_PAGE = {
  heading: "Find a home, and know who owns it.",
  subheading:
    "Every listing comes from a verified landlord. Review the verified owner before applying through Vemra.",
  subheadingMobile: "Every listing below comes from a verified landlord.",
  loadMore: "Load more homes",
} as const;

export type BrowseFilterId = "all" | "price" | "beds" | "location" | "verified";

export interface BrowseFilter {
  id: BrowseFilterId;
  label: string;
  short: string;
  hasChevron: boolean;
  showOnMobile: boolean;
}

export const BROWSE_FILTERS: readonly BrowseFilter[] = [
  {
    id: "all",
    label: "All homes",
    short: "All homes",
    hasChevron: false,
    showOnMobile: true,
  },
  { id: "price", label: "Price", short: "Price", hasChevron: true, showOnMobile: true },
  { id: "beds", label: "Bedrooms", short: "Beds", hasChevron: true, showOnMobile: true },
  {
    id: "location",
    label: "Location",
    short: "Location",
    hasChevron: true,
    showOnMobile: false,
  },
  {
    id: "verified",
    label: "Verified only",
    short: "Verified only",
    hasChevron: false,
    showOnMobile: false,
  },
];

export interface BrowseFilterOption {
  value: string;
  label: string;
  /** Inclusive lower bound in naira (major units). */
  min?: number;
  /** Inclusive upper bound in naira (major units). */
  max?: number;
}

export const BROWSE_PRICE_OPTIONS: readonly BrowseFilterOption[] = [
  { value: "any", label: "Any price" },
  { value: "under-200k", label: "Under ₦200,000 / year", max: 200_000 },
  {
    value: "200k-500k",
    label: "₦200,000 – ₦500,000 / year",
    min: 200_000,
    max: 500_000,
  },
  {
    value: "500k-1m",
    label: "₦500,000 – ₦1,000,000 / year",
    min: 500_000,
    max: 1_000_000,
  },
  { value: "1m-plus", label: "₦1,000,000+ / year", min: 1_000_000 },
];

export const BROWSE_BEDROOM_OPTIONS: readonly BrowseFilterOption[] = [
  { value: "any", label: "Any bedrooms" },
  { value: "1", label: "1 bedroom" },
  { value: "2", label: "2 bedrooms" },
  { value: "3", label: "3 bedrooms" },
  { value: "4", label: "4+ bedrooms" },
];
