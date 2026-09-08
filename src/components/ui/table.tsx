import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface TableProps {
  children: ReactNode;
  caption: string;
  className?: string;
}

export function Table({ children, caption, className }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn(
          "w-full border-collapse text-left max-md:block",
          className,
        )}
      >
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export interface TableHeadProps {
  children: ReactNode;
}

export function TableHead({ children }: TableHeadProps) {
  return (
    <thead className="max-md:hidden">
      <tr className="border-b border-neutral-100">{children}</tr>
    </thead>
  );
}

export interface TableHeaderCellProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "right";
}

export function TableHeaderCell({
  align = "left",
  className,
  children,
  ...props
}: TableHeaderCellProps) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-label-sm font-semibold text-neutral-700 whitespace-nowrap",
        align === "right" && "text-right",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export interface TableBodyProps {
  children: ReactNode;
}

export function TableBody({ children }: TableBodyProps) {
  return (
    <tbody className="max-md:flex max-md:flex-col max-md:gap-3">
      {children}
    </tbody>
  );
}

export interface TableRowProps {
  children: ReactNode;
  isSelected?: boolean;
  isStriped?: boolean;
  className?: string;
}

export function TableRow({
  children,
  isSelected = false,
  isStriped = false,
  className,
}: TableRowProps) {
  return (
    <tr
      aria-selected={isSelected || undefined}
      className={cn(
        "border-b border-neutral-100 transition-colors",
        "max-md:block max-md:rounded-lg max-md:border max-md:border-neutral-200 max-md:bg-white max-md:p-2",
        isSelected
          ? "bg-brand-50"
          : cn(isStriped ? "bg-neutral-50" : "bg-white", "hover:bg-neutral-50"),
        className,
      )}
    >
      {children}
    </tr>
  );
}

export interface TableCellProps
  extends TdHTMLAttributes<HTMLTableCellElement> {
  header?: string;
  isPrimary?: boolean;
  align?: "left" | "right";
}

export function TableCell({
  header,
  isPrimary = false,
  align = "left",
  className,
  children,
  ...props
}: TableCellProps) {
  return (
    <td
      className={cn(
        "px-4 py-3 text-body-sm align-middle",
        "max-md:flex max-md:items-center max-md:justify-between max-md:gap-4 max-md:px-2 max-md:py-1.5",
        isPrimary ? "font-semibold text-neutral-900" : "text-neutral-800",
        align === "right" && "text-right",
        className,
      )}
      {...props}
    >
      {header && (
        <span className="hidden text-label-sm font-semibold text-neutral-700 max-md:block">
          {header}
        </span>
      )}
      <span className="max-md:min-w-0 max-md:text-right">{children}</span>
    </td>
  );
}
