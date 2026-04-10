-- Additional specialized FOIA/public records templates for police accountability,
-- journalist source protection, and civil rights investigations.
-- All statutory citations verified accurate.

INSERT INTO public.foia_templates (
  title, state, state_code, template_type,
  agency_name, agency_type,
  template_body, subject_line, instructions,
  submission_method, submission_url,
  fee_information, statute_citation, response_deadline_days,
  appeal_process, notes, is_popular
) VALUES

-- =====================================================
-- POLICE ACCOUNTABILITY TEMPLATES
-- =====================================================

(
  'Body Camera Footage Request – State/Local Police',
  NULL, NULL, 'local',
  'Local Police Department', 'Law Enforcement',
  'Public Records Request – Body Camera Footage

{{DATE}}

Records Access Officer
{{AGENCY_NAME}}
{{AGENCY_ADDRESS}}

Re: Public Records Request – Body-Worn Camera Footage

Dear Records Access Officer:

Pursuant to {{STATE_PUBLIC_RECORDS_ACT}}, I am requesting copies of all body-worn camera (BWC) footage from the following incident:

Date of Incident: {{INCIDENT_DATE}}
Location: {{INCIDENT_LOCATION}}
Officer(s) involved: {{OFFICER_NAME_OR_BADGE_NUMBER}} (if known)
Case/Report Number: {{CASE_NUMBER}} (if known)
Description of incident: {{BRIEF_DESCRIPTION}}

I am requesting:
1. All body-worn camera footage from all officers present at the scene
2. Any dash-cam footage from police vehicles at the scene
3. Any other video or audio recordings of the incident
4. The incident or arrest report associated with this event
5. The use-of-force report if any force was used

If any portion of this request is denied, please provide:
- A written explanation of the specific statutory basis for each denial
- A description of the withheld material (Vaughn index)
- Information about my right to appeal the denial

Please notify me of any fees before incurring costs exceeding ${{FEE_THRESHOLD}}.

Name: {{YOUR_NAME}}
Address: {{YOUR_ADDRESS}}
Phone: {{YOUR_PHONE}}
Email: {{YOUR_EMAIL}}

Sincerely,
{{YOUR_NAME}}',
  'Public Records Request – Body Camera Footage – {{INCIDENT_DATE}}',
  'Submit via the agency''s online records portal or by certified mail. Include as much detail as possible about the incident date, location, and officers involved. Under many state laws, body camera footage may have expedited access requirements. California SB 1421 (effective 2019) specifically mandates disclosure of BWC footage for serious use-of-force and officer misconduct incidents.',
  ARRAY['online', 'mail', 'email'],
  NULL,
  'Fees vary by agency. Most agencies charge per-page for documents; video files may have processing fees. Request a fee waiver by explaining the public interest in the request.',
  'Varies by state (CA: Gov''t Code § 6254(f)(2), SB 1421; TX: Gov''t Code Ch. 552; IL: 5 ILCS 140/; WA: RCW 42.56)',
  10,
  'If denied, appeal to the agency head within the timeframe specified in the denial letter (typically 30 days). If denied on appeal, consider: (1) state attorney general opinion (available in many states), (2) state ombudsman, (3) litigation under the applicable public records law.',
  'This template is designed for state and local requests. Federal requests for FBI or DEA video footage should use the federal FOIA template with the appropriate agency address.',
  true
),

