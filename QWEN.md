# QWEN.md

Instructional context for Qwen Code working in the **Civil Rights Hub** repository.

## Project Overview

**Civil Rights Hub** (civilrightshub.org) is a free, open-source civic technology platform built by **We The People News (WTPN)**, a civil rights journalism and activism organization. The platform provides tools for activists, journalists, attorneys, and citizens to know their rights, document violations, find legal help, file FOIAs, track legislation, and connect with a community. It is 100% free, carries no advertisements, and is funded by donations (Patreon, CashApp, Venmo).

**Mission:** "Your Rights. Defended." — be the nation's most comprehensive civil rights resource.

### Core Feature Areas
- **Rights & Know-Your-Rights** — constitutional guides, state recording laws, rapid-response scripts for police encounters
- **FOIA Builder & Tracker** — draft FOIA requests from templates, track deadlines and email opens
- **Police/EMS Scanner** — 500+ live scanner feeds (Broadcastify integration)
- **Violation Feed** — crowdsourced incident reports with geolocation
- **Attorney Directory** — ~1,700 attorneys searchable by state/specialty/pro-bono
- **Accountability Map** — state-by-state violations and agency data
- **State Statute Navigator** — state-specific civil rights laws
- **Community / Social Platform** — feed, stories, polls, threaded comments, reactions, mentions, DMs, notifications, groups, events, go-live dual-camera recording
- **Newsroom** — curated civil rights journalism
- **City Hubs** — 18 major US city pages with local resources
- **AI Legal Assistant** — Deno edge function (DeepSeek → Lovable/Gemini fallback)
- **Case Search** — civil rights litigation precedents

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite (SWC) — SPA, no SSR |
| Routing | React Router v6 (client-side only) |
| UI | shadcn/ui (Radix UI primitives + Tailwind CSS), Lucide icons |
| Server state | TanStack Query v5 (no Redux/Zustand) |
| Forms | React Hook Form + Zod |
| Rich text | TipTap (starter-kit, link, placeholder extensions) |
| Charts | Recharts |
| Maps | react-simple-maps + us-atlas + topojson-client |
| PDF | jsPDF |
| Calendar | react-big-calendar, react-day-picker |
| Backend | Supabase (PostgreSQL + Auth + Realtime + Storage + Edge Functions) |
| Edge Functions | Deno runtime (`supabase/functions/`) |
| Deployment | Vercel (`@vercel/analytics`) |
| SEO | `react-helmet-async` via `<SEO>` component |
| Testing | Vitest + Testing Library (jsdom) |

## Build, Test & Development Commands

```bash
npm install            # or bun install — install deps (don't commit lockfile unless switching PMs)
npm run dev            # Vite dev server on http://localhost:8080
npm run build          # production build → dist/
npm run build:dev      # dev-mode build with dev env vars
npm run lint           # ESLint flat config across TS/TSX
npm run preview        # serve last build for acceptance demos
npm run test           # Vitest in watch mode
npm run test -- path/to/file.test.ts   # single test file
npm run test -- --run                  # run tests once (no watch)
```

Run a single test directly:
```bash
npx vitest run src/hooks/useJurisdiction.test.tsx
```

**Pre-PR gate:** `npm run lint && npm run build` must pass.

## Project Structure

```
src/
  components/
    ui/                # shadcn/ui primitives — DO NOT edit directly
    community/         # Community page sub-components (SocialFeed, GoLiveRecorder, etc.)
    social/            # Reusable social primitives (PollCreator, ThreadedComments, etc.)
    foia/              # FOIA sub-components
    __tests__/         # Co-located tests
  pages/               # 24 React Router route views
  hooks/               # Custom hooks (useAuth, useJurisdiction, useEmergencyRecorder, etc.)
  lib/                 # Utilities (cn, seoData, auth, fallbacks, referenceData)
  integrations/
    supabase/          # client.ts + generated types.ts
  types/               # TypeScript type definitions
  data/                # Static JSON fallback data (attorneyFallbackData, scannerFallbackData)
  App.tsx              # 27 routes, providers, ScrollToTop
  index.css            # Tailwind + Liberation theme CSS variables
supabase/
  functions/           # 6 Deno edge functions
  migrations/          # 113+ SQL migration files
  config.toml          # Supabase CLI config (project_id: "civil-rights-hub")
  snippets/
scripts/               # Python + JS seeding utilities
```

