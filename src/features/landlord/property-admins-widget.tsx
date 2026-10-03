import { Avatar } from "@/components/ui/avatar";
import { formatCount } from "@/lib/format";
import type { PropertyAdmin } from "@/types/api/landlord";

export function PropertyAdminsWidget({
  admins,
}: {
  admins: readonly PropertyAdmin[];
}) {
  return (
    <section
      aria-labelledby="property-admins-title"
      className="hidden flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-6 lg:flex"
    >
      <h2
        id="property-admins-title"
        className="font-display text-heading-sm font-semibold text-neutral-900"
      >
        Vemra Property Admins
      </h2>

      <ul className="flex flex-col gap-3">
        {admins.map(({ name, unitsManaged, properties }) => (
          <li key={name} className="flex items-center gap-3">
            <Avatar name={name} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-label-md font-semibold text-neutral-900">
                {name}
              </p>
              <p className="truncate text-label-sm text-neutral-700">
                {formatCount(unitsManaged)} unit{unitsManaged === 1 ? "" : "s"} ·{" "}
                {properties[0] ?? "No properties"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
