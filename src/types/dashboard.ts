import type { ComponentType } from "react";

import type { IconProps } from "@/components/icons/icon-props";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
}

export interface DashboardUser {
  name: string;
  role: string;
  initials: string;
}

export type MetricTone = "default" | "warning" | "brand";
