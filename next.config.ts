import type { NextConfig } from "next";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

/**
 * Hosts allowed to serve `next/image` sources. Backend data returns absolute
 * image URLs, so every host they can live on has to be declared here or the
 * image component throws at runtime.
 *
 * The API origin is derived from `NEXT_PUBLIC_API_BASE_URL`; extra CDN hosts
 * can be added as a comma-separated `NEXT_PUBLIC_IMAGE_HOSTS`.
 */
function imageRemotePatterns(): RemotePattern[] {
  const patterns: RemotePattern[] = [];

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (apiBase) {
    try {
      const url = new URL(apiBase);
      patterns.push({
        protocol: url.protocol === "http:" ? "http" : "https",
        hostname: url.hostname,
        pathname: "/**",
      });
    } catch {
      // Ignore a malformed base URL; `src/config/api.ts` fails fast in prod.
    }
  }

  for (const host of (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "").split(",")) {
    const hostname = host.trim();
    if (hostname !== "") {
      patterns.push({ protocol: "https", hostname, pathname: "/**" });
    }
  }

  return patterns;
}

/**
 * Auth is Supabase-only, and `src/proxy.ts` returns 503 for every auth and
 * guarded route when it is unconfigured. Fail the production build instead of
 * shipping an app that cannot sign anyone in; `next dev` is unaffected.
 */
function assertProductionAuthConfig(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    "";

  if (url === "" || key === "") {
    throw new Error(
      "Supabase auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) before a production build; without them every auth and guarded route returns 503.",
    );
  }
}

assertProductionAuthConfig();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageRemotePatterns(),
  },
};

export default nextConfig;
