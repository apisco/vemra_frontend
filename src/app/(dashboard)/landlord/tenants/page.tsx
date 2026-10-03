import type { Metadata } from "next";
import { ApplicationsScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Applications · Vemra" };
export default function Page() {
  return <ApplicationsScreen />;
}
