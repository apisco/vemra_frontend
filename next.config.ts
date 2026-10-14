import type { NextConfig } from "next";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

const CLOUDINARY_UPLOAD_ORIGIN = "https://api.cloudinary.com";
const CLOUDINARY_IMAGE_ORIGIN = "https://res.cloudinary.com";
const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";
const PAYSTACK_SCRIPT_ORIGIN = "https://js.paystack.co";
const PAYSTACK_CHECKOUT_ORIGINS = [
  "https://checkout.paystack.com",
  "https://standard.paystack.co",
];
const PAYSTACK_API_ORIGIN = "https://api.paystack.co";

function originOf(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (trimmed === undefined || trimmed === "") {
    return null;
  }
  try {
    return new URL(trimmed).origin;
  } catch {
    return null;
  }
}

function imageHosts(): string[] {
  return (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter((host) => host !== "");
}

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
      patterns.length = 0;
    }
  }

  patterns.push({
    protocol: "https",
    hostname: "res.cloudinary.com",
    pathname: "/**",
  });

  for (const hostname of imageHosts()) {
    patterns.push({ protocol: "https", hostname, pathname: "/**" });
  }

  return patterns;
}

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

function contentSecurityPolicy(): string {
  const isDev = process.env.NODE_ENV !== "production";

  const supabaseOrigin = originOf(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseSocket =
    supabaseOrigin === null
      ? null
      : supabaseOrigin.replace(/^https:/, "wss:").replace(/^http:/, "ws:");
  const apiOrigin = originOf(process.env.NEXT_PUBLIC_API_BASE_URL);
  const sentryOrigin = originOf(process.env.NEXT_PUBLIC_SENTRY_DSN);

  const httpsImageHosts = imageHosts().map((host) => `https://${host}`);

  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    TURNSTILE_ORIGIN,
    PAYSTACK_SCRIPT_ORIGIN,
  ];

  const connectSrc = [
    "'self'",
    supabaseOrigin,
    supabaseSocket,
    apiOrigin,
    sentryOrigin,
    CLOUDINARY_UPLOAD_ORIGIN,
    PAYSTACK_API_ORIGIN,
    ...PAYSTACK_CHECKOUT_ORIGINS,
    TURNSTILE_ORIGIN,
  ].filter((value): value is string => value !== null);

  const imgSrc = [
    "'self'",
    "data:",
    "blob:",
    apiOrigin,
    CLOUDINARY_IMAGE_ORIGIN,
    ...httpsImageHosts,
  ].filter((value): value is string => value !== null);

  const directives: Array<[string, string[]] | [string]> = [
    ["default-src", ["'self'"]],
    ["base-uri", ["'self'"]],
    ["object-src", ["'none'"]],
    ["frame-ancestors", ["'none'"]],
    ["form-action", ["'self'", ...PAYSTACK_CHECKOUT_ORIGINS]],
    ["script-src", scriptSrc],
    ["style-src", ["'self'", "'unsafe-inline'"]],
    ["img-src", imgSrc],
    ["media-src", imgSrc],
    ["font-src", ["'self'", "data:"]],
    ["connect-src", connectSrc],
    [
      "frame-src",
      ["'self'", TURNSTILE_ORIGIN, ...PAYSTACK_CHECKOUT_ORIGINS],
    ],
    ["worker-src", ["'self'", "blob:"]],
    ["manifest-src", ["'self'"]],
    ...(isDev ? [] : [["upgrade-insecure-requests"] as [string]]),
  ];

  return directives
    .map((directive) =>
      directive.length === 1
        ? directive[0]
        : `${directive[0]} ${directive[1].join(" ")}`,
    )
    .join("; ");
}

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy() },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageRemotePatterns(),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
