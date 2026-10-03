import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  LANDLORD_NAV,
  LANDLORD_NAV_MOBILE,
  LANDLORD_NAV_TABLET,
  LANDLORD_USER,
} from "@/constants/landlord";

export default function LandlordLayout({ children }: LayoutProps<"/landlord">) {
  return (
    <DashboardShell
      navLabel="Landlord"
      navItems={LANDLORD_NAV}
      compactNavItems={LANDLORD_NAV_TABLET}
      mobileNavItems={LANDLORD_NAV_MOBILE}
      user={LANDLORD_USER}
      userProfileHref="/landlord/profile"
    >
      {children}
    </DashboardShell>
  );
}
