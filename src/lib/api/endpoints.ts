export const ENDPOINTS = {
  identity: {
    me: "/me",
    updateProfile: "/me/profile",
    settings: "/me/settings",
    tenantDashboard: "/me/tenant-dashboard",
    landlordDashboard: "/me/landlord-dashboard",
  },

  kyc: {
    documentGrants: "/kyc/documents/grants",
    submissions: "/kyc/submissions",
  },

  public: {
    listings: "/properties",
    listing: (propertyId: string) => `/properties/${propertyId}`,
    featuredListing: "/properties",
    profile: (propertyAdminId: string) =>
      `/admin/properties/${propertyAdminId}/public`,
    platformStats: "/public/stats",
    dashboardPreview: "/public/dashboard-preview",
  },

  tenant: {
    payments: "/payments",
    leases: "/leases",
    lease: (leaseId: string) => `/leases/${leaseId}`,
    paymentPlan: (leaseId: string) => `/leases/${leaseId}/payment-plan`,
    checkout: (leaseId: string) => `/leases/${leaseId}/pay`,
    cautionDeposit: (leaseId: string) => `/leases/${leaseId}/deposit`,
    depositDecision: (leaseId: string) => `/leases/${leaseId}/deposit`,
    acceptDepositDecision: (leaseId: string) =>
      `/leases/${leaseId}/deposit/accept`,
    disputeDepositDecision: (leaseId: string) =>
      `/leases/${leaseId}/deposit/dispute`,
    rentChange: (leaseId: string) => `/leases/${leaseId}/rent-changes`,
    savedProperties: "/properties/saved",
    savedProperty: (propertyId: string) =>
      `/properties/saved/${propertyId}`,
    maintenance: "/maintenance",
    conversations: "/messaging",
    conversation: (conversationId: string) =>
      `/messaging/${conversationId}/messages`,
    conversationMessages: (conversationId: string) =>
      `/messaging/${conversationId}/messages`,
    notifications: "/notifications",
    readNotifications: (notificationId: string) =>
      `/notifications/${notificationId}/read`,
    referrals: "/referrals",
    applications: "/applications",
    profile: "/me",
    settings: "/me/settings",
  },

  landlord: {
    dashboard: "/me/landlord-dashboard",
    properties: "/properties/me/listings",
    property: (propertyId: string) =>
      `/properties/me/listings/${propertyId}`,
    unlistProperty: (propertyId: string) =>
      `/properties/${propertyId}/unlist`,
    rentApproval: (leaseId: string) => `/leases/${leaseId}/rent-changes`,
    applications: "/applications",
    approveApplication: (applicationId: string) =>
      `/applications/${applicationId}/approve`,
    rejectApplication: (applicationId: string) =>
      `/applications/${applicationId}/reject`,
    maintenance: "/maintenance",
    cautionDeposits: (leaseId: string) => `/leases/${leaseId}/resolve-caution`,
    ledgerAccounts: "/ledger/accounts",
    statement: (accountId: string) =>
      `/ledger/accounts/${accountId}/breakdown`,
    statementExport: (accountId: string) =>
      `/ledger/accounts/${accountId}/statement-export`,
    paymentBreakdown: (accountId: string) =>
      `/ledger/accounts/${accountId}/breakdown`,
    payoutAccount: "/wallet/payout-accounts",
    withdrawals: "/withdrawals",
    settings: "/me/settings",
    notificationPreferences: "/notifications/preferences",
    profile: "/me",
  },
} as const;

export const CACHE_TAGS = {
  listings: "listings",
  listing: (listingId: string) => `listing:${listingId}`,
  profile: (profileId: string) => `profile:${profileId}`,
  platformStats: "platform-stats",
} as const;

export const REVALIDATE = {
  listings: 60,
  listing: 300,
  profile: 300,
  platformStats: 3600,
} as const;
