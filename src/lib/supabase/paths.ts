export type AuthErrorReason =
  | "access_denied"
  | "missing_code"
  | "exchange_failed"
  | "invalid_link"
  | "verification_failed";

function hasUnsafeCharacters(value: string): boolean {
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (code <= 0x1f || code === 0x7f || character === "\\") {
      return true;
    }
  }
  return false;
}

export function resolveNextPath(raw: string | null, fallback: string): string {
  if (raw === null) {
    return fallback;
  }

  const value = raw.trim();
  if (
    value === "" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    hasUnsafeCharacters(value)
  ) {
    return fallback;
  }

  return value;
}

export function resolveErrorReason(raw: string | null): AuthErrorReason {
  return raw === "access_denied" ? "access_denied" : "exchange_failed";
}
