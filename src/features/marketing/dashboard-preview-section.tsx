import type { ReactNode } from "react";

import { DASHBOARD_SECTION } from "@/constants/marketing";
import { getDashboardPreview } from "@/lib/api/resources/public";
import type { PanelRow } from "@/constants/marketing";
import { cn } from "@/lib/cn";
import { CONTAINER, SECTION_GUTTER } from "@/lib/layout";

import { SectionHeading } from "./section-heading";

export async function DashboardPreviewSection() {
  const preview = await getDashboardPreview();
  return (
    <section className="bg-neutral-50">
      <div
        className={cn(
          CONTAINER,
          SECTION_GUTTER,
          "flex flex-col gap-6 py-8 md:gap-9 md:py-16 lg:gap-14 lg:py-25",
        )}
      >
        <SectionHeading
          align="center"
          subheading={
            <span className="hidden lg:inline">
              {DASHBOARD_SECTION.subheading}
            </span>
          }
        >
          <span className="md:hidden">{DASHBOARD_SECTION.headingMobile}</span>
          <span className="hidden md:inline">{DASHBOARD_SECTION.heading}</span>
        </SectionHeading>

        {preview ? <div className="flex flex-col gap-4 md:gap-6 lg:flex-row lg:gap-8">
          <Panel
            title={preview.tenant.title}
            badge={
              <span className="rounded-sm bg-brand-600 px-2 py-1 text-label-sm font-semibold text-brand-950">
                {preview.tenant.badge}
              </span>
            }
            rows={preview.tenant.rows.map((row) => ({ ...row, showOnMobile: true, showOnTablet: true }))}
            footer={
              <div className="flex flex-col gap-2 lg:gap-3">
                <div className="flex flex-wrap gap-x-1 text-body-sm lg:justify-between lg:gap-x-2">
                  <p className="text-neutral-700">
                    <span className="lg:hidden">
                      {preview.tenant.progress?.label ?? "Payment plan"}
                    </span>
                    <span className="hidden lg:inline">
                      {preview.tenant.progress?.label ?? "Progress"}
                    </span>
                  </p>
                  <p className="text-neutral-700 lg:text-neutral-900">
                    {preview.tenant.progress?.value ?? "—"}
                  </p>
                </div>
                <div
                  role="progressbar"
                  aria-label={preview.tenant.progress?.label ?? "Progress"}
                  aria-valuenow={preview.tenant.progress?.percent ?? 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-1.5 w-full overflow-clip rounded-sm bg-neutral-100 lg:h-2"
                >
                  <div
                    className="h-full rounded-sm bg-brand-700"
                    style={{ width: `${preview.tenant.progress?.percent ?? 0}%` }}
                  />
                </div>
              </div>
            }
            hideRowsOnMobile
          />

          <Panel
            title={preview.landlord.title}
            badge={
              <span className="rounded-sm bg-brand-700/10 px-2 py-1 text-label-sm font-semibold text-brand-700">
                {preview.landlord.badge}
              </span>
            }
            rows={preview.landlord.rows.map((row) => ({ ...row, showOnMobile: true, showOnTablet: true }))}
          />
        </div> : <p className="rounded-lg border border-neutral-200 bg-white p-6 text-center text-body-md text-neutral-700">Dashboard previews are being updated.</p>}
      </div>
    </section>
  );
}

interface PanelProps {
  title: string;
  badge: ReactNode;
  rows: readonly PanelRow[];
  footer?: ReactNode;
  hideRowsOnMobile?: boolean;
}

function Panel({ title, badge, rows, footer, hideRowsOnMobile }: PanelProps) {
  return (
    <article className="flex flex-1 flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 md:gap-5 md:p-6 lg:gap-6 lg:p-8">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-body-md font-semibold text-neutral-900 md:font-display md:text-heading-sm md:leading-[28px]">
          {title}
        </h3>
        <span className="hidden md:inline">{badge}</span>
      </div>

      <dl
        className={cn(
          "flex flex-col gap-4 md:gap-3",
          hideRowsOnMobile && "hidden md:flex",
        )}
      >
        {rows.map((row) => (
          <div
            key={row.label}
            className={cn(
              "flex items-baseline justify-between gap-3",
              !row.showOnMobile && "hidden md:flex",
              !row.showOnTablet && "md:hidden lg:flex",
            )}
          >
            <dt className="text-body-md text-neutral-700">{row.label}</dt>
            <dd
              className={cn(
                "text-body-md leading-[20px] font-semibold",
                row.isEmphasised ? "text-brand-700" : "text-neutral-900",
              )}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {footer && (
        <>
          <hr className="border-neutral-200 md:hidden lg:block" />
          <div className="md:hidden lg:block">{footer}</div>
        </>
      )}
    </article>
  );
}
