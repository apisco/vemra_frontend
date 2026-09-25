import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  TENANT_NAV,
  TENANT_NAV_MOBILE,
  TENANT_NAV_TABLET,
  TENANT_USER,
} from "@/constants/tenant";

export default function TenantLayout({ children }: LayoutProps<"/tenant">) {
  return (
    <DashboardShell
      navLabel="Tenant"
      navItems={TENANT_NAV}
      compactNavItems={TENANT_NAV_TABLET}
      mobileNavItems={TENANT_NAV_MOBILE}
      user={TENANT_USER}
    >
      {children}
    </DashboardShell>
  );
}
