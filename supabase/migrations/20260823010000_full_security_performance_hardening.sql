-- Full Supabase security + performance hardening pass.
--
-- Goals:
--   * eliminate mutable search_path warnings for public functions;
--   * remove browser execution of public SECURITY DEFINER functions;
--   * keep recursion-safe RLS helpers out of the exposed public schema;
--   * preserve the one intentional browser RPC as SECURITY INVOKER;
--   * make fail-closed tables explicit and restore owner-only resource ratings;
--   * collapse permissive web RLS policies to one policy per role/action while
--     preserving their effective OR semantics and optimizing auth init-plans;
--   * remove known duplicate indexes and add covering indexes for FKs.
--
-- This migration intentionally DOES NOT bulk-drop indexes reported merely as
-- "unused". PostgreSQL index usage counters can reset; zero scans alone are not
-- enough evidence to destroy an index safely.

-- ---------------------------------------------------------------------------
-- 1. Function search_path hardening.
-- Browser roles cannot CREATE in public in this project; nevertheless, give
-- every function that lacks an explicit search_path a deterministic one.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  fn RECORD;
BEGIN
  FOR fn IN
    SELECT
      p.oid,
      n.nspname,
      p.proname,
      pg_get_function_identity_arguments(p.oid) AS identity_args
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
      fn.nspname,
      fn.proname,
      fn.identity_args
    );
  END LOOP;
END
$$;

-- ---------------------------------------------------------------------------
-- 2. Move the two SECURITY DEFINER helpers used by RLS out of public.
-- Policies depend on function OIDs, so ALTER FUNCTION ... SET SCHEMA preserves
-- their dependencies while removing the helpers from the exposed RPC schema.
-- ---------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS authz;
REVOKE ALL ON SCHEMA authz FROM PUBLIC;
REVOKE ALL ON SCHEMA authz FROM anon, authenticated;
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
    -- Anonymous callers have auth.uid() = NULL, so this helper safely returns
    -- false. Granting EXECUTE avoids permission errors on legacy public-role
    -- messaging policies while still revealing no rows.
    GRANT EXECUTE ON FUNCTION authz.is_conversation_member(uuid) TO anon, authenticated, service_role;
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- 3. The only browser RPC currently used in source is track_hashtag_interest.
-- It already has owner RLS on user_interests, so it does not need definer power.
-- Keep authenticated access and remove anonymous access.
-- ---------------------------------------------------------------------------
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

-- Every remaining SECURITY DEFINER function in public is internal/trigger/admin
-- infrastructure. Revoke browser execution. Existing triggers call their stored
-- function OIDs and do not require browser EXECUTE on the trigger function.
-- Keep service_role access for trusted server workflows, except the deliberately
-- fail-closed opaque attorney matcher, whose prior migration revoked all roles.
DO $$
DECLARE
  fn RECORD;
BEGIN
  FOR fn IN
    SELECT
      p.oid,
      n.nspname,
      p.proname,
      pg_get_function_identity_arguments(p.oid) AS identity_args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef = true
  LOOP
    EXECUTE format(
      'REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM PUBLIC, anon, authenticated',
      fn.nspname,
      fn.proname,
      fn.identity_args
    );

    IF fn.proname <> 'match_attorneys_for_lead' THEN
      EXECUTE format(
        'GRANT EXECUTE ON FUNCTION %I.%I(%s) TO service_role',
        fn.nspname,
        fn.proname,
        fn.identity_args
      );
    END IF;
  END LOOP;
END
$$;

-- ---------------------------------------------------------------------------
-- 4. Explicit RLS for the six tables that previously had RLS but no policies.
-- Five are intentionally browser fail-closed. resource_ratings is an active
-- owner-only feature used by ResourceLibrary.tsx.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'agencies',
    'officers',
    'challenge_guides',
    'foia_response_documents',
    'know_your_rights_cards'
  ]
  LOOP
    IF to_regclass('public.' || tbl) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'fail_closed_web', tbl);
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)',
        'fail_closed_web',
        tbl
      );
    END IF;
  END LOOP;
END
$$;

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

-- ---------------------------------------------------------------------------
-- 5. Canonicalize web RLS policies.
--
-- PostgreSQL combines PERMISSIVE policies with OR. The legacy schema contains
-- hundreds of overlapping PUBLIC/anon/authenticated policies, causing both the
-- multiple-permissive-policy and auth-init-plan advisor warnings. Snapshot the
-- *effective* policy for anon and authenticated per table/action, then replace
-- the overlapping policy set with exactly one equivalent policy per role/action.
--
-- service_role has BYPASSRLS and therefore does not need service-only policies.
-- Abort if a custom policy role exists so this migration cannot silently alter
-- semantics for an unknown database role.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  anon_oid OID;
  authenticated_oid OID;
  service_oid OID;
  bad_roles TEXT;
