import "client-only";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_CONFIG, assertSupabaseConfig } from "@/config/supabase";

export function createClient(): SupabaseClient {
  assertSupabaseConfig();

  return createBrowserClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.publishableKey,
  );
}
