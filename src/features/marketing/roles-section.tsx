import { Badge } from "@/components/ui/badge";
import { ROLE_ROWS, ROLES_SECTION } from "@/constants/marketing";
import { cn } from "@/lib/cn";
import { CONTAINER, SECTION_GUTTER } from "@/lib/layout";

import { SectionHeading } from "./section-heading";

export function RolesSection() {
  return (
    <section className="border-y border-neutral-200 bg-white">
      <div
        className={cn(
          CONTAINER,
          SECTION_GUTTER,
          "flex flex-col gap-6 py-8 md:gap-10 md:py-16 lg:gap-14 lg:py-25",
        )}
      >
        <SectionHeading
          align="center"
          subheading={
            <>
              <span className="md:hidden">
                {ROLES_SECTION.subheadingMobile}
              </span>
              <span className="hidden md:inline">
                {ROLES_SECTION.subheading}
              </span>
            </>
          }
        >
          {ROLES_SECTION.heading}
        </SectionHeading>

        <ul className="flex flex-col gap-4 md:gap-5 lg:gap-6">
          {ROLE_ROWS.map((role) => (
            <li
              key={role.title}
              className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 md:p-6 lg:flex-row lg:items-center lg:gap-10 lg:p-8"
            >
              <div className="flex items-center justify-between gap-4 lg:w-55 lg:shrink-0 lg:flex-col lg:items-start lg:justify-start lg:gap-2">
                <h3 className="font-display text-heading-sm leading-[28px] font-semibold text-brand-700 md:text-heading-md md:leading-[30px] md:font-bold">
                  {role.title}
                </h3>
                <Badge
                  variant="info"
                  size="sm"
                  className="hidden md:inline-flex lg:hidden"
                >
                  {role.subtitle}
                </Badge>
                <p className="text-caption text-neutral-700 md:hidden lg:block lg:text-label-md lg:leading-[20px] lg:font-normal">
                  {role.subtitle}
                </p>
              </div>

              <p className="text-body-sm text-neutral-800 md:text-body-md lg:flex-1">
                <span className="md:hidden">{role.descriptionMobile}</span>
                <span className="hidden md:inline lg:hidden">
                  {role.descriptionTablet}
                </span>
                <span className="hidden lg:inline">{role.description}</span>
              </p>

              <ul className="flex flex-wrap gap-2 md:hidden">
                {role.tagsMobile.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-sm bg-neutral-100 px-2 py-1 text-caption text-neutral-900"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <ul className="hidden flex-wrap gap-2 lg:flex lg:w-80 lg:shrink-0">
                {role.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-sm bg-neutral-100 px-3 py-1.5 text-label-sm text-neutral-900"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
