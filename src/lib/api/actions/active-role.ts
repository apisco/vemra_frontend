"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ACTIVE_ROLE_COOKIE,
  ROLE_HOME,
  getSession,
  isUserRole,
} from "@/lib/api/resources/auth";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function switchActiveRoleAction(formData: FormData): Promise<void> {
  const requested = formData.get("role");

  if (!isUserRole(requested)) {
    redirect("/login");
  }

  const session = await getSession();
  if (session === null || !session.user.roles.includes(requested)) {
    redirect("/login");
  }

  const store = await cookies();
  store.set(ACTIVE_ROLE_COOKIE, requested, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
  });

  redirect(ROLE_HOME[requested]);
}
