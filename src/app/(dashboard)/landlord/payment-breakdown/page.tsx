import type { Metadata } from "next";

import { PaymentBreakdownScreen } from "@/features/landlord/landlord-secondary-screens";
import { getLandlordWallet } from "@/lib/api/resources/landlord";

export const metadata: Metadata = { title: "Payment breakdown · Vemra" };

export default async function LandlordPaymentBreakdownPage() {
  const wallet = await getLandlordWallet();
  return <PaymentBreakdownScreen wallet={wallet.ok ? wallet.data : null} />;
}
