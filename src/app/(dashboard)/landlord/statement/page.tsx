import type { Metadata } from "next";
import { StatementScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Statement · Vemra" };
export default function Page() { return <StatementScreen />; }
