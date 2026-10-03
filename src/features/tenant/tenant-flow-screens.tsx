import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { TENANT_ROUTES } from "@/constants/tenant";
import {
  getCautionDeposit,
  getConversations,
  getNotifications,
  getReferralProgram,
  getRentSavings,
  getSavedProperties,
  getTenantMaintenance,
  getTenantPayments,
  getTenantProfile,
  getTenantRentals,
  getTenantSettings,
} from "@/lib/api/resources/tenant";
import { formatDate, formatMoney, formatRent } from "@/lib/format";

export type TenantScreenKey =
  | "messages"
  | "payment-history"
  | "maintenance"
  | "rent-savings"
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
  "rent-savings": {
    title: "Rent savings plan",
    description: "Save incrementally toward your next rent target.",
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
    description: "Invite friends to Vemra and earn when they complete a tenancy.",
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
    description: "Manage the personal details connected to your Vemra account.",
  },
};

export async function TenantFlowScreen({ screen }: { screen: TenantScreenKey }) {
  const copy = COPY[screen];
  return (
    <div className="flex max-w-240 flex-col gap-6">
      <ScreenHeading title={copy.title} description={copy.description} />
      <section className="rounded-lg border border-neutral-200 bg-white p-5 md:p-6">
        {await renderScreen(screen)}
      </section>
    </div>
  );
}

async function renderScreen(screen: TenantScreenKey) {
  switch (screen) {
    case "messages": {
      const data = await getConversations();
      return (
        <DataList
          items={data.map(
            (item) => `${item.participant.name}: ${item.lastMessagePreview}`,
          )}
        />
      );
    }
    case "payment-history": {
      const data = await getTenantPayments();
      return (
        <DataList
          items={data.map(
            (item) =>
              `${item.label} · ${formatDate(item.date)} · ${formatMoney(item.amount)} · ${item.status}`,
          )}
        />
      );
    }
    case "maintenance": {
      const data = await getTenantMaintenance();
      return (
        <DataList
          items={data.requests.map(
            (item) =>
              `${item.title} · ${item.status} · ${formatDate(item.submittedAt)}`,
          )}
          empty="No maintenance requests yet."
        />
      );
    }
    case "rent-savings": {
      const data = await getRentSavings();
      return data ? (
        <DataList
          items={[
            `Saved ${formatMoney(data.savedAmount)}`,
            `Remaining ${formatMoney(data.remainingAmount)}`,
            ...data.contributions.map(
              (item) =>
                `${formatMoney(item.amount)} · ${formatDate(item.date)} · ${item.method}`,
            ),
          ]}
        />
      ) : (
        <EmptyState
          action="Set up rent savings"
          href={TENANT_ROUTES.rentSavings}
        />
      );
    }
    case "caution-deposit": {
      const data = await getCautionDeposit();
      return data ? (
        <DataList
          items={[
            `${formatMoney(data.amount)} · ${data.status}`,
            ...data.timeline.map(
              (item) =>
                `${item.label} · ${item.isComplete ? "Complete" : "Pending"}`,
            ),
            ...data.deductions.map(
              (item) => `${item.reason} · ${formatMoney(item.amount)}`,
            ),
          ]}
        />
      ) : (
        <EmptyState />
      );
    }
    case "saved-properties": {
      const data = await getSavedProperties();
      return (
        <DataList
          items={data.map(
            (item) => `${item.listing.title} · ${formatDate(item.savedAt)}`,
          )}
          empty="No saved properties yet."
        />
      );
    }
    case "my-rentals": {
      const data = await getTenantRentals();
      return (
        <DataList
          items={[
            ...(data.current
              ? [
                  `${data.current.unit.name} · ${formatRent(
                    data.current.rent,
                    data.current.rentPeriod,
                  )} · ${data.current.status}`,
                ]
              : []),
            ...data.history.map((item) => `${item.unit.name} · ${item.status}`),
          ]}
          empty="No rental records yet."
        />
      );
    }
    case "referrals": {
      const data = await getReferralProgram();
      return data ? (
        <DataList
          items={[
            `Share link: ${data.shareUrl}`,
            `${data.referredCount} referred · ${data.successfulCount} successful · ${formatMoney(data.rewardsEarned)} earned`,
            ...data.referrals.map((item) => `${item.name} · ${item.status}`),
          ]}
        />
      ) : (
        <EmptyState />
      );
    }
    case "notifications": {
      const data = await getNotifications();
      return (
        <DataList
          items={data.items.map(
            (item) =>
              `${item.title}${item.body ? ` · ${item.body}` : ""} · ${formatDate(item.createdAt)}`,
          )}
          empty="No notifications yet."
        />
      );
    }
    case "settings": {
      const data = await getTenantSettings();
      return (
        <DataList
          items={data.notificationGroups.flatMap((group) =>
            group.preferences.map(
              (item) =>
                `${group.title}: ${item.label} · ${item.isEnabled ? "On" : "Off"}`,
            ),
          )}
          empty="No notification preferences available."
        />
      );
    }
    case "profile": {
      const data = await getTenantProfile();
      return (
        <DataList
          items={[
            data.fullName,
            data.email,
            data.phone ?? "No phone number",
            data.isVerified ? "Verified" : data.verificationNote ?? "Verification pending",
          ]}
        />
      );
    }
  }
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
  return items.length ? (
    <ul className="divide-y divide-neutral-200">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="py-3 text-body-sm text-neutral-800">
          {item}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-body-md text-neutral-700">{empty}</p>
  );
}

function EmptyState({
  action,
  href,
}: {
  action?: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <p className="text-body-md text-neutral-700">No data available yet.</p>
      {action && href ? (
        <Link href={href} className={buttonClasses({ size: "sm" })}>
          {action}
        </Link>
      ) : null}
    </div>
  );
}
