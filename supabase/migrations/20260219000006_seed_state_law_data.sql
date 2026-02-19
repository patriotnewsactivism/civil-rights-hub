-- Seed comprehensive state law data for new legal topics
-- Part of Phase 5: State Laws & Legal Resources

-- Update existing state_laws records with new legal topic data
-- Wiretap Laws, Anti-SLAPP, Journalist Protections, Protest Rights, etc.

UPDATE public.state_laws SET
  wiretap_law_citation = 'Ala. Code § 13A-11-30 et seq.',
  wiretap_penalties = 'Class A misdemeanor for first offense; Class C felony for subsequent offenses',
  wiretap_exceptions = 'One-party consent state. Recording is legal if one party to the conversation consents.',
  anti_slapp_law = 'Limited',
  anti_slapp_citation = 'Ala. Code § 6-5-620 et seq.',
  anti_slapp_protections = 'Limited anti-SLAPP protections. Does not cover all protected speech activities.',
  shield_law_citation = 'Ala. Code § 12-21-142',
  shield_law_type = 'Qualified',
  shield_law_qualifications = 'Protects confidential sources in civil cases; limited protection in criminal cases',
  critical_infrastructure_law = 'Yes',
  critical_infrastructure_penalties = 'Class A misdemeanor; enhanced penalties for damage or disruption',
  body_camera_policy = 'Varies by department',
  body_camera_activation = 'Required for law enforcement encounters',
  body_camera_public_access = 'FOIA request required',
  body_camera_retention = 'Minimum 180 days for non-evidentiary recordings'
WHERE state = 'Alabama';

UPDATE public.state_laws SET
  wiretap_law_citation = 'Alaska Stat. § 42.20.300 et seq.',
  wiretap_penalties = 'Class C felony',
  wiretap_exceptions = 'One-party consent state. Consent of one party is sufficient.',
  anti_slapp_law = 'Yes',
  anti_slapp_citation = 'Alaska Stat. § 09.60.250 et seq.',
  anti_slapp_protections = 'Strong anti-SLAPP law protecting petition and speech rights',
  shield_law_citation = 'Alaska Stat. § 09.25.300',
  shield_law_type = 'Qualified',
  shield_law_qualifications = 'Protects confidential sources in civil and criminal proceedings',
  critical_infrastructure_law = 'Yes',
  critical_infrastructure_penalties = 'Class C felony for trespassing on critical infrastructure'
WHERE state = 'Alaska';

UPDATE public.state_laws SET
  wiretap_law_citation = 'Ariz. Rev. Stat. § 13-3005',
  wiretap_penalties = 'Class 5 felony; Class 4 felony if for commercial gain',
  wiretap_exceptions = 'One-party consent. Recording legal if one party consents.',
  anti_slapp_law = 'Yes',
  anti_slapp_citation = 'Ariz. Rev. Stat. § 12-341',
  anti_slapp_protections = 'Strong protections for free speech, petition, and assembly rights',
  shield_law_citation = 'Ariz. Rev. Stat. § 12-2237',
  shield_law_type = 'Qualified',
  shield_law_qualifications = 'Protects confidential sources in civil cases; limited in criminal',
  critical_infrastructure_law = 'Yes',
  critical_infrastructure_penalties = 'Class 6 felony; enhanced for damage or disruption',
  citizen_review_board = 'Phoenix Civilian Review Board, Tucson Citizens Police Oversight Board'
WHERE state = 'Arizona';

UPDATE public.state_laws SET
  wiretap_law_citation = 'Cal. Penal Code § 631 et seq.',
  wiretap_penalties = 'Felony punishable by up to 3 years imprisonment',
  wiretap_exceptions = 'Two-party consent required. All parties must consent to recording.',
  anti_slapp_law = 'Yes - Strong',
  anti_slapp_citation = 'Cal. Code Civ. Proc. § 425.16',
  anti_slapp_protections = 'Nation\'s strongest anti-SLAPP law. Mandatory attorney fees for successful motions.',
  shield_law_citation = 'Cal. Evid. Code § 1070',
  shield_law_type = 'Absolute',
  shield_law_qualifications = 'Strong shield law protecting confidential sources and unpublished information',
  critical_infrastructure_law = 'Yes',
  critical_infrastructure_penalties = 'Misdemeanor to felony depending on severity and intent',
  body_camera_policy = 'Senate Bill 87 (2021)',
  body_camera_activation = 'Required for all enforcement contacts',
  body_camera_public_access = 'Public records request; exceptions for ongoing investigations',
  body_camera_retention = 'Minimum 3 years for evidentiary; 90 days non-evidentiary',
  citizen_review_board = 'Multiple including LAPD Board of Police Commissioners, SF Police Commission'
