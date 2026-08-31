\set ON_ERROR_STOP on
BEGIN;

DO $$
BEGIN
  IF to_regclass('public.incident_reports') IS NULL THEN
    RAISE EXCEPTION 'incident_reports is missing';
  END IF;
  IF to_regclass('public.incident_report_evidence') IS NULL THEN
    RAISE EXCEPTION 'incident_report_evidence is missing';
  END IF;
  IF to_regclass('public.moderation_audit_log') IS NULL THEN
    RAISE EXCEPTION 'moderation_audit_log is missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'incident_reports' AND c.relrowsecurity
  ) THEN
    RAISE EXCEPTION 'incident_reports RLS is not enabled';
  END IF;

  IF has_table_privilege('anon', 'public.incident_reports', 'SELECT')
     OR has_table_privilege('anon', 'public.incident_report_evidence', 'SELECT')
     OR has_table_privilege('anon', 'public.moderation_audit_log', 'SELECT') THEN
    RAISE EXCEPTION 'anonymous role can read private incident/moderation data';
  END IF;

  IF has_table_privilege('authenticated', 'public.incident_reports', 'INSERT')
     OR has_table_privilege('authenticated', 'public.incident_reports', 'UPDATE')
     OR has_table_privilege('authenticated', 'public.incident_reports', 'DELETE') THEN
    RAISE EXCEPTION 'authenticated browser can mutate incident reports outside RPC contract';
  END IF;

  IF has_table_privilege('authenticated', 'public.moderation_audit_log', 'INSERT')
     OR has_table_privilege('authenticated', 'public.moderation_audit_log', 'UPDATE')
     OR has_table_privilege('authenticated', 'public.moderation_audit_log', 'DELETE') THEN
    RAISE EXCEPTION 'authenticated browser can tamper with moderation audit history';
  END IF;

  IF NOT has_function_privilege(
    'authenticated',
    'public.create_incident_report(text,text,timestamp with time zone,text,text,text,text,text,text,text,text,boolean)',
    'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'create_incident_report is unavailable to authenticated users';
  END IF;

  IF NOT has_function_privilege('authenticated', 'public.moderate_content_report(uuid,text,text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'moderate_content_report is unavailable to authenticated staff sessions';
  END IF;

  IF has_function_privilege('anon', 'public.moderate_content_report(uuid,text,text)', 'EXECUTE')
     OR has_function_privilege('anon', 'public.review_incident_report(uuid,text,text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'anonymous role can execute staff review functions';
  END IF;

  IF has_function_privilege('authenticated', 'authz.is_staff()', 'EXECUTE') THEN
    RAISE EXCEPTION 'internal authz helper is directly executable by authenticated clients';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets
    WHERE id = 'incident-evidence' AND public = false AND file_size_limit = 52428800
  ) THEN
    RAISE EXCEPTION 'incident evidence bucket is not private with expected size limit';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'incident_evidence_storage_owner_insert'
  ) OR NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'incident_evidence_storage_staff_select'
  ) THEN
    RAISE EXCEPTION 'incident evidence storage policies are incomplete';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'content_reports'
      AND policyname = 'content_reports_staff_select'
  ) THEN
    RAISE EXCEPTION 'staff content-report visibility policy is missing';
  END IF;
END $$;

ROLLBACK;
