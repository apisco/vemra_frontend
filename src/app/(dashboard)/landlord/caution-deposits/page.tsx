import type { Metadata } from "next";
import { CautionDepositsScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Caution deposits · Vemra" };
export default function Page() { return <CautionDepositsScreen />; }
