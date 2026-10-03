import { ResponsiveText } from "@/components/ui/responsive-text";
import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/cn";
import { METRIC_VALUE_CLASSES } from "@/lib/metric-tone";
import { formatCount, formatDate, formatMoney, formatRatio } from "@/lib/format";
import type { LandlordDashboard } from "@/types/api/landlord";

export function StatCardGrid({ dashboard }: { dashboard: LandlordDashboard }) {
  const occupiedDetail = dashboard.vacantSince && dashboard.vacantUnitName
    ? `${dashboard.vacantUnitName} vacant since ${formatDate(dashboard.vacantSince, "short")}`
    : dashboard.vacantCount > 0
      ? `${formatCount(dashboard.vacantCount)} vacant unit${dashboard.vacantCount === 1 ? "" : "s"}`
      : "All units occupied";
  const nextRentDetail = dashboard.nextRentDue
    ? dashboard.nextRentDue.unitName
    : "No upcoming rent due";
  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-5">
      <StatCard
        title="Occupied units"
        value={
          <span className={cn("text-heading-md md:text-heading-lg", METRIC_VALUE_CLASSES.default)}>
            {formatRatio(dashboard.occupiedCount, dashboard.propertyCount)}
          </span>
        }
        subtitle={<ResponsiveText copy={{ base: occupiedDetail }} />}
        variant="outlined"
      />
      <StatCard
        title="Ready to withdraw"
        value={
          <span className={cn("text-heading-md md:text-heading-lg", METRIC_VALUE_CLASSES.brand)}>
            {formatMoney(dashboard.readyToWithdraw)}
          </span>
        }
        subtitle={<ResponsiveText copy={{ base: `${dashboard.clearedPaymentCount} cleared payment${dashboard.clearedPaymentCount === 1 ? "" : "s"}` }} />}
        variant="outlined"
      />
      <StatCard
        title="Next rent due"
        value={
          <span className={cn("text-heading-md md:text-heading-lg", METRIC_VALUE_CLASSES.warning)}>
            {dashboard.nextRentDue ? formatDate(dashboard.nextRentDue.dueDate, "short") : "—"}
          </span>
        }
        subtitle={<ResponsiveText copy={{ base: nextRentDetail }} />}
        variant="outlined"
      />
      <StatCard
        title="Monthly rent roll"
        value={
          <span className={cn("text-heading-md md:text-heading-lg", METRIC_VALUE_CLASSES.default)}>
            {formatMoney(dashboard.monthlyRentRoll)}
          </span>
        }
        subtitle={<ResponsiveText copy={{ base: `Across ${formatCount(dashboard.propertyCount)} properties` }} />}
        variant="outlined"
        className="max-md:hidden"
      />
    </div>
  );
}
