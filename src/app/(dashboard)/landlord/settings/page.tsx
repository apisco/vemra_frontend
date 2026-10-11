import type { Metadata } from "next";

import { LoadErrorPanel } from "@/features/errors/load-error-panel";
import { Screen } from "@/features/landlord/landlord-secondary-screens";
import { NotificationPreferencesForm } from "@/features/settings/notification-preferences-form";
import { ProfileForm } from "@/features/settings/profile-form";
import { getLandlordNotificationPreferences } from "@/lib/api/resources/landlord";
import { requireRole } from "@/lib/api/resources/auth";
import { getAccount } from "@/lib/api/resources/auth";

export const metadata: Metadata = { title: "Settings · Vemra" };

export default async function LandlordSettingsPage() {
  await requireRole("LANDLORD", "/landlord/settings");

  const [account, preferences] = await Promise.all([
    getAccount(),
    getLandlordNotificationPreferences(),
  ]);

  return (
    <Screen
      title="Settings"
      description="Manage the details and alerts connected to your Vemra account."
    >
      {account === null ? (
        <LoadErrorPanel
          label="Your profile"
          failure={{
            ok: false,
            message: "We could not load your account details.",
            requestId: null,
            isWaking: false,
          }}
        />
      ) : (
        <ProfileForm
          displayName={account.displayName ?? ""}
          email={account.email}
          phone={account.phone ?? ""}
          handle={account.handle ?? ""}
        />
      )}

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-heading-sm font-semibold text-neutral-900">
          Notifications
        </h2>
        {preferences.ok ? (
          <NotificationPreferencesForm preferences={preferences.data} />
        ) : (
          <LoadErrorPanel
            label="Your notification preferences"
            failure={preferences}
          />
        )}
      </div>
    </Screen>
  );
}
