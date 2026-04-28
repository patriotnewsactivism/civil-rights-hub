-- =============================================================================
-- FIX: Restore RLS policies for attorneys table (dropped in 20260104195614)
-- FIX: Add firm_name column alias so both firm and firm_name work
-- =============================================================================

-- 1. Add firm_name as a generated column that mirrors firm (if not exists)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'attorneys' AND column_name = 'firm_name'
  ) THEN
    -- Add firm_name as a regular column, sync from firm
    ALTER TABLE public.attorneys ADD COLUMN firm_name TEXT;
    UPDATE public.attorneys SET firm_name = firm WHERE firm IS NOT NULL AND firm_name IS NULL;
  END IF;
END $$;

-- 2. Recreate RLS policies (were dropped in migration 20260104195614_remote_schema.sql)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'attorneys' AND policyname = 'Anyone can view attorneys'
  ) THEN
    CREATE POLICY "Anyone can view attorneys"
      ON public.attorneys FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'attorneys' AND policyname = 'Service role can manage attorneys'
  ) THEN
    CREATE POLICY "Service role can manage attorneys"
      ON public.attorneys FOR ALL
      USING (auth.role() = 'service_role');
  END IF;
END $$;

-- 3. Ensure RLS is still enabled
ALTER TABLE public.attorneys ENABLE ROW LEVEL SECURITY;

-- 4. Force RLS for table owner too (belt and suspenders)
ALTER TABLE public.attorneys FORCE ROW LEVEL SECURITY;
