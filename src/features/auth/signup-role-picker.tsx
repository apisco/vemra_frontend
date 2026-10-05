"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { Caps } from "@/constants/auth";
import {
  AUTH_ROUTES,
  SIGNUP_DEFAULT_ROLE,
  SIGNUP_ROLE_CTA,
  SIGNUP_ROLE_OPTIONS,
  SIGNUP_ROLE_SCREEN,
} from "@/constants/auth";
import { AuthFooter } from "@/features/auth/auth-footer";
import { RoleCard } from "@/features/auth/role-card";
import { ROLE_ICONS } from "@/features/auth/role-icons";
import { useAuthForm } from "@/features/auth/use-auth-form";

type SignupRoleValues = {
  role: Caps;
};

export function SignupRolePicker() {
  const router = useRouter();
  const form = useAuthForm<SignupRoleValues>({
    initialValues: { role: SIGNUP_DEFAULT_ROLE },
    onSubmit: (values) =>
      router.push(`/signup/details?role=${values.role}`),
  });

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit}
      className="flex flex-col gap-6 md:gap-8 lg:gap-12"
    >
      <fieldset className="flex min-w-0 flex-col gap-3 md:flex-row md:gap-4 lg:gap-5">
        <legend className="sr-only">{SIGNUP_ROLE_SCREEN.groupLabel}</legend>
        {SIGNUP_ROLE_OPTIONS.map((option) => (
          <RoleCard
            key={option.value}
            name="role"
            value={option.value}
            checked={form.values.role === option.value}
            onSelect={() => form.setValue("role", option.value)}
            icon={ROLE_ICONS[option.value]}
            title={option.title}
            description={option.description}
            tag={
              <Badge
                variant="info"
                size="md"
                className="self-start text-center leading-[16px] md:whitespace-normal"
              >
                {option.tag}
              </Badge>
            }
          />
        ))}
      </fieldset>
      <div className="flex w-full flex-col items-center gap-4 self-center md:w-[400px] md:gap-5">
        <Button type="submit" fullWidth isLoading={form.isSubmitting}>
          {SIGNUP_ROLE_CTA[form.values.role]}
        </Button>
        <AuthFooter
          prompt={SIGNUP_ROLE_SCREEN.footerPrompt}
          href={AUTH_ROUTES.login}
          label={SIGNUP_ROLE_SCREEN.footerLabel}
        />
      </div>
    </form>
  );
}
