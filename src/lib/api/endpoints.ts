export const ENDPOINTS = {
  auth: {
    signup: "/auth/signup",
    login: "/auth/login",
    logout: "/auth/logout",
    session: "/auth/session",
    forgotPassword: "/auth/password/forgot",
    resetPassword: "/auth/password/reset",
    verifyEmail: "/auth/email/verify",
    resendEmailVerification: "/auth/email/resend",
    verification: "/auth/verification",
    twoFactorSetup: "/auth/two-factor/setup",
    twoFactorVerify: "/auth/two-factor/verify",
  },

  public: {
    listings: "/listings",
    listing: (listingId: string) => `/listings/${listingId}`,
    featuredListing: "/listings/featured",
    profile: (profileId: string) => `/profiles/${profileId}`,
    platformStats: "/platform/stats",
    dashboardPreview: "/platform/dashboard-preview",
  },

  onboarding: {
    welcome: (role: string) => `/onboarding/${role}`,
  },

  tenant: {
    dashboard: "/tenant/dashboard",
    paymentPlan: "/tenant/payment-plan",
    payments: "/tenant/payments",
    checkout: "/tenant/payments/checkout",
    contacts: "/tenant/contacts",
    rentals: "/tenant/rentals",
    savedProperties: "/tenant/saved-properties",
    savedProperty: (listingId: string) =>
      `/tenant/saved-properties/${listingId}`,
    rentSavings: "/tenant/rent-savings",
    rentSavingsTopUp: "/tenant/rent-savings/top-up",
    rentSavingsAutoDeposit: "/tenant/rent-savings/auto-deposit",
    cautionDeposit: "/tenant/caution-deposit",
    depositDecision: "/tenant/caution-deposit/decision",
    acceptDepositDecision: "/tenant/caution-deposit/decision/accept",
    disputeDepositDecision: "/tenant/caution-deposit/decision/dispute",
    rentChange: "/tenant/rent-change",
    maintenance: "/tenant/maintenance",
    conversations: "/tenant/conversations",
    conversation: (conversationId: string) =>
      `/tenant/conversations/${conversationId}`,
    conversationMessages: (conversationId: string) =>
      `/tenant/conversations/${conversationId}/messages`,
    notifications: "/tenant/notifications",
    readNotifications: "/tenant/notifications/read",
    referrals: "/tenant/referrals",
    applications: "/tenant/applications",
    lease: "/tenant/lease",
    signLease: "/tenant/lease/sign",
    profile: "/tenant/profile",
    settings: "/tenant/settings",
  },

  landlord: {
    dashboard: "/landlord/dashboard",
    properties: "/landlord/properties",
    property: (propertyId: string) => `/landlord/properties/${propertyId}`,
    unlistProperty: (propertyId: string) =>
      `/landlord/properties/${propertyId}/unlist`,
    rentApproval: (propertyId: string) =>
      `/landlord/properties/${propertyId}/rent-approval`,
    decideRentApproval: (propertyId: string) =>
      `/landlord/properties/${propertyId}/rent-approval/decision`,
    applications: "/landlord/applications",
    application: (applicationId: string) =>
      `/landlord/applications/${applicationId}`,
    decideApplication: (applicationId: string) =>
      `/landlord/applications/${applicationId}/decision`,
    maintenance: "/landlord/maintenance",
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
    propertyAdmins: "/landlord/property-admins",
    invitePropertyAdmin: "/landlord/property-admins/invite",
    tenants: "/landlord/tenants",
    settings: "/landlord/settings",
    notificationPreferences: "/landlord/settings/notifications",
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
