import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface RoleCardProps {
  checked: boolean;
  onSelect: () => void;
  name: string;
  value: string;
  icon: ReactNode;
  title: string;
  description: string;
  tag: ReactNode;
}

export function RoleCard({
  checked,
  onSelect,
  name,
  value,
  icon,
  title,
  description,
  tag,
}: RoleCardProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col gap-3 rounded-lg p-4.5 transition-colors md:min-w-0 md:flex-1 md:gap-4 md:p-6 lg:gap-5 lg:p-7",
        checked
          ? "border-2 border-brand-700 bg-brand-950"
          : "border border-neutral-200 bg-white hover:border-brand-700",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-700",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <span className="flex items-center justify-between">
        <span
          aria-hidden="true"
          className={cn(
            "flex shrink-0 items-start rounded-md p-2 md:p-2.5 lg:p-3",
            "[&_svg]:size-5 lg:[&_svg]:size-6",
            checked ? "bg-brand-700 text-white" : "bg-neutral-50 text-neutral-700",
          )}
        >
          {icon}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "size-5 shrink-0 rounded-full border",
            checked
              ? "border-brand-700 bg-brand-700"
              : "border-neutral-200 bg-neutral-50",
          )}
        />
      </span>
      <span className="flex flex-col gap-1.5 lg:gap-2">
        <span
          className={cn(
            "text-body-md leading-[20px] font-semibold md:font-display md:text-heading-sm md:leading-[28px] lg:text-heading-md lg:leading-[30px] lg:font-bold",
            checked ? "text-white" : "text-neutral-900",
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            "text-label-sm leading-[18px] md:text-body-md md:leading-[20px] lg:leading-[22px]",
            checked ? "text-white" : "text-neutral-700",
          )}
        >
          {description}
        </span>
      </span>
      {tag}
    </label>
  );
}
