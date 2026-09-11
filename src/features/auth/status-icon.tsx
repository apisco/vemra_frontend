import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type StatusIconTone = "success" | "warning" | "error";

export type StatusIconSize = "md" | "lg";

const TONE_CLASSES: Record<StatusIconTone, string> = {
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-500",
  error: "bg-error-50 text-error-600",
};

const SIZE_CLASSES: Record<StatusIconSize, string> = {
  md: "p-4 [&_svg]:size-6 md:p-4.5 md:[&_svg]:size-7",
  lg: "p-4 [&_svg]:size-8",
};

export interface StatusIconProps {
  tone?: StatusIconTone;
  size?: StatusIconSize;
  className?: string;
  children: ReactNode;
}

export function StatusIcon({
  tone = "success",
  size = "lg",
  className,
  children,
}: StatusIconProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        SIZE_CLASSES[size],
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
