import { DEFAULT_SIGNED_IN_PATH, SUPABASE_CONFIG } from "@/config/supabase";
import {
  authErrorUrl,
  authRedirect,
  authRedirectUrl,
  resolveErrorReason,
  resolveNextPath,
} from "@/lib/supabase/redirects";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const next = resolveNextPath(searchParams.get("next"), DEFAULT_SIGNED_IN_PATH);

  if (!SUPABASE_CONFIG.isConfigured) {
    return authRedirect(authErrorUrl(request, "exchange_failed"));
  }

  if (errorParam !== null && errorParam !== "") {
    return authRedirect(authErrorUrl(request, resolveErrorReason(errorParam)));
  }

  if (code === null || code === "") {
    return authRedirect(authErrorUrl(request, "missing_code"));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return authRedirect(authErrorUrl(request, "exchange_failed"));
  }

  return authRedirect(authRedirectUrl(request, next));
}
