/**
 * Document kinds the backend recognises for a rental application. It takes
 * `documentType` as a free string, so this list drives the picker rather than
 * validating an enum.
 *
 * Kept out of `lib/api/actions/applications.ts` on purpose: that module is
 * `"use server"`, so only async server actions survive to the client bundle.
 * A plain constant exported from it arrives as `undefined` and crashes the
 * client component that reads it.
 */
export const APPLICATION_DOCUMENT_TYPES = [
  { value: "PAYSLIP", label: "Payslip" },
  { value: "EMPLOYMENT_LETTER", label: "Employment letter" },
  { value: "BANK_STATEMENT", label: "Bank statement" },
  { value: "TAX_RETURN", label: "Tax return" },
  { value: "OTHER", label: "Other supporting document" },
] as const;

export type ApplicationDocumentType =
  (typeof APPLICATION_DOCUMENT_TYPES)[number]["value"];
