"use client";

import { useRouter } from "next/navigation";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import type { ButtonVariant } from "@/components/ui/button";
import { buttonClasses } from "@/components/ui/button";
import { ERROR_BACK_LINK } from "@/constants/errors";

export interface ErrorBackLinkProps {
  variant?: ButtonVariant;
}

export function ErrorBackLink({ variant = "primary" }: ErrorBackLinkProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push(ERROR_BACK_LINK.href);
        }
      }}
      className={buttonClasses({
        variant,
        size: "sm",
        fullWidth: true,
        className: "h-11 md:w-auto md:gap-3 md:px-6 lg:h-10 lg:gap-2 lg:px-4",
      })}
    >
      <ArrowLeftIcon />
      {ERROR_BACK_LINK.label}
    </button>
  );
}
