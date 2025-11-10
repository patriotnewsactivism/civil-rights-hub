# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Act Now Hub is a comprehensive civil rights platform built with React, TypeScript, Vite, and Supabase. The application helps users understand their constitutional rights, report violations, search legal cases, find attorneys, access government records, and participate in community discussions.

## Development Commands

- `npm run dev` - Start Vite dev server on http://localhost:8080 (note: custom port, not 5173)
- `npm run build` - Production build to `dist/`
- `npm run build:dev` - Development build with dev-mode env vars
- `npm run preview` - Serve last production build
- `npm run lint` - Run ESLint across codebase

### Database Commands

- `supabase db push` - Apply all migrations to database
- `supabase gen types typescript --local > src/integrations/supabase/types.ts` - Regenerate TypeScript types
- `node scripts/extract-state-data.js` - Generate seed data SQL from existing components

## Architecture

### Frontend Structure

The app follows a single-page application (SPA) pattern with React Router:
- `src/App.tsx` - Root component with QueryClient, routing, and global UI providers
- `src/pages/Index.tsx` - Main landing page composing all sections in order
- `src/components/` - Feature components and shadcn/ui building blocks
- `src/hooks/` - Shared React hooks (`useGeolocation`, `useAuth`)
- `src/lib/` - Utility functions
- `src/integrations/supabase/` - Supabase client and auto-generated types

### Core Features

**1. Violation Reporting & Community Feed** (`ViolationReport.tsx`, `ViolationFeed.tsx`, `ViolationComments.tsx`):
- Users submit civil rights violation reports with geolocation support
- Data stored in `violations` table: `title`, `description`, `location_state`, `location_city`, `incident_date`, `latitude`, `longitude`, `status`
- Public feed with state filtering and realtime updates
- Comment system (`violation_comments` table) with anonymous posting
- Uses `useGeolocation` hook for auto-location detection

**2. Attorney Directory** (`LawyerFinder.tsx`):
- Searchable database of civil rights attorneys
- Filters: state, practice area, pro bono availability
- Data stored in `attorneys` table with full-text search indexes
- Location-aware auto-filtering
- Displays contact info, ratings, specialties

**3. Federal & State Laws** (`FederalLaws.tsx`, `StateSelector.tsx`):
- Comprehensive federal statutes database (`federal_laws` table)
- Category browsing: Employment, Housing, Voting, etc.
- State-by-state recording laws and civil rights info (`state_laws` table)
- Originally hardcoded in StateSelector, migrated to database

**4. Police Scanner Links** (`PoliceScanner.tsx`):
- Curated links to Broadcastify and other scanner services
- State/city filtering from `scanner_links` table
- Live listener counts and scanner status

**5. Court Watch Calendar** (`CourtWatch.tsx`):
- Upcoming civil rights hearings and trials
- Filterable by state and date range
- Data in `court_calendars` table with Zoom/phone access info
- Shows case details, parties, issues, organizations involved

**6. FOIA Request Builder** (`FOIABuilder.tsx`):
- Template-based FOIA request generator
- State-specific and federal templates in `foia_templates` table
- Customizable fields with placeholder replacement
- Copy/download generated requests
- Submission instructions and legal citations

**7. Discussion Board** (`DiscussionBoard.tsx`):
- Community forum with categories
- Tables: `forum_threads`, `forum_posts`
- Anonymous and authenticated posting
- View counts, post counts, pinned threads

**8. AI Legal Tools** (`CaseSearch.tsx`, `AITools.tsx`):
- Case law search via `case-search` Supabase Edge Function
- Legal Q&A assistant via `legal-assistant` Edge Function
- Both use Lovable AI Gateway with Gemini 2.5 Flash
- Requires `LOVABLE_API_KEY` in Supabase secrets

**9. Know Your Rights PDF Generation** (`KnowYourRights.tsx`):
- Professional PDF pocket guides using jsPDF
- Downloads for First, Fourth, Fifth Amendments and Recording Rights
- State-specific information included when location detected

