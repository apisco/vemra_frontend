import Link from "next/link";

import { InfoIcon } from "@/components/icons/info-icon";
import type { LegalDocumentContent } from "@/constants/legal";
import { LEGAL_CONTACT } from "@/constants/legal";
import { LegalTabs } from "@/features/legal/legal-tabs";
import { cn } from "@/lib/cn";
import { CONTAINER } from "@/lib/layout";

export interface LegalDocumentProps {
  content: LegalDocumentContent;
}

export function LegalDocument({ content }: LegalDocumentProps) {
  return (
    <div className={cn(CONTAINER, "px-4 md:px-16")}>
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 pt-5 pb-8 md:gap-7 md:pt-8 md:pb-12 lg:gap-12 lg:pt-16 lg:pb-25">
        <LegalTabs activeHref={content.href} />

        <article className="flex flex-col gap-7 md:gap-6 lg:gap-10">
          <header className="flex flex-col gap-1.5 lg:gap-3">
            <h1 className="font-display text-heading-lg leading-[36px] font-bold text-neutral-900 lg:text-heading-xl lg:leading-[44px]">
              {content.title}
            </h1>
            <p className="text-body-sm leading-[17px] text-neutral-700">
              {content.lastUpdated}
            </p>
          </header>

          {content.intro ? (
            <p className="text-body-md leading-[22px] text-neutral-700">
              {content.intro}
            </p>
          ) : null}

          {content.sections.map((section) => (
            <section
              key={section.heading}
              className="flex flex-col gap-2 lg:gap-3"
            >
              <h2 className="text-heading-md leading-[28px] font-semibold text-neutral-900 lg:leading-[30px]">
                {section.heading}
              </h2>
              <p className="text-body-md leading-[22px] text-neutral-700">
                {section.body}
              </p>
              {section.bullets ? (
                <ul className="list-disc space-y-1.5 pl-4.5 text-body-md leading-[20px] text-neutral-700 marker:text-neutral-400 md:space-y-2 md:pl-5 lg:pl-6 lg:leading-[22px]">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <span aria-hidden="true" className="h-px bg-neutral-200" />

          <p className="flex items-center gap-3 rounded-lg bg-brand-50 p-4 text-body-sm leading-[17px] text-neutral-700 lg:p-5">
            <InfoIcon className="size-5 shrink-0 text-brand-700" />
            <span>
              {LEGAL_CONTACT.text}{" "}
              <Link
                href={LEGAL_CONTACT.href}
                className={cn(
                  "rounded-sm font-semibold text-brand-700 underline underline-offset-2 transition-colors hover:text-brand-800",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
                )}
              >
                {LEGAL_CONTACT.linkLabel}
              </Link>
            </span>
          </p>
        </article>
      </div>
    </div>
  );
}
