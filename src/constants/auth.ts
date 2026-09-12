export type AuthRole = "tenant" | "landlord" | "agent";

export interface AuthRoleOption {
  value: AuthRole;
  label: string;
}

export const AUTH_ROLES: readonly AuthRoleOption[] = [
  { value: "tenant", label: "Tenant" },
  { value: "landlord", label: "Landlord" },
  { value: "agent", label: "Agent" },
];

export const AUTH_ROUTES = {
  login: "/login",
  signup: "/signup",
  signupDetails: "/signup/details",
  signupVerification: "/signup/verification",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  twoFactor: "/two-factor",
  verificationPending: "/verification/pending",
  verificationRejected: "/verification/rejected",
  terms: "/terms",
  privacy: "/privacy",
} as const;

export interface SignupRoleOption {
  value: AuthRole;
  title: string;
  description: string;
  tag: string;
}

export const SIGNUP_DEFAULT_ROLE: AuthRole = "landlord";

export const SIGNUP_ROLE_SCREEN = {
  step: 1,
  totalSteps: 3,
  title: "How will you use Vemra?",
  description:
    "This decides what verification we need and what your dashboard looks like.",
  groupLabel: "Choose how you will use Vemra",
  footerPrompt: "Already have an account?",
  footerLabel: "Log in",
} as const;

export const SIGNUP_ROLE_OPTIONS: readonly SignupRoleOption[] = [
  {
    value: "landlord",
    title: "Landlord",
    description:
      "List properties, assign agents, and withdraw rent as it clears.",
    tag: "Requires property ownership check",
  },
  {
    value: "tenant",
    title: "Tenant",
    description:
      "Browse verified homes, message landlords and agents, and manage your rent.",
    tag: "Requires ID for applications",
  },
  {
    value: "agent",
    title: "Agent",
    description:
      "Manage properties assigned to you by a landlord, and handle tenant contact.",
    tag: "Requires landlord invitation",
  },
];

export const SIGNUP_ROLE_CTA: Record<AuthRole, string> = {
  landlord: "Continue as a landlord",
  tenant: "Continue as a tenant",
  agent: "Continue as an agent",
};

export const SIGNUP_ROLE_PILL: Record<AuthRole, string> = {
  landlord: "Signing up as a Landlord",
  tenant: "Signing up as a Tenant",
  agent: "Signing up as an Agent",
};

export const SIGNUP_TERMS = {
  prefix: "I agree to Vemra ",
  termsLabel: "Terms of Service",
  separator: " and ",
  privacyLabel: "Privacy Policy",
  suffix: ".",
  error: "Accept the Terms of Service and Privacy Policy to continue.",
} as const;

export const SIGNUP_DETAILS_SCREEN = {
  step: 2,
  totalSteps: 3,
  title: "Create your account",
  description: "Just the basics for now, verification comes next.",
  changeLabel: "Change",
  nameLabel: "Full name",
  emailLabel: "Email address",
  phoneLabel: "Phone number",
  passwordLabel: "Password",
  passwordHelper: "Use 8+ characters with a mix of letters and numbers.",
  confirmLabel: "Confirm password",
  submitLabel: "Continue to verification",
  dividerLabel: "or",
  googleLabel: "Continue with Google",
  footerPrompt: "Already have an account?",
  footerLabel: "Log in",
} as const;

export type VerificationStepState = "complete" | "pending";

export interface VerificationStep {
  title: string;
  description: string;
  state: VerificationStepState;
  status?: string;
  actionLabel?: string;
}

export const SIGNUP_VERIFICATION_SCREEN = {
  step: 3,
  totalSteps: 3,
  title: "Verify your identity",
  description:
    "Tenants will see the verified badge on your listings once this is complete. Usually takes under 10 minutes.",
  listLabel: "Verification checklist",
  noteTitle: "Why we ask for this:",
  noteBody:
    "Every tenant on Vemra can see that a landlord is verified before they pay a deposit. Your documents are reviewed by our team and never shown publicly.",
  submitLabel: "Complete verification",
} as const;

