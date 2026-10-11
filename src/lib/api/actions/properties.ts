"use server";

import { revalidatePath } from "next/cache";

import { toActionFailure } from "@/lib/api/actions/action-result";
import type { ActionResult } from "@/lib/api/actions/action-result";
import { unwrapData } from "@/lib/api/adapters";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { requireRole } from "@/lib/api/resources/auth";
import { apiDelete, apiPatch, apiPost } from "@/lib/api/server";
import { isUuid } from "@/lib/validation";

const INVALID_PROPERTY = "That property could not be found.";

export interface PropertyDraft {
  title: string;
  description: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  amenities: readonly string[];
  rentAmountMinor: number;
  rentCurrency: string;
  rentPeriod: "monthly" | "yearly";
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
}

export interface PropertyUpdate {
  title?: string;
  description?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  amenities?: readonly string[];
  rentAmountMinor?: number;
  rentCurrency?: string;
  rentPeriod?: "monthly" | "yearly";
}

export interface MediaTicket {
  url: string;
  fields: Record<string, string>;
}

export async function createPropertyAction(
  draft: PropertyDraft,
): Promise<ActionResult<{ propertyId: string }>> {
  try {
    await requireRole("LANDLORD");

    const body = await apiPost<unknown>(
      ENDPOINTS.landlord.createProperty,
      draft,
    );
    const payload = unwrapData<{ id?: unknown; propertyId?: unknown }>(body);
    const id = payload?.id ?? payload?.propertyId;

    if (typeof id !== "string" || id === "") {
      return {
        ok: false,
        message:
          "Vemra created the listing but did not return its id, so we could not continue. Check your listings.",
      };
    }

    revalidatePath("/landlord/properties");
    return { ok: true, data: { propertyId: id } };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function updatePropertyAction(
  propertyId: string,
  update: PropertyUpdate,
): Promise<ActionResult<null>> {
  if (!isUuid(propertyId)) {
    return { ok: false, message: INVALID_PROPERTY };
  }

  try {
    await requireRole("LANDLORD");
    await apiPatch<unknown>(
      ENDPOINTS.landlord.updateProperty(propertyId),
      update,
    );
    revalidatePath("/landlord/properties");
    revalidatePath(`/landlord/properties/${propertyId}`);
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function createMediaTicketAction(
  propertyId: string,
  fileName: string,
  contentType: string,
  maxSizeBytes: number,
): Promise<ActionResult<MediaTicket>> {
  if (!isUuid(propertyId)) {
    return { ok: false, message: INVALID_PROPERTY };
  }

  try {
    await requireRole("LANDLORD");
    const body = await apiPost<unknown>(
      ENDPOINTS.landlord.mediaTicket(propertyId),
      { fileName, contentType, maxSizeBytes },
    );
    const payload = unwrapData<{ url?: unknown; fields?: unknown }>(body);

    if (
      typeof payload?.url !== "string" ||
      payload.fields === null ||
      typeof payload.fields !== "object"
    ) {
      return {
        ok: false,
        message: "Vemra did not return a usable upload ticket.",
      };
    }

    return {
      ok: true,
      data: {
        url: payload.url,
        fields: payload.fields as Record<string, string>,
      },
    };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function attachMediaAction(
  propertyId: string,
  url: string,
  isMain: boolean,
  order: number,
): Promise<ActionResult<null>> {
  if (!isUuid(propertyId)) {
    return { ok: false, message: INVALID_PROPERTY };
  }
  if (url.trim() === "") {
    return { ok: false, message: "The uploaded photo has no URL." };
  }

  try {
    await requireRole("LANDLORD");
    await apiPost<unknown>(ENDPOINTS.landlord.media(propertyId), {
      url,
      isMain,
      order,
    });
    revalidatePath(`/landlord/properties/${propertyId}`);
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function publishPropertyAction(
  propertyId: string,
): Promise<ActionResult<null>> {
  if (!isUuid(propertyId)) {
    return { ok: false, message: INVALID_PROPERTY };
  }

  try {
    await requireRole("LANDLORD");
    await apiPost<unknown>(ENDPOINTS.landlord.publishProperty(propertyId));
    revalidatePath("/landlord/properties");
    revalidatePath(`/landlord/properties/${propertyId}`);
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function unlistPropertyAction(
  propertyId: string,
): Promise<ActionResult<null>> {
  if (!isUuid(propertyId)) {
    return { ok: false, message: INVALID_PROPERTY };
  }

  try {
    await requireRole("LANDLORD");
    await apiPost<unknown>(ENDPOINTS.landlord.unlistProperty(propertyId));
    revalidatePath("/landlord/properties");
    revalidatePath(`/landlord/properties/${propertyId}`);
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function saveProperty(
  propertyId: string,
): Promise<ActionResult<null>> {
  if (!isUuid(propertyId)) {
    return { ok: false, message: INVALID_PROPERTY };
  }

  try {
    await requireRole("TENANT");
    await apiPost<unknown>(ENDPOINTS.tenant.savedProperties, { propertyId });
    revalidatePath("/tenant/saved-properties");
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function unsaveProperty(
  propertyId: string,
): Promise<ActionResult<null>> {
  if (!isUuid(propertyId)) {
    return { ok: false, message: INVALID_PROPERTY };
  }

  try {
    await requireRole("TENANT");
    await apiDelete<unknown>(ENDPOINTS.tenant.savedProperty(propertyId));
    revalidatePath("/tenant/saved-properties");
    return { ok: true, data: null };
  } catch (error) {
    return toActionFailure(error);
  }
}
