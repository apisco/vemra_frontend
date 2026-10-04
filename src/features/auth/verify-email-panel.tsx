"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
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
import { createClient } from "@/lib/supabase/client";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { readPendingEmail } from "@/lib/supabase/urls";

const STATE_ICONS: Record<VerifyEmailStatus, ReactNode> = {
  verified: <CheckCircleIcon />,
  pending: <HourglassIcon />,
  expired: <AlertTriangleIcon />,
};

function resolveStatus(value: string | null): VerifyEmailStatus {
  return value === "pending" || value === "expired" ? value : "verified";
}

function subscribeToPendingEmail(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function pendingEmailSnapshot(): string {
  return readPendingEmail() ?? VERIFY_EMAIL_SCREEN.email;
}

function pendingEmailServerSnapshot(): string {
  return VERIFY_EMAIL_SCREEN.email;
}

export interface VerifyEmailCardProps {
  status: VerifyEmailStatus;
}

export function VerifyEmailCard({ status }: VerifyEmailCardProps) {
  const state = VERIFY_EMAIL_STATES[status];

  const [isResending, setIsResending] = useState(false);
  const [hasResent, setHasResent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const email = useSyncExternalStore(
    subscribeToPendingEmail,
    pendingEmailSnapshot,
    pendingEmailServerSnapshot,
  );

  const handleResend = async () => {
    setHasResent(false);
    setError(null);
    setIsResending(true);
    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (resendError) {
        throw resendError;
      }
      setHasResent(true);
    } catch (requestError) {
      setError(supabaseErrorMessage(requestError));
    } finally {
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
            <span className="font-semibold text-neutral-900">{email}</span>
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
