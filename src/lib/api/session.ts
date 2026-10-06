import "server-only";

import { cache } from "react";

import { SUPABASE_CONFIG } from "@/config/supabase";
import { createClient } from "@/lib/supabase/server";


export const getAccessToken = cache(async (): Promise<string | null> => {
  if (!SUPABASE_CONFIG.isConfigured) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error !== null || data.session === null) {
    return null;
  }

  return data.session.access_token;
});
