import type { Metadata } from "next";

import { DashboardHeader } from "@/features/landlord/dashboard-header";
import { EmptyDashboard } from "@/features/landlord/empty-dashboard";
import { PropertiesOverviewTable } from "@/features/landlord/properties-overview-table";
import { RevenueRollCard } from "@/features/landlord/revenue-roll-card";
import { StatCardGrid } from "@/features/landlord/stat-card-grid";
import { WithdrawWidget } from "@/features/landlord/withdraw-widget";
import {
  getLandlordDashboard,
  getLandlordProperties,
} from "@/lib/api/resources/landlord";

export const metadata: Metadata = {
  title: "Overview · Vemra",
  description: "Occupancy, payouts and property performance at a glance.",
};

export default async function LandlordOverviewPage({
  searchParams,
}: PageProps<"/landlord">) {
  const { state } = await searchParams;

  if (state === "empty") {
    return <EmptyDashboard />;
  }

  const [dashboard, properties] = await Promise.all([
    getLandlordDashboard(),
    getLandlordProperties(),
  ]);

  return (
    <div className="flex flex-col gap-5 md:gap-8">
      <DashboardHeader dashboard={dashboard} />

      <StatCardGrid dashboard={dashboard} />

      <RevenueRollCard dashboard={dashboard} />

      <div className="hidden md:grid md:gap-6 lg:grid-cols-[678fr_378fr]">
        <PropertiesOverviewTable properties={properties} />

        <div className="hidden flex-col gap-6 lg:flex">
          <WithdrawWidget dashboard={dashboard} />
        </div>
      </div>
    </div>
  );
}
