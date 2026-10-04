"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfileAction } from "@/lib/api/actions/identity";
import { AuthCard } from "@/features/auth/auth-card";
import { useAuthForm } from "@/features/auth/use-auth-form";
import type { AccountProfile } from "@/types/api/auth";

const E164_PATTERN = /^\+[1-9][0-9]{7,14}$/;

type ProfileValues = {
  displayName: string;
  phone: string;
  handle: string;
};

type FieldErrors = Partial<Record<keyof ProfileValues, string>>;

export interface ProfileDetailsFormProps {
  account: AccountProfile;
  submitLabel?: string;
  className?: string;
}

export function ProfileDetailsForm({
  account,
  submitLabel = "Save and continue",
  className,
}: ProfileDetailsFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});

  const form = useAuthForm<ProfileValues>({
    initialValues: {
      displayName: account.displayName ?? "",
      phone: account.phone ?? "",
      handle: account.handle ?? "",
    },
    validate: (values) => {
      const errors: FieldErrors = {};
      if (values.displayName.trim() === "") {
        errors.displayName = "Full name is required.";
      }
      if (values.phone.trim() !== "" && !E164_PATTERN.test(values.phone.trim())) {
        errors.phone = "Use an international format, e.g. +2348012345678.";
      }
      if (values.handle.trim() !== "") {
        const handle = values.handle.trim();
        if (handle.length < 3 || handle.length > 30) {
          errors.handle = "Handles are 3–30 characters.";
        }
      }
      return errors;
    },
    onSubmit: async (values) => {
      setSubmitError(null);
      setServerErrors({});

      const result = await updateProfileAction({
        displayName: values.displayName.trim(),
        phone: values.phone.trim() === "" ? null : values.phone.trim(),
        handle: values.handle.trim() === "" ? null : values.handle.trim(),
      });

      if (!result.ok) {
        setSubmitError(result.message);
        if (result.fieldErrors) {
          setServerErrors(result.fieldErrors as FieldErrors);
        }
        throw new Error(result.message);
      }

      router.refresh();
    },
  });

  return (
    <form noValidate onSubmit={form.handleSubmit} className={className}>
      <AuthCard variant="details">
        <Input
          label="Full name"
          name="displayName"
          autoComplete="name"
          value={form.values.displayName}
          onChange={(event) => form.setValue("displayName", event.target.value)}
          error={serverErrors.displayName ?? form.errorFor("displayName")}
        />
        <Input
          label="Phone number"
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder="+2348012345678"
          value={form.values.phone}
          onChange={(event) => form.setValue("phone", event.target.value)}
          error={serverErrors.phone ?? form.errorFor("phone")}
        />
        <Input
          label="Handle"
          name="handle"
          autoComplete="username"
          placeholder="seun_ade"
          helperText="Your public username on Vemra."
          value={form.values.handle}
          onChange={(event) => form.setValue("handle", event.target.value)}
          error={serverErrors.handle ?? form.errorFor("handle")}
        />

        <Button type="submit" fullWidth isLoading={form.isSubmitting}>
          {submitLabel}
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
