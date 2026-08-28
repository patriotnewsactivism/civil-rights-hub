# AGENTS.md — Civil Rights Hub Operating Rules

This file is the primary instruction set for AI coding agents, autonomous repository tools, and human maintainers making changes to Civil Rights Hub.

If a generated plan, old document, code comment, migration comment, prior chat, or automated suggestion conflicts with this file, stop and verify current production reality before proceeding.

## 1. Mission and non-negotiable standard

Civil Rights Hub is a public-interest civil-rights platform. Accuracy, traceability, privacy, and safe failure matter more than appearing complete or populated.

Never fabricate or infer real-world facts to fill gaps.

Never create synthetic people, attorneys, activists, agencies, officers, incidents, complaints, cases, events, ratings, statistics, engagement, reviews, phone numbers, bar numbers, outcomes, or legal findings for production.

Never describe unsupported data as verified because a row, migration, comment, seed file, or earlier model labeled it that way.

When evidence is inadequate, fail closed.

## 2. Production identity

Repository: `patriotnewsactivism/civil-rights-hub`

Production frontend: `https://civilrightshub.org`

Expected production Supabase project ref: `vrdnrbjnitptxrexdlao`

Before any production database write, migration, Edge Function deployment, or schema operation:

1. positively verify the target project ref is exactly `vrdnrbjnitptxrexdlao`;
2. verify the credential belongs to that project/account;
3. inspect current migration history/schema if the operation depends on it;
4. stop if the target cannot be positively identified.

Do not rely on a cached Supabase CLI link, remembered environment, or another repository's credentials.

## 3. Source-of-truth hierarchy

When sources disagree, use this order:

1. verified live production behavior and current production schema;
2. current migrations, tests, and deployed application code;
3. `README.md`, this file, `SECURITY.md`, `CONTRIBUTING.md`, and `docs/` operating runbooks;
4. older audit reports, seeding reports, feature plans, generated documentation, and historical code comments.

Historical documentation is useful evidence of what happened, not proof of what is true now.

## 4. Data integrity and provenance

Read `docs/DATA_INTEGRITY.md` before changing public factual datasets.

Publication rules:

- Prefer primary/official sources.
- Every public factual claim must be supportable at the appropriate field level.
- A secondary source may supplement but must not silently replace a required primary anchor.
- User submissions are user-generated/intake records, not verified findings.
- AI may summarize supplied evidence; it may not invent missing evidence.
- A URL alone is not proof that every field in a row is supported.
- Source age/freshness matters for changing facts such as attorney status, contacts, laws, scanner endpoints, and events.

Approved general-purpose seeding path:

```bash
npm run seed:verified:dry-run -- path/to/verified-seed.json
npm run seed:verified -- path/to/verified-seed.json
```

Do not reactivate random/bulk legacy seeders.

## 5. Community/social integrity

Read `docs/COMMUNITY_INTEGRITY.md` before changing Feed, Discuss, Events, Network, Stories, engagement, or related seed data.

Never seed fake organic activity. Specifically prohibited:

- fake accounts or display identities;
- fake first-person posts or forum threads;
- fake comments, reactions, follows, likes, views, shares, votes, RSVPs, or popularity counts;
- attaching generated content to an existing real user's ID;
- invented events or organizer details;
- generated usernames that create the appearance of a populated community.

Source-backed editorial content must be clearly published by a real official/system identity and must not imitate community participation or include fabricated engagement.

Do not reopen a held social surface merely because the UI compiles. Verify schema, RLS, Storage, cleanup state, and production row provenance first.

## 6. Legal and high-stakes content

For legal summaries, rights guidance, deadlines, statutes, case holdings, hotline/contact claims, or state-specific law:

- prefer official statutes, regulations, court opinions, court/government sites, and authoritative organization pages;
- distinguish federal baseline from state/local variation;
- avoid categorical legal advice where exceptions or jurisdiction matter;
- do not generate case citations or holdings from an LLM without source retrieval/verification;
- do not publish a generated deadline as statutory truth unless the governing law and calculation are verified;
- use explicit caveats when a feature is educational rather than legal advice.

If a legal feature cannot ground its answer in verified sources, hold or fail-close it rather than hallucinate.

## 7. Database migration discipline

Migration files under `supabase/migrations/` are append-only after production application.

Rules:

