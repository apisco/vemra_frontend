import "server-only";

import { cache } from "react";

import { SUPABASE_CONFIG } from "@/config/supabase";
import { createClient } from "@/lib/supabase/server";

export interface VerifiedSession {
  userId: string;
  email: string | null;
  accessToken: string;
  assuranceLevel: string;
  authenticatedAt: number | null;
}

function readAuthenticatedAt(amr: unknown): number | null {
  if (!Array.isArray(amr)) {
    return null;
  }
  const timestamps = amr.flatMap((entry) => {
    if (entry === null || typeof entry !== "object") {
      return [];
    }
    const value = (entry as { timestamp?: unknown }).timestamp;
    return typeof value === "number" && Number.isFinite(value) ? [value] : [];
  });
  return timestamps.length === 0 ? null : Math.max(...timestamps);
}

export const getVerifiedSession = cache(
  async (): Promise<VerifiedSession | null> => {
    if (!SUPABASE_CONFIG.isConfigured) {
      return null;
    }

    const supabase = await createClient();

    const claimsResult = await supabase.auth.getClaims();
    if (claimsResult.error === null && claimsResult.data !== null) {
      const { claims } = claimsResult.data;
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token ?? null;
      if (accessToken !== null) {
        return {
          userId: claims.sub,
          email: typeof claims.email === "string" ? claims.email : null,
          accessToken,
          assuranceLevel: claims.aal,
          authenticatedAt: readAuthenticatedAt(claims.amr),
        };
      }
    }

    const { data, error } = await supabase.auth.getUser();
    if (error !== null || data.user === null) {
      return null;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token ?? null;
    if (accessToken === null) {
      return null;
    }

    return {
      userId: data.user.id,
      email: data.user.email ?? null,
      accessToken,
      assuranceLevel: "aal1",
      authenticatedAt: null,
    };
  },
);

export const getAccessToken = cache(async (): Promise<string | null> => {
  const session = await getVerifiedSession();
  return session?.accessToken ?? null;
});
