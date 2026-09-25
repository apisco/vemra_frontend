"use client";

import { usePathname } from "next/navigation";

import type { DashboardNavLink } from "@/components/layout/dashboard-shell";
import { LogoMark } from "@/components/layout/logo-mark";
import { NavItem } from "@/components/navigation/nav-item";
import { Avatar } from "@/components/ui/avatar";
import type { DashboardUser } from "@/constants/tenant";

export interface DashboardSidebarProps {
  navLabel: string;
  links: readonly DashboardNavLink[];
  user: DashboardUser;
}

export function DashboardSidebar({
  navLabel,
  links,
  user,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 hidden h-dvh w-65 shrink-0 flex-col justify-between bg-brand-950 px-4 pt-8 pb-6 lg:flex">
      <div className="flex flex-col gap-10">
        <div className="px-3">
          <LogoMark variant="inverse" />
        </div>

        <nav aria-label={navLabel} className="flex flex-col gap-1">
          {links.map(({ href, label, icon }) => (
            <NavItem
              key={href}
              href={href}
              label={label}
              icon={icon}
              tone="dark"
              isActive={pathname === href}
            />
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 px-3">
        <Avatar name={user.name} initials={user.initials} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-label-md font-semibold text-white">
            {user.name}
          </p>
          <p className="truncate text-caption text-neutral-400">{user.role}</p>
        </div>
      </div>
    </div>
  );
}
