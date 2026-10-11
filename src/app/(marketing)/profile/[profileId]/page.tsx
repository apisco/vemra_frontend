import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProfileScreen } from "@/features/marketing/public-marketing-screens";
import { isUuid } from "@/lib/validation";

export const metadata: Metadata = { title: "Property Admin · Vemra" };

export default async function ProfilePage({
  params,
}: PageProps<"/profile/[profileId]">) {
  const { profileId } = await params;

  if (!isUuid(profileId)) {
    notFound();
  }

  return <ProfileScreen profileId={profileId} />;
}
