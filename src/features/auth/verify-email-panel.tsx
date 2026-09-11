"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import { SUBMIT_DELAY } from "@/features/auth/use-auth-form";

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
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  const handleResend = () => {
    window.clearTimeout(timeout.current);
    setHasResent(false);
    setIsResending(true);
    timeout.current = window.setTimeout(() => {
      setIsResending(false);
      setHasResent(true);
    }, SUBMIT_DELAY);
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
