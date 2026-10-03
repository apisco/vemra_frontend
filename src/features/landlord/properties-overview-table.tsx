import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatRent } from "@/lib/format";
import type {
  LandlordPropertySummary,
  PropertyStatus,
} from "@/types/api/landlord";

const TITLE = "Properties overview";
const CAPTION = "Properties you own, their assigned Property Admin and rent status";
const HEADERS = {
  property: "Property",
  admin: "Property admin",
  status: "Status",
  rentDue: "Rent due",
  rent: "Rent",
} as const;

const STATUS_VARIANTS: Record<PropertyStatus, "success" | "danger"> = {
  occupied: "success",
  vacant: "danger",
};

const HEADER_LABEL_CLASSES = "text-caption uppercase";

export function PropertiesOverviewTable({
  properties,
}: {
  properties: readonly LandlordPropertySummary[];
}) {
  return (
    <section
      aria-labelledby="properties-overview-title"
      className="hidden min-w-0 flex-col gap-4 rounded-lg border border-neutral-200 bg-white py-5 md:flex lg:px-2 lg:py-6"
    >
      <h2
        id="properties-overview-title"
        className="px-4 font-display text-heading-sm font-semibold text-neutral-900"
      >
        {TITLE}
      </h2>

      <Table caption={CAPTION}>
        <TableHead>
          <TableHeaderCell>
            <span className={HEADER_LABEL_CLASSES}>{HEADERS.property}</span>
          </TableHeaderCell>
          <TableHeaderCell>
            <span className={HEADER_LABEL_CLASSES}>{HEADERS.admin}</span>
          </TableHeaderCell>
          <TableHeaderCell>
            <span className={HEADER_LABEL_CLASSES}>{HEADERS.status}</span>
          </TableHeaderCell>
          <TableHeaderCell className="max-lg:hidden">
            <span className={HEADER_LABEL_CLASSES}>{HEADERS.rentDue}</span>
          </TableHeaderCell>
          <TableHeaderCell align="right">
            <span className={HEADER_LABEL_CLASSES}>{HEADERS.rent}</span>
          </TableHeaderCell>
        </TableHead>

        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell isPrimary>{property.name}</TableCell>
              <TableCell>{property.admin?.name ?? "Not assigned"}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANTS[property.status]} size="sm">
                  {property.status}
                </Badge>
              </TableCell>
              <TableCell className="max-lg:hidden">
                {property.nextRentDueDate
                  ? formatDate(property.nextRentDueDate, "short")
                  : "—"}
              </TableCell>
              <TableCell align="right" isPrimary>
                {formatRent(property.rent, property.rentPeriod)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
