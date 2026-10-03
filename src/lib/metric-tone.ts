import type { MetricTone } from "@/types/dashboard";

export const METRIC_VALUE_CLASSES: Record<MetricTone, string> = {
  default: "text-neutral-900",
  warning: "text-warning-500",
  brand: "text-brand-700",
};