WHERE state = 'California';

UPDATE public.state_laws SET
  wiretap_law_citation = 'Conn. Gen. Stat. § 53a-187',
  wiretap_penalties = 'Class A misdemeanor; Class D felony with prior conviction',
  wiretap_exceptions = 'One-party consent state.',
  anti_slapp_law = 'Yes',
  anti_slapp_citation = 'Conn. Gen. Stat. § 52-196a',
  anti_slapp_protections = 'Protects petition and speech rights with mandatory fee-shifting',
  shield_law_citation = 'Conn. Gen. Stat. § 52-146t',
  shield_law_type = 'Qualified',
  shield_law_qualifications = 'Protects confidential sources and unpublished information',
  citizen_review_board = 'Police Transparency and Accountability Task Force'
WHERE state = 'Connecticut';

UPDATE public.state_laws SET
  wiretap_law_citation = 'D.C. Code § 23-541 et seq.',
  wiretap_penalties = 'Felony punishable by up to 5 years',
  wiretap_exceptions = 'One-party consent. DC is a one-party consent jurisdiction.',
  anti_slapp_law = 'Yes',
  anti_slapp_citation = 'D.C. Code § 16-5501 et seq.',
  anti_slapp_protections = 'Strong anti-SLAPP law protecting First Amendment activities',
  shield_law_citation = 'D.C. Code § 16-4701 et seq.',
  shield_law_type = 'Qualified',
  shield_law_qualifications = 'Protects confidential sources in both civil and criminal cases',
  body_camera_policy = 'Body-Worn Camera Program',
  body_camera_activation = 'Required for all interactions',
  body_camera_public_access = 'FOIA request; online portal available',
  citizen_review_board = 'Police Complaints Board'
WHERE state = 'District of Columbia';

UPDATE public.state_laws SET
  wiretap_law_citation = 'Fla. Stat. § 934.03',
  wiretap_penalties = 'Third-degree felony',
  wiretap_exceptions = 'Two-party consent required for oral communications; one-party for wire communications.',
  anti_slapp_law = 'Yes',
  anti_slapp_citation = 'Fla. Stat. § 768.295',
  anti_slapp_protections = 'Protects free speech rights with fee-shifting provisions',
  shield_law_citation = 'Fla. Stat. § 90.5015',
  shield_law_type = 'Qualified',
  shield_law_qualifications = 'Protects confidential sources and unpublished information',
  critical_infrastructure_law = 'Yes - HB 1 (2021)',
  critical_infrastructure_penalties = 'Third-degree felony for trespass; enhanced penalties for damage',
  voter_id_requirements = 'Photo ID required',
  accepted_ids = 'Florida driver license, state ID, passport, military ID, concealed carry permit',
  citizen_review_board = 'Miami-Dade Independent Review Panel, Jacksonville Police and Fire Pension Fund'
WHERE state = 'Florida';

UPDATE public.state_laws SET
  wiretap_law_citation = 'Ga. Code § 16-11-60 et seq.',
  wiretap_penalties = 'Felony, 1-5 years imprisonment',
  wiretap_exceptions = 'One-party consent state.',
  anti_slapp_law = 'Yes',
  anti_slapp_citation = 'Ga. Code § 9-11-11.1',
  anti_slapp_protections = 'Protects statements made in connection with public proceedings',
  shield_law_citation = 'Ga. Code § 24-9-30',
  shield_law_type = 'Qualified',
  shield_law_qualifications = 'Protects confidential sources in civil and criminal proceedings',
  critical_infrastructure_law = 'Yes - SB 421 (2021)',
  critical_infrastructure_penalties = 'Misdemeanor to felony based on severity'
WHERE state = 'Georgia';

