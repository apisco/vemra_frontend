import Link from "next/link";

import {
  segmentedSegmentClasses,
  segmentedTrackClasses,
} from "@/components/ui/segmented-control-classes";
import { LEGAL_TABS } from "@/constants/legal";

export interface LegalTabsProps {
  activeHref: string;
}

export function LegalTabs({ activeHref }: LegalTabsProps) {
  return (
    <nav aria-label="Legal documents" className="w-full lg:mx-auto lg:w-100">
      <ul className={segmentedTrackClasses({ size: "lg" })}>
        {LEGAL_TABS.map(({ href, label }) => {
          const isSelected = href === activeHref;

          return (
            <li key={href} className="min-w-0 flex-1">
              <Link
                href={href}
                aria-current={isSelected ? "page" : undefined}
                className={segmentedSegmentClasses({
                  size: "lg",
                  isSelected,
                  className: "block",
                })}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
