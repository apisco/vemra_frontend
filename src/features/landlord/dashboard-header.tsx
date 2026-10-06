import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { LANDLORD_DASHBOARD } from "@/constants/landlord";
import type { LandlordDashboard } from "@/types/api/landlord";

const { withdrawAction, addPropertyAction } = LANDLORD_DASHBOARD;

export function DashboardHeader({
  dashboard,
}: {
  dashboard: LandlordDashboard;
}) {
  const firstName = dashboard.landlordName.trim().split(/\s+/)[0] ?? "";
  const greeting = firstName === "" ? "Welcome" : `Welcome, ${firstName}`;
  const propertyLabel = dashboard.propertyCount === 1 ? "property" : "properties";
  const summary = `${dashboard.propertyCount} ${propertyLabel} · ${dashboard.occupiedCount} occupied · ${dashboard.vacantCount} vacant`;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
      <div className="min-w-0">
        <h1 className="font-display text-heading-lg font-bold text-neutral-900 md:text-heading-xl">
          {greeting}
        </h1>
        <p className="text-body-md text-neutral-700">{summary}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 md:flex md:shrink-0">
        <Link
          href={withdrawAction.href}
          className={buttonClasses({ size: "sm" })}
        >
          {withdrawAction.label}
        </Link>
        <Link
          href={addPropertyAction.href}
          className={buttonClasses({
            variant: "secondary",
            size: "sm",
            className: "md:hidden",
          })}
        >
          {addPropertyAction.label}
        </Link>
      </div>
    </div>
  );
}
