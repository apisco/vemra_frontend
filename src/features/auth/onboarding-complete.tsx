import Link from "next/link";

import { CheckIcon } from "@/components/icons/check-icon";
import { LogoMark } from "@/components/layout/logo-mark";
import { buttonClasses } from "@/components/ui/button";
import type { OnboardingCompleteCopy } from "@/constants/auth";
import { AuthHeader } from "@/features/auth/auth-header";
import { AuthLayout } from "@/features/auth/auth-layout";
import { OnboardingStepCard } from "@/features/auth/onboarding-step-card";
import { StatusIcon } from "@/features/auth/status-icon";

export interface OnboardingCompleteProps {
  copy: OnboardingCompleteCopy;
}

export function OnboardingComplete({ copy }: OnboardingCompleteProps) {
  return (
    <AuthLayout width="welcome" gap="flat" logoSize="none">
      <LogoMark className="self-center" />
      <div className="flex flex-col items-center gap-6 md:gap-4">
        <StatusIcon size="sm" shape="squircle">
          <CheckIcon />
        </StatusIcon>
        <AuthHeader
          variant="welcome"
          align="center"
          title={copy.title}
          description={copy.description}
        />
      </div>
      <ol aria-label={copy.stepsLabel} className="flex flex-col gap-3">
        {copy.steps.map((step, index) => (
          <OnboardingStepCard
            key={step.title}
            number={index + 1}
            title={step.title}
            detail={step.detail}
          />
        ))}
      </ol>
      <Link href={copy.ctaHref} className={buttonClasses({ fullWidth: true })}>
        {copy.ctaLabel}
      </Link>
    </AuthLayout>
  );
}
