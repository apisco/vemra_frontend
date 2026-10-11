import { redirect } from "next/navigation";

import { homePathFor, requireSession } from "@/lib/api/resources/auth";

export const dynamic = "force-dynamic";

export default async function DashboardDispatchPage() {
  const session = await requireSession("/dashboard");
  redirect(homePathFor(session.user.roles));
}
