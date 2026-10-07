import { AUTH_ROUTES } from "@/constants/auth";


export const ACCOUNT_PATHS = [
  AUTH_ROUTES.signupVerification,
  AUTH_ROUTES.verificationPending,
  AUTH_ROUTES.verificationRejected,
] as const;
