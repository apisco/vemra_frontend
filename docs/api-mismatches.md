# API mismatches

Source of truth: `docs/openapi.json` (downloaded from
<https://vemra-backend.onrender.com/docs/openapi.json>, OpenAPI 3.1.0, 146 paths,
base path `/api/v1`).

Where this table disagrees with `docs/api-reference.md`, the spec wins.

## Legend

- **matches** — path, method and shape exist in the spec as the frontend used them.
- **wrong path** — the endpoint exists but the frontend pointed at the wrong URL.
- **missing** — no equivalent endpoint exists for this app's roles (TENANT, LANDLORD).
- **differs** — the path exists but under a different role, method or payload shape.

## Identity, KYC and settings

| Frontend call | Spec status | Action taken |
| --- | --- | --- |
| `identity.me` → `GET /me` | matches | kept |
| `identity.updateProfile` → `PATCH /me/profile` | matches | kept |
| `identity.settings` → `GET`/`PATCH /me/settings` | matches (untyped JSON blob) | kept; now wired for the tenant/landlord settings screens |
| `identity.tenantDashboard` → `GET /me/tenant-dashboard` | matches (response is `additionalProperties`, untyped) | kept; parsed with zod at the boundary |
| `identity.landlordDashboard` → `GET /me/landlord-dashboard` | matches (untyped) | kept; parsed with zod at the boundary |
| `kyc.documentGrants` → `POST /kyc/documents/grants` | matches | kept |
| `kyc.submissions` → `POST /kyc/submissions` | matches | kept |
| — | `GET /kyc/me` existed, unused | added as `kyc.me` |
| — | `POST /kyc/verify-nin` existed, unused | added as `kyc.verifyNin` |
| — | `GET /my-activities` existed, unused | added as `identity.activities` |
| `DELETE /me` | exists, never called | left unwired; account deletion has no screen in this app |

## Public site

| Frontend call | Spec status | Action taken |
| --- | --- | --- |
| `public.profile` → `GET /admin/properties/{id}/public` | **wrong path** | repointed to `GET /super-admin/property-admins/{propertyAdminId}/public` (`security: []`, no auth) and renamed `public.propertyAdminProfile` |
| `public.featuredListing` → `GET /properties` | duplicate of `public.listings` | merged into `public.listings` |
| `public.listing` → `GET /properties/{propertyId}` | differs | spec marks it `Requires Role: Tenant` but also documents an **optional** bearer token (unauthenticated callers get masked location). Kept as an optional-auth read. |
| `public.platformStats` → `GET /public/stats` | matches | kept |
| `public.dashboardPreview` → `GET /public/dashboard-preview` | matches | kept |
| — | `GET /public/help`, `/public/help/{slug}`, `/public/legal/{slug}/latest`, `POST /public/waitlist`, `POST /public/contact` | added to `ENDPOINTS.public` for the marketing/legal screens |

## Properties (landlord)

| Frontend call | Spec status | Action taken |
| --- | --- | --- |
| `landlord.properties` → `GET /properties/me/listings` | matches | kept |
| `landlord.property` → `GET /properties/me/listings/{propertyId}` | matches | kept |
| — | `POST /properties` | added as `landlord.createProperty`; wired into the list-property flow |
| — | `PATCH /properties/{propertyId}` | added as `landlord.updateProperty`; wired into manage-listing save |
| — | `POST /properties/{propertyId}/media/ticket` | added as `landlord.mediaTicket` |
| — | `POST /properties/{propertyId}/media` | added as `landlord.media` |
| — | `POST /properties/{propertyId}/publish` | added as `landlord.publishProperty` |
| `landlord.unlistProperty` → `POST /properties/{propertyId}/unlist` | matches | kept; wired to the Unlist button |
| — | `POST /properties/{propertyId}/archive` | added as `landlord.archiveProperty` |

## Applications