BEGIN
  SELECT oid INTO anon_oid FROM pg_roles WHERE rolname = 'anon';
  SELECT oid INTO authenticated_oid FROM pg_roles WHERE rolname = 'authenticated';
  SELECT oid INTO service_oid FROM pg_roles WHERE rolname = 'service_role';

  SELECT string_agg(DISTINCT r.rolname, ', ' ORDER BY r.rolname)
  INTO bad_roles
  FROM pg_policy p
  JOIN pg_class c ON c.oid = p.polrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  CROSS JOIN LATERAL unnest(p.polroles) role_oid
  LEFT JOIN pg_roles r ON r.oid = role_oid
  WHERE n.nspname = 'public'
    AND p.polpermissive = true
    AND role_oid <> 0
    AND role_oid NOT IN (anon_oid, authenticated_oid, service_oid);

  IF bad_roles IS NOT NULL THEN
    RAISE EXCEPTION 'Refusing RLS canonicalization: unexpected policy roles: %', bad_roles;
  END IF;
END
$$;

CREATE TEMP TABLE _web_policy_snapshot (
  table_oid OID NOT NULL,
  table_schema TEXT NOT NULL,
  table_name TEXT NOT NULL,
  role_name TEXT NOT NULL,
  action_code TEXT NOT NULL,
  using_expr TEXT,
  check_expr TEXT,
  PRIMARY KEY (table_oid, role_name, action_code)
) ON COMMIT DROP;

DO $$
DECLARE
  role_name TEXT;
  role_oid OID;
  action_code TEXT;
  tbl RECORD;
  use_expr TEXT;
  chk_expr TEXT;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated']
  LOOP
    SELECT oid INTO role_oid FROM pg_roles WHERE rolname = role_name;

    FOREACH action_code IN ARRAY ARRAY['r', 'a', 'w', 'd']
    LOOP
      FOR tbl IN
        SELECT DISTINCT c.oid AS table_oid, n.nspname AS table_schema, c.relname AS table_name
        FROM pg_policy p
        JOIN pg_class c ON c.oid = p.polrelid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
          AND p.polpermissive = true
          AND p.polcmd IN ('*', action_code::"char")
          AND (0::oid = ANY(p.polroles) OR role_oid = ANY(p.polroles))
      LOOP
        use_expr := NULL;
        chk_expr := NULL;

        IF action_code IN ('r', 'w', 'd') THEN
          SELECT string_agg(
                   '(' || COALESCE(pg_get_expr(p.polqual, p.polrelid, true), 'true') || ')',
                   ' OR ' ORDER BY p.polname
                 )
          INTO use_expr
          FROM pg_policy p
          WHERE p.polrelid = tbl.table_oid
            AND p.polpermissive = true
            AND p.polcmd IN ('*', action_code::"char")
            AND (0::oid = ANY(p.polroles) OR role_oid = ANY(p.polroles));
        END IF;

        IF action_code IN ('a', 'w') THEN
          SELECT string_agg(
                   '(' || COALESCE(
                     pg_get_expr(p.polwithcheck, p.polrelid, true),
                     pg_get_expr(p.polqual, p.polrelid, true),
                     'true'
                   ) || ')',
                   ' OR ' ORDER BY p.polname
                 )
          INTO chk_expr
          FROM pg_policy p
          WHERE p.polrelid = tbl.table_oid
            AND p.polpermissive = true
            AND p.polcmd IN ('*', action_code::"char")
            AND (0::oid = ANY(p.polroles) OR role_oid = ANY(p.polroles));
        END IF;

        -- Supabase/Postgres recommendation: force auth helpers into a one-time
        -- init plan rather than re-evaluating them for every row.
        IF use_expr IS NOT NULL THEN
          use_expr := replace(use_expr, 'auth.uid()', '(SELECT auth.uid())');
          use_expr := replace(use_expr, 'auth.jwt()', '(SELECT auth.jwt())');
        END IF;
        IF chk_expr IS NOT NULL THEN
          chk_expr := replace(chk_expr, 'auth.uid()', '(SELECT auth.uid())');
          chk_expr := replace(chk_expr, 'auth.jwt()', '(SELECT auth.jwt())');
        END IF;

        INSERT INTO _web_policy_snapshot (
          table_oid, table_schema, table_name, role_name, action_code, using_expr, check_expr
        ) VALUES (
          tbl.table_oid, tbl.table_schema, tbl.table_name, role_name, action_code, use_expr, chk_expr
        )
        ON CONFLICT (table_oid, role_name, action_code) DO UPDATE
        SET using_expr = EXCLUDED.using_expr,
            check_expr = EXCLUDED.check_expr;
      END LOOP;
    END LOOP;
  END LOOP;
END
$$;

-- Remove the old permissive policy layer. The preflight above guarantees that
-- it targets only PUBLIC/anon/authenticated/service_role; service_role bypasses
-- RLS, and anon/authenticated semantics were snapshotted above.
DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT n.nspname, c.relname, pol.polname
    FROM pg_policy pol
    JOIN pg_class c ON c.oid = pol.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND pol.polpermissive = true
  LOOP
    EXECUTE format('DROP POLICY %I ON %I.%I', p.polname, p.nspname, p.relname);
  END LOOP;
