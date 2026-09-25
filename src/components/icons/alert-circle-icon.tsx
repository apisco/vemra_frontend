import type { IconProps } from "./icon-props";

export function AlertCircleIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10 6.25V10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="10" cy="13.5" r="0.9" fill="currentColor" />
    </svg>
  );
}
