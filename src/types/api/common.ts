export type Iso8601 = string;

export interface Money {
  amount: number;
  currency: string;
}

export interface Paginated<T> {
  items: readonly T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ImageRef {
  url: string;
  alt: string;
}

export interface Address {
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  country: string | null;
  formatted: string;
}

export interface PersonRef {
  id: string;
  name: string;
  initials: string;
  avatarUrl: string | null;
}

export const EMPTY_PAGE: Paginated<never> = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 0,
  hasMore: false,
};
