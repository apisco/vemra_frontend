/**
 * Figma-derived data contracts, one per screen.
 *
 * Figma is the source of truth for what each screen needs. This file keys that
 * off the screen IDs and node IDs in `docs/screen-inventory.md` (Figma file
 * `TOQCNmbIIi0C3IZSoZfkPf`, page `3:2`) so every field can be traced back to
 * the frame it was read from.
 *
 * Scope is the four sections that have routes in `src/app` today — Marketing,
 * Auth, Tenant and Landlord, 68 screens. Agent (AG1–AG6) and Admin (AD1–AD7)
 * are deliberately absent until their screens are built.
 *
 * `fields: null` means the frame has not been read yet. Do not fill these in
 * from the existing `src/constants/*` mock data or by inference — read the
 * frame. Per the convention in `docs/*-figma-deltas.md`, anything the design
 * cannot answer gets recorded as a delta rather than resolved silently.
 *
 * Transport configuration (base URL, timeouts, headers) is NOT Figma-derived
 * and lives in `src/config/api.ts`.
 */

export type ScreenSection = "marketing" | "auth" | "tenant" | "landlord";

/** Node IDs at the three designed widths: 1440, 768, 390. */
export type FigmaNodes = readonly [
  desktop: string,
  tablet: string,
  mobile: string,
];

export interface ContractField {
  /** Property name the screen will read. */
  readonly name: string;
  /** Shape of the value, as the frame implies it. */
  readonly type: string;
  /** Figma node the value was read from, for traceability. */
  readonly node: string;
  /** Literal value the frame draws, if it shows one. */
  readonly sample?: string;
}

export interface ScreenContract {
  readonly section: ScreenSection;
  readonly title: string;
  /** Route in `src/app`, or `null` for a state with no route of its own. */
  readonly route: string | null;
  readonly nodes: FigmaNodes;
  /** `null` until the frame has been read from Figma. */
  readonly fields: readonly ContractField[] | null;
}

