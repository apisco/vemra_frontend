import type { IconProps } from "./icon-props";

export function LayoutGridIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
