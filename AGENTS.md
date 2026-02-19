# Repository Guidelines

## Build, Test, and Development Commands

- `npm install` or `bun install` - install dependencies (don't commit lockfile unless switching package managers)
- `npm run dev` - starts Vite dev server on http://localhost:8080
- `npm run build` - production build to `dist/`
- `npm run build:dev` - development mode build with dev-mode env vars
- `npm run lint` - runs ESLint flat config across TS/TSX files
- `npm run preview` - serves the last build for acceptance demos
- `npm run test` - runs all Vitest tests in watch mode
- `npm run test -- path/to/file.test.ts` - runs a single test file
- `npm run test -- --run` - runs tests once without watch mode

## Project Structure

```
src/                          # Core client code
  components/                 # React components
    ui/                       # shadcn UI building blocks
    __tests__/                # Co-located test files
    foia/                     # FOIA-related components
  pages/                      # React Router route views
  hooks/                      # Custom React hooks for shared logic
  lib/                        # Utility functions (cn, seoData, etc.)
  integrations/               # External service clients
    supabase/                 # Supabase client and types
  types/                      # TypeScript type definitions
  data/                       # Static JSON data files
public/                       # Static assets
dist/                         # Build output (gitignored)
supabase/                     # Supabase configuration
  functions/                  # Edge functions (Deno runtime)
    case-search/              # Legal case search function
    legal-assistant/          # AI legal assistant function
    check-foia-deadlines/     # FOIA deadline checker
  migrations/                 # SQL migration files
  config.toml                 # Supabase CLI configuration
```

## Coding Style & Naming Conventions

- TypeScript everywhere with 2-space indentation
- Prefer small, pure React function components
- File naming: `PascalCase.tsx` for components, `useSomething.ts` for hooks
- Import shared modules via `@/` alias (e.g., `import { cn } from "@/lib/utils"`)
- Use Tailwind utility classes with `clsx`/`class-variance-authority` helpers
- Use the `cn()` function from `@/lib/utils` for conditional class merging
- Keep data fetching inside `src/hooks/` with React Query (`@tanstack/react-query`)
- Use shadcn/ui components from `@/components/ui/` for consistent UI

## Import Order

1. React/React-related imports (react, react-dom, react-router-dom)
2. Third-party libraries (@tanstack/react-query, lucide-react, etc.)
3. Internal aliases (`@/components/`, `@/hooks/`, `@/lib/`, `@/types/`)
4. Relative imports (./, ../)
5. Type imports (use `import type` for type-only imports)

Example:
```typescript
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { ScannerLinkRecord } from "@/types/scanner";
```

## TypeScript Guidelines

- Use explicit return types for exported functions
- Prefer interfaces for object types that might be extended
- Use `type` for unions, intersections, and mapped types
- Avoid `any`; use `unknown` when type is truly unknown
- Type file location: co-locate with code or in `src/types/`
- Use Zod schemas for runtime validation (`zod` package available)

## Error Handling

- Use `ErrorBoundary` component from `@/components/ErrorBoundary` for React error boundaries
- Log errors with `console.error()` for debugging
- Provide user-friendly error messages in UI
- Graceful degradation for missing environment variables (see Supabase client pattern)
- Async operations should return `{ data, error }` pattern matching Supabase conventions
- Check for `error` property before using `data` in async operations

## Testing Guidelines

- Test files named `Component.test.tsx` or `hook.test.ts`
- Co-locate tests with code OR use `__tests__` folders
- Use Vitest with Testing Library (`@testing-library/react`, `@testing-library/jest-dom`)
- Mock external dependencies (Supabase, geolocation, etc.) using `vi.mock()`
- Use `afterEach` for cleanup: `cleanup()`, `vi.clearAllMocks()`
- Run `npm run lint && npm run build` before PR review

Example mock pattern:
```typescript
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => builder,
      eq: () => builder,
      order: () => builder,
      then: promise.then.bind(promise),
    }),
  },
}));
```

## Supabase Edge Functions

- Located in `supabase/functions/`
- Use Deno runtime with ES modules
- Import from `https://deno.land/std@0.168.0/http/server.ts`
- Include CORS headers in all responses
- Store secrets in environment variables, access via `Deno.env.get("SECRET_NAME")`
- Use `supabase start` locally to validate against local instance
- Return errors as `{ error: string }` JSON with appropriate status codes

## Commit & PR Guidelines

- Write imperative, descriptive commit subjects (e.g., "Add FOIA deadline tracking")
- Link relevant Linear/GitHub issues in PRs
- Describe UX impact and list tested commands
- Attach screenshots for UI changes
- Rebase on `main` before requesting review
- Ensure `npm run lint && npm run build` passes before requesting review

## Security

- Never commit `.env` files or secrets
- Use `.env.local` for local development secrets
- Required env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- Regenerate Supabase tokens through the Supabase dashboard
- Store edge function secrets per-function in their own `.env` files

## Key Dependencies

- `@tanstack/react-query` - Server state management
- `@supabase/supabase-js` - Backend and auth
- `react-router-dom` - Client-side routing
- `lucide-react` - Icon library
- `class-variance-authority` + `clsx` + `tailwind-merge` - Styling utilities
- `zod` - Schema validation
- `date-fns` - Date manipulation
- `recharts` - Charts and data visualization
