import { DashboardMobileNav } from "@/components/layout/dashboard-mobile-nav";
import { toNavLinks } from "@/components/layout/dashboard-shell";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import {
  TENANT_NAV,
  TENANT_NAV_MOBILE,
  TENANT_NAV_TABLET,
  TENANT_USER,
} from "@/constants/tenant";

export default function TenantCheckoutLayout({
  children,
}: LayoutProps<"/tenant">) {
  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50">
      <DashboardTopbar
        navLabel="Tenant"
        links={toNavLinks(TENANT_NAV_TABLET)}
        user={TENANT_USER}
      />
      <DashboardMobileNav
        navLabel="Tenant"
        links={toNavLinks(TENANT_NAV)}
        tabs={toNavLinks(TENANT_NAV_MOBILE)}
        user={TENANT_USER}
      />

      <main className="flex-1 max-md:pb-17">
        <div className="mx-auto w-full max-w-176 px-4 py-4 md:px-8 md:py-8 lg:max-w-258 lg:px-4 lg:py-32">
          {children}
        </div>
      </main>
    </div>
  );
}
