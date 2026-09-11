import type { Metadata } from "next";

import { HourglassIcon } from "@/components/icons/hourglass-icon";
import {
  VERIFICATION_PENDING_ROWS,
  VERIFICATION_PENDING_SCREEN,
} from "@/constants/auth";
import { VerificationStatus } from "@/features/auth/verification-status";

export const metadata: Metadata = {
  title: "Verification in review · Vemra",
  description: VERIFICATION_PENDING_SCREEN.description,
};

export default function VerificationPendingPage() {
  return (
    <VerificationStatus
      tone="warning"
      icon={<HourglassIcon />}
      title={VERIFICATION_PENDING_SCREEN.title}
      description={VERIFICATION_PENDING_SCREEN.description}
      cardLabel={VERIFICATION_PENDING_SCREEN.cardLabel}
      rows={VERIFICATION_PENDING_ROWS}
      note={VERIFICATION_PENDING_SCREEN.note}
      ctaLabel={VERIFICATION_PENDING_SCREEN.ctaLabel}
      ctaHref={VERIFICATION_PENDING_SCREEN.ctaHref}
    />
  );
}
