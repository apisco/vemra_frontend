import { LogoMark } from "@/components/layout/logo-mark";
import { Badge } from "@/components/ui/badge";
import type { CheckoutSummary } from "@/constants/tenant-payments";

export interface CheckoutSummaryPanelProps {
  summary: CheckoutSummary;
}

export function CheckoutSummaryPanel({ summary }: CheckoutSummaryPanelProps) {
  return (
    <section
      aria-labelledby="checkout-summary-heading"
      className="flex flex-col gap-6 rounded-lg bg-brand-950 p-5 md:rounded-none md:p-8 lg:justify-between lg:p-12"
    >
      <div className="hidden items-center justify-between gap-4 md:flex">
        <LogoMark variant="inverse" />
        {summary.badge ? (
          <Badge variant="warning" className="lg:hidden">
            {summary.badge}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
        <div className="flex flex-col gap-2">
          <p
            id="checkout-summary-heading"
            className="text-body-sm font-semibold text-white"
          >
            {summary.label}
          </p>
          <p className="font-display text-heading-xl font-extrabold tracking-tight text-white md:text-display-lg lg:text-display-xl">
            {summary.amount}
          </p>
        </div>

        <div aria-hidden="true" className="h-px bg-white/15" />

        <dl className="flex flex-col gap-2 md:gap-3 lg:gap-4">
          {summary.rows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-4"
            >
              <dt className="shrink-0 text-body-sm text-neutral-400 md:text-body-md">
                {row.label}
              </dt>
              <dd className="min-w-0 text-right text-body-sm font-semibold text-white md:text-body-md">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="hidden text-label-sm leading-4.5 text-neutral-400 lg:block">
        {summary.note}
      </p>
    </section>
  );
}
