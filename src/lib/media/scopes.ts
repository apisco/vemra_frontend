import type { MediaScope } from "@/types/api/media";

export interface MediaScopeRules {
  /** Human label for this kind of file, used in error messages. */
  readonly label: string;
  /** Size cap for this scope. Applies to every type except videos. */
  readonly maxBytes: number;
  /** Size cap for video types, when the scope accepts them. */
  readonly videoMaxBytes?: number;
  readonly contentTypes: readonly string[];
}

const MB = 1024 * 1024;

const IMAGE_MAX_BYTES = 10 * MB;
const VIDEO_MAX_BYTES = 100 * MB;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"] as const;

/** Photos and videos, accepted by property media and maintenance. */
const PHOTO_VIDEO_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

const TYPE_LABELS: Readonly<Record<string, string>> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "application/pdf": "PDF",
  "video/mp4": "MP4",
  "video/webm": "WebM",
  "video/quicktime": "MOV",
};

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"] as const;

/**
 * Size and format limits per storage scope.
 *
 * Photos and documents are capped at 10 MB; videos at 100 MB where a scope
 * accepts them. Checking here just turns a round trip and a 400 into an
 * instant, readable message — the backend still enforces its own limits when it
 * signs the ticket, so its caps must match these.
 */
export const MEDIA_SCOPES: Readonly<Record<MediaScope, MediaScopeRules>> = {
  AVATARS: {
    label: "profile photo",
    maxBytes: IMAGE_MAX_BYTES,
    contentTypes: IMAGE_TYPES,
  },
  PROPERTY_MEDIA: {
    label: "property photo or video",
    maxBytes: IMAGE_MAX_BYTES,
    videoMaxBytes: VIDEO_MAX_BYTES,
    contentTypes: PHOTO_VIDEO_TYPES,
  },
  KYC: {
    label: "identity document",
    maxBytes: IMAGE_MAX_BYTES,
    contentTypes: [...IMAGE_TYPES, "application/pdf"],
  },
  APPLICATIONS: {
    label: "supporting document",
    maxBytes: IMAGE_MAX_BYTES,
    contentTypes: ["application/pdf", ...IMAGE_TYPES],
  },
  MAINTENANCE: {
    label: "issue photo or video",
    maxBytes: IMAGE_MAX_BYTES,
    videoMaxBytes: VIDEO_MAX_BYTES,
    contentTypes: PHOTO_VIDEO_TYPES,
  },
  LEASES: {
    label: "condition photo",
    maxBytes: IMAGE_MAX_BYTES,
    contentTypes: IMAGE_TYPES,
  },
};

/** "10 MB", "100 MB" — whole numbers, since every limit is a whole MB. */
export function formatMaxSize(bytes: number): string {
  const mb = bytes / MB;
  return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`;
}

/** "JPEG, PNG or WebP" — a readable list of format labels. */
function formatLabels(types: readonly string[]): string {
  const labels = types.map((type) => TYPE_LABELS[type] ?? type);
  if (labels.length <= 1) {
    return labels[0] ?? "";
  }
  return `${labels.slice(0, -1).join(", ")} or ${labels[labels.length - 1]}`;
}

/** Value for a file input's `accept` attribute. */
export function acceptAttribute(scope: MediaScope): string {
  return MEDIA_SCOPES[scope].contentTypes.join(",");
}

/**
 * The size cap that applies to a specific content type in a scope. Videos get
 * their own, larger cap wherever a scope accepts them.
 */
export function maxBytesFor(scope: MediaScope, contentType: string): number {
  const rules = MEDIA_SCOPES[scope];
  if (isVideoType(contentType) && rules.videoMaxBytes !== undefined) {
    return rules.videoMaxBytes;
  }
  return rules.maxBytes;
}

/**
 * "JPEG, PNG or WebP up to 10 MB" — for helper text under a file input. Scopes
 * that accept video list the two caps separately, e.g.
 * "JPEG, PNG or WebP up to 10 MB; MP4, WebM or MOV up to 100 MB".
 */
export function describeLimits(scope: MediaScope): string {
  const rules = MEDIA_SCOPES[scope];

  if (rules.videoMaxBytes === undefined) {
    return `${formatLabels(rules.contentTypes)} up to ${formatMaxSize(rules.maxBytes)}`;
  }

  const images = rules.contentTypes.filter((type) => !isVideoType(type));
  const videos = rules.contentTypes.filter((type) => isVideoType(type));
  const parts: string[] = [];

  if (images.length > 0) {
    parts.push(`${formatLabels(images)} up to ${formatMaxSize(rules.maxBytes)}`);
  }
  if (videos.length > 0) {
    parts.push(
      `${formatLabels(videos)} up to ${formatMaxSize(rules.videoMaxBytes)}`,
    );
  }

  return parts.join("; ");
}

/** True when `contentType` is a video the platform accepts. */
export function isVideoType(contentType: string): boolean {
  return (VIDEO_TYPES as readonly string[]).includes(contentType);
}

/**
 * Best-effort video detection for an already-stored asset, which arrives as a
 * URL rather than a `File`. Cloudinary tags video assets with `/video/upload/`
 * in the path; the extension check covers other storage shapes.
 */
export function isVideoUrl(url: string): boolean {
  const path = url.split(/[?#]/)[0]?.toLowerCase() ?? "";
  return (
    path.includes("/video/upload/") ||
    VIDEO_EXTENSIONS.some((extension) => path.endsWith(extension))
  );
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
  const maxBytes = maxBytesFor(scope, file.type);

  if (file.size === 0) {
    return `${file.name} is empty. Choose a different file.`;
  }

  if (file.size > maxBytes) {
    return `${file.name} is larger than ${formatMaxSize(maxBytes)}. Choose a smaller ${rules.label}.`;
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
