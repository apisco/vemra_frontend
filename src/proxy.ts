import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { DEFAULT_SIGNED_IN_PATH, SUPABASE_CONFIG } from "@/config/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

const PROTECTED_PREFIXES = ["/tenant", "/landlord"];
const PUBLIC_ONLY_PATHS = new Set(["/login", "/signup", "/signup/details"]);

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function unconfiguredResponse(): NextResponse {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Authentication is not configured.", {
      status: 503,
    });
  }
  return NextResponse.next();
}

export async function proxy(request: NextRequest) {
  if (!SUPABASE_CONFIG.isConfigured) {
    return unconfiguredResponse();
  }

  let response = NextResponse.next({ request });

  const supabase = createSupabaseServerClient({
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      for (const { name, value } of cookiesToSet) {
        request.cookies.set(name, value);
      }
      response = NextResponse.next({ request });
      for (const { name, value, options } of cookiesToSet) {
        response.cookies.set(name, value, options);
      }
    },
  });

  const { data } = await supabase.auth.getUser();
  const { pathname, search } = request.nextUrl;

  if (
    data.user === null &&
    PROTECTED_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (data.user !== null && PUBLIC_ONLY_PATHS.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = DEFAULT_SIGNED_IN_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/tenant/:path*",
    "/landlord/:path*",
    "/login",
    "/signup",
    "/signup/details",
  ],
};
