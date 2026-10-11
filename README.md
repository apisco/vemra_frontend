# VEMRA_FRONTEND

Vemra is a SaaS platform connecting landlords and tenants for rental property
management, listings, and secure custodial rent payments.

This app handles the **TENANT** and **LANDLORD** roles only. Vemra itself
manages everything between landlords and tenants; there is no agent role, and
Property Admin / Super Admin / Support surfaces live elsewhere.

## API reference

The backend OpenAPI spec is the source of truth for every endpoint, request body
and response shape:

- Interactive docs: <https://vemra-backend.onrender.com/docs/>
- OpenAPI JSON: <https://vemra-backend.onrender.com/docs/openapi.json>
- Checked-in snapshot: [`docs/openapi.json`](docs/openapi.json)

Refresh the snapshot and regenerate types with:

```bash
npm run fetch:api     # re-download docs/openapi.json
npm run generate:api  # regenerate src/types/api/generated.ts from the snapshot
```

Where the spec disagreed with the previous frontend code, the differences and
the fixes applied are recorded in
[`docs/api-mismatches.md`](docs/api-mismatches.md). Gaps the backend still needs
to close are listed in
[`docs/backend-requirements.md`](docs/backend-requirements.md).

## API configuration

```env
NEXT_PUBLIC_API_BASE_URL=https://vemra-backend.onrender.com
NEXT_PUBLIC_API_PREFIX=/api/v1
NEXT_PUBLIC_API_TIMEOUT_MS=30000
```

The backend authenticates every request with the caller's Supabase access token,
which [`src/lib/api/server.ts`](src/lib/api/server.ts) forwards as
`Authorization: Bearer <token>` (the `bearerAuth` scheme in the spec). Endpoint
paths are centralised in [`src/lib/api/endpoints.ts`](src/lib/api/endpoints.ts),
and every interpolated id is URL-encoded there.

Cookie-based API auth has been removed: there is no `withCredentials` option and
no `NEXT_PUBLIC_API_WITH_CREDENTIALS` variable. Bearer auth makes them
unnecessary, and sending credentials cross-origin widened the CORS and CSRF
surface for no benefit.

The default server-side GET timeout is 30s because the backend is hosted on
Render and cold-starts; timeouts surface a "Vemra is waking up" message rather
than a zeroed-out screen.

### Mutations go through server actions

Browser code cannot attach a Bearer token, so `src/lib/api/client.ts` exposes
`clientGet` only. Every mutation runs in a server action under
`src/lib/api/actions/`, returns `ActionResult<T>`, and only reports success
after the backend confirms it.

## Supabase auth configuration

Authentication is Supabase-only; the Vemra backend has no login of its own.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
# Legacy fallback:
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

In the Supabase dashboard, add the site's auth redirect URLs (for example
`http://localhost:3000/auth/callback`). [`src/proxy.ts`](src/proxy.ts) refreshes
the session and guards `/tenant`, `/landlord` and `/dashboard`; when Supabase is
not configured it refuses to serve those routes in production rather than
failing open.

### Roles are never read from client-writable metadata

`signUp({ data: { role } })` writes to `user_metadata`, which the user can
rewrite at will. It is treated as a **signup hint only**. All authorization and
routing is derived from the `roles` array on `GET /api/v1/me`:

- `requireRole(role)` in [`src/lib/api/resources/auth.ts`](src/lib/api/resources/auth.ts)
  guards the dashboard layouts and redirects to the user's own dashboard.
- After login the user lands on `/dashboard`, which resolves their real role
  server-side and redirects.
- Users holding both roles get an httpOnly `vemra_active_role` cookie, validated
  server-side against `/me` on every read, plus a switcher in the dashboard shell.

The backend must assign roles server-side and ignore `user_metadata.role` — see
item 1 of [`docs/backend-requirements.md`](docs/backend-requirements.md).

## Payments

Rent payments use Paystack's hosted checkout. No card data ever reaches Vemra's
servers or logs:

1. A server action calls `POST /api/v1/leases/{id}/pay` with an
   `Idempotency-Key` header (one UUID per attempt, reused on retry).
2. The backend returns a `checkoutUrl` plus the exact fee breakdown.
3. The client validates that URL against the provider hostname allowlist in
   [`src/lib/payments/provider.ts`](src/lib/payments/provider.ts) and redirects.
4. The callback page reads the authoritative status back from
   `GET /api/v1/payments`.

Payments are always tied to an explicitly selected lease — when a tenant has
more than one active lease the UI shows a picker and never guesses.

```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
```

## Captcha

Cloudflare Turnstile is wired into login, signup and forgot-password via
Supabase's `captchaToken` option. It is skipped entirely when the site key is
unset or `NODE_ENV === "development"`.

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

## Observability

Sentry is enabled only when a DSN is present. API `requestId` values are tagged
on captured errors. Tokens, card data, NINs and document URLs are never logged.

```env
NEXT_PUBLIC_SENTRY_DSN=
```

## Security headers

[`next.config.ts`](next.config.ts) sets CSP, HSTS, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy` (camera, microphone and geolocation off),
`X-Frame-Options: DENY` and `frame-ancestors 'none'` on every route. CSP origins
are derived from the Supabase, API, Sentry and image-host environment variables,
plus the fixed Paystack, Cloudinary and Turnstile origins.

## Scripts

```bash
npm run dev        # next dev
npm run build      # next build
npm run start      # next start
npm run lint       # eslint
npm run typecheck  # next typegen && tsc --noEmit
npm run test       # vitest run
npm run test:e2e   # playwright test
```

All packages live in `dependencies` — this project has no `devDependencies`
block, because the production deploy installs with `NODE_ENV=production` and
crashes if build tooling is pruned.

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local` and fill it in. It lists
every variable the app reads and contains no real values.
