import type { Metadata } from "next";

import { DashboardHeader } from "@/features/landlord/dashboard-header";
import { EmptyDashboard } from "@/features/landlord/empty-dashboard";
import { PropertiesOverviewTable } from "@/features/landlord/properties-overview-table";
import { PropertyAdminCard } from "@/features/landlord/property-admin-card";
import { PropertyAdminsWidget } from "@/features/landlord/property-admins-widget";
import { RevenueRollCard } from "@/features/landlord/revenue-roll-card";
import { StatCardGrid } from "@/features/landlord/stat-card-grid";
import { WithdrawWidget } from "@/features/landlord/withdraw-widget";

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

  return (
    <div className="flex flex-col gap-5 md:gap-8">
      <DashboardHeader />

      <StatCardGrid />

      <RevenueRollCard />

      <PropertyAdminCard />

      <div className="hidden md:grid md:gap-6 lg:grid-cols-[678fr_378fr]">
        <PropertiesOverviewTable />

        <div className="hidden flex-col gap-6 lg:flex">
          <WithdrawWidget />
          <PropertyAdminsWidget />
        </div>
      </div>
    </div>
  );
}
