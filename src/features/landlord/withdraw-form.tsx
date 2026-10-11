"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createWithdrawalAction } from "@/lib/api/actions/wallet";
import { formatMoney } from "@/lib/format";
import type { Money } from "@/types/api/common";

const panel = "rounded-lg border border-neutral-200 bg-white p-4 md:p-5";

function toMinor(value: string): number | null {
  const trimmed = value.trim().replace(/,/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return null;
  }
  const [whole, fraction = ""] = trimmed.split(".");
  const padded = `${fraction}00`.slice(0, 2);
  const minor = Number(`${whole}${padded}`);
  return Number.isSafeInteger(minor) ? minor : null;
}

export interface WithdrawFormProps {
  available: Money;
  stepUpHref: string;
  needsStepUp: boolean;
  stepUpMessage: string | null;
}

export function WithdrawForm({
  available,
  stepUpHref,
  needsStepUp,
  stepUpMessage,
}: WithdrawFormProps) {
  const [amount, setAmount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [attemptKey, setAttemptKey] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState<string | null>(null);

  return (
    <form
      className={panel}
      onSubmit={async (event) => {
        event.preventDefault();

        const minor = toMinor(amount);
        if (minor === null || minor <= 0) {
          setFieldErrors({ amount: "Enter an amount like 25000 or 25000.50." });
          setError("Enter a valid amount.");
          return;
        }
        if (minor > available.minor) {
          setFieldErrors({
            amount: `You can withdraw up to ${formatMoney(available)}.`,
          });
          setError("That is more than your available balance.");
          return;
        }

        setIsPending(true);
        setError(null);
        setFieldErrors({});
        setReference(null);

        const key = attemptKey ?? crypto.randomUUID();
        setAttemptKey(key);

        const result = await createWithdrawalAction(
          { amountMinor: minor, bankCode, accountNumber, accountName },
          key,
        );

        if (result.ok) {
          setReference(result.data.id);
          setAmount("");
          setAttemptKey(null);
        } else {
          setError(result.message);
          setFieldErrors({ ...(result.fieldErrors ?? {}) });
        }

        setIsPending(false);
      }}
    >
      <h2 className="font-display text-heading-sm font-semibold text-neutral-900">
        Request a withdrawal
      </h2>
      <p className="mt-1 text-body-sm text-neutral-700">
        Available to withdraw: {formatMoney(available)}. Vemra reviews every
        withdrawal before it is paid out.
      </p>

      {needsStepUp ? (
        <div
          role="status"
          className="mt-4 flex flex-col gap-2 rounded-md border border-warning-600 bg-warning-50 p-3 md:flex-row md:items-center md:justify-between"
        >
          <p className="text-body-sm text-neutral-800">
            {stepUpMessage ??
              "Confirm a second factor before requesting a withdrawal."}
          </p>
          <a
            href={stepUpHref}
            className="shrink-0 rounded-md bg-brand-700 px-3 py-1.5 text-label-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Set up now
          </a>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Input
          label={`Amount (${available.currency})`}
          name="amount"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          error={fieldErrors.amount}
        />
        <Input
          label="Bank code"
          name="bankCode"
          value={bankCode}
          onChange={(event) => setBankCode(event.target.value)}
          error={fieldErrors.bankCode}
          autoComplete="off"
        />
        <Input
          label="Account number"
          name="accountNumber"
          inputMode="numeric"
          value={accountNumber}
          onChange={(event) => setAccountNumber(event.target.value)}
          error={fieldErrors.accountNumber}
          autoComplete="off"
        />
        <Input
          label="Account name"
          name="accountName"
          value={accountName}
          onChange={(event) => setAccountName(event.target.value)}
          error={fieldErrors.accountName}
          autoComplete="off"
        />
      </div>

      <Button
        type="submit"
        size="sm"
        className="mt-4"
        isLoading={isPending}
        disabled={isPending || needsStepUp}
      >
        Request withdrawal
      </Button>

      <p aria-live="polite" className="mt-3 min-h-5 text-label-sm">
        {error !== null ? (
          <span role="alert" className="text-error-600">
            {error}
          </span>
        ) : reference !== null ? (
          <span className="text-success-600">
            Withdrawal requested. Reference{" "}
            <code className="font-mono">{reference}</code>
          </span>
        ) : null}
      </p>
    </form>
  );
}
