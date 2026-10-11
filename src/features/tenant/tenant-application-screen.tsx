import type { ReactNode } from "react";

import { TENANT_ROUTES } from "@/constants/tenant";
import { LoadErrorPanel } from "@/features/errors/load-error-panel";
import { LeasePicker } from "@/features/tenant/lease-picker";
import {
  DepositDecisionActions,
  SignLeaseButton,
  WithdrawApplicationButton,
} from "@/features/tenant/tenant-actions";
import {
  getDeposit,
  getLease,
  getTenantApplications,
  resolveLeaseSelection,
} from "@/lib/api/resources/tenant";
import { cn } from "@/lib/cn";
import { formatDate, formatMoney } from "@/lib/format";
import type { LeaseSelection } from "@/lib/api/resources/tenant";

function TenantFormShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto flex max-w-140 flex-col gap-5")}>
      <div>
        <h1 className="font-display text-heading-lg font-bold">{title}</h1>
        <p className="mt-1 text-body-md text-neutral-700">{description}</p>
      </div>
      {children}
    </div>
  );
}

function selectionFailure(
  selection: Extract<LeaseSelection, { kind: "error" }>,
) {
  return {
    ok: false as const,
    message: selection.message,
    requestId: selection.requestId,
    isWaking: selection.isWaking,
  };
}

export async function TenantApplicationScreen() {
  const applications = await getTenantApplications();

  return (
    <TenantFormShell
      title="Your applications"
      description="Vemra reviews every application and records the decision here."
    >
      {!applications.ok ? (
        <LoadErrorPanel label="Your applications" failure={applications} />
      ) : applications.data.length === 0 ? (
        <section className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-body-md text-neutral-700">
            You have not applied for any properties yet.
          </p>
        </section>
      ) : (
        <div className="flex flex-col gap-3">
          {applications.data.map((application) => (
            <section
              key={application.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-5"
            >
              <div className="min-w-0">
                <p className="text-body-md font-semibold text-neutral-900">
                  {application.listing?.title ?? "Application"}
                </p>
                <p className="text-label-sm text-neutral-700">
                  {application.status} · submitted{" "}
                  {formatDate(application.submittedAt)}
                </p>
              </div>
              {application.status === "approved" ||
              application.status === "declined" ? null : (
                <WithdrawApplicationButton applicationId={application.id} />
              )}
            </section>
          ))}
        </div>
      )}
    </TenantFormShell>
  );
}

export async function TenantLeaseScreen({
  leaseId = null,
}: {
  leaseId?: string | null;
}) {
  const selection = await resolveLeaseSelection(leaseId);

  return (
    <TenantFormShell
      title="Lease signing"
      description="Review and sign your lease agreement."
    >
      {selection.kind === "error" ? (
        <LoadErrorPanel
          label="Your leases"
          failure={selectionFailure(selection)}
        />
      ) : selection.kind === "none" || selection.kind === "invalid" ? (
        <section className="rounded-lg border border-neutral-200 bg-white p-6">
          <p className="text-body-md text-neutral-700">
            There is no lease on your account yet. Vemra prepares a lease once
            an application is approved.
          </p>
        </section>
      ) : selection.kind === "choose" ? (
        <LeasePicker
          leases={selection.leases}
          basePath={TENANT_ROUTES.myRentals}
          title="Which lease?"
          description="Pick the lease you want to review and sign."
        />
      ) : (
        <LeaseDetail leaseId={selection.leaseId} />
      )}
    </TenantFormShell>
  );
}

async function LeaseDetail({ leaseId }: { leaseId: string }) {
  const lease = await getLease(leaseId);

  if (!lease.ok) {
    return <LoadErrorPanel label="This lease" failure={lease} />;
  }

  const isSigned = lease.data.status !== "DRAFT";

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="text-heading-sm font-bold">Lease agreement</h2>

      <dl className="mt-5 flex flex-col gap-3 rounded-lg bg-neutral-50 p-5 text-body-sm">
        {[
          ["Status", lease.data.status],
          ["Annual rent", formatMoney(lease.data.annualRent)],
          ["Caution deposit", formatMoney(lease.data.cautionDeposit)],
          ["Term", `${lease.data.termYears} year(s)`],
          ["Starts", formatDate(lease.data.startDate)],
          ["Ends", formatDate(lease.data.endDate)],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-neutral-700">{label}</dt>
            <dd className="font-semibold text-neutral-900">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5">
        {isSigned ? (
          <p
            role="status"
            className="rounded-md border border-success-600 bg-success-50 p-3 text-body-sm text-neutral-800"
          >
            This lease is already signed.
          </p>
        ) : (
          <SignLeaseButton leaseId={leaseId} />
        )}
      </div>
    </section>
  );
}

export async function TenantDecisionScreen({
  leaseId = null,
}: {
  leaseId?: string | null;
}) {
  const selection = await resolveLeaseSelection(leaseId);

  return (
    <TenantFormShell
      title="Deposit decision review"
      description="Review Vemra's caution deposit decision before the remaining amount is released."
    >
      {selection.kind === "error" ? (
        <LoadErrorPanel
          label="Your leases"
          failure={selectionFailure(selection)}
        />
      ) : selection.kind === "none" || selection.kind === "invalid" ? (
        <section className="rounded-lg border border-neutral-200 bg-white p-6">
          <p className="text-body-md text-neutral-700">
            There is no lease on your account, so there is no deposit decision
            to review.
          </p>
        </section>
      ) : selection.kind === "choose" ? (
        <LeasePicker
          leases={selection.leases}
          basePath="/tenant/deposit-decision"
          title="Which lease?"
          description="Pick the lease whose deposit decision you want to review."
        />
      ) : (
        <DecisionDetail leaseId={selection.leaseId} />
      )}
    </TenantFormShell>
  );
}

async function DecisionDetail({ leaseId }: { leaseId: string }) {
  const deposit = await getDeposit(leaseId);

  if (!deposit.ok) {
    return <LoadErrorPanel label="The deposit decision" failure={deposit} />;
  }

  const record =
    deposit.data !== null && typeof deposit.data === "object"
      ? (deposit.data as Record<string, unknown>)
      : {};

  const rows = Object.entries(record).filter(
    ([, value]) => typeof value === "string" || typeof value === "number",
  );

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="text-heading-sm font-bold">Refund decision</h2>

      {rows.length === 0 ? (
        <p className="mt-3 text-body-sm text-neutral-700">
          Vemra has not published a decision for this lease yet.
        </p>
      ) : (
        <dl className="mt-4 flex flex-col gap-2 text-body-sm">
          {rows.map(([key, value]) => (
            <div key={key} className="flex justify-between gap-4">
              <dt className="text-neutral-700">{key}</dt>
              <dd className="font-semibold text-neutral-900">
                {String(value)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-5">
        <DepositDecisionActions leaseId={leaseId} />
      </div>
    </section>
  );
}
