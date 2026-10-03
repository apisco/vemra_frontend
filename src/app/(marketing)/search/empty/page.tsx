import type { Metadata } from "next";
import { EmptySearchScreen } from "@/features/marketing/public-marketing-screens";

export const metadata: Metadata = { title: "No homes match · Vemra" };
export default function EmptySearchPage() { return <EmptySearchScreen />; }
