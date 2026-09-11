import Link from "next/link";

import { LEGAL_COPYRIGHT, LEGAL_FOOTER_LINKS } from "@/constants/legal";
import { cn } from "@/lib/cn";
import { CONTAINER, HEADER_GUTTER } from "@/lib/layout";

export function LegalFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div
        className={cn(
          CONTAINER,
          HEADER_GUTTER,
          "flex flex-col items-center gap-4 py-6 lg:flex-row lg:justify-between lg:gap-8 lg:py-8",
        )}
      >
        <nav aria-label="Legal" className="lg:order-2">
          <ul className="flex gap-6">
            {LEGAL_FOOTER_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "rounded-sm text-body-md leading-[20px] text-neutral-700 transition-colors hover:text-brand-700",
                    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700",
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-body-sm leading-[18px] text-neutral-700 lg:order-1 lg:leading-[20px]">
          {LEGAL_COPYRIGHT}
        </p>
      </div>
    </footer>
  );
}
