import { isAllowedUploadUrl } from "@/lib/media/cloudinary";
import type { UploadTicket } from "@/types/api/media";

function readRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

/**
 * Keeps only the string entries. Cloudinary's multipart policy fields are all
 * strings; anything else in there cannot be appended to a FormData as-is and is
 * more likely a backend slip than something we should forward blindly.
 */
function readFields(value: unknown): Record<string, string> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const fields: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === "string") {
      fields[key] = entry;
    } else if (typeof entry === "number" || typeof entry === "boolean") {
      fields[key] = String(entry);
    }
  }

  return Object.keys(fields).length === 0 ? null : fields;
}

/**
 * Normalises an upload-ticket response into a single `UploadTicket`.
 *
 * Accepts the response body with or without the `{ data, requestId }` envelope,
 * and both ticket shapes the backend currently returns:
 *
 * - `{ uploadUrl, fields, signature, publicId, expiresAt }` — avatars, property
 *   media, application documents, maintenance photos
 * - `{ url, fields }` — `POST /kyc/documents/grants`
 *
 * Returns `null` when the payload is unusable, so callers can surface a plain
 * "no usable upload ticket" failure rather than sending a file nowhere.
 */
export function readUploadTicket(body: unknown): UploadTicket | null {
  const envelope = readRecord(body);
  const payload = "data" in envelope ? readRecord(envelope.data) : envelope;

  const uploadUrl = readString(payload.uploadUrl) ?? readString(payload.url);
  if (!isAllowedUploadUrl(uploadUrl)) {
    return null;
  }

  const fields = readFields(payload.fields);
  if (fields === null) {
    return null;
  }

  return {
    uploadUrl,
    fields,
    publicId: readString(payload.publicId),
    expiresAt: readString(payload.expiresAt),
  };
}

/**
 * True when the ticket's `expiresAt` is in the past. Tickets without one are
 * treated as live — the backend is the authority on expiry, this only avoids a
 * pointless round trip with a file we already know is too late to send.
 */
export function isTicketExpired(
  ticket: UploadTicket,
  now: number = Date.now(),
): boolean {
  if (ticket.expiresAt === null) {
    return false;
  }
  const expiry = Date.parse(ticket.expiresAt);
  return Number.isFinite(expiry) && expiry <= now;
}
