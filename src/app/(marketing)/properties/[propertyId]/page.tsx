import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ListingDetailScreen } from "@/features/marketing/public-marketing-screens";
import { getListing } from "@/lib/api/resources/public";
import { isUuid } from "@/lib/validation";

export async function generateMetadata({
  params,
}: PageProps<"/properties/[propertyId]">): Promise<Metadata> {
  const { propertyId } = await params;

  if (!isUuid(propertyId)) {
    return { title: "Listing · Vemra" };
  }

  const listing = await getListing(propertyId);
  return { title: listing ? `${listing.title} · Vemra` : "Listing · Vemra" };
}

export default async function PropertyDetailPage({
  params,
}: PageProps<"/properties/[propertyId]">) {
  const { propertyId } = await params;

  if (!isUuid(propertyId)) {
    notFound();
  }

  return <ListingDetailScreen listingId={propertyId} />;
}
