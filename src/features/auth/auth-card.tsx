import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type AuthCardVariant =
  | "split"
  | "prompt"
  | "form"
  | "status"
  | "details"
  | "checklist"
  | "review";

const VARIANT_CLASSES: Record<AuthCardVariant, string> = {
  split:
    "p-6 md:p-8 lg:p-10 gap-6 lg:gap-7 shadow-elevation-2 md:shadow-elevation-3",
  prompt:
    "p-7 md:p-10 lg:p-8 gap-6 md:gap-7 lg:gap-6 shadow-elevation-2 md:shadow-elevation-3",
  form: "p-7 md:p-10 gap-6 md:gap-7 shadow-elevation-2 md:shadow-elevation-3",
  status: "p-6 md:p-10 lg:p-12 gap-7 md:gap-8 shadow-elevation-3",
  details:
    "p-4 md:p-8 gap-4 md:gap-6 lg:gap-5 shadow-elevation-2 md:shadow-elevation-3",
  checklist:
    "p-4.5 md:p-8 lg:p-7 gap-4 md:gap-6 shadow-elevation-2 md:shadow-elevation-3",
  review: "p-4.5 md:p-7 lg:p-6 shadow-elevation-2 md:shadow-elevation-3",
};

export interface AuthCardProps {
  variant?: AuthCardVariant;
  className?: string;
  children: ReactNode;
}

export function AuthCard({
  variant = "split",
  className,
  children,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-lg border border-neutral-200 bg-white",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
