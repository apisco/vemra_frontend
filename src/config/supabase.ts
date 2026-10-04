function readString(value: string | undefined): string {
  return value?.trim() ?? "";
}

function isValidHttpUrl(value: string): boolean {
  if (value === "") {
    return false;
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const url = readString(process.env.NEXT_PUBLIC_SUPABASE_URL);

const publishableKey =
  readString(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  readString(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const SUPABASE_CONFIG = {
  url,
  publishableKey,
  isConfigured: isValidHttpUrl(url) && publishableKey !== "",
} as const;

export const SUPABASE_AUTH_ROUTES = {
  callback: "/auth/callback",
  signOut: "/auth/signout",
} as const;

export const DEFAULT_SIGNED_IN_PATH = "/tenant";

export const SIGNED_OUT_PATH = "/login";

export function assertSupabaseConfig(): void {
  if (SUPABASE_CONFIG.url === "") {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not set. Copy it from the Supabase dashboard (Project Settings → API) into .env.local.",
    );
  }
  if (!isValidHttpUrl(SUPABASE_CONFIG.url)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be an absolute http(s) URL.",
    );
  }
  if (SUPABASE_CONFIG.publishableKey === "") {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) is not set. Copy it from the Supabase dashboard (Project Settings → API) into .env.local.",
    );
  }
}
