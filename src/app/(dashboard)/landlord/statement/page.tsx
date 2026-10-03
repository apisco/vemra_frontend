import type { Metadata } from "next";
import { StatementScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Statement · Vemra" };
export default async function Page({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  return <StatementScreen empty={state === "empty"} />;
}
