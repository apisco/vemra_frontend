"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveText } from "@/components/ui/responsive-text";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { PAY_RENT } from "@/constants/tenant-payments";
import type { PaymentMethod } from "@/constants/tenant-payments";
import { apiErrorMessage } from "@/lib/api/errors";
import { clientPost } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { CardPaymentPayload, PaymentResult } from "@/types/api/tenant";

const UNAVAILABLE_METHODS: readonly PaymentMethod[] = ["bank"];

const REDIRECT_ERROR =
  "We could not start the bank verification step. Please try again.";

/**
 * Only follows a 3-D Secure/bank continuation on our own origin or over HTTPS,
 * so a malformed or unexpected backend value cannot navigate the browser to an
 * arbitrary (or `javascript:`) destination.
 */
function safeRedirectUrl(value: string | null): string | null {
  if (value === null) {
    return null;
  }
  try {
    const url = new URL(value, window.location.origin);
    const isSameOrigin = url.origin === window.location.origin;
    return isSameOrigin || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function PayRentForm() {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const payload: CardPaymentPayload = {
          method,
          cardNumber: String(formData.get("cardNumber") ?? ""),
          expiry: String(formData.get("expiry") ?? ""),
          cvc: String(formData.get("cvc") ?? ""),
          cardName: String(formData.get("cardName") ?? ""),
        };

        try {
          const result = await clientPost<PaymentResult>(
            ENDPOINTS.tenant.checkout,
            payload,
          );
          if (result.outcome === "declined") {
            router.push(PAY_RENT.failedHref);
          } else if (result.outcome === "requires_action") {
            const redirect = safeRedirectUrl(result.redirectUrl);
            if (redirect === null) {
              setError(REDIRECT_ERROR);
            } else {
              window.location.assign(redirect);
            }
          } else {
            router.push("/tenant/payment-history");
          }
        } catch (requestError) {
          setError(apiErrorMessage(requestError));
        } finally {
          setIsSubmitting(false);
        }
      }}
      className="flex flex-1 flex-col gap-5 lg:justify-between"
    >
      <div className="flex flex-col gap-5">
        <header className="sr-only md:not-sr-only md:flex md:flex-col md:gap-1">
          <h1 className="font-display text-heading-md font-extrabold text-neutral-900 lg:text-heading-lg">
            <ResponsiveText copy={PAY_RENT.title} />
          </h1>
          <p className="text-body-md text-neutral-700">
            <ResponsiveText copy={PAY_RENT.description} />
          </p>
        </header>

        <SegmentedControl
          label={PAY_RENT.methodLabel}
          options={PAY_RENT.methods}
          value={method}
          onChange={setMethod}
          disabledValues={UNAVAILABLE_METHODS}
        />

        <div className="flex flex-col gap-4">
          <Input
            label={PAY_RENT.fields.cardNumber.label}
            placeholder={PAY_RENT.fields.cardNumber.placeholder}
            name="cardNumber"
            autoComplete="cc-number"
            inputMode="numeric"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={PAY_RENT.fields.expiry.label}
              placeholder={PAY_RENT.fields.expiry.placeholder}
              name="expiry"
              autoComplete="cc-exp"
              inputMode="numeric"
              required
            />
            <Input
              label={PAY_RENT.fields.cvc.label}
              placeholder={PAY_RENT.fields.cvc.placeholder}
              name="cvc"
              autoComplete="cc-csc"
              inputMode="numeric"
              required
            />
          </div>

          <Input
            label={PAY_RENT.fields.cardName.label}
            placeholder={PAY_RENT.fields.cardName.placeholder}
            name="cardName"
            autoComplete="cc-name"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          {PAY_RENT.submitLabel}
        </Button>
        {error ? (
          <p role="alert" className="text-center text-label-sm text-error-600">
            {error}
          </p>
        ) : null}
        <p className="text-center text-label-sm text-neutral-700">
          <ResponsiveText copy={PAY_RENT.footnote} />
        </p>
      </div>
    </form>
  );
}