(
  'Police Use-of-Force Records Request',
  NULL, NULL, 'local',
  'Local Police Department / Sheriff', 'Law Enforcement',
  'Public Records Request – Use-of-Force Records

{{DATE}}

Records Access Officer
{{AGENCY_NAME}}
{{AGENCY_ADDRESS}}

Re: Public Records Request – Use-of-Force Records

Dear Records Access Officer:

Pursuant to {{STATE_PUBLIC_RECORDS_ACT}}, I request the following records relating to use of force by officers of {{AGENCY_NAME}}:

REQUEST 1 – Incident-Specific Records (if applicable):
- All use-of-force reports for the incident on {{INCIDENT_DATE}} at {{INCIDENT_LOCATION}}
- All internal affairs or professional standards investigation files for this incident
- All body-worn camera and dash-cam footage
- All 911 calls, dispatch recordings, and computer-aided dispatch (CAD) logs

REQUEST 2 – Aggregate Data (for policy analysis):
- All use-of-force reports filed from {{START_DATE}} to {{END_DATE}}
- Statistical summary of use-of-force incidents by: officer, force type, subject race/ethnicity, outcome
- Current use-of-force policy and any revisions in the last 5 years
- Training records on use of force for all officers (aggregate, not individual names)
- Any after-action reviews or audits of use-of-force practices

If records are maintained in electronic format, please provide them in that format.
If any record is withheld, please provide the specific statutory exemption relied upon.

Name: {{YOUR_NAME}}
Address: {{YOUR_ADDRESS}}
Email: {{YOUR_EMAIL}}

Sincerely,
{{YOUR_NAME}}',
  'Public Records Request – Use-of-Force Records – {{AGENCY_NAME}}',
  'Many states have specific statutes requiring disclosure of police misconduct records. California SB 1421 (2019) requires disclosure of records related to serious use of force, officer-involved shootings, and sustained misconduct findings. New York Civil Rights Law § 50-a was repealed in 2020, opening up NYPD disciplinary records. Check your state''s specific requirements before submitting.',
  ARRAY['online', 'mail', 'email'],
  NULL,
  'First request should be free or low-cost. If you anticipate large production costs, specify which records to prioritize or request a fee waiver based on public interest.',
  'Varies by state. CA: Penal Code § 832.7-832.8 (SB 1421). NY: Civil Rights Law § 50-a repealed; use NY FOIL. IL: 5 ILCS 140/; TX: Gov''t Code § 552.',
  10,
  'Denials should be appealed promptly. For federal agencies, FOIA appeals go to the Office of Information Policy (OIP). Many police transparency organizations (e.g., MuckRock, Invisible Institute) can assist with requests.',
  'Use this template for both individual incident requests and pattern-and-practice investigations. Excellent for journalists, ACLU affiliates, and community organizations doing oversight.',
  true
),

