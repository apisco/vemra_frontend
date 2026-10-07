export const ENDPOINTS = {
  
  identity: {
    me: "/me",
    updateProfile: "/me/profile",
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
    platformStats: "/platform/stats",
    dashboardPreview: "/platform/dashboard-preview",
  },

  tenant: {
    dashboard: "/tenant/dashboard",
    paymentPlan: "/tenant/payment-plan",
    payments: "/payments",
    checkout: "/tenant/payments/checkout",
    rentals: "/tenant/rentals",
    savedProperties: "/properties/saved",
    savedProperty: (propertyId: string) =>
      `/properties/saved/${propertyId}`,
    cautionDeposit: "/tenant/caution-deposit",
    depositDecision: "/tenant/caution-deposit/decision",
    acceptDepositDecision: "/tenant/caution-deposit/decision/accept",
    disputeDepositDecision: "/tenant/caution-deposit/decision/dispute",
    rentChange: "/tenant/rent-change",
    
    maintenance: "/maintenance",
    conversations: "/messaging",
    conversation: (conversationId: string) =>
      `/messaging/${conversationId}`,
    conversationMessages: (conversationId: string) =>
      `/messaging/${conversationId}/messages`,
    notifications: "/notifications",
    readNotifications: (notificationId: string) =>
      `/notifications/${notificationId}/read`,
    referrals: "/referrals",
    leases: "/leases",
    
    applications: "/applications",
    lease: "/tenant/lease",
    signLease: "/tenant/lease/sign",
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
    rentApproval: (propertyId: string) =>
      `/landlord/properties/${propertyId}/rent-approval`,
    decideRentApproval: (propertyId: string) =>
      `/landlord/properties/${propertyId}/rent-approval/decision`,
    applications: "/applications",
    application: (applicationId: string) =>
      `/landlord/applications/${applicationId}`,
    decideApplication: (applicationId: string) =>
      `/landlord/applications/${applicationId}/decision`,
    maintenance: "/maintenance",
    cautionDeposits: "/landlord/caution-deposits",
    decideDeduction: (depositId: string) =>
      `/landlord/caution-deposits/${depositId}/deduction/decision`,
    refundDeposit: (depositId: string) =>
      `/landlord/caution-deposits/${depositId}/refund`,
    payoutAccount: "/wallet/payout-accounts",
    ledgerAccounts: "/ledger/accounts",
    statement: "/ledger/accounts",
    statementExport: (accountId: string) =>
      `/ledger/accounts/${accountId}/statement-export`,
    paymentBreakdown: (accountId: string) =>
      `/ledger/accounts/${accountId}/breakdown`,
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
