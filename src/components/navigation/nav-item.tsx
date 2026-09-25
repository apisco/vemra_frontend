import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type NavItemVariant = "sidebar" | "top" | "mobile";

export type NavItemTone = "light" | "dark";

export interface NavItemProps {
  href: string;
  label: string;
  icon?: ReactNode;
  variant?: NavItemVariant;
  tone?: NavItemTone;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  className?: string;
}

const VARIANT_CLASSES: Record<NavItemVariant, string> = {
  sidebar: "h-10 w-full gap-2.5 px-3 text-label-md",
  top: "h-10 gap-2.5 px-3 text-label-md",
  mobile: "min-w-0 flex-1 flex-col gap-1 px-2 py-2 text-caption",
};

const INACTIVE_CLASSES: Record<NavItemTone, string> = {
  light: "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-800",
  dark: "text-white hover:bg-white/10",
};

const FOCUS_CLASSES: Record<NavItemTone, string> = {
  light: "focus-visible:outline-brand-700",
  dark: "focus-visible:outline-white",
};

export interface NavItemClassOptions {
  variant?: NavItemVariant;
  tone?: NavItemTone;
  isActive?: boolean;
  isCollapsed?: boolean;
  className?: string;
}

export function navItemClasses({
  variant = "sidebar",
  tone = "light",
  isActive = false,
  isCollapsed = false,
  className,
}: NavItemClassOptions = {}) {
  const collapsed = isCollapsed && variant === "sidebar";

  return cn(
    "relative flex items-center rounded-md transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    FOCUS_CLASSES[tone],
    VARIANT_CLASSES[variant],
    isActive
      ? "bg-brand-50 font-semibold text-brand-700"
      : INACTIVE_CLASSES[tone],
    tone === "dark" && variant === "sidebar" && isActive && !collapsed && "pl-7",
    collapsed && "w-10 justify-center px-0",
    variant === "mobile" && "justify-center",
    className,
  );
}

export function NavItem({
  href,
  label,
  icon,
  variant = "sidebar",
  tone = "light",
  isActive = false,
  isCollapsed = false,
  onClick,
  className,
}: NavItemProps) {
  const collapsed = isCollapsed && variant === "sidebar";
  const showAccent =
    tone === "dark" && variant === "sidebar" && isActive && !collapsed;

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={navItemClasses({
        variant,
        tone,
        isActive,
        isCollapsed,
        className,
      })}
    >
      {showAccent && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-3 h-6 w-1 -translate-y-1/2 rounded-sm bg-brand-600"
        />
      )}
      {icon && (
        <span className="shrink-0 [&_svg]:size-5" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={cn(collapsed && "sr-only")}>{label}</span>
    </Link>
  );
}
