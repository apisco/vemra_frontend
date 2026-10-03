import Link from "next/link";

import { HouseIcon } from "@/components/icons/house-icon";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveText } from "@/components/ui/responsive-text";
import { LANDLORD_DASHBOARD_EMPTY } from "@/constants/landlord";
import { GettingStartedPanel } from "@/features/landlord/getting-started-panel";

const { greeting, summary, emptyState } = LANDLORD_DASHBOARD_EMPTY;

export function EmptyDashboard() {
  return (
    <div className="flex flex-col gap-5 md:gap-10">
      <div className="flex flex-col gap-1 md:gap-2">
        <h1 className="font-display text-heading-lg font-bold text-neutral-900 md:text-heading-xl">
          <ResponsiveText copy={greeting} />
        </h1>
        <p className="text-body-sm text-neutral-700 md:text-body-lg">
          <ResponsiveText copy={summary} />
        </p>
      </div>

      <EmptyState
        headingId="landlord-empty-title"
        icon={<HouseIcon />}
        title={emptyState.title}
        description={<ResponsiveText copy={emptyState.description} />}
        action={
          <Link
            href={emptyState.action.href}
            className={buttonClasses({
              size: "sm",
              fullWidth: true,
              className: "md:h-11 md:w-auto md:px-6",
            })}
          >
            {emptyState.action.label}
          </Link>
        }
        className="md:min-h-95 md:justify-center"
      />

      <GettingStartedPanel />
    </div>
  );
}
