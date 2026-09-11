import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface AuthNoteProps {
  icon: ReactNode;
  title: string;
  body: string;
  className?: string;
}

export function AuthNote({ icon, title, body, className }: AuthNoteProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg bg-brand-50 p-4 md:gap-4 md:p-5",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="shrink-0 text-brand-700 [&_svg]:size-5"
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-body-md leading-[20px] font-semibold text-neutral-900">
          {title}
        </p>
        <p className="text-body-sm leading-[18px] text-neutral-700 md:leading-[20px]">
          {body}
        </p>
      </div>
    </div>
  );
}
