-- Stage 2: canonicalize web RLS policies without changing anon/authenticated
-- effective access. PostgreSQL ORs permissive policies, so we snapshot that
-- effective OR expression per table/role/action and recreate exactly one policy.
-- This also wraps auth.uid()/auth.jwt() in init-plan subqueries.

DO $$
DECLARE
  v_anon_oid OID;
  v_authenticated_oid OID;
  v_service_oid OID;
  v_bad_roles TEXT;
BEGIN
  SELECT oid INTO v_anon_oid FROM pg_roles WHERE rolname = 'anon';
  SELECT oid INTO v_authenticated_oid FROM pg_roles WHERE rolname = 'authenticated';
  SELECT oid INTO v_service_oid FROM pg_roles WHERE rolname = 'service_role';

  SELECT string_agg(DISTINCT r.rolname, ', ' ORDER BY r.rolname)
  INTO v_bad_roles
  FROM pg_policy p
  JOIN pg_class c ON c.oid = p.polrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  CROSS JOIN LATERAL unnest(p.polroles) AS x(role_oid)
  LEFT JOIN pg_roles r ON r.oid = x.role_oid
  WHERE n.nspname = 'public'
    AND p.polpermissive = true
    AND x.role_oid <> 0
    AND x.role_oid NOT IN (v_anon_oid, v_authenticated_oid, v_service_oid);

  IF v_bad_roles IS NOT NULL THEN
    RAISE EXCEPTION 'Refusing RLS canonicalization: unexpected policy roles: %', v_bad_roles;
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
  v_role_name TEXT;
  v_role_oid OID;
  v_action_code TEXT;
  v_table RECORD;
  v_using_expr TEXT;
  v_check_expr TEXT;
BEGIN
  FOREACH v_role_name IN ARRAY ARRAY['anon', 'authenticated']
  LOOP
    SELECT oid INTO v_role_oid FROM pg_roles WHERE rolname = v_role_name;

    FOREACH v_action_code IN ARRAY ARRAY['r', 'a', 'w', 'd']
    LOOP
      FOR v_table IN
        SELECT DISTINCT c.oid AS table_oid, n.nspname AS table_schema, c.relname AS table_name
        FROM pg_policy p
        JOIN pg_class c ON c.oid = p.polrelid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
          AND p.polpermissive = true
          AND p.polcmd IN ('*'::"char", v_action_code::"char")
          AND (0::oid = ANY(p.polroles) OR v_role_oid = ANY(p.polroles))
      LOOP
        v_using_expr := NULL;
        v_check_expr := NULL;

        IF v_action_code IN ('r', 'w', 'd') THEN
          SELECT string_agg(
                   '(' || COALESCE(pg_get_expr(p.polqual, p.polrelid, true), 'true') || ')',
                   ' OR ' ORDER BY p.polname
                 )
          INTO v_using_expr
          FROM pg_policy p
          WHERE p.polrelid = v_table.table_oid
            AND p.polpermissive = true
            AND p.polcmd IN ('*'::"char", v_action_code::"char")
            AND (0::oid = ANY(p.polroles) OR v_role_oid = ANY(p.polroles));
        END IF;

        IF v_action_code IN ('a', 'w') THEN
          SELECT string_agg(
                   '(' || COALESCE(
                     pg_get_expr(p.polwithcheck, p.polrelid, true),
                     pg_get_expr(p.polqual, p.polrelid, true),
                     'true'
                   ) || ')',
                   ' OR ' ORDER BY p.polname
                 )
          INTO v_check_expr
          FROM pg_policy p
          WHERE p.polrelid = v_table.table_oid
            AND p.polpermissive = true
            AND p.polcmd IN ('*'::"char", v_action_code::"char")
            AND (0::oid = ANY(p.polroles) OR v_role_oid = ANY(p.polroles));
        END IF;

        IF v_using_expr IS NOT NULL THEN
          v_using_expr := replace(v_using_expr, 'auth.uid()', '(SELECT auth.uid())');
          v_using_expr := replace(v_using_expr, 'auth.jwt()', '(SELECT auth.jwt())');
        END IF;
        IF v_check_expr IS NOT NULL THEN
          v_check_expr := replace(v_check_expr, 'auth.uid()', '(SELECT auth.uid())');
          v_check_expr := replace(v_check_expr, 'auth.jwt()', '(SELECT auth.jwt())');
        END IF;

        INSERT INTO _web_policy_snapshot (
          table_oid, table_schema, table_name, role_name, action_code, using_expr, check_expr
        ) VALUES (
          v_table.table_oid, v_table.table_schema, v_table.table_name,
          v_role_name, v_action_code, v_using_expr, v_check_expr
        )
        ON CONFLICT (table_oid, role_name, action_code) DO UPDATE
        SET using_expr = EXCLUDED.using_expr,
            check_expr = EXCLUDED.check_expr;
      END LOOP;
    END LOOP;
  END LOOP;
