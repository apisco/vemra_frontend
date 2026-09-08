import { cn } from "@/lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

export interface AvatarProps {
  /**
   * Full name of the person. Used as the accessible label, and — when `initials`
   * is omitted — to derive the initials.
   */
  name: string;
  /** Photo URL. When present it replaces the initials. */
  src?: string;
  /** Overrides the derived initials, e.g. for a company with a one-word name. */
  initials?: string;
  size?: AvatarSize;
  className?: string;
}

/**
 * Figma: Avatar `68:19` — Small `68:13` (32px / 12px), Medium `68:15` (40px /
 * 14px), Large `68:17` (48px / 18px). `xs` has no Figma source; it is derived on
 * the base-4 scale for dense rows such as table cells and chat lists.
 */
const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "size-6 text-caption",
  sm: "size-8 text-label-sm",
  md: "size-10 text-label-md",
  lg: "size-12 text-heading-sm",
};

/** First letters of the first two words, so "Ada Lovelace" → "AL". */
function deriveInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Three tiers, in order: photo → initials → neutral placeholder.
 *
 * The placeholder is a plain `neutral-200` circle rather than a person glyph,
 * because the design ships no icon assets and inventing one would add a design
 * value. Swapping a broken photo for its initials at runtime would require a
 * client component and an `onError` handler; the design defines no such state,
 * so `alt` carries the name instead and this stays a Server Component.
 */
export function Avatar({
  name,
  src,
  initials,
  size = "md",
  className,
}: AvatarProps) {
  const resolvedInitials = initials ?? deriveInitials(name);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold",
        resolvedInitials || src
          ? "bg-brand-700 text-white"
          : "bg-neutral-200 text-neutral-700",
        SIZE_CLASSES[size],
        className,
      )}
      role={src ? undefined : "img"}
      aria-label={src ? undefined : name}
    >
      {src ? (
        /* Avatars are user-uploaded, so the host is not known at build time and
           cannot be added to `images.remotePatterns` yet. Revisit once the upload
           domain is fixed; the sizes are fixed here, so there is no layout-shift
           cost in the meantime. */
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{resolvedInitials}</span>
      )}
    </span>
  );
}
