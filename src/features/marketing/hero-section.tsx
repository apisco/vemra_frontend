import Image from "next/image";
import Link from "next/link";

import { DotIcon } from "@/components/icons/dot-icon";
import { ShieldIcon } from "@/components/icons/shield-icon";
import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import { HERO, HERO_LISTING } from "@/constants/marketing";
import { cn } from "@/lib/cn";
import { CONTAINER, SECTION_GUTTER } from "@/lib/layout";

export function HeroSection() {
  return (
    <section className="bg-neutral-50">
      <div
        className={cn(
          CONTAINER,
          SECTION_GUTTER,
          "grid gap-y-6 pt-6 pb-8 md:gap-y-8 md:py-12 lg:grid-cols-[620fr_480fr] lg:items-center lg:gap-x-16 lg:py-20 xl:gap-x-25",
        )}
      >
        <p className="order-1 w-fit rounded-full bg-brand-700/10 px-3 py-1 text-label-sm font-semibold text-brand-700 md:bg-brand-700 md:px-3 md:py-1.5 md:text-white lg:col-start-1 lg:row-start-1">
          {HERO.overline}
        </p>

        <h1 className="order-2 font-display text-[28px] leading-[36px] font-extrabold tracking-[-1px] text-neutral-900 md:text-display-lg md:leading-[46px] md:tracking-[-1.5px] lg:col-start-1 lg:row-start-2 lg:text-display-xl lg:leading-[62px] lg:tracking-[-2px]">
          {HERO.heading}
        </h1>

        <p className="order-4 text-body-md leading-[22px] text-neutral-800 md:order-3 md:font-display md:text-heading-sm md:leading-[28px] md:font-semibold lg:col-start-1 lg:row-start-3">
          {HERO.subheading}
        </p>

        <div className="order-5 flex flex-col gap-3 md:order-4 md:flex-row md:gap-4 lg:col-start-1 lg:row-start-4">
          <Link
            href={HERO.primaryCta.href}
            className={buttonClasses({ fullWidth: true, className: "md:w-auto" })}
          >
            {HERO.primaryCta.label}
          </Link>
          <Link
            href={HERO.secondaryCta.href}
            className={buttonClasses({
              variant: "secondary",
              fullWidth: true,
              className: "md:w-auto",
            })}
          >
            {HERO.secondaryCta.label}
          </Link>
        </div>

        <p className="order-6 flex items-start gap-2 text-body-sm text-neutral-700 lg:col-start-1 lg:row-start-5">
          <ShieldIcon className="mt-0.5 size-4 shrink-0 text-brand-700" />
          <span className="md:hidden">{HERO.trustNote}</span>
          <span className="hidden md:inline lg:hidden">
            {HERO.trustNoteTablet}
          </span>
          <span className="hidden lg:inline">{HERO.trustNote}</span>
        </p>

        <HeroListingCard className="order-3 md:order-5 lg:col-start-2 lg:row-span-5 lg:row-start-1 lg:w-full lg:max-w-100 lg:self-center lg:justify-self-end" />
      </div>
    </section>
  );
}

function HeroListingCard({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "overflow-clip rounded-xl border border-neutral-200 bg-white shadow-elevation-2 lg:shadow-elevation-3",
        className,
      )}
    >
      <div className="relative h-40 w-full md:h-60 lg:h-55">
        <Image
          src={HERO_LISTING.imageSrc}
          alt={HERO_LISTING.imageAlt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 704px, 100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover"
        />
        <span className="absolute top-4 left-4 hidden items-center gap-1 rounded-full bg-white px-3 py-1.5 text-label-sm font-semibold text-neutral-900 lg:inline-flex">
          <DotIcon className="size-2 text-brand-600" />
          {HERO_LISTING.badge}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-6">
        <p className="font-display text-heading-sm leading-[27px] font-extrabold text-brand-700 md:text-[22px] md:leading-[33px]">
          {HERO_LISTING.price}
        </p>
        <p className="text-body-sm text-neutral-900 md:text-body-md md:leading-[20px]">
          {HERO_LISTING.meta}
        </p>

        <hr className="border-neutral-200 md:hidden lg:block" />
        <div className="flex items-center gap-3 md:hidden lg:flex">
          <Avatar
            name={HERO_LISTING.agent.name}
            initials={HERO_LISTING.agent.initials}
            size="sm"
            className="size-7! rounded-xl text-label-sm lg:size-9!"
          />
          <div className="flex flex-col">
            <p className="text-label-sm text-neutral-900 lg:text-label-md lg:leading-[20px]">
              {HERO_LISTING.agent.name}
            </p>
            <p className="hidden text-caption text-neutral-700 lg:block">
              {HERO_LISTING.agent.note}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
