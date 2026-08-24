# Civil Rights Hub — Current Feature Status

Civil Rights Hub is a public-interest toolkit for rights references, incident documentation, public-records work, research, scanner resources, and community collaboration.

## Publicly available

- General federal constitutional reference material with direct research links.
- Emergency encounter checklists and documentation workflows.
- Incident-report intake.
- FOIA/public-records drafting and user-owned request tracking.
- Direct external scanner-provider resources.
- Community account, messaging, notification, and profile functions that remain compatible with current access controls.
- Voluntary support links using the canonical payment configuration.

## Temporarily fail-closed

Legacy datasets and tools that do not yet meet the current evidence standard are withheld from publication. This includes attorney/accountability directories, unverified state-law summaries, legacy incident feeds, static legislation/news datasets, and general-purpose generated legal answers.

These features return only after the relevant factual claims can be tied to reviewed provenance and the public access path passes the production security tests.

## Data publication standard

For public factual records, source traceability is mandatory. Primary or official sources are preferred. Synthetic people, firms, agencies, incidents, statistics, ratings, legal outcomes, and unsupported contact details are prohibited.

The production provenance gate controls publication for supported entity types and intentionally favors trustworthy coverage over raw record volume.

## Platform

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/Radix
- Supabase project `vrdnrbjnitptxrexdlao`
- Vercel production deployment
- GitHub Actions guarded database migration workflow
- Vitest/Testing Library regression coverage

See `DEPLOYMENT.md` for the current deployment process and `QWEN.md` / `AGENTS.md` for repository-working conventions.
