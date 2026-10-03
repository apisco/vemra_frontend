import type { Metadata } from "next";
import { RoleMarketingScreen } from "@/features/marketing/public-marketing-screens";
export const metadata: Metadata = { title: "For landlords · Vemra" };
export default function Page() { return <RoleMarketingScreen role="landlord" />; }
