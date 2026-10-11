import { z } from "zod";

const MAX_SAFE_MINOR = Number.MAX_SAFE_INTEGER;

export const minorUnitsSchema = z
  .union([z.string(), z.number()])
  .transform((value, ctx) => {
    const text = typeof value === "number" ? String(value) : value.trim();
    if (!/^-?\d+$/.test(text)) {
      ctx.addIssue({
        code: "custom",
        message: `Expected integer minor units, received "${text}".`,
      });
      return z.NEVER;
    }
    const parsed = Number(text);
    if (!Number.isSafeInteger(parsed) || Math.abs(parsed) > MAX_SAFE_MINOR) {
      ctx.addIssue({
        code: "custom",
        message: `Minor units "${text}" exceed the safe integer range.`,
      });
      return z.NEVER;
    }
    return parsed;
  });

export const moneySchema = z
  .object({
    amountMinor: minorUnitsSchema,
    currency: z.string().min(1).optional(),
  })
  .transform((value) => ({
    minor: value.amountMinor,
    currency: value.currency ?? "NGN",
  }));

export type ParsedMoney = z.infer<typeof moneySchema>;

export const envelopeDataSchema = <T extends z.ZodType>(inner: T) =>
  z.union([
    z.object({ data: inner, requestId: z.string().optional() }),
    z.object({ status: z.literal("success"), data: inner }),
  ]);

export const paginationSchema = z.object({
  limit: z.number().int().nonnegative(),
  offset: z.number().int().nonnegative(),
  count: z.number().int().nonnegative(),
});

export const payInitiationSchema = z.object({
  checkoutUrl: z.string().url(),
  breakdown: z.object({
    rentMinor: minorUnitsSchema,
    cautionDepositMinor: minorUnitsSchema,
    tenantPlatformFeeMinor: minorUnitsSchema,
    paystackFeeMinor: minorUnitsSchema,
    totalAmountMinor: minorUnitsSchema,
    currency: z.string().min(1),
  }),
});

export type PayInitiation = z.infer<typeof payInitiationSchema>;

export const paymentStatusSchema = z.enum(["INITIALIZED", "SUCCESS", "FAILED"]);

