import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import {
  BROWSE_PAGE,
  BROWSE_PRICE_OPTIONS,
} from "@/constants/marketing";
import { BrowseFilterBar } from "@/features/marketing/browse-filter-bar";
import { PropertyCard } from "@/features/marketing/property-card";
import { cn } from "@/lib/cn";
import { CONTAINER, SECTION_GUTTER } from "@/lib/layout";
import { getListings } from "@/lib/api/resources/public";

export const metadata: Metadata = {
  title: "Browse rentals · Vemra",
  description: BROWSE_PAGE.subheading,
};

/** The backend exposes no total, so fetch a page big enough to hold the set. */
const BROWSE_PAGE_SIZE = 100;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BrowsePage({ searchParams }: PageProps<"/browse">) {
  const params = await searchParams;
  const price = firstValue(params.price) ?? "any";
  const beds = firstValue(params.beds) ?? "any";
  const location = (firstValue(params.location) ?? "").trim().toLowerCase();
  const verifiedOnly = firstValue(params.verified) === "1";

  const result = await getListings({ pageSize: BROWSE_PAGE_SIZE });

  const priceRange = BROWSE_PRICE_OPTIONS.find((option) => option.value === price);
  const bedsValue = beds === "any" ? undefined : Number(beds);

  const items = result.items.filter((item) => {
    if (priceRange?.min !== undefined && item.rent.amount < priceRange.min) {
      return false;
    }
    if (priceRange?.max !== undefined && item.rent.amount > priceRange.max) {
      return false;
    }
    if (bedsValue !== undefined && !Number.isNaN(bedsValue)) {
      const bedrooms = item.bedrooms ?? 0;
      if (bedsValue >= 4 ? bedrooms < 4 : bedrooms !== bedsValue) {
        return false;
      }
    }
    if (location !== "" && !item.location.toLowerCase().includes(location)) {
      return false;
    }
    if (verifiedOnly && !item.isVerified) {
      return false;
    }
    return true;
  });

  const locations = [
    ...new Set(
      result.items
        .map((item) => item.location)
        .filter((value) => value !== "" && value !== "—"),
    ),
  ].sort();

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

      <BrowseFilterBar total={items.length} locations={locations} />

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
        {items.map((property) => (
          <li key={property.id} className="flex">
            <PropertyCard property={property} className="w-full" />
          </li>
        ))}
      </ul>

      {items.length === 0 ? (
        <p className="rounded-lg border border-neutral-200 p-8 text-center text-body-md text-neutral-700">
          No homes match these filters. Try widening your search.
        </p>
      ) : result.hasMore ? (
        <Button size="md" className="mx-auto lg:mt-4">{BROWSE_PAGE.loadMore}</Button>
      ) : null}
    </div>
  );
}
