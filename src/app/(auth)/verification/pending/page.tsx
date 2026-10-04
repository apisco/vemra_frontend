import type { Metadata } from "next";

import { HourglassIcon } from "@/components/icons/hourglass-icon";
import { VERIFICATION_PENDING_SCREEN } from "@/constants/auth";
import { VerificationStatus } from "@/features/auth/verification-status";
import {
  kycReviewRows,
  reviewRowsFor,
} from "@/features/auth/verification-steps";
import { getAccount } from "@/lib/api/resources/auth";

export const metadata: Metadata = {
  title: "Verification in review · Vemra",
  description: VERIFICATION_PENDING_SCREEN.description,
};

export const dynamic = "force-dynamic";

export default async function VerificationPendingPage() {
  const account = await getAccount();
  const rows = account
    ? reviewRowsFor(account)
    : kycReviewRows("UNDER_REVIEW");

  return (
    <VerificationStatus
      tone="warning"
      icon={<HourglassIcon />}
      title={VERIFICATION_PENDING_SCREEN.title}
      description={
        account?.onboarding.applicantMessage ??
        VERIFICATION_PENDING_SCREEN.description
      }
      cardLabel={VERIFICATION_PENDING_SCREEN.cardLabel}
      rows={rows}
      note={VERIFICATION_PENDING_SCREEN.note}
      ctaLabel={VERIFICATION_PENDING_SCREEN.ctaLabel}
      ctaHref={VERIFICATION_PENDING_SCREEN.ctaHref}
    />
  );
}
