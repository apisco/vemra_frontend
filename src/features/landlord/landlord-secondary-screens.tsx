import Link from "next/link";
import type { ReactNode } from "react";

import { CreditCardIcon } from "@/components/icons/credit-card-icon";
import { FileTextIcon } from "@/components/icons/file-text-icon";
import { WrenchIcon } from "@/components/icons/wrench-icon";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { LANDLORD_ROUTES } from "@/constants/landlord";
import { UnsupportedPanel } from "@/features/errors/unsupported-panel";
import { UNSUPPORTED } from "@/lib/api/capabilities";
import { formatMoney } from "@/lib/format";
import type { Wallet, WalletTransaction } from "@/lib/api/schemas";
import type {
  ApplicationQueue,
  MaintenanceOverview,
} from "@/types/api/landlord";

const panel = "rounded-lg border border-neutral-200 bg-white p-4 md:p-5";
const title = "font-display text-heading-sm font-semibold text-neutral-900";
const muted = "text-body-sm text-neutral-700";

export function Screen({
  title: heading,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-heading-lg font-bold text-neutral-900 md:text-heading-xl">
            {heading}
          </h1>
          {description === undefined ? null : (
            <p className={`mt-1 ${muted}`}>{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function MaintenanceScreen({
  overview,
}: {
  overview: MaintenanceOverview;
}) {
  if (overview.reports.length === 0) {
    return (
      <Screen
        title="Maintenance Reports"
        description="Oversee maintenance actions, work orders, and requests across your units."
      >
        <EmptyState
          icon={<WrenchIcon />}
          title="No maintenance reports"
          description="Maintenance issues reported by tenants appear here."
          action={
            <Link
              href={LANDLORD_ROUTES.properties}
              className="inline-flex h-10 items-center rounded-md bg-brand-700 px-5 text-label-md font-semibold text-white"
            >
              View Properties
            </Link>
          }
        />
      </Screen>
    );
  }

  const headers = ["Property", "Issue", "Category", "Urgency", "Status"];

  return (
    <Screen
      title="Maintenance Reports"
      description="Oversee maintenance actions, work orders, and requests across your units."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          variant="outlined"
          title="Open Requests"
          value={String(overview.openCount)}
        />
        <StatCard
          variant="outlined"
          title="Scheduled Work"
          value={String(overview.scheduledCount)}
        />
        <StatCard
          variant="outlined"
          title="Resolved"
          value={String(overview.resolvedThisMonth)}
        />
      </div>
      <section className={panel}>
        <Table caption="Maintenance reports">
          <TableHead>
            {headers.map((head) => (
              <TableHeaderCell key={head}>{head}</TableHeaderCell>
            ))}
          </TableHead>
          <TableBody>
            {overview.reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell isPrimary>{report.propertyName}</TableCell>
                <TableCell>{report.issue}</TableCell>
                <TableCell>{report.category}</TableCell>
                <TableCell>{report.urgency}</TableCell>
                <TableCell>{report.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </Screen>
  );
}

export function CautionDepositsScreen() {
  return (
    <Screen
      title="Caution Deposits"
      description="Tenant caution deposits are held and resolved by Vemra."
    >
      <UnsupportedPanel capability={UNSUPPORTED.landlordCautionDeposits} />
    </Screen>
  );
}

export function PaymentBreakdownScreen({
  wallet,
}: {
  wallet: Wallet | null;
}) {
  return (
    <Screen
      title="Payment breakdown"
      description="Secure payments are fully managed through Vemra."
    >
      <UnsupportedPanel capability={UNSUPPORTED.landlordPaymentBreakdown} />
      {wallet === null ? (
        <EmptyState
          icon={<CreditCardIcon />}
          title="No payment activity yet"
          description="Rent payments appear here once a tenant pays."
        />
      ) : (
        <WalletTransactionsTable wallet={wallet} />
      )}
    </Screen>
  );
}

export function WalletTransactionsTable({ wallet }: { wallet: Wallet }) {
  const rows: readonly (WalletTransaction & { walletName: string })[] =
    wallet.wallets.flatMap((entry) =>
      entry.transactions.map((transaction) => ({
        ...transaction,
        walletName: entry.name,
      })),
    );

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<FileTextIcon />}
        title="No transactions yet"
        description="Rent payments and withdrawals appear here once your first tenant pays rent."
      />
    );
  }

  const sorted = [...rows].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <section className={panel}>
      <Table caption="Wallet transactions">
        <TableHead>
          <TableHeaderCell>Description</TableHeaderCell>
          <TableHeaderCell>Wallet</TableHeaderCell>
          <TableHeaderCell>Direction</TableHeaderCell>
          <TableHeaderCell>Amount</TableHeaderCell>
        </TableHead>
        <TableBody>
          {sorted.map((row) => (
            <TableRow key={row.id}>
              <TableCell isPrimary>
                {row.transaction?.description ?? "Transaction"}
              </TableCell>
              <TableCell>{row.walletName}</TableCell>
              <TableCell>{row.direction}</TableCell>
              <TableCell>
                {formatMoney({
                  minor: row.amountMinor,
                  currency: row.currency,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export function ApplicationsScreen({ queue }: { queue: ApplicationQueue }) {
  if (queue.items.length === 0) {
    return (
      <Screen
        title="Applications"
        description="Applications for your vacant properties. Vemra reviews and decides each one."
      >
        <EmptyState
          icon={<FileTextIcon />}
          title="No applications yet"
          description="When tenants apply for your vacant properties, their applications appear here."
        />
      </Screen>
    );
  }

  const filters = [
    ["All", queue.counts.all],
    ["New", queue.counts.new],
    ["Reviewed", queue.counts.reviewed],
    ["Approved", queue.counts.approved],
    ["Declined", queue.counts.declined],
  ] as const;

  return (
    <Screen
      title="Applications"
      description={`${queue.items.length} application${
        queue.items.length === 1 ? "" : "s"
      }. Vemra reviews and decides each one.`}
    >
      <UnsupportedPanel capability={UNSUPPORTED.landlordApplicationDecision} />

      <div className="flex flex-wrap gap-2">
        {filters.map(([label, count], index) => (
          <span
            key={label}
            className={`rounded-full border px-4 py-2 text-label-sm font-semibold ${
              index === 0
                ? "border-brand-700 bg-brand-700 text-white"
                : "border-neutral-200 bg-white text-neutral-700"
            }`}
          >
            {label} ({count})
          </span>
        ))}
      </div>

      <section className="space-y-3">
        {queue.items.map((item) => (
          <Link
            key={item.id}
            href={`/landlord/applications/${item.id}`}
            className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-brand-700"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-label-sm font-semibold text-brand-700">
              {item.applicant.initials}
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-body-md text-neutral-900">
                {item.applicant.name}
              </strong>
              <span className="block truncate text-label-sm text-neutral-700">
                {item.summary}
              </span>
            </span>
            <span
              className={`rounded-full px-2 py-1 text-label-sm font-semibold ${
                item.status === "new"
                  ? "bg-warning-50 text-warning-600"
                  : item.status === "declined"
                    ? "bg-error-50 text-error-600"
                    : "bg-neutral-100 text-neutral-700"
              }`}
            >
              {item.status}
            </span>
          </Link>
        ))}
      </section>
    </Screen>
  );
}

export function ApplicationReviewScreen({
  applicationId,
  application,
}: {
  applicationId: string;
  application: ApplicationQueue["items"][number] | null;
}) {
  return (
    <Screen
      title="Application"
      description="Vemra reviews the applicant's identity, income, background and suitability."
    >
      <nav aria-label="Breadcrumb" className="text-label-sm text-neutral-700">
        <Link href={LANDLORD_ROUTES.applications} className="hover:underline">
          Applications
        </Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-brand-700">
          {application?.applicant.name ?? applicationId}
        </span>
      </nav>

      {application === null ? (
        <EmptyState
          icon={<FileTextIcon />}
          title="Application details unavailable"
          description="Vemra did not return this application. It may have been withdrawn or decided already."
        />
      ) : (
        <section className={panel}>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 font-semibold text-brand-700">
              {application.applicant.initials}
            </span>
            <div className="min-w-0">
              <h2 className={title}>{application.applicant.name}</h2>
              <p className={muted}>{application.summary}</p>
            </div>
            <Badge
              variant={
                application.status === "declined"
                  ? "danger"
                  : application.status === "approved"
                    ? "success"
                    : "warning"
              }
              className="ml-auto shrink-0"
            >
              {application.status}
            </Badge>
          </div>
        </section>
      )}

      <UnsupportedPanel
        capability={UNSUPPORTED.landlordApplicationDecision}
        label="Decision"
      />
    </Screen>
  );
}

export function PropertyAdminInviteScreen() {
  return (
    <Screen
      title="Property Admins"
      description="Vemra assigns a Property Admin to manage your properties and tenant requests."
    >
      <UnsupportedPanel
        capability={{
          title: "Assigned by Vemra",
          description:
            "Property Admins are invited and assigned by Vemra, not by landlords. Your assigned admin appears on your dashboard once Vemra assigns one.",
        }}
      />
    </Screen>
  );
}
