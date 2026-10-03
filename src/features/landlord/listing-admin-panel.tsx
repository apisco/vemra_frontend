import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import { LANDLORD_MANAGE_LISTING } from "@/constants/landlord";
import type { PropertyListing } from "@/constants/landlord";

const { admin } = LANDLORD_MANAGE_LISTING;

export interface ListingAdminPanelProps {
  property: PropertyListing;
}

export function ListingAdminPanel({ property }: ListingAdminPanelProps) {
  if (!property.admin.isAssigned) return null;

  return (
    <section
      aria-labelledby="listing-admin-title"
      className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 max-md:hidden md:p-6"
    >
      <h2
        id="listing-admin-title"
        className="font-display text-heading-sm font-semibold text-neutral-900"
      >
        {admin.title}
      </h2>

      <div className="flex items-center gap-3">
        <Avatar name={property.admin.name} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-body-sm font-semibold text-neutral-900">
            {property.admin.name}
          </p>
          <p className="text-label-sm text-neutral-700">
            {admin.metaPrefix} {property.adminSince}
          </p>
        </div>

        <Link
          href={admin.action.href}
          className={buttonClasses({ variant: "secondary", size: "sm" })}
        >
          {admin.action.label}
        </Link>
      </div>
    </section>
  );
}
