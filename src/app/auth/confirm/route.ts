import type { EmailOtpType } from "@supabase/supabase-js";

import { DEFAULT_SIGNED_IN_PATH, SUPABASE_CONFIG } from "@/config/supabase";
import {
  authErrorUrl,
  authRedirect,
  authRedirectUrl,
  resolveNextPath,
} from "@/lib/supabase/redirects";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = resolveNextPath(searchParams.get("next"), DEFAULT_SIGNED_IN_PATH);

  if (
    !SUPABASE_CONFIG.isConfigured ||
    tokenHash === null ||
    tokenHash === "" ||
    type === null ||
    type === ""
  ) {
    return authRedirect(authErrorUrl(request, "invalid_link"));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type: type as EmailOtpType,
    token_hash: tokenHash,
  });

  if (error) {
    return authRedirect(authErrorUrl(request, "verification_failed"));
  }

  return authRedirect(authRedirectUrl(request, next));
}
