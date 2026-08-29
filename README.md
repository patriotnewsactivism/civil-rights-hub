# Civil Rights Hub

Civil Rights Hub is a public-interest web application maintained by We The People News. It combines rights-reference material, incident documentation, public-records workflows, accountability resources, emergency tools, and a community platform.

Production: https://civilrightshub.org

## Operating principle

**Truth before volume. Fail closed before publishing unsupported claims.**

This repository previously accumulated synthetic, bulk-generated, stale, and weakly sourced records. Current code and migrations intentionally treat legacy `verified` flags, seed comments, generated copy, and old documentation as insufficient evidence by themselves.

Public factual data should be traceable to durable evidence appropriate to the claim. If that evidence is missing, the record stays unpublished, unverified, quarantined, or clearly labeled as user-generated content.

## Documentation map

The following files define the current operating model:

- [`AGENTS.md`](AGENTS.md) — mandatory instructions for coding agents and autonomous tools.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution and review requirements.
- [`SECURITY.md`](SECURITY.md) — security, secrets, RLS, privileged-function, and incident-response rules.
- [`docs/DATA_INTEGRITY.md`](docs/DATA_INTEGRITY.md) — provenance, verification, seeding, and publication policy.
- [`docs/OPERATIONS.md`](docs/OPERATIONS.md) — production architecture, migrations, deployment, rollback, and verification procedures.
- [`docs/COMMUNITY_INTEGRITY.md`](docs/COMMUNITY_INTEGRITY.md) — social/community data rules and recovery requirements.
- [`docs/HOSTING.md`](docs/HOSTING.md) — authoritative frontend hosting policy.

If older planning or audit documents conflict with these files, the hierarchy is:

1. verified live production behavior and current database schema;
2. current migrations, tests, and deployed application code;
3. the operating documents listed above;
4. older audit, seeding, planning, generated, or historical documentation.

## Production architecture

- React 18 + TypeScript + Vite
- React Router
- Tailwind CSS + Radix/shadcn-style components
- TanStack Query
- Supabase PostgreSQL, Auth, Storage, Realtime, and Edge Functions
- Netlify frontend deployment
- Cloudflare permitted for DNS/CDN/WAF/edge services
- Google Cloud Run reserved for long-running workers/APIs when needed

Canonical Netlify project: `civilrightshub-org` (`169435f2-2b9c-46ad-b4f3-3f7753178451`).

Expected production Supabase project ref: `vrdnrbjnitptxrexdlao`.

Vercel is not an approved deployment target for this repository. Historical Vercel deployments are not a recovery path. See [`docs/HOSTING.md`](docs/HOSTING.md).

Any production database workflow must positively verify the Supabase project before writing. Never infer the target project from a local default, cached CLI link, copied credential, or environment from another repository.

## Current integrity model

Covered public datasets use a provenance gate. Depending on entity type, publication requires current, reviewed evidence such as official government records, court records, bar directories, or organization-controlled primary sources. Field-level claims may require explicit source support.

Legacy data that cannot meet the current standard is intentionally withheld. User submissions are intake/user-generated records and are not automatically converted into verified factual findings.

### Social/community content

Community activity must represent genuine account activity unless the content is explicitly identified as first-party editorial/system material.

Do **not** seed:

- fake users or usernames;
- fake posts, comments, forum discussions, stories, RSVPs, followers, reactions, views, likes, shares, or engagement counters;
- events without a durable organizer/venue source;
- synthetic first-person experiences;
- posts attributed to a real account merely to make the platform appear active.

Source-backed educational/editorial material may be published only through a clearly identified official/system identity and must not simulate organic community participation or fabricated engagement.

See [`docs/COMMUNITY_INTEGRITY.md`](docs/COMMUNITY_INTEGRITY.md).

## Local development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run hosting:check
npm run lint
npm run test -- --run
npm run build
```

`npm run build` also runs the repository's hosting, payment-link, and branding integrity checks through `prebuild`.

## Environment

The browser client requires:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Use `.env.example` as the template. Never commit production secrets. Browser variables prefixed with `VITE_` are public by design and must never contain service-role keys, database passwords, provider secrets, or management tokens.

## Verified seeding

The only approved general-purpose data seeding path is the provenance-aware seeder:

```bash
npm run seed:verified:dry-run -- path/to/verified-seed.json
npm run seed:verified -- path/to/verified-seed.json
```

Before write mode:

1. verify the production project ref;
2. verify migration parity and the provenance gate;
3. review every source and supported field;
4. dry-run the payload;
5. write;
6. verify the resulting public visibility and provenance rows.

Historical random/bulk seed scripts are evidence of past state, not approved production tooling.

## Database migrations

Migration files live in `supabase/migrations/` and are append-only once applied to production. Never edit or reuse an already-applied migration version to change production behavior. Use a forward migration.

Production migration workflows must compare local/remote history before applying SQL and must run the relevant smoke tests afterward.

See [`docs/OPERATIONS.md`](docs/OPERATIONS.md).

## Security

Supabase RLS is a primary security boundary, but grants, Storage policies, RPC execution privileges, Edge Function authorization, and service-role usage are separate controls and must also be reviewed.

Do not expose service-role credentials to the browser. Do not solve an RLS error by broadening a policy to `USING (true)` or granting blanket write access unless that behavior is explicitly required and reviewed.

See [`SECURITY.md`](SECURITY.md).

## Public source and licensing

The repository is publicly viewable. There is currently no `LICENSE` file. Public visibility alone does not grant general permission to copy, modify, redistribute, or relicense the code.

## Corrections and stale documents

Source-backed corrections and reproducible bug reports are welcome. Older files such as database audits, historical seeding reports, generated feature plans, and prior architecture notes may describe superseded behavior. Do not treat a document's confident wording, a migration comment such as `REAL DATA`, or an old row count as proof of current production truth.