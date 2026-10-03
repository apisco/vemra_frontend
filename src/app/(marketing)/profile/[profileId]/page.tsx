import type { Metadata } from "next";
import { ProfileScreen } from "@/features/marketing/public-marketing-screens";

export const metadata: Metadata = { title: "Property Admin · Vemra" };
export default async function ProfilePage({
  params,
}: PageProps<"/profile/[profileId]">) {
  const { profileId } = await params;
  return <ProfileScreen profileId={profileId} />;
}
