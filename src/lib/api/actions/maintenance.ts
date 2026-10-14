"use server";

import { revalidatePath } from "next/cache";

import { toActionFailure } from "@/lib/api/actions/action-result";
import type { ActionResult } from "@/lib/api/actions/action-result";
import { unwrapData } from "@/lib/api/adapters";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { requireSession } from "@/lib/api/resources/auth";
import { apiPost } from "@/lib/api/server";
import { isAllowedDeliveryUrl } from "@/lib/media/cloudinary";
import { isUuid } from "@/lib/validation";

const MAINTENANCE_PATHS = [
  "/tenant/maintenance",
  "/landlord/maintenance",
] as const;

export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";

export interface MaintenanceReport {
  propertyId: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
}

function revalidateMaintenance(): void {
  for (const path of MAINTENANCE_PATHS) {
    revalidatePath(path);
  }
}

/**
 * `POST /maintenance` — step 1 of reporting an issue. Photos are attached
 * afterwards with `addMaintenanceMediaAction`, because the ticket endpoint
 * needs a property and the update endpoint needs an issue id.
 */
export async function reportMaintenanceAction(
  report: MaintenanceReport,
): Promise<ActionResult<{ issueId: string }>> {
  await requireSession();

  if (!isUuid(report.propertyId)) {
    return { ok: false, message: "That property could not be found." };
  }

  const title = report.title.trim();
  const description = report.description.trim();

  if (title === "") {
    return {
      ok: false,
      message: "Give the issue a short title.",
      fieldErrors: { title: "A title is required." },
    };
  }
  if (description === "") {
    return {
      ok: false,
      message: "Describe the issue so it can be triaged.",
      fieldErrors: { description: "A description is required." },
    };
  }

  try {
    const body = await apiPost<unknown>(ENDPOINTS.tenant.maintenance, {
      propertyId: report.propertyId,
      title,
      description,
      priority: report.priority,
    });
    const payload = unwrapData<{ id?: unknown }>(body);
    const issueId = payload?.id;

    if (typeof issueId !== "string" || issueId === "") {
      return {
        ok: false,
        message:
          "Vemra recorded the issue but did not return its id, so photos could not be attached. Check your maintenance list.",
      };
    }

    revalidateMaintenance();
    return { ok: true, data: { issueId } };
  } catch (error) {
    return toActionFailure(error);
  }
}

/**
 * `POST /maintenance/:id/update` — attaches already-uploaded photo URLs, and
 * optionally a note, to an existing issue.
 */
export async function addMaintenanceMediaAction(
  issueId: string,
  mediaUrls: readonly string[],
  notes?: string,
): Promise<ActionResult<null>> {
  await requireSession();

  if (!isUuid(issueId)) {
    return { ok: false, message: "That maintenance issue could not be found." };
  }

  const rejected = mediaUrls.filter((url) => !isAllowedDeliveryUrl(url));
  if (rejected.length > 0) {
    return {
      ok: false,
      message: "One of those photo addresses is not a Vemra storage URL.",
    };
  }

  const trimmedNotes = notes?.trim() ?? "";
  if (mediaUrls.length === 0 && trimmedNotes === "") {
    return { ok: false, message: "There was nothing to add to that issue." };
  }

  try {
    await apiPost<unknown>(ENDPOINTS.tenant.maintenanceUpdate(issueId), {
      ...(mediaUrls.length > 0 ? { mediaUrls: [...mediaUrls] } : {}),
      ...(trimmedNotes === "" ? {} : { notes: trimmedNotes }),
    });
    revalidateMaintenance();
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}
