import Link from "next/link";

import { cn } from "@/lib/cn";

export interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 rounded-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="relative size-7 shrink-0 rounded-md bg-brand-700 md:size-8"
      >
        <span className="absolute inset-1.5 rounded-sm bg-white" />
      </span>
      <span className="font-display text-[18px] leading-[28px] font-semibold text-neutral-900 md:text-[22px] md:leading-[30px] md:font-bold">
        Vemra
      </span>
    </Link>
  );
}
