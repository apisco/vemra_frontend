import type { Metadata } from "next";

import { TenantApplicationScreen } from "@/features/tenant/tenant-application-screen";
import { isUuid } from "@/lib/validation";

export const metadata: Metadata = { title: "Applications · Vemra" };

export default async function TenantApplyPage({
  searchParams,
}: PageProps<"/tenant/apply">) {
  const { propertyId } = await searchParams;

  // The apply form needs a property to attach documents to. Bad or missing ids
  // fall back to the applications list rather than a half-rendered form.
  const selected =
    typeof propertyId === "string" && isUuid(propertyId) ? propertyId : null;

  return <TenantApplicationScreen propertyId={selected} />;
}
