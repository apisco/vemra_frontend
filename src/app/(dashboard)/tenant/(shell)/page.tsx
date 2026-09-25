import type { Metadata } from "next";
import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { ResponsiveText } from "@/components/ui/responsive-text";
import { TENANT_DASHBOARD } from "@/constants/tenant";
import { ContactsPanel } from "@/features/tenant/contacts-panel";
import { MetricCardRow } from "@/features/tenant/metric-card-row";
import { PaymentPlanPanel } from "@/features/tenant/payment-plan-panel";
import { RecentPaymentsPanel } from "@/features/tenant/recent-payments-panel";

export const metadata: Metadata = {
  title: "Overview · Vemra",
  description: "Rent, payment plan and property contacts at a glance.",
};

const { greeting, unit, action } = TENANT_DASHBOARD;

export default function TenantOverviewPage() {
  return (
    <div className="flex flex-col gap-5 md:gap-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-heading-lg font-bold text-neutral-900 md:text-heading-xl">
            {greeting}
          </h1>
          <p className="text-body-md text-neutral-700 md:text-body-lg">
            {unit}
          </p>
        </div>
        <Link
          href={action.href}
          className={buttonClasses({
            size: "sm",
            className:
              "max-md:h-8 max-md:px-3 max-md:text-label-sm md:h-11 md:px-6",
          })}
        >
          <ResponsiveText copy={action.label} />
        </Link>
      </div>

      <MetricCardRow />

      <div className="grid gap-5 md:grid-cols-[380fr_300fr] md:gap-6 lg:grid-cols-[608fr_420fr]">
        <PaymentPlanPanel />
        <div className="flex flex-col gap-5 md:gap-6">
          <ContactsPanel />
          <RecentPaymentsPanel />
        </div>
      </div>
    </div>
  );
}
