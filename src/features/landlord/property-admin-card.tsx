import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { LANDLORD_ROUTES } from "@/constants/landlord";
import { formatCount } from "@/lib/format";
import type { PropertyAdmin } from "@/types/api/landlord";

export function PropertyAdminCard({
  admin,
}: {
  admin: PropertyAdmin | null;
}) {
  if (!admin) {
    return (
      <section
        aria-labelledby="assigned-admin-name"
        className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 lg:hidden"
      >
        <h2
          id="assigned-admin-name"
          className="font-display text-body-lg font-semibold text-neutral-900 md:text-heading-sm"
        >
          Assigned Property Admin
        </h2>
        <p className="text-body-sm text-neutral-700">
          No Property Admin has been assigned to your properties yet.
        </p>
        <div className="grid grid-cols-1 gap-3 md:flex">
          <Link
            href={LANDLORD_ROUTES.propertyAdmins}
            className={buttonClasses({ size: "sm" })}
          >
            View property admins
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="assigned-admin-name"
      className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 lg:hidden"
    >
      <div className="flex items-center gap-3">
        <Avatar
          name={admin.name}
          size="md"
          className="md:size-8 md:text-label-sm"
        />

        <div className="min-w-0">
          <p className="text-label-sm text-neutral-700 md:hidden">
            Assigned Property Admin
          </p>
          <h2
            id="assigned-admin-name"
            className="font-display text-body-lg font-semibold text-neutral-900 md:text-heading-sm"
          >
            {admin.name}
          </h2>
          <p className="text-label-sm text-neutral-700 md:text-body-sm">
            Assigned to {formatCount(admin.unitsManaged)} unit
            {admin.unitsManaged === 1 ? "" : "s"}
          </p>
        </div>

        <Badge variant="success" size="sm" className="ml-auto max-md:hidden">
          Assigned
        </Badge>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <p className="text-body-sm text-neutral-700 md:text-label-sm md:font-semibold md:text-neutral-900">
            Managed properties
          </p>
          <p className="text-body-sm font-semibold text-neutral-900 md:hidden">
            {formatCount(admin.unitsManaged)}
          </p>
        </div>

        <ul className="hidden flex-col md:flex">
          {admin.properties.map((property) => (
            <li key={property} className="text-body-sm text-neutral-800">
              {property}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3 md:flex">
        <Link
          href={LANDLORD_ROUTES.propertyAdmins}
          className={buttonClasses({ size: "sm" })}
        >
          View profile
        </Link>
      </div>
    </section>
  );
}
