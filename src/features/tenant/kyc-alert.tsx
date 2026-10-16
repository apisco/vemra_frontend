import Link from "next/link";

import { AlertTriangleIcon } from "@/components/icons/alert-triangle-icon";
import { buttonClasses } from "@/components/ui/button";

export interface KycAlertProps {
  /** Where the tenant completes identity verification. */
  href: string;
}

/**
 * Prompts a tenant who has not completed identity (KYC) verification. Rendered
 * on the overview only, so it does not follow the tenant across every screen.
 */
export function KycAlert({ href }: KycAlertProps) {
  return (
    <section
      role="alert"
      aria-label="Identity verification required"
      className="flex flex-col gap-3 rounded-lg border border-warning-600 bg-warning-50 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5"
    >
      <div className="flex items-start gap-3">
        <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-warning-600" />
        <div className="flex flex-col gap-0.5">
          <h2 className="text-body-md font-semibold text-neutral-900">
            Complete your identity verification
          </h2>
          <p className="text-body-sm text-neutral-800">
            Verify your identity to apply for homes and sign leases on Vemra.
          </p>
        </div>
      </div>

      <Link
        href={href}
        className={buttonClasses({ size: "sm", className: "shrink-0" })}
      >
        Start now
      </Link>
    </section>
  );
}
