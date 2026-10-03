"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";

import { Button, buttonClasses } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LANDLORD_MANAGE_LISTING, LANDLORD_ROUTES } from "@/constants/landlord";
import type { PropertyListing } from "@/constants/landlord";

const { details, danger, footer } = LANDLORD_MANAGE_LISTING;

async function submitDemoChanges(): Promise<void> {
  return Promise.resolve();
}

export interface ManageListingFormProps {
  property: PropertyListing;
  adminPanel?: ReactNode;
}

export function ManageListingForm({
  property,
  adminPanel,
}: ManageListingFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUnlisting, setIsUnlisting] = useState(false);

  const isBusy = isSaving || isUnlisting;

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSaving(true);

        await submitDemoChanges();
        router.push(LANDLORD_ROUTES.properties);
      }}
      className="flex flex-col gap-4 md:gap-8"
    >
      <section
        aria-labelledby="listing-details-title"
        className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 md:gap-6 md:p-6"
      >
        <h2
          id="listing-details-title"
          className="font-display text-heading-sm font-semibold text-neutral-900"
        >
          {details.title}
        </h2>

        <div className="flex flex-col gap-4">
          <Input
            label={details.addressLabel}
            name="address"
            defaultValue={property.name}
            autoComplete="street-address"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label={details.rentLabel}
              name="rent"
              defaultValue={property.rentValue}
              inputMode="decimal"
            />
            <Input
              label={details.bedroomsLabel}
              name="bedrooms"
              defaultValue={property.bedrooms}
            />
          </div>

          <Textarea
            label={details.descriptionLabel}
            name="description"
            defaultValue={property.description}
            fieldClassName="h-25 md:h-20"
          />
        </div>
      </section>

      {adminPanel}

      <section
        aria-labelledby="listing-danger-title"
        className="flex flex-col gap-4 rounded-lg border border-error-600 bg-error-50 p-4 md:flex-row md:items-center md:justify-between md:gap-6 md:p-6"
      >
        <div className="min-w-0">
          <h2
            id="listing-danger-title"
            className="text-body-md font-semibold text-error-600"
          >
            {danger.title}
          </h2>
          <p className="text-body-sm text-neutral-800">{danger.description}</p>
        </div>

        <Button
          variant="destructive"
          size="sm"
          isLoading={isUnlisting}
          disabled={isBusy}
          className="max-md:h-9 max-md:w-full md:shrink-0"
          onClick={async () => {
            setIsUnlisting(true);

            await submitDemoChanges();
            router.push(LANDLORD_ROUTES.properties);
          }}
        >
          {danger.action}
        </Button>
      </section>

      <div className="flex gap-4 md:justify-end">
        <Link
          href={LANDLORD_ROUTES.properties}
          className={buttonClasses({
            variant: "secondary",
            className: "max-md:flex-1",
          })}
        >
          {footer.cancel}
        </Link>

        <Button
          type="submit"
          isLoading={isSaving}
          disabled={isBusy}
          className="max-md:flex-1"
        >
          {footer.save}
        </Button>
      </div>
    </form>
  );
}
