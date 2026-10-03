import { ResponsiveText } from "@/components/ui/responsive-text";
import { StatCard } from "@/components/ui/stat-card";
import { TENANT_METRICS } from "@/constants/tenant";
import { cn } from "@/lib/cn";
import { METRIC_VALUE_CLASSES } from "@/lib/metric-tone";

export function MetricCardRow() {
  return (
    <div className="grid gap-3 md:grid-cols-3 md:gap-4 lg:gap-5">
      {TENANT_METRICS.map(({ label, value, detail, tone }) => (
        <StatCard
          key={value}
          title={<ResponsiveText copy={label} />}
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
          subtitle={<ResponsiveText copy={detail} />}
          variant="outlined"
        />
      ))}
    </div>
  );
}
