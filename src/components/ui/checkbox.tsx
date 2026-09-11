"use client";

import { useEffect, useRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type CheckboxAlign = "center" | "start";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> {
  label: ReactNode;
  hideLabel?: boolean;
  align?: CheckboxAlign;
  indeterminate?: boolean;
  containerClassName?: string;
}

export function Checkbox({
  label,
  hideLabel = false,
  align = "center",
  indeterminate = false,
  containerClassName,
  disabled = false,
  checked,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={cn(
        "inline-flex gap-2",
        align === "start" ? "items-start" : "items-center",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        containerClassName,
      )}
    >
      <span className="relative inline-flex size-5 shrink-0">
        <input
          {...props}
          ref={inputRef}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className={cn(
            "peer size-5 appearance-none rounded-sm border-[1.5px] border-neutral-200 bg-white transition-colors",
            "checked:border-transparent checked:bg-brand-700",
            "indeterminate:border-transparent indeterminate:bg-brand-700",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
            "disabled:cursor-not-allowed disabled:bg-neutral-50",
            "disabled:checked:bg-neutral-200 disabled:indeterminate:bg-neutral-200",
          )}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden items-center justify-center text-label-sm font-semibold text-white peer-checked:flex peer-indeterminate:hidden peer-disabled:text-neutral-700"
        >
          ✓
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden items-center justify-center text-white peer-indeterminate:flex peer-disabled:text-neutral-700"
        >
          <span className="h-0.5 w-2.5 rounded-full bg-current" />
        </span>
      </span>

      <span
        className={cn(
          "text-body-md",
          hideLabel && "sr-only",
          disabled ? "text-neutral-400" : "text-neutral-800",
        )}
      >
        {label}
      </span>
    </label>
  );
}
