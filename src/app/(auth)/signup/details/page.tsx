import type { Metadata } from "next";

import {
  AUTH_ROUTES,
  SIGNUP_DEFAULT_ROLE,
  SIGNUP_DETAILS_SCREEN,
  SIGNUP_ROLE_PILL,
} from "@/constants/auth";
import type { Caps } from "@/constants/auth";
import { AuthFooter } from "@/features/auth/auth-footer";
import { AuthLayout } from "@/features/auth/auth-layout";
import { ROLE_ICONS } from "@/features/auth/role-icons";
import { RolePill } from "@/features/auth/role-pill";
import { SignupDetailsForm } from "@/features/auth/signup-details-form";
import { SignupStepHeader } from "@/features/auth/signup-step-header";

export const metadata: Metadata = {
  title: "Create your account · Vemra",
  description: SIGNUP_DETAILS_SCREEN.description,
};

export default async function SignupDetailsPage({
  searchParams,
}: PageProps<"/signup/details">) {
  const { role } = await searchParams;
  const selectedRole: Caps = role === "tenant" ? "tenant" : SIGNUP_DEFAULT_ROLE;

  return (
    <AuthLayout width="content" gap="xs" justify="desktop" logoSize="none">
      <SignupStepHeader
        step={SIGNUP_DETAILS_SCREEN.step}
        totalSteps={SIGNUP_DETAILS_SCREEN.totalSteps}
        title={SIGNUP_DETAILS_SCREEN.title}
        description={SIGNUP_DETAILS_SCREEN.description}
      />
      <RolePill
        icon={ROLE_ICONS[selectedRole]}
        label={SIGNUP_ROLE_PILL[selectedRole]}
        actionLabel={SIGNUP_DETAILS_SCREEN.changeLabel}
        actionHref={AUTH_ROUTES.signup}
        className="md:mx-auto md:max-w-[520px]"
      />
      <SignupDetailsForm
        role={selectedRole}
        className="md:mx-auto md:w-full md:max-w-[520px]"
      />
      <AuthFooter
        prompt={SIGNUP_DETAILS_SCREEN.footerPrompt}
        href={AUTH_ROUTES.login}
        label={SIGNUP_DETAILS_SCREEN.footerLabel}
      />
    </AuthLayout>
  );
}
