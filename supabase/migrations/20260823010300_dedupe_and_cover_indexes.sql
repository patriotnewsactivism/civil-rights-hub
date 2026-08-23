-- Stage 3: remove definition-identical duplicate indexes and add covering
-- indexes for foreign keys in public/private. Do not bulk-drop zero-scan indexes.

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

DO $$
DECLARE
  v_fk RECORD;
  v_column_list TEXT;
  v_index_name TEXT;
BEGIN
  FOR v_fk IN
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
    INTO v_column_list
    FROM unnest(v_fk.conkey) WITH ORDINALITY AS u(attnum, ordinality)
    JOIN pg_attribute a
      ON a.attrelid = v_fk.conrelid
     AND a.attnum = u.attnum;

    v_index_name := left(
      format('idx_fk_%s_%s', v_fk.relname, substr(md5(v_fk.conname), 1, 8)),
      63
    );

    EXECUTE format(
      'CREATE INDEX IF NOT EXISTS %I ON %I.%I (%s)',
      v_index_name,
      v_fk.nspname,
      v_fk.relname,
      v_column_list
    );
  END LOOP;
END
$$;
