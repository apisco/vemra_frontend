import { LogoMark } from "@/components/layout/logo-mark";
import { LOGIN_ASIDE } from "@/constants/auth";

export function LoginAside() {
  return (
    <>
      <LogoMark variant="onDark" size="fixed" className="self-start" />

      <div className="flex flex-col gap-4">
        <p className="font-display text-[24px] leading-[30px] font-extrabold text-white lg:text-display-xl lg:leading-[52px] lg:tracking-[-1px]">
          <span className="lg:hidden">{LOGIN_ASIDE.headlineTablet}</span>
          <span className="hidden lg:inline">{LOGIN_ASIDE.headline}</span>
        </p>
        <p className="text-body-md leading-[20px] text-neutral-400 lg:text-body-lg lg:leading-[24px]">
          <span className="lg:hidden">{LOGIN_ASIDE.descriptionTablet}</span>
          <span className="hidden lg:inline">{LOGIN_ASIDE.description}</span>
        </p>
      </div>

      <dl className="flex flex-col gap-5 lg:flex-row lg:gap-12">
        {LOGIN_ASIDE.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <dt className="font-display text-[22px] leading-[30px] font-bold text-brand-600 lg:text-heading-lg lg:leading-[36px]">
              {stat.value}
            </dt>
            <dd className="text-label-sm leading-[16px] text-neutral-400 lg:text-body-md lg:leading-[22px]">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
