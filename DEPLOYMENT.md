# Civil Rights Hub Deployment

## Production targets

- Application: Vercel
- Primary domain: `https://civilrightshub.org`
- Secondary domain: `https://civilrights.wtpnews.org`
- Supabase production project: `vrdnrbjnitptxrexdlao`

## Frontend deployment

`main` is the production branch. Vercel builds the Vite application from GitHub using:

```bash
npm install
npm run build
```

The build includes integrity checks. A failed integrity check is a deployment blocker and should be fixed rather than bypassed.

## Database deployment

Production database migrations are handled by `.github/workflows/supabase-migrate-now.yml`. The workflow is pinned to project `vrdnrbjnitptxrexdlao` and requires the repository secrets `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD`.

Before applying SQL, the workflow links the expected project, compares local and remote migration history, enforces the reviewed allowlist, performs a dry run, applies only reviewed pending migrations, runs rollback-only provenance/security smoke tests, and captures advisor output.

Do not manually replay historical bulk seed migrations merely because an old file exists in Git. Current public data must satisfy the provenance gate.

## Verification

After a production change:

1. Confirm the Vercel deployment is `READY` and aliased to the production domains.
2. Confirm crawler-visible metadata and brand assets return the expected content types.
3. For database changes, confirm migration parity, run the smoke suites, and review Supabase security/performance advisors.
4. For public factual data, confirm the record remains hidden until the applicable reviewed provenance requirements are satisfied.