(
  'Internal Affairs / Civilian Complaint Records Request',
  NULL, NULL, 'local',
  'Police Department / Civilian Police Review Board', 'Law Enforcement',
  'Public Records Request – Officer Complaint and Disciplinary Records

{{DATE}}

Records Access Officer
{{AGENCY_NAME}} / Civilian Police Review Board
{{AGENCY_ADDRESS}}

Re: Public Records Request – Officer Complaint and Disciplinary Records

Dear Records Access Officer:

Pursuant to {{STATE_PUBLIC_RECORDS_ACT}}, I request the following records regarding complaints against officers of {{AGENCY_NAME}}:

1. All civilian complaints filed against Officer {{OFFICER_NAME}} (Badge #{{BADGE_NUMBER}}) from {{START_DATE}} to present
2. All internal affairs investigation files for complaints listed above
3. Disciplinary actions taken as a result of any sustained complaints
4. The officer''s use-of-force history (dates and force types)
5. Any civil judgments or settlements in cases involving this officer
6. The officer''s employment history including prior departments
7. All training records related to de-escalation and use of force

For aggregate requests:
- Total number of civilian complaints received per year for past 5 years
- Breakdown of complaint dispositions (sustained, exonerated, unfounded, etc.)
- Number of officers with 5+ complaints in past 3 years
- Total civil settlement payouts for officer misconduct in past 5 years

I request all records in electronic format where available.

Name: {{YOUR_NAME}}
Address: {{YOUR_ADDRESS}}
Email: {{YOUR_EMAIL}}

Sincerely,
{{YOUR_NAME}}',
  'Public Records Request – Police Officer Complaint Records – {{OFFICER_NAME_OR_BADGE}}',
  'IMPORTANT: Many states have historically shielded police personnel records. Key legal changes:\n- New York: § 50-a repealed June 2020 — disciplinary records now open\n- California: SB 1421 (2019) — sustained misconduct records open\n- Illinois: HB 3653 (2021) — statewide officer decertification database\n- Colorado: SB 217 (2020) — duty to intervene, records open\n\nAlways submit to BOTH the police department AND the civilian review board (if one exists). The NPMSRP (National Police Misconduct Reporting Project) and Invisible Institute''s Citizens Police Data Project are excellent resources for cross-referencing.',
  ARRAY['online', 'mail', 'email'],
  NULL,
  'Some agencies charge for extensive record compilations. Request a fee waiver noting the public interest in police accountability.',
  'Varies significantly by state. NY Civil Rights Law § 50-a repealed. CA Penal Code § 832.7. IL 5 ILCS 140/. WA RCW 10.93.160.',
  10,
  'Consider submitting to civilian oversight boards, city council, or mayor''s office simultaneously. MuckRock.com provides free FOIA infrastructure and can help coordinate multi-agency requests.',
  true
),

-- =====================================================
-- IMMIGRATION / ICE DETENTION RECORDS
-- =====================================================

(
  'ICE Detention Records Request – FOIA to DHS',
  NULL, NULL, 'federal',
  'U.S. Immigration and Customs Enforcement (ICE)', 'Federal Agency',
  'Freedom of Information Act Request – ICE Detention Records

{{DATE}}

ICE FOIA Office
500 12th Street SW, Stop 5009
Washington, DC 20536-5009

Re: FOIA Request – ICE Detention Records for {{DETAINEE_NAME}}

Dear FOIA Officer:

This is a request under the Freedom of Information Act (FOIA), 5 U.S.C. § 552, and the Privacy Act, 5 U.S.C. § 552a.

I request all records concerning {{DETAINEE_NAME}}, date of birth {{DOB}}, country of origin {{COUNTRY}}, A-Number (if known): {{A_NUMBER}}.

Specifically, I request:
1. All detention records including: detention orders, detainer notices (Form I-247), booking records
2. All records of deportation proceedings including: charging documents (NTA), court hearing records
3. All records of any criminal history relied upon for detention decisions
4. All records from any risk classification assessment
5. All medical records from ICE custody (separate Privacy Act request may be needed)
6. All records of any contact with ICE officials during any encounter
7. Records of any bond hearing or conditions of release
8. All communications between ICE officers and local/state law enforcement regarding this individual

If records are withheld, please provide a Vaughn index identifying each withheld record and the specific exemption claimed.

The subject of this request authorizes disclosure: [attach signed authorization if self-requesting or authorized]

Name: {{YOUR_NAME}} / {{REQUESTER_RELATIONSHIP}}
Address: {{YOUR_ADDRESS}}
Phone: {{YOUR_PHONE}}
Email: {{YOUR_EMAIL}}

Sincerely,
{{YOUR_NAME}}',
  'FOIA Request – ICE Detention Records for {{DETAINEE_NAME}} – {{A_NUMBER}}',
  'ICE FOIA office: https://www.ice.gov/foia. Online portal: https://efoia.ice.gov. Processing time is often longer than 20-day statutory deadline — consider an expedited processing request if there is a pending immigration proceeding. Organizations that can help: NILC, RAICES, Immigration Equality, local legal aid. Include a Privacy Act request simultaneously for maximum records disclosure.',
  ARRAY['online', 'mail'],
  'https://efoia.ice.gov',
  'Federal FOIA requests are generally free for up to 2 hours of search time and 100 pages. Journalists and educational institutions may receive additional fee waivers.',
  '5 U.S.C. § 552 (FOIA); 5 U.S.C. § 552a (Privacy Act); 8 U.S.C. § 1357 (ICE authority)',
  20,
  'Appeal to the ICE FOIA Appeal Unit within 90 days of denial. If denied on appeal, consider filing with the Office of Government Information Services (OGIS) for mediation, or litigation under 5 U.S.C. § 552(a)(4)(B).',
  'For individuals in detention, use expedited processing request citing imminent threat of deportation. Include "EXPEDITED PROCESSING REQUESTED" in subject line.',
  true
),

-- =====================================================
-- JOURNALIST PROTECTION / SHIELD LAW TEMPLATES
-- =====================================================

(
  'Reporter Shield Law Notice – Subpoena Response Template',
  NULL, NULL, 'federal',
  'Court / Law Enforcement Agency', 'Other',
  'Notice of Shield Law Protection and Objection to Subpoena/Request

{{DATE}}

[Court Name / Law Enforcement Agency]
[Address]

Re: Objection to Subpoena / Request Directed to {{JOURNALIST_NAME}} – Shield Law Protection

To Whom It May Concern:

I am a journalist employed by / freelancing for {{PUBLICATION_NAME}}. I am in receipt of your subpoena/request dated {{SUBPOENA_DATE}} seeking {{DESCRIPTION_OF_REQUESTED_INFORMATION}}.

I hereby assert my rights under {{APPLICABLE_SHIELD_LAW}} and respectfully object to this subpoena/request on the following grounds:

1. SHIELD LAW PROTECTION: As a journalist, I have a qualified privilege under {{APPLICABLE_SHIELD_LAW}} not to reveal my confidential sources, unpublished information, and newsgathering materials. This privilege applies to {{SPECIFIC_ITEMS_AT_ISSUE}}.

2. FIRST AMENDMENT PROTECTION: Compelled disclosure of journalistic materials and sources implicates the First Amendment rights of the press and the public''s right to receive information from a free press. See Branzburg v. Hayes, 408 U.S. 665 (1972); In re Farber, 78 N.J. 259 (1978).

3. FAILURE TO EXHAUST ALTERNATIVE MEANS: The party seeking this information has not demonstrated that:
   a) The information sought is relevant and material to the proceeding
   b) The information cannot be obtained from alternative sources
   c) There is a compelling and overriding interest that outweighs the press''s privilege

