import type { Metadata } from "next";

import { EMPTY_CHECKOUT_SUMMARY } from "@/constants/tenant-payments";
import { CheckoutCard } from "@/features/tenant/checkout-card";
import { CheckoutSummaryPanel } from "@/features/tenant/checkout-summary-panel";
import { PayRentForm } from "@/features/tenant/pay-rent-form";
import { getCheckoutOptions } from "@/lib/api/resources/tenant";

export const metadata: Metadata = {
  title: "Pay rent · Vemra",
  description: "Complete the final installment on your September rent plan.",
};

export default async function TenantPaymentPlanPage() {
  const checkout = await getCheckoutOptions();
  if (!checkout) {
    return <CheckoutCard summary={<CheckoutSummaryPanel summary={EMPTY_CHECKOUT_SUMMARY} />}><p className="text-body-md text-neutral-700">There is no payment ready for checkout.</p></CheckoutCard>;
  }
  return (
    <CheckoutCard summary={<CheckoutSummaryPanel summary={checkout.summary} />}>
      <PayRentForm />
    </CheckoutCard>
  );
}
