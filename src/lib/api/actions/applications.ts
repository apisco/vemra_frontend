"use server";

import { revalidatePath } from "next/cache";

import { toActionFailure } from "@/lib/api/actions/action-result";
import type { ActionResult } from "@/lib/api/actions/action-result";
import { unwrapData } from "@/lib/api/adapters";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { requireRole } from "@/lib/api/resources/auth";
import { apiPost } from "@/lib/api/server";
import { isUuid } from "@/lib/validation";

/**
 * Document kinds the backend recognises. It takes `documentType` as a free
 * string, so this list drives the picker rather than validating an enum.
 */
export const APPLICATION_DOCUMENT_TYPES = [
  { value: "PAYSLIP", label: "Payslip" },
  { value: "EMPLOYMENT_LETTER", label: "Employment letter" },
  { value: "BANK_STATEMENT", label: "Bank statement" },
  { value: "TAX_RETURN", label: "Tax return" },
  { value: "OTHER", label: "Other supporting document" },
] as const;

export interface ApplicationDocumentInput {
  documentType: string;
  /**
   * Cloudinary `public_id`, not a URL. Application documents are stored in
   * private delivery mode, so the path is what gets persisted and the backend
   * signs a short-lived URL when someone needs to read it.
   */
  storagePath: string;
}

export interface ApplicationSubmission {
  propertyId: string;
  documents: readonly ApplicationDocumentInput[];
}

/** `POST /applications` — submits a rental application with its documents. */
export async function submitApplicationAction(
  submission: ApplicationSubmission,
): Promise<ActionResult<{ applicationId: string; status: string }>> {
  await requireRole("TENANT");

  if (!isUuid(submission.propertyId)) {
    return { ok: false, message: "That property could not be found." };
  }

  const documents = submission.documents
    .map((document) => ({
      documentType: document.documentType.trim(),
      storagePath: document.storagePath.trim(),
    }))
    .filter(
      (document) =>
        document.documentType !== "" && document.storagePath !== "",
    );

  if (documents.length !== submission.documents.length) {
    return {
      ok: false,
      message: "One of those documents is missing a type or a stored file.",
    };
  }

  try {
    const body = await apiPost<unknown>(ENDPOINTS.tenant.applications, {
      propertyId: submission.propertyId,
      documents,
    });
    const payload = unwrapData<{ id?: unknown; status?: unknown }>(body);

    revalidatePath("/tenant/apply");

    if (typeof payload?.id !== "string" || payload.id === "") {
      return {
        ok: false,
        message:
          "Vemra received the application but did not return its id. Check your applications list before submitting again.",
      };
    }

    return {
      ok: true,
      data: {
        applicationId: payload.id,
        status:
          typeof payload.status === "string" ? payload.status : "SUBMITTED",
      },
    };
  } catch (error) {
    return toActionFailure(error);
  }
}
