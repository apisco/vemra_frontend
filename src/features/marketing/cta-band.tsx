import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { CTA_BAND } from "@/constants/marketing";
import { cn } from "@/lib/cn";
import { CONTAINER, HEADER_GUTTER } from "@/lib/layout";

export function CtaBand() {
  return (
    <section className="bg-neutral-50">
      <div className={cn(CONTAINER, HEADER_GUTTER, "py-4 md:py-8 lg:py-16")}>
        <div className="flex flex-col items-center gap-4 rounded-lg bg-brand-950 p-6 text-center md:gap-6 md:rounded-xl md:p-8 lg:gap-7 lg:p-12">
          <h2 className="font-display text-[20px] leading-[30px] font-extrabold text-white md:text-[26px] md:leading-[39px] lg:text-heading-xl lg:leading-[48px]">
            {CTA_BAND.heading}
          </h2>
          <Link
            href={CTA_BAND.cta.href}
            className={buttonClasses({ size: "sm", className: "md:h-11 md:px-6" })}
          >
            {CTA_BAND.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
