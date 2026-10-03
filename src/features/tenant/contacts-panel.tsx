import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { TenantContact } from "@/types/api/tenant";

export function ContactsPanel({ contacts }: { contacts: readonly TenantContact[] }) {
  return (
    <section
      aria-labelledby="contacts-title"
      className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 md:gap-4 md:p-5 lg:p-6"
    >
      <h2
        id="contacts-title"
        className="font-display text-label-md font-semibold text-neutral-900 md:text-heading-sm"
      >
        Contacts
      </h2>

      <ul className="flex flex-col gap-3 md:gap-4">
        {contacts.map((person) => (
          <li key={person.id} className="flex items-center gap-3">
            <Avatar
              name={person.name}
              initials={person.initials}
              size="sm"
              tone="subtle"
              className="lg:size-10 lg:text-label-md"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1">
                <p className="text-label-sm font-semibold text-neutral-900 md:text-label-md">
                  {person.name}
                </p>
                {person.isVerified && (
                  <Badge variant="success" size="sm">
                    VERIFIED
                  </Badge>
                )}
              </div>
              <p className="text-caption text-neutral-700 md:text-label-sm">
                {person.role}{person.note ? ` · ${person.note}` : ""}{person.responseTime ? ` · ${person.responseTime}` : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
