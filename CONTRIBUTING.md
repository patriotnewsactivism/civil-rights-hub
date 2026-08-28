# Contributing to Civil Rights Hub

Civil Rights Hub is a public-interest project. Contributions are welcome, but production accuracy and safety take priority over speed, visual completeness, or raw data volume.

Read `AGENTS.md`, `SECURITY.md`, and the relevant file under `docs/` before changing production-facing data or infrastructure.

## Before you start

For ordinary UI/code changes:

```bash
npm install
npm run dev
```

Before opening a PR:

```bash
npm run lint
npm run test -- --run
npm run build
```

Documentation-only changes may omit code checks when they cannot affect runtime behavior, but broken links/commands should still be reviewed.

## Pull request expectations

PR descriptions should answer:

1. What changed?
2. Why is the change needed?
3. Does it affect production data, migrations, auth, RLS, Storage, payments, legal content, or community content?
4. What was tested?
5. Is anything intentionally still held/disabled?
6. If a migration is included, has it been applied to production or merely committed?

Do not claim a feature is live merely because a PR merged.

## Data contributions

Do not submit guessed or generated real-world records.

For public factual datasets, provide source evidence appropriate to each claim. Follow `docs/DATA_INTEGRITY.md`.

Acceptable source categories commonly include:

- official government/statutory sources;
- court opinions and dockets where appropriate;
- official state bar directories;
- official organization pages for facts controlled by that organization;
- reputable secondary sources as supplements when primary material is unavailable.

A source link must actually support the field being populated.

## Community/social contributions

Do not create starter engagement by inventing users, comments, likes, views, follows, forum personalities, event attendance, or first-person experiences.

If the project publishes first-party educational/editorial material, it must use a clearly identified official/system identity and cannot simulate organic community engagement.

See `docs/COMMUNITY_INTEGRITY.md`.

## Legal-content changes

Legal claims need especially careful review. Prefer primary authority and preserve jurisdiction/date context.

Do not rely on an LLM's memory for case citations, current statutes, deadlines, hotline numbers, or state-specific legal requirements.

If a legal tool cannot ground an answer in verified material, a fail-closed/educational limitation is preferable to a plausible but unsupported answer.

## Database changes

Use forward migrations in `supabase/migrations/`.

Never rewrite an already-applied migration. Never replay legacy synthetic seed migrations solely to make migration histories look symmetric.

When removing uncertain legacy content, preserve an audit snapshot/quarantine when practical.

After schema/security changes, run the repository smoke checks and the Supabase advisors when available.

## Secrets and environment

Do not put privileged credentials in issues, PR bodies, code, screenshots, or test fixtures.

Browser-visible `VITE_*` configuration is not a secure secret channel.

If you accidentally expose a secret, notify the maintainer and rotate it rather than relying on deletion alone.

## UI and accessibility

Prefer existing shadcn/Radix components and project conventions. Test mobile behavior for navigation, dialogs, forms, and critical emergency/community flows. Avoid inaccessible color-only state indicators and unlabeled interactive controls.

## Tests

Add or update tests when changing:

- payment/branding integrity;
- auth/access behavior;
- data publication gates;
- social/community mutations;
- legal calculations or source selection;
- migration assumptions;
- user-facing failure states.

Do not weaken a test or guard merely to make CI pass unless you have evidence that the check itself is wrong.

## Historical files

The repository contains old seed files and audit/planning documents. They are retained as historical evidence and may contain incorrect, synthetic, or superseded content. Do not copy them into current production paths without re-verification.
