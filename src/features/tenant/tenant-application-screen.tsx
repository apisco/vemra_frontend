import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function TenantApplicationScreen() {
  return <TenantFormShell title="Apply to rent this home" description="Daniel Osei and Priya Nandan will review your application. You'll hear back within 2–3 days."><section className="rounded-lg border border-neutral-200 bg-white p-5"><h2 className="text-heading-sm font-bold">About you</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Full name" value="Grace Adeyemi" /><Field label="Move-in date" value="Sep 15, 2026" /><Field label="Current employer" value="Stripe Inc." wide /><Field label="Application note to Vemra (optional)" value="Hi Daniel and Priya, I'm looking forward to potentially moving in." wide /></div></section><section className="rounded-lg border border-neutral-200 bg-white p-5"><h2 className="text-heading-sm font-bold">Verification documents</h2><div className="mt-4 rounded-lg border border-dashed border-brand-700 p-8 text-center text-body-sm text-brand-700">Click to upload ID and proof of income</div></section><button className={buttonClasses({ fullWidth: true })}>Submit application</button></TenantFormShell>;
}

export function TenantLeaseScreen() {
  return <TenantFormShell title="Lease signing" description="Review and sign your lease agreement for Unit 4B · Maple and 9th."><section className="rounded-lg border border-neutral-200 bg-white p-6"><h2 className="text-heading-sm font-bold">Lease agreement</h2><p className="mt-4 text-body-sm text-neutral-700">Your approved lease is ready to review. Read the agreement before signing.</p><div className="mt-5 rounded-lg bg-neutral-50 p-5 text-body-sm text-neutral-700">Lease summary · Unit 4B · Maple and 9th · Daniel Osei</div><button className={buttonClasses({ fullWidth: true, className: "mt-5" })}>Sign lease agreement</button></section></TenantFormShell>;
}

export function TenantDecisionScreen() {
  return <TenantFormShell title="Deposit decision review" description="Review the landlord's caution deposit decision before the remaining amount is released."><section className="rounded-lg border border-neutral-200 bg-white p-6"><h2 className="text-heading-sm font-bold">Refund decision</h2><p className="mt-3 text-body-sm text-neutral-700">No deductions were recorded. Your caution deposit remains fully intact.</p><div className="mt-5 flex gap-3"><button className={buttonClasses({ size: "sm" })}>Accept decision</button><button className={buttonClasses({ size: "sm", variant: "secondary" })}>Dispute decision</button></div></section></TenantFormShell>;
}

export function TenantRentChangeScreen() {
  return <TenantFormShell title="Approved rent change" description="Review the updated rent amount and payment plan for your tenancy."><section className="rounded-lg border border-neutral-200 bg-white p-6"><p className="text-caption text-neutral-700">New annual rent</p><p className="mt-2 font-display text-display-sm font-bold text-brand-700">₦1,250,000</p><p className="mt-4 text-body-sm text-neutral-700">Starting 1 Oct. Your Assigned Property Admin will coordinate the next steps.</p><button className={buttonClasses({ size: "sm", className: "mt-5" })}>Review payment plan</button></section></TenantFormShell>;
}

function TenantFormShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <div className={cn("mx-auto flex max-w-140 flex-col gap-5")}><div><h1 className="font-display text-heading-lg font-bold">{title}</h1><p className="mt-1 text-body-md text-neutral-700">{description}</p></div>{children}</div>;
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return <label className={cn("text-label-sm font-semibold", wide && "md:col-span-2")}>{label}<div className="mt-2 rounded-md border border-neutral-200 px-3 py-3 text-body-sm font-normal text-neutral-700">{value}</div></label>;
}
import type { ReactNode } from "react";
