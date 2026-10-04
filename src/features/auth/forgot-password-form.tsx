"use client";

import { useEffect, useRef, useState } from "react";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AUTH_ROUTES, FORGOT_PASSWORD_SCREEN } from "@/constants/auth";
import { AuthCard } from "@/features/auth/auth-card";
import { AuthFooter } from "@/features/auth/auth-footer";
import { AuthHeader } from "@/features/auth/auth-header";
import { StatusIcon } from "@/features/auth/status-icon";
import { useAuthForm } from "@/features/auth/use-auth-form";
import { createClient } from "@/lib/supabase/client";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { authCallbackUrl } from "@/lib/supabase/urls";
import { validateEmail } from "@/lib/validation";

type ForgotPasswordValues = {
  email: string;
};

export function ForgotPasswordForm() {
  const confirmation = useRef<HTMLDivElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useAuthForm<ForgotPasswordValues>({
    initialValues: { email: "" },
    validate: (values) => ({ email: validateEmail(values.email) }),
    onSubmit: async (values) => {
      setSubmitError(null);
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(
          values.email,
          { redirectTo: authCallbackUrl(AUTH_ROUTES.resetPassword) },
        );
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

  const backLink = (
    <AuthFooter
      href={AUTH_ROUTES.login}
      label={FORGOT_PASSWORD_SCREEN.backLabel}
      iconLeft={<ArrowLeftIcon />}
    />
  );

  if (form.isSubmitted) {
    return (
      <div ref={confirmation} tabIndex={-1} role="status">
        <AuthCard variant="prompt">
          <AuthHeader
            variant="status"
            align="center"
            icon={
              <StatusIcon tone="success">
                <CheckCircleIcon />
              </StatusIcon>
            }
            title={FORGOT_PASSWORD_SCREEN.sentTitle}
            description={
              <>
                {FORGOT_PASSWORD_SCREEN.sentDescriptionPrefix}
                <span className="font-semibold text-neutral-900">
                  {form.values.email.trim()}
                </span>
                {FORGOT_PASSWORD_SCREEN.sentDescriptionSuffix}
              </>
            }
          />
          {backLink}
        </AuthCard>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={form.handleSubmit}>
      <AuthCard variant="prompt">
        <AuthHeader
          variant="compact"
          align="center"
          title={FORGOT_PASSWORD_SCREEN.title}
          description={FORGOT_PASSWORD_SCREEN.description}
        />
        <Input
          label={FORGOT_PASSWORD_SCREEN.emailLabel}
          type="email"
          name="email"
          autoComplete="email"
          placeholder={FORGOT_PASSWORD_SCREEN.emailPlaceholder}
          value={form.values.email}
          onChange={(event) => form.setValue("email", event.target.value)}
          error={form.errorFor("email")}
        />
        <Button type="submit" fullWidth isLoading={form.isSubmitting}>
          {FORGOT_PASSWORD_SCREEN.submitLabel}
        </Button>
        {submitError ? (
          <p role="alert" className="text-center text-label-sm text-error-600">
            {submitError}
          </p>
        ) : null}
        {backLink}
      </AuthCard>
    </form>
  );
}