## Architecture Notes

### Routing (`src/App.tsx`)
- 27 routes defined with React Router v6. Heavy pages (`CityPage`, `StatePage`, `StatesDirectory`, `Sitemap`) use `React.lazy()` + `Suspense`.
- Convenience redirects: `/notifications`, `/messages`, `/network` → `/community?tab=<tab>`.
- `ScrollToTop` component fires on every navigation and uses a polling interval to counteract focus-stealing by lazy-loaded components.
- Provider tree: `HelmetProvider` → `QueryClientProvider` → `TooltipProvider` → `JurisdictionProvider` → routes + `<Analytics />`.

### Supabase Integration (`src/integrations/supabase/`)
- Client initialized in `client.ts` from `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`.
- **Graceful degradation:** When env vars are missing, the module exports a no-op dummy client so the app never crashes — all queries resolve to `{ data: null, error: Error("Supabase not configured") }`.
- Generated TypeScript types in `types.ts` — regenerate with `supabase gen types typescript --project-id vrdnrbjnitptxrexdlao` after schema changes.
- Real-time subscriptions used in `Header` (unread DM count) and community feed (new violation reports).
- **Fallback data pattern:** Try Supabase query → on error, fall back to static JSON (`src/data/*.json` via `src/lib/*Fallback.ts`).

### Key Database Tables
`activists`, `attorneys` (~1700 rows), `violations` + `violation_comments`, `state_laws`, `federal_laws`, `scanner_links`, `forum_threads` + `forum_posts`, `user_profiles`, `notifications`, `direct_messages`, `foia_templates`, `foia_agencies`, `agencies`, `legislation`, `community_events`, `groups`, `posts`, `comments`, `city_permit_info`, `court_calendars`, `popular_tags`, `achievement_definitions`, and more (see `src/integrations/supabase/types.ts`).

### Auth (`src/hooks/useAuth.ts`)
Thin wrapper around `supabase.auth` exposing `{ user, loading, isAuthenticated, signIn, signUp, signOut }`. Sign-up calls `buildSignupMetadata` (`src/lib/auth.ts`) to derive a unique `username` from the email prefix. Pages requiring auth check `useAuth()` and redirect to `/auth`.

### State Management
- **Global jurisdiction state:** `useJurisdiction` hook + React Context (`src/hooks/useJurisdiction.tsx`); persisted to `localStorage`; supports manual selection, GPS, and IP geolocation fallback.
- **Server/async state:** TanStack Query (no Redux/Zustand).
- **Local UI state:** `useState` / `useReducer`.

### Community Page (`src/pages/Community.tsx`)
Tab-driven: `feed`, `discuss`, `events`, `messages`, `notifications`, `network`, `profile`. Active tab synced to `?tab=` URL param for deep-linking. Unauthenticated users redirect to `/auth`.

### Social Platform Features
`SocialFeed` (`src/components/SocialFeed.tsx`) — posts with text, images, polls (JSON `poll_data`), hashtags, visibility levels. `StoriesBar` — ephemeral 24h stories. `GoLiveRecorder` wraps `useEmergencyRecorder` + `useGeolocation` for dual-camera video recording → Supabase Storage → feed post.

### Edge Functions (`supabase/functions/`)
Six Deno-based functions: `case-search`, `legal-assistant`, `send-foia-request`, `send-weekly-digest`, `track-foia-open`, `check-foia-deadlines`.
- Import from `https://deno.land/std@0.168.0/http/server.ts`.
- Include CORS headers in all responses; handle `OPTIONS` preflight.
- Secrets accessed via `Deno.env.get("SECRET_NAME")`.
- AI gateway pattern: prefer DeepSeek (`DEEPSEEK_API_KEY`), fall back to Lovable/Gemini (`LOVABLE_API_KEY`).
- Return errors as `{ error: string }` JSON with appropriate status codes.

## Coding Style & Conventions

