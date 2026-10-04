import { AUTH_ROUTES } from "@/constants/auth";

/**
 * Account screens whose cached onboarding/verification state a profile or KYC
 * mutation invalidates. Shared so every action revalidates the same set; adding
 * a screen updates this one list.
 */
export const ACCOUNT_PATHS = [
  AUTH_ROUTES.signupVerification,
  AUTH_ROUTES.verificationPending,
  AUTH_ROUTES.verificationRejected,
] as const;
