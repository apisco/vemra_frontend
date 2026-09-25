import type { Metadata } from "next";

import { CHECKOUT_SUMMARY } from "@/constants/tenant-payments";
import { CheckoutCard } from "@/features/tenant/checkout-card";
import { CheckoutSummaryPanel } from "@/features/tenant/checkout-summary-panel";
import { PaymentFailedPanel } from "@/features/tenant/payment-failed-panel";

export const metadata: Metadata = {
  title: "Payment failed · Vemra",
  description: "Your card was declined. Retry or use a different card.",
};

export default function TenantPaymentFailedPage() {
  return (
    <CheckoutCard summary={<CheckoutSummaryPanel summary={CHECKOUT_SUMMARY} />}>
      <PaymentFailedPanel />
    </CheckoutCard>
  );
}
