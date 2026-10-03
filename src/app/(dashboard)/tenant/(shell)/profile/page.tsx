import type { Metadata } from "next";
import { TenantFlowScreen } from "@/features/tenant/tenant-flow-screens";

export const metadata: Metadata = { title: "Profile · Vemra" };
export default function TenantProfilePage() { return <TenantFlowScreen screen="profile" />; }
