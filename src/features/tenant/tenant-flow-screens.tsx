import Link from "next/link";

import { TENANT_ROUTES } from "@/constants/tenant";
import { LoadErrorPanel } from "@/features/errors/load-error-panel";
import { UnsupportedPanel } from "@/features/errors/unsupported-panel";
import { NotificationPreferencesForm } from "@/features/settings/notification-preferences-form";
import { AvatarUploader } from "@/features/settings/avatar-uploader";
import { ProfileForm } from "@/features/settings/profile-form";
import { LeasePicker } from "@/features/tenant/lease-picker";
import { MaintenanceReportForm } from "@/features/tenant/maintenance-report-form";
import {
  DepositDecisionActions,
  MarkNotificationReadButton,
  MessageComposer,
  UnsavePropertyButton,
} from "@/features/tenant/tenant-actions";
import { UNSUPPORTED } from "@/lib/api/capabilities";
import { getAccount, getSession } from "@/lib/api/resources/auth";
import {
  getConversations,
  getDeposit,
  getNotificationPreferences,
  getNotifications,
  getSavedProperties,
  getTenantLeases,
  getTenantMaintenance,
  getTenantPayments,
  resolveLeaseSelection,
  getReferralProgram,
} from "@/lib/api/resources/tenant";
import { formatDate, formatMoney } from "@/lib/format";

export type TenantScreenKey =
  | "messages"
  | "payment-history"
  | "maintenance"
  | "caution-deposit"
  | "saved-properties"
  | "my-rentals"
  | "referrals"
  | "notifications"
  | "settings"
  | "profile";

const COPY: Record<TenantScreenKey, { title: string; description: string }> = {
  messages: {
    title: "Messages",
    description: "Contact your assigned Property Admin through Vemra.",
  },
  "payment-history": {
    title: "Payment history",
    description: "Review cleared rent payments and installment activity.",
  },
  maintenance: {
    title: "Maintenance",
    description: "Report and track maintenance requests for your rental.",
  },
  "caution-deposit": {
    title: "Caution Deposit Tracking",
    description: "Review the caution deposit connected to your rental.",
  },
  "saved-properties": {
    title: "Saved Properties",
    description: "Your bookmarked listings and favorites.",
  },
  "my-rentals": {
    title: "My Rentals",
    description: "Overview of your current lease and tenancy history.",
  },
  referrals: {
    title: "Refer and earn",
    description:
      "Invite friends to Vemra and earn when they complete a tenancy.",
  },
  notifications: {
    title: "Notification Inbox",
    description: "Stay up to date with rent, applications, and maintenance.",
  },
  settings: {
    title: "Settings",
    description: "Manage your tenant account preferences.",
  },
  profile: {
    title: "Your profile",
    description:
      "Manage the personal details connected to your Vemra account.",
  },
};

export async function TenantFlowScreen({
  screen,
  leaseId = null,
}: {
  screen: TenantScreenKey;
  leaseId?: string | null;
}) {
  const copy = COPY[screen];

  return (
    <div className="flex max-w-240 flex-col gap-6">
      <ScreenHeading title={copy.title} description={copy.description} />
      {await renderScreen(screen, leaseId)}
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-5 md:p-6">
      {children}
    </section>
  );
}

