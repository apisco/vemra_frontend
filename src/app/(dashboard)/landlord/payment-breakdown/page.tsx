import type { Metadata } from "next";
import { PaymentBreakdownScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Payment breakdown · Vemra" };
export default function Page() { return <PaymentBreakdownScreen />; }
