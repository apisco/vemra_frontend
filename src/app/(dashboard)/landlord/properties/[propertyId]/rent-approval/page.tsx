import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LANDLORD_ROUTES } from "@/constants/landlord";
import { UnsupportedPanel } from "@/features/errors/unsupported-panel";
import { Screen } from "@/features/landlord/landlord-secondary-screens";
import { UNSUPPORTED } from "@/lib/api/capabilities";
import { getLandlordProperty } from "@/lib/api/resources/landlord";
import { isUuid } from "@/lib/validation";

export const metadata: Metadata = { title: "Rent change · Vemra" };

export default async function RentApprovalPage({
  params,
}: PageProps<"/landlord/properties/[propertyId]/rent-approval">) {
  const { propertyId } = await params;

  if (!isUuid(propertyId)) {
    notFound();
  }

  const property = await getLandlordProperty(propertyId);

  if (property === null) {
    notFound();
  }

  return (
    <Screen
      title="Rent change"
      description="Rent changes are proposed and approved inside Vemra."
    >
      <nav aria-label="Breadcrumb" className="text-label-sm text-neutral-700">
        <Link href={LANDLORD_ROUTES.properties} className="hover:underline">
          Properties
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`${LANDLORD_ROUTES.properties}/${propertyId}`}
          className="hover:underline"
        >
          {property.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-brand-700">Rent change</span>
      </nav>

      <UnsupportedPanel capability={UNSUPPORTED.landlordRentApproval} />
    </Screen>
  );
}
