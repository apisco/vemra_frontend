import type { IconProps } from "./icon-props";

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M8 1C8.09504 1 8.16387 1.02847 8.19531 1.0498C10.0657 2.35528 12.7474 3.40039 15 3.40039V8.79883C15 10.4544 14.296 11.6848 13.0957 12.6699C11.8596 13.6843 10.1026 14.4272 8.07812 14.9922C8.03912 15.0027 7.99169 15.0021 7.95508 14.9912L7.94629 14.9883L7.93652 14.9854L7.1875 14.7666C5.47257 14.2349 3.98864 13.5563 2.90527 12.6689C1.70422 11.685 1 10.4544 1 8.79883V3.40039C3.25326 3.40039 5.94415 2.3457 7.80371 1.04883L7.80469 1.0498C7.83613 1.02847 7.90495 1 8 1Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
