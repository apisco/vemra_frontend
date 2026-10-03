import type { Metadata } from "next";
import { ApplicationsScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Applications · Vemra" };
export default async function Page({ searchParams }: PageProps<"/landlord/applications">) {
  const { state } = await searchParams;
  return <ApplicationsScreen empty={state === "empty"} />;
}
