# CLAUDE.md

Claude Code and any other coding agent working in this repository must read and follow [`AGENTS.md`](AGENTS.md) first.

`AGENTS.md` is the authoritative agent instruction set. Do not treat this file, old generated plans, seed comments, or historical audit documents as permission to bypass the data-integrity, security, migration, community, or hosting rules defined there.

Also read when relevant:

- [`SECURITY.md`](SECURITY.md)
- [`CONTRIBUTING.md`](CONTRIBUTING.md)
- [`docs/DATA_INTEGRITY.md`](docs/DATA_INTEGRITY.md)
- [`docs/OPERATIONS.md`](docs/OPERATIONS.md)
- [`docs/COMMUNITY_INTEGRITY.md`](docs/COMMUNITY_INTEGRITY.md)
- [`docs/HOSTING.md`](docs/HOSTING.md)

## Stable commands

```bash
npm install
npm run dev
npm run lint
npm run test -- --run
npm run build
```

Verified seeding:

```bash
npm run seed:verified:dry-run -- path/to/verified-seed.json
npm run seed:verified -- path/to/verified-seed.json
```

Never use legacy random/bulk seed paths to populate production.

## Stable architecture

- React 18 + TypeScript + Vite
- React Router
- Tailwind + Radix/shadcn-style components
- TanStack Query
- Supabase PostgreSQL/Auth/Storage/Realtime/Edge Functions
- **Netlify frontend deployment**
- Cloudflare may provide DNS/CDN/WAF/edge services
- Google Cloud Run is reserved for long-running workers/APIs when needed

Expected production Supabase project ref: `vrdnrbjnitptxrexdlao`.
Expected Netlify team: `WTPNews` (`don-hpu0r1e`).
Expected Netlify project: `civilrightshub-wtpnews`.
Expected Netlify site ID: `75fe4acb-fbc2-4bf2-bc0c-51156d9ad24c`.

Verify the Supabase ref before production database or Edge Function operations.

### Hosting invariant

Vercel is not an approved deployment target for this repository. Do not add or restore Vercel deployment workflows, Vercel CLI/API deployment commands, Vercel project IDs, or Vercel-specific runtime dependencies. Historical Vercel deployments are not a recovery path.

`netlify.toml` and `docs/HOSTING.md` define the canonical frontend deployment contract. `npm run hosting:check` must pass before release.

## Supabase browser client

`src/integrations/supabase/client.ts` expects:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

`VITE_*` values are browser-visible and must not contain privileged secrets.

Generated database types live in `src/integrations/supabase/types.ts`. Regenerate/review them after schema changes when appropriate.

## Critical cautions

- Do not restore synthetic fallback data for high-stakes public datasets.
- Do not publish legal/factual claims merely because an old seed or document calls them real/verified.
- Do not manufacture community users, posts, threads, events, engagement, or counts.
- Do not rewrite migrations already applied to production; use forward fixes.
- Do not assume a frontend deploy also deployed Supabase migrations/functions.
- Do not weaken RLS/security/integrity checks to make CI green.
- Do not switch the production frontend away from Netlify without an explicit new user instruction.

For all other operational and coding rules, defer to `AGENTS.md`.