import type { Metadata } from "next";

import { LogoMark } from "@/components/layout/logo-mark";
import { TWO_FACTOR_SCREEN } from "@/constants/auth";
import { AuthLayout } from "@/features/auth/auth-layout";
import { TwoFactorForm } from "@/features/auth/two-factor-form";

export const metadata: Metadata = {
  title: "Set up two-factor authentication · Vemra",
  description: TWO_FACTOR_SCREEN.description,
};

export default function StaffTwoFactorPage() {
  return (
    <AuthLayout width="otp" gap="xs" justify="desktop" logoSize="none">
      <LogoMark className="self-center" />
      <TwoFactorForm />
    </AuthLayout>
  );
}
