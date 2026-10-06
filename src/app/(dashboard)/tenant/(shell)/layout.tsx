import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  TENANT_NAV,
  TENANT_NAV_MOBILE,
  TENANT_NAV_TABLET,
} from "@/constants/tenant";
import { requireSession } from "@/lib/api/resources/auth";

export default async function TenantLayout({
  children,
}: LayoutProps<"/tenant">) {
  const session = await requireSession();

  return (
    <DashboardShell
      navLabel="Tenant"
      navItems={TENANT_NAV}
      compactNavItems={TENANT_NAV_TABLET}
      mobileNavItems={TENANT_NAV_MOBILE}
      user={{
        name: session.user.name,
        role: "Tenant",
        initials: session.user.initials,
      }}
      userProfileHref="/tenant/profile"
    >
      {children}
    </DashboardShell>
  );
}
