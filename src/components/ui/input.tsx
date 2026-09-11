"use client";

import { useId, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  hideLabel?: boolean;
  helperText?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  showPasswordToggle?: boolean;
  containerClassName?: string;
}

export function Input({
  label,
  hideLabel = false,
  helperText,
  error,
  iconLeft,
  iconRight,
  showPasswordToggle = false,
  containerClassName,
  disabled = false,
  id,
  type = "text",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const [isRevealed, setIsRevealed] = useState(false);
  const resolvedType = showPasswordToggle && isRevealed ? "text" : type;

  const describedBy =
    [error ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
      <label
        htmlFor={inputId}
        className={cn(
          "text-label-md font-semibold",
          hideLabel && "sr-only",
          disabled ? "text-neutral-700" : "text-neutral-800",
        )}
      >
        {label}
      </label>

      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-md border px-3 transition-colors",
          "focus-within:border-brand-700 focus-within:outline-1 focus-within:outline-brand-700",
          disabled
            ? "border-neutral-200 bg-neutral-50"
            : error
              ? "border-error-600 bg-white"
              : "border-neutral-200 bg-white",
        )}
      >
        {iconLeft && (
          <span
            className="shrink-0 text-neutral-700 [&_svg]:size-5"
            aria-hidden="true"
          >
            {iconLeft}
          </span>
        )}

        <input
          {...props}
          id={inputId}
          type={resolvedType}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-body-md text-neutral-900 outline-none",
            disabled
              ? "cursor-not-allowed placeholder:text-neutral-200"
              : "placeholder:text-neutral-700",
          )}
        />

        {showPasswordToggle ? (
          <button
            type="button"
            onClick={() => setIsRevealed((revealed) => !revealed)}
            disabled={disabled}
            aria-controls={inputId}
            className="shrink-0 rounded-sm text-label-sm font-semibold text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:text-neutral-400"
          >
            {isRevealed ? "Hide" : "Show"}
          </button>
        ) : (
          iconRight && (
            <span
              className="shrink-0 text-neutral-700 [&_svg]:size-5"
              aria-hidden="true"
            >
              {iconRight}
            </span>
          )
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-label-sm text-error-600">
          {error}
        </p>
      ) : null}

      {helperText ? (
        <p id={helperId} className="text-label-sm text-neutral-700">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
