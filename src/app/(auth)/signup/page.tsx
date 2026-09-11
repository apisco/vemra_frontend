import type { Metadata } from "next";

import { SIGNUP_ROLE_SCREEN } from "@/constants/auth";
import { AuthLayout } from "@/features/auth/auth-layout";
import { SignupRolePicker } from "@/features/auth/signup-role-picker";
import { SignupStepHeader } from "@/features/auth/signup-step-header";

export const metadata: Metadata = {
  title: "Create an account · Vemra",
  description: SIGNUP_ROLE_SCREEN.description,
};

export default function SignupPage() {
  return (
    <AuthLayout width="wide" gap="lg" justify="desktop" logoSize="none">
      <SignupStepHeader
        step={SIGNUP_ROLE_SCREEN.step}
        totalSteps={SIGNUP_ROLE_SCREEN.totalSteps}
        title={SIGNUP_ROLE_SCREEN.title}
        description={SIGNUP_ROLE_SCREEN.description}
      />
      <SignupRolePicker />
    </AuthLayout>
  );
}
