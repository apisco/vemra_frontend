import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SUPABASE_CONFIG } from "@/config/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

const PROTECTED_PREFIXES = ["/tenant", "/landlord", "/dashboard"];
const PUBLIC_ONLY_PATHS = new Set(["/login", "/signup", "/signup/details"]);

const ACTIVE_ROLE_COOKIE = "vemra_active_role";
const ROLE_HOME: Record<string, string> = {
  TENANT: "/tenant",
  LANDLORD: "/landlord",
};

const ROLE_DISPATCH_PATH = "/dashboard";

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

function signedInDestination(request: NextRequest): string {
  const active = request.cookies.get(ACTIVE_ROLE_COOKIE)?.value;
  if (active !== undefined && active in ROLE_HOME) {
    return ROLE_HOME[active] as string;
  }
  return ROLE_DISPATCH_PATH;
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
    url.pathname = signedInDestination(request);
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/tenant/:path*",
    "/landlord/:path*",
    "/dashboard",
    "/login",
    "/signup",
    "/signup/details",
  ],
};
