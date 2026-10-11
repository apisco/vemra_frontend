import { DashboardMobileNav } from "@/components/layout/dashboard-mobile-nav";
import { toNavLinks } from "@/components/layout/dashboard-shell";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import {
  TENANT_NAV,
  TENANT_NAV_MOBILE,
  TENANT_NAV_TABLET,
} from "@/constants/tenant";
import { ROLE_LABELS, requireRole } from "@/lib/api/resources/auth";

export default async function TenantCheckoutLayout({
  children,
}: LayoutProps<"/tenant">) {
  const session = await requireRole("TENANT", "/tenant");

  const user = {
    name: session.user.name,
    role: ROLE_LABELS[session.activeRole],
    initials: session.user.initials,
  };

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50">
      <DashboardTopbar
        navLabel={ROLE_LABELS.TENANT}
        links={toNavLinks(TENANT_NAV_TABLET)}
        user={user}
      />
      <DashboardMobileNav
        navLabel={ROLE_LABELS.TENANT}
        links={toNavLinks(TENANT_NAV)}
        tabs={toNavLinks(TENANT_NAV_MOBILE)}
        user={user}
      />

      <main className="flex-1 max-md:pb-17">
        <div className="mx-auto w-full max-w-176 px-4 py-4 md:px-8 md:py-8 lg:max-w-258 lg:px-4 lg:py-32">
          {children}
        </div>
      </main>
    </div>
  );
}
