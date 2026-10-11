const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

export const CAPTCHA_CONFIG = {
  siteKey,
  isEnabled: siteKey !== "" && process.env.NODE_ENV !== "development",
} as const;

export const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";
