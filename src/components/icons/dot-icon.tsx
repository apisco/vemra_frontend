import type { IconProps } from "./icon-props";

export function DotIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 6 6"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="3" cy="3" r="3" fill="currentColor" />
    </svg>
  );
}
