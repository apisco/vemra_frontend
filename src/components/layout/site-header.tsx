"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LogoMark } from "@/components/layout/logo-mark";
import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import {
  HEADER_CTA,
  LOGIN_LINK,
  NAV_LINKS,
} from "@/constants/marketing";
import { cn } from "@/lib/cn";
import { CONTAINER, HEADER_GUTTER } from "@/lib/layout";
import { createClient } from "@/lib/supabase/client";

interface HeaderUser {
  name: string;
  initials: string;
  profileHref: string;
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

function profileHrefForRole(role: unknown): string {
  return typeof role === "string" && role.toUpperCase() === "LANDLORD"
    ? "/landlord/profile"
    : "/tenant/profile";
}

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState<HeaderUser | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    void supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!active || !data.user) return;
        const account = data.user;
        const metadata = account.user_metadata ?? {};
        const name =
          (typeof metadata.display_name === "string" && metadata.display_name) ||
          (typeof metadata.full_name === "string" && metadata.full_name) ||
          account.email ||
          "Account";
        setUser({
          name,
          initials: initialsFrom(name),
          profileHref: profileHrefForRole(metadata.role),
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-neutral-200 bg-white transition-shadow",
        isScrolled && "shadow-elevation-3",
      )}
    >
      <div
        className={cn(
          CONTAINER,
          HEADER_GUTTER,
          "flex h-13 items-center justify-between md:h-19 lg:h-18",
        )}
      >
        <LogoMark />

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex lg:gap-8">
          {NAV_LINKS.map(({ href, label, short }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={cn(
                "rounded-sm text-body-md font-semibold transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700",
                pathname === href
                  ? "text-brand-700"
                  : "text-neutral-800 hover:text-brand-700",
              )}
            >
              <span className="lg:hidden">{short}</span>
              <span className="hidden lg:inline">{label}</span>
            </Link>
          ))}
          {user ? (
            <Link
              href={user.profileHref}
              aria-label={`Your profile, ${user.name}`}
              className={cn(
                "hidden items-center gap-2 rounded-sm text-body-md font-semibold text-neutral-800 transition-colors hover:text-brand-700 lg:flex",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700",
              )}
            >
              <Avatar
                name={user.name}
                initials={user.initials}
                size="sm"
                className="size-7 text-label-sm"
              />
              <span className="max-w-32 truncate">{user.name}</span>
            </Link>
          ) : (
            <Link
              href={LOGIN_LINK.href}
              className={cn(
                "hidden rounded-sm text-body-md font-semibold text-neutral-800 transition-colors hover:text-brand-700 lg:inline",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700",
              )}
            >
              {LOGIN_LINK.label}
            </Link>
          )}
          <Link
            href={HEADER_CTA.href}
            className={buttonClasses({ size: "md", className: "lg:h-10" })}
          >
            <span className="lg:hidden">{HEADER_CTA.short}</span>
            <span className="hidden lg:inline">{HEADER_CTA.label}</span>
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-nav"
          className="-mr-2 inline-flex flex-col items-center justify-center gap-1 rounded-sm p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 md:hidden"
        >
          <span className="sr-only">Open menu</span>
          <span aria-hidden="true" className="h-0.5 w-5 rounded-sm bg-neutral-900" />
          <span aria-hidden="true" className="h-0.5 w-5 rounded-sm bg-neutral-900" />
          <span aria-hidden="true" className="h-0.5 w-5 rounded-sm bg-neutral-900" />
        </button>
      </div>

      <MobileNavDrawer
        ref={dialogRef}
        pathname={pathname}
        user={user}
        onClose={() => setIsDrawerOpen(false)}
      />
    </header>
  );
}

interface MobileNavDrawerProps {
  ref: React.Ref<HTMLDialogElement>;
  pathname: string;
  user: HeaderUser | null;
  onClose: () => void;
}

function MobileNavDrawer({ ref, pathname, user, onClose }: MobileNavDrawerProps) {
  return (
    <dialog
      ref={ref}
      id="mobile-nav"
      aria-label="Main"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "m-0 h-full max-h-none w-full max-w-none bg-transparent backdrop:bg-neutral-900/40",
        "open:flex open:flex-col",
      )}
    >
      <div className="flex flex-col gap-6 bg-white px-4 pt-3 pb-6 shadow-elevation-3 transition-transform duration-200 ease-out starting:-translate-y-full motion-reduce:transition-none">
        <div className="flex h-7 items-center justify-between">
          <LogoMark />
          <button
            type="button"
            onClick={onClose}
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

        <div className="flex flex-col">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              aria-current={pathname === href ? "page" : undefined}
              className={cn(
                "rounded-sm py-3 text-body-lg font-semibold",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
                pathname === href ? "text-brand-700" : "text-neutral-900",
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href={HEADER_CTA.href}
            onClick={onClose}
            className={buttonClasses({ fullWidth: true })}
          >
            {HEADER_CTA.label}
          </Link>
          {user ? (
            <Link
              href={user.profileHref}
              onClick={onClose}
              className={buttonClasses({ variant: "secondary", fullWidth: true })}
            >
              {user.name}
            </Link>
          ) : (
            <Link
              href={LOGIN_LINK.href}
              onClick={onClose}
              className={buttonClasses({ variant: "secondary", fullWidth: true })}
            >
              {LOGIN_LINK.label}
            </Link>
          )}
        </div>
      </div>
    </dialog>
  );
}
