import type { IconProps } from "./icon-props";

export function LockIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect
        x="3.33"
        y="8.33"
        width="13.33"
        height="9.17"
        rx="1.67"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6.25 8.33V5.83a3.75 3.75 0 1 1 7.5 0v2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10 11.67v2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
