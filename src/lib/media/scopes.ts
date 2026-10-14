import type { MediaScope } from "@/types/api/media";

export interface MediaScopeRules {
  /** Human label for this kind of file, used in error messages. */
  readonly label: string;
  readonly maxBytes: number;
  readonly contentTypes: readonly string[];
}

const MB = 1024 * 1024;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const TYPE_LABELS: Readonly<Record<string, string>> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "application/pdf": "PDF",
};

/**
 * Size and format limits per storage scope, from the media upload guide.
 *
 * These mirror limits the backend enforces when it signs the ticket (avatars
 * are capped at 5 MB and restricted to the three image types in the OpenAPI
 * schema, for example). Checking here too just turns a round trip and a 400
 * into an instant, readable message.
 */
export const MEDIA_SCOPES: Readonly<Record<MediaScope, MediaScopeRules>> = {
  AVATARS: {
    label: "profile photo",
    maxBytes: 5 * MB,
    contentTypes: IMAGE_TYPES,
  },
  PROPERTY_MEDIA: {
    label: "property photo",
    maxBytes: 15 * MB,
    contentTypes: IMAGE_TYPES,
  },
  KYC: {
    label: "identity document",
    maxBytes: 10 * MB,
    contentTypes: [...IMAGE_TYPES, "application/pdf"],
  },
  APPLICATIONS: {
    label: "supporting document",
    maxBytes: 10 * MB,
    contentTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
  MAINTENANCE: {
    label: "issue photo",
    maxBytes: 10 * MB,
    contentTypes: IMAGE_TYPES,
  },
};

/** "5 MB", "15 MB" — whole numbers, since every limit is a whole MB. */
export function formatMaxSize(bytes: number): string {
  const mb = bytes / MB;
  return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`;
}

/** Value for a file input's `accept` attribute. */
export function acceptAttribute(scope: MediaScope): string {
  return MEDIA_SCOPES[scope].contentTypes.join(",");
}

/** "JPEG, PNG or WebP up to 5 MB" — for helper text under a file input. */
export function describeLimits(scope: MediaScope): string {
  const { contentTypes, maxBytes } = MEDIA_SCOPES[scope];
  const labels = contentTypes.map((type) => TYPE_LABELS[type] ?? type);
  const formats =
    labels.length <= 1
      ? (labels[0] ?? "")
      : `${labels.slice(0, -1).join(", ")} or ${labels[labels.length - 1]}`;
  return `${formats} up to ${formatMaxSize(maxBytes)}`;
}

/**
 * The parts of a `File` these checks read. Declared structurally so the same
 * rules can run server-side against file metadata sent by the browser, where
 * there is no `File` instance.
 */
export interface FileLike {
  readonly name: string;
  readonly size: number;
  readonly type: string;
}

/**
 * Returns a user-facing reason the file cannot be uploaded, or `null` when it
 * passes. Named so callers read as `const problem = validateFile(...)`.
 */
export function validateFile(
  scope: MediaScope,
  file: FileLike,
): string | null {
  const rules = MEDIA_SCOPES[scope];

  if (file.size === 0) {
    return `${file.name} is empty. Choose a different file.`;
  }

  if (file.size > rules.maxBytes) {
    return `${file.name} is larger than ${formatMaxSize(rules.maxBytes)}. Choose a smaller ${rules.label}.`;
  }

  // Browsers leave `type` empty for extensions they do not recognise. The
  // backend needs a real MIME type to sign the ticket, so stop here rather than
  // guessing one from the file name.
  if (file.type === "") {
    return `Vemra could not tell what kind of file ${file.name} is. Save it as ${describeLimits(scope)} and try again.`;
  }

  if (!rules.contentTypes.includes(file.type)) {
    return `${file.name} is not a supported ${rules.label}. Use ${describeLimits(scope)}.`;
  }

  return null;
}

/** First problem across several files, or `null` when all of them pass. */
export function validateFiles(
  scope: MediaScope,
  files: readonly FileLike[],
): string | null {
  for (const file of files) {
    const problem = validateFile(scope, file);
    if (problem !== null) {
      return problem;
    }
  }
  return null;
}
