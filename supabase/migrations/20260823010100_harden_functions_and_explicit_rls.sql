-- Stage 1: function privilege/search_path hardening and explicit RLS policies.

-- Give every public function that lacks an explicit search_path a deterministic
-- path. Browser roles cannot CREATE in public in this project, and extensions
-- remains available for extension-owned helpers.
DO $$
DECLARE
  fn RECORD;
BEGIN
  FOR fn IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS identity_args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND NOT EXISTS (
        SELECT 1
        FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) cfg
        WHERE cfg LIKE 'search_path=%'
      )
  LOOP
    EXECUTE format(
      'ALTER FUNCTION %I.%I(%s) SET search_path TO pg_catalog, public, extensions',
      fn.nspname, fn.proname, fn.identity_args
    );
  END LOOP;
END
$$;

-- Recursion-safe RLS helpers need SECURITY DEFINER semantics, but they do not
-- need to be RPC-exposed from public. Move them into a non-exposed authz schema.
CREATE SCHEMA IF NOT EXISTS authz;
REVOKE ALL ON SCHEMA authz FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA authz TO anon, authenticated, service_role;

DO $$
BEGIN
  IF to_regprocedure('public.get_user_firm_id()') IS NOT NULL THEN
    ALTER FUNCTION public.get_user_firm_id() SET SCHEMA authz;
  END IF;
  IF to_regprocedure('public.is_conversation_member(uuid)') IS NOT NULL THEN
    ALTER FUNCTION public.is_conversation_member(uuid) SET SCHEMA authz;
  END IF;
END
$$;

DO $$
BEGIN
  IF to_regprocedure('authz.get_user_firm_id()') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION authz.get_user_firm_id() FROM PUBLIC, anon;
    GRANT EXECUTE ON FUNCTION authz.get_user_firm_id() TO authenticated, service_role;
  END IF;
  IF to_regprocedure('authz.is_conversation_member(uuid)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION authz.is_conversation_member(uuid) FROM PUBLIC;
    GRANT EXECUTE ON FUNCTION authz.is_conversation_member(uuid) TO anon, authenticated, service_role;
  END IF;
END
$$;

-- SocialFeed's direct browser RPC does not require definer power because its
-- target table already has owner RLS. Keep authenticated execution only.
DO $$
BEGIN
  IF to_regprocedure('public.track_hashtag_interest(uuid,text[])') IS NOT NULL THEN
    ALTER FUNCTION public.track_hashtag_interest(uuid, text[]) SECURITY INVOKER;
    ALTER FUNCTION public.track_hashtag_interest(uuid, text[])
      SET search_path TO pg_catalog, public;
    REVOKE ALL ON FUNCTION public.track_hashtag_interest(uuid, text[]) FROM PUBLIC, anon;
    GRANT EXECUTE ON FUNCTION public.track_hashtag_interest(uuid, text[]) TO authenticated, service_role;
  END IF;
END
$$;

-- Every remaining public SECURITY DEFINER function is internal trigger/admin
-- infrastructure. Remove direct browser RPC execution. Keep service_role for
-- trusted server workflows, except the deliberately fail-closed opaque matcher.
DO $$
DECLARE
  fn RECORD;
BEGIN
  FOR fn IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS identity_args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef = true
  LOOP
    EXECUTE format(
      'REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM PUBLIC, anon, authenticated',
      fn.nspname, fn.proname, fn.identity_args
    );
    IF fn.proname <> 'match_attorneys_for_lead' THEN
      EXECUTE format(
        'GRANT EXECUTE ON FUNCTION %I.%I(%s) TO service_role',
        fn.nspname, fn.proname, fn.identity_args
      );
    END IF;
  END LOOP;
END
$$;

-- Five deliberately unpublishable legacy tables get an explicit fail-closed
-- browser policy so RLS intent is visible and advisor-clean.
DO $$
DECLARE
  v_table_name TEXT;
BEGIN
  FOREACH v_table_name IN ARRAY ARRAY[
    'agencies',
    'officers',
    'challenge_guides',
    'foia_response_documents',
    'know_your_rights_cards'
  ]
  LOOP
    IF to_regclass('public.' || v_table_name) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', v_table_name);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'fail_closed_web', v_table_name);
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)',
        'fail_closed_web', v_table_name
      );
    END IF;
  END LOOP;
END
$$;

-- Resource ratings are an active owner-only feature used by ResourceLibrary.
DO $$
BEGIN
  IF to_regclass('public.resource_ratings') IS NOT NULL THEN
    ALTER TABLE public.resource_ratings ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view own resource ratings" ON public.resource_ratings;
    DROP POLICY IF EXISTS "Users can create own resource ratings" ON public.resource_ratings;
    DROP POLICY IF EXISTS "Users can update own resource ratings" ON public.resource_ratings;
    DROP POLICY IF EXISTS "Users can delete own resource ratings" ON public.resource_ratings;

    CREATE POLICY "Users can view own resource ratings"
      ON public.resource_ratings FOR SELECT TO authenticated
      USING (user_id = (SELECT auth.uid()));
    CREATE POLICY "Users can create own resource ratings"
      ON public.resource_ratings FOR INSERT TO authenticated
      WITH CHECK (user_id = (SELECT auth.uid()));
    CREATE POLICY "Users can update own resource ratings"
      ON public.resource_ratings FOR UPDATE TO authenticated
      USING (user_id = (SELECT auth.uid()))
      WITH CHECK (user_id = (SELECT auth.uid()));
    CREATE POLICY "Users can delete own resource ratings"
      ON public.resource_ratings FOR DELETE TO authenticated
      USING (user_id = (SELECT auth.uid()));
  END IF;
END
$$;

COMMENT ON SCHEMA authz IS
  'Non-exposed authorization helpers used by RLS; only narrowly scoped EXECUTE privileges are granted.';
