export type PaymentProviderId = "paystack";

export interface PaymentProvider {
  id: PaymentProviderId;
  label: string;
  checkoutHosts: readonly string[];
  checkoutOrigins: readonly string[];
}

const PAYSTACK: PaymentProvider = {
  id: "paystack",
  label: "Paystack",
  checkoutHosts: [
    "checkout.paystack.com",
    "standard.paystack.co",
    "paystack.com",
    "www.paystack.com",
  ],
  checkoutOrigins: [
    "https://checkout.paystack.com",
    "https://standard.paystack.co",
    "https://paystack.com",
    "https://www.paystack.com",
    "https://api.paystack.co",
  ],
};

export const PAYMENT_PROVIDER: PaymentProvider = PAYSTACK;

export const PAYMENT_PROVIDER_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim() ?? "";

export function isAllowedCheckoutUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.protocol !== "https:") {
    return false;
  }
  if (url.username !== "" || url.password !== "") {
    return false;
  }

  const hostname = url.hostname.toLowerCase();
  return PAYMENT_PROVIDER.checkoutHosts.includes(hostname);
}

export function allowedCheckoutUrl(value: unknown): string | null {
  return isAllowedCheckoutUrl(value) ? value : null;
}
