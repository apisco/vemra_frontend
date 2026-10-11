import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApplicationReviewScreen } from "@/features/landlord/landlord-secondary-screens";
import { getApplicationQueue } from "@/lib/api/resources/landlord";
import { isUuid } from "@/lib/validation";

export const metadata: Metadata = { title: "Application · Vemra" };

export default async function LandlordApplicationPage({
  params,
}: PageProps<"/landlord/applications/[applicationId]">) {
  const { applicationId } = await params;

  if (!isUuid(applicationId)) {
    notFound();
  }

  const queue = await getApplicationQueue();
  const application = queue.ok
    ? (queue.data.items.find((item) => item.id === applicationId) ?? null)
    : null;

  return (
    <ApplicationReviewScreen
      applicationId={applicationId}
      application={application}
    />
  );
}
