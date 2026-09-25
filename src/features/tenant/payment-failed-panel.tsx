import Link from "next/link";

import { AlertCircleIcon } from "@/components/icons/alert-circle-icon";
import { buttonClasses } from "@/components/ui/button";
import { ResponsiveText } from "@/components/ui/responsive-text";
import { PAYMENT_FAILED } from "@/constants/tenant-payments";

export function PaymentFailedPanel() {
  return (
    <div className="flex flex-1 flex-col gap-5 lg:justify-between">
      <div className="flex flex-col gap-5">
        <section className="flex gap-3 rounded-md border border-error-600 bg-error-50 p-4 text-error-600">
          <span className="shrink-0 pt-0.5 [&_svg]:size-5" aria-hidden="true">
            <AlertCircleIcon />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="font-display text-heading-sm font-extrabold">
              {PAYMENT_FAILED.title}
            </h1>
            <p className="text-body-md">
              <ResponsiveText copy={PAYMENT_FAILED.description} />
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-label-sm font-semibold tracking-wide text-neutral-700 uppercase">
            {PAYMENT_FAILED.diagnosisLabel}
          </h2>
          <p className="rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-body-md text-neutral-900">
            {PAYMENT_FAILED.diagnosisCode}
          </p>
        </section>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href={PAYMENT_FAILED.retryHref}
          className={buttonClasses({ fullWidth: true })}
        >
          {PAYMENT_FAILED.retryLabel}
        </Link>
        <Link
          href={PAYMENT_FAILED.retryHref}
          className={buttonClasses({ variant: "secondary", fullWidth: true })}
        >
          {PAYMENT_FAILED.changeCardLabel}
        </Link>
      </div>
    </div>
  );
}
