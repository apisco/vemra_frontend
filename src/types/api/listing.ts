import type { ImageRef, Iso8601, Money } from "@/types/api/common";
export type RentPeriod = "year" | "month";

export interface ListingContact {
  id: string;
  name: string;
  initials: string;
  role: string;
  avatarUrl: string | null;
  responseTime: string | null;
  profileHref: string | null;
}

export interface ListingOwner {
  name: string;
  isVerified: boolean;
  onVemraSince: string | null;
}

export interface ListingSummary {
  id: string;
  title: string;
  propertyType: string;
  location: string;
  rent: Money;
  rentPeriod: RentPeriod;
  bedrooms: number | null;
  highlight: string | null;
  coverImage: ImageRef | null;
  isVerified: boolean;
  isAvailableNow: boolean;
  contact: ListingContact | null;
}

export interface ListingStat {
  label: string;
  value: string;
}

export interface Listing extends ListingSummary {
  description: string;
  bathrooms: number | null;
  floorArea: string | null;
  availableFrom: Iso8601 | null;
  photos: readonly ImageRef[];
  amenities: readonly string[];
  owner: ListingOwner | null;
  stats: readonly ListingStat[];
}

export interface ListingFilters {
  query?: string;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  location?: string;
  verifiedOnly?: boolean;
  availableNow?: boolean;
  page?: number;
  pageSize?: number;
}

export interface AppliedFilter {
  id: string;
  label: string;
}

export interface PublicProfile {
  id: string;
  name: string;
  initials: string;
  avatarUrl: string | null;
  role: string;
  area: string | null;
  bio: string;
  isVerified: boolean;
  stats: readonly ListingStat[];
  managedListings: readonly ListingSummary[];
}
