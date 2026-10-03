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
  disabledValues?: readonly TValue[];
  className?: string;
}

export function SegmentedControl<TValue extends string>({
  label,
  options,
  value,
  onChange,
  disabledValues,
  className,
}: SegmentedControlProps<TValue>) {
  const segments = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const isDisabled = (option: SegmentedControlOption<TValue>) =>
    disabledValues?.includes(option.value) ?? false;
  const firstEnabledIndex = options.findIndex((option) => !isDisabled(option));

  const moveSelection = (offset: number) => {
    let nextIndex = selectedIndex;

    for (let step = 0; step < options.length; step += 1) {
      nextIndex = (nextIndex + offset + options.length) % options.length;
      if (!isDisabled(options[nextIndex])) break;
    }

    if (nextIndex === selectedIndex) return;

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
        const isOptionDisabled = isDisabled(option);

        return (
          <button
            key={option.value}
            ref={(node) => {
              segments.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isOptionDisabled}
            tabIndex={
              isOptionDisabled ||
              (selectedIndex !== index && firstEnabledIndex !== index)
                ? -1
                : 0
            }
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
            className={segmentedSegmentClasses({
              isSelected,
              isDisabled: isOptionDisabled,
            })}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
