import type { ReactNode } from "react";

import { DashboardMobileNav } from "@/components/layout/dashboard-mobile-nav";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import type { DashboardNavItem, DashboardUser } from "@/constants/tenant";

export interface DashboardNavLink {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface DashboardShellProps {
  navLabel: string;
  navItems: readonly DashboardNavItem[];
  compactNavItems: readonly DashboardNavItem[];
  mobileNavItems: readonly DashboardNavItem[];
  user: DashboardUser;
  children: ReactNode;
}

export function toNavLinks(
  items: readonly DashboardNavItem[],
): DashboardNavLink[] {
  return items.map(({ href, label, icon: Icon }) => ({
    href,
    label,
    icon: <Icon />,
  }));
}

export function DashboardShell({
  navLabel,
  navItems,
  compactNavItems,
  mobileNavItems,
  user,
  children,
}: DashboardShellProps) {
  const links = toNavLinks(navItems);

  return (
    <div className="flex min-h-dvh bg-neutral-50">
      <DashboardSidebar navLabel={navLabel} links={links} user={user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          navLabel={navLabel}
          links={toNavLinks(compactNavItems)}
          user={user}
        />
        <DashboardMobileNav
          navLabel={navLabel}
          links={links}
          tabs={toNavLinks(mobileNavItems)}
          user={user}
        />

        <main className="flex-1 max-md:pb-17">
          <div className="mx-auto w-full max-w-263 px-4 py-4 md:px-8 md:py-8 lg:px-16 lg:py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
