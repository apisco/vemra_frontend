import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import {
  LANDLORD_PROPERTIES_TABLE,
  type PropertyStatus,
} from "@/constants/landlord";
import { cn } from "@/lib/cn";

const { title, caption, headers, rows } = LANDLORD_PROPERTIES_TABLE;

const STATUS_VARIANTS: Record<PropertyStatus, "success" | "danger"> = {
  occupied: "success",
  vacant: "danger",
};

const HEADER_LABEL_CLASSES = "text-caption uppercase";

export function PropertiesOverviewTable() {
  return (
    <section
      aria-labelledby="properties-overview-title"
      className="hidden min-w-0 flex-col gap-4 rounded-lg border border-neutral-200 bg-white py-5 md:flex lg:px-2 lg:py-6"
    >
      <h2
        id="properties-overview-title"
        className="px-4 font-display text-heading-sm font-semibold text-neutral-900"
      >
        {title}
      </h2>

      <Table caption={caption}>
        <TableHead>
          <TableHeaderCell>
            <span className={HEADER_LABEL_CLASSES}>{headers.property}</span>
          </TableHeaderCell>
          <TableHeaderCell>
            <span className={HEADER_LABEL_CLASSES}>{headers.admin}</span>
          </TableHeaderCell>
          <TableHeaderCell>
            <span className={HEADER_LABEL_CLASSES}>{headers.status}</span>
          </TableHeaderCell>
          <TableHeaderCell className="max-lg:hidden">
            <span className={HEADER_LABEL_CLASSES}>{headers.rentDue}</span>
          </TableHeaderCell>
          <TableHeaderCell align="right">
            <span className={HEADER_LABEL_CLASSES}>{headers.rent}</span>
          </TableHeaderCell>
        </TableHead>

        <TableBody>
          {rows.map(
            ({
              property,
              admin,
              status,
              statusTone,
              rentDue,
              rent,
              isCompactHidden,
            }) => (
              <TableRow
                key={property}
                className={cn(isCompactHidden && "max-lg:hidden")}
              >
                <TableCell isPrimary>{property}</TableCell>
                <TableCell>{admin}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[statusTone]} size="sm">
                    {status}
                  </Badge>
                </TableCell>
                <TableCell className="max-lg:hidden">{rentDue}</TableCell>
                <TableCell align="right" isPrimary>
                  {rent}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </section>
  );
}
