export interface LegalSection {
  heading: string;
  body: string;
  bullets?: readonly string[];
}

export interface LegalDocumentContent {
  href: string;
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: readonly LegalSection[];
}

export interface LegalLink {
  href: string;
  label: string;
}

export const LEGAL_BACK_LINK = {
  href: "/browse",
  label: "Back to listings",
} as const;

export const LEGAL_TABS: readonly LegalLink[] = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

export const LEGAL_CONTACT = {
  text: "Have questions about these policies?",
  linkLabel: "Contact us about this policy",
  href: "/help",
} as const;

export const LEGAL_COPYRIGHT = "© 2026 Vemra Technologies. All rights reserved.";

export const LEGAL_FOOTER_LINKS: readonly LegalLink[] = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/help", label: "Support" },
];

export const TERMS_DOCUMENT: LegalDocumentContent = {
  href: "/terms",
  title: "Terms of Service",
  lastUpdated: "Last updated August 1, 2026",
  intro:
    "Welcome to Vemra. By accessing our platform, renting real estate, or listing rental properties, you agree to comply with and be bound by the following Terms of Service. Please review these rules thoroughly.",
  sections: [
    {
      heading: "1. Accounts and verification",
      body: "To use certain features of the Vemra platform, you must create an account and complete our background checks. Landlords, tenants, and authorized Vemra admins must provide accurate, current, and complete information during registration and keep account details up to date at all times.",
    },
    {
      heading: "2. Rent payments",
      body: "All transactions are processed through authorized payment channels. Tenants agree to pay rent on or before the due date specified in their lease agreement. Landlords can withdraw funds into a verified payout account once the clearing timeline has elapsed.",
    },
    {
      heading: "3. Listings and conduct",
      body: "Any property listed on Vemra must meet our rigorous safety, cleanliness, and structural standards. Users are strictly prohibited from:",
      bullets: [
        "Listing fraudulent properties or misrepresenting occupancy details.",
        "Violating local zoning laws, lease regulations, or discrimination policies.",
        "Direct landlord–tenant contact and sharing external contact details are prohibited. Communication must use an Assigned Property Admin or Vemra Support.",
      ],
    },
    {
      heading: "4. Termination",
      body: "Vemra reserves the right to suspend or permanently terminate your account if we discover violations of local laws or if listings generate excessive unresolved tenant disputes.",
    },
    {
      heading: "5. Limitation of liability",
      body: "Vemra operates the rental application, verification, communication, and administrative workflow between landlords and tenants.",
    },
  ],
};

export const PRIVACY_DOCUMENT: LegalDocumentContent = {
  href: "/privacy",
  title: "Privacy Policy",
  lastUpdated: "Last updated August 1, 2026",
  sections: [
    {
      heading: "1. Information collected",
      body: "To operate the rental matching service, we collect the following metadata and personal records:",
      bullets: [
        "Name, email, mobile phone, and secure account credentials.",
        "Government-issued ID numbers (for background verification and KYC clearing).",
        "Financial payout routes, bank coordinates, and debit card transactions.",
      ],
    },
    {
      heading: "2. How we use your data",
      body: "Your data is solely used to verify identities, complete tenant background reports, dispatch digital leases, trigger transactional rent alerts, and prevent security exploits on our platform.",
    },
    {
      heading: "3. Data sharing and security",
      body: "Vemra reviews rental history internally when processing an application. Landlords receive only the approved tenancy outcome and necessary operational summaries; applicant profiles are not shared for direct review.",
    },
  ],
};
