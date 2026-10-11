import type { Metadata } from "next";

import { LogoMark } from "@/components/layout/logo-mark";
import { TWO_FACTOR_SCREEN } from "@/constants/auth";
import { AuthLayout } from "@/features/auth/auth-layout";
import { TwoFactorForm } from "@/features/auth/two-factor-form";
import { requireSession } from "@/lib/api/resources/auth";

export const metadata: Metadata = {
  title: "Two-factor authentication · Vemra",
  description: TWO_FACTOR_SCREEN.description,
};

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TwoFactorSetupPage({
  searchParams,
}: PageProps<"/two-factor">) {
  await requireSession("/two-factor");
  const params = await searchParams;
  const next = firstValue(params.next);

  return (
    <AuthLayout width="otp" gap="xs" justify="desktop" logoSize="none">
      <LogoMark className="self-center" />
      <TwoFactorForm
        redirectTo={next !== undefined && next.startsWith("/") ? next : undefined}
      />
    </AuthLayout>
  );
}
