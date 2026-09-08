import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type NavItemVariant = "sidebar" | "top" | "mobile";

export interface NavItemProps {
  href: string;
  label: string;
  icon?: ReactNode;
  variant?: NavItemVariant;
  isActive?: boolean;
  isCollapsed?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<NavItemVariant, string> = {
  sidebar: "h-10 w-full gap-2.5 px-3 text-label-md",
  top: "h-10 gap-2.5 px-3 text-label-md",
  mobile: "min-w-0 flex-1 flex-col gap-1 px-2 py-2 text-caption",
};

export function NavItem({
  href,
  label,
  icon,
  variant = "sidebar",
  isActive = false,
  isCollapsed = false,
  className,
}: NavItemProps) {
  const collapsed = isCollapsed && variant === "sidebar";

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center rounded-md transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
        VARIANT_CLASSES[variant],
        isActive
          ? "bg-brand-50 font-semibold text-brand-700"
          : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-800",
        collapsed && "w-10 justify-center px-0",
        variant === "mobile" && "justify-center",
        className,
      )}
    >
      {icon && (
        <span className="shrink-0 [&_svg]:size-5" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={cn(collapsed && "sr-only")}>{label}</span>
    </Link>
  );
}
