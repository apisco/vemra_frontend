export interface OnboardingStepCardProps {
  number: number;
  title: string;
  detail: string;
}

export function OnboardingStepCard({
  number,
  title,
  detail,
}: OnboardingStepCardProps) {
  return (
    <li className="flex w-full items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 md:p-4.5">
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success-50 text-label-md leading-[20px] font-semibold text-brand-700"
      >
        {number}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-label-md leading-[20px] font-semibold text-neutral-900">
          {title}
        </span>
        <span className="text-label-sm leading-[18px] text-neutral-700 md:text-body-sm md:leading-[20px] md:text-neutral-800">
          {detail}
        </span>
      </span>
    </li>
  );
}
