import type { Metadata } from "next";

import { PRIVACY_DOCUMENT } from "@/constants/legal";
import { LegalDocument } from "@/features/legal/legal-document";

export const metadata: Metadata = {
  title: "Privacy Policy · Vemra",
  description:
    "How Vemra collects, uses, shares and protects the information you provide when you rent or list a property.",
};

export default function PrivacyPage() {
  return <LegalDocument content={PRIVACY_DOCUMENT} />;
}
