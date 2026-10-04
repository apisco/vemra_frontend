"use server";

import { revalidatePath } from "next/cache";

import { ACCOUNT_PATHS } from "@/lib/api/actions/account-paths";
import { toActionFailure } from "@/lib/api/actions/action-result";
import type { ActionResult } from "@/lib/api/actions/action-result";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { apiPatchData } from "@/lib/api/server";
import type { AccountProfile, ProfileUpdatePayload } from "@/types/api/auth";

export async function updateProfileAction(
  input: ProfileUpdatePayload,
): Promise<ActionResult<AccountProfile>> {
  try {
    const data = await apiPatchData<AccountProfile>(
      ENDPOINTS.identity.updateProfile,
      input,
    );
    for (const path of ACCOUNT_PATHS) {
      revalidatePath(path);
    }
    return { ok: true, data };
  } catch (error) {
    return toActionFailure(error);
  }
}
