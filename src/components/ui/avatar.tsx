import { cn } from "@/lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

export type AvatarTone = "solid" | "subtle";

export interface AvatarProps {
  name: string;
  src?: string;
  initials?: string;
  size?: AvatarSize;
  tone?: AvatarTone;
  className?: string;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "size-6 text-caption",
  sm: "size-8 text-label-sm",
  md: "size-10 text-label-md",
  lg: "size-12 text-heading-sm",
};

const TONE_CLASSES: Record<AvatarTone, string> = {
  solid: "bg-brand-700 text-white",
  subtle: "bg-brand-50 text-brand-700",
};

function deriveInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  name,
  src,
  initials,
  size = "md",
  tone = "solid",
  className,
}: AvatarProps) {
  const resolvedInitials = initials ?? deriveInitials(name);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold",
        resolvedInitials || src
          ? TONE_CLASSES[tone]
          : "bg-neutral-200 text-neutral-700",
        SIZE_CLASSES[size],
        className,
      )}
      role={src ? undefined : "img"}
      aria-label={src ? undefined : name}
    >
      {src ? (
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{resolvedInitials}</span>
      )}
    </span>
  );
}
