import type { Metadata } from "next";
import { MaintenanceScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Maintenance · Vemra" };
export default async function Page({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  return <MaintenanceScreen empty={state === "empty"} />;
}
