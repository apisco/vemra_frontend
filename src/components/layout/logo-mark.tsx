import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

export type LogoMarkVariant = "default" | "onDark";

export type LogoMarkSize = "responsive" | "fixed" | "hero" | "standalone";

const MARK_CLASSES: Record<LogoMarkSize, string> = {
  responsive: "h-7 md:h-8",
  fixed: "h-7",
  hero: "h-7 lg:h-10",
  standalone: "h-8 md:h-10",
};

const WORD_CLASSES: Record<LogoMarkSize, string> = {
  responsive:
    "text-[18px] leading-[28px] font-semibold md:text-[22px] md:leading-[30px] md:font-bold",
  fixed: "text-[18px] leading-[28px] font-semibold",
  hero: "text-[18px] leading-[28px] font-semibold lg:text-heading-lg lg:leading-[36px] lg:font-bold",
  standalone: "text-heading-lg leading-[36px] font-bold",
};

const MARK_SOURCES: Record<LogoMarkVariant, string> = {
  default: "/logo.png",
  onDark: "/logo-light.png",
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
      <Image
        src={MARK_SOURCES[variant]}
        alt=""
        aria-hidden="true"
        width={275}
        height={240}
        priority
        className={cn("w-auto shrink-0", MARK_CLASSES[size])}
      />
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
