import Link from "next/link";

import { cn } from "@/lib/cn";

export type LogoMarkVariant = "default" | "onDark";

export type LogoMarkSize = "responsive" | "fixed" | "hero";

const MARK_CLASSES: Record<LogoMarkSize, string> = {
  responsive: "size-7 md:size-8",
  fixed: "size-7",
  hero: "size-7 lg:size-10",
};

const GLYPH_INSET_CLASSES: Record<LogoMarkSize, string> = {
  responsive: "inset-1.5",
  fixed: "inset-1.5",
  hero: "inset-1.5 lg:inset-2.5",
};

const WORD_CLASSES: Record<LogoMarkSize, string> = {
  responsive:
    "text-[18px] leading-[28px] font-semibold md:text-[22px] md:leading-[30px] md:font-bold",
  fixed: "text-[18px] leading-[28px] font-semibold",
  hero: "text-[18px] leading-[28px] font-semibold lg:text-heading-lg lg:leading-[36px] lg:font-bold",
};

const SQUARE_CLASSES: Record<LogoMarkVariant, string> = {
  default: "bg-brand-700",
  onDark: "bg-neutral-50",
};

const GLYPH_CLASSES: Record<LogoMarkVariant, string> = {
  default: "bg-white",
  onDark: "bg-brand-700",
};

const WORD_TONE_CLASSES: Record<LogoMarkVariant, string> = {
  default: "text-neutral-900",
  onDark: "text-neutral-400",
};

const OUTLINE_CLASSES: Record<LogoMarkVariant, string> = {
  default: "focus-visible:outline-brand-700",
  onDark: "focus-visible:outline-neutral-50",
};

export interface LogoMarkProps {
  variant?: LogoMarkVariant;
  size?: LogoMarkSize;
  className?: string;
}

export function LogoMark({
  variant = "default",
  size = "responsive",
  className,
}: LogoMarkProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 rounded-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        OUTLINE_CLASSES[variant],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative shrink-0 rounded-md",
          MARK_CLASSES[size],
          SQUARE_CLASSES[variant],
        )}
      >
        <span
          className={cn(
            "absolute rounded-sm",
            GLYPH_INSET_CLASSES[size],
            GLYPH_CLASSES[variant],
          )}
        />
      </span>
      <span
        className={cn(
          "font-display",
          WORD_CLASSES[size],
          WORD_TONE_CLASSES[variant],
        )}
      >
        Vemra
      </span>
    </Link>
  );
}
