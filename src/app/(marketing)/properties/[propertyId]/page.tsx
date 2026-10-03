import type { Metadata } from "next";

import { ListingDetailScreen } from "@/features/marketing/public-marketing-screens";
import { getListing } from "@/lib/api/resources/public";

export async function generateMetadata({
  params,
}: PageProps<"/properties/[propertyId]">): Promise<Metadata> {
  const { propertyId } = await params;
  const listing = await getListing(propertyId);
  return { title: listing ? `${listing.title} · Vemra` : "Listing · Vemra" };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = await params;
  return <ListingDetailScreen listingId={propertyId} />;
}
