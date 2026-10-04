"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import type { DashboardNavLink } from "@/components/layout/dashboard-shell";
import { LogoMark } from "@/components/layout/logo-mark";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { NavItem } from "@/components/navigation/nav-item";
import { Avatar } from "@/components/ui/avatar";
import type { DashboardUser } from "@/types/dashboard";

export interface DashboardSidebarProps {
  navLabel: string;
  links: readonly DashboardNavLink[];
  user: DashboardUser;
  userProfileHref?: string;
}

export function DashboardSidebar({
  navLabel,
  links,
  user,
  userProfileHref,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 hidden h-dvh w-65 shrink-0 flex-col justify-between overflow-hidden bg-brand-950 px-4 pt-8 pb-6 lg:flex">
      <div className="flex min-h-0 flex-col gap-10">
        <div className="px-3">
          <LogoMark variant="inverse" />
        </div>

        <nav
          aria-label={navLabel}
          className="scrollbar-hidden min-h-0 overflow-y-auto overscroll-contain pr-1"
        >
          <div className="flex flex-col gap-1">
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
          </div>
        </nav>
      </div>

      <div className="flex flex-col gap-1">
        <Link
          href={userProfileHref ?? "#"}
          aria-label={`Open ${user.name} profile`}
          className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Avatar name={user.name} initials={user.initials} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-label-md font-semibold text-white">
              {user.name}
            </p>
            <p className="truncate text-caption text-neutral-400">{user.role}</p>
          </div>
        </Link>
        <SignOutButton tone="dark" />
      </div>
    </div>
  );
}
