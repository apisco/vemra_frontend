import { createServerClient } from "@supabase/ssr";
import type { CookieMethodsServer } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_CONFIG, assertSupabaseConfig } from "@/config/supabase";

export function createSupabaseServerClient(
  cookies: CookieMethodsServer,
): SupabaseClient {
  assertSupabaseConfig();

  return createServerClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.publishableKey,
    { cookies },
  );
}
