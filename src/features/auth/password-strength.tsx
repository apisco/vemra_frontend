import { cn } from "@/lib/cn";
import type { PasswordStrengthLevel } from "@/lib/validation";
import { passwordStrength } from "@/lib/validation";

const FILL_CLASSES: Record<PasswordStrengthLevel, string> = {
  empty: "bg-neutral-100",
  weak: "bg-error-600",
  fair: "bg-warning-500",
  strong: "bg-success-600",
};

export interface PasswordStrengthMeterProps {
  value: string;
  className?: string;
}

export function PasswordStrengthMeter({
  value,
  className,
}: PasswordStrengthMeterProps) {
  const strength = passwordStrength(value);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span aria-hidden="true" className="flex gap-1.5">
        {Array.from({ length: strength.total }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-1 flex-1 rounded-sm",
              index < strength.met
                ? FILL_CLASSES[strength.level]
                : FILL_CLASSES.empty,
            )}
          />
        ))}
      </span>
      <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-label-sm leading-[16px] text-neutral-700">
        <span>{strength.label}</span>
        {strength.hint ? <span>{strength.hint}</span> : null}
      </span>
    </div>
  );
}
