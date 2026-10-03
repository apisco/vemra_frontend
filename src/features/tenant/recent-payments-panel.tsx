import Link from "next/link";

import { ResponsiveText } from "@/components/ui/responsive-text";
import { TENANT_ROUTES } from "@/constants/tenant";
import { cn } from "@/lib/cn";
import { formatDate, formatMoney } from "@/lib/format";
import type { PaymentStatus, TenantPayment } from "@/types/api/tenant";

const TABLET_ROW_COUNT = 2;

const STATUS_CLASSES: Record<PaymentStatus, string> = {
  cleared: "text-success-600",
  pending: "text-warning-600",
  held: "text-warning-600",
  failed: "text-error-600",
};

export function RecentPaymentsPanel({ payments }: { payments: readonly TenantPayment[] }) {
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
          <ResponsiveText copy={{ base: "Payments", lg: "Recent payments" }} />
        </h2>
        <Link
          href={TENANT_ROUTES.paymentHistory}
          className="shrink-0 rounded-sm text-label-sm font-semibold text-brand-700 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          View all
        </Link>
      </div>

      <ul className="flex flex-col">
        {payments.map((payment, index) => (
          <li
            key={payment.id}
            className={cn(
              "items-center justify-between gap-4 border-b border-neutral-200 py-3",
              index < TABLET_ROW_COUNT ? "flex" : "hidden lg:flex",
            )}
          >
            <div className="min-w-0">
              <p className="text-label-md font-semibold text-neutral-900">
                {payment.label}
              </p>
              <p className="text-label-sm text-neutral-700">{formatDate(payment.date, "short")}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-label-md font-semibold text-neutral-900">
                {formatMoney(payment.amount)}
              </span>
              <span
                className={cn(
                  "text-caption font-semibold capitalize",
                  STATUS_CLASSES[payment.status],
                )}
              >
                {payment.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
