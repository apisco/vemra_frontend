import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import type { LandlordDashboard } from "@/types/api/landlord";

type BarHeightClass = "h-7.5" | "h-10" | "h-8.75" | "h-12.5" | "h-13.75";
const TITLE = "Monthly revenue roll";
const CAPTION = "Expected total";

function barHeightClass(ratio: number): BarHeightClass {
  if (ratio >= 0.9) return "h-13.75";
  if (ratio >= 0.75) return "h-12.5";
  if (ratio >= 0.6) return "h-10";
  if (ratio >= 0.45) return "h-8.75";
  return "h-7.5";
}

export function RevenueRollCard({ dashboard }: { dashboard: LandlordDashboard }) {
  const maxValue = Math.max(
    ...dashboard.revenueSeries.map((point) => point.amount.amount),
    1,
  );
  const bars = dashboard.revenueSeries.map((point) => ({
    heightClass: barHeightClass(point.amount.amount / maxValue),
    isHighlighted: point.amount.amount === dashboard.monthlyRentRoll.amount,
  }));
  return (
    <section
      aria-labelledby="revenue-roll-title"
      className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 md:hidden"
    >
      <h2
        id="revenue-roll-title"
        className="font-display text-label-md font-semibold text-neutral-900"
      >
        {TITLE}
      </h2>

      <div className="flex items-center justify-between gap-4">
        <div className="flex h-15 items-end gap-6" aria-hidden="true">
          {bars.map(({ heightClass, isHighlighted }, index) => (
            <span
              key={index}
              className={cn(
                "w-6.5 rounded-sm",
                heightClass,
                isHighlighted ? "bg-brand-700" : "bg-neutral-200",
              )}
            />
          ))}
        </div>

        <div className="text-right">
          <p className="font-display text-heading-md font-bold text-neutral-900">
            {formatMoney(dashboard.monthlyRentRoll)}
          </p>
          <p className="text-caption text-neutral-700">{CAPTION}</p>
        </div>
      </div>
    </section>
  );
}
