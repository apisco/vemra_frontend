import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { TENANT_ROUTES } from "@/constants/tenant";
import { cn } from "@/lib/cn";

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

const SCREEN_COPY: Record<
  TenantScreenKey,
  { title: string; description: string; action?: string; actionHref?: string }
> = {
  messages: {
    title: "Messages",
    description: "Contact your assigned Property Admin through Vemra.",
    action: "Browse homes",
    actionHref: "/browse",
  },
  "payment-history": {
    title: "Payment history",
    description: "Review cleared rent payments and installment activity.",
  },
  maintenance: {
    title: "Maintenance",
    description: "Report and track maintenance requests for your rental.",
    action: "Report an issue",
    actionHref: TENANT_ROUTES.maintenance,
  },
  "rent-savings": {
    title: "Rent savings",
    description: "Set aside rent ahead of your next due date.",
    action: "Set up rent savings",
    actionHref: TENANT_ROUTES.rentSavings,
  },
  "caution-deposit": {
    title: "Caution deposit",
    description: "Review the caution deposit connected to your rental.",
  },
  "saved-properties": {
    title: "Saved properties",
    description: "Keep track of homes you may want to apply for.",
    action: "Browse homes",
    actionHref: "/browse",
  },
  "my-rentals": {
    title: "My rentals",
    description: "View your active and previous rental applications.",
    action: "Browse homes",
    actionHref: "/browse",
  },
  referrals: {
    title: "Referrals",
    description: "Share Vemra with people looking for a verified rental.",
  },
  notifications: {
    title: "Notifications",
    description: "Stay up to date with rent, applications, and maintenance.",
  },
  settings: {
    title: "Settings",
    description: "Manage your tenant account preferences.",
  },
  profile: {
    title: "Profile",
    description: "Manage the personal details connected to your Vemra account.",
  },
};

