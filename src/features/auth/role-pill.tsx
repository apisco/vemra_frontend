import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface RolePillProps {
  icon: ReactNode;
  label: string;
  actionLabel: string;
  actionHref: string;
  className?: string;
}

export function RolePill({
  icon,
  label,
  actionLabel,
  actionHref,
  className,
}: RolePillProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center justify-center gap-2 rounded-md bg-neutral-50 px-4 py-2 md:gap-3 md:px-5 md:py-2.5 lg:gap-2 lg:py-2",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="shrink-0 text-neutral-700 [&_svg]:size-4 md:[&_svg]:size-4.5 lg:[&_svg]:size-4"
      >
        {icon}
      </span>
      <span className="text-body-sm leading-[17px] text-neutral-800">
        {label}
      </span>
      <Link
        href={actionHref}
        className="rounded-sm text-label-sm leading-[16px] font-semibold text-brand-700 transition-colors hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 md:text-label-md md:leading-[20px]"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
