"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { LANDLORD_ROUTES } from "@/constants/landlord";

export default function RentApprovalPage() {
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <nav className="text-label-sm text-neutral-700">
        <Link href={LANDLORD_ROUTES.properties} className="hover:underline">
          Properties
        </Link>
        <span className="mx-2">/</span>
        <span>Unit 4B, Maple &amp; 9th</span>
        <span className="mx-2">/</span>
        <span className="font-semibold text-brand-700">Rent Approval</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-heading-lg font-bold text-neutral-900 md:text-heading-xl">
            Rent Change Approval Request
          </h1>
          <p className="mt-1 text-body-sm text-neutral-700">
            Pending Landlord Decision · Submitted Oct 12, 2026, 14:32
          </p>
        </div>
        <span className="rounded-full bg-warning-50 px-3 py-1 text-label-sm font-semibold text-warning-600">
          Pending Approval
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_270px]">
        <section className="flex flex-col gap-5 rounded-lg border border-neutral-200 bg-white p-4 md:p-6">
          <h2 className="text-body-lg font-semibold text-neutral-900">
            Proposed Lease Adjustment
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-label-sm text-neutral-700">Current Annual Rent</p>
              <p className="mt-1 text-heading-md font-bold text-neutral-900">
                ₦17,400
              </p>
              <p className="text-label-sm text-neutral-700">₦1,450 / year</p>
            </div>
            <div className="rounded-md border border-brand-700 bg-brand-50 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-label-sm text-neutral-700">Proposed Annual Rent</p>
                <span className="rounded-sm bg-success-500 px-1.5 text-caption font-semibold text-neutral-900">
                  +10.3%
                </span>
              </div>
              <p className="mt-1 text-heading-md font-bold text-brand-700">
                ₦19,200
              </p>
              <p className="text-label-sm text-neutral-700">
                ₦1,600 / year · Proposed by Priya
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Info label="Effective Date" value="November 1, 2026" />
            <Info
              label="Proposed Change Reason"
              value="Market Rate Adjustment & Renovations"
            />
          </div>
          <Info
            label="Property Admin's Supporting Note"
            value={'"Unit 4B has been upgraded with smart appliances and new flooring. Comparable 2-bedroom units in the Maple & 9th area are currently leasing for ₦1,650/yr. Tenants have been notified of the proposed adjustment."'}
          />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="destructive" size="sm">
              Reject Proposal
            </Button>
            <Button
              size="sm"
              isLoading={isApplying}
              onClick={async () => {
                setIsApplying(true);
                await Promise.resolve();
                router.push(LANDLORD_ROUTES.properties);
              }}
            >
              Approve &amp; Apply
            </Button>
          </div>
        </section>

        <aside className="flex flex-col gap-5">
          <section className="rounded-lg border border-neutral-200 bg-white p-4">
            <h2 className="text-body-md font-semibold text-neutral-900">
              Assigned Property Admin
            </h2>
            <div className="mt-4 rounded-md border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-body-sm font-semibold text-neutral-900">
                Priya Nandan
              </p>
              <p className="text-label-sm text-neutral-700">
                Vemra Certified Property Admin
              </p>
              <p className="mt-3 border-t border-neutral-200 pt-3 text-label-sm text-neutral-700">
                Assignment Context: <strong>Active manager since Jan 2024</strong>
              </p>
              <p className="text-label-sm text-neutral-700">
                Total Units Managed: <strong>3 Units (Maple &amp; 9th)</strong>
              </p>
            </div>
          </section>
          <section className="rounded-lg border border-neutral-200 bg-white p-4">
            <h2 className="text-body-md font-semibold text-neutral-900">
              Approval History &amp; Audit Trail
            </h2>
            <ol className="mt-4 flex flex-col gap-4 border-l border-neutral-200 pl-4 text-label-sm">
              <li>
                <strong>Proposed Rent Change Submitted</strong>
                <span className="block text-neutral-700">
                  Priya Nandan requested increase to ₦19,200/yr
                </span>
              </li>
              <li>
                <strong>Property Managed Assigned</strong>
                <span className="block text-neutral-700">
                  Vemra assigned Priya Nandan to Unit 4B
                </span>
              </li>
              <li>
                <strong>Property Added</strong>
                <span className="block text-neutral-700">
                  Maple &amp; 9th, Unit 4B listed under Daniel Osei
                </span>
              </li>
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-label-sm font-semibold text-neutral-700">{label}</p>
      <p className="mt-1 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-body-sm text-neutral-900">
        {value}
      </p>
    </div>
  );
}
