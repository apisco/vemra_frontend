"use client";

import { useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { TableActionsMenu } from "@/components/ui/table-actions-menu";
import type { BadgeVariant } from "@/components/ui/badge";

const ROWS: {
  id: string;
  tenant: string;
  property: string;
  rent: string;
  status: { label: string; variant: BadgeVariant };
}[] = [
  {
    id: "1",
    tenant: "Ada Lovelace",
    property: "12 Bode Thomas, Surulere",
    rent: "₦1,200,000",
    status: { label: "Active", variant: "success" },
  },
  {
    id: "2",
    tenant: "Chinua Achebe",
    property: "4b Admiralty Way, Lekki",
    rent: "₦2,400,000",
    status: { label: "Due soon", variant: "warning" },
  },
  {
    id: "3",
    tenant: "Grace Hopper",
    property: "9 Awolowo Road, Ikoyi",
    rent: "₦3,750,000",
    status: { label: "Overdue", variant: "danger" },
  },
  {
    id: "4",
    tenant: "Wole Soyinka",
    property: "31 Isaac John, Ikeja GRA",
    rent: "₦1,850,000",
    status: { label: "Pending", variant: "info" },
  },
];

export function TableShowcase() {
  const [selected, setSelected] = useState<string[]>(["2"]);

  const allSelected = selected.length === ROWS.length;
  const someSelected = selected.length > 0 && !allSelected;

  function toggleRow(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((rowId) => rowId !== id)
        : [...current, id],
    );
  }

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4">
      <p className="text-label-sm font-semibold text-neutral-700">
        Header, rows, cells, selection, actions menu, hover — resize below 768px
        to see each row collapse into a labelled card
      </p>

      <Table caption="Tenants, their property, rent and lease status">
        <TableHead>
          <TableHeaderCell className="w-10">
            <Checkbox
              label="Select all rows"
              hideLabel
              checked={allSelected}
              indeterminate={someSelected}
              onChange={() =>
                setSelected(allSelected ? [] : ROWS.map((row) => row.id))
              }
            />
          </TableHeaderCell>
          <TableHeaderCell>Tenant</TableHeaderCell>
          <TableHeaderCell>Property</TableHeaderCell>
          <TableHeaderCell align="right">Annual rent</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell align="right" className="w-16">
            <span className="sr-only">Actions</span>
          </TableHeaderCell>
        </TableHead>

        <TableBody>
          {ROWS.map((row, index) => (
            <TableRow
              key={row.id}
              isSelected={selected.includes(row.id)}
              isStriped={index % 2 === 1}
            >
              <TableCell>
                <Checkbox
                  label={`Select ${row.tenant}`}
                  hideLabel
                  checked={selected.includes(row.id)}
                  onChange={() => toggleRow(row.id)}
                />
              </TableCell>
              <TableCell header="Tenant" isPrimary>
                <span className="flex items-center gap-2">
                  <Avatar name={row.tenant} size="xs" />
                  {row.tenant}
                </span>
              </TableCell>
              <TableCell header="Property">{row.property}</TableCell>
              <TableCell header="Annual rent" align="right">
                {row.rent}
              </TableCell>
              <TableCell header="Status">
                <Badge variant={row.status.variant}>{row.status.label}</Badge>
              </TableCell>
              <TableCell align="right">
                <TableActionsMenu
                  label={`Actions for ${row.tenant}`}
                  actions={[
                    { id: "view", label: "View lease", onSelect: () => undefined },
                    { id: "remind", label: "Send reminder", onSelect: () => undefined },
                    {
                      id: "export",
                      label: "Export statement",
                      onSelect: () => undefined,
                      disabled: true,
                    },
                    {
                      id: "end",
                      label: "End tenancy",
                      onSelect: () => undefined,
                      isDestructive: true,
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
