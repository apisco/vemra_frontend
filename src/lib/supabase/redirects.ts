import { NextResponse } from "next/server";

import { SIGNED_OUT_PATH } from "@/config/supabase";
import type { AuthErrorReason } from "@/lib/supabase/paths";

export { resolveErrorReason, resolveNextPath } from "@/lib/supabase/paths";
export type { AuthErrorReason } from "@/lib/supabase/paths";

const HOST_PATTERN = /^[a-zA-Z0-9.-]+(?::\d+)?$/;

function resolveOrigin(request: Request): string {
  const { origin } = new URL(request.url);

  if (process.env.NODE_ENV === "development") {
    return origin;
  }

  const forwardedHost = request.headers.get("x-forwarded-host")?.trim();
  if (
    forwardedHost === undefined ||
    forwardedHost === "" ||
    !HOST_PATTERN.test(forwardedHost)
  ) {
    return origin;
  }

  return `https://${forwardedHost}`;
}

export function authRedirectUrl(request: Request, path: string): URL {
  return new URL(path, resolveOrigin(request));
}

export function authErrorUrl(request: Request, reason: AuthErrorReason): URL {
  const url = authRedirectUrl(request, SIGNED_OUT_PATH);
  url.searchParams.set("error", reason);
  return url;
}


export function authRedirect(url: URL, status = 307): NextResponse {
  const response = NextResponse.redirect(url, status);
  response.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate, max-age=0",
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}
