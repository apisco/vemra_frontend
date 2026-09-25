import type { ReactNode } from "react";

import { Skeleton } from "@/components/feedback/skeleton";
import { cn } from "@/lib/cn";

export type TrendDirection = "up" | "down" | "flat";

export type StatCardVariant = "elevated" | "outlined";

export interface StatCardTrend {
  direction: TrendDirection;
  label: string;
}

export interface StatCardProps {
  title: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  subtitle?: ReactNode;
  trend?: StatCardTrend;
  variant?: StatCardVariant;
  isLoading?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<StatCardVariant, string> = {
  elevated: "px-6 py-5 shadow-elevation-1",
  outlined: "border border-neutral-200 px-4 py-4 md:px-5 md:py-5",
};

const TREND_CLASSES: Record<TrendDirection, string> = {
  up: "text-success-600",
  down: "text-error-600",
  flat: "text-neutral-700",
};

const TREND_GLYPH: Record<TrendDirection, string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

export function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  variant = "elevated",
  isLoading = false,
  className,
}: StatCardProps) {
  return (
    <article
      aria-busy={isLoading || undefined}
      className={cn(
        "flex w-full flex-col gap-2 rounded-lg bg-white",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-body-sm text-neutral-700">{title}</p>
        {icon && (
          <span
            className="shrink-0 text-brand-700 [&_svg]:size-5"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-8 w-32" />
      ) : (
        <p className="font-display text-heading-lg font-bold text-neutral-900">
          {value}
        </p>
      )}

      {isLoading ? (
        <Skeleton className="h-3 w-20" />
      ) : trend ? (
        <p className={cn("text-label-sm", TREND_CLASSES[trend.direction])}>
          <span aria-hidden="true">{TREND_GLYPH[trend.direction]} </span>
          {trend.label}
        </p>
      ) : (
        subtitle && <p className="text-label-sm text-neutral-700">{subtitle}</p>
      )}
    </article>
  );
}
