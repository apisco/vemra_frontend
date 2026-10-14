import type { Iso8601 } from "@/types/api/common";

/**
 * Storage scopes from the media upload guide. Each one maps to a delivery mode
 * (public CDN URL vs. private signed URL) and its own size and format limits —
 * see MEDIA_SCOPES in `src/lib/media/scopes.ts`.
 */
export type MediaScope =
  | "AVATARS"
  | "PROPERTY_MEDIA"
  | "KYC"
  | "APPLICATIONS"
  | "MAINTENANCE";

/**
 * A presigned upload ticket, normalised from the two shapes the backend
 * returns: `{ uploadUrl, fields, signature, publicId, expiresAt }` on the newer
 * endpoints and `{ url, fields }` on `POST /kyc/documents/grants`.
 */
export interface UploadTicket {
  uploadUrl: string;
  fields: Readonly<Record<string, string>>;
  publicId: string | null;
  expiresAt: Iso8601 | null;
}

/**
 * What Cloudinary returns once the bytes have landed.
 *
 * `url` is the CDN delivery URL (`secure_url`) and is what public scopes send
 * back to the Vemra API. `storagePath` is the `public_id` and is what the
 * private scopes (KYC, applications) send instead.
 */
export interface UploadedAsset {
  url: string;
  storagePath: string;
  bytes: number | null;
  format: string | null;
}
