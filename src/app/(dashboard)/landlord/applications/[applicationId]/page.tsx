import type { Metadata } from "next";
import { ApplicationReviewScreen } from "@/features/landlord/landlord-secondary-screens";

export const metadata: Metadata = { title: "Review application · Vemra" };
export default function Page() { return <ApplicationReviewScreen />; }
