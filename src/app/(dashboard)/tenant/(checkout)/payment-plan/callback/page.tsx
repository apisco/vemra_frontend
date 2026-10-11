import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { AlertCircleIcon } from "@/components/icons/alert-circle-icon";
import { HourglassIcon } from "@/components/icons/hourglass-icon";
import { buttonClasses } from "@/components/ui/button";
import { EMPTY_CHECKOUT_SUMMARY } from "@/constants/tenant-payments";
import { TENANT_ROUTES } from "@/constants/tenant";
import { CheckoutCard } from "@/features/tenant/checkout-card";
import { CheckoutSummaryPanel } from "@/features/tenant/checkout-summary-panel";
import { LoadErrorPanel } from "@/features/errors/load-error-panel";
import { getLatestPaymentForLease } from "@/lib/api/resources/tenant";
import { formatMoney } from "@/lib/format";
import { isUuid } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Payment status · Vemra",
  description: "The result of your most recent rent payment.",
};

export const dynamic = "force-dynamic";

function firstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

const SUCCESS_STATUSES = new Set(["SUCCESS", "SUCCEEDED", "PAID", "CLEARED"]);
const FAILED_STATUSES = new Set(["FAILED", "FAILURE", "CANCELLED", "REVERSED"]);

export default async function TenantPaymentCallbackPage({
  searchParams,
}: PageProps<"/tenant/payment-plan/callback">) {
  const params = await searchParams;
  const leaseId = firstValue(params.leaseId);

  if (leaseId === null || !isUuid(leaseId)) {
    notFound();
  }

  const result = await getLatestPaymentForLease(leaseId);

  const panel = (() => {
    if (!result.ok) {
      return <LoadErrorPanel label="Your payment status" failure={result} />;
    }

    const payment = result.data;

    if (payment === null) {
      return (
        <StatusPanel
          tone="pending"
          title="We have not seen this payment yet"
          body="Vemra records a payment once the provider confirms it. This can take a few moments. Refresh this page, or check your payment history shortly."
        />
      );
    }

    const status = payment.status.toUpperCase();

    if (SUCCESS_STATUSES.has(status)) {
      return (
        <StatusPanel
          tone="success"
          title="Payment received"
          body={`Vemra has recorded ${formatMoney(payment.amount, {
            showDecimals: true,
          })} against your lease.`}
          reference={payment.reference}
        />
      );
    }

    if (FAILED_STATUSES.has(status)) {
      return (
        <StatusPanel
          tone="failed"
          title="Payment not completed"
          body="The provider reported that this attempt did not go through. No money has left your account."
          reference={payment.reference}
        />
      );
    }

    return (
      <StatusPanel
        tone="pending"
        title="Payment is still processing"
        body="The provider has not confirmed this attempt yet. Refresh this page in a moment — do not start a second payment."
        reference={payment.reference}
      />
    );
  })();

  return (
    <CheckoutCard
      summary={<CheckoutSummaryPanel summary={EMPTY_CHECKOUT_SUMMARY} />}
    >
      <div className="flex flex-1 flex-col gap-5 lg:justify-between">
        {panel}
        <div className="flex flex-col gap-3">
          <Link
            href={TENANT_ROUTES.paymentHistory}
            className={buttonClasses({ fullWidth: true })}
          >
            View payment history
          </Link>
          <Link
            href={TENANT_ROUTES.overview}
            className={buttonClasses({
              variant: "secondary",
              fullWidth: true,
            })}
          >
            Back to overview
          </Link>
        </div>
      </div>
    </CheckoutCard>
  );
}

const TONES = {
  success: {
    className: "border-success-600 bg-success-50 text-success-600",
    icon: <CheckCircleIcon />,
  },
  pending: {
    className: "border-warning-600 bg-warning-50 text-warning-600",
    icon: <HourglassIcon />,
  },
  failed: {
    className: "border-error-600 bg-error-50 text-error-600",
    icon: <AlertCircleIcon />,
  },
} as const;

function StatusPanel({
  tone,
  title,
  body,
  reference,
}: {
  tone: keyof typeof TONES;
  title: string;
  body: string;
  reference?: string;
}) {
  const { className, icon } = TONES[tone];

  return (
    <section
      role="status"
      className={`flex gap-3 rounded-md border p-4 ${className}`}
    >
      <span className="shrink-0 pt-0.5 [&_svg]:size-5" aria-hidden="true">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="font-display text-heading-sm font-extrabold">{title}</h1>
        <p className="text-body-md text-neutral-800">{body}</p>
        {reference === undefined ? null : (
          <p className="text-label-sm text-neutral-700">
            Reference: <code className="font-mono">{reference}</code>
          </p>
        )}
      </div>
    </section>
  );
}
