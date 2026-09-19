import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Spinner } from "@/components/feedback/spinner";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  isLoading?: boolean;
}

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-md text-label-md font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand-700 text-white",
  secondary: "border border-neutral-200 bg-white text-neutral-900",
  ghost: "bg-transparent text-brand-700",
  destructive: "bg-error-600 text-white",
};

const INTERACTIVE_CLASSES: Record<ButtonVariant, string> = {
  primary: "hover:bg-brand-800 active:bg-brand-950",
  secondary: "hover:bg-neutral-50 active:bg-neutral-100",
  ghost: "hover:bg-neutral-50 active:bg-neutral-100 active:text-neutral-900",
  destructive: "hover:bg-[#b91c1c] active:bg-[#b91c1c]",
};

const DISABLED_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "disabled:bg-neutral-200 disabled:text-neutral-700 disabled:hover:bg-neutral-200 disabled:active:bg-neutral-200",
  secondary:
    "disabled:opacity-45 disabled:hover:bg-white disabled:active:bg-white",
  ghost:
    "disabled:opacity-45 disabled:hover:bg-transparent disabled:active:bg-transparent disabled:active:text-brand-700",
  destructive:
    "disabled:opacity-45 disabled:hover:bg-error-600 disabled:active:bg-error-600",
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

export interface ButtonClassesOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className,
}: ButtonClassesOptions = {}): string {
  return cn(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    isLoading
      ? "opacity-72"
      : cn(INTERACTIVE_CLASSES[variant], DISABLED_CLASSES[variant]),
    SIZE_CLASSES[size],
    fullWidth && "w-full",
    className,
  );
}

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
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonClasses({
        variant,
        size,
        fullWidth,
        isLoading,
        className,
      })}
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