export const paymentRecordSchema = z.object({
  id: z.string(),
  reference: z.string(),
  amountMinor: minorUnitsSchema,
  currency: z.string(),
  status: z.string(),
  leaseId: z.string(),
  tenantId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paymentListSchema = z.object({
  payments: z.array(paymentRecordSchema),
});

export type PaymentRecord = z.infer<typeof paymentRecordSchema>;

export const walletTransactionSchema = z.object({
  id: z.string(),
  amountMinor: minorUnitsSchema,
  currency: z.string(),
  direction: z.enum(["CREDIT", "DEBIT"]),
  createdAt: z.string(),
  transaction: z
    .object({
      id: z.string(),
      reference: z.string(),
      description: z.string(),
    })
    .nullable(),
});

export const walletSchema = z.object({
  totalBalance: moneySchema,
  wallets: z.array(
    z.object({
      name: z.enum(["referral", "caution", "payout"]),
      balance: moneySchema,
      transactions: z.array(walletTransactionSchema),
    }),
  ),
});

export type Wallet = z.infer<typeof walletSchema>;
export type WalletTransaction = z.infer<typeof walletTransactionSchema>;

export const withdrawalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amountMinor: minorUnitsSchema,
  currency: z.string(),
  status: z.string(),
  bankCode: z.string(),
  accountNumber: z.string(),
  accountName: z.string(),
  recommendedBy: z.string().nullable(),
  approvedBy: z.string().nullable(),
  rejectionReason: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const withdrawalListSchema = z.object({
  withdrawals: z.array(withdrawalSchema),
});

export type Withdrawal = z.infer<typeof withdrawalSchema>;

export const billingScheduleSchema = z.object({
  id: z.string(),
  amount: moneySchema,
  dueDate: z.string(),
  status: z.enum(["PENDING", "PAID", "OVERDUE"]),
});

export const leaseSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  propertyId: z.string(),
  tenantId: z.string(),
  status: z.enum(["DRAFT", "SIGNED", "ACTIVE", "TERMINATED"]),
  annualRent: moneySchema,
  termYears: z.number(),
  cautionDeposit: moneySchema,
  startDate: z.string(),
  endDate: z.string(),
  billingSchedules: z.array(billingScheduleSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ParsedLease = z.infer<typeof leaseSchema>;
export type ParsedBillingSchedule = z.infer<typeof billingScheduleSchema>;

export const leaseSummarySchema = z.object({
  id: z.string(),
  propertyId: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  annualRent: moneySchema.optional(),
});

export const leaseListSchema = z.array(leaseSummarySchema);

export type LeaseSummary = z.infer<typeof leaseSummarySchema>;

export const notificationPreferencesSchema = z.object({
  userId: z.string().optional(),
  emailEnabled: z.boolean(),
  inAppEnabled: z.boolean(),
});

export type NotificationPreferences = z.infer<
  typeof notificationPreferencesSchema
>;

export const payoutAccountSchema = z.object({
  id: z.string(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  bankCode: z.string().optional(),
  isPrimary: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  createdAt: z.string().optional(),
});

export const payoutAccountListSchema = z.union([
  z.array(payoutAccountSchema),
  z.object({ payoutAccounts: z.array(payoutAccountSchema) }),
  z.object({ accounts: z.array(payoutAccountSchema) }),
]);

export type ParsedPayoutAccount = z.infer<typeof payoutAccountSchema>;

export function readPayoutAccounts(
  value: unknown,
): readonly ParsedPayoutAccount[] {
  const parsed = payoutAccountListSchema.safeParse(value);
  if (!parsed.success) {
    return [];
  }
  if (Array.isArray(parsed.data)) {
    return parsed.data;
  }
  if ("payoutAccounts" in parsed.data) {
    return parsed.data.payoutAccounts;
  }
  return parsed.data.accounts;
}

const moneyLikeSchema = z.union([moneySchema, minorUnitsSchema]).transform(
  (value): ParsedMoney =>
    typeof value === "number" ? { minor: value, currency: "NGN" } : value,
);

export const tenantDashboardSchema = z.object({
  tenantName: z.string().nullish(),
  unit: z
    .object({
      id: z.string(),
      name: z.string().nullish(),
      propertyId: z.string().nullish(),
    })
    .nullish(),
  rentDue: z
    .object({
      dueDate: z.string().nullish(),
      amount: moneyLikeSchema,
    })
    .nullish(),
  nextPayment: z
    .object({
      amount: moneyLikeSchema,
      allowsInstallments: z.boolean().nullish(),
    })
    .nullish(),
  planProgress: z
    .object({
      paidAmount: moneyLikeSchema,
      totalAmount: moneyLikeSchema,
      paidInstallments: z.number().nullish(),
      totalInstallments: z.number().nullish(),
    })
    .nullish(),
});

export type ParsedTenantDashboard = z.infer<typeof tenantDashboardSchema>;

export const landlordDashboardSchema = z.object({
  landlordName: z.string().nullish(),
  propertyCount: z.number().nullish(),
  occupiedCount: z.number().nullish(),
  vacantCount: z.number().nullish(),
  vacantSince: z.string().nullish(),
  vacantUnitName: z.string().nullish(),
  readyToWithdraw: moneyLikeSchema.nullish(),
  clearedPaymentCount: z.number().nullish(),
  monthlyRentRoll: moneyLikeSchema.nullish(),
  nextRentDue: z
    .object({
      dueDate: z.string().nullish(),
      unitName: z.string().nullish(),
      amount: moneyLikeSchema,
    })
    .nullish(),
  revenueSeries: z
    .array(
      z.object({
        periodStart: z.string().nullish(),
        amount: moneyLikeSchema,
      }),
    )
    .nullish(),
});

export type ParsedLandlordDashboard = z.infer<typeof landlordDashboardSchema>;

export const settingsSchema = z.object({
  settings: z.record(z.string(), z.unknown()),
});

export class SchemaError extends Error {
  readonly issues: readonly string[];

  constructor(label: string, issues: readonly string[]) {
    super(
      `Vemra sent an unexpected shape for ${label}: ${issues.join("; ")}`,
    );
    this.name = "SchemaError";
    this.issues = issues;
  }
}

export function parseOrThrow<T extends z.ZodType>(
  label: string,
  schema: T,
  value: unknown,
): z.infer<T> {
  const result = schema.safeParse(value);
  if (result.success) {
    return result.data;
  }
  const issues = result.error.issues.map(
    (issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`,
  );
  throw new SchemaError(label, issues);
}

export function parseOrNull<T extends z.ZodType>(
  schema: T,
  value: unknown,
): z.infer<T> | null {
  const result = schema.safeParse(value);
  return result.success ? result.data : null;
}
