"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { Button, buttonClasses } from "@/components/ui/button";
import { AUTH_ROUTES, RESET_PASSWORD_SCREEN } from "@/constants/auth";
import { AuthCard } from "@/features/auth/auth-card";
import { AuthHeader } from "@/features/auth/auth-header";
import { PasswordField } from "@/features/auth/password-field";
import { StatusIcon } from "@/features/auth/status-icon";
import { useAuthForm } from "@/features/auth/use-auth-form";
import { createClient } from "@/lib/supabase/client";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { validateMatch, validatePassword } from "@/lib/validation";

type ResetPasswordValues = {
  password: string;
  confirm: string;
};

export function ResetPasswordForm() {
  const confirmation = useRef<HTMLDivElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useAuthForm<ResetPasswordValues>({
    initialValues: { password: "", confirm: "" },
    validate: (values) => ({
      password: validatePassword(values.password),
      confirm: validateMatch(
        values.confirm,
        values.password,
        RESET_PASSWORD_SCREEN.confirmLabel,
      ),
    }),
    onSubmit: async (values) => {
      setSubmitError(null);
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
          password: values.password,
        });
        if (error) {
          throw error;
        }
      } catch (error) {
        setSubmitError(supabaseErrorMessage(error));
        throw error;
      }
    },
  });

  useEffect(() => {
    if (form.isSubmitted) {
      confirmation.current?.focus();
    }
  }, [form.isSubmitted]);

  if (form.isSubmitted) {
    return (
      <div ref={confirmation} tabIndex={-1} role="status">
        <AuthCard variant="form">
          <AuthHeader
            variant="status"
            align="center"
            icon={
              <StatusIcon tone="success">
                <CheckCircleIcon />
              </StatusIcon>
            }
            title={RESET_PASSWORD_SCREEN.successTitle}
            description={RESET_PASSWORD_SCREEN.successDescription}
          />
          <Link
            href={AUTH_ROUTES.login}
            className={buttonClasses({ fullWidth: true })}
          >
            {RESET_PASSWORD_SCREEN.successCtaLabel}
          </Link>
        </AuthCard>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={form.handleSubmit}>
      <AuthCard variant="form">
        <AuthHeader
          variant="compact"
          align="start"
          title={RESET_PASSWORD_SCREEN.title}
          description={
            <>
              {RESET_PASSWORD_SCREEN.descriptionPrefix}
              <span className="font-semibold text-neutral-900">
                {RESET_PASSWORD_SCREEN.email}
              </span>
            </>
          }
        />

        <div className="flex flex-col gap-4 md:gap-5 lg:gap-4">
          <PasswordField
            label={RESET_PASSWORD_SCREEN.passwordLabel}
            name="password"
            autoComplete="new-password"
            placeholder={RESET_PASSWORD_SCREEN.passwordPlaceholder}
            helperText={RESET_PASSWORD_SCREEN.passwordHelper}
            value={form.values.password}
            onChange={(event) => form.setValue("password", event.target.value)}
            error={form.errorFor("password")}
            strengthValue={form.values.password}
          />

          <PasswordField
            label={RESET_PASSWORD_SCREEN.confirmLabel}
            name="confirm"
            autoComplete="new-password"
            placeholder={RESET_PASSWORD_SCREEN.confirmPlaceholder}
            value={form.values.confirm}
            onChange={(event) => form.setValue("confirm", event.target.value)}
            error={form.errorFor("confirm")}
          />
        </div>

        <Button type="submit" fullWidth isLoading={form.isSubmitting}>
          {RESET_PASSWORD_SCREEN.submitLabel}
        </Button>
        {submitError ? (
          <p role="alert" className="text-center text-label-sm text-error-600">
            {submitError}
          </p>
        ) : null}
      </AuthCard>
    </form>
  );
}
