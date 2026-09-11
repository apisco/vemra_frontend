import { cn } from "@/lib/cn";

export interface AuthProgressProps {
  current: number;
  total: number;
  className?: string;
}

export function AuthProgress({
  current,
  total,
  className,
}: AuthProgressProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-4 md:w-[320px]",
        className,
      )}
    >
      <span aria-hidden="true" className="flex w-full gap-2">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-1 flex-1 rounded-sm",
              index < current ? "bg-brand-700" : "bg-neutral-200",
            )}
          />
        ))}
      </span>
      <span className="text-label-sm leading-[16px] font-semibold text-neutral-700">
        Step {current} of {total}
      </span>
    </div>
  );
}
