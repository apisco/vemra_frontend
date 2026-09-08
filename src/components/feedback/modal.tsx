"use client";

import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: ModalSize;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-100",
  md: "max-w-120",
  lg: "max-w-160",
};

export function Modal({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  footer,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-0 h-full max-h-full w-full max-w-full bg-transparent p-4 backdrop:bg-neutral-900/50"
    >
      <div className="flex h-full items-center justify-center">
        <div
          className={cn(
            "flex max-h-full w-full flex-col rounded-xl bg-white shadow-elevation-2",
            SIZE_CLASSES[size],
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
            <h2
              id={titleId}
              className="font-display text-heading-md font-bold text-neutral-900"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-body-md text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="overflow-y-auto px-6 pb-6 text-body-md text-neutral-800">
            {children}
          </div>

          {footer && (
            <div className="flex flex-wrap justify-end gap-3 border-t border-neutral-100 px-6 pt-4 pb-5">
              {footer}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
