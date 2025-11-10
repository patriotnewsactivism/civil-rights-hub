# Deployment Guide for New Features

## Issue: Blank Screen / 404 Errors

If you're seeing a blank screen or 404 errors in the console for tables like `attorneys`, `federal_laws`, `court_calendars`, etc., it means the database migrations haven't been applied yet.

## Solution: Apply Database Migrations

### Option 1: Using Supabase CLI (Recommended)

If you have Supabase CLI installed and linked to your project:

```bash
# Navigate to project directory
cd C:\act-now-hub

# Link to your Supabase project (if not already linked)
supabase link --project-ref tgkxehkgwxlqausmrqxh

# Apply all migrations to production
supabase db push

# Verify tables were created
supabase db remote diff
```

### Option 2: Using Supabase Dashboard (Manual)

If you don't have CLI access:

1. Go to https://supabase.com/dashboard/project/tgkxehkgwxlqausmrqxh/editor
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Copy and paste EACH migration file content (in order):

**Run these in order:**

1. `supabase/migrations/20251110100000_create_attorneys_table.sql`
2. `supabase/migrations/20251110100001_create_state_laws_table.sql`
3. `supabase/migrations/20251110100002_create_federal_laws_table.sql`
4. `supabase/migrations/20251110100003_create_scanner_links_table.sql`
5. `supabase/migrations/20251110100004_create_court_calendars_table.sql`
6. `supabase/migrations/20251110100005_create_foia_templates_table.sql`
7. `supabase/migrations/20251110100006_create_forum_tables.sql`
8. `supabase/migrations/20251110100007_seed_state_data.sql` (optional - seeds initial data)

Click "RUN" for each one.

### Option 3: Manual Table Creation (Quick Test)

If you just want to test the app without full setup, go to Supabase Dashboard → Database → Tables and manually create empty tables:

- `attorneys`
- `state_laws`
- `federal_laws`
- `scanner_links`
- `court_calendars`
- `foia_templates`
- `forum_threads`
- `forum_posts`
- `violation_comments`

This will at least stop the 404 errors (but tables will be empty).

## After Migrations Are Applied

### 1. Regenerate TypeScript Types

```bash
supabase gen types typescript --project-id tgkxehkgwxlqausmrqxh > src/integrations/supabase/types.ts
```

### 2. Enable New Features in Index.tsx

Edit `src/pages/Index.tsx` and uncomment the new components:

```tsx
<FederalLaws />
<LawyerFinder />
<PoliceScanner />
<CourtWatch />
<FOIABuilder />
<DiscussionBoard />
```

### 3. Populate Tables with Data

The new features need content to be useful. Add data via:

**A) Supabase Dashboard** (easiest for testing):
- Go to Table Editor
- Click on each table
- Use "Insert row" to add sample data

**B) Admin Interface** (TODO - build later):
- Create an admin page to manage content
- Add forms for lawyers, laws, scanners, etc.

**C) Seed Scripts** (for bulk data):
- Create data files in `scripts/seeds/`
- Write SQL or use Supabase JS client to insert

### 4. Redeploy

Once migrations are applied and tables exist:

```bash
# Build the project
npm run build

# Deploy via Lovable or your platform
# The app should now load all new features
```

## Troubleshooting

### Still Getting 404 Errors?

1. Check if tables exist:
   - Go to Supabase Dashboard → Database → Tables
   - Verify all 9 new tables are listed

2. Check RLS policies:
   - Each table should have "Enable RLS" turned on
   - Should have policies for SELECT (read access)

3. Check API URL in `.env`:
   - `VITE_SUPABASE_URL` should match your project
   - Should be: `https://tgkxehkgwxlqausmrqxh.supabase.co`

### Tables Exist But Still Blank?

- Tables are empty! Add sample data via dashboard
- Or run the seed script: `supabase/migrations/20251110100007_seed_state_data.sql`

### Need Help?

1. Check browser console for specific errors
2. Check Supabase logs: Dashboard → Logs → Postgres logs
3. Verify environment variables are set correctly

## Quick Start (Minimal Setup)

To get the app working ASAP without full feature set:

1. Keep new features commented out in Index.tsx (already done)
2. Just deploy as-is
3. Apply migrations later when ready
4. Uncomment features one by one as you populate data

This way the original features still work while you set up the new ones!
