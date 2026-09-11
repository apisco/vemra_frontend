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

export default function LoginPage() {
  return (
    <AuthLayout aside={<LoginAside />}>
      <AuthCard>
        <AuthHeader
          title={LOGIN_SCREEN.title}
          description={LOGIN_SCREEN.description}
        />
        <LoginForm />
        <AuthFooter
          prompt={LOGIN_SCREEN.footerPrompt}
          href={AUTH_ROUTES.signup}
          label={LOGIN_SCREEN.footerLabel}
        />
      </AuthCard>
    </AuthLayout>
  );
}
