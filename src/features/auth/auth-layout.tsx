import type { ReactNode } from "react";

import { LogoMark } from "@/components/layout/logo-mark";
import { cn } from "@/lib/cn";

export type AuthLayoutWidth =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "wide"
  | "content"
  | "contentLg"
  | "otp";

export type AuthLayoutGap = "xs" | "sm" | "md" | "lg" | "flat";

export type AuthLayoutJustify = "top" | "center" | "desktop";

export type AuthLayoutLogo = "fixed" | "hero" | "none";

const WIDTH_CLASSES: Record<AuthLayoutWidth, string> = {
  xs: "md:max-w-[440px] lg:max-w-[400px]",
  sm: "md:max-w-[440px] lg:max-w-[480px]",
  md: "max-w-[500px]",
  lg: "max-w-[520px]",
  xl: "md:max-w-[520px] lg:max-w-[560px]",
  wide: "max-w-[900px]",
  content: "lg:max-w-[500px]",
  contentLg: "lg:max-w-[520px]",
  otp: "md:max-w-[500px] lg:max-w-[480px]",
};

const GAP_CLASSES: Record<AuthLayoutGap, string> = {
  xs: "gap-5 md:gap-8",
  sm: "gap-7 md:gap-8 lg:gap-6",
  md: "gap-8",
  lg: "gap-6 md:gap-8 lg:gap-12",
  flat: "gap-6 md:gap-8",
};

const SPLIT_WIDTH_CLASSES = "md:max-w-[408px] lg:max-w-[460px]";

export interface AuthLayoutProps {
  width?: AuthLayoutWidth;
  gap?: AuthLayoutGap;
  justify?: AuthLayoutJustify;
  logoSize?: AuthLayoutLogo;
  aside?: ReactNode;
  children: ReactNode;
}

export function AuthLayout({
  width = "xs",
  gap = "md",
  justify = "top",
  logoSize = "fixed",
  aside,
  children,
}: AuthLayoutProps) {
  const logo =
    logoSize === "none" ? null : (
      <LogoMark
        size={logoSize}
        className={cn("self-start", aside ? "md:hidden" : undefined)}
      />
    );

  const column = (
    <div
      className={cn(
        "flex w-full flex-col",
        aside ? "gap-7" : GAP_CLASSES[gap],
        aside ? SPLIT_WIDTH_CLASSES : WIDTH_CLASSES[width],
      )}
    >
      {logo}
      {children}
    </div>
  );

  if (!aside) {
    return (
      <div
        className={cn(
          "flex flex-1 flex-col items-center px-5 py-10 md:px-12 lg:py-20",
          justify === "center"
            ? "justify-center"
            : justify === "desktop"
              ? "lg:justify-center"
              : "md:justify-center",
        )}
      >
        {column}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="hidden bg-brand-950 md:flex md:w-[280px] md:shrink-0 md:flex-col md:justify-between md:p-8 lg:w-1/2 lg:p-16">
        {aside}
      </aside>
      <div className="flex flex-1 flex-col items-center px-5 py-6 md:justify-center md:px-10 md:py-10 lg:px-16">
        {column}
      </div>
    </div>
  );
}
