import type { ReactNode } from "react";

import { Skeleton } from "@/components/feedback/skeleton";
import { cn } from "@/lib/cn";

export type TrendDirection = "up" | "down" | "flat";

export interface StatCardTrend {
  direction: TrendDirection;
  /** Reads as the sentence the user sees, e.g. "+12% vs last month". */
  label: string;
}

export interface StatCardProps {
  title: string;
  value: ReactNode;
  icon?: ReactNode;
  subtitle?: string;
  trend?: StatCardTrend;
  isLoading?: boolean;
  className?: string;
}

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
  isLoading = false,
  className,
}: StatCardProps) {
  return (
    <article
      aria-busy={isLoading || undefined}
      className={cn(
        "flex w-full flex-col gap-2 rounded-lg bg-white px-6 py-5 shadow-elevation-1",
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
