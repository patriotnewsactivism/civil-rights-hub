# Database Setup Guide

## Supabase Connection Status

The application is configured to connect to Supabase with the following credentials (from `.env`):

- **Project ID**: `tgkxehkgwxlqausmrqxh`
- **URL**: `https://tgkxehkgwxlqausmrqxh.supabase.co`
- **Anon Key**: Configured in `.env`

## Applying Database Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/tgkxehkgwxlqausmrqxh)
2. Navigate to **SQL Editor**
3. Run the migration files in order from `supabase/migrations/` directory
4. The files are numbered and will execute in chronological order

### Option 2: Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
npx supabase link --project-ref tgkxehkgwxlqausmrqxh

# Push all migrations
npx supabase db push

# Verify connection
node scripts/verify-and-seed-db.js
```

### Option 3: Manual SQL Execution

Copy and paste the contents of each migration file from `supabase/migrations/` into the Supabase SQL Editor, executing them in order by filename.

## Migration Files

The following migrations are included (in order):

1. **Initial Tables**: `20251110100000_*.sql` - Core tables (attorneys, state_laws, federal_laws, etc.)
2. **Seed Data**: `20251110100007_seed_state_data.sql` - Initial state and attorney data
3. **Community Features**: `20251110110000_*.sql` - Forums, engagement, profiles
4. **Activists**: `20251112030000_*.sql` - Activist directory
5. **Accountability**: `20251112030100_*.sql` - Agency tracking
6. **Federal Data**: `20251112040000_*.sql` - Federal laws, scanners, FOIA templates
7. **Resource Library**: `20251112050000_*.sql` - Educational resources
8. **Comprehensive Data**: `20251114_*.sql` - Enhanced attorney/activist databases
9. **Corrections**: `20251114120200_*.sql` - Removed fabricated entries
10. **Press Freedom**: `20251115090000_*.sql` - Press freedom tracking
11. **Social Features**: `20251117000000_*.sql` - Enhanced profiles, notifications
12. **Latest Additions**: `20260104_*.sql` - Marijuana laws, FOIA agencies, comprehensive seeds

## Database Tables

### Primary Tables

- **violations** - User-submitted civil rights violation reports
- **violation_comments** - Comments on violation reports
- **attorneys** - Civil rights attorney directory (1000+ entries)
- **state_laws** - State-by-state recording laws and civil rights info
- **federal_laws** - Federal civil rights statutes
- **scanner_links** - Police scanner feeds by location (500+ entries)
- **court_calendars** - Upcoming civil rights hearings
- **foia_templates** - FOIA request templates (50+ templates)
- **foia_agencies** - Federal agency FOIA contact directory
- **forum_threads** - Community discussion board threads
- **forum_posts** - Forum thread replies
- **activists** - Civil rights activist directory (500+ entries)
- **agencies** - Government agency tracking
- **legislation** - Bill tracking

### Supporting Tables

- **user_profiles** - Extended user profile data
- **notifications** - User notification system
- **press_freedom_tracker** - Press freedom incident tracking
- **scanner_frequencies** - Radio frequencies for scanners

## Verifying Database

Run the verification script to check table counts:

```bash
node scripts/verify-and-seed-db.js
```

Expected output:
- ✅ All tables should show record counts
- Total records should be 2000+ across all tables

## Troubleshooting

### "fetch failed" or Network Errors

This typically means:
1. The Supabase project hasn't been created yet
2. Migrations haven't been applied
3. Network connectivity issues

**Solution**: Apply migrations using Supabase Dashboard SQL Editor

### "relation does not exist"

This means the tables haven't been created.

**Solution**: Run migrations in order from `supabase/migrations/`

### Empty Tables

Some tables like `violations` and `violation_comments` are meant to be populated by users, but we've added sample data in the latest migration (`20260104150000_comprehensive_seed_all_tables.sql`).

**Solution**: Ensure this migration has been applied

## Production Deployment

For Vercel deployment, ensure these environment variables are set:

```bash
VITE_SUPABASE_URL=https://tgkxehkgwxlqausmrqxh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRna3hlaGtnd3hscWF1c21ycXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMTEzMzgsImV4cCI6MjA3NTg4NzMzOH0.fD2LGiD9OsNt5EWWm2v9ONWFIGvZNXft1Om_yLUhmSM
```

These variables are already configured in the `.env` file for local development.
