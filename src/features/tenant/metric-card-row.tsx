import { ResponsiveText } from "@/components/ui/responsive-text";
import { StatCard } from "@/components/ui/stat-card";
import { TENANT_METRICS, type MetricTone } from "@/constants/tenant";
import { cn } from "@/lib/cn";

const VALUE_CLASSES: Record<MetricTone, string> = {
  default: "text-neutral-900",
  warning: "text-warning-500",
  brand: "text-brand-700",
};

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
                VALUE_CLASSES[tone],
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
