\set ON_ERROR_STOP on

BEGIN;

-- 1. Every public function must have an explicit search_path.
DO $$
DECLARE
  bad TEXT;
BEGIN
  SELECT string_agg(p.oid::regprocedure::text, ', ' ORDER BY p.oid::regprocedure::text)
  INTO bad
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND NOT EXISTS (
      SELECT 1
      FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) cfg
      WHERE cfg LIKE 'search_path=%'
    );

  IF bad IS NOT NULL THEN
    RAISE EXCEPTION 'Public functions without fixed search_path: %', bad;
  END IF;
END
$$;

-- 2. No public SECURITY DEFINER function may be directly executable by browser roles.
DO $$
DECLARE
  bad TEXT;
BEGIN
  SELECT string_agg(p.oid::regprocedure::text, ', ' ORDER BY p.oid::regprocedure::text)
  INTO bad
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.prosecdef = true
    AND (
      has_function_privilege('anon', p.oid, 'EXECUTE')
      OR has_function_privilege('authenticated', p.oid, 'EXECUTE')
    );

  IF bad IS NOT NULL THEN
    RAISE EXCEPTION 'Browser-executable public SECURITY DEFINER functions: %', bad;
  END IF;
END
$$;

-- 3. The browser RPC used by SocialFeed remains callable by authenticated users,
--    but is now SECURITY INVOKER and unavailable to anon.
DO $$
DECLARE
  fn_oid OID;
  is_definer BOOLEAN;
BEGIN
  SELECT to_regprocedure('public.track_hashtag_interest(uuid,text[])')::oid INTO fn_oid;
  IF fn_oid IS NULL THEN
    RAISE EXCEPTION 'track_hashtag_interest RPC is missing';
  END IF;

  SELECT prosecdef INTO is_definer FROM pg_proc WHERE oid = fn_oid;
  IF is_definer THEN
    RAISE EXCEPTION 'track_hashtag_interest must be SECURITY INVOKER';
  END IF;
  IF NOT has_function_privilege('authenticated', fn_oid, 'EXECUTE') THEN
    RAISE EXCEPTION 'authenticated lost EXECUTE on track_hashtag_interest';
  END IF;
  IF has_function_privilege('anon', fn_oid, 'EXECUTE') THEN
    RAISE EXCEPTION 'anon still has EXECUTE on track_hashtag_interest';
  END IF;
END
$$;

-- 4. Recursion-safe RLS helpers must live outside public and retain only the
--    execution grants needed by policies.
DO $$
BEGIN
  IF to_regprocedure('public.get_user_firm_id()') IS NOT NULL
     OR to_regprocedure('public.is_conversation_member(uuid)') IS NOT NULL THEN
    RAISE EXCEPTION 'RLS SECURITY DEFINER helpers remain exposed in public';
  END IF;

  IF to_regprocedure('authz.get_user_firm_id()') IS NULL
     OR to_regprocedure('authz.is_conversation_member(uuid)') IS NULL THEN
    RAISE EXCEPTION 'RLS authz helpers were not moved successfully';
  END IF;

  IF NOT has_function_privilege('authenticated', 'authz.get_user_firm_id()'::regprocedure, 'EXECUTE') THEN
    RAISE EXCEPTION 'authenticated lost get_user_firm_id helper execution';
  END IF;
  IF NOT has_function_privilege('authenticated', 'authz.is_conversation_member(uuid)'::regprocedure, 'EXECUTE') THEN
    RAISE EXCEPTION 'authenticated lost is_conversation_member helper execution';
  END IF;
END
$$;

-- 5. Every RLS-enabled public table must have at least one explicit policy.
DO $$
DECLARE
  bad TEXT;
BEGIN
  SELECT string_agg(format('%I.%I', n.nspname, c.relname), ', ' ORDER BY c.relname)
  INTO bad
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relkind IN ('r', 'p')
    AND c.relrowsecurity = true
    AND NOT EXISTS (SELECT 1 FROM pg_policy p WHERE p.polrelid = c.oid);

  IF bad IS NOT NULL THEN
    RAISE EXCEPTION 'RLS-enabled public tables without policies: %', bad;
  END IF;
END
$$;

-- 6. For anon/authenticated, at most one permissive policy may apply to a given
--    table/action. This validates the canonicalization without relying on names.
DO $$
DECLARE
  bad TEXT;
BEGIN
  WITH browser_roles AS (
    SELECT oid, rolname FROM pg_roles WHERE rolname IN ('anon', 'authenticated')
  ), actions(code, name) AS (
    VALUES ('r'::"char", 'select'), ('a'::"char", 'insert'), ('w'::"char", 'update'), ('d'::"char", 'delete')
  ), collisions AS (
    SELECT n.nspname, c.relname, br.rolname, a.name, count(*) AS policy_count
    FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    CROSS JOIN browser_roles br
    CROSS JOIN actions a
    WHERE n.nspname = 'public'
      AND p.polpermissive = true
      AND p.polcmd IN ('*'::"char", a.code)
      AND (0::oid = ANY(p.polroles) OR br.oid = ANY(p.polroles))
    GROUP BY n.nspname, c.relname, br.rolname, a.name
    HAVING count(*) > 1
  )
  SELECT string_agg(format('%I.%I/%s/%s=%s', nspname, relname, rolname, name, policy_count), ', ')
  INTO bad
  FROM collisions;

  IF bad IS NOT NULL THEN
    RAISE EXCEPTION 'Multiple permissive web policies remain: %', bad;
  END IF;
END
$$;

-- 7. The ten duplicate-index copies selected for removal must be gone.
DO $$
DECLARE
  bad TEXT;
BEGIN
  SELECT string_agg(index_name, ', ' ORDER BY index_name)
  INTO bad
  FROM unnest(ARRAY[
    'public.foia_status_idx',
    'public.live_streams_user_id_idx',
    'public.idx_notifications_unread',
    'public.idx_poll_votes_poll',
    'public.post_reactions_post_idx',
    'public.post_reactions_user_idx',
    'public.reporting_contacts_state_idx',
    'public.state_law_conflicts_state_idx',
    'public.idx_state_laws_code',
    'public.user_verification_status_idx'
  ]) AS index_name
  WHERE to_regclass(index_name) IS NOT NULL;

  IF bad IS NOT NULL THEN
    RAISE EXCEPTION 'Duplicate index copies still exist: %', bad;
  END IF;
END
$$;

-- 8. Every FK in public/private must be covered by an index whose leading key
--    columns match the FK columns.
DO $$
DECLARE
  bad TEXT;
BEGIN
  WITH uncovered AS (
    SELECT n.nspname, c.relname, con.conname
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
  )
  SELECT string_agg(format('%I.%I/%I', nspname, relname, conname), ', ' ORDER BY nspname, relname, conname)
  INTO bad
  FROM uncovered;

  IF bad IS NOT NULL THEN
    RAISE EXCEPTION 'Unindexed foreign keys remain: %', bad;
  END IF;
END
$$;

ROLLBACK;
