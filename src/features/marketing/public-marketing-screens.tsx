import Image from "next/image";
import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { PROPERTIES } from "@/constants/marketing";
import { cn } from "@/lib/cn";
import { CONTAINER, SECTION_GUTTER } from "@/lib/layout";

const MAPLE = PROPERTIES[0];

const detailStats = [
  ["2", "Bedrooms"],
  ["1", "Bathroom"],
  ["820 sq ft", "Floor area"],
  ["Sep 15", "Available from"],
] as const;

const applicationSteps = [
  ["1", "Apply through Vemra", "Tenants submit their application and required details through Vemra."],
  ["2", "Vemra verifies and reviews", "Vemra verifies the information and reviews the application before moving it forward."],
  ["3", "Decision is communicated", "Vemra shares the decision through the assigned Property Admin or Support."],
  ["4", "Lease is sent through Vemra", "Approved tenants receive the lease through Vemra for the next step."],
] as const;

export function ListingDetailScreen() {
  return (
    <div className={cn(CONTAINER, SECTION_GUTTER, "py-5 md:py-8 lg:py-6")}>
      <p className="mb-5 text-caption text-neutral-700">Browse rentals&nbsp; / &nbsp;Maple & 9th&nbsp; / &nbsp;<strong>Unit 4B</strong></p>
      <div className="grid gap-6 lg:grid-cols-[1fr_242px]">
        <div>
          <div className="grid gap-2 md:grid-cols-[2fr_1fr]">
            <Image src="/marketing/listing-maple-9th.png" alt={MAPLE.imageAlt} width={800} height={560} className="h-full min-h-60 w-full rounded-lg object-cover md:row-span-2" />
            <Image src="/marketing/listing-maple-9th-2.png" alt="" width={400} height={220} className="h-32 w-full rounded-lg object-cover md:h-full" />
            <Image src="/marketing/listing-maple-9th-3.png" alt="" width={400} height={220} className="h-32 w-full rounded-lg object-cover md:h-full" />
          </div>
          <div className="mt-5 flex items-start justify-between border-b border-neutral-200 pb-5">
            <div><h1 className="font-display text-heading-lg font-bold text-neutral-900">2-bed apartment, Unit 4B</h1><p className="text-body-sm text-neutral-700">Maple & 9th, Unit 4B</p></div>
            <p className="text-right font-display text-heading-md font-bold text-brand-700">₦1,450<span className="block text-caption font-normal text-neutral-700">per year</span></p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 py-6 md:grid-cols-4">
            {detailStats.map(([value, label]) => <div key={label} className="border-r border-neutral-200 last:border-0"><p className="font-display text-body-lg font-bold text-neutral-900">{value}</p><p className="text-caption text-neutral-700">{label}</p></div>)}
          </div>
          <section className="border-b border-neutral-200 py-6"><h2 className="text-heading-sm font-bold">About this home</h2><p className="mt-3 text-body-sm text-neutral-700">A quiet 2-bedroom on the fourth floor with morning light through the living room windows. Recently repainted, with in-unit laundry and a dedicated parking space. Five-minute walk to the 9th Street transit stop.</p></section>
          <section className="border-b border-neutral-200 py-6"><h2 className="text-heading-sm font-bold">How applications work</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{applicationSteps.map(([number, title, copy]) => <article key={number} className="rounded-lg border border-neutral-200 p-3"><span className="inline-flex size-5 items-center justify-center rounded-full bg-brand-700 text-caption font-bold text-white">{number}</span><h3 className="mt-2 text-label-md font-bold">{title}</h3><p className="mt-2 text-caption text-neutral-700">{copy}</p></article>)}</div></section>
          <section className="py-6"><h2 className="text-heading-sm font-bold">Amenities</h2><ul className="mt-3 grid grid-cols-2 gap-2 text-body-sm text-neutral-700"><li>• In-unit washer & dryer</li><li>• Dedicated parking space</li><li>• Central heating</li><li>• Pet-friendly</li><li>• Elevator access</li><li>• Storage unit included</li></ul></section>
        </div>
        <aside className="h-fit overflow-hidden rounded-lg border border-neutral-200"><div className="bg-[#003e48] px-4 py-3 text-label-sm text-white">◯ &nbsp;Landlord verified</div><div className="space-y-4 p-4"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-lg bg-brand-700 text-label-sm text-white">PN</span><div><p className="text-label-sm font-bold">Priya Nandan</p><p className="text-caption text-neutral-700">Assigned property admin · manages this property only</p></div></div><dl className="space-y-3 border-t border-neutral-200 pt-4 text-caption"><div className="flex justify-between"><dt>Owned by</dt><dd className="font-semibold">Daniel Osei</dd></div><div className="flex justify-between"><dt>On Vemra since</dt><dd className="font-semibold">2023</dd></div><div className="flex justify-between"><dt>Other units managed</dt><dd className="font-semibold">2 nearby</dd></div></dl><Link href="/signup" className={buttonClasses({ size: "sm", fullWidth: true })}>Apply through Vemra</Link><Link href="/profile/priya-nandan" className={buttonClasses({ size: "sm", variant: "secondary", fullWidth: true })}>Contact Property Admin</Link></div></aside>
      </div>
    </div>
  );
}

