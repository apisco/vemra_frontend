# Vemra API Reference

Auto-generated from the OpenAPI 3.0.3 spec at <https://vemra-backend.onrender.com/docs/>.

- **Base URL:** `https://vemra-backend.onrender.com`
- **Auth:** send `Authorization: Bearer <supabase_access_token>` for protected endpoints.
- **Money:** all amounts are integer minor units (₦2,500.00 = `250000`) with an ISO 4217 currency code.
- **Success envelope:** `{ "data": ..., "requestId": "..." }`
- **Error envelope:** `{ "error": { "code", "message", "details" }, "requestId" }` — branch on `code`, never on `message`.

## Contents

- [Public Site](#public-site) — Public facing endpoints and resources
- [Health](#health) — Liveness and readiness probes.
- [Identity](#identity) — The caller’s own account and onboarding state.
- [Identity (Admin)](#identity-admin) — Identity admin operations
- [KYC (Tenant)](#kyc-tenant) — KYC submission and grants
- [KYC (Admin)](#kyc-admin) — KYC review by admins
- [Properties (Tenant)](#properties-tenant) — Property searching and saving for tenants
- [Properties (Landlord)](#properties-landlord) — Property listings and management for landlords
- [Properties (Admin)](#properties-admin) — Property moderation and approval
- [Applications (Tenant)](#applications-tenant) — Tenant applications for properties
- [Applications (Admin)](#applications-admin) — Admin review of applications
- [Leases](#leases) — Lease management and actions
- [Payments](#payments) — Payment processing for leases
- [Payments (Admin)](#payments-admin) — Admin operations for payments
- [Withdrawals](#withdrawals) — Landlord withdrawal requests
- [Withdrawals (Admin)](#withdrawals-admin) — Admin review of withdrawals
- [Maintenance](#maintenance) — Maintenance issues and tracking
- [Messaging](#messaging) — In-app real-time messaging
- [Notifications](#notifications) — User notifications and preferences
- [Referrals](#referrals) — Referral program endpoints
- [Ratings](#ratings) — User ratings and reviews
- [Settings (Admin)](#settings-admin) — Platform settings management
- [Audit Logs (Admin)](#audit-logs-admin) — Global platform audit logs
- [Errors](#errors) — The shared failure envelope.

## Shared schemas

### Error codes

- `VALIDATION_ERROR`
- `UNAUTHENTICATED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `GONE`
- `UNPROCESSABLE`
- `RATE_LIMITED`
- `INTERNAL_ERROR`
- `NOT_IMPLEMENTED`
- `SERVICE_UNAVAILABLE`
- `FEATURE_NOT_ENABLED`
- `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`
- `SETTING_NOT_CONFIGURED`
- `SETTING_VALUE_INVALID`

### ApiError / ErrorDetail

- `error` **(required)** — object
  - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
    - Machine-readable. Clients branch on this, never on `message`.
    - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
  - `message` **(required)** — string
    - Human-readable. May be reworded; do not branch on it.
  - `details` **(required)** — array<object>
    - `field` **(required)** — string
      - The offending input, prefixed with its location — `body.email`, `query.page`.
    - `reason` **(required)** — string
      - Why the value was rejected, in a form safe to show a caller.
- `requestId` **(required)** — string
  - Correlates this response with the server logs. Quote it in a support report.

## Public Site

> Public facing endpoints and resources

### `POST /api/v1/public/waitlist`

**Join waitlist**

Add a user to the platform waitlist.

- **Auth:** Public

**Request body**

`application/json`

- `email` **(required)** — string
  - format: `email`
- `name` **(required)** — string
- `roleInterest` — string

**Responses**

- `201` — Successfully joined the waitlist
  - `data` **(required)** — object
    - `success` **(required)** — boolean
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.

### `POST /api/v1/public/contact`

**Submit contact form**

Submit a new support ticket via the contact form.

**🌍 Public Route**

- **Auth:** Public

**Request body**

`application/json`

- `email` **(required)** — string
  - format: `email`
- `subject` **(required)** — string
- `message` **(required)** — string
- `userId` — string
  - format: `uuid`

**Responses**

- `201` — Ticket submitted successfully
  - `data` **(required)** — object
    - `success` **(required)** — boolean
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.

### `GET /api/v1/public/help`

**List help articles**

Get all published help articles.

**🌍 Public Route**

- **Auth:** Public

**Responses**

- `200` — List of articles
  - `data` **(required)** — object
    - `data` **(required)** — array<object>
      - additional properties: any \| null
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.

### `GET /api/v1/public/help/{slug}`

**Get help article**

Get a specific help article by its slug.

**🌍 Public Route**

- **Auth:** Public

**Parameters**

- `slug` (path, required) — string

**Responses**

- `200` — Help article
  - `data` **(required)** — object
    - `data` **(required)** — object
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.

### `GET /api/v1/public/legal/{slug}/latest`

**Get latest legal document**

Get the latest published version of a legal document (e.g. Terms of Service).

**🌍 Public Route**

- **Auth:** Public

**Parameters**

- `slug` (path, required) — string

**Responses**

- `200` — Latest document
  - `data` **(required)** — object
    - `data` **(required)** — object
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.

### `GET /api/v1/public/legal/{slug}/versions`

**List legal document versions**

List all published versions of a legal document.

**🌍 Public Route**

- **Auth:** Public

**Parameters**

- `slug` (path, required) — string

**Responses**

- `200` — Versions list
  - `data` **(required)** — object
    - `data` **(required)** — array<object>
      - additional properties: any \| null
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.


## Health

> Liveness and readiness probes.

### `GET /health/live`

**Liveness probe**

Reports that the process is running. Performs no I/O, so a load balancer can use it to decide whether to restart a container — a liveness probe that checked the database would restart a healthy process during a database blip.

- **Auth:** Public

**Responses**

- `200` — The process is up.
  - `data` **(required)** — object
    - `status` **(required)** — enum(`live`)
      - enum: `live`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.

### `GET /health/ready`

**Readiness probe**

Reports whether this instance can serve traffic, checking every dependency: PostgreSQL, Redis, and that every required platform setting has an active version. All checks run before responding, so the body names each failure rather than only the first.

- **Auth:** Public

**Responses**

- `200` — Every dependency is reachable and the platform is configured.
  - `data` **(required)** — object
    - `status` **(required)** — enum(`ready`)
      - enum: `ready`
    - `checks` **(required)** — array<string>
      - The names of the checks that passed.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `503` — At least one check failed. `details` names each failing check and why. The instance is not broken, it is not yet able to serve — a load balancer reads this as "try another instance".
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.


## Identity

> The caller’s own account and onboarding state.

### `GET /api/v1/me`

**Get caller's profile**

Retrieve the authenticated user's profile and onboarding state. Used by the frontend to determine if the user needs to complete profile setup or KYC verification before proceeding.

`🔑 Authentication Required` (Any Role)

- **Auth:** Bearer token required

**Responses**

- `200` — The caller’s profile and onboarding state.
  - `data` **(required)** — object
    - `userId` **(required)** — string
      - format: `uuid`
      - example: `"123e4567-e89b-12d3-a456-426614174000"`
    - `email` **(required)** — string
      - format: `email`
      - example: `"seun.adepoju@example.com"`
    - `emailVerified` **(required)** — boolean
      - True once the account is ACTIVE.
      - example: `true`
    - `displayName` **(required)** — string \| null
      - example: `"Oluwaseun Adepoju"`
    - `phone` **(required)** — string \| null
      - Stored unverified — SMS verification is not enabled.
      - example: `"+2348012345678"`
    - `handle` **(required)** — string \| null
      - example: `"seun_ade"`
    - `roles` **(required)** — array<enum(`TENANT` | `LANDLORD` | `PROPERTY_ADMIN` | `SUPER_ADMIN` | `SUPPORT`)>
      - example: `["TENANT"]`
    - `accountStatus` **(required)** — enum(`PENDING` | `ACTIVE` | `SUSPENDED` | `DELETED`)
      - example: `"ACTIVE"`
      - enum: `PENDING`, `ACTIVE`, `SUSPENDED`, `DELETED`
    - `onboarding` **(required)** — object
      - `nextStep` **(required)** — enum(`EMAIL_VERIFICATION` | `KYC_SUBMISSION` | `UNDER_REVIEW` | `ACTION_REQUIRED` | `COMPLETE`)
        - example: `"COMPLETE"`
        - enum: `EMAIL_VERIFICATION`, `KYC_SUBMISSION`, `UNDER_REVIEW`, `ACTION_REQUIRED`, `COMPLETE`
      - `kycStatus` **(required)** — enum(`PENDING` | `SUBMITTED` | `UNDER_REVIEW` | `ACTION_REQUIRED` | `APPROVED` | `REJECTED` | `EXPIRED`)
        - example: `"APPROVED"`
        - enum: `PENDING`, `SUBMITTED`, `UNDER_REVIEW`, `ACTION_REQUIRED`, `APPROVED`, `REJECTED`, `EXPIRED`
      - `attemptsRemaining` **(required)** — integer \| null
        - range: 0 … ∞
        - example: `null`
      - `applicantMessage` **(required)** — string \| null
        - Neutral text from the reviewer.
        - example: `"All documents verified."`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — No bearer token.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — The account is suspended or deleted.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `PATCH /api/v1/me/profile`

**Update profile**

Update the user's display name, phone number, and handle. This is typically Step 1 of onboarding after signing up via Supabase.

`🔑 Authentication Required` (Any Role)

- **Auth:** Bearer token required

**Request body** (required)

`application/json`

- `displayName` — string \| null
  - The user's full name
  - example: `"Oluwaseun Adepoju"`
- `phone` — string \| null
  - The user's phone number in E.164 format
  - example: `"+2348012345678"`
- `handle` — string \| null
  - The user's unique handle
  - example: `"seun_ade"`

**Responses**

- `200` — The updated profile.
  - `data` **(required)** — object
    - `userId` **(required)** — string
      - format: `uuid`
      - example: `"123e4567-e89b-12d3-a456-426614174000"`
    - `email` **(required)** — string
      - format: `email`
      - example: `"seun.adepoju@example.com"`
    - `emailVerified` **(required)** — boolean
      - True once the account is ACTIVE.
      - example: `true`
    - `displayName` **(required)** — string \| null
      - example: `"Oluwaseun Adepoju"`
    - `phone` **(required)** — string \| null
      - Stored unverified — SMS verification is not enabled.
      - example: `"+2348012345678"`
    - `handle` **(required)** — string \| null
      - example: `"seun_ade"`
    - `roles` **(required)** — array<enum(`TENANT` | `LANDLORD` | `PROPERTY_ADMIN` | `SUPER_ADMIN` | `SUPPORT`)>
      - example: `["TENANT"]`
    - `accountStatus` **(required)** — enum(`PENDING` | `ACTIVE` | `SUSPENDED` | `DELETED`)
      - example: `"ACTIVE"`
      - enum: `PENDING`, `ACTIVE`, `SUSPENDED`, `DELETED`
    - `onboarding` **(required)** — object
      - `nextStep` **(required)** — enum(`EMAIL_VERIFICATION` | `KYC_SUBMISSION` | `UNDER_REVIEW` | `ACTION_REQUIRED` | `COMPLETE`)
        - example: `"COMPLETE"`
        - enum: `EMAIL_VERIFICATION`, `KYC_SUBMISSION`, `UNDER_REVIEW`, `ACTION_REQUIRED`, `COMPLETE`
      - `kycStatus` **(required)** — enum(`PENDING` | `SUBMITTED` | `UNDER_REVIEW` | `ACTION_REQUIRED` | `APPROVED` | `REJECTED` | `EXPIRED`)
        - example: `"APPROVED"`
        - enum: `PENDING`, `SUBMITTED`, `UNDER_REVIEW`, `ACTION_REQUIRED`, `APPROVED`, `REJECTED`, `EXPIRED`
      - `attemptsRemaining` **(required)** — integer \| null
        - range: 0 … ∞
        - example: `null`
      - `applicantMessage` **(required)** — string \| null
        - Neutral text from the reviewer.
        - example: `"All documents verified."`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `400` — Validation error.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `401` — No bearer token.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — The account is suspended or deleted.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `409` — The handle is already taken.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.


## Identity (Admin)

> Identity admin operations

### `GET /api/v1/users`

**List users**

List all users in the system (Platform Admin only).

- **Auth:** Bearer token required

**Responses**

- `200` — Success
  - any \| null
- `401` — Unauthorized
- `403` — Forbidden

### `GET /api/v1/users/{id}`

**Get user by ID**

Get a specific user by ID (Platform Admin only).

- **Auth:** Bearer token required

**Parameters**

- `id` (path, required) — string

**Responses**

- `200` — Success
  - any \| null
- `401` — Unauthorized
- `403` — Forbidden
- `404` — Not Found

### `PATCH /api/v1/users/{id}/roles`

**Grant role to user**

Grant a new role to a user (Super Admin only).

- **Auth:** Bearer token required

**Parameters**

- `id` (path, required) — string

**Request body**

`application/json`

- `role` **(required)** — string

**Responses**

- `200` — Success
  - any \| null
- `401` — Unauthorized
- `403` — Forbidden
- `404` — Not Found

### `POST /api/v1/admin/invitations`

**Invite a new Admin**

Platform Admins use this to invite new Property Admins or other Platform Admins. An email invitation is triggered.

`🛡️ Requires Role:` Platform Admin

- **Auth:** Bearer token required

**Request body** (required)

`application/json`

- `email` **(required)** — string
  - format: `email`
  - example: `"newadmin@vemra.com"`
- `role` **(required)** — enum(`PROPERTY_ADMIN` | `SUPER_ADMIN`)
  - example: `"PROPERTY_ADMIN"`
  - enum: `PROPERTY_ADMIN`, `SUPER_ADMIN`
- `assignedPropertyId` — string
  - Required if role is PROPERTY_ADMIN
  - format: `uuid`
  - example: `"550e8400-e29b-41d4-a716-446655440000"`

**Responses**

- `201` — Invitation created.
  - `data` **(required)** — object
    - `id` **(required)** — string
      - format: `uuid`
      - example: `"123e4567-e89b-12d3-a456-426614174000"`
    - `email` **(required)** — string
      - format: `email`
      - example: `"newadmin@vemra.com"`
    - `role` **(required)** — string
      - example: `"PROPERTY_ADMIN"`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `400` — Validation error.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `401` — No bearer token.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Not a Platform Admin.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `POST /api/v1/admin/invitations/{invitationId}/accept`

**Accept an invitation**

Called by the frontend when a user accepts an invitation link. It links the authenticated Supabase user to the admin role granted in the invitation.

`🛡️ Requires Role:` Platform Admin

- **Auth:** Bearer token required

**Parameters**

- `invitationId` (path, required) — string

**Responses**

- `200` — Invitation accepted.
  - `data` **(required)** — object
    - `success` **(required)** — boolean
      - example: `true`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — No bearer token.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Invitation not found.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.


## KYC (Tenant)

> KYC submission and grants

### `POST /api/v1/kyc/documents/grants`

**Workflow Step 1: Get signed upload policy**

Step 1 of the KYC workflow. The frontend must request an upload policy grant for each document the user wants to upload. This returns a signed policy and a Cloudinary endpoint. The frontend uses the `url` and `fields` from this response to POST the actual file directly to Cloudinary. Do not send the file bytes to this Vemra backend.

`🔑 Authentication Required` (Any Role)

- **Auth:** Bearer token required

**Request body**

`application/json`

- `fileName` **(required)** — string
  - Name of the file
  - example: `"passport.jpg"`
- `contentType` **(required)** — string
  - MIME type
  - example: `"image/jpeg"`
- `maxSizeBytes` **(required)** — integer
  - Maximum allowed file size
  - range: 0 … ∞
  - example: `5242880`

**Responses**

- `200` — Upload policy.
  - `data` **(required)** — object
    - `url` **(required)** — string
      - example: `"https://api.cloudinary.com/v1_1/vemra/upload"`
    - `fields` **(required)** — object
      - example: `{"signature":"sig_abc123","timestamp":"1727100000","api_key":"key123","folder":"private/kyc/tenant_1"}`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — No bearer token.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `POST /api/v1/kyc/submissions`

**Workflow Step 2: Submit KYC for review**

Step 2 of the KYC workflow. Once the frontend successfully uploads the documents to Cloudinary using the grant from Step 1, submit the KYC application here. Pass the Cloudinary `storagePath` (which you can infer from the grant fields or Cloudinary's response) along with any text claims (e.g. NIN).

`🔑 Authentication Required` (Any Role)

- **Auth:** Bearer token required

**Request body** (required)

`application/json`

- `documents` **(required)** — array<object>
  - `checkType` **(required)** — string
    - Type of document, e.g. IDENTITY or PROOF_OF_ADDRESS
    - example: `"IDENTITY"`
  - `storagePath` **(required)** — string
    - Cloudinary storage path of uploaded document
    - example: `"private/kyc/tenant_1/passport.jpg"`
- `claims` **(required)** — object
  - Metadata/Text claims like NIN.
  - example: `{"nin":"12345678901"}`

**Responses**

- `201` — Submission created.
  - `data` **(required)** — object
    - `id` **(required)** — string
      - format: `uuid`
      - example: `"123e4567-e89b-12d3-a456-426614174000"`
    - `status` **(required)** — enum(`PENDING` | `SUBMITTED` | `UNDER_REVIEW` | `ACTION_REQUIRED` | `APPROVED` | `REJECTED` | `EXPIRED`)
      - example: `"PENDING"`
      - enum: `PENDING`, `SUBMITTED`, `UNDER_REVIEW`, `ACTION_REQUIRED`, `APPROVED`, `REJECTED`, `EXPIRED`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `400` — Validation error.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `401` — No bearer token.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.


## KYC (Admin)

> KYC review by admins

### `GET /api/v1/kyc/verifications`

**List verification cases**

List pending KYC verification cases for admins to review. Admins use this to view the documents uploaded by the tenant.

`🛡️ Requires Role:` Platform Admin

- **Auth:** Bearer token required

**Responses**

- `200` — Cases listed.
  - `data` **(required)** — object
    - `data` **(required)** — array<object>
      - `id` **(required)** — string
        - format: `uuid`
        - example: `"123e4567-e89b-12d3-a456-426614174000"`
      - `applicantId` **(required)** — string
        - format: `uuid`
        - example: `"550e8400-e29b-41d4-a716-446655440000"`
      - `status` **(required)** — enum(`PENDING` | `SUBMITTED` | `UNDER_REVIEW` | `ACTION_REQUIRED` | `APPROVED` | `REJECTED` | `EXPIRED`)
        - example: `"PENDING"`
        - enum: `PENDING`, `SUBMITTED`, `UNDER_REVIEW`, `ACTION_REQUIRED`, `APPROVED`, `REJECTED`, `EXPIRED`
      - `submittedAt` **(required)** — string
        - example: `"2026-09-24T10:00:00Z"`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — No bearer token.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Not an Admin.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `POST /api/v1/kyc/verifications/{verificationId}/decision`

**Review a KYC case**

Admins apply a decision (APPROVED, REJECTED, ACTION_REQUIRED) to a KYC case. If rejected or action required, the `reason` provided here will be visible to the user on their dashboard so they know what to fix.

`🛡️ Requires Role:` Platform Admin

- **Auth:** Bearer token required

**Parameters**

- `verificationId` (path, required) — string

**Request body** (required)

`application/json`

- `decision` **(required)** — enum(`APPROVED` | `REJECTED` | `ACTION_REQUIRED`)
  - example: `"ACTION_REQUIRED"`
  - enum: `APPROVED`, `REJECTED`, `ACTION_REQUIRED`
- `reason` **(required)** — string
  - Reason for rejection or action required, or neutral comment for approval.
  - example: `"The ID is blurred. Please re-upload a clearer image."`

**Responses**

- `200` — Decision applied.
  - `data` **(required)** — object
    - `success` **(required)** — boolean
      - example: `true`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — No bearer token.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Not an Admin.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Case not found.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.


## Properties (Tenant)

> Property searching and saving for tenants

### `GET /api/v1/properties`

**Search and filter properties**

Find properties matching various criteria. Results are paginated. Distance is calculated using PostGIS spatial geography queries. **Note on Authentication**: This endpoint can be called with or without a Bearer token. Unauthenticated requests will receive masked location details (exact address and coordinates will be hidden to protect privacy). Authenticated requests will return the full address and coordinates.

**🔒 Requires Role:** Tenant

- **Auth:** Public

**Parameters**

- `status` (query) — string: Filter by property status.
- `minPriceMinor` (query) — number \| null: Minimum annual rent in minor currency units (e.g., kobo for NGN).
- `maxPriceMinor` (query) — number \| null: Maximum annual rent in minor currency units (e.g., kobo for NGN).
- `bedrooms` (query) — number \| null: Exact number of bedrooms.
- `bathrooms` (query) — number \| null: Exact number of bathrooms.
- `propertyType` (query) — string: Property type (e.g., "apartment", "house").
- `lat` (query) — number \| null: Latitude for proximity search.
- `lng` (query) — number \| null: Longitude for proximity search.
- `radiusInMeters` (query) — number \| null: Radius in meters for proximity search. Requires lat and lng.
- `limit` (query) — number: Pagination limit.
- `offset` (query) — number \| null: Pagination offset.

**Responses**

- `200` — Paginated search results.
  - `data` **(required)** — object
    - `properties` **(required)** — array<any \| null>
      - List of matching properties.
      - example: `[]`
    - `pagination` **(required)** — object
      - `limit` **(required)** — number
        - example: `20`
      - `offset` **(required)** — number
        - example: `0`
      - `count` **(required)** — number
        - Number of items returned in this page.
        - example: `0`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `400` — Bad Request.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `GET /api/v1/properties/{propertyId}`

**Get public property details**

Retrieve full public details for a single property, including all media and amenities. **Note on Authentication**: This endpoint accepts an optional Bearer token. Unauthenticated requests will receive masked location details (exact address and coordinates will be hidden to protect privacy). Authenticated requests will return the full address and coordinates.

**🔒 Requires Role:** Tenant

- **Auth:** Public

**Parameters**

- `propertyId` (path, required) — string: The UUID of the property.

**Responses**

- `200` — Property details.
  - `data` — any \| null
    - example: `{"id":"550e8400-e29b-41d4-a716-446655440000","title":"Luxury Apartment in Lekki Phase 1","annualRentMinor":350000000,"rentCurrency":"NGN"}`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `404` — Property Not Found.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `POST /api/v1/properties/saved`

**Save a property**

Add a property to the authenticated tenant's saved/favorites list.

**🔒 Requires Role:** Tenant

- **Auth:** Public

**Request body**

`application/json`

- `propertyId` **(required)** — string
  - UUID of the property to save.
  - format: `uuid`
  - example: `"550e8400-e29b-41d4-a716-446655440000"`

**Responses**

- `201` — Property saved successfully.
  - `data` **(required)** — object
    - `message` **(required)** — string
      - example: `"Property saved"`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Property not found.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `409` — Property already saved.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `GET /api/v1/properties/saved`

**List saved properties**

Retrieve the list of properties the authenticated tenant has saved.

**🔒 Requires Role:** Tenant

- **Auth:** Public

**Responses**

- `200` — List of saved properties.
  - `data` **(required)** — object
    - `properties` **(required)** — array<any \| null>
      - Saved properties.
      - example: `[]`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `DELETE /api/v1/properties/saved/{propertyId}`

**Remove saved property**

Remove a property from the authenticated tenant's saved/favorites list.

**🔒 Requires Role:** Tenant

- **Auth:** Public

**Parameters**

- `propertyId` (path, required) — string: UUID of the saved property.

**Responses**

- `200` — Property removed successfully.
  - `data` **(required)** — object
    - `message` **(required)** — string
      - example: `"Property removed from saved list"`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Saved property not found.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.


## Properties (Landlord)

> Property listings and management for landlords

### `POST /api/v1/properties`

**Create a property**

Create a new property listing as a landlord.

**🔒 Requires Role:** Landlord

- **Auth:** Public

**Request body**

`application/json`

- `title` **(required)** — string
- `description` **(required)** — string
- `location` **(required)** — object
  - `address` **(required)** — string
  - `city` **(required)** — string
  - `state` **(required)** — string
  - `country` **(required)** — string
  - `coordinates` **(required)** — object
    - `lat` **(required)** — number
    - `lng` **(required)** — number
- `propertyType` **(required)** — string
- `bedrooms` **(required)** — number
- `bathrooms` **(required)** — number
- `squareFeet` **(required)** — number
- `amenities` **(required)** — array<string>
- `rentAmountMinor` **(required)** — number
- `rentCurrency` — string
- `rentPeriod` **(required)** — enum(`monthly` | `annual`)
  - enum: `monthly`, `annual`

**Responses**

- `201` — Property created.
  - `data` **(required)** — object
    - `id` **(required)** — string
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `PATCH /api/v1/properties/{propertyId}`

**Update a property**

Update property details as a landlord.

**🔒 Requires Role:** Landlord

- **Auth:** Public

**Parameters**

- `propertyId` (path, required) — string

**Request body**

`application/json`

- `title` — string
- `description` — string
- `propertyType` — string
- `bedrooms` — number
- `bathrooms` — number
- `squareFeet` — number
- `amenities` — array<string>
- `rentAmountMinor` — number
- `rentCurrency` — string
- `rentPeriod` — enum(`monthly` | `annual`)
  - enum: `monthly`, `annual`

**Responses**

- `200` — Property updated.
  - `data` **(required)** — object
    - `message` **(required)** — string
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Property not found.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `GET /api/v1/properties/me/listings`

**Get landlord properties**

Retrieve properties listed by the authenticated landlord.

**🔒 Requires Role:** Landlord

- **Auth:** Public

**Responses**

- `200` — Landlord properties.
  - `data` **(required)** — object
    - `properties` **(required)** — array<any \| null>
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `GET /api/v1/properties/me/listings/{propertyId}`

**Get a landlord property**

Retrieve details of a specific property listed by the authenticated landlord.

**🔒 Requires Role:** Landlord

- **Auth:** Public

**Parameters**

- `propertyId` (path, required) — string

**Responses**

- `200` — Property details.
  - `data` **(required)** — object
    - `data` — any \| null
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Property not found.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `POST /api/v1/properties/{propertyId}/media/ticket`

**Get upload ticket**

Generate a presigned URL to upload media for a property.

**🔒 Requires Role:** Landlord

- **Auth:** Public

**Parameters**

- `propertyId` (path, required) — string

**Request body**

`application/json`

- `fileName` **(required)** — string
- `contentType` **(required)** — string
- `maxSizeBytes` **(required)** — number

**Responses**

- `201` — Upload ticket.
  - `data` — any \| null
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `POST /api/v1/properties/{propertyId}/media`

**Attach media**

Attach uploaded media to a property.

**🔒 Requires Role:** Landlord

- **Auth:** Public

**Parameters**

- `propertyId` (path, required) — string

**Request body**

`application/json`

- `url` **(required)** — string
- `isMain` **(required)** — boolean
- `order` **(required)** — number

**Responses**

- `201` — Media attached.
  - `data` **(required)** — object
    - `message` **(required)** — string
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `POST /api/v1/properties/{propertyId}/publish`

**Publish property**

Publish a property.

**🔒 Requires Role:** Landlord

- **Auth:** Public

**Parameters**

- `propertyId` (path, required) — string

**Responses**

- `200` — Published.
  - `data` **(required)** — object
    - `message` **(required)** — string
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.

### `POST /api/v1/properties/{propertyId}/unlist`

**Unlist property**

Unlist a property.

**🔒 Requires Role:** Landlord

- **Auth:** Public

**Parameters**

- `propertyId` (path, required) — string

**Responses**

- `200` — Unlisted.
  - `data` **(required)** — object
    - `message` **(required)** — string
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.

### `POST /api/v1/properties/{propertyId}/archive`

**Archive property**

Archive a property.

**🔒 Requires Role:** Landlord

- **Auth:** Public

**Parameters**

- `propertyId` (path, required) — string

**Responses**

- `200` — Archived.
  - `data` **(required)** — object
    - `message` **(required)** — string
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.


## Properties (Admin)

> Property moderation and approval

### `GET /api/v1/properties/admin/all`

**List all properties**

List all properties in the system (Platform Admin only).

- **Auth:** Bearer token required

**Responses**

- `200` — Success
  - any \| null
- `401` — Unauthorized
- `403` — Forbidden

### `PUT /api/v1/properties/{id}/moderation`

**Moderate a property**

Approve or reject a property listing (Platform Admin only).

- **Auth:** Bearer token required

**Parameters**

- `id` (path, required) — string

**Request body**

`application/json`

- `status` **(required)** — enum(`APPROVED` | `REJECTED`)
  - enum: `APPROVED`, `REJECTED`

**Responses**

- `200` — Success
  - any \| null
- `401` — Unauthorized
- `403` — Forbidden
- `404` — Not Found


## Applications (Tenant)

> Tenant applications for properties

### `POST /api/v1/applications`

**Submit a new lease application**

Submit an application for a specific property. Documents should be pre-uploaded via Cloudinary grants (similar to KYC) and the resulting `storagePath` passed here.

**🔒 Requires Role:** Tenant

- **Auth:** Bearer token required

**Request body** (required)

`application/json`

- `propertyId` **(required)** — string
  - The UUID of the property to apply for
  - format: `uuid`
  - example: `"550e8400-e29b-41d4-a716-446655440000"`
- `documents` **(required)** — array<object>
  - `documentType` **(required)** — string
    - The type of document uploaded, e.g., PAYSLIP, BANK_STATEMENT
    - example: `"PAYSLIP"`
  - `storagePath` **(required)** — string
    - The cloud storage path
    - example: `"private/applications/tenant_1/payslip.pdf"`

**Responses**

- `201` — Application submitted.
  - `data` **(required)** — object
    - `id` **(required)** — string
      - format: `uuid`
      - example: `"123e4567-e89b-12d3-a456-426614174000"`
    - `status` **(required)** — string
      - example: `"PENDING"`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `400` — Validation error.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `GET /api/v1/applications`

**List applications**

Tenants can list their own applications. Admins can list applications for properties they are assigned to. Super Admins can list all applications.

`🔑 Authentication Required` (Any Role)

- **Auth:** Bearer token required

**Parameters**

- `propertyId` (query) — string: Filter by property ID
- `status` (query) — string: Filter by status

**Responses**

- `200` — List of applications.
  - `data` **(required)** — object
    - `data` **(required)** — array<any \| null>
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `POST /api/v1/applications/{applicationId}/withdraw`

**Withdraw an application**

Tenants can withdraw their own pending applications.

**🔒 Requires Role:** Tenant

- **Auth:** Bearer token required

**Parameters**

- `applicationId` (path, required) — string

**Responses**

- `200` — Application withdrawn.
  - `data` **(required)** — object
    - `success` **(required)** — boolean
      - example: `true`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Application not found.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.


## Applications (Admin)

> Admin review of applications

### `POST /api/v1/applications/{applicationId}/approve`

**Approve an application**

Property Admins or Super Admins can approve a pending application. This automatically generates a draft Lease.

`🛡️ Requires Role:` Platform Admin

- **Auth:** Bearer token required

**Parameters**

- `applicationId` (path, required) — string

**Responses**

- `200` — Application approved.
  - `data` **(required)** — object
    - `success` **(required)** — boolean
      - example: `true`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Application not found.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `POST /api/v1/applications/{applicationId}/reject`

**Reject an application**

Property Admins or Super Admins can reject a pending application.

`🛡️ Requires Role:` Platform Admin

- **Auth:** Bearer token required

**Parameters**

- `applicationId` (path, required) — string

**Responses**

- `200` — Application rejected.
  - `data` **(required)** — object
    - `success` **(required)** — boolean
      - example: `true`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `401` — Unauthorized.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Application not found.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.


## Leases

> Lease management and actions

### `GET /api/v1/leases/admin/all`

**List all leases**

List all leases globally (Super Admin only).

- **Auth:** Bearer token required

**Responses**

- `200` — Success
  - any \| null
- `401` — Unauthorized
- `403` — Forbidden

### `POST /api/v1/leases/{leaseId}/sign`

**Sign a lease**

Signs a drafted lease. Requires `TENANT` role.

- **Auth:** Bearer token required

**Parameters**

- `leaseId` (path, required) — string

**Responses**

- `200` — Lease signed successfully

**🔑 Authentication Required** (Any Role)
  - `status` **(required)** — enum(`success`)
    - enum: `success`
  - `data` **(required)** — object
    - `message` **(required)** — string

### `GET /api/v1/leases/{leaseId}`

**Get a lease by ID**

Returns lease details. Requires Tenant, Property Admin, or Super Admin role.

`🔑 Authentication Required` (Any Role)

- **Auth:** Bearer token required

**Parameters**

- `leaseId` (path, required) — string

**Responses**

- `200` — Lease details
  - `status` **(required)** — enum(`success`)
    - enum: `success`
  - `data` **(required)** — object
    - `id` **(required)** — string
      - format: `uuid`
    - `applicationId` **(required)** — string
      - format: `uuid`
    - `propertyId` **(required)** — string
      - format: `uuid`
    - `tenantId` **(required)** — string
      - format: `uuid`
    - `status` **(required)** — enum(`DRAFT` | `SIGNED` | `ACTIVE` | `TERMINATED`)
      - enum: `DRAFT`, `SIGNED`, `ACTIVE`, `TERMINATED`
    - `annualRent` **(required)** — object
      - `amountMinor` **(required)** — any
      - `currency` **(required)** — string
    - `termMonths` **(required)** — number
    - `cautionDeposit` **(required)** — object
      - `amountMinor` **(required)** — any
      - `currency` **(required)** — string
    - `startDate` **(required)** — string
    - `endDate` **(required)** — string
    - `billingSchedules` **(required)** — array<object>
      - `id` **(required)** — string
      - `amount` **(required)** — object
        - `amountMinor` **(required)** — any
        - `currency` **(required)** — string
      - `dueDate` **(required)** — string
      - `status` **(required)** — enum(`PENDING` | `PAID` | `OVERDUE`)
        - enum: `PENDING`, `PAID`, `OVERDUE`
    - `createdAt` **(required)** — string
    - `updatedAt` **(required)** — string

### `POST /api/v1/leases/{leaseId}/terminate`

**Terminate a lease**

Terminates an active lease. Requires `PROPERTY_ADMIN` or `SUPER_ADMIN` role.

- **Auth:** Bearer token required

**Parameters**

- `leaseId` (path, required) — string

**Responses**

- `200` — Lease terminated successfully

**🔑 Authentication Required** (Any Role)
  - `status` **(required)** — enum(`success`)
    - enum: `success`
  - `data` **(required)** — object
    - `message` **(required)** — string


## Payments

> Payment processing for leases

### `POST /api/v1/leases/{id}/pay`

**Pay for a lease**

Initializes a payment for a lease using Paystack, returning a checkout URL and the exact fee breakdown.

`🔑 Authentication Required` (Any Role)

- **Auth:** Bearer token required

**Parameters**

- `id` (path, required) — string

**Responses**

- `200` — Checkout URL and breakdown.
  - `data` **(required)** — object
    - `checkoutUrl` **(required)** — string
      - format: `uri`
    - `breakdown` **(required)** — object
      - `rentMinor` **(required)** — string
      - `cautionDepositMinor` **(required)** — string
      - `tenantPlatformFeeMinor` **(required)** — string
      - `paystackFeeMinor` **(required)** — string
      - `totalAmountMinor` **(required)** — string
      - `currency` **(required)** — string
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `400` — Bad Request
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `401` — Unauthorized
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Lease not found
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.


## Payments (Admin)

> Admin operations for payments

### `POST /api/v1/leases/{id}/resolve-caution`

**Resolve Caution Deposit**

Admins resolve the caution deposit at the end of a lease. Deductions go to the landlord, remainder goes to the tenant.

`🛡️ Requires Role:` Platform Admin

- **Auth:** Bearer token required

**Parameters**

- `id` (path, required) — string

**Request body**

`application/json`

- `landlordDeductionMinor` **(required)** — string

**Responses**

- `200` — Caution deposit resolved.
  - `data` **(required)** — object
    - `success` **(required)** — boolean
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `400` — Bad Request
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `401` — Unauthorized
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Lease not found
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.


## Withdrawals

> Landlord withdrawal requests

### `POST /api/v1/withdrawals`

**Request a withdrawal**

Landlords can request a withdrawal to their bank account.

`🔑 Authentication Required` (Any Role)

- **Auth:** Bearer token required

**Request body**

`application/json`

- `amountMinor` **(required)** — integer
  - range: 0 … ∞
- `bankCode` **(required)** — string
- `accountNumber` **(required)** — string
- `accountName` **(required)** — string

**Responses**

- `201` — Withdrawal requested.
  - `data` **(required)** — object
    - `id` **(required)** — string
      - format: `uuid`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `400` — Bad Request
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `401` — Unauthorized
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.


## Withdrawals (Admin)

> Admin review of withdrawals

### `POST /api/v1/withdrawals/{id}/recommend`

**Recommend a withdrawal**

Property Admins recommend a pending withdrawal for platform admin approval.

`🛡️ Requires Role:` Platform Admin

- **Auth:** Bearer token required

**Parameters**

- `id` (path, required) — string

**Responses**

- `200` — Withdrawal recommended.
  - `data` **(required)** — object
    - `success` **(required)** — boolean
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `400` — Bad Request
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `401` — Unauthorized
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Withdrawal not found
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `POST /api/v1/withdrawals/{id}/approve`

**Approve a withdrawal**

Platform Admins approve a withdrawal, transferring funds using the payment gateway.

`🛡️ Requires Role:` Platform Admin

- **Auth:** Bearer token required

**Parameters**

- `id` (path, required) — string

**Responses**

- `200` — Withdrawal approved.
  - `data` **(required)** — object
    - `success` **(required)** — boolean
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `400` — Bad Request
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `401` — Unauthorized
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Withdrawal not found
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.

### `POST /api/v1/withdrawals/{id}/reject`

**Reject a withdrawal**

Platform Admins reject a pending or recommended withdrawal.

`🛡️ Requires Role:` Platform Admin

- **Auth:** Bearer token required

**Parameters**

- `id` (path, required) — string

**Request body**

`application/json`

- `reason` — string

**Responses**

- `200` — Withdrawal rejected.
  - `data` **(required)** — object
    - `success` **(required)** — boolean
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.
- `400` — Bad Request
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `401` — Unauthorized
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `403` — Forbidden
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.
- `404` — Withdrawal not found
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.


## Maintenance

> Maintenance issues and tracking

### `POST /api/v1/maintenance`

**Report a maintenance issue**

Report an issue. Requires Tenant, Landlord, or Admin role.

- **Auth:** Bearer token required

**Request body**

`application/json`

- `propertyId` **(required)** — string
  - format: `uuid`
- `title` **(required)** — string
- `description` **(required)** — string
- `priority` **(required)** — enum(`LOW` | `MEDIUM` | `HIGH` | `EMERGENCY`)
  - enum: `LOW`, `MEDIUM`, `HIGH`, `EMERGENCY`

**Responses**

- `201` — Maintenance request created

**🔑 Authentication Required** (Any Role)
  - `status` **(required)** — enum(`success`)
    - enum: `success`
  - `data` **(required)** — object
    - `id` **(required)** — string
      - format: `uuid`
    - `propertyId` **(required)** — string
      - format: `uuid`
    - `reporterId` **(required)** — string
      - format: `uuid`
    - `title` **(required)** — string
    - `description` **(required)** — string
    - `priority` **(required)** — enum(`LOW` | `MEDIUM` | `HIGH` | `EMERGENCY`)
      - enum: `LOW`, `MEDIUM`, `HIGH`, `EMERGENCY`
    - `status` **(required)** — enum(`REPORTED` | `ASSIGNED` | `IN_PROGRESS` | `RESOLVED` | `CLOSED`)
      - enum: `REPORTED`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`
    - `assignedTo` **(required)** — string \| null
    - `createdAt` **(required)** — string
    - `updatedAt` **(required)** — string

### `GET /api/v1/maintenance`

**List maintenance issues**

Returns issues. Filters optionally by propertyId or status.

`🔑 Authentication Required` (Any Role)

- **Auth:** Bearer token required

**Parameters**

- `propertyId` (query) — string
- `status` (query) — enum(`REPORTED` | `ASSIGNED` | `IN_PROGRESS` | `RESOLVED` | `CLOSED`)

**Responses**

- `200` — Issues list
  - `status` **(required)** — enum(`success`)
    - enum: `success`
  - `data` **(required)** — array<object>
    - `id` **(required)** — string
      - format: `uuid`
    - `propertyId` **(required)** — string
      - format: `uuid`
    - `reporterId` **(required)** — string
      - format: `uuid`
    - `title` **(required)** — string
    - `description` **(required)** — string
    - `priority` **(required)** — enum(`LOW` | `MEDIUM` | `HIGH` | `EMERGENCY`)
      - enum: `LOW`, `MEDIUM`, `HIGH`, `EMERGENCY`
    - `status` **(required)** — enum(`REPORTED` | `ASSIGNED` | `IN_PROGRESS` | `RESOLVED` | `CLOSED`)
      - enum: `REPORTED`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`
    - `assignedTo` **(required)** — string \| null
    - `createdAt` **(required)** — string
    - `updatedAt` **(required)** — string

### `POST /api/v1/maintenance/{id}/assign`

**Assign a maintenance issue**

Assign an issue. Requires Admin role.

- **Auth:** Bearer token required

**Parameters**

- `id` (path, required) — string

**Request body**

`application/json`

- `adminId` **(required)** — string
  - format: `uuid`

**Responses**

- `200` — Assigned successfully

**🔑 Authentication Required** (Any Role)
  - `status` **(required)** — enum(`success`)
    - enum: `success`
  - `data` **(required)** — object
    - `id` **(required)** — string
      - format: `uuid`
    - `propertyId` **(required)** — string
      - format: `uuid`
    - `reporterId` **(required)** — string
      - format: `uuid`
    - `title` **(required)** — string
    - `description` **(required)** — string
    - `priority` **(required)** — enum(`LOW` | `MEDIUM` | `HIGH` | `EMERGENCY`)
      - enum: `LOW`, `MEDIUM`, `HIGH`, `EMERGENCY`
    - `status` **(required)** — enum(`REPORTED` | `ASSIGNED` | `IN_PROGRESS` | `RESOLVED` | `CLOSED`)
      - enum: `REPORTED`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`
    - `assignedTo` **(required)** — string \| null
    - `createdAt` **(required)** — string
    - `updatedAt` **(required)** — string

### `POST /api/v1/maintenance/{id}/update`

**Update a maintenance issue**

Update an issue notes, status, media.

- **Auth:** Bearer token required

**Parameters**

- `id` (path, required) — string

**Request body**

`application/json`

- `notes` — string
- `status` — enum(`REPORTED` | `ASSIGNED` | `IN_PROGRESS` | `RESOLVED` | `CLOSED`)
  - enum: `REPORTED`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`
- `mediaUrls` — array<string>

**Responses**

- `200` — Updated successfully

**🔑 Authentication Required** (Any Role)
  - `status` **(required)** — enum(`success`)
    - enum: `success`
  - `data` **(required)** — object
    - `id` **(required)** — string
      - format: `uuid`
    - `propertyId` **(required)** — string
      - format: `uuid`
    - `reporterId` **(required)** — string
      - format: `uuid`
    - `title` **(required)** — string
    - `description` **(required)** — string
    - `priority` **(required)** — enum(`LOW` | `MEDIUM` | `HIGH` | `EMERGENCY`)
      - enum: `LOW`, `MEDIUM`, `HIGH`, `EMERGENCY`
    - `status` **(required)** — enum(`REPORTED` | `ASSIGNED` | `IN_PROGRESS` | `RESOLVED` | `CLOSED`)
      - enum: `REPORTED`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`
    - `assignedTo` **(required)** — string \| null
    - `createdAt` **(required)** — string
    - `updatedAt` **(required)** — string


## Messaging

> In-app real-time messaging

### `POST /api/v1/messaging`

**Start a conversation**

Start a conversation for a property.

- **Auth:** Bearer token required

**Request body**

`application/json`

- `propertyId` **(required)** — string
  - format: `uuid`

**Responses**

- `201` — Conversation created

**🔑 Authentication Required** (Any Role)
  - `status` **(required)** — enum(`success`)
    - enum: `success`
  - `data` **(required)** — object
    - `id` **(required)** — string
      - format: `uuid`
    - `propertyId` **(required)** — string
      - format: `uuid`
    - `status` **(required)** — string
    - `participants` **(required)** — array<object>
      - `id` **(required)** — string
        - format: `uuid`
      - `role` **(required)** — string
    - `createdAt` **(required)** — string
    - `updatedAt` **(required)** — string

### `GET /api/v1/messaging`

**List conversations**

Returns conversations for the caller.

`🔑 Authentication Required` (Any Role)

- **Auth:** Bearer token required

**Responses**

- `200` — Conversations list
  - `status` **(required)** — enum(`success`)
    - enum: `success`
  - `data` **(required)** — array<object>
    - `id` **(required)** — string
      - format: `uuid`
    - `propertyId` **(required)** — string
      - format: `uuid`
    - `status` **(required)** — string
    - `participants` **(required)** — array<object>
      - `id` **(required)** — string
        - format: `uuid`
      - `role` **(required)** — string
    - `createdAt` **(required)** — string
    - `updatedAt` **(required)** — string

### `POST /api/v1/messaging/{conversationId}/messages`

**Send a message**

Send a message to a conversation.

- **Auth:** Bearer token required

**Parameters**

- `conversationId` (path, required) — string

**Request body**

`application/json`

- `body` **(required)** — string

**Responses**

- `201` — Message sent

**🔑 Authentication Required** (Any Role)
  - `status` **(required)** — enum(`success`)
    - enum: `success`
  - `data` **(required)** — object
    - `id` **(required)** — string
      - format: `uuid`
    - `conversationId` **(required)** — string
      - format: `uuid`
    - `senderId` **(required)** — string
      - format: `uuid`
    - `body` **(required)** — string
    - `createdAt` **(required)** — string

### `GET /api/v1/messaging/{conversationId}/messages`

**List messages**

List messages in a conversation.

- **Auth:** Bearer token required

**Parameters**

- `conversationId` (path, required) — string

**Responses**

- `200` — Messages list

**🔑 Authentication Required** (Any Role)
  - `status` **(required)** — enum(`success`)
    - enum: `success`
  - `data` **(required)** — array<object>
    - `id` **(required)** — string
      - format: `uuid`
    - `conversationId` **(required)** — string
      - format: `uuid`
    - `senderId` **(required)** — string
      - format: `uuid`
    - `body` **(required)** — string
    - `createdAt` **(required)** — string


## Notifications

> User notifications and preferences

### `GET /api/v1/notifications`

**Get notifications inbox**

Retrieve the in-app notifications inbox for the authenticated user.

- **Auth:** Bearer token required

**Responses**

- `200` — Notifications inbox
  - `data` **(required)** — object
    - `data` **(required)** — array<object>
      - `id` **(required)** — string
        - format: `uuid`
      - `userId` **(required)** — string
        - format: `uuid`
      - `channel` **(required)** — enum(`EMAIL` | `IN_APP` | `SMS` | `PUSH`)
        - enum: `EMAIL`, `IN_APP`, `SMS`, `PUSH`
      - `template` **(required)** — string
      - `payload` **(required)** — object
      - `status` **(required)** — enum(`PENDING` | `SENT` | `FAILED` | `SKIPPED`)
        - enum: `PENDING`, `SENT`, `FAILED`, `SKIPPED`
      - `errorMessage` **(required)** — string \| null
      - `createdAt` **(required)** — string
        - format: `date-time`
      - `sentAt` **(required)** — string \| null
        - format: `date-time`
      - `readAt` **(required)** — string \| null
        - format: `date-time`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.

### `PUT /api/v1/notifications/{id}/read`

**Mark notification as read**

Mark a specific in-app notification as read.

- **Auth:** Bearer token required

**Parameters**

- `id` (path, required) — string

**Responses**

- `200` — Marked as read
  - `data` **(required)** — object
    - `success` **(required)** — boolean
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.

### `GET /api/v1/notifications/preferences`

**Get notification preferences**

Retrieve the current notification preferences for the authenticated user.

- **Auth:** Bearer token required

**Responses**

- `200` — Preferences
  - `data` **(required)** — object
    - `userId` **(required)** — string
      - format: `uuid`
    - `emailEnabled` **(required)** — boolean
    - `inAppEnabled` **(required)** — boolean
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.

### `PUT /api/v1/notifications/preferences`

**Update notification preferences**

Update the notification preferences for the authenticated user.

- **Auth:** Bearer token required

**Request body**

`application/json`

- `emailEnabled` **(required)** — boolean
- `inAppEnabled` **(required)** — boolean

**Responses**

- `200` — Preferences updated
  - `data` **(required)** — object
    - `success` **(required)** — boolean
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.


## Referrals

> Referral program endpoints

### `GET /api/v1/referrals/code`

**Get my referral code**

Retrieve the unique referral code for the authenticated user.

- **Auth:** Bearer token required

**Responses**

- `200` — Referral code

**🔑 Authentication Required** (Any Role)
  - `code` **(required)** — string

### `GET /api/v1/referrals`

**List my referrals**

List all referrals made by the authenticated user.

- **Auth:** Bearer token required

**Responses**

- `200` — Referrals list

**🔑 Authentication Required** (Any Role)
  - `id` **(required)** — string
  - `referredId` **(required)** — string
  - `status` **(required)** — enum(`PENDING` | `QUALIFIED` | `REWARDED`)
    - enum: `PENDING`, `QUALIFIED`, `REWARDED`
  - `rewardMinor` — string \| null
  - `createdAt` **(required)** — string
  - `qualifiedAt` — string \| null


## Ratings

> User ratings and reviews

### `POST /api/v1/ratings`

**Submit a rating**

Submit a new rating for a user (tenant, landlord, or property admin).

- **Auth:** Bearer token required

**Request body**

`application/json`

- `targetId` **(required)** — string
- `targetRole` **(required)** — enum(`TENANT` | `LANDLORD` | `PROPERTY_ADMIN`)
  - enum: `TENANT`, `LANDLORD`, `PROPERTY_ADMIN`
- `score` **(required)** — integer
  - range: 1 … 5
- `propertyId` — string
- `leaseId` — string
- `comment` — string

**Responses**

- `201` — Rating submitted

### `GET /api/v1/ratings/aggregates/{targetId}/{role}`

**Get rating aggregate for user**

Fetch the aggregated rating (average score and total count) for a given user and role.

- **Auth:** Bearer token required

**Parameters**

- `targetId` (path, required) — string
- `role` (path, required) — enum(`TENANT` | `LANDLORD` | `PROPERTY_ADMIN`)

**Responses**

- `200` — Aggregate
  - `targetId` **(required)** — string
  - `targetRole` **(required)** — string
  - `averageScore` **(required)** — number
  - `count` **(required)** — number
  - `updatedAt` **(required)** — string


## Settings (Admin)

> Platform settings management

### `GET /api/v1/admin/settings`

**List platform settings**

List all platform settings and their current values. Accessible only to Platform Admins.

- **Auth:** Bearer token required

**Responses**

- `200` — List of settings
  - `data` **(required)** — object
    - `data` **(required)** — array<object>
      - `key` **(required)** — string
      - `value` **(required)** — string
      - `version` **(required)** — integer
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.

### `PUT /api/v1/admin/settings/{key}`

**Update platform setting**

Update a specific platform setting and log the reason. Accessible only to Platform Admins.

`🛡️ Requires Role:` Platform Admin

- **Auth:** Bearer token required

**Parameters**

- `key` (path, required) — enum(`fee.platform_commission_bps` | `fee.platform_commission_renewal_bps` | `fee.tenant_service_fee_minor` | `fee.card_processor_bps` | `fee.tenant_platform_fee_bps` | `fee.tenant_platform_fee_renewal_bps` | `fee.paystack_fee_bps` | `payout.escrow_hold_days` | `payout.arrival_business_days` | `deposit.caution_percentage_bps` | `deposit.property_deposit_minor` | `deposit.dispute_window_days` | `invitation.expiry_hours` | `invitation.require_mfa` | `rent.reminder_lead_days` | `rent.escalation_trigger_limit` | `rent.grace_period_days` | `installment.min_installments` | `installment.max_installments` | `installment.min_first_payment_bps` | `installment.enabled_from_lease_year` | `referral.reward_amount_minor` | `referral.qualifying_event` | `referral.enabled` | `notification.enabled_channels` | `notification.sms_escalation_enabled` | `savings_plan.enabled` | `lease.term_months` | `lease.notice_period_days` | `kyc.provider`)

**Request body**

`application/json`

- `value` **(required)** — string
  - The new JSON-serialized value for the setting. For money, provide a string representing integer minor units (e.g., "50000" for 500 NGN). For percentages, use a decimal string (e.g., "0.05" for 5%). For boolean toggles, use "true" or "false".
- `changeReason` **(required)** — string
  - Reason for the change. This is critical as it will be immutably saved in the global audit log.

**Responses**

- `200` — Setting updated successfully
  - `data` **(required)** — object
    - `success` **(required)** — boolean
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.


## Audit Logs (Admin)

> Global platform audit logs

### `GET /api/v1/admin/audit-logs`

**Global Audit Logs**

View the global audit trail of platform events. Accessible only to Platform Admins.

`🛡️ Requires Role:` Platform Admin

- **Auth:** Bearer token required

**Parameters**

- `action` (query) — string
- `limit` (query) — integer
- `offset` (query) — integer

**Responses**

- `200` — Audit logs
  - `data` **(required)** — object
    - `data` **(required)** — array<object>
      - `id` **(required)** — string
        - format: `uuid`
      - `actorId` **(required)** — string \| null
        - format: `uuid`
      - `entity` **(required)** — string
      - `entityId` **(required)** — string
      - `action` **(required)** — string
      - `previousState` **(required)** — object \| null
      - `newState` **(required)** — object \| null
      - `reason` **(required)** — string \| null
      - `createdAt` **(required)** — string
        - format: `date-time`
  - `requestId` **(required)** — string
    - Correlates this response with the server logs.


## Errors

> The shared failure envelope.

### `GET /api/v1/does-not-exist`

**Unmatched route**

Not a real endpoint. It documents the shape of the 404 every unmatched path returns, and the requested path is deliberately not reflected back in the body.

- **Auth:** Public

**Responses**

- `404` — No route matched the request.
  - `error` **(required)** — object
    - `code` **(required)** — enum(`VALIDATION_ERROR` | `UNAUTHENTICATED` | `FORBIDDEN` | `NOT_FOUND` | `CONFLICT` | `GONE` | `UNPROCESSABLE` | `RATE_LIMITED` | `INTERNAL_ERROR` | `NOT_IMPLEMENTED` | `SERVICE_UNAVAILABLE` | `FEATURE_NOT_ENABLED` | `CAUTION_DEPOSIT_POLICY_UNCONFIGURED` | `SETTING_NOT_CONFIGURED` | `SETTING_VALUE_INVALID`)
      - Machine-readable. Clients branch on this, never on `message`.
      - enum: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `UNPROCESSABLE`, `RATE_LIMITED`, `INTERNAL_ERROR`, `NOT_IMPLEMENTED`, `SERVICE_UNAVAILABLE`, `FEATURE_NOT_ENABLED`, `CAUTION_DEPOSIT_POLICY_UNCONFIGURED`, `SETTING_NOT_CONFIGURED`, `SETTING_VALUE_INVALID`
    - `message` **(required)** — string
      - Human-readable. May be reworded; do not branch on it.
    - `details` **(required)** — array<object>
      - `field` **(required)** — string
        - The offending input, prefixed with its location — `body.email`, `query.page`.
      - `reason` **(required)** — string
        - Why the value was rejected, in a form safe to show a caller.
  - `requestId` **(required)** — string
    - Correlates this response with the server logs. Quote it in a support report.


---

_Generated 2026-10-04 · OpenAPI 3.0.3 · 24 groups._