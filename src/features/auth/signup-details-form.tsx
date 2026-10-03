"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId } from "react";

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
import {
  validateEmail,
  validateMatch,
  validatePassword,
} from "@/lib/validation";

const TERMS_LINK_CLASSES =
  "rounded-sm font-semibold text-brand-700 transition-colors hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";

type SignupDetailsValues = {
  email: string;
  password: string;
  confirm: string;
  terms: boolean;
};

export interface SignupDetailsFormProps {
  className?: string;
}

export function SignupDetailsForm({ className }: SignupDetailsFormProps) {
  const termsErrorId = useId();
  const router = useRouter();

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
    onSubmit: () => router.push(AUTH_ROUTES.signupVerification),
  });

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

        <AuthDivider label={SIGNUP_DETAILS_SCREEN.dividerLabel} className="md:gap-4" />

        <Button variant="secondary" fullWidth>
          {SIGNUP_DETAILS_SCREEN.googleLabel}
        </Button>
      </AuthCard>
    </form>
  );
}
