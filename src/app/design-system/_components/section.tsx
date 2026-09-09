import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function Section({
  id,
  title,
  figma,
  description,
  children,
}: {
  id: string;
  title: string;
  figma: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="flex scroll-mt-6 flex-col gap-5 rounded-lg bg-white p-6 shadow-elevation-1"
    >
      <header className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="font-display text-heading-md font-bold text-neutral-900">
            {title}
          </h2>
          <span className="text-caption text-neutral-400">{figma}</span>
        </div>
        {description && (
          <p className="max-w-2xl text-body-sm text-neutral-700">
            {description}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}

export function Row({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4">
      <p className="text-label-sm font-semibold text-neutral-700">{label}</p>
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        {children}
      </div>
    </div>
  );
}

export function PlaceholderIcon() {
  return (
    <span
      aria-hidden="true"
      className="block size-5 rounded-sm bg-current opacity-40"
    />
  );
}
