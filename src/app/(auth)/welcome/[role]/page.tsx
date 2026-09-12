import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { AuthRole } from "@/constants/auth";
import { AUTH_ROLES, ONBOARDING_COMPLETE } from "@/constants/auth";
import { OnboardingComplete } from "@/features/auth/onboarding-complete";

export const dynamicParams = false;

export function generateStaticParams() {
  return AUTH_ROLES.map((option) => ({ role: option.value }));
}

function isAuthRole(value: string): value is AuthRole {
  return AUTH_ROLES.some((option) => option.value === value);
}

export async function generateMetadata({
  params,
}: PageProps<"/welcome/[role]">): Promise<Metadata> {
  const { role } = await params;

  if (!isAuthRole(role)) {
    return {};
  }

  return {
    title: ONBOARDING_COMPLETE[role].metaTitle,
    description: ONBOARDING_COMPLETE[role].description,
  };
}

export default async function WelcomePage({
  params,
}: PageProps<"/welcome/[role]">) {
  const { role } = await params;

  if (!isAuthRole(role)) {
    notFound();
  }

  return <OnboardingComplete copy={ONBOARDING_COMPLETE[role]} />;
}
