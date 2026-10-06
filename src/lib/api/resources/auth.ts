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



const ROLE_MAP: Partial<Record<AccountRole, UserRole>> = {
  TENANT: "TENANT",
  LANDLORD: "LANDLORD",
};

export function mapAccountRole(role: AccountRole): UserRole | null {
  return ROLE_MAP[role] ?? null;
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
  const roles = [
    ...new Set(
      account.roles
        .map(mapAccountRole)
        .filter((role): role is UserRole => role !== null),
    ),
  ];
  const activeRole = roles[0] ?? "TENANT";

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


export const getSession = cache(async (): Promise<Session | null> => {
  const account = await getAccount();
  return account === null ? null : toSession(account);
});


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
