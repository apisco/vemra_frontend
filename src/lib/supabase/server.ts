import "server-only";

import { cookies } from "next/headers";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createSupabaseServerClient({
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      } catch {}
    },
  });
}
