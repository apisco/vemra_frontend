function seg(value: string): string {
  return encodeURIComponent(value);
}

export const ENDPOINTS = {
  identity: {
    me: "/me",
    updateProfile: "/me/profile",
    settings: "/me/settings",
    activities: "/my-activities",
    tenantDashboard: "/me/tenant-dashboard",
    landlordDashboard: "/me/landlord-dashboard",
    avatar: "/me/avatar",
    avatarTicket: "/me/avatar/ticket",
  },

  kyc: {
    documentGrants: "/kyc/documents/grants",
    submissions: "/kyc/submissions",
    me: "/kyc/me",
    verifyNin: "/kyc/verify-nin",
  },

  public: {
    listings: "/properties",
    listing: (propertyId: string) => `/properties/${seg(propertyId)}`,
    propertyAdminProfile: (propertyAdminId: string) =>
      `/super-admin/property-admins/${seg(propertyAdminId)}/public`,
    platformStats: "/public/stats",
    dashboardPreview: "/public/dashboard-preview",
    help: "/public/help",
    helpArticle: (slug: string) => `/public/help/${seg(slug)}`,
    legalLatest: (slug: string) => `/public/legal/${seg(slug)}/latest`,
    waitlist: "/public/waitlist",
    contact: "/public/contact",
  },

  tenant: {
    payments: "/payments",
    wallet: "/wallet",
    withdrawals: "/withdrawals",
    leases: "/leases",
    lease: (leaseId: string) => `/leases/${seg(leaseId)}`,
    signLease: (leaseId: string) => `/leases/${seg(leaseId)}/sign`,
    paymentPlan: (leaseId: string) => `/leases/${seg(leaseId)}/payment-plan`,
    checkout: (leaseId: string) => `/leases/${seg(leaseId)}/pay`,
    rentSavingsTopUp: "/rent-savings/top-up",
    deposit: (leaseId: string) => `/leases/${seg(leaseId)}/deposit`,
    acceptDeposit: (leaseId: string) =>
      `/leases/${seg(leaseId)}/deposit/accept`,
    disputeDeposit: (leaseId: string) =>
      `/leases/${seg(leaseId)}/deposit/dispute`,
    savedProperties: "/properties/saved",
    savedProperty: (propertyId: string) =>
      `/properties/saved/${seg(propertyId)}`,
    maintenance: "/maintenance",
    maintenanceTicket: "/maintenance/ticket",
    maintenanceUpdate: (issueId: string) =>
      `/maintenance/${seg(issueId)}/update`,
    conversations: "/messaging",
    conversationMessages: (conversationId: string) =>
      `/messaging/${seg(conversationId)}/messages`,
    notifications: "/notifications",
    readNotification: (notificationId: string) =>
      `/notifications/${seg(notificationId)}/read`,
    notificationPreferences: "/notifications/preferences",
    referrals: "/referrals",
    referralCode: "/referrals/code",
    referralStats: "/referrals/stats",
    applications: "/applications",
    applicationDocumentTicket: "/applications/documents/ticket",
    withdrawApplication: (applicationId: string) =>
      `/applications/${seg(applicationId)}/withdraw`,
  },

  landlord: {
    dashboard: "/me/landlord-dashboard",
    properties: "/properties/me/listings",
    property: (propertyId: string) =>
      `/properties/me/listings/${seg(propertyId)}`,
    createProperty: "/properties",
    updateProperty: (propertyId: string) => `/properties/${seg(propertyId)}`,
    mediaTicket: (propertyId: string) =>
      `/properties/${seg(propertyId)}/media/ticket`,
    media: (propertyId: string) => `/properties/${seg(propertyId)}/media`,
    mediaItem: (propertyId: string, mediaId: string) =>
      `/properties/${seg(propertyId)}/media/${seg(mediaId)}`,
    publishProperty: (propertyId: string) =>
      `/properties/${seg(propertyId)}/publish`,
    unlistProperty: (propertyId: string) =>
      `/properties/${seg(propertyId)}/unlist`,
    archiveProperty: (propertyId: string) =>
      `/properties/${seg(propertyId)}/archive`,
    applications: "/applications",
    maintenance: "/maintenance",
    wallet: "/wallet",
    payoutAccounts: "/wallet/payout-accounts",
    payoutAccount: (payoutAccountId: string) =>
      `/wallet/payout-accounts/${seg(payoutAccountId)}`,
    payoutAccountPrimary: (payoutAccountId: string) =>
      `/wallet/payout-accounts/${seg(payoutAccountId)}/primary`,
    payoutAccountVerify: (payoutAccountId: string) =>
      `/wallet/payout-accounts/${seg(payoutAccountId)}/verify`,
    withdrawals: "/withdrawals",
    notificationPreferences: "/notifications/preferences",
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