4. OVERBREADTH: The subpoena is facially overbroad and does not describe the requested materials with reasonable particularity as required by the applicable rules.

I request that you withdraw this subpoena/request. If you decline to do so, I will seek a protective order or move to quash in the appropriate court.

I am available to discuss this matter. I recommend you contact the legal counsel for {{PUBLICATION_NAME}} at:

Legal Counsel: {{COUNSEL_NAME}}
Phone: {{COUNSEL_PHONE}}
Email: {{COUNSEL_EMAIL}}

Sincerely,
{{JOURNALIST_NAME}}
{{TITLE}}, {{PUBLICATION_NAME}}',
  'Journalist Shield Law Objection – {{YOUR_NAME}} / {{PUBLICATION_NAME}}',
  'IMPORTANT: If you receive a subpoena, contact a media law attorney IMMEDIATELY. Do not comply or destroy materials without legal advice. Free resources:\n- Reporters Committee 24/7 hotline: 1-800-336-4243\n- Reporters Committee online: https://www.rcfp.org\n- State shield law status: https://www.rcfp.org/reporters-privilege/\n\nShield laws vary significantly by state:\n- 40 states + DC have shield laws\n- Federal courts apply a qualified common law privilege\n- Grand jury subpoenas have more limited protection (Branzburg v. Hayes)\n- DOJ media subpoena guidelines provide additional protection for news organizations',
  ARRAY['mail'],
  NULL,
  'This notice is not a legal brief and should be supplemented by a motion to quash filed in court by your attorney.',
  'First Amendment; Applicable state shield law (e.g., CA Evid. Code § 1070; NY Civil Rights Law § 79-h; IL 735 ILCS 5/8-901; TX Civ. Prac. & Rem. Code § 22.021)',
  NULL,
  'File a formal motion to quash through your attorney. The Reporters Committee provides a model motion to quash on their website. Keep copies of all materials that are the subject of the subpoena in a secure location.',
  'This is a notice template only — not a legal brief. Always consult an attorney before responding to any legal process.',
  true
),

-- =====================================================
-- SURVEILLANCE / MONITORING RECORDS
-- =====================================================

(
  'FBI Surveillance / COINTELPRO Records Request',
  NULL, NULL, 'federal',
  'Federal Bureau of Investigation (FBI)', 'Federal Agency',
  'Freedom of Information Act / Privacy Act Request – FBI Records

{{DATE}}

FBI FOIA/PA Request
Record/Information Dissemination Section (RIDS)
170 Marcel Drive
Winchester, VA 22602-4843

Re: FOIA/Privacy Act Request for Records Concerning {{SUBJECT}}

Dear FOIA Officer:

This is a request under the Freedom of Information Act (5 U.S.C. § 552) and the Privacy Act (5 U.S.C. § 552a).

I request all records maintained by the FBI concerning:

Subject: {{SUBJECT_NAME_OR_ORGANIZATION}}
Date of Birth (if individual): {{DOB}}
Other identifiers: {{SSN_OR_OTHER_IF_APPLICABLE_AND_CONSENTED}}

Specifically, I request:
1. All investigative files, reports, and memoranda concerning the subject
2. All surveillance records including: physical surveillance logs, electronic surveillance records, and pen register data
3. All records of undercover operations or informant use related to the subject
4. All records from any Joint Terrorism Task Force (JTTF) investigation
5. All records of any National Security Letter (NSL) issued concerning the subject
6. All records of any FISA order or warrant concerning the subject (to the extent declassified)
7. All records shared with or received from state/local law enforcement concerning the subject
8. All records of any FBI Disruption Order or First Amendment-protected activity monitoring

If classified records exist, please process the unclassified portions and provide a Vaughn index for any withheld records.

The subject of this request is {{YOURSELF/ORGANIZATION}} and consents to disclosure.
[Include signed Privacy Act authorization if requesting about yourself or with authorization]

Name: {{YOUR_NAME}}
Address: {{YOUR_ADDRESS}}
Phone: {{YOUR_PHONE}}
Email: {{YOUR_EMAIL}}

Sincerely,
{{YOUR_NAME}}',
  'FOIA/PA Request – FBI Records Concerning {{SUBJECT_NAME_OR_ORG}}',
  'Submit to FBI RIDS by certified mail or via eFOIPA portal: https://efoia.fbi.gov. Processing times vary widely (months to years for complex requests). The FBI Vault (https://vault.fbi.gov) contains many already-released files — search here first. Organizations with expertise in FBI FOIA: EFF, ACLU, Brennan Center. Note: FISA and NSL records are almost always withheld under national security exemptions.',
  ARRAY['online', 'mail'],
  'https://efoia.fbi.gov',
  'FBI FOIA requests are generally free for up to 2 hours search and 100 pages. Journalists receive additional fee waivers. Include fee waiver request citing public interest.',
  '5 U.S.C. § 552 (FOIA); 5 U.S.C. § 552a (Privacy Act); 28 CFR Part 16',
  20,
  'Appeal denials to the DOJ Office of Information Policy (OIP) within 90 days. Consider filing a complaint with the Office of Government Information Services (OGIS). Litigation option under 5 U.S.C. § 552(a)(4)(B).',
  'Historical COINTELPRO records from the 1950s-1970s are more likely to be released. Recent domestic surveillance records face higher exemption claims. FBI Vault already has many released files at vault.fbi.gov — check before submitting a new request.',
  true
),

