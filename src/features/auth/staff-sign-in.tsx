import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { AUTH_ROUTES, STAFF_SIGN_IN } from "@/constants/auth";

export type StaffSignInPlacement = "inline" | "card";

export interface StaffSignInProps {
  placement: StaffSignInPlacement;
}

export function StaffSignIn({ placement }: StaffSignInProps) {
  if (placement === "card") {
    return (
      <div className="hidden w-full flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-5 lg:flex">
        <div className="flex flex-col gap-1">
          <p className="text-label-md leading-5 font-semibold text-neutral-900">
            {STAFF_SIGN_IN.title}
          </p>
          <p className="text-body-md leading-[22px] text-neutral-700">
            {STAFF_SIGN_IN.description}
          </p>
        </div>
        <Link
          href={AUTH_ROUTES.staffLogin}
          className={buttonClasses({ variant: "secondary", fullWidth: true })}
        >
          {STAFF_SIGN_IN.actionLabel}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-1.5 md:hidden">
        <p className="text-label-sm leading-[18px] text-neutral-700">
          {STAFF_SIGN_IN.prompt}
        </p>
        <Link
          href={AUTH_ROUTES.staffLogin}
          className="inline-flex h-7 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 px-3 text-label-sm leading-4 font-semibold text-brand-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-brand-700"
        >
          {STAFF_SIGN_IN.actionLabel}
        </Link>
      </div>

      <div className="hidden flex-col gap-2.5 rounded-md border border-neutral-200 bg-neutral-50 p-3 md:flex lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-label-sm leading-4 font-semibold text-neutral-900">
              {STAFF_SIGN_IN.title}
            </p>
            <p className="text-label-sm leading-[18px] text-neutral-700">
              {STAFF_SIGN_IN.descriptionCompact}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white px-2 py-1 text-label-sm leading-[18px] text-neutral-700">
            {STAFF_SIGN_IN.pillLabel}
          </span>
        </div>
        <Link
          href={AUTH_ROUTES.staffLogin}
          className={buttonClasses({ variant: "secondary", fullWidth: true })}
        >
          {STAFF_SIGN_IN.actionLabel}
        </Link>
      </div>
    </>
  );
}
