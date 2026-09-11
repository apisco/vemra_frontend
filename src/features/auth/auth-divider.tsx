import { cn } from "@/lib/cn";

export interface AuthDividerProps {
  label: string;
  className?: string;
}

export function AuthDivider({ label, className }: AuthDividerProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
      <span className="text-label-sm leading-[18px] text-neutral-700">
        {label}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}
