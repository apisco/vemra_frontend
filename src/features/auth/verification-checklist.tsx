import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { Button } from "@/components/ui/button";
import type { VerificationStep } from "@/constants/auth";
import { AuthCard } from "@/features/auth/auth-card";
import { StatusRow } from "@/features/auth/status-row";

export interface VerificationChecklistProps {
  label: string;
  steps: readonly VerificationStep[];
  className?: string;
}

export function VerificationChecklist({
  label,
  steps,
  className,
}: VerificationChecklistProps) {
  return (
    <AuthCard variant="checklist" className={className}>
      <ol aria-label={label} className="flex flex-col gap-4 md:gap-6">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-4 md:gap-6">
            {index > 0 ? (
              <span aria-hidden="true" className="h-px bg-neutral-200" />
            ) : null}
            <StatusRow
              leading={
                step.state === "complete" ? (
                  <CheckCircleIcon className="size-6 text-success-600" />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex size-6 items-center justify-center rounded-full border border-neutral-400 text-label-sm leading-[16px] font-semibold text-neutral-700"
                  >
                    {index + 1}
                  </span>
                )
              }
              title={step.title}
              description={step.description}
              trailing={
                step.actionLabel ? (
                  <Button variant="secondary" size="sm">
                    {step.actionLabel}
                  </Button>
                ) : step.status ? (
                  <span className="text-label-md leading-[20px] font-semibold text-success-600">
                    {step.status}
                  </span>
                ) : null
              }
            />
          </li>
        ))}
      </ol>
    </AuthCard>
  );
}
