import type { IconProps } from "./icon-props";

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M7 2.9162L2.9162 7L7 11.0838M2.9162 7H11.0838"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
