import { Avatar } from "@/components/ui/avatar";
import { LANDLORD_PROPERTY_ADMINS } from "@/constants/landlord";

const { title, people } = LANDLORD_PROPERTY_ADMINS;

export function PropertyAdminsWidget() {
  return (
    <section
      aria-labelledby="property-admins-title"
      className="hidden flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-6 lg:flex"
    >
      <h2
        id="property-admins-title"
        className="font-display text-heading-sm font-semibold text-neutral-900"
      >
        {title}
      </h2>

      <ul className="flex flex-col gap-3">
        {people.map(({ name, detail }) => (
          <li key={name} className="flex items-center gap-3">
            <Avatar name={name} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-label-md font-semibold text-neutral-900">
                {name}
              </p>
              <p className="truncate text-label-sm text-neutral-700">
                {detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
