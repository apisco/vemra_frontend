import "server-only";

import { cache } from "react";

import { SUPABASE_CONFIG } from "@/config/supabase";
import { createClient } from "@/lib/supabase/server";

/**
 * The Supabase access token to forward to the Vemra backend as
 * `Authorization: Bearer <token>`.
 *
 * The backend trusts Supabase-issued tokens (`bearerAuth` in the OpenAPI spec);
 * it does not have its own login. A missing token is an ordinary state, not an
 * error — callers fall back to an unauthenticated request and the backend
 * answers `401`.
 *
 * Wrapped in React `cache()` so the many backend calls a single render or
 * server action makes share one Supabase client and one session lookup instead
 * of re-reading the session per request.
 */
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
