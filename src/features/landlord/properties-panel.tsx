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
import type { PropertyListing, PropertyStatus } from "@/constants/landlord";
import {
  LANDLORD_PROPERTIES_SCREEN,
  LANDLORD_ROUTES,
} from "@/constants/landlord";
import { cn } from "@/lib/cn";

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
  properties: readonly PropertyListing[];
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
                  {property.vacancyNote ? (
                    <span className="mt-1 block text-label-sm font-normal text-error-600">
                      {property.vacancyNote}
                    </span>
                  ) : null}
                </TableCell>

                <TableCell className={CELL_CLASSES}>
                  {property.tenant ?? vacantTenantPlaceholder}
                </TableCell>

                <TableCell className={CELL_CLASSES}>
                  <span className="block">{property.admin.name}</span>
                  <span
                    className={cn(
                      "mt-1 block text-label-sm",
                      property.admin.isAssigned
                        ? "text-brand-700 max-lg:hidden"
                        : "text-neutral-700",
                    )}
                  >
                    {property.admin.note}
                  </span>
                </TableCell>

                <TableCell isPrimary className={CELL_CLASSES}>
                  {property.rent}
                </TableCell>

                <TableCell className={CELL_CLASSES}>
                  <Badge variant={STATUS_VARIANTS[property.statusTone]}>
                    {property.status}
                  </Badge>
                </TableCell>

                <TableCell align="right" className={CELL_CLASSES}>
                  <Link href={property.action.href} className={LINK_CLASSES}>
                    <ResponsiveText copy={property.action.label} />
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
                src={property.photos[0]}
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
                    {property.rent}
                  </span>
                  <Badge
                    variant={STATUS_VARIANTS[property.statusTone]}
                    size="sm"
                  >
                    {property.status}
                  </Badge>
                </span>

                <span className="truncate text-caption text-neutral-700">
                  {property.tenant
                    ? `${tenantLabel}: ${property.tenant}`
                    : property.vacancyNote}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
