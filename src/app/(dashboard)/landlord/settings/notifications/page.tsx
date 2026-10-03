import type { Metadata } from "next";
import { NotificationPreferencesScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Notification preferences · Vemra" };
export default function Page() { return <NotificationPreferencesScreen />; }
