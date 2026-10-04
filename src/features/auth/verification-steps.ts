import type {
  VerificationReviewRow,
  VerificationReviewTone,
  VerificationStep,
} from "@/constants/auth";
import type { AccountProfile, KycStatus, OnboardingNextStep } from "@/types/api/auth";

/**
 * Presentation mapping for the KYC workflow.
 *
 * The backend exposes only an overall `kycStatus` (plus a reviewer message), not
 * per-document state, so every checklist row reflects that overall status. This
 * keeps the designed checklist accurate without inventing per-document detail.
 */

export interface KycCheckDefinition {
  checkType: string;
  title: string;
  description: string;
}

export const KYC_CHECKS: readonly KycCheckDefinition[] = [
  {
    checkType: "IDENTITY",
    title: "Government-issued ID",
    description: "Driver's licence or passport matched to your legal name",
  },
  {
    checkType: "PROOF_OF_ADDRESS",
    title: "Proof of address",
    description: "A recent utility bill or bank statement in your name",
  },
];

interface KycCopy {
  state: VerificationStep["state"];
  status: string;
}

function copyFor(status: KycStatus | null): KycCopy {
  switch (status) {
    case "APPROVED":
      return { state: "complete", status: "Approved" };
    case "SUBMITTED":
      return { state: "pending", status: "Received" };
    case "UNDER_REVIEW":
      return { state: "pending", status: "In review" };
    case "ACTION_REQUIRED":
    case "REJECTED":
    case "EXPIRED":
      return { state: "pending", status: "Needs update" };
    default:
      return { state: "pending", status: "Not started" };
  }
}

export function verificationStepsFor(
  account: AccountProfile,
): readonly VerificationStep[] {
  const copy = copyFor(account.onboarding.kycStatus);
  return KYC_CHECKS.map((check) => ({
    title: check.title,
    description: check.description,
    state: copy.state,
    status: copy.status,
  }));
}

export interface OnboardingCopy {
  title: string;
  description: string;
}

export function onboardingCopy(nextStep: OnboardingNextStep): OnboardingCopy {
  switch (nextStep) {
    case "EMAIL_VERIFICATION":
      return {
        title: "Confirm your email",
        description:
          "We sent a confirmation link to your inbox. Open it, then come back to finish verification.",
      };
    case "KYC_SUBMISSION":
      return {
        title: "Verify your identity",
        description:
          "Upload the documents below. Our team reviews them, usually within 24 hours.",
      };
    case "ACTION_REQUIRED":
      return {
        title: "One document needs a fix",
        description:
          "Our team reviewed your submission and needs an update before they can approve it.",
      };
    case "UNDER_REVIEW":
      return {
        title: "Your documents are under review",
        description:
          "Our team is checking the documents you submitted. We'll email you when it's done.",
      };
    case "COMPLETE":
      return {
        title: "You're verified",
        description:
          "Your identity check is complete. You have full access to Vemra.",
      };
  }
}

function reviewTone(status: KycStatus | null): VerificationReviewTone {
  if (status === "APPROVED") {
    return "success";
  }
  if (
    status === "ACTION_REQUIRED" ||
    status === "REJECTED" ||
    status === "EXPIRED"
  ) {
    return "danger";
  }
  return "warning";
}

/**
 * Checklist rows for the review-status screens. Both the live account read and
 * the static fallback go through here, so a screen never renders two different
 * checklists depending on whether `/me` succeeded.
 */
export function kycReviewRows(
  status: KycStatus | null,
  message?: string | null,
): readonly VerificationReviewRow[] {
  const tone = reviewTone(status);
  const label = copyFor(status).status;

  return KYC_CHECKS.map((check) => ({
    title: check.title,
    status: label,
    tone,
    ...(tone === "danger" && message ? { detail: message } : {}),
  }));
}

export function reviewRowsFor(
  account: AccountProfile,
): readonly VerificationReviewRow[] {
  return kycReviewRows(
    account.onboarding.kycStatus,
    account.onboarding.applicantMessage,
  );
}
