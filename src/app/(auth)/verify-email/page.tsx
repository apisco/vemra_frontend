import type { Metadata } from "next";
import { Suspense } from "react";

import { VERIFY_EMAIL_SCREEN, VERIFY_EMAIL_STATES } from "@/constants/auth";
import { AuthLayout } from "@/features/auth/auth-layout";
import {
  VerifyEmailCard,
  VerifyEmailPanel,
} from "@/features/auth/verify-email-panel";

export const metadata: Metadata = {
  title: "Email confirmed · Vemra",
  description: VERIFY_EMAIL_STATES.verified.title,
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout width="sm" justify="center">
      <Suspense fallback={<VerifyEmailCard status="verified" />}>
        <VerifyEmailPanel />
      </Suspense>
      <p className="text-center text-body-md leading-[20px] text-neutral-700 lg:text-label-sm lg:leading-[18px]">
        {VERIFY_EMAIL_SCREEN.copyright}
      </p>
    </AuthLayout>
  );
}
