import { switchActiveRoleAction } from "@/lib/api/actions/active-role";
import { ROLE_LABELS } from "@/lib/api/resources/auth";
import type { UserRole } from "@/types/api/auth";

export interface RoleSwitcherProps {
  roles: readonly UserRole[];
  activeRole: UserRole;
}

export function RoleSwitcher({ roles, activeRole }: RoleSwitcherProps) {
  if (roles.length < 2) {
    return null;
  }

  const target = roles.find((role) => role !== activeRole);
  if (target === undefined) {
    return null;
  }

  return (
    <form action={switchActiveRoleAction}>
      <input type="hidden" name="role" value={target} />
      <button
        type="submit"
        className="rounded-sm text-label-sm font-semibold text-brand-700 transition-colors hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        Switch to {ROLE_LABELS[target]}
      </button>
    </form>
  );
}
