import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  headingId?: string;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  headingId,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-5 rounded-lg border border-neutral-200 bg-white p-8 text-center md:gap-6 md:p-16",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-brand-700 [&_svg]:size-8 md:p-5 md:[&_svg]:size-10"
      >
        {icon}
      </span>

      <div className="flex max-w-120 flex-col gap-2">
        <h2
          id={headingId}
          className="font-display text-heading-sm font-semibold text-neutral-900 md:text-heading-md md:font-bold"
        >
          {title}
        </h2>
        <p className="text-body-sm text-neutral-700 md:text-body-md">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}
