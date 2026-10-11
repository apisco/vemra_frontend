import "server-only";

import { SUPABASE_CONFIG } from "@/config/supabase";
import { getVerifiedSession } from "@/lib/api/session";
import { createClient } from "@/lib/supabase/server";

export type StepUpRequirement = "enroll" | "challenge";

export interface StepUpState {
  isSatisfied: boolean;
  requirement: StepUpRequirement | null;
  factorId: string | null;
}

export const STEP_UP_MESSAGES: Record<StepUpRequirement, string> = {
  enroll:
    "Set up two-factor authentication before changing payout details or withdrawing funds.",
  challenge:
    "Confirm your two-factor code before changing payout details or withdrawing funds.",
};

export async function readStepUpState(): Promise<StepUpState> {
  if (!SUPABASE_CONFIG.isConfigured) {
    return { isSatisfied: false, requirement: "enroll", factorId: null };
  }

  const session = await getVerifiedSession();
  if (session === null) {
    return { isSatisfied: false, requirement: "enroll", factorId: null };
  }

  if (session.assuranceLevel === "aal2") {
    return { isSatisfied: true, requirement: null, factorId: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error !== null) {
    return { isSatisfied: false, requirement: "enroll", factorId: null };
  }

  const verified = (data.totp ?? []).find(
    (factor) => factor.status === "verified",
  );

  return verified === undefined
    ? { isSatisfied: false, requirement: "enroll", factorId: null }
    : { isSatisfied: false, requirement: "challenge", factorId: verified.id };
}

export interface StepUpFailure {
  ok: false;
  message: string;
  code: "STEP_UP_REQUIRED";
  requirement: StepUpRequirement;
}

export async function requireStepUp(): Promise<StepUpFailure | null> {
  const state = await readStepUpState();
  if (state.isSatisfied) {
    return null;
  }

  const requirement = state.requirement ?? "enroll";
  return {
    ok: false,
    code: "STEP_UP_REQUIRED",
    requirement,
    message: STEP_UP_MESSAGES[requirement],
  };
}
