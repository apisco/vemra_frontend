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

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageRemotePatterns(),
  },
};

export default nextConfig;
