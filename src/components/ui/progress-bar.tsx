import { cn } from "@/lib/cn";

export interface ProgressBarProps {
  percent: number;
  label: string;
  className?: string;
}

export function ProgressBar({ percent, label, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 md:h-2",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-brand-700"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
