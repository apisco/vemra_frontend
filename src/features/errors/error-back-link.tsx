import Link from "next/link";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import type { ButtonVariant } from "@/components/ui/button";
import { buttonClasses } from "@/components/ui/button";
import { ERROR_BACK_LINK } from "@/constants/errors";

export interface ErrorBackLinkProps {
  variant?: ButtonVariant;
}

export function ErrorBackLink({ variant = "primary" }: ErrorBackLinkProps) {
  return (
    <Link
      href={ERROR_BACK_LINK.href}
      className={buttonClasses({
        variant,
        size: "sm",
        fullWidth: true,
        className: "h-11 md:w-auto md:gap-3 md:px-6 lg:h-10 lg:gap-2 lg:px-4",
      })}
    >
      <ArrowLeftIcon />
      {ERROR_BACK_LINK.label}
    </Link>
  );
}
