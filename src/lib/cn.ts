type ClassValue = string | false | null | undefined;

/**
 * Joins conditional class names into a single string.
 * Dependency-free stand-in for `clsx` — keeps the bundle free of an extra package.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter((value): value is string => Boolean(value)).join(" ");
}
