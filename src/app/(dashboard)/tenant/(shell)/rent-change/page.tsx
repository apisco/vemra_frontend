import type { Metadata } from "next";

import { TenantRentChangeScreen } from "@/features/tenant/tenant-flow-screens";

export const metadata: Metadata = { title: "Rent change · Vemra" };

export default function TenantRentChangePage() {
  return <TenantRentChangeScreen />;
}
