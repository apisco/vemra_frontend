import type { Metadata } from "next";

import { LoadErrorPanel } from "@/features/errors/load-error-panel";
import { Screen } from "@/features/landlord/landlord-secondary-screens";
import { NotificationPreferencesForm } from "@/features/settings/notification-preferences-form";
import { getLandlordNotificationPreferences } from "@/lib/api/resources/landlord";

export const metadata: Metadata = { title: "Notification preferences · Vemra" };

export default async function LandlordNotificationPreferencesPage() {
  const preferences = await getLandlordNotificationPreferences();

  return (
    <Screen
      title="Notification preferences"
      description="Choose what you hear from us, and how."
    >
      {preferences.ok ? (
        <NotificationPreferencesForm preferences={preferences.data} />
      ) : (
        <LoadErrorPanel
          label="Your notification preferences"
          failure={preferences}
        />
      )}
    </Screen>
  );
}