**10. Interactive US Map** (`InteractiveMap.tsx`):
- Click states to view laws and resources
- Uses `react-simple-maps`, `topojson-client`, `us-atlas`

### Database Schema

**New Tables** (see `supabase/migrations/` for full schema):

1. **attorneys** - Lawyer directory with practice areas, ratings, contact info
2. **state_laws** - State-specific recording laws, police recording rights, shield laws
3. **federal_laws** - Federal civil rights statutes with categories, citations, protections
4. **scanner_links** - Police scanner feeds by location
5. **court_calendars** - Civil rights hearings with dates, locations, access info
6. **foia_templates** - FOIA request templates with submission instructions
7. **forum_threads** - Discussion board threads with categories, view/post counts
8. **forum_posts** - Thread replies with nested comment support
9. **violation_comments** - Comments on violation reports

**Existing Tables**:
- **violations** - User-submitted civil rights violation reports

All tables have:
- Row Level Security (RLS) policies
- Full-text search indexes where applicable
- Timestamps with auto-update triggers
- Proper foreign key relationships

### Supabase Integration

**Edge Functions** (`supabase/functions/`):
- `case-search` - AI legal case research
- `legal-assistant` - Civil rights Q&A
- Deno runtime with Lovable AI Gateway
- CORS configured for cross-origin requests

**Client Configuration**:
- `src/integrations/supabase/client.ts` - Supabase client initialization
- localStorage session persistence
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

**Authentication**:
- `src/hooks/useAuth.ts` - Auth helper hook
- Optional authentication for forums/comments
- Anonymous posting allowed for accessibility

### Import Aliases

TypeScript paths configured with `@/` alias:
```typescript
import { supabase } from "@/integrations/supabase/client";
import { LawyerFinder } from "@/components/LawyerFinder";
```

### Styling

- Tailwind CSS with custom config
- shadcn/ui components in `src/components/ui/`
- `clsx` and `class-variance-authority` for conditional styling
- `@tailwindcss/typography` for rich text
- `jspdf` for PDF generation

## Important Implementation Details

**Geolocation**:
- `useGeolocation` hook: `{ state, city, latitude, longitude, loading, error }`
- Uses browser Geolocation API + OpenStreetMap Nominatim for reverse geocoding
- Auto-populates state filters across components

**PDF Generation**:
- jsPDF library for Know Your Rights pocket guides
- Formatted with headers, colors, page breaks
- State-specific info included automatically

**Realtime Updates**:
- Supabase realtime subscriptions in ViolationComments
- Channel-based updates for new comments

**Search Implementation**:
- Full-text search using PostgreSQL GIN indexes
- `to_tsvector` for searchable text fields
- Client-side filtering for refined searches

**Data Migration**:
- `scripts/extract-state-data.js` - Extracts hardcoded state data
- Generates SQL INSERT statements for `state_laws` and `attorneys`
- Run: `node scripts/extract-state-data.js > supabase/migrations/[timestamp]_seed_state_data.sql`

**TypeScript Configuration**:
- Relaxed: `noImplicitAny: false`, `strictNullChecks: false`
- Update for stricter typing as needed

**State Management**:
- React Query for server state
- Local `useState` for UI state
- No Redux/Zustand

**Form Handling**:
- Mix of react-hook-form + Zod and vanilla controlled inputs
- Validation varies by component complexity

## Adding New Features

**New Database Table**:
1. Create migration in `supabase/migrations/[timestamp]_[name].sql`
2. Define schema with RLS policies, indexes, triggers
3. Run `supabase db push` to apply
4. Regenerate types: `supabase gen types typescript --local > src/integrations/supabase/types.ts`

**New Component**:
1. Create in `src/components/[Name].tsx`
2. Import and add to `src/pages/Index.tsx`
3. Use `useGeolocation` for location features
4. Follow existing patterns for search/filtering

See [AGENTS.md](AGENTS.md) for contributor workflows and commit guidelines.
