import type { ReactNode } from "react";

import { LogoMark } from "@/components/layout/logo-mark";
import type { ErrorScreenContent } from "@/constants/errors";

export interface ErrorScreenProps {
  content: ErrorScreenContent;
  children: ReactNode;
}

export function ErrorScreen({ content, children }: ErrorScreenProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6 md:p-12">
      <div className="flex w-full max-w-140 flex-col items-center gap-8 md:gap-10">
        <LogoMark size="standalone" />

        <div className="flex flex-col items-center gap-3 lg:gap-0">
          <p className="font-display text-[96px] leading-[96px] font-extrabold tracking-[-2px] text-neutral-700 md:text-[120px] md:leading-[120px] md:tracking-[-4px] lg:text-[140px] lg:leading-[140px]">
            {content.code}
          </p>
          <h1 className="text-center font-display text-heading-md leading-[30px] font-bold text-neutral-900 md:text-heading-xl md:leading-[40px]">
            {content.heading}
          </h1>
        </div>

        <p className="-mt-5 text-center text-body-md leading-[22px] text-neutral-700 md:mt-0 md:text-body-lg md:leading-[24px]">
          {content.body}
        </p>

        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:gap-4">
          {children}
        </div>
      </div>
    </main>
  );
}