UPDATE public.state_laws SET
  wiretap_law_citation = '720 Ill. Comp. Stat. 5/14-1 et seq.',
  wiretap_penalties = 'Class 4 felony',
  wiretap_exceptions = 'Two-party consent required. All parties must consent.',
  anti_slapp_law = 'Yes',
  anti_slapp_citation = '735 Ill. Comp. Stat. 110/15 et seq.',
  anti_slapp_protections = 'Citizen Participation Act protects petition and speech rights',
  shield_law_citation = '735 Ill. Comp. Stat. 5/8-901 et seq.',
  shield_law_type = 'Qualified',
  shield_law_qualifications = 'Reporter\'s privilege protects confidential sources',
  body_camera_policy = 'Law Enforcement Body-Worn Camera Act',
  body_camera_activation = 'Required for law enforcement encounters',
  body_camera_public_access = 'FOIA request; redactions allowed',
  citizen_review_board = 'Chicago Police Board, Civilian Office of Police Accountability'
WHERE state = 'Illinois';

UPDATE public.state_laws SET
  wiretap_law_citation = '18 Pa. Cons. Stat. § 5703',
  wiretap_penalties = 'Third-degree felony',
  wiretap_exceptions = 'Two-party consent required for oral communications.',
  anti_slapp_law = 'Limited',
  anti_slapp_citation = '27 Pa. Cons. Stat. § 8303',
  anti_slapp_protections = 'Limited to environmental and zoning matters',
  shield_law_citation = '45 Pa. Cons. Stat. § 5-501',
  shield_law_type = 'Qualified',
  shield_law_qualifications = 'Protects confidential sources in civil and criminal cases',
  body_camera_policy = 'Act 22 of 2017',
  body_camera_activation = 'Officer discretion with guidelines',
  body_camera_public_access = 'Right-to-Know Law request',
  citizen_review_board = 'Philadelphia Police Advisory Commission, Pittsburgh Citizen Police Review Board'
WHERE state = 'Pennsylvania';

UPDATE public.state_laws SET
  wiretap_law_citation = 'N.Y. Penal Law § 250.00 et seq.',
  wiretap_penalties = 'Class E felony',
  wiretap_exceptions = 'One-party consent state.',
  anti_slapp_law = 'Yes',
  anti_slapp_citation = 'N.Y. Civ. Rights Law § 70-a',
  anti_slapp_protections = 'Protects public petition and participation rights',
  shield_law_citation = 'N.Y. Civ. Rights Law § 79-h',
  shield_law_type = 'Qualified',
  shield_law_qualifications = 'Strongest shield law - protects professional and student journalists',
  body_camera_policy = 'Executive Order 147',
  body_camera_activation = 'State police required to record encounters',
  body_camera_public_access = 'FOIL request',
  citizen_review_board = 'NYC CCRB, Buffalo Police Advisory Board'
WHERE state = 'New York';

UPDATE public.state_laws SET
  wiretap_law_citation = 'Tex. Penal Code § 16.02',
  wiretap_penalties = 'Second-degree felony',
  wiretap_exceptions = 'One-party consent state. Recording legal if one party consents.',
  anti_slapp_law = 'Yes',
  anti_slapp_citation = 'Tex. Civ. Prac. & Rem. Code § 27.001 et seq.',
  anti_slapp_protections = 'Citizen Participation Act protects First Amendment activities',
  shield_law_citation = 'Tex. Code Crim. Proc. Art. 38.11',
  shield_law_type = 'Qualified',
  shield_law_qualifications = 'Protects confidential sources and unpublished information',
  critical_infrastructure_law = 'Yes - HB 3557 (2019)',
  critical_infrastructure_penalties = 'State jail felony for damage; enhanced penalties for trespass',
  voter_id_requirements = 'Photo ID required',
  accepted_ids = 'Texas driver license, election ID certificate, passport, military ID',
  body_camera_policy = 'Senate Bill 158 (2015)',
  body_camera_activation = 'Required for recorded encounters',
  citizen_review_board = 'Austin Police Oversight, Dallas Community Police Oversight Board'
WHERE state = 'Texas';

