import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TENANT_ROUTES } from "@/constants/tenant";
import { formatDate, formatMoney, percentOf } from "@/lib/format";
import type { PaymentPlan } from "@/types/api/tenant";

export function PaymentPlanPanel({ plan }: { plan: PaymentPlan | null }) {
  if (!plan) {
    return <section className="rounded-lg border border-neutral-200 bg-white p-4 md:p-6"><h2 className="font-display text-heading-sm font-semibold text-neutral-900">Payment plan</h2><p className="mt-3 text-body-sm text-neutral-700">No active payment plan is available.</p></section>;
  }
  const paid = formatMoney(plan.paidAmount);
  const total = formatMoney(plan.totalAmount);
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
          Payment plan · {formatDate(plan.periodStart, "monthYear")} rent
        </h2>
        <Link
          href={TENANT_ROUTES.paymentPlan}
          className="shrink-0 rounded-sm text-label-sm font-semibold text-brand-700 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 md:text-label-md"
        >
          Edit plan
        </Link>
      </div>

      <div className="flex flex-col gap-1 md:gap-3">
        <p className="font-display text-heading-sm font-bold text-neutral-900 md:hidden">
          {paid} paid of {total}
        </p>
        <div className="hidden items-baseline gap-1 md:flex">
          <p className="font-display text-heading-xl font-bold text-neutral-900">
            {paid} paid
          </p>
          <p className="text-body-lg text-neutral-700">of {total} total</p>
        </div>
        <ProgressBar percent={percentOf(plan.paidAmount.amount, plan.totalAmount.amount)} label="Rent paid" />
      </div>

      <ul className="flex flex-col">
        {plan.installments.map((installment) => (
          <li
            key={installment.id}
            className="flex items-center justify-between gap-4 border-b border-neutral-200 py-3 md:py-4"
          >
            <div className="min-w-0">
              <p className="text-label-sm font-semibold text-neutral-900 md:text-label-md">
                Installment {installment.sequence}
              </p>
              <p className="text-caption text-neutral-700 md:text-label-sm">
                {installment.status === "paid" ? `Paid on ${formatDate(installment.paidAt, "short")}` : `${installment.status === "overdue" ? "Due" : "Due on"} ${formatDate(installment.dueDate, "short")}`}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 md:gap-4">
              <span className="text-label-sm font-semibold text-neutral-900 md:text-label-md">
                {formatMoney(installment.amount)}
              </span>
              <Badge variant={installment.status === "paid" ? "success" : "neutral"} size="sm">
                {installment.status === "paid" ? "Paid" : installment.status === "overdue" ? "Overdue" : "Upcoming"}
              </Badge>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden flex-wrap gap-3 md:flex">
        <Link
          href={TENANT_ROUTES.paymentPlan}
          className={buttonClasses({ className: "lg:h-10 lg:px-4" })}
        >
          Pay next installment
        </Link>
        <Link
          href={TENANT_ROUTES.paymentPlan}
          className={buttonClasses({
            variant: "secondary",
            className: "lg:h-10 lg:px-4",
          })}
        >
          Split next month instead
        </Link>
      </div>
    </section>
  );
}
