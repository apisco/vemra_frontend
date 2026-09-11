import type { IconProps } from "./icon-props";

export function UserIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M19.0008 21V19C19.0008 17.9391 18.5793 16.9217 17.8291 16.1716C17.0789 15.4214 16.0613 15 15.0003 15H8.99966C7.93867 15 6.92114 15.4214 6.17091 16.1716C5.42068 16.9217 4.9992 17.9391 4.9992 19V21M16.0005 7C16.0005 9.20914 14.2094 11 12 11C9.79061 11 7.99954 9.20914 7.99954 7C7.99954 4.79086 9.79061 3 12 3C14.2094 3 16.0005 4.79086 16.0005 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
