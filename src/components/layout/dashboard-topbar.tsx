"use client";

import { usePathname } from "next/navigation";

import type { DashboardNavLink } from "@/components/layout/dashboard-shell";
import { LogoMark } from "@/components/layout/logo-mark";
import { NavItem } from "@/components/navigation/nav-item";
import { Avatar } from "@/components/ui/avatar";
import type { DashboardUser } from "@/constants/tenant";

export interface DashboardTopbarProps {
  navLabel: string;
  links: readonly DashboardNavLink[];
  user: DashboardUser;
}

export function DashboardTopbar({
  navLabel,
  links,
  user,
}: DashboardTopbarProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 hidden h-18 shrink-0 items-center justify-between gap-6 bg-brand-950 px-8 md:flex lg:hidden">
      <LogoMark variant="inverse" />

      <nav aria-label={navLabel} className="flex items-center gap-2">
        {links.map(({ href, label, icon }) => (
          <NavItem
            key={href}
            href={href}
            label={label}
            icon={icon}
            variant="top"
            tone="dark"
            isActive={pathname === href}
          />
        ))}
      </nav>

      <Avatar name={user.name} initials={user.initials} size="sm" />
    </div>
  );
}
