import type { IconProps } from "./icon-props";

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M29.067 13.3336C29.6759 16.322 29.242 19.4288 27.8375 22.136C26.433 24.8432 24.1429 26.987 21.349 28.21C18.5552 29.4331 15.4265 29.6613 12.4847 28.8568C9.54297 28.0522 6.96593 26.2635 5.18338 23.7888C3.40083 21.3142 2.52051 18.3033 2.68923 15.2581C2.85795 12.213 4.06552 9.31773 6.11055 7.05517C8.15557 4.79261 10.9145 3.29952 13.9271 2.82488C16.9397 2.35024 20.0241 2.92276 22.6657 4.44694M11.9995 14.6663L15.9995 18.6663L29.3329 5.33297"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