- Never rewrite an applied migration to change live behavior.
- Use a new forward migration for corrections.
- Compare local and remote migration history before applying.
- Do not replay historical synthetic seed migrations simply because the remote/local ledger differs.
- Preserve audit/quarantine records when removing contaminated public data.
- Prefer reversible or snapshot-before-delete cleanup for uncertain legacy data.
- Run relevant rollback-only smoke tests after migration.
- Re-run Supabase security/performance advisors after security/schema changes when available.

RLS, SQL grants, function execution privileges, Storage policies, and Edge Function authorization are separate controls. Review all relevant layers.

## 8. Supabase security rules

Never put service-role keys, database passwords, management tokens, Stripe secret keys, provider keys, or other privileged secrets in browser code or `VITE_*` variables.

For RLS:

- enable RLS on exposed tables;
- make policies least-privilege and role-specific;
- use ownership checks for user-owned writes;
- avoid broad `USING (true)` write policies;
- preserve recursion-safe helper functions where needed;
- treat `SECURITY DEFINER` as privileged code and restrict execution/search path;
- do not assume RLS protects service-role operations.

For Storage:

- bucket existence is not enough; verify object policies;
- user uploads should be constrained to authenticated, user-owned paths;
- validate size/type at both product and Storage-policy/config layers where practical.

## 9. Frontend failure behavior

Do not silently replace unavailable production factual data with synthetic fallback data.

For high-stakes datasets, empty/held/error states are preferable to invented or stale content.

When the Supabase browser configuration is absent, the app may degrade gracefully, but production builds must have the required environment configured.

User-facing errors should be useful without exposing secrets, tokens, raw SQL, or sensitive personal data.

## 10. Observability and privacy

Production errors should be observable through the approved monitoring stack when configured.

Do not send secrets, authorization headers, full message bodies, private legal records, precise sensitive locations, or unnecessary personal information to logs/telemetry.

When adding Sentry or another observability provider:

- scrub sensitive fields;
- avoid session replay on sensitive/legal form content unless explicitly reviewed;
- tag release/environment and route/component context;
- capture errors at application boundaries and important backend operations;
- preserve user privacy over debugging convenience.

## 11. Payment and brand integrity

Payment destinations are centralized and protected by build-time checks. Do not hardcode alternate Cash App/Venmo/payment identities in components.

Current approved public payment identities must be read from the canonical payment configuration. Changes require explicit review because an incorrect handle can divert donations.

Do not reintroduce retired builder/vendor branding, stale favicons, broken social preview assets, or metadata fallbacks. `npm run build` runs branding/payment integrity checks.

## 12. Development commands

Install and run:

```bash
npm install
npm run dev
```

Required quality checks before merge unless the change is documentation-only:

```bash
npm run lint
npm run test -- --run
npm run build
```

Useful commands:

```bash
npm run build:dev
npm run preview
npm run seed:verified:dry-run -- path/to/verified-seed.json
```

Use the existing npm lockfile/package manager unless there is an explicit migration decision. Do not introduce a second lockfile casually.

## 13. Code conventions

- TypeScript/React with 2-space indentation.
- Components: `PascalCase.tsx`; hooks: `useSomething.ts`.
- Prefer `@/` imports for internal modules.
- Use existing shadcn/Radix components and `cn()` conventions.
- Avoid `any` in new code where a concrete/unknown type is practical.
- Do not globally tighten TypeScript compiler settings as a drive-by change.
- Keep side effects and data access explicit and testable.
- Treat generated Supabase types as generated artifacts; regenerate after schema changes when appropriate.

## 14. Pull requests and autonomous changes

Every meaningful PR should state:

- what changed;
- why it is safe;
- production/data impact;
- migrations involved;
- validation performed;
- any remaining blocker or intentionally held feature.

Autonomous agents must not merge around a failing integrity/security check merely to make CI green. Fix the underlying issue or document a genuine false-positive with evidence.

For production-affecting database work, distinguish clearly between:

- code committed;
- migration merged;
- migration actually applied;
- smoke tests passed;
- deployment verified.

Never collapse those into a single claim unless each step is observed.

## 15. Documentation maintenance

When architecture, production project identity, data policy, deployment path, or feature safety status materially changes, update the relevant operating document in the same PR.

Do not allow generated planning documents to become de facto policy. If an old root-level report is retained for history, label it historical/stale or supersede it with a current runbook.
