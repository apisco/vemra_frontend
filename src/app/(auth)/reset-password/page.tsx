import type { Metadata } from "next";

import { RESET_PASSWORD_SCREEN } from "@/constants/auth";
import { AuthLayout } from "@/features/auth/auth-layout";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";

export const metadata: Metadata = {
  title: `${RESET_PASSWORD_SCREEN.title} · Vemra`,
  description: "Choose a new password for your Vemra account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout width="xs" gap="sm">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
