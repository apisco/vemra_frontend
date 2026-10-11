import type { Metadata } from "next";

import { TenantDecisionScreen } from "@/features/tenant/tenant-application-screen";

export const metadata: Metadata = { title: "Deposit decision · Vemra" };

function firstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

export default async function TenantDepositDecisionPage({
  searchParams,
}: PageProps<"/tenant/deposit-decision">) {
  const params = await searchParams;
  return <TenantDecisionScreen leaseId={firstValue(params.leaseId)} />;
}
