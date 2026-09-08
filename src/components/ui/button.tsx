import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Spinner } from "@/components/feedback/spinner";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
   isLoading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-800",
  secondary:
    "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50",
  outline:
    "border border-brand-700 bg-transparent text-brand-700 hover:bg-brand-50",
  ghost: "bg-transparent text-brand-700 hover:bg-brand-50",
  destructive: "bg-error-600 text-white hover:bg-error-600/90",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-10 px-5 [&_svg]:size-4",
  md: "h-11 px-6 [&_svg]:size-5",
  lg: "h-12 px-8 [&_svg]:size-5",
};

const SPINNER_SIZE: Record<ButtonSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-5",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  iconLeft,
  iconRight,
  isLoading = false,
  disabled = false,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const isInactive = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isInactive}
      aria-busy={isLoading || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-label-md font-semibold whitespace-nowrap transition-colors",
        "active:brightness-95",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
        "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-neutral-200 disabled:text-neutral-700 disabled:brightness-100 disabled:hover:bg-neutral-200",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner className={SPINNER_SIZE[size]} />
      ) : (
        iconLeft && (
          <span className="shrink-0" aria-hidden="true">
            {iconLeft}
          </span>
        )
      )}
      {children}
      {iconRight && (
        <span className="shrink-0" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
}
