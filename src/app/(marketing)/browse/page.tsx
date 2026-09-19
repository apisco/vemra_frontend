import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { BROWSE_PAGE, PROPERTIES } from "@/constants/marketing";
import { BrowseFilterBar } from "@/features/marketing/browse-filter-bar";
import { PropertyCard } from "@/features/marketing/property-card";
import { cn } from "@/lib/cn";
import { CONTAINER, SECTION_GUTTER } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Browse rentals · Vemra",
  description: BROWSE_PAGE.subheading,
};

export default function BrowsePage() {
  return (
    <div
      className={cn(
        CONTAINER,
        SECTION_GUTTER,
        "flex flex-col gap-5 py-4 md:gap-7 md:py-8 lg:gap-6 lg:py-14",
      )}
    >
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[28px] leading-[36px] font-extrabold tracking-[-1px] text-neutral-900 md:text-[30px] md:leading-[45px] lg:text-display-lg lg:leading-[54px]">
          {BROWSE_PAGE.heading}
        </h1>
        <p className="text-body-md text-neutral-700 lg:text-body-lg lg:leading-[24px]">
          <span className="md:hidden">{BROWSE_PAGE.subheadingMobile}</span>
          <span className="hidden md:inline">{BROWSE_PAGE.subheading}</span>
        </p>
      </div>

      <BrowseFilterBar />

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
        {PROPERTIES.map((property) => (
          <li key={property.id} className="flex">
            <PropertyCard property={property} className="w-full" />
          </li>
        ))}
      </ul>

      <Button size="md" className="mx-auto lg:mt-4">
        {BROWSE_PAGE.loadMore}
      </Button>
    </div>
  );
}
