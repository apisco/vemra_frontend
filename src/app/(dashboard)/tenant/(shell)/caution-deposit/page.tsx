import type { Metadata } from "next";

import { TenantFlowScreen } from "@/features/tenant/tenant-flow-screens";

export const metadata: Metadata = { title: "Caution deposit · Vemra" };

function firstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

export default async function TenantCautionDepositPage({
  searchParams,
}: PageProps<"/tenant/caution-deposit">) {
  const params = await searchParams;
  return (
    <TenantFlowScreen
      screen="caution-deposit"
      leaseId={firstValue(params.leaseId)}
    />
  );
}
