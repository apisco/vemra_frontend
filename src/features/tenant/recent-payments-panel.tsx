import Link from "next/link";

import { ResponsiveText } from "@/components/ui/responsive-text";
import { TENANT_RECENT_PAYMENTS } from "@/constants/tenant";
import { cn } from "@/lib/cn";

const { title, viewAllLabel, href, rows } = TENANT_RECENT_PAYMENTS;

const TABLET_ROW_COUNT = 2;

export function RecentPaymentsPanel() {
  return (
    <section
      aria-labelledby="recent-payments-title"
      className="hidden flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-5 md:flex lg:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id="recent-payments-title"
          className="font-display text-heading-sm font-semibold text-neutral-900"
        >
          <ResponsiveText copy={title} />
        </h2>
        <Link
          href={href}
          className="shrink-0 rounded-sm text-label-sm font-semibold text-brand-700 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          {viewAllLabel}
        </Link>
      </div>

      <ul className="flex flex-col">
        {rows.map(({ label, date, status }, index) => (
          <li
            key={label}
            className={cn(
              "items-center justify-between gap-4 border-b border-neutral-200 py-3",
              index < TABLET_ROW_COUNT ? "flex" : "hidden lg:flex",
            )}
          >
            <div className="min-w-0">
              <p className="text-label-md font-semibold text-neutral-900">
                {label}
              </p>
              <p className="text-label-sm text-neutral-700">{date}</p>
            </div>
            <span className="shrink-0 text-label-md font-semibold text-success-600">
              {status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
