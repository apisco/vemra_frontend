import { CheckIcon } from "@/components/icons/check-icon";
import { TRUST_SECTION } from "@/constants/marketing";
import { cn } from "@/lib/cn";
import { CONTAINER, SECTION_GUTTER } from "@/lib/layout";

export function TrustSection() {
  return (
    <section className="hidden bg-neutral-50 lg:block">
      <div
        className={cn(
          CONTAINER,
          SECTION_GUTTER,
          "flex items-center justify-between gap-15 py-25",
        )}
      >
        <ul className="flex w-130 min-w-0 flex-col gap-6 rounded-xl bg-neutral-900 p-10">
          {TRUST_SECTION.checks.map((check) => (
            <li key={check} className="flex items-start gap-4">
              <span className="flex size-6 shrink-0 items-center justify-center">
                <CheckIcon className="size-3.5 text-brand-600" />
              </span>
              <p className="text-label-md font-bold text-white">{check}</p>
            </li>
          ))}
        </ul>

        <div className="flex w-140 min-w-0 flex-col gap-8">
          <h2 className="font-display text-display-lg leading-[54px] font-extrabold text-neutral-900">
            {TRUST_SECTION.heading}
          </h2>
          <p className="text-body-lg leading-[24px] text-neutral-700">
            {TRUST_SECTION.body}
          </p>
        </div>
      </div>
    </section>
  );
}
