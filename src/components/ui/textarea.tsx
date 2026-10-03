"use client";

import { useId } from "react";
import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  label: string;
  hideLabel?: boolean;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  fieldClassName?: string;
}

export function Textarea({
  label,
  hideLabel = false,
  helperText,
  error,
  containerClassName,
  fieldClassName,
  disabled = false,
  id,
  rows = 3,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const helperId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;

  const describedBy =
    [error ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
      <label
        htmlFor={textareaId}
        className={cn(
          "text-label-md font-semibold",
          hideLabel && "sr-only",
          disabled ? "text-neutral-700" : "text-neutral-800",
        )}
      >
        {label}
      </label>

      <textarea
        {...props}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "w-full resize-y rounded-md border p-3 text-body-md text-neutral-900 transition-colors outline-none",
          "focus:border-brand-700 focus:outline-1 focus:outline-brand-700",
          disabled
            ? "cursor-not-allowed border-neutral-200 bg-neutral-50 placeholder:text-neutral-200"
            : error
              ? "border-error-600 bg-white placeholder:text-neutral-700"
              : "border-neutral-200 bg-white placeholder:text-neutral-700",
          fieldClassName,
        )}
      />

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
