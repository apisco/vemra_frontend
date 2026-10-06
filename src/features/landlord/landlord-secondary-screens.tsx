"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LANDLORD_ROUTES } from "@/constants/landlord";
import { FileTextIcon } from "@/components/icons/file-text-icon";
import { ShieldIcon } from "@/components/icons/shield-icon";
import { WrenchIcon } from "@/components/icons/wrench-icon";
import { CreditCardIcon } from "@/components/icons/credit-card-icon";
import { LockIcon } from "@/components/icons/lock-icon";
import type {
  ApplicationQueue,
  MaintenanceOverview,
} from "@/types/api/landlord";

const panel = "rounded-lg border border-neutral-200 bg-white p-4 md:p-5";
const title = "font-display text-heading-sm font-semibold text-neutral-900";
const muted = "text-body-sm text-neutral-700";

export function PayoutAccountScreen() { return <Screen title="Payout account" description="Where your rent goes once a payment clears and you withdraw it."><EmptyState icon={<LockIcon />} title="Payout account not connected" description="Connect a payout account to withdraw cleared rent. This is coming soon." /></Screen>; }
export function StatementScreen() { return <Screen title="Transaction statement" description="Every rent payment, from when a tenant pays to when it lands in your bank."><EmptyState icon={<FileTextIcon />} title="No transactions yet" description="Rent payments and withdrawals will appear here once your first tenant pays rent." /></Screen>; }
export function MaintenanceScreen({ overview }: { overview: MaintenanceOverview }) {
  if (overview.reports.length === 0) {
    return <Screen title="Maintenance Reports" description="Oversee maintenance actions, work orders, and requests across your units."><EmptyState icon={<WrenchIcon />} title="No maintenance reports" description="Maintenance issues reported by tenants appear here." action={<Link href={LANDLORD_ROUTES.properties} className="inline-flex h-10 items-center rounded-md bg-brand-700 px-5 text-label-md font-semibold text-white">View Properties</Link>} /></Screen>;
  }
  const headers = ["Property", "Issue", "Category", "Urgency", "Status"];
  return <Screen title="Maintenance Reports" description="Oversee maintenance actions, work orders, and requests across your units."><div className="grid gap-4 md:grid-cols-3"><StatCard variant="outlined" title="Open Requests" value={String(overview.openCount)} /><StatCard variant="outlined" title="Scheduled Work" value={String(overview.scheduledCount)} /><StatCard variant="outlined" title="Resolved" value={String(overview.resolvedThisMonth)} /></div><section className={panel}><Table caption="Maintenance reports"><TableHead>{headers.map((head)=><TableHeaderCell key={head}>{head}</TableHeaderCell>)}</TableHead><TableBody>{overview.reports.map((report)=><TableRow key={report.id}><TableCell isPrimary>{report.propertyName}</TableCell><TableCell>{report.issue}</TableCell><TableCell>{report.category}</TableCell><TableCell>{report.urgency}</TableCell><TableCell>{report.status}</TableCell></TableRow>)}</TableBody></Table></section></Screen>;
}

export function CautionDepositsScreen() { return <Screen title="Caution Deposits" description="Manage tenant escrow deposits, propose damage deductions, or trigger refunds."><EmptyState icon={<ShieldIcon />} title="No caution deposits" description="Tenant caution deposits will be tracked here in escrow once they are paid." /></Screen>; }
export function SettingsScreen() {
  return <Screen title="Settings"><section className={panel}><h2 className={title}>Profile</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><Input label="Full name" defaultValue="Daniel Osei" /><Input label="Email Address" defaultValue="daniel@example.com" type="email" /><Input label="Phone Number" defaultValue="+234 801 234 5678" /><Input label="Password" defaultValue="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" type="password" /></div><Button className="mt-4" size="sm">Save changes</Button></section><section className={panel}><h2 className={title}>Notifications</h2><ToggleList items={["Rent payment confirmations","New messages","New applications"]} /></section><section className="flex items-center justify-between rounded-lg border border-error-600 bg-error-50 p-4"><div><h2 className="text-body-md font-semibold text-error-600">Delete account</h2><p className={muted}>Permanently removes your listings and history</p></div><Button variant="destructive" size="sm">Delete account</Button></section></Screen>;
}

export function NotificationPreferencesScreen() {
  return <Screen title="Notification preferences" description="Choose what you hear from us, and how."><div className="space-y-5">{[["Property Admin communication",["Property Admin communication","Assigned Property Admin updates","Property Admin assignment changes"]],["Operations",["Rent-price approval requests","Maintenance updates","Caution-deposit recommendations"]],["Rent & payouts",["Rent and payout events"]],["Account & product",["Account security","Product updates"]]].map(([heading,items])=><section className={panel} key={heading as string}><p className="text-label-sm font-semibold text-brand-700">{heading}</p><div className="mt-3 divide-y divide-neutral-100">{(items as string[]).map((item,i)=><ToggleList key={item} items={[item]} pushDefault={i!==2}/>)}</div></section>)}</div></Screen>;
}

