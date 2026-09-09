import { cn } from "@/lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

export interface AvatarProps {
  name: string;
  src?: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "size-6 text-caption",
  sm: "size-8 text-label-sm",
  md: "size-10 text-label-md",
  lg: "size-12 text-heading-sm",
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
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{resolvedInitials}</span>
      )}
    </span>
  );
}
