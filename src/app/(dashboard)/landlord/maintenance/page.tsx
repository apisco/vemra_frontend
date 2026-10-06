import type { Metadata } from "next";
import { MaintenanceScreen } from "@/features/landlord/landlord-secondary-screens";
import { getMaintenanceOverview } from "@/lib/api/resources/landlord";

export const metadata: Metadata = { title: "Maintenance · Vemra" };
export default async function Page() {
  const overview = await getMaintenanceOverview();
  return <MaintenanceScreen overview={overview} />;
}
