import { AuthError } from "@supabase/supabase-js";

const MESSAGES: Readonly<Record<string, string>> = {
  invalid_credentials: "Incorrect email or password.",
  email_not_confirmed: "Confirm your email address before signing in.",
  user_already_exists: "An account with this email already exists.",
  email_exists: "An account with this email already exists.",
  weak_password: "Choose a stronger password.",
  same_password: "Choose a password you have not used before.",
  over_email_send_rate_limit:
    "Too many attempts. Please wait a moment and try again.",
  over_request_rate_limit:
    "Too many attempts. Please wait a moment and try again.",
  session_not_found: "This link has expired. Request a new one.",
  refresh_token_not_found: "This link has expired. Request a new one.",
};

export function supabaseErrorMessage(error: unknown): string {
  if (!(error instanceof AuthError)) {
    return "Something went wrong. Please try again.";
  }

  const message = error.code === undefined ? undefined : MESSAGES[error.code];
  if (message !== undefined) {
    return message;
  }

  return error.message === ""
    ? "Something went wrong. Please try again."
    : error.message;
}
