import type { Metadata } from "next";

import { AUTH_ROUTES } from "@/constants/auth";
import { StatCard } from "@/components/ui/stat-card";
import { LoadErrorPanel } from "@/features/errors/load-error-panel";
import { UnsupportedPanel } from "@/features/errors/unsupported-panel";
import {
  Screen,
  WalletTransactionsTable,
} from "@/features/landlord/landlord-secondary-screens";
import { WithdrawForm } from "@/features/landlord/withdraw-form";
import { UNSUPPORTED } from "@/lib/api/capabilities";
import { getLandlordWallet } from "@/lib/api/resources/landlord";
import { readStepUpState, STEP_UP_MESSAGES } from "@/lib/api/step-up";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Statement · Vemra" };

export default async function LandlordStatementPage() {
  const [wallet, stepUp] = await Promise.all([
    getLandlordWallet(),
    readStepUpState(),
  ]);

  if (!wallet.ok) {
    return (
      <Screen
        title="Transaction statement"
        description="Every rent payment, from when a tenant pays to when it lands in your bank."
      >
        <LoadErrorPanel label="Your statement" failure={wallet} />
      </Screen>
    );
  }

  const payout = wallet.data.wallets.find(
    (entry) => entry.name === "payout",
  );
  const available = payout?.balance ?? wallet.data.totalBalance;

  return (
    <Screen
      title="Transaction statement"
      description="Every rent payment, from when a tenant pays to when it lands in your bank."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          variant="outlined"
          title="Total balance"
          value={formatMoney(wallet.data.totalBalance)}
        />
        <StatCard
          variant="outlined"
          title="Available to withdraw"
          value={formatMoney(available)}
        />
      </div>

      <WithdrawForm
        available={available}
        needsStepUp={!stepUp.isSatisfied}
        stepUpMessage={
          stepUp.requirement === null
            ? null
            : STEP_UP_MESSAGES[stepUp.requirement]
        }
        stepUpHref={`${AUTH_ROUTES.twoFactorSetup}?next=/landlord/statement`}
      />

      <WalletTransactionsTable wallet={wallet.data} />

      <UnsupportedPanel
        capability={UNSUPPORTED.landlordStatementExport}
        label="Export"
      />
    </Screen>
  );
}
