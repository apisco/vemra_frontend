import Link from "next/link";

import { LogoMark } from "@/components/layout/logo-mark";
import { LEGAL_BACK_LINK } from "@/constants/legal";
import { cn } from "@/lib/cn";
import { CONTAINER, HEADER_GUTTER } from "@/lib/layout";

export function LegalHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div
        className={cn(
          CONTAINER,
          HEADER_GUTTER,
          "flex h-13 items-center justify-between md:h-16",
        )}
      >
        <LogoMark />
        <Link
          href={LEGAL_BACK_LINK.href}
          className={cn(
            "rounded-sm text-label-sm leading-[16px] text-neutral-700 transition-colors hover:text-brand-700 lg:text-body-md lg:leading-[20px]",
            "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700",
          )}
        >
          {LEGAL_BACK_LINK.label}
        </Link>
      </div>
    </header>
  );
}
