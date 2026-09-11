"use client";

import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { TWO_FACTOR_SCREEN } from "@/constants/auth";
import { AuthHeader } from "@/features/auth/auth-header";
import { QrPlaceholder } from "@/features/auth/qr-placeholder";
import { useAuthForm } from "@/features/auth/use-auth-form";

type TwoFactorValues = {
  code: string;
};

export function TwoFactorForm() {
  const form = useAuthForm<TwoFactorValues>({
    initialValues: { code: "" },
    validate: (values) => ({
      code:
        values.code.length === TWO_FACTOR_SCREEN.otpLength
          ? undefined
          : TWO_FACTOR_SCREEN.otpError,
    }),
  });

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit}
      className="flex w-full flex-col gap-5 md:gap-8 md:rounded-lg md:border md:border-neutral-200 md:bg-white md:p-10 md:shadow-elevation-2 lg:gap-7 lg:shadow-elevation-3"
    >
      <AuthHeader
        variant="compact"
        align="start"
        title={TWO_FACTOR_SCREEN.title}
        description={TWO_FACTOR_SCREEN.description}
      />

      <div className="flex flex-col items-center gap-3 md:gap-4 lg:gap-3">
        <QrPlaceholder />
        <div className="flex flex-col items-center gap-1">
          <span className="text-body-sm leading-[18px] text-neutral-700 md:text-body-md md:leading-[20px]">
            {TWO_FACTOR_SCREEN.manualPrompt}
          </span>
          <span className="text-body-md leading-[20px] font-semibold text-neutral-900">
            {TWO_FACTOR_SCREEN.manualCode}
          </span>
        </div>
      </div>

      <OtpInput
        label={TWO_FACTOR_SCREEN.otpLabel}
        name="code"
        length={TWO_FACTOR_SCREEN.otpLength}
        value={form.values.code}
        onChange={(code) => form.setValue("code", code)}
        error={form.errorFor("code")}
      />

      <Button type="submit" fullWidth isLoading={form.isSubmitting}>
        {TWO_FACTOR_SCREEN.submitLabel}
      </Button>

      <p className="text-body-sm leading-[18px] text-neutral-700">
        {TWO_FACTOR_SCREEN.note}
      </p>
    </form>
  );
}
