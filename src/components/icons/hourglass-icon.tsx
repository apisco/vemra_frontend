import type { IconProps } from "./icon-props";

export function HourglassIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M5.8324 25.6676H22.1676M5.8324 2.3324H22.1676M19.834 25.6676V20.7999C19.8339 20.181 19.5879 19.5876 19.1503 19.1501L14 14M14 14L8.84974 19.1501C8.41208 19.5876 8.16613 20.181 8.166 20.7999V25.6676M14 14L8.84974 8.84992C8.41208 8.4124 8.16613 7.81896 8.166 7.20012V2.3324M14 14L19.1503 8.84992C19.5879 8.4124 19.8339 7.81896 19.834 7.20012V2.3324"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