async function renderScreen(screen: TenantScreenKey, leaseId: string | null) {
  switch (screen) {
    case "messages": {
      const conversations = await getConversations();
      if (conversations.length === 0) {
        return (
          <Panel>
            <p className="text-body-md text-neutral-700">
              No conversations yet. Vemra opens a conversation when you apply
              for a property.
            </p>
          </Panel>
        );
      }
      return (
        <div className="flex flex-col gap-4">
          {conversations.map((conversation) => (
            <Panel key={conversation.id}>
              <div className="flex flex-col gap-3">
                <p className="text-body-md font-semibold text-neutral-900">
                  {conversation.participant?.name ?? "Vemra"}
                </p>
                <p className="text-body-sm text-neutral-700">
                  {conversation.lastMessagePreview ?? "No messages yet."}
                </p>
                <MessageComposer conversationId={conversation.id} />
              </div>
            </Panel>
          ))}
        </div>
      );
    }

    case "payment-history": {
      const payments = await getTenantPayments();
      if (!payments.ok) {
        return (
          <LoadErrorPanel label="Your payment history" failure={payments} />
        );
      }
      return (
        <Panel>
          <DataList
            items={payments.data.map(
              (item) =>
                `${item.label} · ${formatDate(item.date)} · ${formatMoney(
                  item.amount,
                )} · ${item.status}`,
            )}
            empty="No payments recorded yet."
          />
        </Panel>
      );
    }

    case "maintenance": {
      const [data, leases] = await Promise.all([
        getTenantMaintenance(),
        getTenantLeases(),
      ]);

      // One entry per property the tenant actually holds a lease on — the
      // ticket endpoint needs a propertyId it can authorise them against.
      const properties = leases.ok
        ? [
            ...new Map(
              leases.data
                .filter(
                  (lease): lease is typeof lease & { propertyId: string } =>
                    typeof lease.propertyId === "string" &&
                    lease.propertyId !== "",
                )
                .map((lease, index) => [
                  lease.propertyId,
                  {
                    propertyId: lease.propertyId,
                    label:
                      lease.status === undefined
                        ? `Rental ${index + 1}`
                        : `Rental ${index + 1} · ${lease.status}`,
                  },
                ]),
            ).values(),
          ]
        : [];

      return (
        <div className="flex flex-col gap-4 md:gap-6">
          <MaintenanceReportForm properties={properties} />
          <Panel>
            <DataList
              items={data.requests.map(
                (item) =>
                  `${item.title} · ${item.status} · ${formatDate(
                    item.submittedAt,
                  )}`,
              )}
              empty="No maintenance requests yet."
            />
          </Panel>
        </div>
      );
    }

    case "caution-deposit": {
      const selection = await resolveLeaseSelection(leaseId);

      if (selection.kind === "error") {
        return (
          <LoadErrorPanel
            label="Your leases"
            failure={{
              ok: false,
              message: selection.message,
              requestId: selection.requestId,
              isWaking: selection.isWaking,
            }}
          />
        );
      }
      if (selection.kind === "none" || selection.kind === "invalid") {
        return (
          <Panel>
            <p className="text-body-md text-neutral-700">
              No active lease is connected to your account, so there is no
              caution deposit to show.
            </p>
          </Panel>
        );
      }
      if (selection.kind === "choose") {
        return (
          <LeasePicker
            leases={selection.leases}
            basePath={TENANT_ROUTES.cautionDeposit}
            title="Which lease?"
            description="Pick the lease whose caution deposit you want to see."
          />
        );
      }

      const deposit = await getDeposit(selection.leaseId);
      if (!deposit.ok) {
        return (
          <LoadErrorPanel label="Your caution deposit" failure={deposit} />
        );
      }
      if (deposit.data === null) {
        return (
          <Panel>
            <p className="text-body-md text-neutral-700">
              Vemra has not recorded a caution deposit for this lease yet.
            </p>
          </Panel>
        );
      }

      return (
        <div className="flex flex-col gap-4">
          <Panel>
            <DepositSummary deposit={deposit.data} />
          </Panel>
          <Panel>
            <h2 className="text-body-md font-semibold text-neutral-900">
              Refund decision
            </h2>
            <p className="mt-2 text-body-sm text-neutral-700">
              If Vemra has published a decision on this deposit, you can accept
              it or raise a dispute here.
            </p>
            <div className="mt-4">
              <DepositDecisionActions leaseId={selection.leaseId} />
            </div>
          </Panel>
        </div>
      );
    }

    case "saved-properties": {
      const saved = await getSavedProperties();
      if (saved.length === 0) {
        return (
          <Panel>
            <p className="text-body-md text-neutral-700">
              No saved properties yet.{" "}
              <Link href="/browse" className="font-semibold text-brand-700">
                Browse rentals
              </Link>
              .
            </p>
          </Panel>
        );
      }
      return (
        <div className="flex flex-col gap-3">
          {saved.map((item) => (
            <Panel key={item.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-body-md font-semibold text-neutral-900">
                    {item.listing?.title ?? "Saved property"}
                  </p>
                  <p className="text-label-sm text-neutral-700">
                    Saved {formatDate(item.savedAt)}
                  </p>
                </div>
                <UnsavePropertyButton propertyId={item.id} />
              </div>
            </Panel>
          ))}
        </div>
      );
    }

    case "my-rentals": {
      const leases = await getTenantLeases();
      if (!leases.ok) {
        return <LoadErrorPanel label="Your rentals" failure={leases} />;
      }
      return (
        <Panel>
          <DataList
            items={leases.data.map(
              (lease) =>
                `${lease.status ?? "Lease"}${
                  lease.annualRent === undefined
                    ? ""
                    : ` · ${formatMoney(lease.annualRent)}`
                }${
                  lease.startDate === undefined
                    ? ""
                    : ` · from ${formatDate(lease.startDate)}`
                }`,
            )}
            empty="No rental records yet."
          />
        </Panel>
      );
    }

    case "referrals": {
      const data = await getReferralProgram();
      return (
        <Panel>
          {data === null ? (
            <p className="text-body-md text-neutral-700">
              Your referral details are not available yet.
            </p>
          ) : (
            <DataList
              items={[
                `Share link: ${data.shareUrl}`,
                `${data.referredCount} referred · ${data.successfulCount} successful · ${formatMoney(
                  data.rewardsEarned,
                )} earned`,
                ...data.referrals.map((item) => `${item.name} · ${item.status}`),
              ]}
            />
          )}
        </Panel>
      );
    }

    case "notifications": {
      const data = await getNotifications();
      if (data.items.length === 0) {
        return (
          <Panel>
            <p className="text-body-md text-neutral-700">
              No notifications yet.
            </p>
          </Panel>
        );
      }
      return (
        <div className="flex flex-col gap-3">
          {data.items.map((item) => (
            <Panel key={item.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-body-md font-semibold text-neutral-900">
                    {item.title}
                  </p>
                  {item.body ? (
                    <p className="text-body-sm text-neutral-700">{item.body}</p>
                  ) : null}
                  <p className="text-label-sm text-neutral-700">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                <MarkNotificationReadButton notificationId={item.id} />
              </div>
            </Panel>
          ))}
        </div>
      );
    }

    case "settings": {
      const preferences = await getNotificationPreferences();
      return preferences.ok ? (
        <NotificationPreferencesForm preferences={preferences.data} />
      ) : (
        <LoadErrorPanel
          label="Your notification preferences"
          failure={preferences}
        />
      );
    }

    case "profile": {
      const [account, session] = await Promise.all([
        getAccount(),
        getSession(),
      ]);
      return account === null ? (
        <LoadErrorPanel
          label="Your profile"
          failure={{
            ok: false,
            message: "We could not load your account details.",
            requestId: null,
            isWaking: false,
          }}
        />
      ) : (
        <div className="flex flex-col gap-4 md:gap-6">
          <AvatarUploader
            name={account.displayName ?? account.email}
            initials={session?.user.initials ?? ""}
            avatarUrl={account.avatarUrl ?? null}
          />
          <ProfileForm
            displayName={account.displayName ?? ""}
            email={account.email}
            phone={account.phone ?? ""}
            handle={account.handle ?? ""}
          />
        </div>
      );
    }
  }
}

function DepositSummary({ deposit }: { deposit: unknown }) {
  const record =
    deposit !== null && typeof deposit === "object"
      ? (deposit as Record<string, unknown>)
      : {};

  const rows = Object.entries(record)
    .filter(([, value]) => typeof value === "string" || typeof value === "number")
    .map(([key, value]) => `${key}: ${String(value)}`);

  return (
    <>
      <h2 className="text-body-md font-semibold text-neutral-900">
        Deposit held
      </h2>
      <div className="mt-3">
        <DataList items={rows} empty="No deposit details available." />
      </div>
    </>
  );
}

export function TenantRentChangeScreen() {
  return (
    <div className="mx-auto flex max-w-140 flex-col gap-5">
      <div>
        <h1 className="font-display text-heading-lg font-bold">Rent change</h1>
        <p className="mt-1 text-body-md text-neutral-700">
          Rent changes are proposed and approved inside Vemra.
        </p>
      </div>
      <UnsupportedPanel capability={UNSUPPORTED.tenantRentChange} />
    </div>
  );
}

function ScreenHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h1 className="font-display text-heading-lg font-bold text-neutral-900 md:text-heading-xl">
        {title}
      </h1>
      <p className="mt-1 text-body-md text-neutral-700 md:text-body-lg">
        {description}
      </p>
    </div>
  );
}

function DataList({
  items,
  empty = "No records available.",
}: {
  items: readonly string[];
  empty?: string;
}) {
  return items.length > 0 ? (
    <ul className="divide-y divide-neutral-200">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="py-3 text-body-sm text-neutral-800"
        >
          {item}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-body-md text-neutral-700">{empty}</p>
  );
}
