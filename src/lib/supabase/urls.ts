import { SUPABASE_AUTH_ROUTES } from "@/config/supabase";

const PENDING_EMAIL_KEY = "vemra.pendingEmail";

export function authCallbackUrl(next: string): string {
  const url = new URL(SUPABASE_AUTH_ROUTES.callback, window.location.origin);
  url.searchParams.set("next", next);
  return url.toString();
}

export function rememberPendingEmail(email: string): void {
  window.sessionStorage.setItem(PENDING_EMAIL_KEY, email);
}

export function readPendingEmail(): string | null {
  return window.sessionStorage.getItem(PENDING_EMAIL_KEY);
}
