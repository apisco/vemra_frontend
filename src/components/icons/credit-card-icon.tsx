import type { IconProps } from "./icon-props";

export function CreditCardIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
