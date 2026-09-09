import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface SectionHeadingProps {
  children: ReactNode;
  subheading?: ReactNode;
  align?: "start" | "center";
  className?: string;
}

export function SectionHeading({
  children,
  subheading,
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 md:gap-3.5 lg:gap-4",
        align === "center" && "lg:mx-auto lg:max-w-200 lg:text-center",
        className,
      )}
    >
      <h2 className="font-display text-[24px] leading-[36px] font-extrabold text-neutral-900 md:text-[30px] md:leading-[45px] lg:text-display-lg lg:leading-[54px]">
        {children}
      </h2>
      {subheading && (
        <p className="text-body-md text-neutral-700 md:text-[16px] md:leading-[28px] lg:text-heading-sm lg:leading-[28px]">
          {subheading}
        </p>
      )}
    </div>
  );
}
