import type { Metadata } from "next";
import { SettingsScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Profile · Vemra" };
export default function LandlordProfilePage() { return <SettingsScreen />; }
