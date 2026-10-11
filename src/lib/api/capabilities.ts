export interface UnsupportedCapability {
  title: string;
  description: string;
}

export const UNSUPPORTED: Record<string, UnsupportedCapability> = {
  landlordApplicationDecision: {
    title: "Reviewed by Vemra",
    description:
      "Vemra reviews and decides every application. Landlords see the outcome here but do not approve or decline directly.",
  },
  landlordRentApproval: {
    title: "Reviewed by Vemra",
    description:
      "Rent changes are proposed and approved inside Vemra. You will be notified when a decision is recorded.",
  },
  tenantRentChange: {
    title: "Coming soon",
    description:
      "Rent change history is not available yet. Vemra will notify you when a change is scheduled for your lease.",
  },
  landlordStatementExport: {
    title: "Coming soon",
    description:
      "Statement downloads are not available yet. Your transaction history is listed below.",
  },
  landlordCautionDeposits: {
    title: "Reviewed by Vemra",
    description:
      "Caution deposit claims are resolved by Vemra. Balances are shown in your wallet.",
  },
  landlordPaymentBreakdown: {
    title: "Coming soon",
    description:
      "A per-property payment breakdown is not available yet. Wallet transactions are listed below.",
  },
} as const;
