import { isAllowedUploadUrl } from "@/lib/media/cloudinary";
import { isTicketExpired } from "@/lib/media/ticket";
import type { UploadTicket, UploadedAsset } from "@/types/api/media";

const DEFAULT_TIMEOUT_MS = 60_000;

export interface UploadOptions {
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
  timeoutMs?: number;
}

function cancelled(): DOMException {
  return new DOMException("Upload cancelled.", "AbortError");
}

export function isUploadCancelled(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function readString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function readNumber(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parseJson(text: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(text);
    return parsed !== null && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function readUploadedAsset(text: string): UploadedAsset | null {
  const payload = parseJson(text);
  if (payload === null) {
    return null;
  }

  const url = readString(payload, "secure_url") ?? readString(payload, "url");
  if (url === null) {
    return null;
  }

  return {
    url,
    // Private scopes store the public_id rather than the URL. Falling back to
    // the URL keeps a ticket that omits public_id usable — the backend accepts
    // a full private URL as a storage path too.
    storagePath: readString(payload, "public_id") ?? url,
    bytes: readNumber(payload, "bytes"),
    format: readString(payload, "format"),
  };
}

/**
 * Cloudinary reports failures as `{ error: { message } }`. Its messages are
 * written for developers, so only surface ones short enough to be readable.
 */
function uploadFailureMessage(text: string, status: number): string {
  const payload = parseJson(text);
  const error = payload?.error;
  const message =
    error !== null && typeof error === "object"
      ? readString(error as Record<string, unknown>, "message")
      : null;

  if (message !== null && message.length <= 160) {
    return `Storage rejected the upload: ${message}`;
  }
  return `The upload failed (HTTP ${status}). Please try again.`;
}

/**
 * Uploads a file straight to Cloudinary with a presigned ticket from the Vemra
 * API. Nothing authenticates this request and no file ever passes through a
 * Vemra server — the signature in `ticket.fields` is the authorisation.
 *
 * Uses XMLHttpRequest rather than fetch because only XHR reports upload
 * progress, which these forms show.
 */
export async function uploadToCloudinary(
  file: File | Blob,
  ticket: UploadTicket,
  options: UploadOptions = {},
): Promise<UploadedAsset> {
  if (!isAllowedUploadUrl(ticket.uploadUrl)) {
    throw new Error(
      "Vemra returned an unrecognised upload destination, so the file was not sent.",
    );
  }
  if (isTicketExpired(ticket)) {
    throw new Error(
      "The upload link expired before the file was sent. Please try again.",
    );
  }

  const body = new FormData();
  for (const [key, value] of Object.entries(ticket.fields)) {
    body.append(key, value);
  }
  body.append("file", file);

  const { signal, onProgress, timeoutMs } = options;

  if (signal?.aborted === true) {
    throw cancelled();
  }

  return new Promise<UploadedAsset>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", ticket.uploadUrl);
    xhr.timeout = timeoutMs ?? DEFAULT_TIMEOUT_MS;

    const abort = () => xhr.abort();
    const cleanup = () => {
      signal?.removeEventListener("abort", abort);
    };
    signal?.addEventListener("abort", abort, { once: true });

    if (onProgress !== undefined) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
        }
      };
    }

    xhr.onload = () => {
      cleanup();

      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(uploadFailureMessage(xhr.responseText, xhr.status)));
        return;
      }

      const asset = readUploadedAsset(xhr.responseText);
      if (asset === null) {
        reject(
          new Error(
            "The upload finished but storage did not return a usable file reference.",
          ),
        );
        return;
      }

      onProgress?.(100);
      resolve(asset);
    };

    xhr.onerror = () => {
      cleanup();
      reject(
        new Error(
          "The file could not reach storage. Check your connection and try again.",
        ),
      );
    };

    xhr.ontimeout = () => {
      cleanup();
      reject(new Error("The upload timed out. Please try again."));
    };

    xhr.onabort = () => {
      cleanup();
      reject(cancelled());
    };

    xhr.send(body);
  });
}
