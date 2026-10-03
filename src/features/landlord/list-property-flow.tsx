"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, buttonClasses } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LANDLORD_ROUTES } from "@/constants/landlord";

type Step = "details" | "review" | "published";

interface ListingDetails {
  address: string;
  rent: string;
  availableFrom: string;
  bedrooms: string;
  bathrooms: string;
  description: string;
  amenities: string[];
}

const INITIAL_DETAILS: ListingDetails = {
  address: "4B Maple & 9th",
  rent: "1,450",
  availableFrom: "Sep 15, 2026",
  bedrooms: "2 Bedrooms",
  bathrooms: "1 Bathroom",
  description:
    "A quiet 2-bedroom on the fourth floor with morning light through the living room windows. Recently repainted, with in-unit laundry and a dedicated parking space. Five-minute walk to the 9th Street transit stop.",
  amenities: ["In-unit washer & dryer", "Dedicated parking"],
};

const AMENITIES = [
  "In-unit washer & dryer",
  "Dedicated parking",
  "Central heating",
  "Pet-friendly",
  "Elevator access",
  "Storage unit included",
] as const;

const COVER_IMAGE = "/marketing/hero-maple-9th.png";

function Progress({ step }: { step: Step }) {
  const activeCount = step === "details" ? 1 : step === "review" ? 2 : 3;

  return (
    <div className="flex gap-2" aria-label={`Step ${activeCount} of 3`}>
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={`h-1 flex-1 rounded-full ${
            index < activeCount ? "bg-brand-700" : "bg-neutral-200"
          }`}
        />
      ))}
    </div>
  );
}

function FlowHeader({ step }: { step: Step }) {
  const title =
    step === "details"
      ? "List your property"
      : step === "review"
        ? "Review your listing"
        : "Your listing is live";
  const subtitle =
    step === "details"
      ? "Step 2 of 3 — Property details"
      : step === "review"
        ? "Step 3 of 3 — Confirm details before it goes live"
        : "Your property is now visible to tenants browsing Vemra.";

  return (
    <header className="flex flex-col gap-1">
      <h1 className="font-display text-heading-lg font-bold text-neutral-900 md:text-heading-xl">
        {title}
      </h1>
      <p className="text-body-sm text-neutral-700">{subtitle}</p>
      {step !== "published" ? <Progress step={step} /> : null}
    </header>
  );
}

