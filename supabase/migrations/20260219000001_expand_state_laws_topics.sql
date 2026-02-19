-- Add new legal topics to state_laws table for journalists and activists
-- Phase 5 of UPGRADE_PLAN.md

ALTER TABLE public.state_laws
  ADD COLUMN IF NOT EXISTS wiretap_law_citation TEXT,
  ADD COLUMN IF NOT EXISTS wiretap_penalties TEXT,
  ADD COLUMN IF NOT EXISTS wiretap_exceptions TEXT,
  
  ADD COLUMN IF NOT EXISTS anti_slapp_law TEXT,
  ADD COLUMN IF NOT EXISTS anti_slapp_citation TEXT,
  ADD COLUMN IF NOT EXISTS anti_slapp_protections TEXT,
  
  ADD COLUMN IF NOT EXISTS shield_law_citation TEXT,
  ADD COLUMN IF NOT EXISTS shield_law_type TEXT,
  ADD COLUMN IF NOT EXISTS shield_law_qualifications TEXT,
  
  ADD COLUMN IF NOT EXISTS journalist_credential_laws TEXT,
  ADD COLUMN IF NOT EXISTS press_pass_rights TEXT,
  
  ADD COLUMN IF NOT EXISTS prior_restraint_case_law TEXT,
  ADD COLUMN IF NOT EXISTS defamation_standards TEXT,
  ADD COLUMN IF NOT EXISTS retraction_requirements TEXT,
  
  ADD COLUMN IF NOT EXISTS drone_restrictions TEXT,
  ADD COLUMN IF NOT EXISTS drone_journalist_exceptions TEXT,
  
  ADD COLUMN IF NOT EXISTS open_meetings_law TEXT,
  ADD COLUMN IF NOT EXISTS open_meetings_citation TEXT,
  ADD COLUMN IF NOT EXISTS open_meetings_enforcement TEXT,
  
  ADD COLUMN IF NOT EXISTS critical_infrastructure_law TEXT,
  ADD COLUMN IF NOT EXISTS critical_infrastructure_penalties TEXT,
  
  ADD COLUMN IF NOT EXISTS anti_riot_statute TEXT,
  ADD COLUMN IF NOT EXISTS anti_riot_threshold TEXT,
  
  ADD COLUMN IF NOT EXISTS curfew_law TEXT,
  ADD COLUMN IF NOT EXISTS curfew_enforcement TEXT,
  
  ADD COLUMN IF NOT EXISTS public_assembly_law TEXT,
  ADD COLUMN IF NOT EXISTS spontaneous_assembly_rights TEXT,
  
  ADD COLUMN IF NOT EXISTS permit_requirements TEXT,
  ADD COLUMN IF NOT EXISTS permit_costs TEXT,
  ADD COLUMN IF NOT EXISTS permit_timeline TEXT,
  ADD COLUMN IF NOT EXISTS permit_appeal_process TEXT,
  
  ADD COLUMN IF NOT EXISTS body_camera_policy TEXT,
  ADD COLUMN IF NOT EXISTS body_camera_activation TEXT,
  ADD COLUMN IF NOT EXISTS body_camera_public_access TEXT,
  ADD COLUMN IF NOT EXISTS body_camera_retention TEXT,
  
  ADD COLUMN IF NOT EXISTS citizen_review_board TEXT,
  ADD COLUMN IF NOT EXISTS citizen_review_powers TEXT,
  ADD COLUMN IF NOT EXISTS citizen_review_contact TEXT,
  
  ADD COLUMN IF NOT EXISTS voter_id_requirements TEXT,
  ADD COLUMN IF NOT EXISTS accepted_ids TEXT,
  ADD COLUMN IF NOT EXISTS provisional_ballot_rules TEXT,
  
  ADD COLUMN IF NOT EXISTS major_city_permit_info JSONB;

CREATE INDEX IF NOT EXISTS idx_state_laws_shield_law ON public.state_laws(has_shield_law);
CREATE INDEX IF NOT EXISTS idx_state_laws_anti_slapp ON public.state_laws(anti_slapp_law);

COMMENT ON TABLE public.state_laws IS 'Comprehensive state-specific civil rights laws including recording consent, journalist protections, activist rights, and legal resources for all 50 states';
