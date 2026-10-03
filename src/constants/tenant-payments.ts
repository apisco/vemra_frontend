import { TENANT_ROUTES } from "@/constants/tenant";
import type { ResponsiveCopy } from "@/components/ui/responsive-text";
import type { CheckoutSummary } from "@/types/api/tenant";

/** Shared placeholder when no checkout is ready, so both checkout screens agree. */
export const EMPTY_CHECKOUT_SUMMARY: CheckoutSummary = {
  label: "Payment plan unavailable",
  amount: { amount: 0, currency: "NGN" },
  unit: null,
  landlordName: null,
  dueDate: null,
  installmentSequence: null,
  installmentTotal: null,
};

export type PaymentMethod = "card" | "bank";

export const PAY_RENT = {
  title: {
    base: "Complete payment",
    md: "Complete payment method",
    lg: "Complete payment",
  } satisfies ResponsiveCopy,
  description: {
    base: "Paying the final installment on your September plan.",
    md: "Secure rent processing held in Escrow.",
    lg: "Paying the final installment on your September plan.",
  } satisfies ResponsiveCopy,
  methodLabel: "Payment method",
  methods: [
    { value: "card", label: "Card" },
    { value: "bank", label: "Bank transfer" },
  ] as const,
  fields: {
    cardNumber: { label: "Card number", placeholder: "4242 4242 4242 4242" },
    expiry: { label: "Expiry (MM/YY)", placeholder: "09/28" },
    cvc: { label: "CVC", placeholder: "123" },
    cardName: { label: "Name on card", placeholder: "Aisha Bello" },
  },
  submitLabel: "Simulate declined payment",
  footnote: {
    base: "Secure encrypted checkout.",
    md: "Payments are encrypted and processed securely.",
  } satisfies ResponsiveCopy,
  failedHref: `${TENANT_ROUTES.paymentPlan}/failed`,
} as const;

export const PAYMENT_FAILED = {
  title: "Payment Failed",
  description: {
    base: "Your card was declined. Please check details or use a different method.",
    md: "Your card was declined. Please check your card details or try a different payment method.",
  } satisfies ResponsiveCopy,
  diagnosisLabel: "System diagnosis",
  diagnosisCode: "Error code: CARD_DECLINED",
  retryLabel: "Try Again",
  changeCardLabel: "Use Different Card",
  retryHref: TENANT_ROUTES.paymentPlan,
} as const;