END
$$;

-- Recreate one effective web policy per role/action.
DO $$
DECLARE
  s RECORD;
  policy_name TEXT;
  action_sql TEXT;
BEGIN
  FOR s IN
    SELECT * FROM _web_policy_snapshot
    ORDER BY table_schema, table_name, role_name, action_code
  LOOP
    policy_name := format(
      'web_%s_%s',
      s.role_name,
      CASE s.action_code
        WHEN 'r' THEN 'select'
        WHEN 'a' THEN 'insert'
        WHEN 'w' THEN 'update'
        WHEN 'd' THEN 'delete'
      END
    );

    action_sql := CASE s.action_code
      WHEN 'r' THEN 'SELECT'
      WHEN 'a' THEN 'INSERT'
      WHEN 'w' THEN 'UPDATE'
      WHEN 'd' THEN 'DELETE'
    END;

    IF s.action_code IN ('r', 'd') THEN
      EXECUTE format(
        'CREATE POLICY %I ON %I.%I FOR %s TO %I USING (%s)',
        policy_name, s.table_schema, s.table_name, action_sql, s.role_name, COALESCE(s.using_expr, 'false')
      );
    ELSIF s.action_code = 'a' THEN
      EXECUTE format(
        'CREATE POLICY %I ON %I.%I FOR INSERT TO %I WITH CHECK (%s)',
        policy_name, s.table_schema, s.table_name, s.role_name, COALESCE(s.check_expr, 'false')
      );
    ELSE
      EXECUTE format(
        'CREATE POLICY %I ON %I.%I FOR UPDATE TO %I USING (%s) WITH CHECK (%s)',
        policy_name, s.table_schema, s.table_name, s.role_name,
        COALESCE(s.using_expr, 'false'), COALESCE(s.check_expr, s.using_expr, 'false')
      );
    END IF;
  END LOOP;
END
$$;

-- ---------------------------------------------------------------------------
-- 6. Remove the ten duplicate-index copies reported by the advisor.
-- Each retained partner is definition-identical according to PostgreSQL.
-- ---------------------------------------------------------------------------
DROP INDEX IF EXISTS public.foia_status_idx;
DROP INDEX IF EXISTS public.live_streams_user_id_idx;
DROP INDEX IF EXISTS public.idx_notifications_unread;
DROP INDEX IF EXISTS public.idx_poll_votes_poll;
DROP INDEX IF EXISTS public.post_reactions_post_idx;
DROP INDEX IF EXISTS public.post_reactions_user_idx;
DROP INDEX IF EXISTS public.reporting_contacts_state_idx;
DROP INDEX IF EXISTS public.state_law_conflicts_state_idx;
DROP INDEX IF EXISTS public.idx_state_laws_code;
DROP INDEX IF EXISTS public.user_verification_status_idx;

-- ---------------------------------------------------------------------------
-- 7. Add covering indexes for every currently unindexed FK in public/private.
-- The prefix comparison avoids creating an index when an existing composite
-- index already begins with the FK columns.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  fk RECORD;
  column_list TEXT;
  index_name TEXT;
BEGIN
  FOR fk IN
    SELECT con.oid, con.conname, con.conrelid, con.conkey, n.nspname, c.relname
    FROM pg_constraint con
    JOIN pg_class c ON c.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE con.contype = 'f'
      AND n.nspname IN ('public', 'private')
      AND NOT EXISTS (
        SELECT 1
        FROM pg_index i
        WHERE i.indrelid = con.conrelid
          AND i.indisvalid = true
          AND i.indisready = true
          AND i.indpred IS NULL
          AND i.indexprs IS NULL
          AND i.indnkeyatts >= cardinality(con.conkey)
          AND NOT EXISTS (
            SELECT 1
            FROM generate_subscripts(con.conkey, 1) s
            WHERE i.indkey[s - 1] <> con.conkey[s]
          )
      )
  LOOP
    SELECT string_agg(format('%I', a.attname), ', ' ORDER BY u.ordinality)
    INTO column_list
    FROM unnest(fk.conkey) WITH ORDINALITY AS u(attnum, ordinality)
    JOIN pg_attribute a
      ON a.attrelid = fk.conrelid
     AND a.attnum = u.attnum;

    index_name := left(
      format('idx_fk_%s_%s', fk.relname, substr(md5(fk.conname), 1, 8)),
      63
    );

    EXECUTE format(
      'CREATE INDEX IF NOT EXISTS %I ON %I.%I (%s)',
      index_name,
      fk.nspname,
      fk.relname,
      column_list
    );
  END LOOP;
END
$$;

COMMENT ON SCHEMA authz IS
  'Non-exposed authorization helpers used by RLS. Browser roles receive USAGE only plus narrowly granted EXECUTE privileges.';
