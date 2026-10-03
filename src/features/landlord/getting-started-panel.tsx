import { LANDLORD_DASHBOARD_EMPTY } from "@/constants/landlord";
import { cn } from "@/lib/cn";

const { checklist } = LANDLORD_DASHBOARD_EMPTY;

export function GettingStartedPanel() {
  return (
    <section
      aria-labelledby="getting-started-title"
      className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 md:hidden"
    >
      <h2
        id="getting-started-title"
        className="font-display text-heading-sm font-semibold text-neutral-900"
      >
        {checklist.title}
      </h2>

      <ol className="flex flex-col gap-2.5">
        {checklist.steps.map((step, index) => (
          <li
            key={step.title}
            className={cn(
              "flex items-center gap-3 rounded-md p-3",
              step.isCurrent ? "bg-success-50" : "bg-neutral-50",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-caption font-bold",
                step.isCurrent
                  ? "bg-brand-700 text-white"
                  : "bg-neutral-200 text-neutral-700",
              )}
            >
              {index + 1}
            </span>

            <div className="min-w-0">
              <p className="text-label-sm font-semibold text-neutral-900">
                {step.title}
              </p>
              <p className="text-caption text-neutral-700">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
