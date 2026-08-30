# Production Operations Runbook

This runbook defines the normal production workflow for Civil Rights Hub.

## Production identifiers

Repository: `patriotnewsactivism/civil-rights-hub`

Frontend: `https://civilrightshub.org`

Canonical Netlify team: `WTPNews` (`don-hpu0r1e`)

Canonical Netlify project: `civilrightshub-wtpnews`

Canonical Netlify site ID: `75fe4acb-fbc2-4bf2-bc0c-51156d9ad24c`

Expected Supabase project ref: `vrdnrbjnitptxrexdlao`

Do not perform a production database/Edge Function operation unless the project ref is positively verified.

## Architecture ownership

### Netlify

Owns the public React/Vite frontend deployment.

A successful Netlify deployment does **not** imply that Supabase migrations or Edge Functions were deployed.

Vercel is not an approved deployment/recovery path for this repository. Do not re-enable or relink historical Vercel projects. See `docs/HOSTING.md`.

### Supabase

Owns PostgreSQL, Auth, Storage, Realtime, and Edge Functions.

Database and Edge Function changes have separate deployment lifecycles from Netlify.

### Cloudflare

May provide DNS, CDN/proxy, WAF, Turnstile, or other edge services. Cloudflare is not a substitute for the canonical Netlify application deployment unless the hosting policy is explicitly changed.

### Google Cloud Run

Reserved for long-running workers, APIs, scheduled workloads, or other services that should not run in the browser or Supabase Edge Functions.

### GitHub Actions

Repository workflows provide guarded production checks/deployments. Current workflows include migration, community production audit/recovery checks, selected Edge Function deployment, and the frontend hosting-policy guard.

Inspect `.github/workflows/` rather than assuming a workflow exists for a particular change.

## Required secrets

Production workflows may use repository secrets such as:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`

Never print or copy their values into logs, issues, documentation, or chat.

Netlify browser configuration belongs in the Netlify production environment, not in GitHub source files.

## Frontend deployment procedure

1. Ensure `npm run hosting:check` passes.
2. Ensure `npm run build` succeeds.
3. Deploy the expected `main` commit to Netlify site `75fe4acb-fbc2-4bf2-bc0c-51156d9ad24c`.
4. Confirm required production browser environment variables are present.
5. Confirm `civilrightshub.org` is attached to the Netlify production site.
6. Verify `/`, `/community`, `/donate`, and a deep SPA route return HTTP 200 application HTML.
7. Verify Sentry initializes when `VITE_SENTRY_DSN` is configured.
8. Separately verify required Supabase migrations/functions.

## Migration procedure

1. Create a new timestamped forward migration.
2. Review for destructive behavior, RLS impact, grants, functions, triggers, Storage, and data integrity.
3. Ensure the target project is `vrdnrbjnitptxrexdlao`.
4. Compare remote/local migration history.
5. Dry-run or inspect the pending plan where supported.
6. Apply.
7. Run rollback-only provenance/security/domain smoke tests.
8. Recheck migration parity.
9. Run Supabase security/performance advisors when relevant.
10. Verify the user-visible feature separately.

Do not call a migration complete at step 4 or 5.

## Applied migration rule

Once production records a migration version, do not rewrite that migration to alter production behavior. Add a new forward migration.

If an attempted migration failed transactionally and was never recorded, it may be corrected before application, but verify the remote ledger first.

## Migration drift

Remote-only historical migrations are not automatically errors. Some may represent direct historical production changes or legacy data that should not be replayed.

Reconcile history carefully. Do not mark migrations reverted or replay bulk seed files just to make lists visually match.

## Database cleanup

For uncertain/legacy public data:

- snapshot/quarantine before deletion when practical;
- document why records are being withheld;
- preserve enough information to audit what happened;
- do not republish quarantine rows without fresh verification.

## Edge Functions

Frontend merge/deploy does not deploy existing Supabase Edge Functions.

For each changed function:

1. confirm the correct project ref;
2. deploy explicitly through the available workflow/CLI;
3. verify deployment result;
4. test authorization/fail-closed behavior.

High-stakes AI/legal functions should remain fail-closed if they cannot ground output in verified sources.

## Storage

For a Storage-backed feature verify all of:

- bucket exists;
- bucket visibility matches product intent;
- allowed MIME types/size limits are appropriate;
- `storage.objects` SELECT/INSERT/UPDATE/DELETE policies exist as needed;
- authenticated uploads are restricted to owner-controlled paths.

A bucket with no object policies can make a feature look implemented while every client upload fails.

## Community recovery

Run the community production audit before reopening held social surfaces. See `docs/COMMUNITY_INTEGRITY.md`.

Do not use existing row counts as evidence that the community is healthy; legacy seed data can inflate counts.

## Verification states for releases

Use precise language:

- **Committed** — code exists on a branch.
- **Merged** — code is on `main`.
- **Frontend deployed** — Netlify deployed the expected commit.
- **Migration applied** — Supabase production ledger confirms it.
- **Edge Function deployed** — Supabase function deployment confirmed.
- **Validated** — relevant smoke tests/live behavior passed.

Do not claim “live” if only some required layers reached production.

## Rollback and forward fix

For frontend regressions, revert or redeploy the appropriate Git commit through Netlify.

For database migrations, prefer a forward corrective migration. Do not rewrite migration history after application.

For contaminated data, preserve quarantine/audit evidence.

## Incident checklist

When production breaks:

1. identify whether the failure is frontend host, DNS/CDN, database, RLS/grant, Storage, Edge Function, environment, or external provider;
2. inspect live logs/monitoring and the deployed commit;
3. verify production project identity;
4. reproduce with the least-privileged relevant role;
5. fix the root cause;
6. run the relevant smoke checks;
7. verify production, not just CI;
8. document any lasting operational rule learned from the incident.

## Observability

Use Sentry or the approved monitoring stack when configured, but keep telemetry privacy-safe. See `SECURITY.md`.

Monitoring should make it possible to distinguish client crashes, failed Supabase queries, Storage errors, Edge Function failures, and release-specific regressions without logging sensitive content.

## Routine maintenance

Periodically:

- verify payment destinations and branding checks;
- verify the Netlify hosting contract and production domain;
- check migration parity;
- run security/performance advisors;
- inspect stale provenance;
- verify official source links;
- review dependency updates;
- review unresolved production errors;
- review old root-level reports/docs and mark superseded assumptions clearly.