import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  LANDLORD_NAV,
  LANDLORD_NAV_MOBILE,
  LANDLORD_NAV_TABLET,
} from "@/constants/landlord";
import { requireSession } from "@/lib/api/resources/auth";

export default async function LandlordLayout({
  children,
}: LayoutProps<"/landlord">) {
  const session = await requireSession();

  return (
    <DashboardShell
      navLabel="Landlord"
      navItems={LANDLORD_NAV}
      compactNavItems={LANDLORD_NAV_TABLET}
      mobileNavItems={LANDLORD_NAV_MOBILE}
      user={{
        name: session.user.name,
        role: "Landlord",
        initials: session.user.initials,
      }}
      userProfileHref="/landlord/profile"
    >
      {children}
    </DashboardShell>
  );
}
