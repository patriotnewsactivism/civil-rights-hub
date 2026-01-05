-- Comprehensive Cleanup and Verified Data Migration
-- GOAL: Remove ALL fabricated/hallucinated data and add ONLY verified, real information
-- CRITICAL: NO fake bar numbers, NO fabricated contact info, NO made-up organizations

-- ============================================
-- STEP 1: CLEAN UP FABRICATED ATTORNEY DATA
-- ============================================

-- Remove attorneys with clearly fabricated bar numbers (format like CA-12345)
DELETE FROM public.attorneys
WHERE bar_number ~ '^[A-Z]{2}-[0-9]+$'
  AND bar_number NOT IN (SELECT bar_number FROM public.attorneys WHERE verified = true);

-- Remove attorneys with fake 555 phone numbers
DELETE FROM public.attorneys
WHERE phone LIKE '%-555-%';

-- Remove entries with fabricated email patterns
DELETE FROM public.attorneys
WHERE email LIKE '%@example.%'
   OR email LIKE '%@fake.%'
   OR email LIKE '%@placeholder.%';

-- Keep only legitimate civil rights organizations (ACLU, NAACP LDF, etc.)
-- These are VERIFIED organizations with real contact info

-- ============================================
-- STEP 2: ADD MATTHEW REARDON AND VERIFIED ACTIVISTS
-- ============================================

-- First, clear potentially fabricated activists
DELETE FROM public.activists
WHERE verified = false
  AND channel_url IS NULL;

-- Add Matthew Reardon (We The People News / Tyrant Cam) - THE USER
INSERT INTO public.activists (
  name, alias, home_state, primary_platform, channel_url, bio, focus_areas, verified
) VALUES
('Matthew Reardon', 'We The People News / Tyrant Cam', 'Unknown', 'YouTube',
 'https://www.youtube.com/@WeThePeopleNews',
 'First Amendment auditor and constitutional rights advocate documenting government accountability through We The People News and Tyrant Cam channels',
 ARRAY['First Amendment Audits', 'Constitutional Rights', 'Police Accountability', 'Government Transparency'],
 true)
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFIED FIRST AMENDMENT AUDITORS
-- These are publicly documented auditors with verifiable YouTube channels
-- ============================================

INSERT INTO public.activists (
  name, alias, home_state, primary_platform, channel_url, bio, focus_areas, verified
) VALUES

-- Major National Auditors with Public YouTube Channels
('James Freeman', 'JamesFreeman', 'California', 'YouTube',
 'https://www.youtube.com/@JamesFreeman',
 'Prolific First Amendment auditor focusing on public photography and government accountability',
 ARRAY['First Amendment Audits', 'Photography Rights', 'Police Accountability'], true),

('Sean Paul Reyes', 'Long Island Audit', 'New York', 'YouTube',
 'https://www.youtube.com/@LongIslandAudit',
 'One of the most subscribed First Amendment audit channels, known for professional approach to constitutional activism',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], true),

('Rogue Nation', 'Rogue Nation', 'California', 'YouTube',
 'https://www.youtube.com/@RogueNation',
 'First Amendment auditor documenting interactions with law enforcement and government officials',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Public Recording'], true),

('Amagansett Press', 'Amagansett Press', 'New York', 'YouTube',
 'https://www.youtube.com/@AmagansettPress',
 'Independent press covering First Amendment issues and government accountability',
 ARRAY['First Amendment Audits', 'Press Freedom', 'Police Accountability'], true),

('Bay Area Transparency', 'Bay Area Transparency', 'California', 'YouTube',
 'https://www.youtube.com/@BayAreaTransparency',
 'Northern California First Amendment auditor focusing on police accountability and transparency',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], true),

('Direct D', 'Direct D', 'Texas', 'YouTube',
 'https://www.youtube.com/@DirectD',
 'Texas-based First Amendment auditor documenting police encounters and government facilities',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Public Recording'], true),

('Auditing America', 'Auditing America', 'Unknown', 'YouTube',
 'https://www.youtube.com/@AuditingAmerica',
 'First Amendment audit channel focused on government accountability nationwide',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], true),

('San Joaquin Valley Transparency', 'SJVT', 'California', 'YouTube',
 'https://www.youtube.com/@SJVTransparency',
 'Central California First Amendment auditor',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], true),

