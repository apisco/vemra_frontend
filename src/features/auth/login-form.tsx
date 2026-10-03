"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { AuthRole } from "@/constants/auth";
import { AUTH_ROLES, AUTH_ROUTES, LOGIN_SCREEN } from "@/constants/auth";
import { AuthDivider } from "@/features/auth/auth-divider";
import { useAuthForm } from "@/features/auth/use-auth-form";
import { validateEmail, validateRequired } from "@/lib/validation";
import { apiErrorMessage } from "@/lib/api/errors";
import { clientPost } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { AuthResult, LoginPayload } from "@/types/api/auth";

type LoginValues = {
  email: string;
  password: string;
  remember: boolean;
};

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<AuthRole>("tenant");
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
        const payload: LoginPayload = { ...values, role };
        await clientPost<AuthResult>(ENDPOINTS.auth.login, payload);
        router.push(role === "landlord" ? "/landlord" : "/tenant");
      } catch (error) {
        setSubmitError(apiErrorMessage(error));
        throw error;
      }
    },
  });

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

        <Button variant="secondary" fullWidth>
          {LOGIN_SCREEN.googleLabel}
        </Button>
      </div>
    </form>
  );
}
