import type { Metadata } from "next";

import { AUTH_ROUTES, LOGIN_SCREEN } from "@/constants/auth";
import { AuthCard } from "@/features/auth/auth-card";
import { AuthFooter } from "@/features/auth/auth-footer";
import { AuthHeader } from "@/features/auth/auth-header";
import { AuthLayout } from "@/features/auth/auth-layout";
import { LoginAside } from "@/features/auth/login-aside";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Log in · Vemra",
  description: "Log in to your Vemra account.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : null;

  return (
    <AuthLayout aside={<LoginAside />}>
      <div className="flex w-full flex-col lg:gap-5">
        <AuthCard>
          <AuthHeader
            title={LOGIN_SCREEN.title}
            description={LOGIN_SCREEN.description}
          />
          <LoginForm next={nextPath} />
          <AuthFooter
            prompt={LOGIN_SCREEN.footerPrompt}
            href={AUTH_ROUTES.signup}
            label={LOGIN_SCREEN.footerLabel}
          />
        </AuthCard>
      </div>
    </AuthLayout>
  );
}
