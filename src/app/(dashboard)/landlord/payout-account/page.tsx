import type { Metadata } from "next";

import { AUTH_ROUTES } from "@/constants/auth";
import { LoadErrorPanel } from "@/features/errors/load-error-panel";
import { Screen } from "@/features/landlord/landlord-secondary-screens";
import { PayoutAccountManager } from "@/features/landlord/payout-account-manager";
import { getPayoutAccounts } from "@/lib/api/resources/landlord";
import { readStepUpState, STEP_UP_MESSAGES } from "@/lib/api/step-up";

export const metadata: Metadata = { title: "Payout account · Vemra" };

export default async function LandlordPayoutAccountPage() {
  const [accounts, stepUp] = await Promise.all([
    getPayoutAccounts(),
    readStepUpState(),
  ]);

  return (
    <Screen
      title="Payout account"
      description="Where your rent goes once a payment clears and you withdraw it."
    >
      {accounts.ok ? (
        <PayoutAccountManager
          accounts={accounts.data}
          needsStepUp={!stepUp.isSatisfied}
          stepUpMessage={
            stepUp.requirement === null
              ? null
              : STEP_UP_MESSAGES[stepUp.requirement]
          }
          stepUpHref={`${AUTH_ROUTES.twoFactorSetup}?next=/landlord/payout-account`}
        />
      ) : (
        <LoadErrorPanel label="Your payout accounts" failure={accounts} />
      )}
    </Screen>
  );
}