- **TypeScript everywhere**, 2-space indentation.
- **File naming:** `PascalCase.tsx` for components, `useSomething.ts` for hooks.
- **Path alias:** `@/*` maps to `src/*` — use for all internal imports.
- **UI components:** shadcn/ui from `@/components/ui/` — do not edit these directly (regenerate via shadcn CLI).
- **Styling:** Tailwind utility classes with `clsx`/`class-variance-authority`; use `cn()` from `@/lib/utils` for conditional class merging.
- **Data fetching:** inside `src/hooks/` with React Query (`@tanstack/react-query`).
- **TypeScript config is intentionally loose:** `noImplicitAny: false`, `strictNullChecks: false` — do not tighten globally.
- Prefer small, pure React function components.
- Prefer interfaces for extensible object types; `type` for unions/intersections/mapped types.
- Avoid `any`; use `unknown` when type is truly unknown.
- Use Zod schemas for runtime validation.

### Import Order
1. React/React-related (`react`, `react-dom`, `react-router-dom`)
2. Third-party (`@tanstack/react-query`, `lucide-react`, etc.)
3. Internal aliases (`@/components/`, `@/hooks/`, `@/lib/`, `@/types/`)
4. Relative imports (`./`, `../`)
5. Type imports (`import type` for type-only)

## Theme: "Liberation"

Custom design system in `src/index.css` using HSL CSS variables consumed by Tailwind. Crimson primary (`348 80% 45%`), amber/gold accent (`38 92% 50%`), warm midnight dark mode. Inter font family. Includes hero gradients, glow shadows, and custom animations (`fade-in-up`, `slide-in-right`, etc.).

## Testing

- **Framework:** Vitest + Testing Library (`@testing-library/react`, `@testing-library/jest-dom`); setup at `src/setupTests.ts`.
- **Naming:** `Component.test.tsx` / `hook.test.ts`, co-located with source or in `__tests__/` subdirectories.
- **Mocking:** Mock external deps (Supabase, geolocation) using `vi.mock()`. Use `afterEach` for cleanup (`cleanup()`, `vi.clearAllMocks()`).
- **Existing tests:** `useJurisdiction`, `JurisdictionSelector`, `NavigationPages`, `useEmergencyRecorder`, `PoliceScanner`, `SectionQuickNav`, community components (`CommunityMobileNav`, `CommunityActionBar`).

## Environment Variables

All must be `VITE_`-prefixed to be available in the browser bundle:

```
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Edge function secrets (per-function `.env`, accessed via `Deno.env.get`):
- `DEEPSEEK_API_KEY`, `LOVABLE_API_KEY` (legal-assistant)

## Security

- **Never commit `.env` files or secrets.** Use `.env.local` for local dev secrets.
- Regenerate Supabase tokens through the Supabase dashboard.
- Security headers set in `vercel.json`: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy`.
- Cache-Control immutable on `/assets/*`.
- The site carries a trust signal: "Educational resource — not a substitute for legal advice."

## Deployment

- **Vercel** (framework: `vite`, build: `npm run build`, output: `dist/`).
- SPA rewrite: all routes → `/index.html`.
- Analytics via `@vercel/analytics`.
- `npm run preview` serves the last build locally for acceptance demos.

## Commit & PR Guidelines

- Write imperative, descriptive commit subjects (e.g., "Add FOIA deadline tracking").
- Link relevant Linear/GitHub issues in PRs.
- Describe UX impact and list tested commands.
- Attach screenshots for UI changes.
- Rebase on `main` before requesting review.
- Ensure `npm run lint && npm run build` passes before requesting review.

## Utility Hooks

- `useJurisdiction` — global jurisdiction state (manual selection / GPS / IP geolocation), React Context + `localStorage`.
- `useAuth` — thin `supabase.auth` wrapper.
- `useEmergencyRecorder` — dual-camera `MediaRecorder` abstraction for Go Live / panic-button features.
- `useGeolocation` — browser Geolocation API wrapper.
- `useEmergencyContacts` — manages locally-stored emergency contact list.

## Key Dependencies Reference

- `@tanstack/react-query` — server state management
- `@supabase/supabase-js` — backend, auth, realtime, storage
- `react-router-dom` — client-side routing
- `react-helmet-async` — SEO meta tags
- `lucide-react` — icon library
- `class-variance-authority` + `clsx` + `tailwind-merge` — styling utilities
- `zod` — schema validation
- `react-hook-form` + `@hookform/resolvers` — forms
- `date-fns` / `date-fns-tz` — date manipulation
- `recharts` — charts
- `react-simple-maps` / `us-atlas` / `topojson-client` — US maps
- `jspdf` — PDF generation
- `@tiptap/*` — rich text editing
- `react-big-calendar` — calendar
- `sonner` / `@radix-ui/react-toast` — toasts
