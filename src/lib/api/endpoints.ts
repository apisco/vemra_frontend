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
    profile: (profileId: string) => `/profiles/${profileId}`,
    platformStats: "/platform/stats",
    dashboardPreview: "/platform/dashboard-preview",
  },

  tenant: {
    dashboard: "/tenant/dashboard",
    paymentPlan: "/tenant/payment-plan",
    payments: "/payments",
    checkout: "/tenant/payments/checkout",
    rentals: "/tenant/rentals",
    savedProperties: "/tenant/saved-properties",
    savedProperty: (listingId: string) =>
      `/tenant/saved-properties/${listingId}`,
    cautionDeposit: "/tenant/caution-deposit",
    depositDecision: "/tenant/caution-deposit/decision",
    acceptDepositDecision: "/tenant/caution-deposit/decision/accept",
    disputeDepositDecision: "/tenant/caution-deposit/decision/dispute",
    rentChange: "/tenant/rent-change",
    
    maintenance: "/maintenance",
    conversations: "/tenant/conversations",
    conversation: (conversationId: string) =>
      `/tenant/conversations/${conversationId}`,
    conversationMessages: (conversationId: string) =>
      `/tenant/conversations/${conversationId}/messages`,
    notifications: "/tenant/notifications",
    readNotifications: "/tenant/notifications/read",
    referrals: "/tenant/referrals",
    
    applications: "/applications",
    lease: "/tenant/lease",
    signLease: "/tenant/lease/sign",
    profile: "/tenant/profile",
    settings: "/tenant/settings",
  },

  landlord: {
    dashboard: "/landlord/dashboard",
    properties: "/properties/me/listings",
    property: (propertyId: string) =>
      `/properties/me/listings/${propertyId}`,
    unlistProperty: (propertyId: string) =>
      `/landlord/properties/${propertyId}/unlist`,
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
    payoutAccount: "/landlord/payout-account",
    statement: "/landlord/statement",
    statementExport: "/landlord/statement/export",
    paymentBreakdown: "/landlord/payment-breakdown",
    withdrawals: "/landlord/withdrawals",
    settings: "/landlord/settings",
    notificationPreferences: "/notifications/preferences",
    profile: "/landlord/profile",
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
