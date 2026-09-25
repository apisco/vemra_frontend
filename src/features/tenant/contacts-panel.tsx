import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ResponsiveText } from "@/components/ui/responsive-text";
import { TENANT_CONTACTS } from "@/constants/tenant";

const { title, people, verifiedLabel } = TENANT_CONTACTS;

export function ContactsPanel() {
  return (
    <section
      aria-labelledby="contacts-title"
      className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 md:gap-4 md:p-5 lg:p-6"
    >
      <h2
        id="contacts-title"
        className="font-display text-label-md font-semibold text-neutral-900 md:text-heading-sm"
      >
        {title}
      </h2>

      <ul className="flex flex-col gap-3 md:gap-4">
        {people.map(({ name, initials, detail, isVerified }) => (
          <li key={name} className="flex items-center gap-3">
            <Avatar
              name={name}
              initials={initials}
              size="sm"
              tone="subtle"
              className="lg:size-10 lg:text-label-md"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1">
                <p className="text-label-sm font-semibold text-neutral-900 md:text-label-md">
                  {name}
                </p>
                {isVerified && (
                  <Badge variant="success" size="sm">
                    {verifiedLabel}
                  </Badge>
                )}
              </div>
              <p className="text-caption text-neutral-700 md:text-label-sm">
                <ResponsiveText copy={detail} />
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
