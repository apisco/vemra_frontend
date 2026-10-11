"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { Spinner } from "@/components/feedback/spinner";
import { TWO_FACTOR_SCREEN } from "@/constants/auth";
import { AuthHeader } from "@/features/auth/auth-header";
import { createClient } from "@/lib/supabase/client";
import { supabaseErrorMessage } from "@/lib/supabase/errors";

type Stage = "loading" | "enroll" | "challenge" | "done";

interface Enrollment {
  factorId: string;
  qrCode: string;
  secret: string;
}

export interface TwoFactorFormProps {
  redirectTo?: string;
}

const FACTOR_NAME = "Vemra authenticator";

export function TwoFactorForm({ redirectTo }: TwoFactorFormProps) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [challengeFactorId, setChallengeFactorId] = useState<string | null>(
    null,
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const start = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: factors, error: listError } =
        await supabase.auth.mfa.listFactors();
      if (listError) {
        throw listError;
      }

      setError(null);

      const verified = (factors.totp ?? []).find(
        (factor) => factor.status === "verified",
      );
      if (verified !== undefined) {
        setChallengeFactorId(verified.id);
        setStage("challenge");
        return;
      }

      for (const stale of (factors.all ?? []).filter(
        (factor) =>
          factor.factor_type === "totp" && factor.status === "unverified",
      )) {
        await supabase.auth.mfa.unenroll({ factorId: stale.id });
      }

      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `${FACTOR_NAME} ${Date.now()}`,
      });
      if (enrollError) {
        throw enrollError;
      }

      setEnrollment({
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      });
      setStage("enroll");
    } catch (cause) {
      setError(supabaseErrorMessage(cause));
      setStage("enroll");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void start();
    }, 0);
    return () => clearTimeout(timer);
  }, [start]);

  const factorId = enrollment?.factorId ?? challengeFactorId;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (code.length !== TWO_FACTOR_SCREEN.otpLength) {
      setError(TWO_FACTOR_SCREEN.otpError);
      return;
    }
    if (factorId === null) {
      setError("Two-factor setup is not ready yet. Refresh and try again.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) {
        throw challengeError;
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code,
      });
      if (verifyError) {
        throw verifyError;
      }

      setStage("done");
      router.refresh();
      if (redirectTo !== undefined) {
        router.replace(redirectTo);
      }
    } catch (cause) {
      setCode("");
      setError(supabaseErrorMessage(cause));
    } finally {
      setIsVerifying(false);
    }
  };

  if (stage === "loading") {
    return (
      <div
        role="status"
        className="flex w-full flex-col items-center gap-3 py-10"
      >
        <Spinner />
        <p className="text-body-sm text-neutral-700">
          Preparing two-factor authentication…
        </p>
      </div>
    );
  }

  if (stage === "done") {
    return (
      <div
        role="status"
        className="flex w-full flex-col gap-2 rounded-lg border border-success-600 bg-success-50 p-5"
      >
        <p className="text-body-md font-semibold text-neutral-900">
          Two-factor authentication is on
        </p>
        <p className="text-body-sm text-neutral-800">
          You can now change payout details and request withdrawals.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-5 md:gap-8 md:rounded-lg md:border md:border-neutral-200 md:bg-white md:p-10 md:shadow-elevation-2 lg:gap-7 lg:shadow-elevation-3"
    >
      <AuthHeader
        variant="compact"
        align="start"
        title={TWO_FACTOR_SCREEN.title}
        description={
          stage === "challenge"
            ? "Enter the current code from your authenticator app."
            : TWO_FACTOR_SCREEN.description
        }
      />

      {stage === "enroll" && enrollment !== null ? (
        <div className="flex flex-col items-center gap-3 md:gap-4 lg:gap-3">
          <Image
            src={enrollment.qrCode}
            alt="Scan this QR code with your authenticator app"
            width={160}
            height={160}
            unoptimized
            className="size-35 shrink-0 rounded-md border border-neutral-200 bg-white p-2 md:size-40"
          />
          <div className="flex flex-col items-center gap-1">
            <span className="text-body-sm leading-[18px] text-neutral-700 md:text-body-md md:leading-[20px]">
              {TWO_FACTOR_SCREEN.manualPrompt}
            </span>
            <span className="font-mono text-body-md leading-[20px] font-semibold break-all text-neutral-900">
              {enrollment.secret}
            </span>
          </div>
        </div>
      ) : null}

      <OtpInput
        label={TWO_FACTOR_SCREEN.otpLabel}
        name="code"
        length={TWO_FACTOR_SCREEN.otpLength}
        value={code}
        onChange={setCode}
      />

      <Button
        type="submit"
        fullWidth
        isLoading={isVerifying}
        disabled={isVerifying}
      >
        {TWO_FACTOR_SCREEN.submitLabel}
      </Button>

      {error === null ? null : (
        <p role="alert" className="text-center text-label-sm text-error-600">
          {error}
        </p>
      )}

      <p className="text-body-sm leading-[18px] text-neutral-700">
        {TWO_FACTOR_SCREEN.note}
      </p>
    </form>
  );
}
