import Link from "next/link";

import { CheckIcon } from "@/components/icons/check-icon";
import { LogoMark } from "@/components/layout/logo-mark";
import { buttonClasses } from "@/components/ui/button";
import type { OnboardingCompleteCopy } from "@/constants/auth";
import { AuthHeader } from "@/features/auth/auth-header";
import { OnboardingStepCard } from "@/features/auth/onboarding-step-card";
import { StatusIcon } from "@/features/auth/status-icon";

export interface OnboardingCompleteProps {
  copy: OnboardingCompleteCopy;
}

export function OnboardingComplete({ copy }: OnboardingCompleteProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-neutral-50">
      <header className="bg-white px-5 py-4 lg:bg-brand-950 lg:px-8 lg:py-5">
        <div className="mx-auto flex max-w-240 items-center justify-between">
          <LogoMark
            variant="onDark"
            className="hidden lg:inline-flex"
          />
          <LogoMark className="inline-flex md:hidden lg:hidden" />
          <button
            type="button"
            aria-label="Open menu"
            className="inline-flex size-8 items-center justify-center text-neutral-900 md:hidden"
          >
            <span className="sr-only">Open menu</span>
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="h-0.5 w-5 bg-current" />
              <span className="h-0.5 w-5 bg-current" />
              <span className="h-0.5 w-5 bg-current" />
            </span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-5 py-8 md:justify-center md:px-12 md:py-10 lg:py-14">
        <LogoMark className="mb-8 hidden md:inline-flex lg:hidden" />
        <div className="flex w-full max-w-140 flex-col items-center gap-6 md:gap-4">
          <StatusIcon size="sm" shape="squircle">
            <CheckIcon />
          </StatusIcon>
          <AuthHeader
            variant="welcome"
            align="center"
            title={copy.title}
            description={copy.description}
          />
          <ol
            aria-label={copy.stepsLabel}
            className="flex w-full flex-col gap-3"
          >
            {copy.steps.map((step, index) => (
              <OnboardingStepCard
                key={step.title}
                number={index + 1}
                title={step.title}
                detail={step.detail}
              />
            ))}
          </ol>
          <Link
            href={copy.ctaHref}
            className={buttonClasses({ fullWidth: true })}
          >
            {copy.ctaLabel}
          </Link>
        </div>
      </main>
    </div>
  );
}
