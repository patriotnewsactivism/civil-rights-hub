# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Act Now Hub is a civil rights awareness platform built with React, TypeScript, Vite, and Supabase. The application helps users understand their constitutional rights, report violations, search legal cases, and interact with AI-powered legal assistance tools.

## Development Commands

- `npm run dev` - Start Vite dev server on http://localhost:8080 (note: custom port, not 5173)
- `npm run build` - Production build to `dist/`
- `npm run build:dev` - Development build with dev-mode env vars
- `npm run preview` - Serve last production build
- `npm run lint` - Run ESLint across codebase

## Architecture

### Frontend Structure

The app follows a single-page application (SPA) pattern with React Router:
- `src/App.tsx` - Root component with QueryClient, routing, and global UI providers
- `src/pages/Index.tsx` - Main landing page composing all major sections in order
- `src/components/` - Feature components and shadcn/ui building blocks
- `src/hooks/` - Shared React hooks (including `useGeolocation` for location detection)
- `src/lib/` - Utility functions
- `src/integrations/supabase/` - Supabase client and auto-generated types

### Key Features

**Violation Reporting System** (`ViolationReport.tsx`, `ViolationFeed.tsx`):
- Users submit civil rights violation reports with geolocation support
- Data stored in Supabase `violations` table with columns: `title`, `description`, `location_state`, `location_city`, `incident_date`, `latitude`, `longitude`, `status`
- Feed displays recent violations with state-based filtering
- Uses `useGeolocation` hook to auto-populate location fields

**AI-Powered Tools** (`CaseSearch.tsx`, `AITools.tsx`):
- Case search queries legal precedents via `case-search` Supabase Edge Function
- Legal assistant answers civil rights questions via `legal-assistant` Edge Function
- Both functions call Lovable AI Gateway with Gemini 2.5 Flash model
- Requires `LOVABLE_API_KEY` environment variable in Supabase

**Interactive Map** (`InteractiveMap.tsx`):
- Uses `react-simple-maps`, `topojson-client`, and `us-atlas` for US state visualization
- Clicking a state scrolls to and populates the `StateSelector` component

### Supabase Integration

**Edge Functions** (`supabase/functions/`):
- `case-search` - AI legal case research assistant
- `legal-assistant` - Civil rights Q&A chatbot
- Both use Deno runtime and Lovable AI Gateway
- CORS headers configured for cross-origin requests

**Database**:
- `violations` table with RLS policies (if configured)
- Auto-generated TypeScript types in `src/integrations/supabase/types.ts`

**Client Configuration**:
- Supabase client initialized in `src/integrations/supabase/client.ts`
- Uses localStorage for session persistence
- Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`

### Import Aliases

TypeScript paths configured with `@/` alias pointing to `src/`:
```typescript
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
```

### Styling

- Tailwind CSS with custom config
- shadcn/ui components in `src/components/ui/`
- Uses `clsx` and `class-variance-authority` for conditional styling
- `@tailwindcss/typography` for rich text formatting

## Important Notes

**TypeScript Configuration**:
- Relaxed type checking: `noImplicitAny: false`, `strictNullChecks: false`
- When adding stricter types, may need to update compiler options

**Geolocation**:
- `useGeolocation` hook provides `{ state, city, latitude, longitude }` from browser API
- Gracefully handles permission denials and errors

**Supabase Functions**:
- Edge functions require `LOVABLE_API_KEY` environment variable
- Set via Supabase Dashboard under Project Settings → Edge Functions → Secrets
- Local testing: use `.env` files in function directories with `supabase start`

**State Management**:
- React Query (`@tanstack/react-query`) for server state
- Local component state with `useState` for UI interactions
- No global state management library (Redux, Zustand, etc.)

**Form Handling**:
- react-hook-form with Zod validation available but not universally applied
- Some forms use vanilla controlled components

See [AGENTS.md](AGENTS.md) for contributor workflows and commit guidelines.
