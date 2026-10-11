import type { Metadata } from "next";

import { LoadErrorPanel } from "@/features/errors/load-error-panel";
import { Screen } from "@/features/landlord/landlord-secondary-screens";
import { ProfileForm } from "@/features/settings/profile-form";
import { getAccount, requireRole } from "@/lib/api/resources/auth";

export const metadata: Metadata = { title: "Profile · Vemra" };

export default async function LandlordProfilePage() {
  const session = await requireRole("LANDLORD", "/landlord/profile");
  const account = await getAccount();

  return (
    <Screen
      title="Your profile"
      description="Manage the personal details connected to your Vemra account."
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
          displayName={account.displayName ?? session.user.name}
          email={account.email}
          phone={account.phone ?? ""}
          handle={account.handle ?? ""}
        />
      )}
    </Screen>
  );
}
