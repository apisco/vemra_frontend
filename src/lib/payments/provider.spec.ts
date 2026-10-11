import { describe, expect, it } from "vitest";

import {
  PAYMENT_PROVIDER,
  allowedCheckoutUrl,
  isAllowedCheckoutUrl,
} from "@/lib/payments/provider";

describe("isAllowedCheckoutUrl", () => {
  it("accepts the provider's hosted checkout hosts over https", () => {
    expect(
      isAllowedCheckoutUrl("https://checkout.paystack.com/abc123"),
    ).toBe(true);
    expect(isAllowedCheckoutUrl("https://standard.paystack.co/pay/x")).toBe(
      true,
    );
    expect(isAllowedCheckoutUrl("https://paystack.com/pay/x")).toBe(true);
  });

  it("covers every host in the declared allowlist", () => {
    for (const host of PAYMENT_PROVIDER.checkoutHosts) {
      expect(isAllowedCheckoutUrl(`https://${host}/pay/x`)).toBe(true);
    }
  });

  it("rejects any other https host", () => {
    expect(isAllowedCheckoutUrl("https://evil.example.com/pay")).toBe(false);
    expect(isAllowedCheckoutUrl("https://vemra-backend.onrender.com")).toBe(
      false,
    );
  });

  it("rejects lookalike and suffix-confusion hosts", () => {
    expect(isAllowedCheckoutUrl("https://checkout.paystack.com.evil.io")).toBe(
      false,
    );
    expect(isAllowedCheckoutUrl("https://evilcheckout.paystack.com")).toBe(
      false,
    );
    expect(isAllowedCheckoutUrl("https://paystack.com.evil.io")).toBe(false);
    expect(isAllowedCheckoutUrl("https://notpaystack.com")).toBe(false);
  });

  it("rejects non-https schemes", () => {
    expect(isAllowedCheckoutUrl("http://checkout.paystack.com")).toBe(false);
    expect(isAllowedCheckoutUrl("javascript:alert(1)")).toBe(false);
    expect(isAllowedCheckoutUrl("data:text/html,<script>")).toBe(false);
  });

  it("rejects embedded credentials", () => {
    expect(
      isAllowedCheckoutUrl("https://user:pass@checkout.paystack.com/x"),
    ).toBe(false);
    expect(
      isAllowedCheckoutUrl("https://checkout.paystack.com@evil.example.com"),
    ).toBe(false);
  });

  it("rejects malformed and empty input", () => {
    expect(isAllowedCheckoutUrl("")).toBe(false);
    expect(isAllowedCheckoutUrl("   ")).toBe(false);
    expect(isAllowedCheckoutUrl("not a url")).toBe(false);
    expect(isAllowedCheckoutUrl("/relative/path")).toBe(false);
    expect(isAllowedCheckoutUrl(null)).toBe(false);
    expect(isAllowedCheckoutUrl(undefined)).toBe(false);
    expect(isAllowedCheckoutUrl(42)).toBe(false);
  });

  it("is case insensitive on the hostname", () => {
    expect(isAllowedCheckoutUrl("https://CHECKOUT.PAYSTACK.COM/x")).toBe(true);
  });
});

describe("allowedCheckoutUrl", () => {
  it("returns the url when allowed and null otherwise", () => {
    const url = "https://checkout.paystack.com/abc";
    expect(allowedCheckoutUrl(url)).toBe(url);
    expect(allowedCheckoutUrl("https://evil.example.com")).toBeNull();
  });
});
