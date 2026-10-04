import "server-only";

import { cache } from "react";

import { ENDPOINTS } from "@/lib/api/endpoints";
import { isUnauthorized } from "@/lib/api/errors";
import { apiGetDataOptional } from "@/lib/api/server";
import type {
  AccountProfile,
  AccountRole,
  Session,
  SessionUser,
  UserRole,
} from "@/types/api/auth";

/**
 * Account and session reads.
 *
 * Auth is owned by Supabase; the backend only reflects the resulting account at
 * `GET /me`. Everything below is a thin mapping from that one payload, cached
 * with React `cache()` so a layout and the page beneath it share one round trip.
 */

const ROLE_MAP: Record<AccountRole, UserRole> = {
  TENANT: "tenant",
  LANDLORD: "landlord",
  PROPERTY_ADMIN: "property_admin",
  SUPER_ADMIN: "admin",
  SUPPORT: "admin",
};

export function mapAccountRole(role: AccountRole): UserRole {
  return ROLE_MAP[role] ?? "tenant";
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

function toSession(account: AccountProfile): Session {
  const name = account.displayName ?? account.email;
  const roles = [...new Set(account.roles.map(mapAccountRole))];
  const activeRole = roles[0] ?? "tenant";

  const user: SessionUser = {
    id: account.userId,
    name,
    initials: initialsFrom(name),
    email: account.email,
    phone: account.phone,
    avatarUrl: null,
    roles,
    isEmailVerified: account.emailVerified,
    isIdentityVerified: account.onboarding.kycStatus === "APPROVED",
  };

  return { user, activeRole, expiresAt: null };
}

/**
 * The caller's account, or `null` when nobody is signed in.
 *
 * Only a `401` (missing/invalid token) or a `404` resolves to `null`; a
 * transient network failure is *not* treated as signed-out. Folding an outage
 * into `null` would bounce an authenticated user to login — or make a protected
 * layout render as if they had no session — instead of surfacing the real
 * failure to `error.tsx`.
 */
async function readAccount(): Promise<AccountProfile | null> {
  try {
    return await apiGetDataOptional<AccountProfile>(ENDPOINTS.identity.me);
  } catch (error) {
    if (isUnauthorized(error)) {
      return null;
    }
    throw error;
  }
}

export const getAccount = cache(readAccount);

/** The signed-in user mapped into the app's session shape, or `null`. */
export const getSession = cache(async (): Promise<Session | null> => {
  const account = await getAccount();
  return account === null ? null : toSession(account);
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
