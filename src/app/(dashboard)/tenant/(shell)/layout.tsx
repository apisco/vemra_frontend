import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import {
  TENANT_NAV,
  TENANT_NAV_MOBILE,
  TENANT_NAV_TABLET,
} from "@/constants/tenant";
import { ROLE_LABELS, requireRole } from "@/lib/api/resources/auth";

export default async function TenantLayout({
  children,
}: LayoutProps<"/tenant">) {
  const session = await requireRole("TENANT", "/tenant");

  return (
    <DashboardShell
      navLabel={ROLE_LABELS.TENANT}
      navItems={TENANT_NAV}
      compactNavItems={TENANT_NAV_TABLET}
      mobileNavItems={TENANT_NAV_MOBILE}
      user={{
        name: session.user.name,
        role: ROLE_LABELS[session.activeRole],
        initials: session.user.initials,
        avatarUrl: session.user.avatarUrl,
      }}
      userProfileHref="/tenant/profile"
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