| Frontend call | Spec status | Action taken |
| --- | --- | --- |
| `landlord.approveApplication` → `POST /applications/{id}/approve` | **missing** | removed. Approve exists only at `POST /property-admin/applications/{id}/approve` and `POST /super-admin/applications/{id}/approve`. Not wired for landlords. |
| `landlord.rejectApplication` → `POST /applications/{id}/reject` | **missing** | removed, same reason |
| `landlord.applications` → `GET /applications` | differs | the spec's description covers "Tenants … Admins … Super Admins" and does **not** name LANDLORD. Kept as the only candidate read, but the screen is now read-only and failures surface honestly. Flagged in `docs/backend-requirements.md`. |
| `tenant.applications` → `GET`/`POST /applications` | matches | kept |
| — | `POST /applications/{applicationId}/withdraw` | added as `tenant.withdrawApplication`; wired |

## Leases

| Frontend call | Spec status | Action taken |
| --- | --- | --- |
| `tenant.leases` → `GET /leases` | matches (Tenant only) | kept |
| `tenant.lease` → `GET /leases/{leaseId}` | matches | kept |
| `tenant.paymentPlan` → `GET`/`POST /leases/{leaseId}/payment-plan` | matches | kept; `POST` now wired (`frequency`, `startDate`) |
| `tenant.cautionDeposit` + `tenant.depositDecision` → `GET /leases/{leaseId}/deposit` | duplicate keys, same path | merged into `tenant.deposit` |
| `tenant.acceptDepositDecision` → `POST /leases/{leaseId}/deposit/accept` | matches | kept as `tenant.acceptDeposit`; wired |
| `tenant.disputeDepositDecision` → `POST /leases/{leaseId}/deposit/dispute` | matches (requires `reason`) | kept as `tenant.disputeDeposit`; wired with a required reason |
| — | `POST /leases/{leaseId}/sign` | added as `tenant.signLease`; wired |
| `tenant.rentChange` → `GET /leases/{leaseId}/rent-changes` | **missing** | removed. No `GET` exists at any path. Only `POST /property-admin/leases/{leaseId}/rent-changes` (propose) and `POST /super-admin/leases/{leaseId}/rent-changes/{requestId}/approve|reject`. Tenant screen now shows a read-only "coming soon" state. |
| `landlord.rentApproval` → `GET /leases/{leaseId}/rent-changes` | **missing** | removed, same reason. Landlord rent-approval screen is read-only "Reviewed by Vemra". |

## Payments, wallet and withdrawals

| Frontend call | Spec status | Action taken |
| --- | --- | --- |
| `tenant.checkout` → `POST /leases/{id}/pay` | matches | kept. **Takes no request body** and returns `{ data: { checkoutUrl, breakdown } }` — Paystack hosted checkout. No card fields are accepted by the backend, so all raw card inputs were deleted. |
| Payment verification | **missing** | the spec has no verify/confirm/webhook-status route. The callback page polls `GET /payments?leaseId=…&limit=…` and reports the authoritative server-side status. Flagged in `docs/backend-requirements.md`. |
| Idempotency key | **missing** as a request mechanism | `idempotencyKey` appears in the spec exactly once, as a *response* field on `GET /ledger/accounts/{accountId}/transactions` (Super Admin). No endpoint documents an idempotency request header or body field. `http.ts` now has an `idempotencyKey` option that sends the conventional `Idempotency-Key` header; the backend must honour it. Flagged in `docs/backend-requirements.md`. |
| `tenant.payments` → `GET /payments` | matches | kept |
| — | `POST /rent-savings/top-up` | added as `tenant.rentSavingsTopUp` |
| `landlord.ledgerAccounts` → `GET /ledger/accounts` | **differs** (Super Admin) | removed. Replaced with `GET /wallet` (tag `Payments`, "Tenant or Landlord"), which returns `totalBalance` plus per-wallet (`referral`/`caution`/`payout`) transaction history. |
| `landlord.statement` → `GET /ledger/accounts/{accountId}/breakdown` | **differs** (Super Admin) | removed. Statement screen now reads `GET /wallet`. |
| `landlord.paymentBreakdown` → same path as `statement` | duplicate + Super Admin | removed. Screen shows wallet transactions with a "coming soon" note for the per-property breakdown. |
| `landlord.statementExport` → `POST /ledger/accounts/{accountId}/statement-export` | **differs** (Super Admin) | removed. Export button is disabled with a "coming soon" state. |
| `landlord.payoutAccount` → `/wallet/payout-accounts` | matches | kept as `payoutAccounts`; `GET` + `POST` wired. `POST` body is `{ bankName, accountNumber }`. |
| — | `POST /wallet/payout-accounts/{id}/primary`, `/verify`, `DELETE /wallet/payout-accounts/{id}` | added and wired |
| `landlord.withdrawals` → `GET`/`POST /withdrawals` | matches | kept; `POST` body is `{ amountMinor, bankCode, accountNumber, accountName, sourceWallet? }` |
| `landlord.cautionDeposits` → `POST /leases/{id}/resolve-caution` | **differs** (Payments / Super Admin) | removed. Landlord caution-deposit screen is read-only. |

