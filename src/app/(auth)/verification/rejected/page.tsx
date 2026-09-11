import type { Metadata } from "next";

import { AlertTriangleIcon } from "@/components/icons/alert-triangle-icon";
import {
  VERIFICATION_REJECTED_ROWS,
  VERIFICATION_REJECTED_SCREEN,
} from "@/constants/auth";
import { VerificationStatus } from "@/features/auth/verification-status";

export const metadata: Metadata = {
  title: "One document needs a fix · Vemra",
  description: VERIFICATION_REJECTED_SCREEN.description,
};

export default function VerificationRejectedPage() {
  return (
    <VerificationStatus
      tone="error"
      icon={<AlertTriangleIcon />}
      title={VERIFICATION_REJECTED_SCREEN.title}
      description={VERIFICATION_REJECTED_SCREEN.description}
      cardLabel={VERIFICATION_REJECTED_SCREEN.cardLabel}
      rows={VERIFICATION_REJECTED_ROWS}
      ctaLabel={VERIFICATION_REJECTED_SCREEN.ctaLabel}
      ctaHref={VERIFICATION_REJECTED_SCREEN.ctaHref}
    />
  );
}