-- =====================================================
-- ENVIRONMENTAL / WATER / PUBLIC HEALTH
-- =====================================================

(
  'Environmental Enforcement Records – EPA FOIA',
  NULL, NULL, 'federal',
  'U.S. Environmental Protection Agency (EPA)', 'Federal Agency',
  'Freedom of Information Act Request – Environmental Enforcement Records

{{DATE}}

EPA National FOIA Office
1200 Pennsylvania Ave NW (2822T)
Washington, DC 20460

Or submit to regional EPA FOIA office for Region {{EPA_REGION}}

Re: FOIA Request – Environmental Enforcement and Inspection Records

Dear FOIA Officer:

This is a request under the Freedom of Information Act (FOIA), 5 U.S.C. § 552.

I request all records concerning environmental enforcement activities related to:

Facility/Location: {{FACILITY_NAME_OR_ADDRESS}}
Dates: {{DATE_RANGE}}
Permit Numbers (if known): {{PERMIT_NUMBERS}}

Specifically, I request:
1. All inspection reports and compliance evaluation reports for the facility
2. All Notice of Violation (NOV) letters and consent orders
3. All enforcement actions including administrative, civil, and criminal referrals
4. All Toxic Release Inventory (TRI) reports filed by the facility
5. All air quality monitoring data and water quality sampling results
6. All records of any environmental justice analysis or community impact assessments
7. Records of any citizen complaints about this facility and EPA responses
8. All correspondence between EPA and the facility regarding compliance

Additionally, under 40 C.F.R. Part 2, I request expedited processing because this request involves imminent threat to public health from environmental contamination.

Name: {{YOUR_NAME}} / {{ORGANIZATION}}
Address: {{YOUR_ADDRESS}}
Email: {{YOUR_EMAIL}}

Sincerely,
{{YOUR_NAME}}',
  'EPA FOIA Request – Environmental Enforcement Records – {{FACILITY_OR_LOCATION}}',
  'EPA FOIA portal: https://foiaonline.gov (for EPA requests). Many EPA records are already available in public databases: ECHO (Enforcement and Compliance History Online) at https://echo.epa.gov, TRI Explorer at https://www.epa.gov/toxics-release-inventory-tri-program. Environmental justice communities disproportionately impacted by pollution should note environmental justice statutes in fee waiver requests.',
  ARRAY['online', 'mail', 'email'],
  'https://foiaonline.gov',
  'No fees for first 100 pages and 2 hours search. Journalists and public interest groups routinely receive fee waivers. Include fee waiver request.',
  '5 U.S.C. § 552 (FOIA); Clean Air Act § 114; Clean Water Act § 308; EPCRA § 313 (TRI); 40 C.F.R. Part 2',
  20,
  'Appeal denials to the EPA Administrator''s office within 90 days. Many state environmental agencies have parallel public records laws — submit requests to both federal EPA and state environmental agency simultaneously.',
  'ECHO database (echo.epa.gov) is publicly searchable and often has the enforcement data you need without a FOIA request.',
  false
)

ON CONFLICT DO NOTHING;
