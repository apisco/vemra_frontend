import Image from "next/image";

import { LANDLORD_MANAGE_LISTING } from "@/constants/landlord";
import type { PropertyListing } from "@/constants/landlord";

const { gallery } = LANDLORD_MANAGE_LISTING;

export interface ListingGalleryProps {
  property: PropertyListing;
}

export function ListingGallery({ property }: ListingGalleryProps) {
  const [cover, ...thumbnails] = property.photos;

  return (
    <section aria-label={gallery.label} className="flex flex-col gap-2 md:hidden">
      <Image
        src={cover}
        alt={property.imageAlt}
        width={358}
        height={160}
        sizes="100vw"
        priority
        className="h-40 w-full rounded-lg object-cover"
      />

      <ul className="grid grid-cols-3 gap-2">
        {thumbnails.map((src, index) => (
          <li key={src}>
            <Image
              src={src}
              alt={`${property.name} — photo ${index + 2}`}
              width={114}
              height={48}
              sizes="120px"
              className="h-12 w-full rounded-md object-cover"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
