"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import {
  BROWSE_BEDROOM_OPTIONS,
  BROWSE_FILTERS,
  BROWSE_PRICE_OPTIONS,
  type BrowseFilterId,
  type BrowseFilterOption,
} from "@/constants/marketing";
import { cn } from "@/lib/cn";

function chipClasses(active: boolean): string {
  return cn(
    "inline-flex h-7 items-center gap-2 rounded-full px-3 text-label-sm font-semibold whitespace-nowrap transition-colors md:h-9 md:px-4",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
    active
      ? "bg-brand-700 text-white hover:bg-brand-800"
      : "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50",
  );
}

function optionRowClasses(selected: boolean): string {
  return cn(
    "block rounded-md px-3 py-2 text-body-sm",
    selected
      ? "bg-brand-50 font-semibold text-brand-700"
      : "text-neutral-800 hover:bg-neutral-50",
  );
}

export function BrowseFilterBar({
  total,
  locations,
}: {
  total: number;
  locations: readonly string[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hrefFor = (updates: Record<string, string | null>): string => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "" || value === "any") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const price = searchParams.get("price") ?? "any";
  const beds = searchParams.get("beds") ?? "any";
  const location = searchParams.get("location") ?? "";
  const verifiedOnly = searchParams.get("verified") === "1";

  const priceLabel =
    BROWSE_PRICE_OPTIONS.find((option) => option.value === price)?.label ?? "Price";
  const bedsLabel =
    BROWSE_BEDROOM_OPTIONS.find((option) => option.value === beds)?.label ?? "Bedrooms";
  const locationLabel = location === "" ? "Location" : location;

  const anyActive = price !== "any" || beds !== "any" || location !== "" || verifiedOnly;

  const renderChip = (id: BrowseFilterId): ReactNode => {
    switch (id) {
      case "all":
        return (
          <Link
            href={hrefFor({ price: null, beds: null, location: null, verified: null })}
            aria-pressed={!anyActive}
            className={chipClasses(!anyActive)}
          >
            All homes
          </Link>
        );
      case "price":
        return (
          <Dropdown
            active={price !== "any"}
            label={price !== "any" ? priceLabel : "Price"}
            short="Price"
            options={BROWSE_PRICE_OPTIONS}
            selectedValue={price}
            hrefForOption={(value) => hrefFor({ price: value })}
          />
        );
      case "beds":
        return (
          <Dropdown
            active={beds !== "any"}
            label={beds !== "any" ? bedsLabel : "Bedrooms"}
            short="Beds"
            options={BROWSE_BEDROOM_OPTIONS}
            selectedValue={beds}
            hrefForOption={(value) => hrefFor({ beds: value })}
          />
        );
      case "location":
        return (
          <Dropdown
            active={location !== ""}
            label={locationLabel}
            short="Location"
            options={[
              { value: "any", label: "Any location" },
              ...locations.map((value) => ({ value, label: value })),
            ]}
            selectedValue={location === "" ? "any" : location}
            hrefForOption={(value) => hrefFor({ location: value })}
          />
        );
      case "verified":
        return (
          <Link
            href={hrefFor({ verified: verifiedOnly ? null : "1" })}
            aria-pressed={verifiedOnly}
            className={chipClasses(verifiedOnly)}
          >
            Verified only
          </Link>
        );
      default:
        return null;
    }
  };

  const count = `${total} ${total === 1 ? "home" : "homes"} available`;

  return (
    <div className="md:rounded-lg md:border md:border-neutral-200 md:bg-white md:p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ul className="-mx-4 flex gap-2 overflow-visible px-4 pb-1 md:mx-0 md:flex-wrap md:px-0 md:pb-0">
          {BROWSE_FILTERS.map((filter) => (
            <li
              key={filter.id}
              className={cn("shrink-0", !filter.showOnMobile && "hidden md:block")}
            >
              {renderChip(filter.id)}
            </li>
          ))}
        </ul>

        <p className="text-body-md text-neutral-700">{count}</p>
      </div>
    </div>
  );
}

function Dropdown({
  active,
  label,
  short,
  options,
  selectedValue,
  hrefForOption,
}: {
  active: boolean;
  label: string;
  short: string;
  options: readonly BrowseFilterOption[];
  selectedValue: string;
  hrefForOption: (value: string) => string;
}) {
  return (
    <details className="group relative">
      <summary
        className={cn(
          chipClasses(active),
          "cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden",
        )}
      >
        <span className="md:hidden">{short}</span>
        <span className="hidden md:inline">{label}</span>
        <ChevronDownIcon
          className={cn(
            "size-2.5 shrink-0 transition-transform group-open:rotate-180",
            active ? "text-white" : "text-neutral-700",
          )}
        />
      </summary>

      <ul className="absolute left-0 z-20 mt-1 min-w-52 rounded-lg border border-neutral-200 bg-white p-1 shadow-elevation-3">
        {options.map((option) => (
          <li key={option.value}>
            <Link
              href={hrefForOption(option.value)}
              aria-current={option.value === selectedValue ? "true" : undefined}
              className={optionRowClasses(option.value === selectedValue)}
            >
              {option.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
