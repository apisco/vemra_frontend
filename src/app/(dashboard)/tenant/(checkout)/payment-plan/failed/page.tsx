import type { Metadata } from "next";

import { EMPTY_CHECKOUT_SUMMARY } from "@/constants/tenant-payments";
import { CheckoutCard } from "@/features/tenant/checkout-card";
import { CheckoutSummaryPanel } from "@/features/tenant/checkout-summary-panel";
import { PaymentFailedPanel } from "@/features/tenant/payment-failed-panel";

export const metadata: Metadata = {
  title: "Payment not completed · Vemra",
  description: "The payment did not go through. Start a new attempt.",
};

function firstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

export default async function TenantPaymentFailedPage({
  searchParams,
}: PageProps<"/tenant/payment-plan/failed">) {
  const params = await searchParams;

  return (
    <CheckoutCard
      summary={<CheckoutSummaryPanel summary={EMPTY_CHECKOUT_SUMMARY} />}
    >
      <PaymentFailedPanel reference={firstValue(params.reference)} />
    </CheckoutCard>
  );
}
