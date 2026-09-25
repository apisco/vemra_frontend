import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

export type LogoMarkVariant = "default" | "onDark" | "inverse";

const MARK_SOURCES: Record<LogoMarkVariant, string> = {
  default: "/logo.png",
  onDark: "/logo-light.png",
  inverse: "/logo-light.png",
};

const WORD_TONE_CLASSES: Record<LogoMarkVariant, string> = {
  default: "text-neutral-900",
  onDark: "text-neutral-400",
  inverse: "text-white",
};

const OUTLINE_CLASSES: Record<LogoMarkVariant, string> = {
  default: "focus-visible:outline-brand-700",
  onDark: "focus-visible:outline-neutral-50",
  inverse: "focus-visible:outline-white",
};

export interface LogoMarkProps {
  variant?: LogoMarkVariant;
  className?: string;
}

export function LogoMark({ variant = "default", className }: LogoMarkProps) {
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
      <Image
        src={MARK_SOURCES[variant]}
        alt=""
        aria-hidden="true"
        width={275}
        height={240}
        preload
        className="h-7 w-auto shrink-0"
      />
      <span
        className={cn(
          "font-display text-heading-sm leading-7 font-semibold",
          WORD_TONE_CLASSES[variant],
        )}
      >
        Vemra
      </span>
    </Link>
  );
}
