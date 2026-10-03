import type { Iso8601 } from "@/types/api/common";

export type UserRole = "tenant" | "landlord" | "property_admin" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  roles: readonly UserRole[];
  isEmailVerified: boolean;
  isIdentityVerified: boolean;
}

export interface Session {
  user: SessionUser;
  activeRole: UserRole;
  expiresAt: Iso8601 | null;
}

export type VerificationState =
  | "not_started"
  | "pending"
  | "in_review"
  | "complete"
  | "rejected";

export interface VerificationChecklistItem {
  id: string;
  title: string;
  description: string;
  state: VerificationState;
  status: string | null;
  actionLabel: string | null;
}

export interface VerificationStatus {
  state: VerificationState;
  items: readonly VerificationChecklistItem[];
  submittedAt: Iso8601 | null;
  reviewedAt: Iso8601 | null;
  rejectionReason: string | null;
  estimatedWait: string | null;
}

export interface TwoFactorSetup {
  provisioningUri: string;
  secret: string;
  recoveryCodes: readonly string[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  href: string | null;
}

export interface OnboardingWelcome {
  role: UserRole;
  userName: string;
  steps: readonly OnboardingStep[];
}


export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
  remember: boolean;
}

export interface SignupPayload {
  email: string;
  password: string;
  role: UserRole;
  acceptedTerms: boolean;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface AuthResult {
  session: Session;
  token: string;
  expiresAt: Iso8601 | null;
}
