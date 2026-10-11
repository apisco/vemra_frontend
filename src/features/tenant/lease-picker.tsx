import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { formatDate, formatMoney } from "@/lib/format";
import type { LeaseSummary } from "@/lib/api/schemas";

export interface LeasePickerProps {
  leases: readonly LeaseSummary[];
  basePath: string;
  title?: string;
  description?: string;
}

export function LeasePicker({
  leases,
  basePath,
  title = "Choose a lease",
  description = "You have more than one active lease. Pick the one you want to continue with.",
}: LeasePickerProps) {
  return (
    <section
      aria-labelledby="lease-picker-title"
      className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 md:p-6"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="lease-picker-title"
          className="font-display text-heading-sm font-bold text-neutral-900"
        >
          {title}
        </h2>
        <p className="text-body-sm text-neutral-700">{description}</p>
      </div>

      <ul className="flex flex-col gap-3">
        {leases.map((lease) => (
          <li
            key={lease.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-neutral-200 p-3"
          >
            <div className="min-w-0">
              <p className="text-label-md font-semibold text-neutral-900">
                {lease.annualRent === undefined
                  ? "Lease"
                  : formatMoney(lease.annualRent)}
              </p>
              <p className="text-label-sm text-neutral-700">
                {lease.status ?? "Active"}
                {lease.startDate === undefined
                  ? ""
                  : ` · from ${formatDate(lease.startDate)}`}
              </p>
            </div>
            <Link
              href={`${basePath}?leaseId=${encodeURIComponent(lease.id)}`}
              className={buttonClasses({ size: "sm" })}
            >
              Continue
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
