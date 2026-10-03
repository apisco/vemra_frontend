import { LANDLORD_REVENUE_ROLL } from "@/constants/landlord";
import { cn } from "@/lib/cn";

const { title, value, caption, bars } = LANDLORD_REVENUE_ROLL;

export function RevenueRollCard() {
  return (
    <section
      aria-labelledby="revenue-roll-title"
      className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 md:hidden"
    >
      <h2
        id="revenue-roll-title"
        className="font-display text-label-md font-semibold text-neutral-900"
      >
        {title}
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
            {value}
          </p>
          <p className="text-caption text-neutral-700">{caption}</p>
        </div>
      </div>
    </section>
  );
}
