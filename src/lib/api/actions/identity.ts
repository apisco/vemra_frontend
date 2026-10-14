"use server";

import { revalidatePath } from "next/cache";

import { ACCOUNT_PATHS } from "@/lib/api/actions/account-paths";
import { toActionFailure } from "@/lib/api/actions/action-result";
import type { ActionResult } from "@/lib/api/actions/action-result";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { requireSession } from "@/lib/api/resources/auth";
import { apiDelete, apiPatchData } from "@/lib/api/server";
import { isAllowedDeliveryUrl } from "@/lib/media/cloudinary";
import { unwrapData } from "@/lib/api/adapters";
import type { AccountProfile, ProfileUpdatePayload } from "@/types/api/auth";

function revalidateAccount(): void {
  for (const path of ACCOUNT_PATHS) {
    revalidatePath(path);
  }
}

export async function updateProfileAction(
  input: ProfileUpdatePayload,
): Promise<ActionResult<AccountProfile>> {
  try {
    const data = await apiPatchData<AccountProfile>(
      ENDPOINTS.identity.updateProfile,
      input,
    );
    revalidateAccount();
    return { ok: true, data };
  } catch (error) {
    return toActionFailure(error);
  }
}

/**
 * Step 3 of the avatar upload: record the Cloudinary URL on the profile.
 *
 * `PATCH /me/avatar` accepts any URI, so the URL is pinned to the Cloudinary
 * delivery host first. Without that, a value from anywhere could end up
 * rendered as this user's avatar across the app.
 */
export async function setAvatarAction(
  avatarUrl: string,
): Promise<ActionResult<AccountProfile>> {
  await requireSession();

  if (!isAllowedDeliveryUrl(avatarUrl)) {
    return {
      ok: false,
      message: "That image address is not a Vemra storage URL.",
    };
  }

  try {
    const data = await apiPatchData<AccountProfile>(
      ENDPOINTS.identity.avatar,
      { avatarUrl },
    );
    revalidateAccount();
    return { ok: true, data };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function removeAvatarAction(): Promise<
  ActionResult<AccountProfile | null>
> {
  await requireSession();

  try {
    const body = await apiDelete<unknown>(ENDPOINTS.identity.avatar);
    revalidateAccount();
    return { ok: true, data: unwrapData<AccountProfile | null>(body) ?? null };
  } catch (error) {
    return toActionFailure(error);
  }
}
