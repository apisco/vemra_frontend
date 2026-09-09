import Link from "next/link";

import {
  COPYRIGHT,
  FOOTER_HELP_LINK,
  FOOTER_LINKS,
} from "@/constants/marketing";
import { cn } from "@/lib/cn";
import { CONTAINER, SECTION_GUTTER } from "@/lib/layout";

const LINK_CLASSES = cn(
  "rounded-sm text-neutral-700 transition-colors hover:text-brand-700",
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700",
);

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div
        className={cn(
          CONTAINER,
          SECTION_GUTTER,
          "flex flex-col gap-8 pt-8 pb-6 text-label-sm md:gap-6 md:py-10 md:text-body-md lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-12",
        )}
      >
        <div className="flex items-center justify-between gap-4 lg:contents">
          <p className="text-body-sm text-neutral-700 md:text-body-md">
            {COPYRIGHT}
          </p>
          <Link
            href={FOOTER_HELP_LINK.href}
            className={cn(LINK_CLASSES, "hidden md:inline lg:hidden")}
          >
            {FOOTER_HELP_LINK.label}
          </Link>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-4 gap-y-3 md:gap-x-4 lg:gap-x-6">
            {FOOTER_LINKS.map(({ href, label, showOnTablet }) => (
              <li
                key={href}
                className={cn(!showOnTablet && "md:hidden lg:list-item")}
              >
                <Link href={href} className={LINK_CLASSES}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
