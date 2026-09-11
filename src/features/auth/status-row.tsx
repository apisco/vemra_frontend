import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface StatusRowProps {
  leading?: ReactNode;
  title: string;
  description?: string;
  detail?: string;
  trailing?: ReactNode;
  className?: string;
}

export function StatusRow({
  leading,
  title,
  description,
  detail,
  trailing,
  className,
}: StatusRowProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-3 md:gap-4">
        {leading ? <span className="shrink-0">{leading}</span> : null}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-body-md leading-[20px] font-semibold text-neutral-900">
            {title}
          </p>
          {description ? (
            <p className="text-body-sm leading-[16px] text-neutral-700 md:leading-[20px]">
              {description}
            </p>
          ) : null}
        </div>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
      {detail ? (
        <p className="text-body-sm leading-[18px] text-neutral-700 md:text-body-md md:leading-[20px]">
          {detail}
        </p>
      ) : null}
    </div>
  );
}