END
$$;

-- All permissive public-schema policies currently target only PUBLIC,
-- anon/authenticated, or service_role (validated above). service_role bypasses
-- RLS, so its standalone policies are redundant. Drop the old layer after the
-- anon/authenticated effective semantics have been snapshotted.
DO $$
DECLARE
  v_policy RECORD;
BEGIN
  FOR v_policy IN
    SELECT n.nspname, c.relname, p.polname
    FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND p.polpermissive = true
  LOOP
    EXECUTE format('DROP POLICY %I ON %I.%I', v_policy.polname, v_policy.nspname, v_policy.relname);
  END LOOP;
END
$$;

DO $$
DECLARE
  v_snapshot RECORD;
  v_policy_name TEXT;
  v_action_sql TEXT;
BEGIN
  FOR v_snapshot IN
    SELECT *
    FROM _web_policy_snapshot s
    ORDER BY s.table_schema, s.table_name, s.role_name, s.action_code
  LOOP
    v_policy_name := format(
      'web_%s_%s',
      v_snapshot.role_name,
      CASE v_snapshot.action_code
        WHEN 'r' THEN 'select'
        WHEN 'a' THEN 'insert'
        WHEN 'w' THEN 'update'
        WHEN 'd' THEN 'delete'
      END
    );

    v_action_sql := CASE v_snapshot.action_code
      WHEN 'r' THEN 'SELECT'
      WHEN 'a' THEN 'INSERT'
      WHEN 'w' THEN 'UPDATE'
      WHEN 'd' THEN 'DELETE'
    END;

    IF v_snapshot.action_code IN ('r', 'd') THEN
      EXECUTE format(
        'CREATE POLICY %I ON %I.%I FOR %s TO %I USING (%s)',
        v_policy_name,
        v_snapshot.table_schema,
        v_snapshot.table_name,
        v_action_sql,
        v_snapshot.role_name,
        COALESCE(v_snapshot.using_expr, 'false')
      );
    ELSIF v_snapshot.action_code = 'a' THEN
      EXECUTE format(
        'CREATE POLICY %I ON %I.%I FOR INSERT TO %I WITH CHECK (%s)',
        v_policy_name,
        v_snapshot.table_schema,
        v_snapshot.table_name,
        v_snapshot.role_name,
        COALESCE(v_snapshot.check_expr, 'false')
      );
    ELSE
      EXECUTE format(
        'CREATE POLICY %I ON %I.%I FOR UPDATE TO %I USING (%s) WITH CHECK (%s)',
        v_policy_name,
        v_snapshot.table_schema,
        v_snapshot.table_name,
        v_snapshot.role_name,
        COALESCE(v_snapshot.using_expr, 'false'),
        COALESCE(v_snapshot.check_expr, v_snapshot.using_expr, 'false')
      );
    END IF;
  END LOOP;
END
$$;
