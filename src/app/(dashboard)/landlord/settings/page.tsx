import type { Metadata } from "next";
import { SettingsScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Settings · Vemra" };
export default function Page() { return <SettingsScreen />; }