export function ListPropertyFlow({
  initialStep,
}: {
  initialStep: Step;
}) {
  const router = useRouter();
  const [step, setStep] = useState(initialStep);
  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [isPublishing, setIsPublishing] = useState(false);

  function update(field: keyof ListingDetails, value: string) {
    setDetails((current) => ({ ...current, [field]: value }));
  }

  function goTo(next: Step) {
    setStep(next);
    router.replace(`${LANDLORD_ROUTES.newProperty}?step=${next}`);
  }

  if (step === "published") {
    return (
      <div className="mx-auto flex w-full max-w-85 flex-col items-center gap-6 py-8 text-center md:py-16">
        <div className="flex size-16 items-center justify-center rounded-xl bg-brand-50 text-heading-lg text-brand-700">
          ✓
        </div>
        <FlowHeader step={step} />
        <div className="flex w-full items-center gap-3 rounded-md border border-neutral-200 bg-white p-3 text-left">
          <Image
            src={COVER_IMAGE}
            alt=""
            width={56}
            height={56}
            className="size-14 rounded-sm object-cover"
          />
          <div className="min-w-0">
            <p className="text-body-sm font-semibold text-brand-700">
              ₦{details.rent} / yr
            </p>
            <p className="truncate text-label-md text-neutral-900">
              Unit 4B, Maple & 9th
            </p>
          </div>
        </div>
        <div className="flex w-full gap-2">
          <Link
            href={`${LANDLORD_ROUTES.properties}/unit-4b-maple-9th`}
            className={buttonClasses({
              variant: "secondary",
              size: "sm",
              className: "flex-1",
            })}
          >
            View listing
          </Link>
          <Link
            href={LANDLORD_ROUTES.overview}
            className={buttonClasses({ size: "sm", className: "flex-1" })}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="flex flex-col gap-5 md:gap-6">
        <FlowHeader step={step} />
        <div className="grid gap-5 md:grid-cols-[225px_1fr]">
          <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <Image
              src={COVER_IMAGE}
              alt="Living room at Unit 4B, Maple & 9th"
              width={450}
              height={240}
              className="h-30 w-full object-cover"
            />
            <div className="flex flex-col gap-1 p-3">
              <p className="text-body-md font-bold text-brand-700">
                ₦{details.rent} / year
              </p>
              <p className="text-label-md font-semibold text-neutral-900">
                2-bed apartment · Unit 4B, Maple & 9th
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 md:p-5">
            <h2 className="text-body-md font-semibold text-neutral-900">
              Summary
            </h2>
            {[
              ["Bedrooms/Bathrooms", "2 bed · 1 bath"],
              ["Available from", details.availableFrom],
              ["Amenities", "Washer/dryer, parking + 2 more"],
              ["Photos", "4 uploaded"],
              ["Property Admin assignment", "Pending Vemra review"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between gap-4 text-label-sm"
              >
                <span className="text-neutral-700">{label}</span>
                <span className="text-right font-semibold text-neutral-900">
                  {value}
                </span>
              </div>
            ))}
            <button
              type="button"
              onClick={() => goTo("details")}
              className="self-start text-label-md font-semibold text-brand-700"
            >
              Edit any of these →
            </button>
          </section>
        </div>

        <div className="rounded-md border border-brand-200 bg-brand-50 p-3 text-label-sm text-neutral-800">
          <span className="mr-2 text-brand-700">●</span>
          This listing will show the verified badge since your landlord account
          is already verified. It&apos;ll be visible in search within a few
          minutes of publishing.
        </div>

        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={() => goTo("details")}
            className="text-label-md font-semibold text-brand-700"
          >
            Back
          </button>
          <Button
            size="sm"
            isLoading={isPublishing}
            onClick={async () => {
              setIsPublishing(true);
              await Promise.resolve();
              goTo("published");
            }}
          >
            Publish listing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-5 md:gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        goTo("review");
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <FlowHeader step={step} />
        <button
          type="button"
          onClick={() => router.push(LANDLORD_ROUTES.overview)}
          className="shrink-0 text-label-md font-semibold text-brand-700"
        >
          Save and exit
        </button>
      </div>

      <section className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 md:gap-5 md:p-6">
        <div>
          <h2 className="text-body-md font-semibold text-neutral-900">
            Basic details
          </h2>
          <p className="mt-1 text-label-sm text-neutral-700">
            This appears at the top of your listing.
          </p>
        </div>
        <Input
          label="Address"
          name="address"
          value={details.address}
          onChange={(event) => update("address", event.target.value)}
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Monthly rent (₦)"
            name="rent"
            inputMode="decimal"
            value={details.rent}
            onChange={(event) => update("rent", event.target.value)}
            required
          />
          <Input
            label="Available from"
            name="availableFrom"
            value={details.availableFrom}
            onChange={(event) => update("availableFrom", event.target.value)}
            required
          />
          <label className="flex flex-col gap-1.5 text-label-md font-semibold text-neutral-800">
            Bedrooms
            <select
              value={details.bedrooms}
              onChange={(event) => update("bedrooms", event.target.value)}
              className="h-11 rounded-md border border-neutral-200 bg-white px-3 text-body-md font-normal outline-none focus:border-brand-700"
            >
              <option>1 Bedroom</option>
              <option>2 Bedrooms</option>
              <option>3 Bedrooms</option>
              <option>4 Bedrooms</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-label-md font-semibold text-neutral-800">
            Bathrooms
            <select
              value={details.bathrooms}
              onChange={(event) => update("bathrooms", event.target.value)}
              className="h-11 rounded-md border border-neutral-200 bg-white px-3 text-body-md font-normal outline-none focus:border-brand-700"
            >
              <option>1 Bathroom</option>
              <option>2 Bathrooms</option>
              <option>3 Bathrooms</option>
            </select>
          </label>
        </div>
        <Textarea
          label="Description"
          name="description"
          value={details.description}
          onChange={(event) => update("description", event.target.value)}
          fieldClassName="min-h-28"
          required
        />
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 md:p-6">
        <div>
          <h2 className="text-body-md font-semibold text-neutral-900">
            Amenities
          </h2>
          <p className="mt-1 text-label-sm text-neutral-700">
            Select everything that applies.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {AMENITIES.map((amenity) => {
            const checked = details.amenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center gap-2 text-label-md text-neutral-800"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setDetails((current) => ({
                      ...current,
                      amenities: checked
                        ? current.amenities.filter((item) => item !== amenity)
                        : [...current.amenities, amenity],
                    }))
                  }
                  className="size-4 accent-brand-700"
                />
                {amenity}
              </label>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 md:p-6">
        <div>
          <h2 className="text-body-md font-semibold text-neutral-900">Photos</h2>
          <p className="mt-1 text-label-sm text-neutral-700">
            Add at least 3 photos. The first will be the cover image.
          </p>
        </div>
        <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-neutral-300 bg-neutral-50 text-center">
          <span className="text-body-md text-brand-700">▧</span>
          <span className="text-label-md font-semibold text-neutral-900">
            Click to upload or drag photos here
          </span>
          <span className="text-label-sm text-neutral-700">
            PNG, JPG up to 10MB each
          </span>
          <input type="file" accept="image/png,image/jpeg" multiple className="sr-only" />
        </label>
      </section>

      <div className="flex items-center justify-between gap-3">
        <Link
          href={LANDLORD_ROUTES.properties}
          className="text-label-md font-semibold text-brand-700"
        >
          Back
        </Link>
        <Button type="submit" size="sm">
          Continue to review
        </Button>
      </div>
    </form>
  );
}
