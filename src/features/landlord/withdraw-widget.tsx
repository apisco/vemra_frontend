import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { LANDLORD_ROUTES } from "@/constants/landlord";
import { formatMoney } from "@/lib/format";
import type { LandlordDashboard } from "@/types/api/landlord";

export function WithdrawWidget({ dashboard }: { dashboard: LandlordDashboard }) {
  return (
    <section
      aria-labelledby="withdraw-widget-title"
      className="hidden flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-6 lg:flex"
    >
      <h2 id="withdraw-widget-title" className="text-body-sm text-neutral-700">
        Available to withdraw
      </h2>

      <p className="font-display text-display-lg font-bold text-brand-700">
        {formatMoney(dashboard.readyToWithdraw)}
      </p>

      <p className="text-label-sm text-neutral-700">
        Cleared from {dashboard.clearedPaymentCount} payment
        {dashboard.clearedPaymentCount === 1 ? "" : "s"}
      </p>

      <div className="flex flex-col gap-3 pt-3">
        <Link
          href={LANDLORD_ROUTES.payoutAccount}
          className={buttonClasses({ size: "sm", fullWidth: true })}
        >
          Withdraw funds
        </Link>
        <Link
          href={LANDLORD_ROUTES.statement}
          className={buttonClasses({
            variant: "secondary",
            size: "sm",
            fullWidth: true,
          })}
        >
          View statement
        </Link>
      </div>
    </section>
  );
}
