"use server";

import { revalidatePath } from "next/cache";

import { ACCOUNT_PATHS } from "@/lib/api/actions/account-paths";
import { toActionFailure } from "@/lib/api/actions/action-result";
import type { ActionResult } from "@/lib/api/actions/action-result";
import type { TicketFileInput } from "@/lib/api/actions/media";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { apiPost, apiPostData } from "@/lib/api/server";
import { MEDIA_SCOPES, validateFile } from "@/lib/media/scopes";
import { readUploadTicket } from "@/lib/media/ticket";
import type { KycSubmissionPayload, KycSubmissionResult } from "@/types/api/auth";
import type { UploadTicket } from "@/types/api/media";

/**
 * `POST /kyc/documents/grants`.
 *
 * This endpoint predates the other ticket routes and returns `{ url, fields }`
 * rather than `{ uploadUrl, fields, ... }`; `readUploadTicket` normalises both.
 */
export async function createKycUploadGrantAction(
  input: TicketFileInput,
): Promise<ActionResult<UploadTicket>> {
  const problem = validateFile("KYC", {
    name: input.fileName.trim(),
    size: input.sizeBytes,
    type: input.contentType,
  });
  if (problem !== null) {
    return { ok: false, message: problem };
  }

  try {
    const ticket = readUploadTicket(
      await apiPost<unknown>(ENDPOINTS.kyc.documentGrants, {
        fileName: input.fileName.trim(),
        contentType: input.contentType,
        maxSizeBytes: MEDIA_SCOPES.KYC.maxBytes,
      }),
    );

    return ticket === null
      ? { ok: false, message: "Vemra did not return a usable upload ticket." }
      : { ok: true, data: ticket };
  } catch (error) {
    return toActionFailure(error);
  }
}


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
