import { TENANT_ROUTES } from "@/constants/tenant";
import type { ResponsiveCopy } from "@/components/ui/responsive-text";
import type { CheckoutSummary } from "@/types/api/tenant";

export const EMPTY_CHECKOUT_SUMMARY: CheckoutSummary = {
  label: "Payment plan unavailable",
  amount: { minor: 0, currency: "NGN" },
  unit: null,
  landlordName: null,
  dueDate: null,
  installmentSequence: null,
  installmentTotal: null,
};

export const PAY_RENT = {
  title: {
    base: "Complete payment",
    md: "Complete payment method",
    lg: "Complete payment",
  } satisfies ResponsiveCopy,
  description: {
    base: "Secure rent processing held in escrow.",
    md: "Secure rent processing held in escrow.",
    lg: "Secure rent processing held in escrow.",
  } satisfies ResponsiveCopy,
  submitLabel: "Continue to secure checkout",
  pendingLabel: "Opening secure checkout…",
  footnote: {
    base: "You will finish paying on Paystack. Vemra never sees your card details.",
    md: "You will finish paying on Paystack's secure checkout. Vemra never receives or stores your card details.",
  } satisfies ResponsiveCopy,
  breakdownTitle: "What you will pay",
  breakdownLabels: {
    rentMinor: "Rent",
    cautionDepositMinor: "Caution deposit",
    tenantPlatformFeeMinor: "Vemra fee",
    paystackFeeMinor: "Payment processing fee",
    totalAmountMinor: "Total",
  },
  failedHref: `${TENANT_ROUTES.paymentPlan}/failed`,
  callbackPath: `${TENANT_ROUTES.paymentPlan}/callback`,
} as const;

export const PAYMENT_FAILED = {
  title: "Payment not completed",
  description: {
    base: "The payment did not go through. No money has left your account.",
    md: "The payment did not go through. No money has left your account. You can start a new attempt below.",
  } satisfies ResponsiveCopy,
  diagnosisLabel: "Reference",
  retryLabel: "Try again",
  retryHref: TENANT_ROUTES.paymentPlan,
} as const;
