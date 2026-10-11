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

export const ACTIVE_ROLE_COOKIE = "vemra_active_role";

const ROLE_MAP: Partial<Record<AccountRole, UserRole>> = {
  TENANT: "TENANT",
  LANDLORD: "LANDLORD",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  TENANT: "Tenant",
  LANDLORD: "Landlord",
};

export const ROLE_HOME: Record<UserRole, string> = {
  TENANT: "/tenant",
  LANDLORD: "/landlord",
};

export function mapAccountRole(role: AccountRole): UserRole | null {
  return ROLE_MAP[role] ?? null;
}

export function isUserRole(value: unknown): value is UserRole {
  return value === "TENANT" || value === "LANDLORD";
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

async function readActiveRoleCookie(): Promise<UserRole | null> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const value = store.get(ACTIVE_ROLE_COOKIE)?.value;
  return isUserRole(value) ? value : null;
}

async function toSession(account: AccountProfile): Promise<Session> {
  const name = account.displayName ?? account.email;
  const roles = [
    ...new Set(
      account.roles
        .map(mapAccountRole)
        .filter((role): role is UserRole => role !== null),
    ),
  ];

  const requested = await readActiveRoleCookie();
  const activeRole =
    requested !== null && roles.includes(requested)
      ? requested
      : (roles[0] ?? "TENANT");

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

export function homePathFor(roles: readonly UserRole[]): string {
  const first = roles[0];
  return first === undefined ? "/login" : ROLE_HOME[first];
}

export async function requireRole(
  role: UserRole,
  redirectTo?: string,
): Promise<Session> {
  const session = await requireSession(redirectTo);

  if (session.user.roles.includes(role)) {
    return session.activeRole === role
      ? session
      : { ...session, activeRole: role };
  }

  const { redirect } = await import("next/navigation");
  return redirect(homePathFor(session.user.roles));
}
