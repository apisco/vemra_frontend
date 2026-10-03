"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveText } from "@/components/ui/responsive-text";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { PAY_RENT } from "@/constants/tenant-payments";
import type { PaymentMethod } from "@/constants/tenant-payments";

const UNAVAILABLE_METHODS: readonly PaymentMethod[] = ["bank"];

async function attemptDemoPayment(): Promise<{ status: "declined" }> {
  return { status: "declined" };
}

export function PayRentForm() {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const result = await attemptDemoPayment();
        if (result.status === "declined") {
          router.push(PAY_RENT.failedHref);
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
        <p className="text-center text-label-sm text-neutral-700">
          <ResponsiveText copy={PAY_RENT.footnote} />
        </p>
      </div>
    </form>
  );
}
