import type { ReactNode } from "react";

export interface CheckoutCardProps {
  summary: ReactNode;
  children: ReactNode;
}

export function CheckoutCard({ summary, children }: CheckoutCardProps) {
  return (
    <div className="flex flex-col gap-5 md:gap-0 md:overflow-hidden md:rounded-xl md:border md:border-neutral-200 md:bg-white md:shadow-elevation-1 lg:grid lg:min-h-160 lg:grid-cols-[440fr_560fr]">
      {summary}

      <div className="flex min-w-0 flex-col md:p-8 lg:p-12">{children}</div>
    </div>
  );
}
