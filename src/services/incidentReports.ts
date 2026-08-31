import { supabase } from "@/integrations/supabase/client";

export type IncidentReportStatus = "draft" | "submitted" | "under_review" | "needs_info" | "closed";
export type IncidentCategory =
  | "police"
  | "jail_prison"
  | "court"
  | "protest_speech"
  | "housing"
  | "employment"
  | "education"
  | "disability"
  | "voting"
  | "discrimination"
  | "retaliation"
  | "surveillance_privacy"
  | "other";

export interface IncidentReportInput {
  title: string;
  description: string;
  incidentAt: string;
  locationState: string;
  locationCity?: string;
  jurisdiction?: string;
  category?: IncidentCategory;
  agencyName?: string;
  officerName?: string;
  officerBadge?: string;
  officerRank?: string;
}

export interface IncidentReportRecord {
  id: string;
  reporter_id: string;
  title: string;
  description: string;
  incident_at: string;
  location_state: string;
  location_city: string | null;
  jurisdiction: string | null;
  category: IncidentCategory;
  agency_name: string | null;
  officer_name: string | null;
  officer_badge: string | null;
  officer_rank: string | null;
  status: IncidentReportStatus;
  privacy_setting: "private" | "review_team";
  submitted_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  resolution_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface IncidentEvidenceRecord {
  id: string;
  report_id: string;
  owner_id?: string;
  storage_path?: string;
  original_filename: string;
  mime_type: string;
  byte_size: number;
  sha256: string | null;
  description: string | null;
  created_at: string;
}

const db = supabase as any;

function rpcPayload(input: IncidentReportInput) {
  return {
    p_title: input.title.trim(),
    p_description: input.description.trim(),
    p_incident_at: new Date(input.incidentAt).toISOString(),
    p_location_state: input.locationState.trim(),
    p_location_city: input.locationCity?.trim() || null,
    p_jurisdiction: input.jurisdiction?.trim() || null,
    p_category: input.category || "other",
    p_agency_name: input.agencyName?.trim() || null,
    p_officer_name: input.officerName?.trim() || null,
    p_officer_badge: input.officerBadge?.trim() || null,
    p_officer_rank: input.officerRank?.trim() || null,
  };
}

export async function createIncidentReport(input: IncidentReportInput, submit = false) {
  const { data, error } = await db.rpc("create_incident_report", {
    ...rpcPayload(input),
    p_submit: submit,
  });
  if (error) throw error;
  return data as string;
}

export async function updateIncidentReport(reportId: string, input: IncidentReportInput) {
  const { error } = await db.rpc("update_my_incident_report", {
    p_report_id: reportId,
    ...rpcPayload(input),
  });
  if (error) throw error;
}

export async function submitIncidentReport(reportId: string) {
  const { error } = await db.rpc("submit_my_incident_report", { p_report_id: reportId });
  if (error) throw error;
}

export async function deleteDraftIncidentReport(reportId: string) {
  const { error } = await db.rpc("delete_my_draft_incident_report", { p_report_id: reportId });
  if (error) throw error;
}

export async function listMyIncidentReports() {
  const { data, error } = await db
    .from("incident_reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as IncidentReportRecord[];
}

export async function listReviewableIncidentReports() {
  const { data, error } = await db
    .from("incident_reports")
    .select("*")
    .in("status", ["submitted", "under_review", "needs_info", "closed"])
    .order("submitted_at", { ascending: false, nullsFirst: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as IncidentReportRecord[];
}

export async function listIncidentEvidence(reportId: string) {
  const { data, error } = await db
    .from("incident_report_evidence")
    .select("*")
    .eq("report_id", reportId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as IncidentEvidenceRecord[];
}

export async function uploadIncidentEvidence(reportId: string, file: File, description?: string) {
  if (!file.size || file.size > 50 * 1024 * 1024) {
    throw new Error("Evidence files must be between 1 byte and 50 MB.");
  }

  const form = new FormData();
  form.append("report_id", reportId);
  form.append("file", file, file.name);
  if (description?.trim()) form.append("description", description.trim());

  const { data, error } = await supabase.functions.invoke("upload-incident-evidence", {
    body: form,
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data?.evidence as IncidentEvidenceRecord;
}

export async function getIncidentEvidenceUrl(storagePath: string, expiresInSeconds = 600) {
  const { data, error } = await supabase.storage
    .from("incident-evidence")
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}

export async function removeIncidentEvidence(evidenceId: string) {
  const { data: evidence, error: lookupError } = await db
    .from("incident_report_evidence")
    .select("storage_path")
    .eq("id", evidenceId)
    .single();
  if (lookupError) throw lookupError;

  const { error: storageError } = await supabase.storage
    .from("incident-evidence")
    .remove([evidence.storage_path]);
  if (storageError) throw storageError;

  const { error } = await db.rpc("unregister_incident_evidence", { p_evidence_id: evidenceId });
  if (error) throw error;
}

export async function isCurrentUserStaff() {
  const { data, error } = await db.rpc("is_current_user_staff");
  if (error) throw error;
  return Boolean(data);
}

export async function moderateContentReport(reportId: string, action: "dismiss" | "remove", note?: string) {
  const { error } = await db.rpc("moderate_content_report", {
    p_report_id: reportId,
    p_action: action,
    p_note: note?.trim() || null,
  });
  if (error) throw error;
}

export async function reviewIncidentReport(
  reportId: string,
  status: "under_review" | "needs_info" | "closed",
  note?: string,
) {
  const { error } = await db.rpc("review_incident_report", {
    p_report_id: reportId,
    p_status: status,
    p_note: note?.trim() || null,
  });
  if (error) throw error;
}
