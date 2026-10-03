import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { LANDLORD_ASSIGNED_ADMIN } from "@/constants/landlord";

const {
  eyebrow,
  name,
  detail,
  badge,
  managedLabel,
  managedCount,
  managedProperties,
  profileAction,
} = LANDLORD_ASSIGNED_ADMIN;

export function PropertyAdminCard() {
  return (
    <section
      aria-labelledby="assigned-admin-name"
      className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 lg:hidden"
    >
      <div className="flex items-center gap-3">
        <Avatar name={name} size="md" className="md:size-8 md:text-label-sm" />

        <div className="min-w-0">
          <p className="text-label-sm text-neutral-700 md:hidden">{eyebrow}</p>
          <h2
            id="assigned-admin-name"
            className="font-display text-body-lg font-semibold text-neutral-900 md:text-heading-sm"
          >
            {name}
          </h2>
          <p className="text-label-sm text-neutral-700 md:text-body-sm">
            {detail}
          </p>
        </div>

        <Badge variant="success" size="sm" className="ml-auto max-md:hidden">
          {badge}
        </Badge>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <p className="text-body-sm text-neutral-700 md:text-label-sm md:font-semibold md:text-neutral-900">
            {managedLabel}
          </p>
          <p className="text-body-sm font-semibold text-neutral-900 md:hidden">
            {managedCount}
          </p>
        </div>

        <ul className="hidden flex-col md:flex">
          {managedProperties.map((property) => (
            <li key={property} className="text-body-sm text-neutral-800">
              {property}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3 md:flex">
        <Link
          href={profileAction.href}
          className={buttonClasses({ size: "sm" })}
        >
          {profileAction.label}
        </Link>
      </div>
    </section>
  );
}