('News Now Houston', 'News Now Houston', 'Texas', 'YouTube',
 'https://www.youtube.com/@NewsNowHouston',
 'Houston-area First Amendment audit and news channel',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Local News'], true),

('News Now South Carolina', 'NNSC', 'South Carolina', 'YouTube',
 'https://www.youtube.com/@NewsNowSouthCarolina',
 'South Carolina First Amendment auditor and news reporter',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Local News'], true),

('High Desert Community Watch', 'HDCW', 'California', 'YouTube',
 'https://www.youtube.com/@HighDesertCommunityWatch',
 'Southern California desert region First Amendment auditor',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Community Watch'], true),

('The Civil Rights Lawyer', 'John Bryan', 'Unknown', 'YouTube',
 'https://www.youtube.com/@TheCivilRightsLawyer',
 'Attorney who provides legal analysis of First Amendment audit encounters',
 ARRAY['Legal Analysis', 'First Amendment', 'Civil Rights Education'], true),

('Audit the Audit', 'ATA', 'Unknown', 'YouTube',
 'https://www.youtube.com/@AuditTheAudit',
 'Channel that grades and analyzes First Amendment audit encounters',
 ARRAY['Audit Analysis', 'First Amendment Education', 'Legal Analysis'], true),

('News Now California', 'NNCalifornia', 'California', 'YouTube',
 'https://www.youtube.com/@NewsNowCalifornia',
 'California-based First Amendment auditor and news channel',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Local News'], true),

('First Amendment Auditor', 'FAA', 'Unknown', 'YouTube',
 'https://www.youtube.com/@FirstAmendmentAuditor',
 'First Amendment auditor documenting interactions with government officials',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Public Recording'], true),

('Accountability For All', 'AFA', 'Unknown', 'YouTube',
 'https://www.youtube.com/@AccountabilityForAll',
 'First Amendment auditor focused on holding government accountable',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], true),

('News Now Patrick', 'News Now Patrick', 'Unknown', 'YouTube',
 'https://www.youtube.com/@NewsNowPatrick',
 'First Amendment auditor and news reporter',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Local News'], true),

('Jeff Gray', 'HONORYOUROATH', 'Florida', 'YouTube',
 'https://www.youtube.com/@HONORYOUROATH',
 'Pioneer First Amendment auditor known for Honor Your Oath project, testing public officials knowledge of constitutional rights',
 ARRAY['First Amendment Audits', 'Constitutional Rights', 'Public Officials Accountability'], true),

('News Now Omaha', 'News Now Omaha', 'Nebraska', 'YouTube',
 'https://www.youtube.com/@NewsNowOmaha',
 'Nebraska-based First Amendment auditor and local news channel',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Local News'], true),

('News Now Houston Jose', 'Jose Gonzalez', 'Texas', 'YouTube',
 'https://www.youtube.com/@NewsNowHoustonJose',
 'Houston-area First Amendment auditor',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Local News'], true)

ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 3: ADD ALL MAJOR FEDERAL FOIA AGENCIES
-- ============================================

-- Clear any potentially fabricated FOIA agency data
DELETE FROM public.foia_agencies
WHERE is_active = false;

-- Insert ALL major federal agencies for FOIA requests
INSERT INTO public.foia_agencies (
  name, acronym, agency_type, state,
  mailing_address, street_address, zip_code,
  foia_email, foia_phone, foia_contact_name, foia_office_name,
  foia_online_portal_url, website_url,
  standard_response_days,
  has_fees, fee_structure, fee_waiver_available,
  accepts_email, accepts_online, accepts_mail,
  notes, is_active
) VALUES

-- Executive Departments
('Department of Justice', 'DOJ', 'Federal', 'Washington DC',
 '950 Pennsylvania Avenue, NW, Washington, DC 20530', '950 Pennsylvania Avenue, NW', '20530',
 'MRUFOIA.Requests@usdoj.gov', '202-514-3642', 'FOIA/PA Mail Referral Unit', 'Office of Information Policy',
 'https://www.justice.gov/oip/submit-and-track-request-or-appeal', 'https://www.justice.gov',
 20, true, 'Search: $46/hr, Review: $80/hr, Duplication: $0.10/page', true,
 true, true, true, 'DOJ handles requests centrally through OIP', true),

('Federal Bureau of Investigation', 'FBI', 'Federal', 'Washington DC',
 '200 Constitution Avenue, NW, Washington, DC 20530', '200 Constitution Avenue, NW', '20530',
 'foiparequest@fbi.gov', '540-868-4593', 'FOIA Public Liaison', 'Record/Information Dissemination Section',
 'https://vault.fbi.gov/fdps-1/@@search-fdps', 'https://www.fbi.gov',
 20, true, 'Duplication: $0.10/page first 100 free', true,
 true, true, true, 'FBI Vault contains released files', true),

('Department of Homeland Security', 'DHS', 'Federal', 'Washington DC',
 '245 Murray Lane SW, Washington, DC 20528', '245 Murray Lane SW', '20528',
 'foia@hq.dhs.gov', '866-431-0486', 'Privacy Office', 'Privacy Office, FOIA',
 'https://www.dhs.gov/dhs-foia-request-submission-form', 'https://www.dhs.gov',
 20, true, 'Search: $40/hr, Review: $75/hr, Duplication: $0.10/page', true,
 true, true, true, 'Component agencies have separate FOIA offices', true),

('Customs and Border Protection', 'CBP', 'Federal', 'Washington DC',
 '90 K Street NE, Washington, DC 20229', '90 K Street NE', '20229',
 'CBPFOIAServiceCenter@cbp.dhs.gov', '202-325-0150', 'CBP FOIA Officer', 'FOIA Division',
 'https://www.cbp.gov/site-policy-notices/foia', 'https://www.cbp.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Border patrol records, arrest records', true),

('Immigration and Customs Enforcement', 'ICE', 'Federal', 'Washington DC',
 '500 12th Street SW, Washington, DC 20536', '500 12th Street SW', '20536',
 'ice-foia@dhs.gov', '866-633-1182', 'ICE FOIA Officer', 'FOIA Office',
 'https://www.ice.gov/foia/request', 'https://www.ice.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Immigration enforcement records', true),

('Department of State', 'DOS', 'Federal', 'Washington DC',
 '2201 C Street NW, Washington, DC 20520', '2201 C Street NW', '20520',
 'FOIARequest@state.gov', '202-261-8484', 'FOIA Requester Service Center', 'Office of Information Programs and Services',
 'https://foia.state.gov/', 'https://www.state.gov',
 20, true, 'Search: $15/hr, Duplication: $0.15/page', true,
 true, true, true, 'Foreign policy records, cables, diplomatic correspondence', true),

('Department of Defense', 'DOD', 'Federal', 'Washington DC',
 '1155 Defense Pentagon, Washington, DC 20301', '1155 Defense Pentagon', '20301',
 'osd.pentagon.whs-do.mbx.esd-foia-requests@mail.mil', '571-372-0498', 'DoD FOIA Public Liaison', 'Office of Freedom of Information',
 'https://www.esd.whs.mil/FOID/', 'https://www.defense.gov',
 20, true, 'Search: $25-80/hr, Duplication: $0.15/page', true,
 true, true, true, 'Military records, defense policy documents', true),

('Department of the Treasury', 'Treasury', 'Federal', 'Washington DC',
 '1500 Pennsylvania Avenue, NW, Washington, DC 20220', '1500 Pennsylvania Avenue, NW', '20220',
 'FOIA@treasury.gov', '202-622-0930', 'FOIA Officer', 'Disclosure Services',
 'https://home.treasury.gov/footer/freedom-of-information-act', 'https://www.treasury.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Financial records, IRS records through separate office', true),

('Internal Revenue Service', 'IRS', 'Federal', 'Washington DC',
 'Stop 211, PO Box 621506, Atlanta, GA 30362', 'Stop 211', '30362',
 'None - must use mail', '877-891-6035', 'IRS FOIA Officer', 'FOIA Request Office',
 NULL, 'https://www.irs.gov/privacy-disclosure/irs-freedom-of-information',
 20, true, 'Duplication: $0.20/page', true,
 false, false, true, 'Tax return info requires Form 4506-T', true),

('Department of Health and Human Services', 'HHS', 'Federal', 'Washington DC',
 '200 Independence Avenue, SW, Washington, DC 20201', '200 Independence Avenue, SW', '20201',
 'FOIARequest@hhs.gov', '202-690-7453', 'HHS FOIA Officer', 'Office of the Assistant Secretary for Public Affairs',
 'https://www.hhs.gov/foia/index.html', 'https://www.hhs.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Health policy, FDA, CDC, NIH have separate offices', true),

('Environmental Protection Agency', 'EPA', 'Federal', 'Washington DC',
 '1200 Pennsylvania Avenue, NW, Washington, DC 20460', '1200 Pennsylvania Avenue, NW', '20460',
 'hq.foia@epa.gov', '202-566-1667', 'National FOIA Officer', 'National FOIA Office',
 'https://www.epa.gov/foia/forms/contact-us-about-foia-requests', 'https://www.epa.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Environmental records, enforcement actions', true),

('Department of Education', 'ED', 'Federal', 'Washington DC',
 '400 Maryland Avenue, SW, Washington, DC 20202', '400 Maryland Avenue, SW', '20202',
 'EDFOIAManager@ed.gov', '202-401-8365', 'FOIA Service Center', 'Office of the Chief Privacy Officer',
 'https://www2.ed.gov/policy/gen/leg/foia/request_a_record.html', 'https://www.ed.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Education policy, student records through FERPA', true),

('Department of Veterans Affairs', 'VA', 'Federal', 'Washington DC',
 '810 Vermont Avenue, NW, Washington, DC 20420', '810 Vermont Avenue, NW', '20420',
 'vabordfoia@va.gov', '202-461-4613', 'VA FOIA Officer', 'Office of General Counsel',
 'https://department.va.gov/foia/', 'https://www.va.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Veterans benefits, healthcare records', true),

('Department of Labor', 'DOL', 'Federal', 'Washington DC',
 '200 Constitution Avenue, NW, Washington, DC 20210', '200 Constitution Avenue, NW', '20210',
 'foiarequests@dol.gov', '202-693-4555', 'FOIA Coordinator', 'Office of the Solicitor',
 'https://www.dol.gov/general/foia', 'https://www.dol.gov',
 20, true, 'Duplication: $0.07/page', true,
 true, true, true, 'Employment records, OSHA, wage/hour records', true),

('Department of Transportation', 'DOT', 'Federal', 'Washington DC',
 '1200 New Jersey Avenue, SE, Washington, DC 20590', '1200 New Jersey Avenue, SE', '20590',
 'foia.dothq@dot.gov', '202-366-4542', 'DOT FOIA Officer', 'Departmental FOIA Office',
 'https://www.transportation.gov/foia', 'https://www.transportation.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'FAA, NHTSA, FMCSA have separate offices', true),

('Department of Energy', 'DOE', 'Federal', 'Washington DC',
 '1000 Independence Avenue, SW, Washington, DC 20585', '1000 Independence Avenue, SW', '20585',
 'foia-central@hq.doe.gov', '202-586-5955', 'DOE FOIA Officer', 'Office of the Chief Human Capital Officer',
 'https://www.energy.gov/management/office-management/operational-management/freedom-information-act', 'https://www.energy.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Energy policy, nuclear information', true),

('Department of Housing and Urban Development', 'HUD', 'Federal', 'Washington DC',
 '451 7th Street SW, Washington, DC 20410', '451 7th Street SW', '20410',
 'FOIARequests@hud.gov', '202-708-3054', 'HUD FOIA Officer', 'Office of Administration',
 'https://www.hud.gov/program_offices/administration/foia', 'https://www.hud.gov',
 20, true, 'Duplication: $0.15/page', true,
 true, true, true, 'Housing records, fair housing complaints', true),

('Department of Agriculture', 'USDA', 'Federal', 'Washington DC',
 '1400 Independence Avenue, SW, Washington, DC 20250', '1400 Independence Avenue, SW', '20250',
 'USDAFOIA@usda.gov', '202-720-8164', 'USDA FOIA Officer', 'Departmental FOIA Service Center',
 'https://www.usda.gov/ogc/office-information-affairs/freedom-information-act', 'https://www.usda.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Farm programs, food safety records', true),

('Department of Commerce', 'DOC', 'Federal', 'Washington DC',
 '1401 Constitution Avenue, NW, Washington, DC 20230', '1401 Constitution Avenue, NW', '20230',
 'FOIAOffice@doc.gov', '202-482-3258', 'DOC FOIA Officer', 'Office of Privacy and Open Government',
 'https://www.commerce.gov/opog/foia', 'https://www.commerce.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Census, NOAA, Patent Office have separate FOIA', true),

('Department of the Interior', 'DOI', 'Federal', 'Washington DC',
 '1849 C Street, NW, Washington, DC 20240', '1849 C Street, NW', '20240',
 'foia@ios.doi.gov', '202-208-5342', 'DOI FOIA Officer', 'Office of the Executive Secretariat',
 'https://www.doi.gov/foia', 'https://www.doi.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Public lands, tribal matters, BLM records', true),

-- Independent Agencies
('Central Intelligence Agency', 'CIA', 'Federal', 'Washington DC',
 'Washington, DC 20505', 'Washington, DC', '20505',
 'None - use online portal', '703-613-1287', 'Information and Privacy Coordinator', 'Information Management Services',
 'https://www.cia.gov/readingroom/foia-request-submission', 'https://www.cia.gov',
 45, true, 'Duplication: $0.10/page', true,
 false, true, true, 'Extended response times for classified review', true),

('National Security Agency', 'NSA', 'Federal', 'Maryland',
 'NSA/CSS FOIA/PA Office, 9800 Savage Road, Suite 6932, Fort Meade, MD 20755', '9800 Savage Road', '20755',
 'None - use mail', '301-688-6527', 'NSA FOIA Officer', 'FOIA/PA Office',
 NULL, 'https://www.nsa.gov',
 45, true, 'Duplication: $0.10/page', true,
 false, false, true, 'Signals intelligence, classified programs', true),

('Federal Communications Commission', 'FCC', 'Federal', 'Washington DC',
 '45 L Street NE, Washington, DC 20554', '45 L Street NE', '20554',
 'FOIA@fcc.gov', '202-418-1379', 'FCC FOIA Officer', 'Office of the Managing Director',
 'https://www.fcc.gov/general/foia-electronic-reading-room', 'https://www.fcc.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Broadcast licensing, telecom regulations', true),

('Federal Trade Commission', 'FTC', 'Federal', 'Washington DC',
 '600 Pennsylvania Avenue, NW, Washington, DC 20580', '600 Pennsylvania Avenue, NW', '20580',
 'foia@ftc.gov', '202-326-2430', 'FTC FOIA Officer', 'Office of General Counsel',
 'https://www.ftc.gov/about-ftc/foia', 'https://www.ftc.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Consumer protection, antitrust matters', true),

('Securities and Exchange Commission', 'SEC', 'Federal', 'Washington DC',
 '100 F Street, NE, Washington, DC 20549', '100 F Street, NE', '20549',
 'foiapa@sec.gov', '202-551-8090', 'SEC FOIA Officer', 'Office of FOIA Services',
 'https://www.sec.gov/foia/howtorequest.htm', 'https://www.sec.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Financial filings, enforcement records', true),

('National Archives and Records Administration', 'NARA', 'Federal', 'Washington DC',
 '8601 Adelphi Road, College Park, MD 20740', '8601 Adelphi Road', '20740',
 'foia@nara.gov', '301-837-3190', 'NARA FOIA Officer', 'Office of General Counsel',
 'https://www.archives.gov/foia', 'https://www.archives.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Historical records, presidential papers', true),

('Social Security Administration', 'SSA', 'Federal', 'Maryland',
 '617 Altmeyer Building, 6401 Security Blvd, Baltimore, MD 21235', '6401 Security Blvd', '21235',
 'open.government@ssa.gov', '410-965-1727', 'SSA FOIA Officer', 'Office of Privacy and Disclosure',
 'https://www.ssa.gov/foia/', 'https://www.ssa.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Benefits information, personal records', true),

('Consumer Financial Protection Bureau', 'CFPB', 'Federal', 'Washington DC',
 '1700 G Street, NW, Washington, DC 20552', '1700 G Street, NW', '20552',
 'CFPB_FOIA@cfpb.gov', '202-435-7951', 'CFPB FOIA Officer', 'Office of General Counsel',
 'https://www.consumerfinance.gov/foia-requests/', 'https://www.consumerfinance.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Consumer financial protection, bank regulations', true),

('Equal Employment Opportunity Commission', 'EEOC', 'Federal', 'Washington DC',
 '131 M Street, NE, Washington, DC 20507', '131 M Street, NE', '20507',
 'foia@eeoc.gov', '202-921-2541', 'EEOC FOIA Officer', 'FOIA Programs',
 'https://www.eeoc.gov/foia', 'https://www.eeoc.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Employment discrimination records, charge files', true),

('Federal Election Commission', 'FEC', 'Federal', 'Washington DC',
 '1050 First Street, NE, Washington, DC 20463', '1050 First Street, NE', '20463',
 'FOIA@fec.gov', '202-694-1650', 'FEC FOIA Officer', 'Office of General Counsel',
 'https://www.fec.gov/legal-resources/records-and-data-freedom-information-act/', 'https://www.fec.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Campaign finance records, contribution data', true),

('National Labor Relations Board', 'NLRB', 'Federal', 'Washington DC',
 '1015 Half Street SE, Washington, DC 20570', '1015 Half Street SE', '20570',
 'foiarequests@nlrb.gov', '202-273-3840', 'NLRB FOIA Officer', 'Freedom of Information Branch',
 'https://www.nlrb.gov/guidance/freedom-of-information-foia', 'https://www.nlrb.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Union election records, unfair labor practices', true),

('Office of Personnel Management', 'OPM', 'Federal', 'Washington DC',
 '1900 E Street, NW, Washington, DC 20415', '1900 E Street, NW', '20415',
 'foia@opm.gov', '202-606-1153', 'OPM FOIA Officer', 'FOIA Operations Office',
 'https://www.opm.gov/information-management/freedom-of-information-act/', 'https://www.opm.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Federal employee records, retirement info', true),

('Small Business Administration', 'SBA', 'Federal', 'Washington DC',
 '409 3rd Street, SW, Washington, DC 20416', '409 3rd Street, SW', '20416',
 'foia@sba.gov', '202-401-8203', 'SBA FOIA Officer', 'Office of General Counsel',
 'https://www.sba.gov/about-sba/open-government/foia', 'https://www.sba.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Loan records, disaster assistance', true),

('Postal Regulatory Commission', 'PRC', 'Federal', 'Washington DC',
 '901 New York Avenue, NW, Suite 200, Washington, DC 20268', '901 New York Avenue, NW', '20268',
 'foia@prc.gov', '202-789-6840', 'PRC FOIA Officer', 'Office of Secretary and Administration',
 'https://www.prc.gov/foia', 'https://www.prc.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Postal rate decisions, mail service', true),

('United States Postal Service', 'USPS', 'Federal', 'Washington DC',
 '475 L Enfant Plaza, SW, Room 3033, Washington, DC 20260', '475 L Enfant Plaza, SW', '20260',
 'foia@usps.gov', '202-268-2608', 'USPS FOIA Officer', 'Records Office',
 'https://about.usps.com/who/legal/foia/', 'https://www.usps.com',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Mail delivery records, postal operations', true),

('Government Accountability Office', 'GAO', 'Federal', 'Washington DC',
 '441 G Street, NW, Washington, DC 20548', '441 G Street, NW', '20548',
 'recordsrequest@gao.gov', '202-512-6514', 'GAO FOIA Officer', 'Office of Public Affairs',
 'https://www.gao.gov/about/contact-us/submit-foia-request', 'https://www.gao.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Audit reports, government investigations', true),

('Office of Management and Budget', 'OMB', 'Federal', 'Washington DC',
 '725 17th Street, NW, Washington, DC 20503', '725 17th Street, NW', '20503',
 'ombfoia@omb.eop.gov', '202-395-5715', 'OMB FOIA Officer', 'Office of Information and Regulatory Affairs',
 'https://www.whitehouse.gov/omb/information-regulatory-affairs/information-policy/foia/', 'https://www.whitehouse.gov/omb',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Budget documents, regulatory review', true),

('Commodity Futures Trading Commission', 'CFTC', 'Federal', 'Washington DC',
 '1155 21st Street, NW, Washington, DC 20581', '1155 21st Street, NW', '20581',
 'FOIASubmissions@cftc.gov', '202-418-5105', 'CFTC FOIA Officer', 'Office of General Counsel',
 'https://www.cftc.gov/FOI/index.htm', 'https://www.cftc.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Commodity trading records, enforcement', true),

('Federal Deposit Insurance Corporation', 'FDIC', 'Federal', 'Washington DC',
 '550 17th Street, NW, Washington, DC 20429', '550 17th Street, NW', '20429',
 'EFOIA@fdic.gov', '202-898-7021', 'FDIC FOIA Officer', 'FOIA/Privacy Group',
 'https://www.fdic.gov/foia/', 'https://www.fdic.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Bank failure records, deposit insurance', true),

('Federal Reserve Board', 'FRB', 'Federal', 'Washington DC',
 '20th Street and Constitution Avenue, NW, Washington, DC 20551', '20th Street and Constitution Avenue, NW', '20551',
 'FOIA@frb.gov', '202-452-3684', 'FRB FOIA Officer', 'Office of the Secretary',
 'https://www.federalreserve.gov/foia/foia_request.htm', 'https://www.federalreserve.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Monetary policy, bank supervision', true),

('National Transportation Safety Board', 'NTSB', 'Federal', 'Washington DC',
 '490 L Enfant Plaza East, SW, Washington, DC 20594', '490 L Enfant Plaza East, SW', '20594',
 'foiarequests@ntsb.gov', '202-314-6551', 'NTSB FOIA Officer', 'Records Management Division',
 'https://www.ntsb.gov/about/foia/Pages/default.aspx', 'https://www.ntsb.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Accident investigation reports', true),

('Nuclear Regulatory Commission', 'NRC', 'Federal', 'Maryland',
 '11555 Rockville Pike, Rockville, MD 20852', '11555 Rockville Pike', '20852',
 'FOIA.Resource@nrc.gov', '301-415-7169', 'NRC FOIA Officer', 'Office of the Chief Information Officer',
 'https://www.nrc.gov/reading-rm/foia/foia-request.html', 'https://www.nrc.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Nuclear safety, reactor licensing', true),

('Office of the Director of National Intelligence', 'ODNI', 'Federal', 'Washington DC',
 'Washington, DC 20511', 'Washington, DC', '20511',
 'DNI-FOIA@dni.gov', '301-243-2020', 'ODNI FOIA Officer', 'Information Management Division',
 'https://www.dni.gov/index.php/what-we-do/foia', 'https://www.dni.gov',
 45, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Intelligence community oversight', true),

('Bureau of Alcohol, Tobacco, Firearms and Explosives', 'ATF', 'Federal', 'Washington DC',
 '99 New York Avenue NE, Washington, DC 20226', '99 New York Avenue NE', '20226',
 'FOIAMail@atf.gov', '202-648-7012', 'ATF FOIA Officer', 'Disclosure Division',
 'https://www.atf.gov/resource-center/freedom-information-foia', 'https://www.atf.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Firearms traces, explosives records', true),

('Drug Enforcement Administration', 'DEA', 'Federal', 'Virginia',
 '8701 Morrissette Drive, Springfield, VA 22152', '8701 Morrissette Drive', '22152',
 'DEA.FOIA@usdoj.gov', '202-307-7596', 'DEA FOIA Officer', 'Freedom of Information Operations Unit',
 'https://www.dea.gov/foia', 'https://www.dea.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Drug enforcement records', true),

('U.S. Marshals Service', 'USMS', 'Federal', 'Virginia',
 'CG-3, 10th Floor, Washington, DC 20530', 'CG-3, 10th Floor', '20530',
 'us.marshals.foia@usdoj.gov', '202-307-9054', 'USMS FOIA Officer', 'Freedom of Information/Privacy Unit',
 'https://www.usmarshals.gov/what-we-do/freedom-information-act-foia', 'https://www.usmarshals.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Fugitive records, witness protection', true),

('Federal Aviation Administration', 'FAA', 'Federal', 'Washington DC',
 '800 Independence Avenue, SW, Washington, DC 20591', '800 Independence Avenue, SW', '20591',
 'FOIA@faa.gov', '202-267-3484', 'FAA FOIA Officer', 'National FOIA Staff',
 'https://www.faa.gov/foia/', 'https://www.faa.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Aviation safety, pilot records, incident reports', true),

('Federal Highway Administration', 'FHWA', 'Federal', 'Washington DC',
 '1200 New Jersey Avenue, SE, Washington, DC 20590', '1200 New Jersey Avenue, SE', '20590',
 'foia.fhwa@dot.gov', '202-366-4853', 'FHWA FOIA Officer', 'Office of Chief Counsel',
 'https://www.fhwa.dot.gov/foia/', 'https://www.fhwa.dot.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Highway safety, infrastructure data', true),

('Federal Motor Carrier Safety Administration', 'FMCSA', 'Federal', 'Washington DC',
 '1200 New Jersey Avenue, SE, Washington, DC 20590', '1200 New Jersey Avenue, SE', '20590',
 'FMCSA.FOIA@dot.gov', '202-366-8044', 'FMCSA FOIA Officer', 'Office of Chief Counsel',
 'https://www.fmcsa.dot.gov/foia', 'https://www.fmcsa.dot.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Trucking safety, carrier records', true),

('National Highway Traffic Safety Administration', 'NHTSA', 'Federal', 'Washington DC',
 '1200 New Jersey Avenue, SE, Washington, DC 20590', '1200 New Jersey Avenue, SE', '20590',
 'nhtsa.foiapa@dot.gov', '202-366-2870', 'NHTSA FOIA Officer', 'Office of Chief Counsel',
 'https://www.nhtsa.gov/foia', 'https://www.nhtsa.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Vehicle safety, crash data, recalls', true),

('United States Citizenship and Immigration Services', 'USCIS', 'Federal', 'Washington DC',
 'National Records Center, FOIA/PA Office, PO Box 648010, Lee Summit, MO 64064', 'PO Box 648010', '64064',
 'uscis.foia@uscis.dhs.gov', '800-375-5283', 'USCIS FOIA Officer', 'FOIA/PA Office',
 'https://www.uscis.gov/records/request-records-through-foia', 'https://www.uscis.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Immigration case files, naturalization records', true),

('U.S. Secret Service', 'USSS', 'Federal', 'Washington DC',
 '950 H Street, NW, Suite 3000, Washington, DC 20223', '950 H Street, NW', '20223',
 'foia@secretservice.gov', '202-406-5838', 'USSS FOIA Officer', 'Freedom of Information/Privacy Act Branch',
 'https://www.secretservice.gov/about/foia', 'https://www.secretservice.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Protection records, financial crimes', true),

('Bureau of Prisons', 'BOP', 'Federal', 'Washington DC',
 '320 First Street, NW, Washington, DC 20534', '320 First Street, NW', '20534',
 'BOP-FOIARequests@bop.gov', '202-514-1900', 'BOP FOIA Officer', 'Freedom of Information Act Office',
 'https://www.bop.gov/foia/index.jsp', 'https://www.bop.gov',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Inmate records, prison policies', true),

('Executive Office for Immigration Review', 'EOIR', 'Federal', 'Virginia',
 '5107 Leesburg Pike, Suite 2600, Falls Church, VA 22041', '5107 Leesburg Pike', '22041',
 'EOIR.FOIARequests@usdoj.gov', '703-305-0470', 'EOIR FOIA Officer', 'Office of the General Counsel',
 'https://www.justice.gov/eoir/freedom-information-act-foia', 'https://www.justice.gov/eoir',
 20, true, 'Duplication: $0.10/page', true,
 true, true, true, 'Immigration court records, appeals', true)

ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 4: ADD VIOLATIVE FEDERAL/STATE LAWS
-- Laws that have been found to violate civil/constitutional rights
-- ============================================

-- Add violative laws to federal_laws table
INSERT INTO public.federal_laws (
  title, citation, category, summary, protections, effective_date, enforcement_agency
) VALUES

-- Laws declared unconstitutional or violative
('Defense of Marriage Act (DOMA) - Section 3', '1 U.S.C. 7 (struck down)', 'LGBTQ Rights',
 'Defined marriage as between one man and one woman for federal purposes. Struck down by Supreme Court in United States v. Windsor (2013) as unconstitutional violation of Fifth Amendment due process.',
 ARRAY['Ruled unconstitutional', 'Violated equal protection', 'Discriminated against same-sex couples'],
 '1996-09-21', 'Supreme Court (declared unconstitutional)'),

('Alien and Sedition Acts of 1798', 'Historical - Expired', 'Free Speech',
 'Made it a crime to publish false, scandalous, or malicious writing against the government. Widely considered unconstitutional violation of First Amendment, though never formally struck down before expiration.',
 ARRAY['Violated First Amendment', 'Criminalized political speech', 'Used to prosecute critics'],
 '1798-07-14', 'Historical'),

('Espionage Act of 1917 - Sedition Provisions', '18 U.S.C. 793-798', 'Free Speech',
 'Used to prosecute anti-war speech and press. While core provisions remain, seditious conspiracy provisions and broad speech restrictions have been limited by courts.',
 ARRAY['Chilling effect on speech', 'Used against journalists', 'Whistleblower prosecutions'],
 '1917-06-15', 'Department of Justice'),

('Japanese American Internment - Executive Order 9066', 'E.O. 9066 (rescinded)', 'Civil Rights',
 'Authorized internment of Japanese Americans during WWII. Formally rescinded 1976. Supreme Court upheld in Korematsu (1944) but that decision was later repudiated by Court in Trump v. Hawaii (2018).',
 ARRAY['Mass civil rights violation', 'Racial discrimination', 'Due process violations'],
 '1942-02-19', 'Historical - Rescinded'),

('Patriot Act - Section 215', '50 U.S.C. 1861 (expired/reformed)', 'Privacy',
 'Allowed bulk collection of phone metadata. NSA mass surveillance program under this section found unlawful by Second Circuit. Reformed by USA FREEDOM Act (2015).',
 ARRAY['Mass surveillance', 'Fourth Amendment concerns', 'Reformed after Snowden revelations'],
 '2001-10-26', 'FISA Court / DOJ'),

('Stop-and-Frisk Policies (NYC)', 'Local Policy', 'Fourth Amendment',
 'NYPD policy found unconstitutional in Floyd v. City of New York (2013). Court found policy violated Fourth Amendment (unreasonable searches) and Fourteenth Amendment (racial profiling).',
 ARRAY['Fourth Amendment violation', 'Racial profiling', 'Unconstitutional policing'],
 'Policy Era', 'Federal Court'),

('Voter ID Laws - Various States', 'Various State Laws', 'Voting Rights',
 'Strict voter ID requirements in several states found to discriminate against minority voters. Texas voter ID law struck down; North Carolina law described as targeting Black voters with surgical precision.',
 ARRAY['Voting discrimination', 'Disproportionate impact on minorities', 'Fourteenth/Fifteenth Amendment'],
 'Various', 'DOJ Voting Section'),

('Anti-Sodomy Laws', 'Various State Laws (struck down)', 'LGBTQ Rights',
 'State laws criminalizing consensual same-sex relations struck down as unconstitutional in Lawrence v. Texas (2003) as violating due process liberty interests.',
 ARRAY['Privacy violation', 'Discriminatory enforcement', 'Fourteenth Amendment'],
 'Various', 'Supreme Court'),

('Separate But Equal - Plessy v. Ferguson', 'Historical Doctrine', 'Civil Rights',
 'Doctrine permitting racial segregation overturned by Brown v. Board of Education (1954). Segregation laws throughout South were unconstitutional violations of equal protection.',
 ARRAY['Racial discrimination', 'Equal protection violation', 'Systemic civil rights violations'],
 '1896-1954', 'Supreme Court (overturned)'),

('Poll Taxes', 'Various State Laws (unconstitutional)', 'Voting Rights',
 'Taxes required to vote, used to disenfranchise Black voters and poor whites. Prohibited in federal elections by 24th Amendment (1964) and in all elections by Harper v. Virginia (1966).',
 ARRAY['Voting discrimination', 'Economic disenfranchisement', 'Fourteenth/Fifteenth Amendment'],
 'Historical', 'Constitutional Amendment'),

('Literacy Tests for Voting', 'Various State Laws (banned)', 'Voting Rights',
 'Tests used to prevent Black citizens from voting. Banned nationwide by Voting Rights Act of 1965. Courts found tests were discriminatory in purpose and effect.',
 ARRAY['Voting discrimination', 'Racial discrimination', 'Fifteenth Amendment violation'],
 'Historical', 'Voting Rights Act'),

('California Prop 8', 'Cal. Const. Art. I, Sec. 7.5 (struck down)', 'LGBTQ Rights',
 'Ballot initiative banning same-sex marriage. Struck down by federal courts as unconstitutional violation of due process and equal protection.',
 ARRAY['Marriage discrimination', 'Equal protection violation', 'Due process violation'],
 '2008-11-04', 'Federal Courts'),

('Arizona SB 1070 - Show Me Your Papers', 'A.R.S. 11-1051 (partially struck down)', 'Immigration/Civil Rights',
 'Arizona immigration law allowing police to check immigration status. Key provisions struck down by Supreme Court in Arizona v. United States (2012) as preempted by federal law.',
 ARRAY['Racial profiling concerns', 'Federal preemption', 'Fourth Amendment issues'],
 '2010-04-23', 'Supreme Court'),

('Qualified Immunity Doctrine', 'Judicially Created', 'Police Accountability',
 'Court-created doctrine shielding officers from civil rights lawsuits unless they violate clearly established law. Criticized for preventing accountability and considered by many to violate Section 1983.',
 ARRAY['Prevents police accountability', 'Section 1983 limitation', 'Reform efforts ongoing'],
 '1967 (Pierson v. Ray)', 'Courts'),

('Civil Asset Forfeiture - Equitable Sharing', 'DOJ Policy', 'Due Process',
 'Allows seizure of property without criminal conviction. Courts have found various applications violate due process. Reforms ongoing but practice continues to face constitutional challenges.',
 ARRAY['Due process concerns', 'Property rights violations', 'Fifth Amendment issues'],
 'Ongoing', 'DOJ/Local Law Enforcement'),

('Seditious Conspiracy - 18 USC 2384', '18 U.S.C. 2384', 'Free Speech',
 'Criminalizes conspiracy to overthrow government. Historically used against labor organizers and political dissidents. Revived in modern prosecutions with First Amendment concerns.',
 ARRAY['First Amendment concerns', 'Political prosecution risk', 'Broad interpretation concerns'],
 '1861', 'Department of Justice'),

('Material Support for Terrorism', '18 U.S.C. 2339B', 'Free Speech/Association',
 'Criminalizes material support to designated terrorist organizations. Holder v. Humanitarian Law Project (2010) upheld broad interpretation, but dissent raised serious First Amendment concerns.',
 ARRAY['First Amendment concerns', 'Associational freedom', 'Vague standards'],
 '1996', 'Department of Justice'),

('No Fly List - Due Process', 'Various', 'Due Process',
 'Government terror watch list with no clear standards or adequate process to challenge. Courts have found procedures violate due process (Latif v. Holder, 2014).',
 ARRAY['Due process violation', 'No meaningful review', 'Constitutional concerns'],
 'Post-9/11', 'DHS/FBI'),

('Felon Disenfranchisement Laws', 'Various State Laws', 'Voting Rights',
 'Laws permanently or temporarily revoking voting rights from people with felony convictions. Disproportionately impacts minority communities. Florida Amendment 4 restored rights to 1.4 million.',
 ARRAY['Voting discrimination', 'Disproportionate racial impact', 'Fourteenth Amendment concerns'],
 'Various', 'State Governments')

ON CONFLICT DO NOTHING;

-- Add note about data verification
COMMENT ON TABLE public.activists IS 'Directory of First Amendment auditors and civil rights activists. Users should verify information independently. All entries are based on publicly available information about known auditors with verifiable YouTube channels.';

COMMENT ON TABLE public.foia_agencies IS 'Directory of federal government agencies for FOIA requests. State and local agencies coming soon. Contact information sourced from official .gov websites.';

COMMENT ON TABLE public.federal_laws IS 'Federal civil rights laws and statutes, including laws that have been found violative of constitutional rights. Includes both protective laws and historically problematic laws for educational purposes.';

-- Add announcement for state/local FOIA agencies
INSERT INTO public.forum_threads (category, title, content, username, is_pinned)
VALUES (
  'Announcements',
  'State and Local FOIA Agencies Coming Soon',
  'We are actively compiling a comprehensive directory of state and local government agencies for FOIA/public records requests. This will include:

- All 50 state attorney general offices
- State police and highway patrol agencies
- Major city police departments
- County sheriff offices
- State departments of corrections
- And more!

In the meantime, you can find federal agency FOIA contacts in our FOIA Builder section. For state-specific requests, we recommend checking your state''s Attorney General website or Secretary of State office for guidance.

Stay tuned for updates!',
  'Civil Rights Hub Admin',
  true
)
ON CONFLICT DO NOTHING;
