import type { Iso8601, Money } from "@/types/api/common";

const LOCALE = "en-NG";

export const EMPTY_VALUE = "—";

function parseDate(value: Iso8601 | null | undefined): Date | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export interface FormatMoneyOptions {
  showDecimals?: boolean;
  compact?: boolean;
  signed?: boolean;
}

export function formatMoney(
  money: Money | null | undefined,
  { showDecimals = false, compact = false, signed = false }: FormatMoneyOptions = {},
): string {
  if (money === null || money === undefined) {
    return EMPTY_VALUE;
  }

  const major = money.amount / 100;
  const fractionDigits = showDecimals ? 2 : 0;

  const formatted = new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: money.currency,
    notation: compact ? "compact" : "standard",
    minimumFractionDigits: compact ? 0 : fractionDigits,
    maximumFractionDigits: compact ? 1 : fractionDigits,
  }).format(major);

  return signed && major > 0 ? `+${formatted}` : formatted;
}

export function formatRent(
  money: Money | null | undefined,
  period: "year" | "month" | null | undefined,
  options?: FormatMoneyOptions,
): string {
  const amount = formatMoney(money, options);
  if (amount === EMPTY_VALUE || period === null || period === undefined) {
    return amount;
  }
  return `${amount} / ${period}`;
}

export type DateStyle =
  | "short"
  | "medium"
  | "long"
  | "monthYear";

const DATE_FORMATS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  short: { month: "short", day: "numeric" },
  medium: { month: "short", day: "numeric", year: "numeric" },
  long: { month: "long", day: "numeric", year: "numeric" },
  monthYear: { month: "short", year: "numeric" },
};

export function formatDate(
  value: Iso8601 | null | undefined,
  style: DateStyle = "medium",
): string {
  const date = parseDate(value);
  return date === null
    ? EMPTY_VALUE
    : new Intl.DateTimeFormat(LOCALE, DATE_FORMATS[style]).format(date);
}

export function formatDateTime(value: Iso8601 | null | undefined): string {
  const date = parseDate(value);
  return date === null
    ? EMPTY_VALUE
    : new Intl.DateTimeFormat(LOCALE, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
}

const MS_PER_DAY = 86_400_000;

export function formatRelativeDate(
  value: Iso8601 | null | undefined,
  now: Date = new Date(),
): string {
  const date = parseDate(value);
  if (date === null) {
    return EMPTY_VALUE;
  }

  const startOf = (input: Date) =>
    Date.UTC(input.getFullYear(), input.getMonth(), input.getDate());
  const days = Math.round((startOf(date) - startOf(now)) / MS_PER_DAY);

  if (days === 0) {
    return "today";
  }

  const formatter = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });

  if (Math.abs(days) < 7) {
    return formatter.format(days, "day");
  }
  if (Math.abs(days) < 30) {
    return formatter.format(Math.round(days / 7), "week");
  }
  if (Math.abs(days) < 365) {
    return formatter.format(Math.round(days / 30), "month");
  }
  return formatter.format(Math.round(days / 365), "year");
}


export function daysUntil(
  value: Iso8601 | null | undefined,
  now: Date = new Date(),
): number | null {
  const date = parseDate(value);
  if (date === null) {
    return null;
  }
  const startOf = (input: Date) =>
    Date.UTC(input.getFullYear(), input.getMonth(), input.getDate());
  return Math.round((startOf(date) - startOf(now)) / MS_PER_DAY);
}

export function formatPercent(
  ratio: number | null | undefined,
  fractionDigits = 0,
): string {
  if (ratio === null || ratio === undefined || !Number.isFinite(ratio)) {
    return EMPTY_VALUE;
  }
  return new Intl.NumberFormat(LOCALE, {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(ratio);
}

export function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return EMPTY_VALUE;
  }
  return new Intl.NumberFormat(LOCALE).format(value);
}

export function formatRatio(part: number, total: number): string {
  return `${formatCount(part)} of ${formatCount(total)}`;
}

export function ratioOf(part: number, total: number): number {
  if (!Number.isFinite(part) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }
  return Math.min(1, Math.max(0, part / total));
}

export function percentOf(part: number, total: number): number {
  return Math.round(ratioOf(part, total) * 100);
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "";
  }
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${formatCount(count)} ${count === 1 ? singular : plural}`;
}
