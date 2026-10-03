import { ResponsiveText } from "@/components/ui/responsive-text";
import { StatCard } from "@/components/ui/stat-card";
import { LANDLORD_METRICS } from "@/constants/landlord";
import { cn } from "@/lib/cn";
import { METRIC_VALUE_CLASSES } from "@/lib/metric-tone";

export function StatCardGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-5">
      {LANDLORD_METRICS.map(
        ({ label, value, detail, tone, isCompactHidden }) => (
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
            subtitle={<ResponsiveText copy={detail} />}
            variant="outlined"
            className={cn(isCompactHidden && "max-md:hidden")}
          />
        ),
      )}
    </div>
  );
}
