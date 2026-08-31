BEGIN;

-- Keep one permissive authenticated SELECT policy per sensitive table/action.
-- Owner and staff access remain logically identical, but are expressed in one
-- explicit predicate so the policy surface is easier to audit and cannot drift.

DROP POLICY IF EXISTS incident_reports_owner_select ON public.incident_reports;
DROP POLICY IF EXISTS incident_reports_staff_select ON public.incident_reports;
DROP POLICY IF EXISTS incident_reports_owner_or_staff_select ON public.incident_reports;
CREATE POLICY incident_reports_owner_or_staff_select
  ON public.incident_reports
  FOR SELECT
  TO authenticated
  USING (
    reporter_id = (SELECT auth.uid())
    OR (SELECT authz.is_staff())
  );

DROP POLICY IF EXISTS incident_evidence_owner_select ON public.incident_report_evidence;
DROP POLICY IF EXISTS incident_evidence_staff_select ON public.incident_report_evidence;
DROP POLICY IF EXISTS incident_evidence_owner_or_staff_select ON public.incident_report_evidence;
CREATE POLICY incident_evidence_owner_or_staff_select
  ON public.incident_report_evidence
  FOR SELECT
  TO authenticated
  USING (
    owner_id = (SELECT auth.uid())
    OR (SELECT authz.is_staff())
  );

DROP POLICY IF EXISTS content_reports_owner_select ON public.content_reports;
DROP POLICY IF EXISTS content_reports_staff_select ON public.content_reports;
DROP POLICY IF EXISTS content_reports_owner_or_staff_select ON public.content_reports;
CREATE POLICY content_reports_owner_or_staff_select
  ON public.content_reports
  FOR SELECT
  TO authenticated
  USING (
    reporter_id = (SELECT auth.uid())
    OR (SELECT authz.is_staff())
  );

COMMIT;
