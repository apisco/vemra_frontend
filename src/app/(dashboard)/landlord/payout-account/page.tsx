import type { Metadata } from "next";
import { PayoutAccountScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Payout account · Vemra" };
export default function Page() { return <PayoutAccountScreen />; }