UPDATE public.state_laws SET
  wiretap_law_citation = '18 U.S.C. § 2511',
  wiretap_penalties = 'Federal felony, up to 5 years',
  wiretap_exceptions = 'One-party consent federal law. Federal courts follow one-party rule.',
  anti_slapp_law = 'No federal law',
  anti_slapp_citation = 'State laws apply',
  anti_slapp_protections = 'No federal anti-SLAPP statute; state laws may apply in federal court',
  shield_law_citation = '49 U.S.C. § 605; 28 C.F.R. § 50.10',
  shield_law_type = 'Qualified',
  shield_law_qualifications = 'No federal shield law; DOJ guidelines provide limited protection'
WHERE state_code = 'FED';

-- Add journalist credential laws for key states
UPDATE public.state_laws SET
  journalist_credential_laws = 'California Shield Law applies to professional journalists. No formal credentialing process.',
  press_pass_rights = 'Local governments issue press passes. LAPD media credentials required for crime scene access.'
WHERE state = 'California';

UPDATE public.state_laws SET
  journalist_credential_laws = 'NY Shield Law covers professional journalists. NYC issues press credentials through NYPD.',
  press_pass_rights = 'NYC press pass grants access to city events and some restricted areas.'
WHERE state = 'New York';

UPDATE public.state_laws SET
  journalist_credential_laws = 'DC Shield Law protects journalists. MPD issues press credentials.',
  press_pass_rights = 'Congressional press galleries issue credentials for Capitol access.'
WHERE state = 'District of Columbia';

-- Add protest and assembly rights details
UPDATE public.state_laws SET
  public_assembly_law = 'Generally protected under First Amendment',
  spontaneous_assembly_rights = 'Spontaneous protests protected; no permit required for immediate response to events',
  permit_requirements = 'Permits required for events blocking traffic or using amplified sound',
  permit_costs = 'Generally free for small events; fees for large gatherings or street closures',
  permit_timeline = 'Apply 3-30 days in advance depending on jurisdiction'
WHERE state = 'California';

UPDATE public.state_laws SET
  public_assembly_law = 'Protected under First Amendment and NY Civil Rights Law',
  spontaneous_assembly_rights = 'Spontaneous protests allowed in public forums',
  permit_requirements = 'NYC requires permits for gatherings over 20 people in parks, or for sound amplification',
  permit_costs = 'Free for most events; insurance may be required for large gatherings',
  permit_timeline = 'Apply at least 24 hours for small events; 30+ days for large events'
WHERE state = 'New York';

-- Add voter ID requirements for restrictive states
UPDATE public.state_laws SET
  voter_id_requirements = 'Strict photo ID required',
  accepted_ids = 'Georgia driver license, state ID, passport, military ID, free voter ID card available',
  provisional_ballot_rules = 'Provisional ballot allowed; must provide ID within 3 days'
WHERE state = 'Georgia';

UPDATE public.state_laws SET
  voter_id_requirements = 'Strict photo ID required',
  accepted_ids = 'Indiana driver license, state ID, passport, military ID',
  provisional_ballot_rules = 'Provisional ballot counted only if voter provides ID within 10 days'
WHERE state = 'Indiana';

UPDATE public.state_laws SET
  voter_id_requirements = 'Non-strict photo ID required',
  accepted_ids = 'Wisconsin driver license, state ID, passport, military ID, tribal ID',
  provisional_ballot_rules = 'Affidavit option available if ID not presented'
WHERE state = 'Wisconsin';

-- Add defamation standards for key states
UPDATE public.state_laws SET
  defamation_standards = 'Public figures must prove actual malice; private figures need negligence',
  retraction_requirements = 'California requires demand for retraction before suing for damages'
WHERE state = 'California';

UPDATE public.state_laws SET
  defamation_standards = 'Public figures must prove actual malice under NY Times v. Sullivan',
  retraction_requirements = 'NY requires notice of claim for libel in newspapers'
WHERE state = 'New York';

-- Update verification dates
UPDATE public.state_laws SET updated_at = NOW() WHERE updated_at IS NOT NULL;

-- Create useful indexes for new columns
CREATE INDEX IF NOT EXISTS idx_state_laws_anti_slapp ON public.state_laws(anti_slapp_law);
CREATE INDEX IF NOT EXISTS idx_state_laws_voter_id ON public.state_laws(voter_id_requirements);
CREATE INDEX IF NOT EXISTS idx_state_laws_critical_infra ON public.state_laws(critical_infrastructure_law);
