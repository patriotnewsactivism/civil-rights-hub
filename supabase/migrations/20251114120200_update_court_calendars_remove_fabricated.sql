-- Remove fabricated court calendar entries and add disclaimer
-- The original seed data contained fictional cases with made-up details
-- This migration removes those and adds examples clearly marked as templates

-- Delete all existing court calendar entries (they were fabricated)
DELETE FROM public.court_calendars;

-- Add table comment explaining the purpose
COMMENT ON TABLE public.court_calendars IS 'Civil rights court hearings and trials calendar. Note: This table is for tracking real public court cases. Entries should be verified from official court sources like PACER, court websites, or legal databases. Do not add fictional or example cases without clearly marking them as such.';

-- Add a few TEMPLATE entries clearly marked as examples for users to understand the structure
-- These are marked as 'template' status to distinguish from real cases
INSERT INTO public.court_calendars (
  case_name,
  case_number,
  case_type,
  description,
  court_name,
  court_type,
  city,
  state,
  address,
  hearing_date,
  hearing_type,
  judge_name,
  plaintiff,
  defendant,
  is_public,
  courtroom,
  organizations_involved,
  issues,
  notes,
  status
) VALUES
(
  'TEMPLATE: Section 1983 Police Misconduct Case',
  'YYYY-CV-XXXX',
  'Police Misconduct',
  'This is a template entry showing the structure for Section 1983 civil rights lawsuits alleging excessive force. Replace with real case information from court records.',
  'U.S. District Court (Example)',
  'Federal District',
  'Example City',
  'California',
  'Federal Courthouse Address',
  '2025-12-31 09:00:00-08',
  'Example Hearing Type',
  'Hon. [Judge Name]',
  '[Plaintiff Name]',
  '[Defendant Agency/Officers]',
  true,
  'Courtroom X',
  ARRAY['Example: ACLU', 'Example: National Police Accountability Project'],
  ARRAY['Fourth Amendment', 'Excessive Force', 'Qualified Immunity'],
  'TEMPLATE ONLY - This is an example entry to show data structure. Do not treat as real case. Replace with verified court information.',
  'template'
),
(
  'TEMPLATE: Voting Rights Act Challenge',
  'YYYY-CV-XXXX',
  'Voting Rights',
  'Template showing structure for Voting Rights Act cases challenging voter suppression or redistricting. Use official court sources like PACER for real cases.',
  'U.S. District Court (Example)',
  'Federal District',
  'Example City',
  'Georgia',
  'Federal Courthouse Address',
  '2025-12-31 14:00:00-05',
  'Example Hearing Type',
  'Hon. [Judge Name]',
  '[Civil Rights Organization]',
  '[State/Local Government]',
  true,
  'Courtroom X',
  ARRAY['Example: NAACP LDF', 'Example: Lawyers Committee for Civil Rights'],
  ARRAY['Voting Rights Act Section 2', 'Redistricting', 'Vote Dilution'],
  'TEMPLATE ONLY - Example entry for reference. Populate with real cases from court records.',
  'template'
),
(
  'TEMPLATE: Fair Housing Act Case',
  'YYYY-CV-XXXX',
  'Housing',
  'Template for Fair Housing Act discrimination cases. Real case information should be obtained from court filings and official sources.',
  'U.S. District Court (Example)',
  'Federal District',
  'Example City',
  'New York',
  'Federal Courthouse Address',
  '2025-12-31 10:00:00-05',
  'Example Hearing Type',
  'Hon. [Judge Name]',
  '[Tenants/Plaintiffs]',
  '[Housing Authority/Landlord]',
  true,
  'Courtroom X',
  ARRAY['Example: Legal Aid Society', 'Example: Housing Justice Project'],
  ARRAY['Fair Housing Act', 'Discrimination', 'Disparate Impact'],
  'TEMPLATE ONLY - Use verified court information for real cases. Check PACER or court websites.',
  'template'
);

-- Add instructions in the notes
COMMENT ON COLUMN public.court_calendars.status IS 'Status of court case: scheduled (real upcoming hearing), completed (real past case), template (example entry for reference only)';
