# Deployment Notes

NavidMediCare uses two repositories for deployment:

- Client: Next.js application
- Server: Express API application

## Client Environment

Set `NEXT_PUBLIC_API_URL` to the deployed server URL.

```bash
NEXT_PUBLIC_API_URL=https://your-server-live-url.com
```

## Server Environment

Set `CORS_ORIGIN` to the deployed client URL.

```bash
CORS_ORIGIN=https://your-client-live-site-url.com
```

## GitHub OAuth

Keep GitHub OAuth callback URLs aligned with the client domain in
`BETTER_AUTH_URL`.

Local development callback:

```bash
http://localhost:3000/api/auth/callback/github
```

Production callback:

```bash
https://doctor-appointment-manager-sable.vercel.app/api/auth/callback/github
```
