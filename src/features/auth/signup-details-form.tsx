"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  AUTH_ROUTES,
  SIGNUP_DETAILS_SCREEN,
  SIGNUP_TERMS,
} from "@/constants/auth";
import { AuthCard } from "@/features/auth/auth-card";
import { AuthDivider } from "@/features/auth/auth-divider";
import { PasswordField } from "@/features/auth/password-field";
import { useAuthForm } from "@/features/auth/use-auth-form";
import { createClient } from "@/lib/supabase/client";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { authCallbackUrl, rememberPendingEmail } from "@/lib/supabase/urls";
import {
  validateEmail,
  validateMatch,
  validatePassword,
} from "@/lib/validation";
import type { UserRole } from "@/types/api/auth";

const TERMS_LINK_CLASSES =
  "rounded-sm font-semibold text-brand-700 transition-colors hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";

const VERIFIED_EMAIL_PATH = `${AUTH_ROUTES.verifyEmail}?status=verified`;
const PENDING_EMAIL_PATH = `${AUTH_ROUTES.verifyEmail}?status=pending`;

type SignupDetailsValues = {
  email: string;
  password: string;
  confirm: string;
  terms: boolean;
};

export interface SignupDetailsFormProps {
  role?: UserRole;
  className?: string;
}

export function SignupDetailsForm({
  role = "tenant",
  className,
}: SignupDetailsFormProps) {
  const termsErrorId = useId();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useAuthForm<SignupDetailsValues>({
    initialValues: {
      email: "",
      password: "",
      confirm: "",
      terms: false,
    },
    validate: (values) => ({
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirm: validateMatch(
        values.confirm,
        values.password,
        SIGNUP_DETAILS_SCREEN.confirmLabel,
      ),
      terms: values.terms ? undefined : SIGNUP_TERMS.error,
    }),
    onSubmit: async (values) => {
      setSubmitError(null);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: { role },
            emailRedirectTo: authCallbackUrl(VERIFIED_EMAIL_PATH),
          },
        });
        if (error) {
          throw error;
        }
        if (data.session === null) {
          rememberPendingEmail(values.email);
          router.push(PENDING_EMAIL_PATH);
          return;
        }
        router.push(AUTH_ROUTES.signupVerification);
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
        options: { redirectTo: authCallbackUrl(AUTH_ROUTES.signupVerification) },
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      setSubmitError(supabaseErrorMessage(error));
    }
  };

  const termsError = form.errorFor("terms");

  return (
    <form noValidate onSubmit={form.handleSubmit} className={className}>
      <AuthCard variant="details">
        <Input
          label={SIGNUP_DETAILS_SCREEN.emailLabel}
          type="email"
          name="email"
          autoComplete="email"
          value={form.values.email}
          onChange={(event) => form.setValue("email", event.target.value)}
          error={form.errorFor("email")}
        />
        <PasswordField
          label={SIGNUP_DETAILS_SCREEN.passwordLabel}
          name="password"
          autoComplete="new-password"
          helperText={SIGNUP_DETAILS_SCREEN.passwordHelper}
          value={form.values.password}
          onChange={(event) => form.setValue("password", event.target.value)}
          error={form.errorFor("password")}
          strengthValue={form.values.password}
        />
        <PasswordField
          label={SIGNUP_DETAILS_SCREEN.confirmLabel}
          name="confirm"
          autoComplete="new-password"
          value={form.values.confirm}
          onChange={(event) => form.setValue("confirm", event.target.value)}
          error={form.errorFor("confirm")}
        />

        <div className="flex flex-col gap-1.5">
          <Checkbox
            align="start"
            name="terms"
            checked={form.values.terms}
            onChange={(event) => form.setValue("terms", event.target.checked)}
            aria-invalid={termsError ? true : undefined}
            aria-describedby={termsError ? termsErrorId : undefined}
            containerClassName="md:gap-3"
            label={
              <span className="leading-[18px] md:leading-[20px]">
                {SIGNUP_TERMS.prefix}
                <Link href={AUTH_ROUTES.terms} className={TERMS_LINK_CLASSES}>
                  {SIGNUP_TERMS.termsLabel}
                </Link>
                {SIGNUP_TERMS.separator}
                <Link href={AUTH_ROUTES.privacy} className={TERMS_LINK_CLASSES}>
                  {SIGNUP_TERMS.privacyLabel}
                </Link>
                {SIGNUP_TERMS.suffix}
              </span>
            }
          />
          {termsError ? (
            <p
              id={termsErrorId}
              role="alert"
              className="text-label-sm text-error-600"
            >
              {termsError}
            </p>
          ) : null}
        </div>

        <Button type="submit" fullWidth isLoading={form.isSubmitting}>
          {SIGNUP_DETAILS_SCREEN.submitLabel}
        </Button>
        {submitError ? (
          <p role="alert" className="text-center text-label-sm text-error-600">
            {submitError}
          </p>
        ) : null}

        <AuthDivider label={SIGNUP_DETAILS_SCREEN.dividerLabel} className="md:gap-4" />

        <Button variant="secondary" fullWidth onClick={handleGoogle}>
          {SIGNUP_DETAILS_SCREEN.googleLabel}
        </Button>
      </AuthCard>
    </form>
  );
}
