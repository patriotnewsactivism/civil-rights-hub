# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run build:dev    # Development mode build
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run test         # Run Vitest unit tests
```

Run a single test file:
```bash
npx vitest run src/hooks/useJurisdiction.test.tsx
```

## Stack

- **Frontend**: React 18 + TypeScript + Vite (SWC) — SPA, no SSR
- **Routing**: React Router v6 (client-side only)
- **UI**: shadcn/ui (Radix UI + Tailwind CSS), Lucide icons
- **Server state**: TanStack Query v5
- **Forms**: React Hook Form + Zod
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Deployment**: Vercel; analytics via `@vercel/analytics`

## Architecture

### Routing (`src/App.tsx`)
19 routes defined with React Router v6. Heavy pages (`CityPage`, `StatePage`, `StatesDirectory`, `Sitemap`) use `React.lazy()` + `Suspense`. Redirects for `/notifications`, `/messages`, `/network` all point to `/community?tab=<tab>`.

### Supabase Integration (`src/integrations/supabase/`)
- Client initialized in `client.ts` from `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`
- Generated TypeScript types are in `src/integrations/supabase/types.ts` — regenerate with `supabase gen types typescript --project-id vrdnrbjnitptxrexdlao` after schema changes
- Real-time subscriptions used in Header (direct messages) and community feed (violation reports)

### Key database tables
`attorneys` (~1700 rows), `activists`, `violations` + `violation_comments`, `state_laws`, `federal_laws`, `scanner_links`, `forum_threads` + `forum_posts`, `user_profiles`, `notifications`, `direct_messages`, `foia_templates`, `foia_agencies`

### Fallback data
`src/data/attorneyFallbackData.json` and `scannerFallbackData.json` are loaded when Supabase is unavailable. The pattern is: try Supabase query → on error, fall back to static JSON.

### State management pattern
- Global jurisdiction state: `useJurisdiction` hook + React Context (see `src/hooks/useJurisdiction.tsx`)
- Server/async state: TanStack Query (no Redux/Zustand)
- Local UI state: `useState` / `useReducer`

### Edge Functions (`supabase/functions/`)
Six Deno-based edge functions: `case-search`, `legal-assistant`, `send-foia-request`, `send-weekly-digest`, `track-foia-open`, `check-foia-deadlines`.

### Path aliases
`@/*` maps to `src/*`. Use this for all internal imports.

## TypeScript config
Intentionally loose: `noImplicitAny: false`, `strictNullChecks: false`. Do not tighten these globally.

## Environment variables
```
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```
All must be prefixed `VITE_` to be available in the browser bundle.

## Testing
- Vitest + Testing Library; setup file at `src/setupTests.ts`
- Test files colocated with source or in `__tests__/` subdirectories
- Existing tests: `useJurisdiction.test.tsx`, `JurisdictionSelector.test.tsx`, `NavigationPages.test.tsx`, `useEmergencyRecorder.test.ts`, community component tests
