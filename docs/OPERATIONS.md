# Production Operations Runbook

This runbook defines the normal production workflow for Civil Rights Hub.

## Production identifiers

Repository: `patriotnewsactivism/civil-rights-hub`

Frontend: `https://civilrightshub.org`

Expected Supabase project ref: `vrdnrbjnitptxrexdlao`

Do not perform a production database/Edge Function operation unless the project ref is positively verified.

## Architecture ownership

### Vercel

Owns the public React/Vite frontend deployment.

A successful Vercel deployment does **not** imply that Supabase migrations or Edge Functions were deployed.

### Supabase

Owns PostgreSQL, Auth, Storage, Realtime, and Edge Functions.

Database and Edge Function changes have separate deployment lifecycles from Vercel.

### GitHub Actions

Repository workflows provide guarded production checks/deployments. Current workflows include migration, community production audit/recovery checks, and selected Edge Function deployment.

Inspect `.github/workflows/` rather than assuming a workflow exists for a particular change.

## Required secrets

Production workflows may use repository secrets such as:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`

Never print or copy their values into logs, issues, documentation, or chat.

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
- **Frontend deployed** — Vercel deployed the expected commit.
- **Migration applied** — Supabase production ledger confirms it.
- **Edge Function deployed** — Supabase function deployment confirmed.
- **Validated** — relevant smoke tests/live behavior passed.

Do not claim “live” if only some required layers reached production.

## Rollback and forward fix

For frontend regressions, revert/roll forward using Git/Vercel as appropriate.

For database migrations, prefer a forward corrective migration. Do not rewrite migration history after application.

For contaminated data, preserve quarantine/audit evidence.

## Incident checklist

When production breaks:

1. identify whether the failure is frontend, database, RLS/grant, Storage, Edge Function, environment, or external provider;
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
- check migration parity;
- run security/performance advisors;
- inspect stale provenance;
- verify official source links;
- review dependency updates;
- review unresolved production errors;
- review old root-level reports/docs and mark superseded assumptions clearly.
