# QWEN.md

Instructional context for work on **Civil Rights Hub** (`civilrightshub.org`).

## Current architecture

- Frontend: React 18, TypeScript, Vite, Tailwind, shadcn/Radix.
- Backend: Supabase project `vrdnrbjnitptxrexdlao`.
- Hosting: Vercel.
- Canonical package manager: npm with `package-lock.json`.
- Public legal/accountability data follows a source-first provenance gate.

## Data-integrity rules

Do not create synthetic people, attorneys, agencies, incidents, statistics, case outcomes, ratings, legal conclusions, or contact details. Public factual claims must be traceable to reviewed evidence, with primary/official sources preferred. Attorney, incident, activist, law, scanner, and resource publication is controlled by the database provenance rules.

Legacy datasets that cannot satisfy the current provenance standard remain fail-closed. Do not restore old bulk seed data merely to increase record counts.

## AI/legal research

General-purpose generated legal answers are currently fail-closed. Any future legal research assistant must ground material legal claims in current, reviewable authority and expose citations users can inspect.

## Development

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test -- --run
```

The production build runs integrity guards before Vite. Do not bypass those guards to make a deployment pass.

## Supabase

Never expose a service-role or secret key in browser code. Use RLS for exposed tables and preserve the current production hardening. Database migrations are executed through the guarded GitHub Actions workflow and must target only project `vrdnrbjnitptxrexdlao`.

## Branding and metadata

Civil Rights Hub owns its crawler-visible metadata and assets. Social previews, favicons, PWA icons, page titles, and structured metadata must identify **Civil Rights Hub** and **We The People News**, with no third-party builder branding or stale fallback assets.
