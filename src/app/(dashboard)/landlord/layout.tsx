import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import {
  LANDLORD_NAV,
  LANDLORD_NAV_MOBILE,
  LANDLORD_NAV_TABLET,
} from "@/constants/landlord";
import { ROLE_LABELS, requireRole } from "@/lib/api/resources/auth";

export default async function LandlordLayout({
  children,
}: LayoutProps<"/landlord">) {
  const session = await requireRole("LANDLORD", "/landlord");

  return (
    <DashboardShell
      navLabel={ROLE_LABELS.LANDLORD}
      navItems={LANDLORD_NAV}
      compactNavItems={LANDLORD_NAV_TABLET}
      mobileNavItems={LANDLORD_NAV_MOBILE}
      user={{
        name: session.user.name,
        role: ROLE_LABELS[session.activeRole],
        initials: session.user.initials,
        avatarUrl: session.user.avatarUrl,
      }}
      userProfileHref="/landlord/profile"
      banner={
        <RoleSwitcher
          roles={session.user.roles}
          activeRole={session.activeRole}
        />
      }
    >
      {children}
    </DashboardShell>
  );
}