export function EmptySearchScreen() {
  return <div className={cn(CONTAINER, SECTION_GUTTER, "py-10 md:py-12")}><div className="rounded-lg border border-neutral-200 p-4"><div className="flex flex-wrap items-center gap-2 text-caption"><strong>Active filters:</strong>{["Under ₦900/yr", "3+ bedrooms", "Riverside Court"].map((filter, i) => <span key={filter} className={cn("rounded-full border px-3 py-1", i === 0 && "border-brand-700 bg-brand-700 text-white")}>{filter} ×</span>)}</div></div><div className="mx-auto flex max-w-140 flex-col items-center py-20 text-center"><div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-brand-700/5 text-3xl text-brand-700">⌕</div><h1 className="text-heading-md font-bold">No homes match these filters</h1><p className="mt-2 max-w-120 text-body-sm text-neutral-700">There aren&apos;t any verified listings under ₦900/yr with 3+ bedrooms in Riverside Court right now. Try widening your search.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/browse" className={buttonClasses({ size: "sm", variant: "secondary" })}>Clear filters</Link><Link href="/signup" className={buttonClasses({ size: "sm" })}>Get notified of new matches</Link></div></div></div>;
}

export function AboutContactScreen() {
  return <div className={cn(CONTAINER, SECTION_GUTTER, "py-12 md:py-16")}><div className="mx-auto max-w-140 text-center"><h1 className="font-display text-display-md font-bold">Renting, out in the open.</h1><p className="mt-4 text-body-lg font-semibold text-neutral-700">Vemra connects landlords, tenants, and authorized Vemra admins around one shared record — so nobody&apos;s guessing who they&apos;re renting from, or whether their rent has been received.</p></div><div className="my-12 grid grid-cols-3 border-y border-neutral-200 py-6 text-center">{[["2,400+", "Verified landlords"], ["18,900+", "Homes listed"], ["2023", "Founded"]].map(([value, label]) => <div key={label}><p className="font-display text-display-sm font-bold text-brand-700">{value}</p><p className="text-caption text-neutral-700">{label}</p></div>)}</div><h2 className="text-heading-md font-bold">Get in touch</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{[["▢", "General support", "Questions about your account, a listing, or a payment.", "Open a support ticket →"], ["♢", "For landlords", "Partnerships, bulk listings, or property management questions.", "landlords@vemra.com"], ["▤", "Press & media", "Interview requests and media inquiries.", "press@vemra.com"]].map(([icon, title, copy, action]) => <article key={title} className="rounded-lg border border-neutral-200 p-5 shadow-elevation-3"><span className="text-xl text-brand-700">{icon}</span><h3 className="mt-4 text-heading-sm font-bold">{title}</h3><p className="mt-4 text-body-sm text-neutral-700">{copy}</p><p className="mt-4 text-label-sm font-semibold text-brand-700">{action}</p></article>)}</div></div>;
}

export function RoleMarketingScreen({ role }: { role: "landlord" | "tenant" }) {
  const landlord = role === "landlord";
  return <div className={cn(CONTAINER, SECTION_GUTTER, "py-12 md:py-16")}><div className="mx-auto max-w-140"><p className="text-label-sm font-semibold uppercase tracking-wide text-brand-700">For {landlord ? "landlords" : "tenants"}</p><h1 className="mt-3 font-display text-display-md font-bold">{landlord ? "Keep your rental business clear and accountable." : "Know who holds your keys before you pay."}</h1><p className="mt-4 text-body-lg text-neutral-700">{landlord ? "List your homes, follow occupancy and rent, and work with an assigned Vemra Property Admin when a property needs support." : "Browse verified homes, track rent and payments, and keep every important tenancy update in one place."}</p><div className="mt-8 flex flex-wrap gap-3"><Link href={landlord ? "/list-your-property" : "/browse"} className={buttonClasses({ size: "sm" })}>{landlord ? "List your property" : "Find a home to rent"}</Link><Link href="/signup" className={buttonClasses({ size: "sm", variant: "secondary" })}>Create an account</Link></div></div><div className="mt-12 grid gap-4 md:grid-cols-3">{(landlord ? [["Occupancy overview", "See occupied and vacant units at a glance."], ["Cleared rent", "Know what is ready to withdraw."], ["Property Admin assignment", "Get operational support through Vemra."]] : [["Verified listings", "See who owns and manages a home before you apply."], ["Rent tracking", "Keep due dates and payment history together."], ["One shared record", "Stay aligned with your landlord and Property Admin."]]).map(([heading, copy]) => <article key={heading} className="rounded-lg border border-neutral-200 bg-white p-5"><h2 className="text-heading-sm font-bold">{heading}</h2><p className="mt-2 text-body-sm text-neutral-700">{copy}</p></article>)}</div></div>;
}

