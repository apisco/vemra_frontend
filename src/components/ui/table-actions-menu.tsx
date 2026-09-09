"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface TableAction {
  id: string;
  label: string;
  onSelect: () => void;
  isDestructive?: boolean;
  disabled?: boolean;
}

export interface TableActionsMenuProps {
  actions: TableAction[];
  label: string;
  icon?: ReactNode;
  className?: string;
}

export function TableActionsMenu({
  actions,
  label,
  icon,
  className,
}: TableActionsMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [rect, setRect] = useState<{ top: number; right: number } | null>(null);
  const isOpen = rect !== null;

  const close = useCallback((returnFocus = true) => {
    setRect(null);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const open = useCallback(() => {
    const bounds = triggerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setRect({
      top: Math.round(bounds.bottom + 4),
      right: Math.round(window.innerWidth - bounds.right),
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    itemRefs.current.find((node) => node && !node.disabled)?.focus();

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        close(false);
      }
    }
    function onDismiss() {
      close(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onDismiss);
    window.addEventListener("scroll", onDismiss, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onDismiss);
      window.removeEventListener("scroll", onDismiss, true);
    };
  }, [isOpen, close]);

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      open();
    }
  }

  function moveFocus(from: number, step: number) {
    const nodes = itemRefs.current;
    if (nodes.length === 0) return;

    for (let offset = 1; offset <= nodes.length; offset += 1) {
      const raw = from + step * offset;
      const index = ((raw % nodes.length) + nodes.length) % nodes.length;
      const node = nodes[index];
      if (node && !node.disabled) {
        node.focus();
        return;
      }
    }
  }

  function handleMenuKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "ArrowDown":
        event.preventDefault();
        moveFocus(index, 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveFocus(index, -1);
        break;
      case "Home":
        event.preventDefault();
        moveFocus(-1, 1);
        break;
      case "End":
        event.preventDefault();
        moveFocus(0, -1);
        break;
      case "Tab":
        close(false);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-md text-body-md text-neutral-700 transition-colors",
          "hover:bg-neutral-100 hover:text-neutral-900",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
          isOpen && "bg-neutral-100 text-neutral-900",
          className,
        )}
      >
        {icon ?? <span aria-hidden="true">⋯</span>}
      </button>

      {rect && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={label}
          style={{ top: rect.top, right: rect.right }}
          className="fixed z-50 min-w-44 rounded-md border border-neutral-200 bg-white py-1 shadow-elevation-1"
        >
          {actions.map((action, index) => (
            <button
              key={action.id}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={action.disabled}
              onClick={() => {
                action.onSelect();
                close();
              }}
              onKeyDown={(event) => handleMenuKeyDown(event, index)}
              className={cn(
                "block w-full px-3 py-2 text-left text-body-sm transition-colors",
                "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-700",
                "disabled:cursor-not-allowed disabled:text-neutral-400 disabled:hover:bg-transparent",
                action.isDestructive
                  ? "text-error-600 hover:bg-error-50"
                  : "text-neutral-800 hover:bg-neutral-50",
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
