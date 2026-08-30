# Security Policy

Civil Rights Hub handles public-interest, legal-adjacent, account, messaging, location, and incident data. Security changes must preserve confidentiality, integrity, and truthful publication behavior.

## Production systems

- Frontend: Netlify team `WTPNews` (`don-hpu0r1e`), project `civilrightshub-wtpnews`, site ID `75fe4acb-fbc2-4bf2-bc0c-51156d9ad24c`
- Database/Auth/Storage/Realtime/Edge Functions: Supabase
- Expected production Supabase project ref: `vrdnrbjnitptxrexdlao`
- Cloudflare may provide DNS/CDN/WAF/edge protection
- Google Cloud Run may host future server/worker workloads

Vercel is not an approved production or recovery target for this repository.

Before any privileged production action, verify the target project/environment explicitly.

## Secrets

Never commit or expose:

- Supabase service-role keys;
- Supabase database passwords or management access tokens;
- Stripe secret/webhook keys;
- third-party provider/API secrets;
- private signing keys;
- session tokens or authorization headers.

`VITE_*` variables are browser-visible. They may contain public browser configuration only.

If a privileged secret is exposed in chat, a commit, logs, screenshots, or a public artifact, treat it as compromised and rotate it. Deleting the visible copy is not enough.

## Supabase security model

RLS is necessary but not sufficient. Review all of the following:

1. table RLS state and policies;
2. SQL grants to `anon`, `authenticated`, `PUBLIC`, and service roles;
3. RPC/function `EXECUTE` privileges;
4. `SECURITY DEFINER` ownership, search path, and caller access;
5. Storage bucket visibility and `storage.objects` policies;
6. Edge Function authentication/authorization;
7. service-role code paths that bypass RLS.

Do not fix authorization errors by granting broad browser access without a documented product requirement.

### User-owned content

User-owned writes should normally verify ownership through `auth.uid()` and constrain inserts/updates/deletes accordingly.

### Storage

A public bucket may permit public reads while still requiring authenticated, owner-scoped writes. Upload paths should be namespaced by user ID or another server-enforced ownership boundary.

Do not assume that creating a bucket creates its policies.

## Privileged functions

Prefer `SECURITY INVOKER` unless elevated privileges are genuinely required.

For `SECURITY DEFINER` functions:

- set a controlled `search_path`;
- schema-qualify sensitive object references;
- restrict `EXECUTE` to the minimum roles;
- keep recursion-safe RLS helpers isolated from general browser RPC exposure;
- test behavior as anon/authenticated/service roles where applicable.

## Legal, incident, and messaging privacy

Do not log or transmit more sensitive information than is required for operation.

Avoid putting these into telemetry or public logs:

- private message bodies;
- legal intake narratives or uploaded documents;
- exact sensitive location/history unless essential;
- access tokens, cookies, authorization headers;
- database credentials;
- unredacted incident evidence;
- unnecessary email/phone/address information.

## Observability

Sentry or another approved monitoring provider should be configured with privacy-aware defaults.

When instrumenting:

- identify environment/release;
- scrub secrets and sensitive request fields;
- capture exceptions at React/application boundaries and backend operations;
- do not enable broad session replay over legal/intake/private-message surfaces without explicit review;
- use telemetry to diagnose product failures, not to collect unrelated personal data.

The Netlify production environment may contain the browser-safe Sentry DSN. Do not place Sentry auth tokens or other privileged credentials in `VITE_*` variables.

## Dependency and supply-chain changes

New dependencies should have a clear need and should not duplicate existing capabilities unnecessarily. Avoid adding abandoned packages for critical auth/security behavior. Lockfile changes should be reviewed.

Vercel-specific runtime/deployment dependencies are prohibited unless the hosting policy is explicitly changed by the user.

## Security-sensitive change checklist

Before merging a security/schema change:

- [ ] correct Supabase project verified;
- [ ] migration is forward-only and reviewed;
- [ ] RLS/grants/functions/Storage considered separately;
- [ ] browser cannot access service credentials;
- [ ] automated tests/smoke tests pass;
- [ ] Supabase security advisor checked when available;
- [ ] production deployment/migration status distinguished from merged code;
- [ ] rollback/forward-fix path understood.

## Incident response

For a suspected security incident:

1. stop ongoing exposure;
2. rotate compromised credentials/tokens;
3. preserve logs/evidence needed to understand scope;
4. identify affected systems/data/users;
5. patch the root cause with a forward migration/code fix;
6. verify production state after deployment;
7. document what happened and any follow-up action.

Do not conceal a production security failure by merely suppressing the error or telemetry.

## Reporting

Security reports should include reproducible steps, affected URL/component, expected vs. actual behavior, and whether any real data was accessed. Do not include live secrets in an issue or public report.