"use server";

import { revalidatePath } from "next/cache";

import { toActionFailure } from "@/lib/api/actions/action-result";
import type { ActionResult } from "@/lib/api/actions/action-result";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { requireRole, requireSession } from "@/lib/api/resources/auth";
import { apiPost, apiPut } from "@/lib/api/server";
import { isUuid } from "@/lib/validation";

export async function withdrawApplicationAction(
  applicationId: string,
): Promise<ActionResult<null>> {
  if (!isUuid(applicationId)) {
    return { ok: false, message: "That application could not be found." };
  }

  try {
    await requireRole("TENANT");
    await apiPost<unknown>(
      ENDPOINTS.tenant.withdrawApplication(applicationId),
    );
    revalidatePath("/tenant/apply");
    revalidatePath("/tenant/applications");
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function markNotificationReadAction(
  notificationId: string,
): Promise<ActionResult<null>> {
  if (!isUuid(notificationId)) {
    return { ok: false, message: "That notification could not be found." };
  }

  try {
    await requireSession();
    await apiPut<unknown>(ENDPOINTS.tenant.readNotification(notificationId));
    revalidatePath("/tenant/notifications");
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function updateNotificationPreferencesAction(
  emailEnabled: boolean,
  inAppEnabled: boolean,
): Promise<ActionResult<null>> {
  try {
    await requireSession();
    await apiPut<unknown>(ENDPOINTS.tenant.notificationPreferences, {
      emailEnabled,
      inAppEnabled,
    });
    revalidatePath("/tenant/settings");
    revalidatePath("/landlord/settings/notifications");
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function sendMessageAction(
  conversationId: string,
  body: string,
): Promise<ActionResult<null>> {
  if (!isUuid(conversationId)) {
    return { ok: false, message: "That conversation could not be found." };
  }

  const trimmed = body.trim();
  if (trimmed === "") {
    return {
      ok: false,
      message: "Write a message before sending.",
      fieldErrors: { body: "A message is required." },
    };
  }

  try {
    await requireSession();
    await apiPost<unknown>(
      ENDPOINTS.tenant.conversationMessages(conversationId),
      { body: trimmed },
    );
    revalidatePath("/tenant/messages");
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}