export const SIGNUP_VERIFICATION_STEPS: readonly VerificationStep[] = [
  {
    title: "Government-issued ID",
    description: "Drivers license or passport matched to your legal name",
    state: "complete",
    status: "Uploaded",
  },
  {
    title: "Proof of ownership",
    description: "A property title deed or mortgage statement for each listing",
    state: "complete",
    status: "Uploaded",
  },
  {
    title: "Payout account",
    description: "Where rent is sent once it clears and you withdraw",
    state: "pending",
    actionLabel: "Connect",
  },
];

export const TWO_FACTOR_SCREEN = {
  title: "Set up two-factor authentication",
  description:
    "Required for admin accounts. Scan this with an authenticator app.",
  manualPrompt: "Or enter manually:",
  manualCode: "JX3K TQ82 M91L PZ4R",
  otpLabel: "Enter the 6-digit code from your app.",
  otpLength: 6,
  otpError: "Enter all 6 digits to continue.",
  submitLabel: "Verify and continue",
  note: "Two-factor authentication is required and cannot be skipped for this account type.",
} as const;

export type VerificationReviewTone = "success" | "warning" | "danger";

export interface VerificationReviewRow {
  title: string;
  status: string;
  tone: VerificationReviewTone;
  detail?: string;
}

export const VERIFICATION_PENDING_SCREEN = {
  title: "Your documents are under review",
  description:
    "Our team is checking the documents you submitted. This usually takes under 24 hours, we will email you as soon as it is done.",
  cardLabel: "Document review status",
  note: "Submitted 4 hours ago.",
  ctaLabel: "Browse properties",
  ctaHref: "/browse",
} as const;

export const VERIFICATION_PENDING_ROWS: readonly VerificationReviewRow[] = [
  { title: "Government-issued ID", status: "Received", tone: "success" },
  { title: "Proof of ownership", status: "Received", tone: "success" },
  { title: "Payout account", status: "In review", tone: "warning" },
];

export const VERIFICATION_REJECTED_SCREEN = {
  title: "One document needs a fix",
  description:
    "Our team reviewed your submission, everything looks good except one item below. Update it and we will take another look.",
  cardLabel: "Document review status",
  ctaLabel: "Re-upload document",
  ctaHref: AUTH_ROUTES.signupVerification,
} as const;

export const VERIFICATION_REJECTED_ROWS: readonly VerificationReviewRow[] = [
  { title: "Government-issued ID", status: "Approved", tone: "success" },
  {
    title: "Proof of ownership",
    status: "Needs update",
    tone: "danger",
    detail:
      "The document was blurry in the corners, please re-upload a clearer photo or scan.",
  },
];

export interface AuthStat {
  value: string;
  label: string;
}

export const LOGIN_ASIDE = {
  headline: "One record, shared by everyone the lease affects.",
  headlineTablet: "One record, shared by everyone.",
  description:
    "Landlords, agents, and tenants see the same facts about rent, occupancy, and who's responsible for what.",
  descriptionTablet:
    "Landlords, agents, and tenants see the same facts about rent, occupancy, and responsibility.",
  stats: [
    { value: "2,400+", label: "Verified landlords" },
    { value: "18,900+", label: "Homes listed" },
  ] satisfies AuthStat[],
} as const;

export const LOGIN_SCREEN = {
  title: "Welcome back",
  description: "Log in to your Vemra account.",
  emailLabel: "Email address",
  emailPlaceholder: "you@example.com",
  passwordLabel: "Password",
  rememberLabel: "Stay signed in",
  forgotLabel: "Forgot password?",
  submitLabel: "Log in",
  dividerLabel: "or",
  googleLabel: "Continue with Google",
  footerPrompt: "New to Vemra?",
  footerLabel: "Create an account",
  roleGroupLabel: "Log in as",
} as const;

export const FORGOT_PASSWORD_SCREEN = {
  title: "Reset your password",
  description:
    "Enter the email on your account and we'll send a reset link.",
  emailLabel: "Email address",
  emailPlaceholder: "you@example.com",
  submitLabel: "Send reset link",
  backLabel: "Back to log in",
  sentTitle: "Check your email",
  sentDescriptionPrefix: "We sent a reset link to ",
  sentDescriptionSuffix: ". Follow it to choose a new password.",
} as const;

