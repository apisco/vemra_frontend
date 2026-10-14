/**
 * Cloudinary host allowlists.
 *
 * The frontend holds no Cloudinary credentials — it only ever POSTs to the
 * `uploadUrl` the backend signed for it. Pinning that URL to a known host is
 * what stops a buggy or tampered ticket response from redirecting a user's
 * identity document to somewhere else, and mirrors how checkout URLs are
 * pinned in `src/lib/payments/provider.ts`.
 */

/** Ingestion: `api.cloudinary.com/v1_1/<cloud>/<resource>/upload`. */
export const CLOUDINARY_UPLOAD_HOSTS: readonly string[] = [
  "api.cloudinary.com",
];

/** Delivery: `res.cloudinary.com/<cloud>/...`. */
export const CLOUDINARY_DELIVERY_HOSTS: readonly string[] = [
  "res.cloudinary.com",
];

function isHttpsUrlOn(value: unknown, hosts: readonly string[]): value is string {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.protocol !== "https:") {
    return false;
  }
  if (url.username !== "" || url.password !== "") {
    return false;
  }

  return hosts.includes(url.hostname.toLowerCase());
}

/** True when `value` is an https Cloudinary *ingestion* endpoint. */
export function isAllowedUploadUrl(value: unknown): value is string {
  return isHttpsUrlOn(value, CLOUDINARY_UPLOAD_HOSTS);
}

/** True when `value` is an https Cloudinary *delivery* (CDN) URL. */
export function isAllowedDeliveryUrl(value: unknown): value is string {
  return isHttpsUrlOn(value, CLOUDINARY_DELIVERY_HOSTS);
}
