"use client";

import Link from "next/link";
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
  validateRequired,
} from "@/lib/validation";

const TERMS_LINK_CLASSES =
  "rounded-sm font-semibold text-brand-700 transition-colors hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";

type SignupDetailsValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  terms: boolean;
};

export interface SignupDetailsFormProps {
  className?: string;
}

export function SignupDetailsForm({ className }: SignupDetailsFormProps) {
  const termsErrorId = useId();

  const form = useAuthForm<SignupDetailsValues>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
      terms: false,
    },
    validate: (values) => ({
      name: validateRequired(values.name, SIGNUP_DETAILS_SCREEN.nameLabel),
      email: validateEmail(values.email),
      phone: validateRequired(values.phone, SIGNUP_DETAILS_SCREEN.phoneLabel),
      password: validatePassword(values.password),
      confirm: validateMatch(
        values.confirm,
        values.password,
        SIGNUP_DETAILS_SCREEN.confirmLabel,
      ),
      terms: values.terms ? undefined : SIGNUP_TERMS.error,
    }),
  });

  const termsError = form.errorFor("terms");

  return (
    <form noValidate onSubmit={form.handleSubmit} className={className}>
      <AuthCard variant="details">
        <Input
          label={SIGNUP_DETAILS_SCREEN.nameLabel}
          name="name"
          autoComplete="name"
          value={form.values.name}
          onChange={(event) => form.setValue("name", event.target.value)}
          error={form.errorFor("name")}
        />
        <Input
          label={SIGNUP_DETAILS_SCREEN.emailLabel}
          type="email"
          name="email"
          autoComplete="email"
          value={form.values.email}
          onChange={(event) => form.setValue("email", event.target.value)}
          error={form.errorFor("email")}
        />
        <Input
          label={SIGNUP_DETAILS_SCREEN.phoneLabel}
          type="tel"
          name="phone"
          autoComplete="tel"
          value={form.values.phone}
          onChange={(event) => form.setValue("phone", event.target.value)}
          error={form.errorFor("phone")}
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