Note the inconsistency inside the spec itself: `POST /wallet/payout-accounts`
stores a **`bankName`**, but `POST /withdrawals` requires a **`bankCode`**. A saved
payout account therefore cannot by itself satisfy a withdrawal request. Flagged in
`docs/backend-requirements.md`.

## Notifications, messaging, maintenance, referrals

| Frontend call | Spec status | Action taken |
| --- | --- | --- |
| `tenant.notifications` → `GET /notifications` | matches | kept |
| `tenant.readNotifications` → `/notifications/{id}/read` | matches (method is **PUT**, not POST) | kept as `tenant.readNotification`; wired with `PUT` |
| `*.notificationPreferences` → `GET`/`PUT /notifications/preferences` | differs | spec exposes **only** `emailEnabled` and `inAppEnabled`. Both the tenant and landlord preference screens were reduced to those two toggles and now persist. |
| `tenant.conversation` + `tenant.conversationMessages` | duplicate keys, same path | merged into `tenant.conversationMessages` |
| `tenant.conversations` → `GET`/`POST /messaging` | matches | kept |
| `tenant.maintenance` / `landlord.maintenance` → `/maintenance` | matches | kept |
| `tenant.referrals` → `GET /referrals` | matches | kept |
| — | `GET /referrals/code`, `GET /referrals/stats` | added |

## Duplicate keys merged

| Removed key | Kept key | Shared path |
| --- | --- | --- |
| `public.featuredListing` | `public.listings` | `/properties` |
| `tenant.profile`, `landlord.profile` | `identity.me` | `/me` |
| `tenant.settings`, `landlord.settings` | `identity.settings` | `/me/settings` |
| `tenant.cautionDeposit`, `tenant.depositDecision` | `tenant.deposit` | `/leases/{leaseId}/deposit` |
| `tenant.conversation` | `tenant.conversationMessages` | `/messaging/{conversationId}/messages` |
| `landlord.paymentBreakdown` | — (deleted, Super Admin only) | `/ledger/accounts/{accountId}/breakdown` |
| `landlord.rentApproval` / `tenant.rentChange` | — (deleted, no `GET` exists) | `/leases/{leaseId}/rent-changes` |

## Routes in the spec the UI never called

| Route | Action |
| --- | --- |
| `POST /leases/{id}/sign` | wired (tenant lease screen) |
| `POST /leases/{id}/payment-plan` | wired (tenant payment-plan screen) |
| `POST /leases/{id}/deposit/accept` | wired (tenant deposit decision) |
| `POST /leases/{id}/deposit/dispute` | wired, requires a `reason` |
| `POST /properties/saved` | wired (save button) |
| `DELETE /properties/saved/{id}` | wired (unsave button) |
| `POST /applications/{id}/withdraw` | wired (tenant applications) |
| `POST /kyc/verify-nin` | endpoint added; no screen collects a NIN today, left unwired |
| `GET`/`PATCH /me/settings` | wired (tenant + landlord settings) |
| `DELETE /me` | endpoint not added; no screen for account deletion |

## Endpoints verified present but out of scope

All `/super-admin/**`, `/property-admin/**`, `/ledger/**`, `/super-admin/financials`,
`/super-admin/audit-logs`, `/super-admin/settings` and the ratings moderation routes
belong to roles this app does not handle (PROPERTY_ADMIN, SUPER_ADMIN, SUPPORT) and
were deliberately left out of `ENDPOINTS`.

`src/lib/api/endpoints.spec.ts` asserts that every path produced by every
`ENDPOINTS` entry resolves to a real path in `docs/openapi.json`.
