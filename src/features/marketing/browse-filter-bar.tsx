import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { BROWSE_FILTERS, BROWSE_PAGE } from "@/constants/marketing";
import { cn } from "@/lib/cn";

export function BrowseFilterBar() {
  return (
    <div className="md:rounded-lg md:border md:border-neutral-200 md:bg-white md:p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
          {BROWSE_FILTERS.map(({ label, short, hasChevron, showOnMobile }, index) => {
            const isActive = index === 0;

            return (
              <li
                key={label}
                className={cn("shrink-0", !showOnMobile && "hidden md:block")}
              >
                <button
                  type="button"
                  aria-pressed={isActive}
                  className={cn(
                    "inline-flex h-7 items-center gap-2 rounded-full px-3 text-label-sm font-semibold whitespace-nowrap transition-colors md:h-9 md:px-4",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
                    isActive
                      ? "bg-brand-700 text-white hover:bg-brand-800"
                      : "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50",
                  )}
                >
                  <span className="md:hidden">{short}</span>
                  <span className="hidden md:inline">{label}</span>
                  {hasChevron && (
                    <ChevronDownIcon
                      className={cn(
                        "size-2.5 shrink-0 md:hidden lg:block",
                        isActive ? "text-white" : "text-neutral-700",
                      )}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <p className="hidden text-body-md text-neutral-700 md:block">
          {BROWSE_PAGE.resultCount}
        </p>
      </div>
    </div>
  );
}
