import type { Metadata } from "next";

import { LoadErrorPanel } from "@/features/errors/load-error-panel";
import { ApplicationsScreen } from "@/features/landlord/landlord-secondary-screens";
import { Screen } from "@/features/landlord/landlord-secondary-screens";
import { getApplicationQueue } from "@/lib/api/resources/landlord";

export const metadata: Metadata = { title: "Applications · Vemra" };

export default async function LandlordApplicationsPage() {
  const queue = await getApplicationQueue();

  if (!queue.ok) {
    return (
      <Screen
        title="Applications"
        description="Applications for your vacant properties."
      >
        <LoadErrorPanel label="Your applications" failure={queue} />
      </Screen>
    );
  }

  return <ApplicationsScreen queue={queue.data} />;
}
