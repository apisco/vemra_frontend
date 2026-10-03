import type { Metadata } from "next";

import Link from "next/link";

import { LogoMark } from "@/components/layout/logo-mark";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found — Vemra",
};

export default function NotFound() {
  return <main className="flex flex-1 flex-col items-center justify-center bg-neutral-50 p-12 text-center"><div className="flex w-full max-w-140 flex-col items-center gap-10"><LogoMark /><div><p className="font-display text-[140px] leading-[140px] font-extrabold tracking-[-4px] text-neutral-700">404</p><h1 className="font-display text-heading-xl font-bold">This page doesn&apos;t exist</h1></div><p className="text-body-lg text-neutral-700">The listing may have been unlisted, or the link you followed is out of date.</p><Link href="/browse" className={buttonClasses({ size: "sm" })}>← &nbsp;Back to browse rentals</Link></div></main>;
}
