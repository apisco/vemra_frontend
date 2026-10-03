import type { Metadata } from "next";
import { VerificationScreen } from "@/features/marketing/public-marketing-screens";
export const metadata: Metadata = { title: "Verification · Vemra" };
export default function Page() { return <VerificationScreen />; }
