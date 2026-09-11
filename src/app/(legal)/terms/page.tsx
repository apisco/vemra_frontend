import type { Metadata } from "next";

import { TERMS_DOCUMENT } from "@/constants/legal";
import { LegalDocument } from "@/features/legal/legal-document";

export const metadata: Metadata = {
  title: "Terms of Service · Vemra",
  description: TERMS_DOCUMENT.intro,
};

export default function TermsPage() {
  return <LegalDocument content={TERMS_DOCUMENT} />;
}
