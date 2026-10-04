"use server";

import { revalidatePath } from "next/cache";

import { ACCOUNT_PATHS } from "@/lib/api/actions/account-paths";
import { toActionFailure } from "@/lib/api/actions/action-result";
import type { ActionResult } from "@/lib/api/actions/action-result";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { apiPostData } from "@/lib/api/server";
import type {
  KycSubmissionPayload,
  KycSubmissionResult,
  KycUploadGrant,
  KycUploadGrantRequest,
} from "@/types/api/auth";

/**
 * Step 1 of the KYC workflow: fetch a signed Cloudinary upload policy. The
 * browser then POSTs the file straight to Cloudinary — file bytes never touch
 * the Vemra backend.
 */
export async function createKycUploadGrantAction(
  input: KycUploadGrantRequest,
): Promise<ActionResult<KycUploadGrant>> {
  try {
    const data = await apiPostData<KycUploadGrant>(
      ENDPOINTS.kyc.documentGrants,
      input,
    );
    return { ok: true, data };
  } catch (error) {
    return toActionFailure(error);
  }
}

/**
 * Step 2: hand the resulting Cloudinary storage paths to the backend for
 * review.
 */
export async function submitKycAction(
  payload: KycSubmissionPayload,
): Promise<ActionResult<KycSubmissionResult>> {
  try {
    const data = await apiPostData<KycSubmissionResult>(
      ENDPOINTS.kyc.submissions,
      payload,
    );
    for (const path of ACCOUNT_PATHS) {
      revalidatePath(path);
    }
    return { ok: true, data };
  } catch (error) {
    return toActionFailure(error);
  }
}
