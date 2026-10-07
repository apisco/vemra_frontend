import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LockIcon } from "@/components/icons/lock-icon";
import { buttonClasses } from "@/components/ui/button";
import {
  AUTH_ROUTES,
  SIGNUP_VERIFICATION_SCREEN,
} from "@/constants/auth";
import { AuthLayout } from "@/features/auth/auth-layout";
import { AuthNote } from "@/features/auth/auth-note";
import { KycUploadForm } from "@/features/auth/kyc-upload-form";
import { ProfileDetailsForm } from "@/features/auth/profile-details-form";
import { SignupStepHeader } from "@/features/auth/signup-step-header";
import { VerificationChecklist } from "@/features/auth/verification-checklist";
import {
  onboardingCopy,
  verificationStepsFor,
} from "@/features/auth/verification-steps";
import { getAccount } from "@/lib/api/resources/auth";
import type { AccountProfile } from "@/types/api/auth";

const COLUMN_CLASSES = "md:mx-auto md:w-full md:max-w-[520px]";

const PENDING_EMAIL_PATH = `${AUTH_ROUTES.verifyEmail}?status=pending`;

export const metadata: Metadata = {
  title: "Verify your identity · Vemra",
  description: SIGNUP_VERIFICATION_SCREEN.description,
};


export const dynamic = "force-dynamic";

interface CallToAction {
  href: string;
  label: string;
}

function primaryRole(account: AccountProfile): "TENANT" | "LANDLORD" {
  return account.roles.includes("LANDLORD") ? "LANDLORD" : "TENANT";
}

function callToAction(account: AccountProfile): CallToAction {
  switch (account.onboarding.nextStep) {
    case "EMAIL_VERIFICATION":
      return {
        href: `${AUTH_ROUTES.verifyEmail}?status=pending`,
        label: "Resend confirmation link",
      };
    case "COMPLETE":
      return {
        href: `/welcome/${primaryRole(account)}`,
        label: "Continue",
      };
    case "UNDER_REVIEW":
    default:
      return {
        href: AUTH_ROUTES.verificationPending,
        label: "View review status",
      };
  }
}

export default async function SignupVerificationPage() {
  const account = await getAccount();

  
  
  
  if (account === null) {
    redirect(PENDING_EMAIL_PATH);
  }

  const { nextStep } = account.onboarding;
  const copy = onboardingCopy(nextStep);
  const needsProfile = (account.displayName ?? "").trim() === "";
  const canSubmitKyc =
    nextStep === "KYC_SUBMISSION" || nextStep === "ACTION_REQUIRED";
  const cta = callToAction(account);

  return (
    <AuthLayout width="contentLg" gap="flat" justify="desktop" logoSize="none">
      <SignupStepHeader
        step={SIGNUP_VERIFICATION_SCREEN.step}
        totalSteps={SIGNUP_VERIFICATION_SCREEN.totalSteps}
        title={copy.title}
        description={copy.description}
      />

      {needsProfile ? (
        <ProfileDetailsForm account={account} className={COLUMN_CLASSES} />
      ) : null}

      <VerificationChecklist
        label={SIGNUP_VERIFICATION_SCREEN.listLabel}
        steps={verificationStepsFor(account)}
        className={COLUMN_CLASSES}
      />

      {canSubmitKyc ? (
        <KycUploadForm account={account} className={COLUMN_CLASSES} />
      ) : (
        <Link
          href={cta.href}
          className={buttonClasses({ className: "w-full lg:w-auto", fullWidth: false })}
        >
          {cta.label}
        </Link>
      )}

      <AuthNote
        icon={<LockIcon />}
        title={SIGNUP_VERIFICATION_SCREEN.noteTitle}
        body={SIGNUP_VERIFICATION_SCREEN.noteBody}
        className={COLUMN_CLASSES}
      />
    </AuthLayout>
  );
}