function ToggleList({ items, pushDefault = true }: { items: string[]; pushDefault?: boolean }) {
  const [values,setValues]=useState(items.map((_,i)=>pushDefault && i!==2));
  return <div>{items.map((item,i)=><div key={item} className="flex items-center justify-between gap-4 border-b border-neutral-100 py-3 last:border-0"><div><p className="text-body-sm font-semibold text-neutral-900">{item}</p><p className={muted}>Email and push notifications for {item.toLowerCase()}</p></div><button type="button" aria-pressed={values[i]} onClick={()=>setValues(v=>v.map((x,j)=>j===i?!x:x))} className={`relative h-5 w-8 rounded-full ${values[i]?"bg-brand-700":"bg-neutral-200"}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${values[i]?"translate-x-3.5":"translate-x-0.5"}`} /></button></div>)}</div>;
}

export function ApplicationsScreen({ queue }: { queue: ApplicationQueue }) {
  if (queue.items.length === 0) {
    return <Screen title="Applications" description="Review applications from tenants who want to rent your vacant properties."><EmptyState icon={<FileTextIcon />} title="No applications yet" description="When tenants apply for your vacant properties, their applications will appear here for review." /></Screen>;
  }
  const filters = [["All", queue.counts.all], ["New", queue.counts.new], ["Reviewed", queue.counts.reviewed], ["Approved", queue.counts.approved], ["Declined", queue.counts.declined]] as const;
  return <Screen title="Applications" description={`${queue.items.length} application${queue.items.length === 1 ? "" : "s"} to review.`}><div className="flex flex-wrap gap-2">{filters.map(([label, count], index) => <span key={label} className={`rounded-full border px-4 py-2 text-label-sm font-semibold ${index === 0 ? "border-brand-700 bg-brand-700 text-white" : "border-neutral-200 bg-white text-neutral-700"}`}>{label} ({count})</span>)}</div><section className="mt-4 space-y-3">{queue.items.map((item) => <Link key={item.id} href={`/landlord/applications/${item.id}`} className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-brand-700"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-label-sm font-semibold text-brand-700">{item.applicant.initials}</span><span className="min-w-0 flex-1"><strong className="block text-body-md text-neutral-900">{item.applicant.name}</strong><span className="block truncate text-label-sm text-neutral-700">{item.summary}</span></span><span className={`rounded-full px-2 py-1 text-label-sm font-semibold ${item.status === "new" ? "bg-warning-50 text-warning-600" : item.status === "declined" ? "bg-error-50 text-error-600" : "bg-neutral-100 text-neutral-700"}`}>{item.status}</span></Link>)}</section></Screen>;
}

export function ApplicationReviewScreen() {
  return <Screen title="Review Vemra application" description="Submitted 2 days ago Â· move-in requested Sep 15"><div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><div className="space-y-5"><section className={panel}><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 font-semibold text-brand-700">GA</span><div><h2 className={title}>Grace Adeyemi</h2><p className={muted}>Applying for Unit 3C, Maple &amp; 9th</p></div></div><div className="mt-5 grid gap-4 border-t border-neutral-200 pt-4 sm:grid-cols-2"><div><p className={muted}>Current employer</p><strong>Lagos Design Co.</strong></div><div><p className={muted}>Requested move-in</p><strong>Sep 15, 2026</strong></div></div><p className="mt-5 text-body-sm italic text-neutral-700">&quot;I&apos;m relocating for work and this would be close to my new office. Happy to provide any additional references.&quot;</p></section><section className={panel}><h2 className={title}>Verification documents</h2><div className="mt-4 space-y-2">{["Government ID Â· Verified", "Proof of income Â· Verified", "Background & credit check Â· Clear"].map((item) => <div key={item} className="rounded-md border border-neutral-200 p-3 text-body-sm">{item}</div>)}</div></section></div><section className={panel}><h2 className={title}>Decision</h2><p className={`mt-4 ${muted}`}>Vemra reviews the applicant&apos;s identity, income, background, and suitability. Property Admins process the decision on behalf of Vemra; landlords do not contact or review tenants directly.</p><div className="mt-5 flex flex-col gap-2"><Button size="sm">Approve for lease preparation</Button><Button variant="secondary" size="sm">Request details via Vemra</Button><Button variant="destructive" size="sm">Decline application</Button></div></section></div></Screen>;
}

export function PropertyAdminInviteScreen() {
  return <Screen title="Invite a Property Admin" description="Assign a Vemra Property Admin to help manage your properties and tenant requests."><section className={`${panel} max-w-160`}><h2 className={title}>Property Admin details</h2><div className="mt-4 space-y-4"><Input label="Full name" placeholder="Enter their full name" /><Input label="Email address" type="email" placeholder="name@example.com" /><Input label="Properties to assign" placeholder="Select properties" /></div><Button className="mt-5">Send invite</Button></section></Screen>;
}

export function PaymentBreakdownScreen() { return <Screen title="Payment breakdown" description="Secure payments are fully managed through Vemra Escrow Vault."><EmptyState icon={<CreditCardIcon />} title="No payment to break down" description="Payment breakdowns appear here when you have a rent payment in progress." /></Screen>; }
function Screen({ title: heading, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) { return <div className="flex flex-col gap-5 md:gap-6"><div className="flex items-start justify-between gap-4"><div><h1 className="font-display text-heading-lg font-bold text-neutral-900 md:text-heading-xl">{heading}</h1>{description&&<p className={`mt-1 ${muted}`}>{description}</p>}</div>{action}</div>{children}</div>; }
