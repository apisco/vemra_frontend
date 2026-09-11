"use client";

import { useId, useRef } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";

import { cn } from "@/lib/cn";

export interface OtpInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  length?: number;
  name?: string;
  error?: string;
  disabled?: boolean;
  containerClassName?: string;
}

export function OtpInput({
  label,
  value,
  onChange,
  length = 6,
  name,
  error,
  disabled = false,
  containerClassName,
}: OtpInputProps) {
  const boxes = useRef<Array<HTMLInputElement | null>>([]);
  const groupId = useId();
  const labelId = `${groupId}-label`;
  const errorId = `${groupId}-error`;

  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  const focusBox = (index: number) => {
    const target = boxes.current[Math.max(0, Math.min(length - 1, index))];
    target?.focus();
    target?.select();
  };

  const commit = (next: string[]) => {
    onChange(next.join("").slice(0, length));
  };

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    commit(next);
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);
    if (digit && index < length - 1) {
      focusBox(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      setDigit(index - 1, "");
      focusBox(index - 1);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length - index);
    if (!pasted) {
      return;
    }
    event.preventDefault();
    const next = digits.slice();
    for (let offset = 0; offset < pasted.length; offset += 1) {
      next[index + offset] = pasted[offset];
    }
    commit(next);
    focusBox(index + pasted.length);
  };

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={cn(
        "flex w-full flex-col gap-2 md:gap-3 lg:gap-2",
        containerClassName,
      )}
    >
      <span
        id={labelId}
        className={cn(
          "text-label-md leading-[20px] font-semibold",
          disabled ? "text-neutral-700" : "text-neutral-800",
        )}
      >
        {label}
      </span>

      <div className="flex gap-1.5 md:gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              boxes.current[index] = node;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            name={name ? `${name}-${index + 1}` : undefined}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            disabled={disabled}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            className={cn(
              "h-12 min-w-0 flex-1 rounded-md border text-center font-display text-heading-md leading-[30px] font-semibold text-neutral-900 transition-colors outline-none md:h-[54px]",
              "focus:border-brand-700 focus:outline-1 focus:outline-brand-700",
              disabled
                ? "cursor-not-allowed border-neutral-200 bg-neutral-50"
                : error
                  ? "border-error-600 bg-white"
                  : "border-neutral-200 bg-white",
            )}
          />
        ))}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-label-sm text-error-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
