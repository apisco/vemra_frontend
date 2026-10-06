import type { Metadata } from "next";
import { ApplicationsScreen } from "@/features/landlord/landlord-secondary-screens";
import { getApplicationQueue } from "@/lib/api/resources/landlord";

export const metadata: Metadata = { title: "Applications · Vemra" };
export default async function Page() {
  const queue = await getApplicationQueue();
  return <ApplicationsScreen queue={queue} />;
}
