import type { Metadata } from "next";

import { LockIcon } from "@/components/icons/lock-icon";
import { Button } from "@/components/ui/button";
import {
  SIGNUP_VERIFICATION_SCREEN,
  SIGNUP_VERIFICATION_STEPS,
} from "@/constants/auth";
import { AuthLayout } from "@/features/auth/auth-layout";
import { AuthNote } from "@/features/auth/auth-note";
import { SignupStepHeader } from "@/features/auth/signup-step-header";
import { VerificationChecklist } from "@/features/auth/verification-checklist";

const COLUMN_CLASSES = "md:mx-auto md:w-full md:max-w-[520px]";

export const metadata: Metadata = {
  title: "Verify your identity · Vemra",
  description: SIGNUP_VERIFICATION_SCREEN.description,
};

export default function SignupVerificationPage() {
  return (
    <AuthLayout width="contentLg" gap="flat" justify="desktop" logoSize="none">
      <SignupStepHeader
        step={SIGNUP_VERIFICATION_SCREEN.step}
        totalSteps={SIGNUP_VERIFICATION_SCREEN.totalSteps}
        title={SIGNUP_VERIFICATION_SCREEN.title}
        description={SIGNUP_VERIFICATION_SCREEN.description}
      />
      <VerificationChecklist
        label={SIGNUP_VERIFICATION_SCREEN.listLabel}
        steps={SIGNUP_VERIFICATION_STEPS}
        className={COLUMN_CLASSES}
      />
      <AuthNote
        icon={<LockIcon />}
        title={SIGNUP_VERIFICATION_SCREEN.noteTitle}
        body={SIGNUP_VERIFICATION_SCREEN.noteBody}
        className={COLUMN_CLASSES}
      />
      <Button disabled fullWidth className={COLUMN_CLASSES}>
        {SIGNUP_VERIFICATION_SCREEN.submitLabel}
      </Button>
    </AuthLayout>
  );
}
