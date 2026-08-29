# Civil Rights Hub Hosting Policy

This file is authoritative for frontend hosting decisions.

## Canonical production architecture

- Frontend hosting: **Netlify**
- Canonical Netlify project: `civilrightshub-org`
- Canonical Netlify site ID: `169435f2-2b9c-46ad-b4f3-3f7753178451`
- Primary public domain: `civilrightshub.org`
- Secondary public domain: `civilrights.wtpnews.org`
- Backend/data/auth/storage/realtime/Edge Functions: **Supabase**
- Production Supabase project ref: `vrdnrbjnitptxrexdlao`

## Prohibited frontend host

Vercel is **not an approved deployment target for this repository**. Do not create, recover, relink, promote, or deploy Civil Rights Hub through Vercel. Do not add Vercel deployment workflows, Vercel project IDs, Vercel CLI deployment commands, Vercel API calls, or Vercel-specific runtime dependencies.

Historical Vercel deployments may continue to exist in provider history, but they are not production and must not be treated as a recovery path.

## Other allowed infrastructure

Cloudflare may be used for DNS, CDN/proxy, WAF, Turnstile, or other edge services.

Google Cloud Run may be added for long-running workers, APIs, scheduled workloads, or services that are not a good fit for Supabase Edge Functions. It is not the default frontend host for the Vite application.

## Netlify build contract

The frontend is a Vite SPA. Netlify must build with:

- command: `npm run build`
- publish directory: `dist`
- Node.js: 22
- SPA fallback: all application routes rewrite to `/index.html` with HTTP 200

The repository-level `netlify.toml` is the source of truth for these settings.

## Required browser environment

Netlify production must provide:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_APP_URL=https://civilrightshub.org`

Observability should additionally provide:

- `VITE_SENTRY_DSN`
- `VITE_SENTRY_ENVIRONMENT=production`
- `VITE_SENTRY_RELEASE` when release tagging is available
- `VITE_SENTRY_TRACES_SAMPLE_RATE` as reviewed

Never put service-role keys, database passwords, management tokens, Stripe secrets, or other privileged credentials into `VITE_*` variables.

## Deployment invariants

Before declaring a frontend release live:

1. verify the Netlify deployment was built from the expected `main` commit;
2. verify `civilrightshub.org` resolves to the Netlify production site;
3. verify `/`, `/community`, `/donate`, and at least one deep SPA route return application HTML rather than a provider error;
4. verify Supabase client configuration is present in the built application;
5. verify Sentry initializes when its DSN is configured;
6. separately verify any required Supabase migrations/Edge Functions because frontend deployment does not deploy them.

## Agent rule

Any autonomous coding or repository-completion agent must preserve this hosting policy. A proposed change that reintroduces Vercel as an active deployment/runtime dependency is a regression and must not be merged.
