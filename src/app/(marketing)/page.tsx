import { CtaBand } from "@/features/marketing/cta-band";
import { DashboardPreviewSection } from "@/features/marketing/dashboard-preview-section";
import { HeroSection } from "@/features/marketing/hero-section";
import { RolesSection } from "@/features/marketing/roles-section";
import { TrustSection } from "@/features/marketing/trust-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <RolesSection />
      <DashboardPreviewSection />
      <TrustSection />
      <CtaBand />
    </>
  );
}
