# Civil Rights Hub Deployment

This file previously described a Vercel-based deployment process. Vercel is not an approved deployment target for this repository — see the "Hosting invariant" in [`CLAUDE.md`](CLAUDE.md) / [`AGENTS.md`](AGENTS.md).

The canonical deployment contract is Netlify. See:

- [`docs/HOSTING.md`](docs/HOSTING.md) for the frontend deployment contract, required domains, and `npm run hosting:check`.
- [`docs/OPERATIONS.md`](docs/OPERATIONS.md) for the production runbook, including database migrations via `.github/workflows/supabase-migrate-now.yml`.
