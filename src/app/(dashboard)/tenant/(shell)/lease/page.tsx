import type { Metadata } from "next";

import { TenantLeaseScreen } from "@/features/tenant/tenant-application-screen";

export const metadata: Metadata = { title: "Lease · Vemra" };

function firstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

export default async function TenantLeasePage({
  searchParams,
}: PageProps<"/tenant/lease">) {
  const params = await searchParams;
  return <TenantLeaseScreen leaseId={firstValue(params.leaseId)} />;
}