export function TenantFlowScreen({ screen }: { screen: TenantScreenKey }) {
  const copy = SCREEN_COPY[screen];

  if (screen === "messages") {
    return (
      <div className="flex flex-col gap-6">
        <ScreenHeading title="Messages" description="Unit 4B · Maple and 9th" />
        <div className="grid min-h-140 gap-4 md:grid-cols-[214px_1fr]">
          <section className="rounded-lg border border-neutral-200 bg-white p-4">
            <h2 className="text-label-md font-bold">Recent Conversations</h2>
            {["Priya Nandan", "Priya Nandan", "Vemra Support"].map((name, index) => (
              <div key={`${name}-${index}`} className="mt-4 rounded-md border border-neutral-200 p-3">
                <p className="text-label-sm font-bold">{name}</p>
                <p className="mt-1 truncate text-caption text-neutral-700">
                  {index === 0 ? "Hi Aisha, I received your payment..." : "The latest update is available..."}
                </p>
              </div>
            ))}
          </section>
          <section className="flex flex-col rounded-lg border border-neutral-200 bg-white p-5">
            <h2 className="border-b border-neutral-200 pb-4 text-heading-sm font-bold">Priya Nandan</h2>
            <div className="flex-1 space-y-5 py-6 text-body-sm text-neutral-700">
              <p>Hi Aisha, hope you&apos;re settling in well. I&apos;ve received your second installment payment on Vemra. Thank you!</p>
              <p className="ml-auto max-w-100 rounded-lg bg-neutral-50 p-4">Thanks, Priya! Yes, the home is beautiful. I will be making the final installment payment next week.</p>
              <p>Perfect. Let me know if you need anything else from my side.</p>
            </div>
            <div className="flex gap-2 border-t border-neutral-200 pt-4"><input className="min-w-0 flex-1 rounded-md border border-neutral-200 px-3 text-body-sm" placeholder="Write your message here..." /><button className={buttonClasses({ size: "sm" })}>Send</button></div>
          </section>
        </div>
      </div>
    );
  }

  if (screen === "my-rentals") {
    return <div className="flex flex-col gap-6"><ScreenHeading title="My Rentals" description="Overview of your current lease and tenancy history" /><section><h2 className="mb-3 text-heading-sm font-bold">Current Tenancy</h2><div className="rounded-lg bg-brand-950 p-6 text-white"><span className="rounded-full bg-success-50 px-3 py-1 text-caption text-success-600">Active</span><h3 className="mt-4 font-display text-heading-lg font-bold">Unit 4B · Maple and 9th</h3><p>Landlord: Daniel Osei</p><div className="mt-6 flex gap-12"><span>Monthly Rent<strong className="block">₦450,000/yr</strong></span><span>Next Rent Due<strong className="block">Sep 5, 2026</strong></span></div></div></section><section><h2 className="mb-3 text-heading-sm font-bold">Rental History</h2><PanelList items={["Unit 2A · Maple and 9th, Abuja", "Unit 1C · Heritage Gardens, Lekki"]} /></section></div>;
  }

  if (screen === "rent-savings") {
    return <div className="flex flex-col gap-6"><ScreenHeading title="Rent savings plan" description="Save incrementally toward your next rent target" /><MetricGrid items={[["₦890,000", "Next Rent Target"], ["₦534,000", "Saved So Far"], ["₦356,000", "Remaining Target"]]} /><section className="rounded-lg border border-neutral-200 bg-white p-5"><h2 className="text-heading-sm font-bold">Savings progress</h2><div className="mt-4 h-2 rounded-full bg-neutral-200"><div className="h-full w-3/5 rounded-full bg-brand-700" /></div><div className="mt-4 flex gap-3"><button className={buttonClasses({ size: "sm" })}>Top Up Balance</button><button className={buttonClasses({ size: "sm", variant: "secondary" })}>Set Up Auto-Deposit</button></div></section><PanelList title="Contribution History" items={["₦89,000 · Aug 15, 2026 · via Bank Transfer", "₦89,000 · Jul 15, 2026 · via Card", "₦89,000 · Jun 15, 2026 · via Bank Transfer"]} /></div>;
  }

  if (screen === "caution-deposit") {
    return <div className="flex flex-col gap-6"><ScreenHeading title="Caution Deposit Tracking" description="Unit 4B · Maple and 9th" /><section className="grid gap-6 rounded-lg border border-neutral-200 bg-white p-6 md:grid-cols-[1fr_280px]"><div><span className="rounded-full bg-success-50 px-3 py-1 text-caption text-success-600">Active escrow</span><p className="mt-4 font-display text-display-sm font-bold">₦450,000</p><dl className="mt-5 space-y-3 text-body-sm"><div className="flex justify-between"><dt>Tenancy Period</dt><dd>Sep 2025 - Sep 2026</dd></div><div className="flex justify-between"><dt>Linked Tenancy</dt><dd>Maple and 9th · Unit 4B</dd></div><div className="flex justify-between"><dt>Paid Date</dt><dd>Aug 20, 2025</dd></div></dl></div><div><h2 className="text-heading-sm font-bold">Escrow Timeline</h2><ol className="mt-4 space-y-4 text-body-sm"><li>● Held</li><li className="text-neutral-500">● Pending Inspection</li><li className="text-neutral-500">● Eligible for Refund</li><li className="text-neutral-500">● Refunded</li></ol></div></section><section className="rounded-lg border border-neutral-200 bg-white p-5"><span className="rounded-full bg-success-50 px-3 py-1 text-caption text-success-600">Landlord decision recorded</span><h2 className="mt-3 text-heading-sm font-bold">Review deposit decision</h2><p className="mt-2 text-body-sm text-neutral-700">The landlord has shared a refund decision for this caution deposit.</p><Link href="/tenant/deposit-decision" className={buttonClasses({ size: "sm", className: "mt-4" })}>Review deposit decision</Link></section><PanelList title="Deduction History" items={["No deductions recorded"]} /></div>;
  }

  if (screen === "saved-properties") {
    return <div className="flex flex-col gap-6"><ScreenHeading title="Saved Properties" description="Your bookmarked listings and favorites" /><div className="grid gap-4 md:grid-cols-3">{["2-Bedroom Luxury Loft", "3-Bedroom Apartment", "Cozy Studio Flat"].map((title, index) => <article key={title} className="rounded-lg border border-neutral-200 bg-white p-4"><div className="h-32 rounded-md bg-neutral-200" /><span className="mt-3 block text-caption text-success-600">VERIFIED</span><h2 className="mt-1 text-heading-sm font-bold">{title}</h2><p className="text-body-sm text-neutral-700">{["Lekki Phase 1, Lagos", "Maple & 9th, Abuja", "Yaba, Lagos"][index]}</p><hr className="my-4 border-neutral-200" /><p className="font-display text-body-lg font-bold">₦{["650,000", "1,200,000", "350,000"][index]}/yr</p><button className={buttonClasses({ size: "sm", variant: "secondary", fullWidth: true, className: "mt-4" })}>Remove from Saved</button></article>)}</div></div>;
  }

  if (screen === "notifications") {
    return <div className="flex flex-col gap-6"><div className="flex items-center justify-between"><ScreenHeading title="Notification Inbox" description="Stay updated with property admin, rent, inspection, dispute and maintenance updates." /><button className={buttonClasses({ size: "sm" })}>Mark all as read</button></div><PanelList items={["Assigned Property Admin Assigned", "Approved Rent Change", "Maintenance Progress Updated", "Message from Priya Nandan · Assigned Property Admin", "Assigned Property Admin Replacement", "Inspection Scheduled", "Dispute Deadline", "Deposit Recommendation", "Landlord Decision Recorded by Vemra", "Message from Vemra Support"]} /></div>;
  }

  if (screen === "referrals") {
    return <div className="flex flex-col gap-6"><ScreenHeading title="Refer and earn" description="Invite friends to Vemra and earn when they complete a tenancy." /><section className="rounded-lg border border-neutral-200 bg-white p-6"><p className="text-caption text-neutral-700">Your referral link</p><div className="mt-3 flex gap-2"><input readOnly value="vemra.ng/r/grace-adeyemi" className="min-w-0 flex-1 rounded-md border border-neutral-200 px-3 py-3 text-body-sm" /><button className={buttonClasses({ size: "sm" })}>Copy link</button></div><div className="mt-4 flex gap-3"><button className={buttonClasses({ size: "sm", variant: "secondary" })}>Share on Twitter</button><button className={buttonClasses({ size: "sm", variant: "secondary" })}>Share on WhatsApp</button></div></section><MetricGrid items={[["12", "Friends referred"], ["₦120,000", "Rewards earned"], ["4", "Successful referrals"]]} /><PanelList title="Referral History" items={["Chinedu Okafor · Joined Aug 12, 2026 · Reward pending", "Amaka Obi · Completed tenancy Jul 04, 2026 · ₦30,000 earned"]} /></div>;
  }

  if (screen === "maintenance") {
    return <div className="flex flex-col gap-6"><ScreenHeading title="Maintenance" description="Report an issue and track maintenance requests for your home." /><section className="rounded-lg border border-neutral-200 bg-white p-5"><h2 className="text-heading-sm font-bold">Report an issue</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Property" value="Unit 4B · Maple and 9th" /><Field label="Category" value="Plumbing" /><Field label="Urgency" value="Normal" /><Field label="Description" value="Describe the issue..." wide /></div><button className={buttonClasses({ size: "sm", className: "mt-5" })}>Submit report</button></section><PanelList title="Recent Requests" items={["Leaking kitchen tap · Submitted Aug 18, 2026 · In progress", "Air conditioning issue · Resolved Jul 10, 2026"]} /></div>;
  }

  if (screen === "profile") {
    return <div className="flex max-w-160 flex-col gap-6"><ScreenHeading title="Your profile" description="Manage the personal details connected to your Vemra account." /><section className="rounded-lg border border-neutral-200 bg-white p-5"><h2 className="text-heading-sm font-bold">Personal details</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><ProfileField label="Full name" value="Aisha Bello" /><ProfileField label="Email address" value="aisha@example.com" /><ProfileField label="Phone number" value="+234 801 234 5678" /><ProfileField label="Role" value="Tenant" /></div><button type="button" className={buttonClasses({ size: "sm", className: "mt-5" })}>Save changes</button></section><section className="rounded-lg border border-neutral-200 bg-white p-5"><h2 className="text-heading-sm font-bold">Verification status</h2><p className="mt-2 text-body-sm text-neutral-700">Your identity verification is complete and your account can apply for verified Vemra listings.</p><span className="mt-4 inline-flex rounded-full bg-success-50 px-3 py-1 text-label-sm font-semibold text-success-600">Verified</span></section></div>;
  }

  if (screen === "settings") {
    return <div className="flex max-w-160 flex-col gap-6"><ScreenHeading title="Settings" description="Manage your tenant account preferences." /><section className="rounded-lg border border-neutral-200 bg-white p-5"><h2 className="text-heading-sm font-bold">Notifications</h2><div className="mt-4 divide-y divide-neutral-200">{["Rent and payment updates", "Maintenance updates", "Messages from your Property Admin", "Vemra product updates"].map((item) => <label key={item} className="flex items-center justify-between gap-4 py-3 text-body-sm"><span>{item}</span><input type="checkbox" defaultChecked className="size-4 accent-brand-700" /></label>)}</div></section><section className="rounded-lg border border-neutral-200 bg-white p-5"><h2 className="text-heading-sm font-bold">Security</h2><p className="mt-2 text-body-sm text-neutral-700">Update your password and manage account security preferences.</p><button type="button" className={buttonClasses({ size: "sm", variant: "secondary", className: "mt-4" })}>Change password</button></section></div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-heading-lg font-bold text-neutral-900 md:text-heading-xl">
          {copy.title}
        </h1>
        <p className="mt-1 text-body-md text-neutral-700 md:text-body-lg">
          {copy.description}
        </p>
      </div>

      <section
        className={cn(
          "flex min-h-64 flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-elevation-3",
          screen === "payment-history" && "items-stretch text-left",
        )}
      >
        {screen === "payment-history" ? (
          <div className="grid gap-3 md:grid-cols-2">
            {["Profile details", "Password", "Email notifications", "Payment reminders"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-lg border border-neutral-200 p-4 text-left text-label-md font-semibold text-neutral-900 hover:bg-neutral-50"
                >
                  {item}
                </button>
              ),
            )}
          </div>
        ) : (
          <>
            <div className="flex size-12 items-center justify-center rounded-full bg-brand-700/10 text-xl text-brand-700">
              —
            </div>
            <h2 className="mt-4 text-heading-sm font-bold">
              Nothing here yet
            </h2>
            <p className="mt-2 max-w-100 text-body-sm text-neutral-700">
              This area will show your Vemra activity as it becomes available.
            </p>
            {copy.action && copy.actionHref ? (
              <Link
                href={copy.actionHref}
                className={buttonClasses({ size: "sm", className: "mt-5" })}
              >
                {copy.action}
              </Link>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

function ScreenHeading({ title, description }: { title: string; description: string }) {
  return <div><h1 className="font-display text-heading-lg font-bold text-neutral-900 md:text-heading-xl">{title}</h1><p className="mt-1 text-body-md text-neutral-700">{description}</p></div>;
}

function PanelList({ title, items }: { title?: string; items: string[] }) {
  return <section className="rounded-lg border border-neutral-200 bg-white p-5">{title ? <h2 className="mb-4 text-heading-sm font-bold">{title}</h2> : null}<div className="divide-y divide-neutral-200">{items.map((item) => <div key={item} className="py-4 text-body-sm text-neutral-800 first:pt-0 last:pb-0">{item}</div>)}</div></section>;
}

function MetricGrid({ items }: { items: string[][] }) {
  return <div className="grid gap-4 md:grid-cols-3">{items.map(([value, label]) => <section key={label} className="rounded-lg border border-neutral-200 bg-white p-5"><p className="text-caption text-neutral-700">{label}</p><p className="mt-3 font-display text-heading-md font-bold text-brand-700">{value}</p></section>)}</div>;
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return <label className={wide ? "text-label-sm font-semibold md:col-span-2" : "text-label-sm font-semibold"}>{label}<div className="mt-2 rounded-md border border-neutral-200 px-3 py-3 text-body-sm font-normal text-neutral-700">{value}</div></label>;
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return <label className="text-label-sm font-semibold">{label}<div className="mt-2 rounded-md border border-neutral-200 px-3 py-3 text-body-sm font-normal text-neutral-700">{value}</div></label>;
}
