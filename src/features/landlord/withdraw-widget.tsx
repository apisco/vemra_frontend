import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { LANDLORD_WITHDRAW_WIDGET } from "@/constants/landlord";

const { label, amount, note, primaryAction, secondaryAction } =
  LANDLORD_WITHDRAW_WIDGET;

export function WithdrawWidget() {
  return (
    <section
      aria-labelledby="withdraw-widget-title"
      className="hidden flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-6 lg:flex"
    >
      <h2 id="withdraw-widget-title" className="text-body-sm text-neutral-700">
        {label}
      </h2>

      <p className="font-display text-display-lg font-bold text-brand-700">
        {amount}
      </p>

      <p className="text-label-sm text-neutral-700">{note}</p>

      <div className="flex flex-col gap-3 pt-3">
        <Link
          href={primaryAction.href}
          className={buttonClasses({ size: "sm", fullWidth: true })}
        >
          {primaryAction.label}
        </Link>
        <Link
          href={secondaryAction.href}
          className={buttonClasses({
            variant: "secondary",
            size: "sm",
            fullWidth: true,
          })}
        >
          {secondaryAction.label}
        </Link>
      </div>
    </section>
  );
}
