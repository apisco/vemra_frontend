import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface AuthFooterProps {
  prompt?: string;
  href: string;
  label: string;
  iconLeft?: ReactNode;
  className?: string;
}

export function AuthFooter({
  prompt,
  href,
  label,
  iconLeft,
  className,
}: AuthFooterProps) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center justify-center gap-1 text-body-md leading-[20px] text-neutral-700",
        className,
      )}
    >
      {prompt}
      <Link
        href={href}
        className={cn(
          "inline-flex items-center rounded-sm font-semibold text-brand-700 transition-colors hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
          iconLeft ? "gap-1.5 [&_svg]:size-3.5 lg:gap-1" : undefined,
        )}
      >
        {iconLeft}
        {label}
      </Link>
    </p>
  );
}
