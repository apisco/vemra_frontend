import type { Metadata } from "next";
import { AboutContactScreen } from "@/features/marketing/public-marketing-screens";

export const metadata: Metadata = { title: "About & Contact · Vemra" };
export default function AboutPage() { return <AboutContactScreen />; }
