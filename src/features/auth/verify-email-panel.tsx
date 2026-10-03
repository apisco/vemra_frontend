"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

import { AlertTriangleIcon } from "@/components/icons/alert-triangle-icon";
import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { HourglassIcon } from "@/components/icons/hourglass-icon";
import { Button, buttonClasses } from "@/components/ui/button";
import type { VerifyEmailStatus } from "@/constants/auth";
import {
  AUTH_ROUTES,
  VERIFY_EMAIL_SCREEN,
  VERIFY_EMAIL_STATES,
} from "@/constants/auth";
import { AuthCard } from "@/features/auth/auth-card";
import { AuthFooter } from "@/features/auth/auth-footer";
import { AuthHeader } from "@/features/auth/auth-header";
import { StatusIcon } from "@/features/auth/status-icon";
import { apiErrorMessage } from "@/lib/api/errors";
import { clientPost } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

const STATE_ICONS: Record<VerifyEmailStatus, ReactNode> = {
  verified: <CheckCircleIcon />,
  pending: <HourglassIcon />,
  expired: <AlertTriangleIcon />,
};

function resolveStatus(value: string | null): VerifyEmailStatus {
  return value === "pending" || value === "expired" ? value : "verified";
}

export interface VerifyEmailCardProps {
  status: VerifyEmailStatus;
}

export function VerifyEmailCard({ status }: VerifyEmailCardProps) {
  const state = VERIFY_EMAIL_STATES[status];

  const [isResending, setIsResending] = useState(false);
  const [hasResent, setHasResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    setHasResent(false);
    setError(null);
    setIsResending(true);
    try {
      await clientPost(ENDPOINTS.auth.resendEmailVerification);
      setIsResending(false);
      setHasResent(true);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
      setIsResending(false);
    }
  };

  return (
    <AuthCard variant="status">
      <AuthHeader
        variant="status"
        align="center"
        icon={<StatusIcon tone={state.tone}>{STATE_ICONS[status]}</StatusIcon>}
        title={state.title}
        description={
          <>
            {state.descriptionBefore}
            <span className="font-semibold text-neutral-900">
              {VERIFY_EMAIL_SCREEN.email}
            </span>
            {state.descriptionAfter}
          </>
        }
      />

      {state.ctaHref ? (
        <Link
          href={state.ctaHref}
          className={buttonClasses({ fullWidth: true })}
        >
          {state.ctaLabel}
        </Link>
      ) : (
        <div className="flex flex-col gap-4">
          <Button fullWidth isLoading={isResending} onClick={handleResend}>
            {state.ctaLabel}
          </Button>
          <p
            role="status"
            className="min-h-[22px] text-center text-body-md leading-[22px] text-success-600"
          >
            {hasResent ? VERIFY_EMAIL_SCREEN.resentNotice : ""}
          </p>
          {error ? (
            <p role="alert" className="text-center text-label-sm text-error-600">
              {error}
            </p>
          ) : null}
          <AuthFooter
            href={AUTH_ROUTES.login}
            label={VERIFY_EMAIL_SCREEN.backLabel}
          />
        </div>
      )}
    </AuthCard>
  );
}

export function VerifyEmailPanel() {
  const searchParams = useSearchParams();

  return <VerifyEmailCard status={resolveStatus(searchParams.get("status"))} />;
}
