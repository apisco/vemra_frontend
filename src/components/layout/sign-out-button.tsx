import { LogOutIcon } from "@/components/icons/log-out-icon";
import { SUPABASE_AUTH_ROUTES } from "@/config/supabase";
import { cn } from "@/lib/cn";

export type SignOutTone = "dark" | "light";

export interface SignOutButtonProps {
  
  tone?: SignOutTone;
  label?: string;
  
  compact?: boolean;
  className?: string;
}


export function SignOutButton({
  tone = "light",
  label = "Sign out",
  compact = false,
  className,
}: SignOutButtonProps) {
  return (
    <form action={SUPABASE_AUTH_ROUTES.signOut} method="post" className={className}>
      <button
        type="submit"
        aria-label={label}
        title={compact ? label : undefined}
        className={cn(
          "flex items-center rounded-md transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          compact
            ? "size-10 justify-center"
            : "h-10 w-full gap-2.5 px-3 text-label-md font-medium",
          tone === "dark"
            ? "text-white hover:bg-white/10 focus-visible:outline-white"
            : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-800 focus-visible:outline-brand-700",
        )}
      >
        <span className="shrink-0 [&_svg]:size-5" aria-hidden="true">
          <LogOutIcon />
        </span>
        <span className={cn(compact && "sr-only")}>{label}</span>
      </button>
    </form>
  );
}
