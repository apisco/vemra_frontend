import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ResponsiveText } from "@/components/ui/responsive-text";
import { TENANT_PAYMENT_PLAN } from "@/constants/tenant";

const {
  title,
  editLabel,
  editHref,
  paidValue,
  totalValue,
  summaryShort,
  progressLabel,
  progressPercent,
  installments,
  primaryAction,
  secondaryAction,
} = TENANT_PAYMENT_PLAN;

export function PaymentPlanPanel() {
  return (
    <section
      aria-labelledby="payment-plan-title"
      className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 md:gap-6 md:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <h2
          id="payment-plan-title"
          className="font-display text-label-md font-semibold text-neutral-900 md:text-heading-sm"
        >
          <ResponsiveText copy={title} />
        </h2>
        <Link
          href={editHref}
          className="shrink-0 rounded-sm text-label-sm font-semibold text-brand-700 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 md:text-label-md"
        >
          <ResponsiveText copy={editLabel} />
        </Link>
      </div>

      <div className="flex flex-col gap-1 md:gap-3">
        <p className="font-display text-heading-sm font-bold text-neutral-900 md:hidden">
          {summaryShort}
        </p>
        <div className="hidden items-baseline gap-1 md:flex">
          <p className="font-display text-heading-xl font-bold text-neutral-900">
            {paidValue}
          </p>
          <p className="text-body-lg text-neutral-700">{totalValue}</p>
        </div>
        <ProgressBar percent={progressPercent} label={progressLabel} />
      </div>

      <ul className="flex flex-col">
        {installments.map(({ label, status, amount, badge, isPaid }) => (
          <li
            key={label}
            className="flex items-center justify-between gap-4 border-b border-neutral-200 py-3 md:py-4"
          >
            <div className="min-w-0">
              <p className="text-label-sm font-semibold text-neutral-900 md:text-label-md">
                {label}
              </p>
              <p className="text-caption text-neutral-700 md:text-label-sm">
                {status}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 md:gap-4">
              <span className="text-label-sm font-semibold text-neutral-900 md:text-label-md">
                {amount}
              </span>
              <Badge variant={isPaid ? "success" : "neutral"} size="sm">
                {badge}
              </Badge>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden flex-wrap gap-3 md:flex">
        <Button className="lg:h-10 lg:px-4">{primaryAction}</Button>
        <Button variant="secondary" className="lg:h-10 lg:px-4">
          {secondaryAction}
        </Button>
      </div>
    </section>
  );
}
