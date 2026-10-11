"use server";

import { revalidatePath } from "next/cache";

import { toActionFailure } from "@/lib/api/actions/action-result";
import type { ActionResult } from "@/lib/api/actions/action-result";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { requireSession } from "@/lib/api/resources/auth";
import { apiDelete, apiPost } from "@/lib/api/server";
import { requireStepUp } from "@/lib/api/step-up";
import { isUuid } from "@/lib/validation";

const WALLET_PATHS = [
  "/landlord/payout-account",
  "/landlord/statement",
  "/landlord",
];

function revalidateWallet(): void {
  for (const path of WALLET_PATHS) {
    revalidatePath(path);
  }
}

export async function addPayoutAccountAction(
  bankName: string,
  accountNumber: string,
): Promise<ActionResult<null>> {
  const bank = bankName.trim();
  const account = accountNumber.trim();

  if (bank === "") {
    return {
      ok: false,
      message: "Enter the bank name.",
      fieldErrors: { bankName: "A bank name is required." },
    };
  }
  if (!/^\d{10}$/.test(account)) {
    return {
      ok: false,
      message: "Enter a 10-digit account number.",
      fieldErrors: { accountNumber: "Must be 10 digits." },
    };
  }

  try {
    await requireSession();

    const stepUp = await requireStepUp();
    if (stepUp !== null) {
      return { ok: false, message: stepUp.message };
    }

    await apiPost<unknown>(ENDPOINTS.landlord.payoutAccounts, {
      bankName: bank,
      accountNumber: account,
    });

    revalidateWallet();
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function setPrimaryPayoutAccountAction(
  payoutAccountId: string,
): Promise<ActionResult<null>> {
  if (!isUuid(payoutAccountId)) {
    return { ok: false, message: "That payout account could not be found." };
  }

  try {
    await requireSession();

    const stepUp = await requireStepUp();
    if (stepUp !== null) {
      return { ok: false, message: stepUp.message };
    }

    await apiPost<unknown>(
      ENDPOINTS.landlord.payoutAccountPrimary(payoutAccountId),
    );
    revalidateWallet();
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function removePayoutAccountAction(
  payoutAccountId: string,
): Promise<ActionResult<null>> {
  if (!isUuid(payoutAccountId)) {
    return { ok: false, message: "That payout account could not be found." };
  }

  try {
    await requireSession();

    const stepUp = await requireStepUp();
    if (stepUp !== null) {
      return { ok: false, message: stepUp.message };
    }

    await apiDelete<unknown>(
      ENDPOINTS.landlord.payoutAccount(payoutAccountId),
    );
    revalidateWallet();
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}

export interface WithdrawalRequest {
  amountMinor: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  sourceWallet?: "REFERRAL" | "CAUTION";
}

export async function createWithdrawalAction(
  input: WithdrawalRequest,
  idempotencyKey: string,
): Promise<ActionResult<{ id: string }>> {
  if (!Number.isSafeInteger(input.amountMinor) || input.amountMinor <= 0) {
    return {
      ok: false,
      message: "Enter an amount greater than zero.",
      fieldErrors: { amount: "Enter an amount greater than zero." },
    };
  }
  if (input.bankCode.trim() === "") {
    return {
      ok: false,
      message: "Select your bank.",
      fieldErrors: { bankCode: "A bank is required." },
    };
  }
  if (!/^\d{10}$/.test(input.accountNumber.trim())) {
    return {
      ok: false,
      message: "Enter a 10-digit account number.",
      fieldErrors: { accountNumber: "Must be 10 digits." },
    };
  }
  if (input.accountName.trim() === "") {
    return {
      ok: false,
      message: "Enter the account name.",
      fieldErrors: { accountName: "An account name is required." },
    };
  }
  if (!isUuid(idempotencyKey)) {
    return {
      ok: false,
      message: "Could not start this withdrawal. Please try again.",
    };
  }

  try {
    await requireSession();

    const stepUp = await requireStepUp();
    if (stepUp !== null) {
      return { ok: false, message: stepUp.message };
    }

    const body = await apiPost<unknown>(
      ENDPOINTS.landlord.withdrawals,
      {
        amountMinor: input.amountMinor,
        bankCode: input.bankCode.trim(),
        accountNumber: input.accountNumber.trim(),
        accountName: input.accountName.trim(),
        ...(input.sourceWallet === undefined
          ? {}
          : { sourceWallet: input.sourceWallet }),
      },
      { idempotencyKey },
    );

    const payload = body as { data?: { id?: unknown } } | null;
    const id = payload?.data?.id;

    revalidateWallet();

    return typeof id === "string"
      ? { ok: true, data: { id } }
      : {
          ok: false,
          message:
            "Vemra accepted the request but did not return a reference. Check your withdrawals before retrying.",
        };
  } catch (error) {
    return toActionFailure(error);
  }
}
