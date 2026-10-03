import "server-only";

import { cache } from "react";

import { ENDPOINTS } from "@/lib/api/endpoints";
import { isUnauthorized } from "@/lib/api/errors";
import { apiGet, apiGetOptional } from "@/lib/api/server";
import { hasSessionCookie } from "@/lib/api/session";
import type {
  OnboardingWelcome,
  Session,
  UserRole,
  VerificationStatus,
} from "@/types/api/auth";

/**
 * Session and verification reads.
 *
 * Wrapped in React `cache()` so a layout and the page beneath it can each call
 * `getSession()` within one request without a second round trip.
 */

/**
 * The signed-in user, or `null` when nobody is signed in.
 *
 * A missing session is an ordinary state for a public page, not an error, so a
 * `401` resolves to `null` here. Every other failure still throws and reaches
 * the nearest `error.tsx`.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  if (!(await hasSessionCookie())) {
    return null;
  }

  try {
    return await apiGet<Session>(ENDPOINTS.auth.session);
  } catch (error) {
    if (isUnauthorized(error)) {
      return null;
    }
    throw error;
  }
});

/**
 * The session, or a redirect to login.
 *
 * Use in authenticated layouts so every page beneath can assume a user. The
 * `next` parameter sends the user back where they were headed after login.
 */
export const requireSession = cache(
  async (redirectTo?: string): Promise<Session> => {
    const session = await getSession();
    if (session !== null) {
      return session;
    }

    const { redirect } = await import("next/navigation");
    const target =
      redirectTo === undefined
        ? "/login"
        : `/login?next=${encodeURIComponent(redirectTo)}`;
    return redirect(target);
  },
);

export const getVerificationStatus = cache(
  async (): Promise<VerificationStatus | null> =>
    apiGetOptional<VerificationStatus>(ENDPOINTS.auth.verification),
);

export const getOnboarding = cache(
  async (role: UserRole): Promise<OnboardingWelcome | null> =>
    apiGetOptional<OnboardingWelcome>(ENDPOINTS.onboarding.welcome(role)),
);
