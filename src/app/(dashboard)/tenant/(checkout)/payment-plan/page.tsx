import type { Metadata } from "next";

import { CHECKOUT_SUMMARY } from "@/constants/tenant-payments";
import { CheckoutCard } from "@/features/tenant/checkout-card";
import { CheckoutSummaryPanel } from "@/features/tenant/checkout-summary-panel";
import { PayRentForm } from "@/features/tenant/pay-rent-form";

export const metadata: Metadata = {
  title: "Pay rent · Vemra",
  description: "Complete the final installment on your September rent plan.",
};

export default function TenantPaymentPlanPage() {
  return (
    <CheckoutCard summary={<CheckoutSummaryPanel summary={CHECKOUT_SUMMARY} />}>
      <PayRentForm />
    </CheckoutCard>
  );
}
