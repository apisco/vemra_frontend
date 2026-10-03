"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { DashboardNavLink } from "@/components/layout/dashboard-shell";
import { LogoMark } from "@/components/layout/logo-mark";
import { NavItem, navItemClasses } from "@/components/navigation/nav-item";
import { Avatar } from "@/components/ui/avatar";
import type { DashboardUser } from "@/types/dashboard";
import { cn } from "@/lib/cn";

export interface DashboardMobileNavProps {
  navLabel: string;
  links: readonly DashboardNavLink[];
  tabs: readonly DashboardNavLink[];
  user: DashboardUser;
  userProfileHref?: string;
}

export function DashboardMobileNav({
  navLabel,
  links,
  tabs,
  user,
  userProfileHref,
}: DashboardMobileNavProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isDrawerOpen && !dialog.open) dialog.showModal();
    if (!isDrawerOpen && dialog.open) dialog.close();
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isDrawerOpen]);

  const primaryTabs = tabs.slice(0, -1);
  const moreTab = tabs.at(-1);

  return (
    <>
      <div className="sticky top-0 z-40 flex h-13 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 md:hidden">
        <LogoMark />

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          aria-expanded={isDrawerOpen}
          aria-controls="dashboard-nav"
          className="-mr-2 inline-flex flex-col items-center justify-center gap-1 rounded-sm p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          <span className="sr-only">Open menu</span>
          <span
            aria-hidden="true"
            className="h-0.5 w-5 rounded-sm bg-neutral-900"
          />
          <span
            aria-hidden="true"
            className="h-0.5 w-5 rounded-sm bg-neutral-900"
          />
          <span
            aria-hidden="true"
            className="h-0.5 w-5 rounded-sm bg-neutral-900"
          />
        </button>
      </div>

      <nav
        aria-label={navLabel}
        className="fixed inset-x-0 bottom-0 z-40 flex h-13 items-stretch border-t border-neutral-200 bg-white px-3 md:hidden"
      >
        {primaryTabs.map(({ href, label, icon }) => (
          <NavItem
            key={href}
            href={href}
            label={label}
            icon={icon}
            variant="mobile"
            isActive={pathname === href}
          />
        ))}

        {moreTab && (
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-expanded={isDrawerOpen}
            aria-controls="dashboard-nav"
            className={navItemClasses({ variant: "mobile" })}
          >
            <span className="shrink-0 [&_svg]:size-5" aria-hidden="true">
              {moreTab.icon}
            </span>
            <span>{moreTab.label}</span>
          </button>
        )}
      </nav>

      <dialog
        ref={dialogRef}
        id="dashboard-nav"
        aria-label={navLabel}
        onCancel={(event) => {
          event.preventDefault();
          setIsDrawerOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsDrawerOpen(false);
        }}
        className={cn(
          "m-0 h-full max-h-none w-full max-w-none bg-transparent backdrop:bg-neutral-900/40",
          "open:flex open:flex-col md:hidden",
        )}
      >
        <div className="flex max-h-full flex-col gap-4 overflow-y-auto bg-white px-4 pt-3 pb-6 shadow-elevation-3 transition-transform duration-200 ease-out starting:-translate-y-full motion-reduce:transition-none">
          <div className="flex h-7 items-center justify-between">
            <LogoMark />
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="-mr-2 inline-flex size-9 items-center justify-center rounded-sm text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              <span className="sr-only">Close menu</span>
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                focusable="false"
                className="size-5"
              >
                <path
                  d="M5 5L15 15M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {links.map(({ href, label, icon }) => (
              <NavItem
                key={href}
                href={href}
                label={label}
                icon={icon}
                isActive={pathname === href}
                onClick={() => setIsDrawerOpen(false)}
              />
            ))}
          </div>

          <Link
            href={userProfileHref ?? "#"}
            onClick={() => setIsDrawerOpen(false)}
            aria-label={`Open ${user.name} profile`}
            className="flex items-center gap-3 rounded-md border-t border-neutral-200 px-3 pt-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            <Avatar name={user.name} initials={user.initials} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-label-md font-semibold text-neutral-900">
                {user.name}
              </p>
              <p className="truncate text-caption text-neutral-700">
                {user.role}
              </p>
            </div>
            </Link>
        </div>
      </dialog>
    </>
  );
}
