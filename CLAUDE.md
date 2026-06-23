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
- **SEO**: `react-helmet-async` via `<SEO>` component

## Architecture

### Routing (`src/App.tsx`)
27 routes defined with React Router v6. Heavy pages (`CityPage`, `StatePage`, `StatesDirectory`, `Sitemap`) use `React.lazy()` + `Suspense`. Redirects for `/notifications`, `/messages`, `/network` all point to `/community?tab=<tab>`. The `ScrollToTop` component (exported from `App.tsx`) fires on every navigation and uses a polling interval to counteract focus-stealing by lazy-loaded components.

### Component structure
- `src/components/ui/` — shadcn/ui primitives; do not edit these directly
- `src/components/community/` — Community page sub-components: `SocialFeed`, `CommunitySidebar`, `CommunityActionBar`, `CommunityMobileNav`, `GoLiveRecorder`, `ViolationFeed`, `QuickViolationReport`, `UserMentions`
- `src/components/social/` — Reusable social primitives: `PollCreator`, `PollDisplay`, `ThreadedComments`, `ReactionPicker`, `MentionInput`, `ExternalShareButtons`
- `src/components/foia/` — FOIA sub-components: `FOIAAgencySelector`, `FOIARequestDashboard`, `FOIARequestDetail`
- Top-level components in `src/components/` include `Header`, `Footer`, `Hero`, `SEO`, `SocialFeed`, `StoriesBar`, `MessagingPanel`, `UserProfile`, `UserNetwork`, and many feature-specific components

### Community page (`src/pages/Community.tsx`)
Tab-driven page with tabs: `feed`, `discuss`, `events`, `messages`, `notifications`, `network`, `profile`. Active tab is synced to `?tab=` URL param so deep-linking works. Unauthenticated users are redirected to `/auth`.

### Social platform features
`SocialFeed` (`src/components/SocialFeed.tsx`) is the main community feed — posts support text, images, polls (stored as JSON in `poll_data`), hashtags, and visibility levels. `StoriesBar` renders ephemeral 24-hour stories. `GoLiveRecorder` (`src/components/community/GoLiveRecorder.tsx`) wraps `useEmergencyRecorder` + `useGeolocation` to record dual-camera video, then uploads to Supabase Storage and posts to the feed.

### Supabase Integration (`src/integrations/supabase/`)
- Client initialized in `client.ts` from `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`
- **When env vars are missing** the module exports a no-op dummy client so the app runs without crashing; all queries resolve to `{ data: null, error: Error("Supabase not configured") }`
- Generated TypeScript types are in `src/integrations/supabase/types.ts` — regenerate with `supabase gen types typescript --project-id vrdnrbjnitptxrexdlao` after schema changes
- Real-time subscriptions used in `Header` (unread DM count) and community feed (new violation reports)

### Key database tables
`activists`, `attorneys` (~1700 rows), `violations` + `violation_comments`, `state_laws`, `federal_laws`, `scanner_links`, `forum_threads` + `forum_posts`, `user_profiles`, `notifications`, `direct_messages`, `foia_templates`, `foia_agencies`, `popular_tags`

### Fallback data
`src/data/attorneyFallbackData.json` and `scannerFallbackData.json` are loaded when Supabase is unavailable. The pattern is: try Supabase query → on error, fall back to static JSON (see `src/lib/attorneyFallback.ts` and `src/lib/scannerFallback.ts`).

### Auth (`src/hooks/useAuth.ts`)
Thin wrapper around `supabase.auth` that exposes `{ user, loading, isAuthenticated, signIn, signUp, signOut }`. Sign-up calls `buildSignupMetadata` (`src/lib/auth.ts`) to derive a unique `username` from the email prefix. Pages that require auth check `useAuth()` and redirect to `/auth`.

### State management pattern
- Global jurisdiction state: `useJurisdiction` hook + React Context (`src/hooks/useJurisdiction.tsx`); persisted to `localStorage`; supports manual selection, GPS, and IP geolocation fallback
- Server/async state: TanStack Query (no Redux/Zustand)
- Local UI state: `useState` / `useReducer`

### Utility hooks
- `useEmergencyRecorder` — dual-camera `MediaRecorder` abstraction for the Go Live / panic-button features
- `useGeolocation` — browser Geolocation API wrapper
- `useEmergencyContacts` — manages locally-stored emergency contact list

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
- Existing tests: `useJurisdiction.test.tsx`, `JurisdictionSelector.test.tsx`, `NavigationPages.test.tsx`, `useEmergencyRecorder.test.ts`, `PoliceScanner.test.tsx`, `SectionQuickNav.test.tsx`, community component tests (`CommunityMobileNav`, `CommunityActionBar`)
