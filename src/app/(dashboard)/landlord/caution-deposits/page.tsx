import type { Metadata } from "next";
import { CautionDepositsScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Caution deposits · Vemra" };
export default async function Page({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  return <CautionDepositsScreen empty={state === "empty"} />;
}
