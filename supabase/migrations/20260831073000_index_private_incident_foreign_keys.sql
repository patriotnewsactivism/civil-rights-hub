BEGIN;

-- The production hardening contract requires every public/private foreign key
-- to have a normal (non-partial) index whose leading key columns match the FK.
-- These three relationships were introduced by the private incident/moderation
-- tranche and are now exercised by review/audit lookups.
CREATE INDEX IF NOT EXISTS incident_reports_reviewed_by_idx
  ON public.incident_reports (reviewed_by);

CREATE INDEX IF NOT EXISTS moderation_audit_log_content_report_id_idx
  ON public.moderation_audit_log (content_report_id);

CREATE INDEX IF NOT EXISTS moderation_audit_log_incident_report_id_idx
  ON public.moderation_audit_log (incident_report_id);

COMMIT;
