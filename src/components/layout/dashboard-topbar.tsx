"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import type { DashboardNavLink } from "@/components/layout/dashboard-shell";
import { LogoMark } from "@/components/layout/logo-mark";
import { NavItem } from "@/components/navigation/nav-item";
import { Avatar } from "@/components/ui/avatar";
import type { DashboardUser } from "@/types/dashboard";

export interface DashboardTopbarProps {
  navLabel: string;
  links: readonly DashboardNavLink[];
  user: DashboardUser;
  userProfileHref?: string;
}

export function DashboardTopbar({
  navLabel,
  links,
  user,
  userProfileHref,
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

      <Link
        href={userProfileHref ?? "#"}
        aria-label={`Open ${user.name} profile`}
        className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Avatar name={user.name} initials={user.initials} size="sm" />
      </Link>
    </div>
  );
}
