import type { Metadata } from "next";

import { EMPTY_CHECKOUT_SUMMARY } from "@/constants/tenant-payments";
import { CheckoutCard } from "@/features/tenant/checkout-card";
import { CheckoutSummaryPanel } from "@/features/tenant/checkout-summary-panel";
import { PaymentFailedPanel } from "@/features/tenant/payment-failed-panel";
import { getCheckoutOptions } from "@/lib/api/resources/tenant";

export const metadata: Metadata = {
  title: "Payment failed · Vemra",
  description: "Your card was declined. Retry or use a different card.",
};

export default async function TenantPaymentFailedPage() {
  const checkout = await getCheckoutOptions();
  const summary = checkout?.summary ?? EMPTY_CHECKOUT_SUMMARY;
  return (
    <CheckoutCard summary={<CheckoutSummaryPanel summary={summary} />}>
      <PaymentFailedPanel />
    </CheckoutCard>
  );
}
