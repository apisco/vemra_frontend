import { cn } from "@/lib/cn";

export interface SkeletonProps {
  className: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("block animate-pulse rounded-sm bg-neutral-100", className)}
    />
  );
}