export const SCREEN_CONTRACTS = {
  // Marketing — section 50:2. Public, unauthenticated.
  M1: {
    section: "marketing",
    title: "Landing page",
    route: "/",
    nodes: ["9:923", "108:3476", "101:3476"],
    fields: null,
  },
  M2: {
    section: "marketing",
    title: "Browse listings",
    route: "/browse",
    nodes: ["9:1085", "108:3583", "101:3588"],
    fields: null,
  },
  M3: {
    section: "marketing",
    title: "Listing detail",
    route: "/properties/[propertyId]",
    nodes: ["10:236", "108:3689", "101:3681"],
    fields: null,
  },
  M4: {
    section: "marketing",
    title: "Search empty state",
    route: "/search/empty",
    nodes: ["13:310", "108:3793", "101:3887"],
    fields: null,
  },
  M5: {
    section: "marketing",
    title: "About / contact",
    route: "/about",
    nodes: ["6:27", "108:3841", "101:3776"],
    fields: null,
  },
  M6: {
    section: "marketing",
    title: "Public profile",
    route: "/profile/[profileId]",
    nodes: ["13:113", "108:3901", "101:3946"],
    fields: null,
  },
  M7: {
    section: "marketing",
    title: "404",
    route: null, // app/not-found.tsx, no path of its own
    nodes: ["6:13", "108:3970", "101:4043"],
    fields: null,
  },

  // Auth — section 50:3. No app shell.
  AU1: {
    section: "auth",
    title: "Sign up — role picker",
    route: "/signup",
    nodes: ["15:8", "108:3993", "101:4075"],
    fields: null,
  },
  AU2: {
    section: "auth",
    title: "Sign up — details",
    route: "/signup/details",
    nodes: ["15:63", "108:4059", "101:4149"],
    fields: null,
  },
  AU3: {
    section: "auth",
    title: "Sign up — verification",
    route: "/signup/verification",
    nodes: ["15:118", "108:4126", "101:4222"],
    fields: null,
  },
  AU4: {
    section: "auth",
    title: "Login",
    route: "/login",
    nodes: ["57:341", "109:3528", "101:6660"],
    fields: null,
  },
  AU5: {
    section: "auth",
    title: "Forgot password",
    route: "/forgot-password",
    nodes: ["57:655", "109:3593", "101:6715"],
    fields: null,
  },
  AU6: {
    section: "auth",
    title: "Reset password",
    route: "/reset-password",
    nodes: ["13:181", "109:3621", "101:6744"],
    fields: null,
  },
  AU7: {
    section: "auth",
    title: "Email verified",
    route: "/verify-email",
    nodes: ["135:4209", "109:3653", "102:3474"],
    fields: null,
  },
  AU8: {
    section: "auth",
    title: "Two-factor setup",
    route: "/staff/two-factor",
    nodes: ["15:688", "108:4186", "101:4288"],
    fields: null,
  },
  AU9: {
    section: "auth",
    title: "Verification pending",
    route: "/verification/pending",
    nodes: ["15:723", "108:4231", "101:4339"],
    fields: null,
  },
  AU10: {
    section: "auth",
    title: "Verification rejected",
    route: "/verification/rejected",
    nodes: ["15:755", "108:4272", "101:4384"],
    fields: null,
  },
  AU11: {
    section: "auth",
    title: "Terms & privacy",
    route: "/terms", // also serves /privacy
    nodes: ["135:4225", "109:3677", "102:3502"],
    fields: null,
  },

  // Tenant — section 50:4. Dashboard shell with sidebar 82:162, except TN1.
  TN1: {
    section: "tenant",
    title: "Welcome / onboarding",
    route: "/welcome/[role]",
    nodes: ["13:78", "109:3789", "101:4436"],
    fields: null,
  },
  TN2: {
    section: "tenant",
    title: "Dashboard",
    route: "/tenant",
    nodes: ["15:165", "109:3823", "101:4509"],
    fields: null,
  },
  TN3: {
    section: "tenant",
    title: "Apply for property",
    route: "/tenant/apply",
    nodes: ["9:1379", "109:3944", "101:4623"],
    fields: null,
  },
  TN4: {
    section: "tenant",
    title: "Lease signing",
    route: "/tenant/lease",
    nodes: ["9:1428", "109:3991", "101:4707"],
    fields: null,
  },
  TN5: {
    section: "tenant",
    title: "Pay rent",
    route: "/tenant/payment-plan",
    nodes: ["13:474", "109:4032", "101:4785"],
    fields: null,
  },
  TN6: {
    section: "tenant",
    title: "My rentals",
    route: "/tenant/my-rentals",
    nodes: ["56:601", "109:4169", "101:4988"],
    fields: null,
  },
  TN7: {
    section: "tenant",
    title: "My rentals — empty",
    route: null,
    nodes: ["59:1371", "109:5513", "101:6598"],
    fields: null,
  },
  TN8: {
    section: "tenant",
    title: "Saved properties",
    route: "/tenant/saved-properties",
    nodes: ["56:474", "109:4502", "101:5354"],
    fields: null,
  },
  TN9: {
    section: "tenant",
    title: "Saved properties — empty",
    route: null,
    nodes: ["59:668", "109:5141", "101:6034"],
    fields: null,
  },
  TN10: {
    section: "tenant",
    title: "Rent savings",
    route: "/tenant/rent-savings",
    nodes: ["56:132", "109:4247", "101:5067"],
    fields: null,
  },
  TN11: {
    section: "tenant",
    title: "Rent savings — setup",
    route: null,
    nodes: ["59:1250", "109:5443", "101:6504"],
    fields: null,
  },
  TN12: {
    section: "tenant",
    title: "Caution deposit",
    route: "/tenant/caution-deposit",
    nodes: ["56:251", "109:4418", "101:5258"],
    fields: null,
  },
  TN13: {
    section: "tenant",
    title: "Maintenance — report",
    route: "/tenant/maintenance",
    nodes: ["56:363", "109:4335", "101:5160"],
    fields: null,
  },
  TN14: {
    section: "tenant",
    title: "Maintenance — tracking",
    route: null,
    nodes: ["56:838", "109:4687", "101:5553"],
    fields: null,
  },
  TN15: {
    section: "tenant",
    title: "Maintenance — empty",
    route: null,
    nodes: ["59:830", "109:5203", "101:6160"],
    fields: null,
  },
  TN16: {
    section: "tenant",
    title: "Maintenance — success",
    route: null,
    nodes: ["59:1163", "109:5399", "101:6441"],
    fields: null,
  },
  TN17: {
    section: "tenant",
    title: "Condition record",
    route: null, // not built yet
    nodes: ["56:966", "109:4796", "101:5649"],
    fields: null,
  },
  TN18: {
    section: "tenant",
    title: "Chat / messaging",
    route: "/tenant/messages",
    nodes: ["56:9", "109:4605", "101:5461"],
    fields: null,
  },
  TN19: {
    section: "tenant",
    title: "Messages — empty",
    route: null,
    nodes: ["59:749", "109:5173", "101:6102"],
    fields: null,
  },
  TN20: {
    section: "tenant",
    title: "Referral dashboard",
    route: "/tenant/referrals",
    nodes: ["56:1054", "109:4864", "101:5735"],
    fields: null,
  },
  TN21: {
    section: "tenant",
    title: "Referrals — empty",
    route: null,
    nodes: ["59:990", "109:5270", "101:6274"],
    fields: null,
  },
  TN22: {
    section: "tenant",
    title: "Notifications",
    route: "/tenant/notifications",
    nodes: ["56:1162", "109:4951", "101:5843"],
    fields: null,
  },
  TN23: {
    section: "tenant",
    title: "Notifications — empty",
    route: null,
    nodes: ["59:911", "109:5235", "101:6218"],
    fields: null,
  },
  TN24: {
    section: "tenant",
    title: "Account settings",
    route: "/tenant/settings",
    nodes: ["56:1256", "109:5055", "101:5940"],
    fields: null,
  },
  TN25: {
    section: "tenant",
    title: "Payment failed",
    route: "/tenant/payment-plan/failed",
    nodes: ["59:1119", "109:5336", "101:6360"],
    fields: null,
  },
  TN26: {
    section: "tenant",
    title: "Support",
    route: null, // not built yet
    nodes: ["15:500", "109:4077", "101:4876"],
    fields: null,
  },
  TN27: {
    section: "tenant",
    title: "Deposit decision review",
    route: "/tenant/deposit-decision",
    nodes: ["287:4850", "287:5033", "287:5140"],
    fields: null,
  },
  TN28: {
    section: "tenant",
    title: "Approved rent change",
    route: "/tenant/rent-change",
    nodes: ["287:5255", "287:5404", "287:5483"],
    fields: null,
  },

  // Landlord — section 50:5. Dashboard shell with sidebar 82:236, except LL1.
  LL1: {
    section: "landlord",
    title: "Welcome / onboarding",
    route: "/welcome/[role]",
    nodes: ["13:8", "109:5561", "102:3588"],
    fields: null,
  },
  LL2: {
    section: "landlord",
    title: "Dashboard",
    route: "/landlord",
    nodes: ["9:1238", "109:5597", "102:3639"],
    fields: null,
  },
  LL3: {
    section: "landlord",
    title: "Dashboard — empty",
    route: null,
    nodes: ["57:284", "109:6885", "102:5134"],
    fields: null,
  },
  LL4: {
    section: "landlord",
    title: "List property",
    route: "/landlord/properties/new",
    nodes: ["10:64", "109:5674", "102:3716"],
    fields: null,
  },
  LL5: {
    section: "landlord",
    title: "List property — review",
    route: null,
    nodes: ["10:179", "109:5756", "102:3788"],
    fields: null,
  },
  LL6: {
    section: "landlord",
    title: "Listing published",
    route: null,
    nodes: ["10:352", "109:5809", "102:3834"],
    fields: null,
  },
  LL7: {
    section: "landlord",
    title: "Properties list",
    route: "/landlord/properties",
    nodes: ["13:343", "109:5840", "102:3864"],
    fields: null,
  },
  LL8: {
    section: "landlord",
    title: "Manage listing",
    route: "/landlord/properties/[propertyId]",
    nodes: ["57:186", "109:6807", "102:5040"],
    fields: null,
  },
  LL9: {
    section: "landlord",
    title: "Applications list",
    route: "/landlord/applications",
    nodes: ["6:662", "109:6033", "102:4028"],
    fields: null,
  },
  LL10: {
    section: "landlord",
    title: "Applications — empty",
    route: null,
    nodes: ["61:503", "109:6916", "102:5211"],
    fields: null,
  },
  LL11: {
    section: "landlord",
    title: "Application review",
    route: "/landlord/applications/[applicationId]",
    nodes: ["6:743", "109:6115", "102:4147"],
    fields: null,
  },
  LL12: {
    section: "landlord",
    title: "Property Admin invite",
    route: "/landlord/property-admins",
    nodes: ["6:118", "109:6202", "102:4243"],
    fields: null,
  },
  LL13: {
    section: "landlord",
    title: "Payout account",
    route: "/landlord/payout-account",
    nodes: ["13:217", "109:5949", "102:3947"],
    fields: null,
  },
  LL14: {
    section: "landlord",
    title: "Transaction statement",
    route: "/landlord/statement",
    nodes: ["15:572", "109:6288", "102:4324"],
    fields: null,
  },
  LL15: {
    section: "landlord",
    title: "Statement — empty",
    route: null,
    nodes: ["61:698", "109:7010", "102:5383"],
    fields: null,
  },
  LL16: {
    section: "landlord",
    title: "Payment breakdown",
    route: "/landlord/payment-breakdown",
    nodes: ["56:1851", "109:6652", "102:4649"],
    fields: null,
  },
  LL17: {
    section: "landlord",
    title: "Maintenance view",
    route: "/landlord/maintenance",
    nodes: ["56:1398", "109:6456", "102:4488"],
    fields: null,
  },
  LL18: {
    section: "landlord",
    title: "Maintenance — empty",
    route: null,
    nodes: ["61:569", "109:6952", "102:5271"],
    fields: null,
  },
  LL19: {
    section: "landlord",
    title: "Caution deposits",
    route: "/landlord/caution-deposits",
    nodes: ["56:1532", "109:6566", "102:4570"],
    fields: null,
  },
  LL20: {
    section: "landlord",
    title: "Deposits — empty",
    route: null,
    nodes: ["61:635", "109:6982", "102:5327"],
    fields: null,
  },
  LL21: {
    section: "landlord",
    title: "Notification preferences",
    route: "/landlord/settings/notifications",
    nodes: ["57:2", "109:6714", "102:4727"],
    fields: null,
  },
  LL22: {
    section: "landlord",
    title: "Account settings",
    route: "/landlord/settings",
    nodes: ["6:154", "109:6383", "102:4413"],
    fields: null,
  },
} as const satisfies Record<string, ScreenContract>;

export type ScreenId = keyof typeof SCREEN_CONTRACTS;

/** Screens whose frame has not been read from Figma yet. */
export function pendingFigmaRead(): readonly ScreenId[] {
  return (Object.keys(SCREEN_CONTRACTS) as ScreenId[]).filter(
    (id) => SCREEN_CONTRACTS[id].fields === null,
  );
}
