import Link from "next/link";
import type { ReactNode } from "react";

import { LogoMark } from "@/components/layout/logo-mark";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import type { VerificationReviewRow } from "@/constants/auth";
import { AuthCard } from "@/features/auth/auth-card";
import { AuthHeader } from "@/features/auth/auth-header";
import { AuthLayout } from "@/features/auth/auth-layout";
import type { StatusIconTone } from "@/features/auth/status-icon";
import { StatusIcon } from "@/features/auth/status-icon";
import { StatusRow } from "@/features/auth/status-row";

export interface VerificationStatusProps {
  tone: StatusIconTone;
  icon: ReactNode;
  title: string;
  description: string;
  cardLabel: string;
  rows: readonly VerificationReviewRow[];
  note?: string;
  ctaLabel: string;
  ctaHref: string;
}

export function VerificationStatus({
  tone,
  icon,
  title,
  description,
  cardLabel,
  rows,
  note,
  ctaLabel,
  ctaHref,
}: VerificationStatusProps) {
  return (
    <AuthLayout width="xl" gap="xs" justify="desktop" logoSize="none">
      <LogoMark size="fixed" className="self-center" />
      <div className="flex flex-col items-center gap-5 md:gap-6">
        <StatusIcon size="md" tone={tone}>
          {icon}
        </StatusIcon>
        <AuthHeader
          variant="display"
          align="center"
          title={title}
          description={description}
        />
      </div>
      <AuthCard variant="review" className="lg:max-w-[480px] lg:self-center">
        <ul aria-label={cardLabel} className="flex flex-col gap-7 lg:gap-8">
          {rows.map((row) => (
            <li key={row.title}>
              <StatusRow
                title={row.title}
                detail={row.detail}
                trailing={<Badge variant={row.tone}>{row.status}</Badge>}
              />
            </li>
          ))}
        </ul>
      </AuthCard>
      <div className="flex flex-col items-center gap-5 md:gap-4">
        {note ? (
          <p className="text-body-sm leading-[18px] text-neutral-700 md:text-body-md md:leading-[20px]">
            {note}
          </p>
        ) : null}
        <Link
          href={ctaHref}
          className={buttonClasses({ className: "w-full lg:w-auto" })}
        >
          {ctaLabel}
        </Link>
      </div>
    </AuthLayout>
  );
}
