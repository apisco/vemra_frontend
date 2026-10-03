import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/cn";
import { formatDate, formatMoney, formatRatio } from "@/lib/format";
import { METRIC_VALUE_CLASSES } from "@/lib/metric-tone";
import type { TenantDashboard } from "@/types/api/tenant";

export function MetricCardRow({ dashboard }: { dashboard: TenantDashboard }) {
  const metrics = [
    ["Rent due", dashboard.rentDue ? formatDate(dashboard.rentDue.dueDate, "short") : "—", "Next rent due", "warning"],
    ["Next payment", formatMoney(dashboard.nextPayment?.amount), dashboard.nextPayment?.allowsInstallments ? "Full month or installment" : "Full month", "default"],
    ["Payment plan", dashboard.planProgress ? `${formatMoney(dashboard.planProgress.paidAmount)} of ${formatMoney(dashboard.planProgress.totalAmount)}` : "—", dashboard.planProgress ? `${formatRatio(dashboard.planProgress.paidInstallments, dashboard.planProgress.totalInstallments)} installments paid` : "No active plan", "brand"],
  ] as const;
  return (
    <div className="grid gap-3 md:grid-cols-3 md:gap-4 lg:gap-5">
      {metrics.map(([label, value, detail, tone]) => (
        <StatCard
          key={label}
          title={label}
          value={
            <span
              className={cn(
                "text-heading-md md:text-heading-lg",
                METRIC_VALUE_CLASSES[tone],
              )}
            >
              {value}
            </span>
          }
          subtitle={detail}
          variant="outlined"
        />
      ))}
    </div>
  );
}
