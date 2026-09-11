import type { Metadata } from "next";

import { FORGOT_PASSWORD_SCREEN } from "@/constants/auth";
import { AuthLayout } from "@/features/auth/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password · Vemra",
  description: FORGOT_PASSWORD_SCREEN.description,
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout width="xs" gap="sm">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
