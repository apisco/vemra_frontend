import type { Metadata } from "next";
import { RoleMarketingScreen } from "@/features/marketing/public-marketing-screens";
export const metadata: Metadata = { title: "List your property · Vemra" };
export default function Page() { return <RoleMarketingScreen role="landlord" />; }
