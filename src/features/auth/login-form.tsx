"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { DEFAULT_SIGNED_IN_PATH } from "@/config/supabase";
import type { AuthRole } from "@/constants/auth";
import { AUTH_ROLES, AUTH_ROUTES, LOGIN_SCREEN } from "@/constants/auth";
import { AuthDivider } from "@/features/auth/auth-divider";
import { useAuthForm } from "@/features/auth/use-auth-form";
import { createClient } from "@/lib/supabase/client";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { resolveNextPath } from "@/lib/supabase/paths";
import { authCallbackUrl, rememberPendingEmail } from "@/lib/supabase/urls";
import { validateEmail, validateRequired } from "@/lib/validation";

type LoginValues = {
  email: string;
  password: string;
  remember: boolean;
};

export interface LoginFormProps {
  next?: string | null;
}

const VERIFIED_EMAIL_PATH = `${AUTH_ROUTES.verifyEmail}?status=verified`;

function signedInPath(role: AuthRole): string {
  return role === "LANDLORD" ? "/landlord" : DEFAULT_SIGNED_IN_PATH;
}

function roleFromMetadata(metadata: Record<string, unknown>): AuthRole | null {
  return metadata.role === "LANDLORD" ? "LANDLORD" : null;
}

export function LoginForm({ next = null }: LoginFormProps) {
  const router = useRouter();
  const [role, setRole] = useState<AuthRole>("TENANT");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useAuthForm<LoginValues>({
    initialValues: { email: "", password: "", remember: true },
    validate: (values) => ({
      email: validateEmail(values.email),
      password: validateRequired(values.password, "Password"),
    }),
    onSubmit: async (values) => {
      setSubmitError(null);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) {
          if (error.code === "email_not_confirmed") {
            const { error: resendError } = await supabase.auth.resend({
              type: "signup",
              email: values.email,
              options: {
                emailRedirectTo: authCallbackUrl(VERIFIED_EMAIL_PATH),
              },
            });
            if (resendError) {
              throw resendError;
            }
            rememberPendingEmail(values.email);
            router.push(`${AUTH_ROUTES.verifyEmail}?status=pending`);
            return;
          }
          throw error;
        }
        const metadata: Record<string, unknown> = data.user?.user_metadata ?? {};
        const fallback = signedInPath(roleFromMetadata(metadata) ?? role);
        router.push(resolveNextPath(next, fallback));
      } catch (error) {
        setSubmitError(supabaseErrorMessage(error));
        throw error;
      }
    },
  });

  const handleGoogle = async () => {
    setSubmitError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: authCallbackUrl(resolveNextPath(next, signedInPath(role))),
        },
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      setSubmitError(supabaseErrorMessage(error));
    }
  };

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit}
      className="flex flex-col gap-6 lg:gap-7"
    >
      <SegmentedControl
        label={LOGIN_SCREEN.roleGroupLabel}
        options={AUTH_ROLES}
        value={role}
        onChange={setRole}
      />

      <div className="flex flex-col gap-4">
        <Input
          label={LOGIN_SCREEN.emailLabel}
          type="email"
          name="email"
          autoComplete="email"
          placeholder={LOGIN_SCREEN.emailPlaceholder}
          value={form.values.email}
          onChange={(event) => form.setValue("email", event.target.value)}
          error={form.errorFor("email")}
        />
        <Input
          label={LOGIN_SCREEN.passwordLabel}
          type="password"
          name="password"
          autoComplete="current-password"
          showPasswordToggle
          value={form.values.password}
          onChange={(event) => form.setValue("password", event.target.value)}
          error={form.errorFor("password")}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Checkbox
          label={LOGIN_SCREEN.rememberLabel}
          name="remember"
          checked={form.values.remember}
          onChange={(event) => form.setValue("remember", event.target.checked)}
          containerClassName="md:font-semibold lg:gap-3"
        />
        <Link
          href={AUTH_ROUTES.forgotPassword}
          className="rounded-sm text-label-sm leading-[16px] font-semibold text-brand-700 transition-colors hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 md:text-label-md md:leading-[20px]"
        >
          {LOGIN_SCREEN.forgotLabel}
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:gap-3">
        <Button type="submit" fullWidth isLoading={form.isSubmitting}>
          {LOGIN_SCREEN.submitLabel}
        </Button>
        {submitError ? (
          <p role="alert" className="text-center text-label-sm text-error-600">
            {submitError}
          </p>
        ) : null}

        <AuthDivider label={LOGIN_SCREEN.dividerLabel} />

        <Button variant="secondary" fullWidth onClick={handleGoogle}>
          {LOGIN_SCREEN.googleLabel}
        </Button>
      </div>
    </form>
  );
}
