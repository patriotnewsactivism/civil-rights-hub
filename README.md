# Civil Rights Hub

Civil Rights Hub is a public-interest web application maintained by We The People News. It brings together rights-reference material, emergency encounter tools, incident documentation, public-records workflows, scanner resources, legal research tools, and community features.

Production: https://civilrightshub.org

## Current integrity status

The project is operating under a **fail-closed publication policy** for legacy public datasets.

Public attorney, activist, incident, officer, agency, and related accountability records are temporarily withheld while old data is re-verified against durable source evidence. Legacy `verified` flags are not treated as proof by themselves.

The repository includes a provenance-gate migration designed to:

- preserve legacy verification decisions in a private quarantine table;
- demote unsupported legacy verification states;
- require active source provenance before covered records can be promoted to verified again;
- limit public reads to records that satisfy the verification policy;
- keep internal reviewer notes separate from public evidence metadata.

The application layer also fails closed so contaminated legacy rows are not republished if the database migration has not yet been confirmed in production.

## Data policy

Do not add synthetic people, attorneys, activists, agencies, officers, incidents, complaints, ratings, bar numbers, contact information, or legal findings to make the application appear populated.

A public factual record should be traceable to evidence appropriate to the claim, such as:

- official government records;
- court records;
- bar-directory records;
- organization-owned pages for organization-controlled facts;
- other reputable sources where primary authority is unavailable.

User submissions are intake records, not automatically verified facts.

Legal summaries should prefer current statutes, controlling cases, regulations, and other primary authority. State-law labels that do not yet have per-entry provenance should remain disabled rather than presented as verified law.

## Legacy seed warning

Historical versions of this repository contained synthetic-data generators and bulk seed files. Those records and old seed-time verification flags must **not** be assumed accurate.

The legacy random-data seeding path has been disabled. Use the provenance-aware workflow for any future verified seeding.

## Application stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- TanStack Query
- Radix / shadcn-style UI components
- Vercel deployment

## Local development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Tests:

```bash
npm test
```

Lint:

```bash
npm run lint
```

## Verified seeding

The repository includes a provenance-aware seeder for records that are ready to be reviewed against source evidence.

Validate an input file without writing:

```bash
npm run seed:verified:dry -- path/to/verified-seed.json
```

Run a verified seed only after the production provenance schema is confirmed:

```bash
npm run seed:verified -- path/to/verified-seed.json
```

Do not use legacy bulk/random seeding scripts as a substitute for evidence collection.

## Database migrations

Migration files live in `supabase/migrations/`.

Before enabling held public datasets, production should be checked for migration parity and the provenance/RLS behavior should be tested for anonymous, authenticated, and trusted service-role paths.

## Public source and licensing

The source repository is publicly viewable on GitHub. **There is currently no `LICENSE` file in this repository.** Public visibility does not by itself grant general rights to copy, modify, redistribute, or relicense the code. A software license should be added deliberately if the owner chooses to grant those rights.

## Corrections

Source-backed corrections, broken-link reports, and reproducible bug reports are welcome. The project should not promise a fixed correction deadline unless a real operational process exists to support that promise.

## Legacy documentation caution

Some older planning, seeding, SEO, or model-generated documents in the repository may contain stale assumptions, generated examples, projected figures, or pre-integrity architecture notes. Treat current application code, tested migrations, live deployment behavior, and cited primary sources as higher-authority evidence. Legacy planning documents should be audited before reuse.
