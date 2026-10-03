import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ResponsiveText } from "@/components/ui/responsive-text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import type { LandlordPropertySummary, PropertyStatus } from "@/types/api/landlord";
import {
  LANDLORD_PROPERTIES_SCREEN,
  LANDLORD_ROUTES,
} from "@/constants/landlord";
import { cn } from "@/lib/cn";
import { formatDate, formatRent } from "@/lib/format";

const { caption, headers, tenantLabel, vacantTenantPlaceholder } =
  LANDLORD_PROPERTIES_SCREEN;

const STATUS_VARIANTS: Record<PropertyStatus, "success" | "warning"> = {
  occupied: "success",
  vacant: "warning",
};

const HEADER_CELL_CLASSES = "lg:px-6 lg:py-4";
const CELL_CLASSES = "lg:px-6 lg:py-5";
const LINK_CLASSES =
  "rounded-sm text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700";

function detailHref(id: string): string {
  return `${LANDLORD_ROUTES.properties}/${id}`;
}

export interface PropertiesPanelProps {
  properties: readonly LandlordPropertySummary[];
}

export function PropertiesPanel({ properties }: PropertiesPanelProps) {
  return (
    <>
      <div className="overflow-clip rounded-lg border border-neutral-200 bg-white max-md:hidden">
        <Table caption={caption}>
          <TableHead>
            <TableHeaderCell className={HEADER_CELL_CLASSES}>
              <span className="whitespace-normal">{headers.property}</span>
            </TableHeaderCell>
            <TableHeaderCell className={cn(HEADER_CELL_CLASSES, "lg:w-45")}>
              <span className="whitespace-normal">{headers.tenant}</span>
            </TableHeaderCell>
            <TableHeaderCell className={cn(HEADER_CELL_CLASSES, "lg:w-45")}>
              <span className="whitespace-normal">
                <ResponsiveText copy={headers.admin} />
              </span>
            </TableHeaderCell>
            <TableHeaderCell className={cn(HEADER_CELL_CLASSES, "lg:w-25")}>
              <span className="whitespace-normal">{headers.rent}</span>
            </TableHeaderCell>
            <TableHeaderCell className={cn(HEADER_CELL_CLASSES, "lg:w-30")}>
              <span className="whitespace-normal">{headers.status}</span>
            </TableHeaderCell>
            <TableHeaderCell
              align="right"
              className={cn(HEADER_CELL_CLASSES, "lg:w-25")}
            >
              <span className="whitespace-normal">{headers.action}</span>
            </TableHeaderCell>
          </TableHead>

          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id} className="last:border-b-0">
                <TableCell isPrimary className={CELL_CLASSES}>
                  <span className="block">{property.name}</span>
                  {property.vacantSince ? (
                    <span className="mt-1 block text-label-sm font-normal text-error-600">
                      Vacant since {formatDate(property.vacantSince, "short")}
                    </span>
                  ) : null}
                </TableCell>

                <TableCell className={CELL_CLASSES}>
                  {property.tenant?.name ?? vacantTenantPlaceholder}
                </TableCell>

                <TableCell className={CELL_CLASSES}>
                  <span className="block">{property.admin?.name ?? "Not assigned"}</span>
                  <span
                    className={cn(
                      "mt-1 block text-label-sm",
                      property.admin !== null
                        ? "text-brand-700 max-lg:hidden"
                        : "text-neutral-700",
                    )}
                  >
                    {property.admin?.note}
                  </span>
                </TableCell>

                <TableCell isPrimary className={CELL_CLASSES}>
                  {formatRent(property.rent, property.rentPeriod)}
                </TableCell>

                <TableCell className={CELL_CLASSES}>
                  <Badge variant={STATUS_VARIANTS[property.status]}>
                    {property.status}
                  </Badge>
                </TableCell>

                <TableCell align="right" className={CELL_CLASSES}>
                  <Link href={detailHref(property.id)} className={LINK_CLASSES}>
                    <ResponsiveText
                      copy={{ base: "Manage listing", md: "Manage listing" }}
                    />
                    <span className="sr-only"> {property.name}</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {properties.map((property) => (
          <li key={property.id}>
            <Link
              href={detailHref(property.id)}
              className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              <Image
                src={property.coverImage?.url ?? "/marketing/listing-maple-9th.png"}
                alt=""
                width={64}
                height={64}
                sizes="64px"
                className="size-16 shrink-0 rounded-md object-cover"
              />

              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-body-sm font-semibold text-neutral-900">
                  {property.name}
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-body-sm font-bold text-brand-700">
                    {formatRent(property.rent, property.rentPeriod)}
                  </span>
                  <Badge
                    variant={STATUS_VARIANTS[property.status]}
                    size="sm"
                  >
                    {property.status}
                  </Badge>
                </span>

                <span className="truncate text-caption text-neutral-700">
                  {property.tenant
                    ? `${tenantLabel}: ${property.tenant.name}`
                    : property.vacantSince
                      ? `Vacant since ${formatDate(property.vacantSince, "short")}`
                      : vacantTenantPlaceholder}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
