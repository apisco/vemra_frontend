import Image from "next/image";

import { DotIcon } from "@/components/icons/dot-icon";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import type { Property } from "@/types/property";

export interface PropertyCardProps {
  property: Property;
  sizes?: string;
  className?: string;
}

const DEFAULT_SIZES = "(min-width: 1024px) 384px, (min-width: 768px) 342px, 100vw";

export function PropertyCard({
  property,
  sizes = DEFAULT_SIZES,
  className,
}: PropertyCardProps) {
  const {
    price,
    location,
    propertyType,
    highlight,
    imageSrc,
    imageAlt,
    isVerified,
    isAvailableNow,
    contact,
  } = property;

  return (
    <article
      className={cn(
        "flex flex-col overflow-clip rounded-lg border border-neutral-200 bg-white shadow-elevation-3",
        "transition-shadow hover:shadow-elevation-2",
        className,
      )}
    >
      <div className="relative h-40 w-full shrink-0 md:h-45 lg:h-50">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes={sizes}
          className="object-cover"
        />
        {(isVerified || isAvailableNow) && (
          <div className="absolute top-3 left-3 flex gap-2">
            {isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-caption font-bold text-neutral-900">
                <DotIcon className="size-1.5 text-brand-400" />
                VERIFIED
              </span>
            )}
            {isAvailableNow && (
              <span className="inline-flex items-center rounded-full bg-neutral-900 px-2.5 py-1 text-caption font-bold text-white">
                AVAILABLE NOW
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 lg:p-5">
        <p className="font-display text-[20px] leading-[30px] font-bold text-brand-700 lg:text-[22px] lg:leading-[33px]">
          {price}
        </p>
        <h3 className="text-body-md font-semibold text-neutral-900">{location}</h3>
        <p className="text-body-sm text-neutral-700">
          {highlight ? `${propertyType} · ${highlight}` : propertyType}
        </p>
        <hr className="mt-auto border-neutral-200" />
        <div className="flex items-center gap-2.5">
          <Avatar
            name={contact.name}
            size="sm"
            className="size-6! md:size-8! lg:size-7!"
          />
          <p className="text-label-sm text-neutral-900">
            {contact.name} · {contact.role}
          </p>
        </div>
      </div>
    </article>
  );
}
