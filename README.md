# VEMRA_FRONTEND
Vemra is a SaaS platform connecting landlords and tenants for rental property management, listings, and secure custodial rent payments.

## API configuration

The frontend now uses the backend API for authentication and tenant payment
mutations. Configure the API origin before running the app:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_API_PREFIX=/api/v1
NEXT_PUBLIC_API_WITH_CREDENTIALS=true
```

The backend authenticates each request with the caller's Supabase access token,
which [`src/lib/api/server.ts`](src/lib/api/server.ts) forwards as
`Authorization: Bearer <token>` (the `bearerAuth` scheme in the backend OpenAPI
spec). Endpoint paths are centralized in
[`src/lib/api/endpoints.ts`](src/lib/api/endpoints.ts).

## Supabase auth configuration

Authentication is handled by Supabase. Set the project URL and publishable key
(or the legacy anon key) in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
# Legacy fallback:
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

In the Supabase dashboard, add the site's auth redirect URLs (for example
`http://localhost:3000/auth/callback`). `src/proxy.ts` refreshes the session and
guards `/tenant` and `/landlord`; when Supabase is not configured it refuses to
serve those routes in production rather than failing open.

The Vemra backend trusts Supabase-issued access tokens and has no login of its
own: `GET /api/v1/me` returns the caller's profile and onboarding state once the
Supabase session is present. Set `NEXT_PUBLIC_API_BASE_URL` to the API origin
(the client appends `NEXT_PUBLIC_API_PREFIX`, default `/api/v1`).
