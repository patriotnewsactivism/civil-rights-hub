BEGIN;

-- Civil Rights Hub production tranche: separate sensitive incident records from
-- the legacy public `violations` community feed and move moderation actions
-- behind audited, server-authoritative functions.

CREATE SCHEMA IF NOT EXISTS authz;
REVOKE ALL ON SCHEMA authz FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION authz.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('moderator', 'admin', 'super_admin')
  );
$$;

REVOKE ALL ON FUNCTION authz.is_staff() FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS public.incident_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  incident_at timestamptz NOT NULL,
  location_state text NOT NULL,
  location_city text,
  jurisdiction text,
  category text NOT NULL DEFAULT 'other',
  agency_name text,
  officer_name text,
  officer_badge text,
  officer_rank text,
  status text NOT NULL DEFAULT 'draft',
  privacy_setting text NOT NULL DEFAULT 'private',
  submitted_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  resolution_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT incident_reports_title_length CHECK (char_length(btrim(title)) BETWEEN 5 AND 200),
  CONSTRAINT incident_reports_description_length CHECK (char_length(btrim(description)) BETWEEN 20 AND 10000),
  CONSTRAINT incident_reports_state_length CHECK (char_length(btrim(location_state)) BETWEEN 2 AND 80),
  CONSTRAINT incident_reports_category_check CHECK (
    category IN ('police', 'jail_prison', 'court', 'protest_speech', 'housing', 'employment', 'education', 'disability', 'voting', 'discrimination', 'retaliation', 'surveillance_privacy', 'other')
  ),
  CONSTRAINT incident_reports_status_check CHECK (
    status IN ('draft', 'submitted', 'under_review', 'needs_info', 'closed')
  ),
  CONSTRAINT incident_reports_privacy_check CHECK (
    privacy_setting IN ('private', 'review_team')
  ),
  CONSTRAINT incident_reports_submission_consistency CHECK (
    (status = 'draft' AND submitted_at IS NULL)
    OR (status <> 'draft' AND submitted_at IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS incident_reports_reporter_created_idx
  ON public.incident_reports (reporter_id, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS incident_reports_review_queue_idx
  ON public.incident_reports (status, submitted_at DESC)
  WHERE status IN ('submitted', 'under_review', 'needs_info');
CREATE INDEX IF NOT EXISTS incident_reports_state_category_idx
  ON public.incident_reports (location_state, category)
  WHERE status <> 'draft';

CREATE OR REPLACE FUNCTION public.touch_incident_report_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.touch_incident_report_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS touch_incident_report_updated_at_trigger ON public.incident_reports;
CREATE TRIGGER touch_incident_report_updated_at_trigger
BEFORE UPDATE ON public.incident_reports
FOR EACH ROW EXECUTE FUNCTION public.touch_incident_report_updated_at();

ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS incident_reports_owner_select ON public.incident_reports;
DROP POLICY IF EXISTS incident_reports_staff_select ON public.incident_reports;
CREATE POLICY incident_reports_owner_select
  ON public.incident_reports FOR SELECT TO authenticated
  USING (reporter_id = (SELECT auth.uid()));
CREATE POLICY incident_reports_staff_select
  ON public.incident_reports FOR SELECT TO authenticated
  USING ((SELECT authz.is_staff()));

REVOKE ALL ON public.incident_reports FROM anon, authenticated;
GRANT SELECT ON public.incident_reports TO authenticated;

CREATE TABLE IF NOT EXISTS public.incident_report_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.incident_reports(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path text NOT NULL UNIQUE,
  original_filename text NOT NULL,
  mime_type text NOT NULL,
  byte_size bigint NOT NULL,
  sha256 text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT incident_evidence_filename_length CHECK (char_length(original_filename) BETWEEN 1 AND 255),
  CONSTRAINT incident_evidence_size_check CHECK (byte_size > 0 AND byte_size <= 52428800),
  CONSTRAINT incident_evidence_mime_check CHECK (
    mime_type IN (
      'image/jpeg', 'image/png', 'image/webp',
      'video/mp4', 'video/webm',
      'audio/mpeg', 'audio/mp4', 'audio/ogg',
      'application/pdf', 'text/plain'
    )
  ),
  CONSTRAINT incident_evidence_sha256_check CHECK (sha256 IS NULL OR sha256 ~ '^[0-9a-fA-F]{64}$')
);

CREATE INDEX IF NOT EXISTS incident_report_evidence_report_idx
  ON public.incident_report_evidence (report_id, created_at DESC);
CREATE INDEX IF NOT EXISTS incident_report_evidence_owner_idx
  ON public.incident_report_evidence (owner_id, created_at DESC);

ALTER TABLE public.incident_report_evidence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS incident_evidence_owner_select ON public.incident_report_evidence;
DROP POLICY IF EXISTS incident_evidence_staff_select ON public.incident_report_evidence;
CREATE POLICY incident_evidence_owner_select
  ON public.incident_report_evidence FOR SELECT TO authenticated
  USING (owner_id = (SELECT auth.uid()));
CREATE POLICY incident_evidence_staff_select
  ON public.incident_report_evidence FOR SELECT TO authenticated
  USING ((SELECT authz.is_staff()));

REVOKE ALL ON public.incident_report_evidence FROM anon, authenticated;
GRANT SELECT ON public.incident_report_evidence TO authenticated;

CREATE TABLE IF NOT EXISTS public.moderation_audit_log (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  content_report_id uuid REFERENCES public.content_reports(id) ON DELETE SET NULL,
  incident_report_id uuid REFERENCES public.incident_reports(id) ON DELETE SET NULL,
  note text,
  snapshot jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT moderation_audit_action_length CHECK (char_length(action) BETWEEN 2 AND 80),
  CONSTRAINT moderation_audit_target_type_length CHECK (char_length(target_type) BETWEEN 2 AND 80),
  CONSTRAINT moderation_audit_note_length CHECK (note IS NULL OR char_length(note) <= 4000)
);

CREATE INDEX IF NOT EXISTS moderation_audit_created_idx
  ON public.moderation_audit_log (created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS moderation_audit_target_idx
  ON public.moderation_audit_log (target_type, target_id, created_at DESC);
CREATE INDEX IF NOT EXISTS moderation_audit_actor_idx
  ON public.moderation_audit_log (actor_id, created_at DESC);

ALTER TABLE public.moderation_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS moderation_audit_staff_select ON public.moderation_audit_log;
CREATE POLICY moderation_audit_staff_select
  ON public.moderation_audit_log FOR SELECT TO authenticated
  USING ((SELECT authz.is_staff()));

REVOKE ALL ON public.moderation_audit_log FROM anon, authenticated;
GRANT SELECT ON public.moderation_audit_log TO authenticated;

-- Private evidence bucket. It is intentionally not publicly readable.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'incident-evidence',
  'incident-evidence',
  false,
  52428800,
  ARRAY[
    'image/jpeg', 'image/png', 'image/webp',
    'video/mp4', 'video/webm',
    'audio/mpeg', 'audio/mp4', 'audio/ogg',
    'application/pdf', 'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS incident_evidence_storage_owner_select ON storage.objects;
DROP POLICY IF EXISTS incident_evidence_storage_staff_select ON storage.objects;
DROP POLICY IF EXISTS incident_evidence_storage_owner_insert ON storage.objects;
DROP POLICY IF EXISTS incident_evidence_storage_owner_delete ON storage.objects;

CREATE POLICY incident_evidence_storage_owner_select
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'incident-evidence'
    AND split_part(name, '/', 1) = (SELECT auth.uid())::text
  );

CREATE POLICY incident_evidence_storage_staff_select
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'incident-evidence'
    AND (SELECT authz.is_staff())
  );

CREATE POLICY incident_evidence_storage_owner_insert
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'incident-evidence'
    AND split_part(name, '/', 1) = (SELECT auth.uid())::text
    AND EXISTS (
      SELECT 1
      FROM public.incident_reports r
      WHERE r.reporter_id = (SELECT auth.uid())
        AND r.id::text = split_part(name, '/', 2)
        AND r.status IN ('draft', 'needs_info')
    )
  );

CREATE POLICY incident_evidence_storage_owner_delete
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'incident-evidence'
    AND split_part(name, '/', 1) = (SELECT auth.uid())::text
    AND EXISTS (
      SELECT 1
      FROM public.incident_reports r
      WHERE r.reporter_id = (SELECT auth.uid())
        AND r.id::text = split_part(name, '/', 2)
        AND r.status IN ('draft', 'needs_info')
    )
  );

CREATE OR REPLACE FUNCTION public.create_incident_report(
  p_title text,
  p_description text,
  p_incident_at timestamptz,
  p_location_state text,
  p_location_city text DEFAULT NULL,
  p_jurisdiction text DEFAULT NULL,
  p_category text DEFAULT 'other',
  p_agency_name text DEFAULT NULL,
  p_officer_name text DEFAULT NULL,
  p_officer_badge text DEFAULT NULL,
  p_officer_rank text DEFAULT NULL,
  p_submit boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_id uuid;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.incident_reports (
    reporter_id, title, description, incident_at, location_state, location_city,
    jurisdiction, category, agency_name, officer_name, officer_badge, officer_rank,
    status, privacy_setting, submitted_at
  ) VALUES (
    v_actor, btrim(p_title), btrim(p_description), p_incident_at, btrim(p_location_state),
    NULLIF(btrim(COALESCE(p_location_city, '')), ''),
    NULLIF(btrim(COALESCE(p_jurisdiction, '')), ''),
    COALESCE(NULLIF(btrim(p_category), ''), 'other'),
    NULLIF(btrim(COALESCE(p_agency_name, '')), ''),
    NULLIF(btrim(COALESCE(p_officer_name, '')), ''),
    NULLIF(btrim(COALESCE(p_officer_badge, '')), ''),
    NULLIF(btrim(COALESCE(p_officer_rank, '')), ''),
    CASE WHEN p_submit THEN 'submitted' ELSE 'draft' END,
    'private',
    CASE WHEN p_submit THEN now() ELSE NULL END
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_my_incident_report(
  p_report_id uuid,
  p_title text,
  p_description text,
  p_incident_at timestamptz,
  p_location_state text,
  p_location_city text DEFAULT NULL,
  p_jurisdiction text DEFAULT NULL,
  p_category text DEFAULT 'other',
  p_agency_name text DEFAULT NULL,
  p_officer_name text DEFAULT NULL,
  p_officer_badge text DEFAULT NULL,
  p_officer_rank text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor uuid := auth.uid();
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  UPDATE public.incident_reports
  SET title = btrim(p_title),
      description = btrim(p_description),
      incident_at = p_incident_at,
      location_state = btrim(p_location_state),
      location_city = NULLIF(btrim(COALESCE(p_location_city, '')), ''),
      jurisdiction = NULLIF(btrim(COALESCE(p_jurisdiction, '')), ''),
      category = COALESCE(NULLIF(btrim(p_category), ''), 'other'),
      agency_name = NULLIF(btrim(COALESCE(p_agency_name, '')), ''),
      officer_name = NULLIF(btrim(COALESCE(p_officer_name, '')), ''),
      officer_badge = NULLIF(btrim(COALESCE(p_officer_badge, '')), ''),
      officer_rank = NULLIF(btrim(COALESCE(p_officer_rank, '')), '')
  WHERE id = p_report_id
    AND reporter_id = v_actor
    AND status IN ('draft', 'needs_info');

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Incident report is not editable' USING ERRCODE = '42501';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_my_incident_report(p_report_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor uuid := auth.uid();
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  UPDATE public.incident_reports
  SET status = 'submitted',
      submitted_at = COALESCE(submitted_at, now()),
      reviewed_by = NULL,
      reviewed_at = NULL,
      resolution_summary = NULL
  WHERE id = p_report_id
    AND reporter_id = v_actor
    AND status IN ('draft', 'needs_info');

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Incident report cannot be submitted' USING ERRCODE = '42501';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_my_draft_incident_report(p_report_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor uuid := auth.uid();
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.incident_report_evidence e
    WHERE e.report_id = p_report_id AND e.owner_id = v_actor
  ) THEN
    RAISE EXCEPTION 'Remove evidence files before deleting this draft' USING ERRCODE = '23503';
  END IF;

  DELETE FROM public.incident_reports
  WHERE id = p_report_id
    AND reporter_id = v_actor
    AND status = 'draft';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Only your own draft reports can be deleted' USING ERRCODE = '42501';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.register_incident_evidence(
  p_report_id uuid,
  p_storage_path text,
  p_original_filename text,
  p_mime_type text,
  p_byte_size bigint,
  p_sha256 text DEFAULT NULL,
  p_description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage, pg_temp
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_id uuid;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.incident_reports r
    WHERE r.id = p_report_id
      AND r.reporter_id = v_actor
      AND r.status IN ('draft', 'needs_info')
  ) THEN
    RAISE EXCEPTION 'Incident report is not editable' USING ERRCODE = '42501';
  END IF;

  IF split_part(p_storage_path, '/', 1) <> v_actor::text
     OR split_part(p_storage_path, '/', 2) <> p_report_id::text THEN
    RAISE EXCEPTION 'Invalid evidence storage path' USING ERRCODE = '42501';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM storage.objects o
    WHERE o.bucket_id = 'incident-evidence' AND o.name = p_storage_path
  ) THEN
    RAISE EXCEPTION 'Evidence object does not exist' USING ERRCODE = '23503';
  END IF;

  INSERT INTO public.incident_report_evidence (
    report_id, owner_id, storage_path, original_filename, mime_type,
    byte_size, sha256, description
  ) VALUES (
    p_report_id, v_actor, p_storage_path, left(p_original_filename, 255),
    p_mime_type, p_byte_size, NULLIF(lower(COALESCE(p_sha256, '')), ''),
    NULLIF(btrim(COALESCE(p_description, '')), '')
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.unregister_incident_evidence(p_evidence_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_path text;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.incident_report_evidence e
  USING public.incident_reports r
  WHERE e.id = p_evidence_id
    AND r.id = e.report_id
    AND e.owner_id = v_actor
    AND r.reporter_id = v_actor
    AND r.status IN ('draft', 'needs_info')
  RETURNING e.storage_path INTO v_path;

  IF v_path IS NULL THEN
    RAISE EXCEPTION 'Evidence is not removable' USING ERRCODE = '42501';
  END IF;

  RETURN v_path;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT auth.uid() IS NOT NULL AND authz.is_staff();
$$;

CREATE OR REPLACE FUNCTION public.moderate_content_report(
  p_report_id uuid,
  p_action text,
  p_note text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_report public.content_reports%ROWTYPE;
  v_snapshot jsonb;
BEGIN
  IF v_actor IS NULL OR NOT authz.is_staff() THEN
    RAISE EXCEPTION 'Moderator or administrator role required' USING ERRCODE = '42501';
  END IF;

  IF p_action NOT IN ('dismiss', 'remove') THEN
    RAISE EXCEPTION 'Unsupported moderation action';
  END IF;

  SELECT * INTO v_report
  FROM public.content_reports
  WHERE id = p_report_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Content report not found' USING ERRCODE = 'P0002';
  END IF;

  IF v_report.status <> 'pending' THEN
    RAISE EXCEPTION 'Content report is already resolved';
  END IF;

  IF p_action = 'dismiss' THEN
    UPDATE public.content_reports
    SET status = 'dismissed', reviewed_by = v_actor, reviewed_at = now()
    WHERE id = v_report.id;

    INSERT INTO public.moderation_audit_log (
      actor_id, action, target_type, target_id, content_report_id, note, metadata
    ) VALUES (
      v_actor, 'report_dismissed', v_report.content_type, v_report.content_id,
      v_report.id, NULLIF(btrim(COALESCE(p_note, '')), ''),
      jsonb_build_object('reason', v_report.reason)
    );
    RETURN;
  END IF;

  CASE v_report.content_type
    WHEN 'post' THEN
      SELECT to_jsonb(t) INTO v_snapshot FROM public.posts t WHERE t.id = v_report.content_id;
      DELETE FROM public.posts WHERE id = v_report.content_id;
    WHEN 'comment' THEN
      SELECT to_jsonb(t) INTO v_snapshot FROM public.comments t WHERE t.id = v_report.content_id;
      DELETE FROM public.comments WHERE id = v_report.content_id;
    WHEN 'thread' THEN
      SELECT to_jsonb(t) INTO v_snapshot FROM public.forum_threads t WHERE t.id = v_report.content_id;
      DELETE FROM public.forum_threads WHERE id = v_report.content_id;
    WHEN 'violation' THEN
      SELECT to_jsonb(t) INTO v_snapshot FROM public.violations t WHERE t.id = v_report.content_id;
      DELETE FROM public.violations WHERE id = v_report.content_id;
    ELSE
      RAISE EXCEPTION 'Unsupported content type: %', v_report.content_type;
  END CASE;

  UPDATE public.content_reports
  SET status = 'resolved', reviewed_by = v_actor, reviewed_at = now()
  WHERE id = v_report.id;

  INSERT INTO public.moderation_audit_log (
    actor_id, action, target_type, target_id, content_report_id, note, snapshot, metadata
  ) VALUES (
    v_actor, 'content_removed', v_report.content_type, v_report.content_id,
    v_report.id, NULLIF(btrim(COALESCE(p_note, '')), ''), v_snapshot,
    jsonb_build_object('reason', v_report.reason, 'content_existed', v_snapshot IS NOT NULL)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.review_incident_report(
  p_report_id uuid,
  p_status text,
  p_note text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_before jsonb;
BEGIN
  IF v_actor IS NULL OR NOT authz.is_staff() THEN
    RAISE EXCEPTION 'Moderator or administrator role required' USING ERRCODE = '42501';
  END IF;

  IF p_status NOT IN ('under_review', 'needs_info', 'closed') THEN
    RAISE EXCEPTION 'Invalid incident review status';
  END IF;

  SELECT to_jsonb(r) INTO v_before
  FROM public.incident_reports r
  WHERE r.id = p_report_id
  FOR UPDATE;

  IF v_before IS NULL THEN
    RAISE EXCEPTION 'Incident report not found' USING ERRCODE = 'P0002';
  END IF;

  IF COALESCE(v_before->>'status', '') = 'draft' THEN
    RAISE EXCEPTION 'Draft incident reports cannot enter staff review';
  END IF;

  UPDATE public.incident_reports
  SET status = p_status,
      reviewed_by = v_actor,
      reviewed_at = now(),
      resolution_summary = CASE
        WHEN p_status IN ('needs_info', 'closed') THEN NULLIF(btrim(COALESCE(p_note, '')), '')
        ELSE resolution_summary
      END
  WHERE id = p_report_id;

  INSERT INTO public.moderation_audit_log (
    actor_id, action, target_type, target_id, incident_report_id, note, snapshot, metadata
  ) VALUES (
    v_actor, 'incident_status_changed', 'incident_report', p_report_id,
    p_report_id, NULLIF(btrim(COALESCE(p_note, '')), ''), v_before,
    jsonb_build_object('new_status', p_status, 'previous_status', v_before->>'status')
  );
END;
$$;

-- Staff need to see content reports, but updates remain server-authoritative so
-- every decision is written to moderation_audit_log.
DROP POLICY IF EXISTS content_reports_staff_select ON public.content_reports;
CREATE POLICY content_reports_staff_select
  ON public.content_reports FOR SELECT TO authenticated
  USING ((SELECT authz.is_staff()));

REVOKE UPDATE, DELETE ON public.content_reports FROM authenticated;

REVOKE ALL ON FUNCTION public.create_incident_report(text,text,timestamptz,text,text,text,text,text,text,text,text,boolean) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.update_my_incident_report(uuid,text,text,timestamptz,text,text,text,text,text,text,text,text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.submit_my_incident_report(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.delete_my_draft_incident_report(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.register_incident_evidence(uuid,text,text,text,bigint,text,text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.unregister_incident_evidence(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_current_user_staff() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.moderate_content_report(uuid,text,text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.review_incident_report(uuid,text,text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.create_incident_report(text,text,timestamptz,text,text,text,text,text,text,text,text,boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_my_incident_report(uuid,text,text,timestamptz,text,text,text,text,text,text,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_my_incident_report(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_my_draft_incident_report(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_incident_evidence(uuid,text,text,text,bigint,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unregister_incident_evidence(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_staff() TO authenticated;
GRANT EXECUTE ON FUNCTION public.moderate_content_report(uuid,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.review_incident_report(uuid,text,text) TO authenticated;

COMMENT ON TABLE public.incident_reports IS
  'Private civil-rights incident intake. This is intentionally separate from the public community violations feed.';
COMMENT ON TABLE public.incident_report_evidence IS
  'Private evidence metadata for incident reports. Files live in the non-public incident-evidence storage bucket.';
COMMENT ON TABLE public.moderation_audit_log IS
  'Append-only audit history for staff moderation and sensitive incident review actions.';

COMMIT;
