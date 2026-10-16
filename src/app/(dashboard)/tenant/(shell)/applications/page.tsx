import type { Metadata } from "next";

import { TenantApplicationScreen } from "@/features/tenant/tenant-application-screen";

export const metadata: Metadata = { title: "Applications · Vemra" };

export default function TenantApplicationsPage() {
  return <TenantApplicationScreen />;
}
