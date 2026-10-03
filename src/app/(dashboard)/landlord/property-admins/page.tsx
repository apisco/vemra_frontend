import type { Metadata } from "next";
import { PropertyAdminInviteScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Property Admin invite · Vemra" };
export default function Page() { return <PropertyAdminInviteScreen />; }
