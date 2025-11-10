# Repository Guidelines

## Project Structure & Module Organization
Core client code lives in `src/`, where `components/` hosts shadcn UI building blocks, `pages/` defines React Router views, `hooks/` wraps shared logic, `lib/` holds utilities, and `integrations/` encapsulates external services. Static assets stay in `public/`, while build outputs land in `dist/`. Supabase edge functions (`supabase/functions/case-search` and `supabase/functions/legal-assistant`) mirror the client naming rules; configure them through `supabase/config.toml` and keep per-function secrets in their own `.env`. Keep Vite, Tailwind, and TypeScript settings in the root config files so other agents can trace behaviour quickly.

## Build, Test, and Development Commands
- `npm install` (or `bun install`) syncs dependencies; commit neither lockfile unless you intentionally switch package managers.
- `npm run dev` launches Vite with hot reload on http://localhost:5173.
- `npm run build` creates an optimized client bundle in `dist/`; `npm run build:dev` is handy for debugging builds with dev-mode env vars.
- `npm run preview` serves the last build, which is ideal for acceptance demos.
- `npm run lint` runs the flat ESLint config across TS, JSX, and Supabase functions.

## Coding Style & Naming Conventions
Use TypeScript everywhere, 2-space indentation, and prefer small, pure React function components. Files that export components follow `PascalCase.tsx`; hooks remain `useSomething.ts`. Import shared modules through the `@/` alias defined in `tsconfig`. Favor Tailwind utility classes plus `clsx`/`class-variance-authority` helpers rather than ad-hoc CSS. Keep data fetching inside `src/hooks` with React Query caches so suspense boundaries remain predictable.

## Testing Guidelines
Automated tests are not wired up yet; when adding coverage, bootstrap Vitest + Testing Library and colocate specs as `Component.test.tsx` or `hook.test.ts`. Stub Supabase calls and React Query clients to keep tests deterministic. Until the suite exists, attach manual verification notes or short screen recordings in the PR, and ensure `npm run lint && npm run build` succeeds before requesting review.

## Commit & Pull Request Guidelines
Write imperative, descriptive commit subjects similar to `Approve Lovable tool use`, and include tags like `[skip lovable]` only when necessary to bypass the Lovable pipeline. Each PR should link the relevant Linear/GitHub issue, describe the UX impact, list tested commands, and attach screenshots for UI adjustments or Supabase migration diffs. Request review only after rebasing on `main` and confirming no generated files were edited by hand.

## Security & Configuration Tips
Never commit `.env` contents; rely on `.env.local` for developer secrets and document required keys (e.g., Supabase URL, anon key) in the PR description. Regenerate Supabase access tokens through the dashboard and store them in the Lovable secrets manager before deploying. When editing edge functions, validate policies against your Supabase project using `supabase start` locally so production data stays untouched.
