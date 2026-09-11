import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type AuthHeaderAlign = "responsive" | "center" | "start";

export type AuthHeaderVariant = "form" | "compact" | "status" | "display";

const ALIGN_CLASSES: Record<AuthHeaderAlign, string> = {
  responsive: "items-center text-center md:items-start md:text-left",
  center: "items-center text-center",
  start: "items-start text-left",
};

const WRAPPER_CLASSES: Record<AuthHeaderVariant, string> = {
  form: "gap-1.5 lg:gap-2",
  compact: "gap-2",
  status: "gap-4 lg:gap-5",
  display: "gap-2",
};

const TITLE_CLASSES: Record<AuthHeaderVariant, string> = {
  form: "text-heading-md leading-[30px] md:text-heading-lg md:leading-[36px]",
  compact: "text-heading-md leading-[30px]",
  status: "text-heading-md leading-[30px]",
  display: "text-heading-md leading-[30px] md:text-heading-xl md:leading-[40px]",
};

const DESCRIPTION_CLASSES: Record<AuthHeaderVariant, string> = {
  form: "leading-[20px] md:leading-[22px]",
  compact: "leading-[20px] md:leading-[22px]",
  status: "leading-[22px]",
  display: "leading-[20px] md:leading-[22px]",
};

export interface AuthHeaderProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  align?: AuthHeaderAlign;
  variant?: AuthHeaderVariant;
  className?: string;
}

export function AuthHeader({
  title,
  description,
  icon,
  align = "responsive",
  variant = "form",
  className,
}: AuthHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        WRAPPER_CLASSES[variant],
        ALIGN_CLASSES[align],
        className,
      )}
    >
      {icon}
      <h1
        className={cn(
          "font-display font-bold text-neutral-900",
          TITLE_CLASSES[variant],
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "text-body-md text-neutral-700",
            DESCRIPTION_CLASSES[variant],
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
