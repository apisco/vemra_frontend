import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Caps } from "@/constants/auth";
import { AUTH_ROLES, ONBOARDING_COMPLETE } from "@/constants/auth";
import { OnboardingComplete } from "@/features/auth/onboarding-complete";

export const dynamicParams = false;

export function generateStaticParams() {
  return AUTH_ROLES.map((option) => ({ role: option.value }));
}

function isCaps(value: string): value is Caps {
  return AUTH_ROLES.some((option) => option.value === value);
}

export async function generateMetadata({
  params,
}: PageProps<"/welcome/[role]">): Promise<Metadata> {
  const { role } = await params;

  if (!isCaps(role)) {
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

  if (!isCaps(role)) {
    notFound();
  }

  return <OnboardingComplete copy={ONBOARDING_COMPLETE[role]} />;
}
