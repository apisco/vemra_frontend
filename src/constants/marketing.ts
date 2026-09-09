import type { Property } from "@/types/property";

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
  { href: "/for-agents", label: "For agents", showOnTablet: true },
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
    "Vemra connects landlords, the agents they assign, and the tenants who live there — with one shared record of who's paid, who's due, and who's responsible.",
  primaryCta: { href: "/browse", label: "Find a home to rent" },
  secondaryCta: { href: "/list-your-property", label: "List your property" },
  trustNote: "Verified identity before any payment.",
  trustNoteTablet:
    "Every listed landlord and agent is identity-verified before a tenant ever pays.",
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
      "List a property, assign an agent to oversee it day-to-day, and see which units are occupied, which are vacant, and how much is ready to withdraw as each rent comes due.",
    descriptionTablet:
      "List a property, assign an agent to oversee it day-to-day, and see which units are occupied, which are vacant, and how much is ready to withdraw.",
    descriptionMobile:
      "List a property, assign an agent, and track occupants, vacancy, and withdrawals.",
    tags: ["Occupancy overview", "Withdrawals", "Agent assignment"],
    tagsMobile: ["Occupancy", "Withdrawals"],
  },
  {
    title: "Agents",
    subtitle: "The On-Site Manager",
    description:
      "Manage the properties assigned to you, handle tenant questions, and keep the landlord's dashboard current without needing to be copied on every message.",
    descriptionTablet:
      "Manage properties assigned to you, handle tenant questions, and keep the landlord's dashboard current.",
    descriptionMobile:
      "Manage assigned listings and keep the landlord's dashboard current.",
    tags: ["Assigned listings", "Tenant contact"],
    tagsMobile: ["Assigned listings"],
  },
  {
    title: "Tenants",
    subtitle: "The Resident",
    description:
      "See exactly who your landlord and agent are before you pay a deposit. Track when rent is due, and set up a payment plan if you need to split the next one.",
    descriptionTablet:
      "See exactly who your landlord and agent are before you pay. Track when rent is due and set up payment plans.",
    descriptionMobile:
      "Confirm landlord identity before you pay a deposit. Set up payment plans.",
    tags: ["Rent due date", "Payment plans", "Landlord lookup"],
    tagsMobile: ["Payment plans"],
  },
];

export const ROLES_SECTION = {
  heading: "Three people, one record",
  subheading:
    "A rental usually breaks down in the gaps between landlord, agent, and tenant. Vemra gives each of them the same facts.",
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
  body: "With Vemra, you're never sending money into a black box. Landlords and their agents are fully vetted using verified public deeds and government registries. Tenants enjoy historical transparency that prevents fraud and double-listing.",
  checks: [
    "Landlord identity confirmed with government ID and property title",
    "Assigned agent linked publicly to the property they manage",
    "Rent history visible to the tenant before any payment is made",
  ],
} as const;

export const CTA_BAND = {
  heading: "Bring your rental onto one record.",
  cta: { href: "/signup", label: "Get started" },
} as const;

export const HERO_LISTING = {
  price: "₦1,450 / month",
  meta: "2-bed apartment · Maple & 9th, Unit 4B",
  badge: "Landlord Verified",
  imageSrc: "/marketing/hero-maple-9th.png",
  imageAlt:
    "Living room of a two-bedroom apartment with teal sofas and a city view",
  agent: {
    name: "Priya Nandan",
    initials: "PN",
    note: "Managing agent · responds in ~2 hrs",
  },
} as const;

export const BROWSE_PAGE = {
  heading: "Find a home, and know who owns it.",
  subheading:
    "Every listing below comes from a verified landlord or agent — check who they are before you reach out.",
  subheadingMobile:
    "Every listing below comes from a verified landlord or agent.",
  resultCount: "24 homes available",
  loadMore: "Load more homes",
} as const;

export interface BrowseFilter {
  label: string;
  short: string;
  hasChevron: boolean;
  showOnMobile: boolean;
}

export const BROWSE_FILTERS: readonly BrowseFilter[] = [
  { label: "All homes", short: "All homes", hasChevron: false, showOnMobile: true },
  { label: "Price", short: "Price", hasChevron: true, showOnMobile: true },
  { label: "Bedrooms", short: "Beds", hasChevron: true, showOnMobile: true },
  { label: "Location", short: "Location", hasChevron: true, showOnMobile: false },
  {
    label: "Verified only",
    short: "Verified only",
    hasChevron: true,
    showOnMobile: false,
  },
];

const AGENT = { name: "Priya Nandan", role: "Agent" } as const;

export const PROPERTIES: readonly Property[] = [
  {
    id: "maple-9th-4b",
    price: "₦1,450 /mo",
    location: "Maple & 9th, Unit 4B",
    propertyType: "2-bed apartment",
    highlight: "Verified Landlord",
    imageSrc: "/marketing/listing-maple-9th.png",
    imageAlt: "Bright living room with teal sofas, plants and a city skyline view",
    isVerified: true,
    isAvailableNow: true,
    contact: AGENT,
  },
  {
    id: "oak-boulevard-214",
    price: "₦1,890 /mo",
    location: "Oak Boulevard 214",
    propertyType: "3-bed family townhouse",
    imageSrc: "/marketing/listing-oak-boulevard.png",
    imageAlt: "Townhouse frontage with a paved path and low planting",
    isVerified: true,
    isAvailableNow: true,
    contact: AGENT,
  },
  {
    id: "pinecrest-s-1a",
    price: "₦1,200 /mo",
    location: "Pinecrest S, Unit 1A",
    propertyType: "1-bed cozy loft",
    highlight: "Close to transit",
    imageSrc: "/marketing/listing-pinecrest.png",
    imageAlt: "Loft interior with exposed beams and a large window",
    isVerified: true,
    isAvailableNow: false,
    contact: AGENT,
  },
  {
    id: "cedar-heights-12",
    price: "₦2,100 /mo",
    location: "Cedar Heights Road 12",
    propertyType: "4-bed duplex",
    highlight: "Large backyard",
    imageSrc: "/marketing/listing-cedar-heights.png",
    imageAlt: "Duplex exterior seen from the garden lawn",
    isVerified: true,
    isAvailableNow: true,
    contact: AGENT,
  },
  {
    id: "riverview-3g",
    price: "₦1,650 /mo",
    location: "Riverview Ave, Apt 3G",
    propertyType: "2-bed luxury high-rise",
    highlight: "Skyline views",
    imageSrc: "/marketing/listing-riverview.png",
    imageAlt: "High-rise apartment lounge with floor-to-ceiling windows",
    isVerified: true,
    isAvailableNow: false,
    contact: AGENT,
  },
  {
    id: "elm-way-10",
    price: "₦1,100 /mo",
    location: "Elm Way, Unit 10",
    propertyType: "Studio apartment",
    highlight: "Modern kitchen",
    imageSrc: "/marketing/listing-elm-way.png",
    imageAlt: "Studio apartment with a modern kitchen counter and stools",
    isVerified: true,
    isAvailableNow: true,
    contact: AGENT,
  },
];
