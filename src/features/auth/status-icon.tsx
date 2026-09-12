import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type StatusIconTone = "success" | "warning" | "error";

export type StatusIconSize = "sm" | "md" | "lg";

export type StatusIconShape = "circle" | "squircle";

const TONE_CLASSES: Record<StatusIconTone, string> = {
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-500",
  error: "bg-error-50 text-error-600",
};

const SIZE_CLASSES: Record<StatusIconSize, string> = {
  sm: "p-5.5 [&_svg]:size-5",
  md: "p-4 [&_svg]:size-6 md:p-4.5 md:[&_svg]:size-7",
  lg: "p-4 [&_svg]:size-8",
};

const SHAPE_CLASSES: Record<StatusIconShape, string> = {
  circle: "rounded-full",
  squircle: "rounded-xl",
};

export interface StatusIconProps {
  tone?: StatusIconTone;
  size?: StatusIconSize;
  shape?: StatusIconShape;
  className?: string;
  children: ReactNode;
}

export function StatusIcon({
  tone = "success",
  size = "lg",
  shape = "circle",
  className,
  children,
}: StatusIconProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        SHAPE_CLASSES[shape],
        SIZE_CLASSES[size],
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