export function VerificationScreen() {
  return <div className={cn(CONTAINER, SECTION_GUTTER, "py-12 md:py-16")}><div className="mx-auto max-w-140 text-center"><p className="text-label-sm font-semibold uppercase tracking-wide text-brand-700">Verification</p><h1 className="mt-3 font-display text-display-md font-bold">A verified record before money changes hands.</h1><p className="mt-4 text-body-lg text-neutral-700">Vemra checks identity and listing details, then keeps landlord, tenant, and Property Admin updates in one shared record.</p><Link href="/signup" className={buttonClasses({ size: "sm", className: "mt-8" })}>Create an account</Link></div></div>;
}

export function SupportScreen() {
  return <div className={cn(CONTAINER, SECTION_GUTTER, "py-12 md:py-16")}><div className="mx-auto max-w-140"><h1 className="font-display text-display-md font-bold">How can we help?</h1><p className="mt-4 text-body-lg text-neutral-700">Contact Vemra Support for questions about your account, a listing, a payment, or a Property Admin update.</p><section className="mt-8 rounded-lg border border-neutral-200 bg-white p-6"><h2 className="text-heading-sm font-bold">Open a support request</h2><p className="mt-2 text-body-sm text-neutral-700">Sign in so we can securely connect your request to the right property or tenancy record.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/login" className={buttonClasses({ size: "sm" })}>Log in to get support</Link><Link href="/about" className={buttonClasses({ size: "sm", variant: "secondary" })}>Contact Vemra</Link></div></section></div></div>;
}

export function ProfileScreen() {
  const cards = ["/marketing/profile-property-1.png", "/marketing/profile-property-2.png", "/marketing/profile-property-3.png"];
  return <div className={cn(CONTAINER, SECTION_GUTTER, "py-8")}><section className="flex flex-col gap-5 rounded-lg border border-neutral-200 p-5 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-4"><Image src="/marketing/profile-priya.png" alt="Priya Nandan" width={64} height={64} className="size-16 rounded-xl object-cover" /><div><h1 className="text-heading-md font-bold">Priya Nandan <span className="text-label-sm text-brand-700">Verified</span></h1><p className="text-body-sm text-neutral-700">Assigned Property Admin · Maple & 9th district</p></div></div><div className="flex gap-3"><button className={buttonClasses({ size: "sm", variant: "secondary" })}>Contact Property Admin</button><button className={buttonClasses({ size: "sm" })}>View listings</button></div></section><section className="my-7 grid grid-cols-2 gap-4 rounded-lg border border-neutral-200 p-5 md:grid-cols-4">{[["3", "Units managed"], ["2023", "On Vemra since"], ["~2 hrs", "Typical response"], ["4.9", "Tenant rating"]].map(([value, label]) => <div key={label}><p className="font-display text-heading-md font-bold text-brand-700">{value}</p><p className="text-caption text-neutral-700">{label}</p></div>)}</section><section className="rounded-lg border border-neutral-200 p-5"><h2 className="text-heading-md font-bold">About</h2><p className="mt-3 text-body-sm text-neutral-700">Priya has managed properties in the Maple & 9th district since 2023, working directly with landlord Daniel Osei across three units. Tenants can reach her for viewings, maintenance requests, and lease questions.</p></section><h2 className="mt-8 text-heading-md font-bold">Currently managing</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{cards.map((src, i) => <Link href="/properties/maple-9th-4b" key={src} className="overflow-hidden rounded-lg border border-neutral-200"><Image src={src} alt="" width={400} height={180} className="h-32 w-full object-cover" /><div className="p-3"><p className="font-display text-body-lg font-bold text-brand-700">₦{i === 2 ? "1,290" : "1,450"} /yr</p><p className="text-body-sm">Unit {i === 0 ? "2A" : i === 1 ? "4B" : "3C"} · Maple & 9th</p><p className="text-caption text-neutral-700">• {i === 2 ? "Available now" : "Occupied"}</p></div></Link>)}</div></div>;
}
