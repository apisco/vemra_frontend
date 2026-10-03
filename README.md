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

The API must allow credentialed browser requests from the frontend origin and
must set the `vemra_session` httpOnly cookie. Endpoint paths are centralized in
[`src/lib/api/endpoints.ts`](src/lib/api/endpoints.ts) until the backend
contract is finalized.
