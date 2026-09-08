"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type TabsVariant = "underline" | "pill";

export interface TabItem {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  content?: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  variant?: TabsVariant;
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
}

export function Tabs({
  items,
  variant = "underline",
  label,
  value,
  defaultValue,
  onValueChange,
  className,
}: TabsProps) {
  const baseId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const firstEnabled = items.find((item) => !item.disabled)?.id ?? "";
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? firstEnabled);
  const selected = value ?? uncontrolled;

  const hasPanels = items.some((item) => item.content !== undefined);
  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  function select(id: string) {
    if (value === undefined) setUncontrolled(id);
    onValueChange?.(id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const enabled = items.filter((item) => !item.disabled);
    const current = enabled.findIndex((item) => item.id === selected);
    if (current === -1) return;

    let next = current;
    switch (event.key) {
      case "ArrowRight":
        next = (current + 1) % enabled.length;
        break;
      case "ArrowLeft":
        next = (current - 1 + enabled.length) % enabled.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = enabled.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextId = enabled[next].id;
    select(nextId);
    tabRefs.current[nextId]?.focus();
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        role="tablist"
        aria-label={label}
        className={cn(
          "flex items-end overflow-x-auto",
          variant === "pill" && "gap-2",
        )}
      >
        {items.map((item) => {
          const isSelected = item.id === selected;

          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              type="button"
              role="tab"
              id={tabId(item.id)}
              aria-selected={isSelected}
              aria-controls={hasPanels ? panelId(item.id) : undefined}
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.id)}
              onKeyDown={handleKeyDown}
              className={cn(
                "flex shrink-0 flex-col items-center gap-2 px-4 py-2.5 text-label-md whitespace-nowrap transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
                "disabled:cursor-not-allowed disabled:text-neutral-400",
                variant === "pill" && "rounded-full",
                isSelected
                  ? cn(
                      "font-semibold text-brand-700",
                      variant === "pill" && "bg-brand-50",
                    )
                  : cn(
                      "text-neutral-700",
                      variant === "pill"
                        ? "hover:bg-neutral-50"
                        : "hover:text-neutral-800",
                    ),
              )}
            >
              <span>{item.label}</span>
              {variant === "underline" && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 w-full rounded-full",
                    isSelected ? "bg-brand-700" : "bg-transparent",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {hasPanels &&
        items.map((item) => (
          <div
            key={item.id}
            role="tabpanel"
            id={panelId(item.id)}
            aria-labelledby={tabId(item.id)}
            hidden={item.id !== selected}
            tabIndex={0}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            {item.content}
          </div>
        ))}
    </div>
  );
}
