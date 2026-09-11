"use client";

import { useRef } from "react";

import {
  segmentedSegmentClasses,
  segmentedTrackClasses,
} from "@/components/ui/segmented-control-classes";

export interface SegmentedControlOption<TValue extends string> {
  value: TValue;
  label: string;
}

export interface SegmentedControlProps<TValue extends string> {
  label: string;
  options: readonly SegmentedControlOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  className?: string;
}

export function SegmentedControl<TValue extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<TValue>) {
  const segments = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = options.findIndex((option) => option.value === value);

  const moveSelection = (offset: number) => {
    const nextIndex =
      (selectedIndex + offset + options.length) % options.length;
    onChange(options[nextIndex].value);
    segments.current[nextIndex]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={segmentedTrackClasses({ className })}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            ref={(node) => {
              segments.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                moveSelection(1);
              }
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                moveSelection(-1);
              }
            }}
            className={segmentedSegmentClasses({ isSelected })}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