export const RESET_PASSWORD_SCREEN = {
  email: "aisha.bello@example.com",
  title: "Set a new password",
  descriptionPrefix: "Choose a new password for ",
  passwordLabel: "New password",
  passwordPlaceholder: "At least 8 characters",
  passwordHelper: "Use 8+ characters with a mix of letters and numbers.",
  confirmLabel: "Confirm new password",
  confirmPlaceholder: "Repeat password",
  submitLabel: "Update password",
  successTitle: "Password updated",
  successDescription: "You can now log in with your new password.",
  successCtaLabel: "Continue to log in",
} as const;

export type VerifyEmailStatus = "verified" | "pending" | "expired";

export interface VerifyEmailStateCopy {
  tone: "success" | "warning" | "error";
  title: string;
  descriptionBefore: string;
  descriptionAfter: string;
  ctaLabel: string;
  ctaHref?: string;
}

export const VERIFY_EMAIL_SCREEN = {
  email: "aisha.bello@example.com",
  copyright: "© 2026 Vemra Technologies. All rights reserved.",
  backLabel: "Back to log in",
  resentNotice: "A new link is on its way.",
} as const;

export const VERIFY_EMAIL_STATES: Record<
  VerifyEmailStatus,
  VerifyEmailStateCopy
> = {
  verified: {
    tone: "success",
    title: "Your email is confirmed",
    descriptionBefore: "",
    descriptionAfter:
      " is now verified. You can continue setting up your account.",
    ctaLabel: "Continue to verification",
    ctaHref: AUTH_ROUTES.signupVerification,
  },
  pending: {
    tone: "warning",
    title: "Confirm your email",
    descriptionBefore: "We sent a confirmation link to ",
    descriptionAfter: ". Open it to finish setting up your account.",
    ctaLabel: "Resend confirmation link",
  },
  expired: {
    tone: "error",
    title: "This link has expired",
    descriptionBefore: "The link we sent to ",
    descriptionAfter: " has expired. Request a new one to continue.",
    ctaLabel: "Send a new link",
  },
};

export interface OnboardingStep {
  title: string;
  detail: string;
}

export interface OnboardingCompleteCopy {
  metaTitle: string;
  title: string;
  description: string;
  stepsLabel: string;
  steps: readonly OnboardingStep[];
  ctaLabel: string;
  ctaHref: string;
}

export const ONBOARDING_COMPLETE: Record<AuthRole, OnboardingCompleteCopy> = {
  tenant: {
    metaTitle: "Tenant account ready · Vemra",
    title: "You're all set, Aisha",
    description:
      "Your tenant account is ready. You can browse verified homes and message landlords or agents directly.",
    stepsLabel: "What to do next",
    steps: [
      {
        title: "Browse verified homes",
        detail: "Every listing shows a verified landlord or agent",
      },
      {
        title: "Apply when you find one you like",
        detail: "Usually reviewed within 2-3 days",
      },
      {
        title: "Manage rent from your dashboard",
        detail: "See due dates and set up a payment plan anytime",
      },
    ],
    ctaLabel: "Browse homes",
    ctaHref: "/browse",
  },
  landlord: {
    metaTitle: "Landlord account ready · Vemra",
    title: "You're verified, Daniel",
    description:
      "Your landlord account is ready. Tenants will see your verified badge on every listing you publish.",
    stepsLabel: "What to do next",
    steps: [
      {
        title: "List your first property",
        detail: "Takes about 5 minutes",
      },
      {
        title: "Connect your payout account",
        detail: "So you can withdraw rent once it clears",
      },
      {
        title: "Invite an agent (optional)",
        detail: "Assign someone to oversee day-to-day",
      },
    ],
    ctaLabel: "List your first property",
    ctaHref: "/list-your-property",
  },
  agent: {
    metaTitle: "Agent account ready · Vemra",
    title: "You're verified, Priya",
    description:
      "Your agent account is ready. Once a landlord assigns you to a property, it'll show up right here.",
    stepsLabel: "What to do next",
    steps: [
      {
        title: "Wait for a property invitation",
        detail: "Landlords assign agents from their dashboard",
      },
      {
        title: "Manage tenant contact",
        detail: "Messages, viewings, and maintenance in one inbox",
      },
      {
        title: "Track rent status per unit",
        detail: "See what's due and what's cleared",
      },
    ],
    ctaLabel: "Go to your dashboard",
    ctaHref: "/",
  },
};
