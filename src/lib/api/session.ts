import "server-only";

import { cookies } from "next/headers";

const DEFAULT_SESSION_COOKIE = "vemra_session";

export const SESSION_COOKIE =
  process.env.SESSION_COOKIE_NAME?.trim() || DEFAULT_SESSION_COOKIE;

export async function readSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function hasSessionCookie(): Promise<boolean> {
  const store = await cookies();
  return store.has(SESSION_COOKIE);
}

export async function sessionCookieHeader(): Promise<string | null> {
  const token = await readSessionToken();
  return token === null ? null : `${SESSION_COOKIE}=${token}`;
}

export interface SetSessionOptions {
  expiresAt?: string | null;
}

export async function setSessionCookie(
  token: string,
  { expiresAt }: SetSessionOptions = {},
): Promise<void> {
  const store = await cookies();
  const expires =
    expiresAt === undefined || expiresAt === null
      ? undefined
      : new Date(expiresAt);

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(expires !== undefined && !Number.isNaN(expires.getTime())
      ? { expires }
      : {}),
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
