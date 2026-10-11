"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addPayoutAccountAction,
  removePayoutAccountAction,
  setPrimaryPayoutAccountAction,
} from "@/lib/api/actions/wallet";
import type { ParsedPayoutAccount } from "@/lib/api/schemas";

const panel = "rounded-lg border border-neutral-200 bg-white p-4 md:p-5";

function maskAccount(accountNumber: string | undefined): string {
  if (accountNumber === undefined || accountNumber.length < 4) {
    return "••••";
  }
  return `•••• ${accountNumber.slice(-4)}`;
}

export interface PayoutAccountManagerProps {
  accounts: readonly ParsedPayoutAccount[];
  stepUpHref: string;
  needsStepUp: boolean;
  stepUpMessage: string | null;
}

export function PayoutAccountManager({
  accounts,
  stepUpHref,
  needsStepUp,
  stepUpMessage,
}: PayoutAccountManagerProps) {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);

  const run = async (
    action: () => Promise<
      { ok: true } | { ok: false; message: string; fieldErrors?: Readonly<Record<string, string>> }
    >,
    successMessage: string,
  ) => {
    setIsPending(true);
    setError(null);
    setFieldErrors({});
    setNotice(null);

    const result = await action();

    if (result.ok) {
      setNotice(successMessage);
      setBankName("");
      setAccountNumber("");
    } else {
      setError(result.message);
      setFieldErrors({ ...(result.fieldErrors ?? {}) });
    }

    setIsPending(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {needsStepUp ? (
        <section
          role="status"
          className="flex flex-col gap-3 rounded-lg border border-warning-600 bg-warning-50 p-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="min-w-0">
            <h2 className="text-body-md font-semibold text-neutral-900">
              Two-factor authentication required
            </h2>
            <p className="text-body-sm text-neutral-800">
              {stepUpMessage ??
                "Confirm a second factor before changing payout details."}
            </p>
          </div>
          <a
            href={stepUpHref}
            className="shrink-0 rounded-md bg-brand-700 px-4 py-2 text-label-md font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Set up now
          </a>
        </section>
      ) : null}

      <section className={panel}>
        <h2 className="font-display text-heading-sm font-semibold text-neutral-900">
          Your payout accounts
        </h2>

        {accounts.length === 0 ? (
          <p className="mt-3 text-body-sm text-neutral-700">
            No payout account is connected yet. Add one below to receive cleared
            rent.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {accounts.map((account) => (
              <li
                key={account.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-neutral-200 p-3"
              >
                <div className="min-w-0">
                  <p className="text-label-md font-semibold text-neutral-900">
                    {account.bankName ?? "Bank account"}
                    {account.isPrimary === true ? " · Primary" : ""}
                  </p>
                  <p className="text-label-sm text-neutral-700">
                    {maskAccount(account.accountNumber)}
                    {account.isVerified === true ? " · Verified" : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {account.isPrimary === true ? null : (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isPending || needsStepUp}
                      onClick={() =>
                        void run(
                          () => setPrimaryPayoutAccountAction(account.id),
                          "Primary payout account updated.",
                        )
                      }
                    >
                      Make primary
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending || needsStepUp}
                    onClick={() =>
                      void run(
                        () => removePayoutAccountAction(account.id),
                        "Payout account removed.",
                      )
                    }
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form
        className={panel}
        onSubmit={(event) => {
          event.preventDefault();
          void run(
            () => addPayoutAccountAction(bankName, accountNumber),
            "Payout account added.",
          );
        }}
      >
        <h2 className="font-display text-heading-sm font-semibold text-neutral-900">
          Add a payout account
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            label="Bank name"
            name="bankName"
            value={bankName}
            onChange={(event) => setBankName(event.target.value)}
            error={fieldErrors.bankName}
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
        </div>

        <Button
          type="submit"
          size="sm"
          className="mt-4"
          isLoading={isPending}
          disabled={isPending || needsStepUp}
        >
          Add account
        </Button>

        <p aria-live="polite" className="mt-3 min-h-5 text-label-sm">
          {error !== null ? (
            <span role="alert" className="text-error-600">
              {error}
            </span>
          ) : notice !== null ? (
            <span className="text-success-600">{notice}</span>
          ) : null}
        </p>
      </form>
    </div>
  );
}
