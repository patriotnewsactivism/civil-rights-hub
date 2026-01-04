-- Comprehensive FOIA Request Templates
-- Source: FOIA.gov, DOJ FOIA guidance, agency FOIA pages, RCFP resources
-- Date: January 4, 2026

-- Clear existing templates to replace with verified templates
TRUNCATE public.foia_templates;

-- FEDERAL FOIA TEMPLATES

-- 1. General Federal FOIA Request Template
INSERT INTO public.foia_templates (
  title,
  state,
  state_code,
  template_type,
  agency_name,
  agency_type,
  template_body,
  subject_line,
  instructions,
  submission_method,
  submission_email,
  submission_address,
  submission_url,
  fee_information,
  statute_citation,
  response_deadline_days,
  appeal_process,
  notes,
  is_popular
) VALUES (
  'General Federal FOIA Request',
  NULL, -- Federal template
  NULL,
  'federal',
  'Any Federal Agency',
  'Federal Agency',
  'Freedom of Information Act Request

[Date]

[Agency FOIA Officer Name or "FOIA Officer"]
[Agency Name]
[Address]

Re: Freedom of Information Act Request

Dear FOIA Officer:

This is a request under the Freedom of Information Act (FOIA), 5 U.S.C. § 552.

I request that a copy of the following documents be provided to me:

{{SPECIFIC_RECORDS_DESCRIPTION}}

In order to help determine my status for purposes of determining the applicability of any fees, please be advised that I am {{REQUESTER_CATEGORY}} [e.g., a representative of the news media, affiliated with {{ORGANIZATION}}; an educational institution; a commercial requester; an individual seeking information for personal use].

I am willing to pay fees for this request up to a maximum of {{MAXIMUM_FEE}}. If you estimate that the fees will exceed this limit, please inform me first.

I request a waiver of all fees for this request because disclosure of the requested information is in the public interest and will contribute significantly to public understanding of the operations or activities of the government. {{FEE_WAIVER_JUSTIFICATION}}

If my request is denied in whole or in part, I ask that you justify all deletions by reference to specific exemptions of the FOIA. I expect the release of all segregable portions of otherwise exempt material. I reserve the right to appeal your decision to withhold any information or to deny a waiver of fees.

Please provide the requested records in electronic format if possible. You may email them to {{YOUR_EMAIL}} or mail them to the address below.

I look forward to your reply within 20 business days, as the statute requires.

Sincerely,

{{YOUR_NAME}}
{{YOUR_ADDRESS}}
{{YOUR_PHONE}}
{{YOUR_EMAIL}}',
  'FOIA Request - [Brief Description]',
  'Fill in the placeholders marked with {{DOUBLE_BRACES}}:
- {{SPECIFIC_RECORDS_DESCRIPTION}}: Describe the records you want as specifically as possible (dates, document types, subjects, names)
- {{REQUESTER_CATEGORY}}: Your status (news media, educational, individual, commercial)
- {{ORGANIZATION}}: Your news outlet or institution if applicable
- {{MAXIMUM_FEE}}: Maximum amount you''re willing to pay (or "$0" if requesting fee waiver)
- {{FEE_WAIVER_JUSTIFICATION}}: Explain how disclosure serves the public interest
- {{YOUR_NAME}}, {{YOUR_ADDRESS}}, {{YOUR_PHONE}}, {{YOUR_EMAIL}}: Your contact information

Send this request to the FOIA office of the specific federal agency that has the records you seek.',
  ARRAY['email', 'mail', 'online portal'],
  'Varies by agency',
  'Varies by agency',
  'https://www.foia.gov/report-makerequest.html',
  'Fees may apply for search, review, and duplication. Fee waivers available for journalists, educational use, and public interest requests. Different fee categories for news media, educational institutions, commercial requesters, and individual requesters.',
  '5 U.S.C. § 552',
  20,
  'If your request is denied, you have the right to appeal to the head of the agency within 90 days. Include "FOIA Appeal" in your letter and explain why the denial was incorrect.',
  'Most federal agencies accept FOIA requests via online portals. Visit FOIA.gov to find the specific agency FOIA page. Be as specific as possible about the records you seek to reduce fees and processing time.',
  true
);

-- 2. DOJ Civil Rights Division - Pattern or Practice Records
INSERT INTO public.foia_templates (
  title,
  template_type,
  agency_name,
  agency_type,
  template_body,
  subject_line,
  instructions,
  submission_method,
  submission_url,
  fee_information,
  statute_citation,
  response_deadline_days,
  is_popular
) VALUES (
  'DOJ Civil Rights Division - Police Pattern or Practice Investigation Records',
  'federal',
  'Department of Justice - Civil Rights Division',
  'Federal Agency',
  'FOIA Request - Police Pattern or Practice Investigation Records

[Date]

FOIA/PA Officer
Civil Rights Division
U.S. Department of Justice
950 Pennsylvania Avenue, NW
Washington, DC 20530

Re: Freedom of Information Act Request - Pattern or Practice Investigation Records

Dear FOIA Officer:

This is a request under the Freedom of Information Act (FOIA), 5 U.S.C. § 552.

I request copies of all records related to the Department of Justice Civil Rights Division''s investigation of {{POLICE_DEPARTMENT_NAME}} under 34 U.S.C. § 12601 (pattern or practice authority), including:

1. Investigation findings and reports
2. Correspondence with the police department
3. Consent decree documents (if applicable)
4. Monitoring reports
5. Community input and complaints
6. Expert reports and assessments

Time period: {{START_DATE}} to {{END_DATE}}

I am a {{REQUESTER_CATEGORY}} and request a fee waiver because this information is in the public interest and will contribute to public understanding of law enforcement accountability and civil rights enforcement.

Please provide responsive records in electronic format.

Sincerely,

{{YOUR_NAME}}
{{YOUR_EMAIL}}',
  'FOIA Request - Pattern or Practice Investigation [City/Department]',
  'Replace: {{POLICE_DEPARTMENT_NAME}} with the specific police department (e.g., "Minneapolis Police Department"), {{START_DATE}} and {{END_DATE}} with your date range, {{REQUESTER_CATEGORY}} with your status (journalist, researcher, individual), and your contact information.',
  ARRAY['online portal', 'email', 'mail'],
  'https://www.justice.gov/doj/foia-library/foia-request',
  'Fee waivers routinely granted for news media and public interest requests.',
  '5 U.S.C. § 552',
  20,
  true
);

-- 3. EEOC Discrimination Data Request
INSERT INTO public.foia_templates (
  title,
  template_type,
  agency_name,
  agency_type,
  template_body,
  subject_line,
  instructions,
  submission_method,
  submission_url,
  statute_citation,
  response_deadline_days,
  is_popular
) VALUES (
  'EEOC - Employment Discrimination Charge Data',
  'federal',
  'Equal Employment Opportunity Commission',
  'Federal Agency',
  'FOIA Request - EEOC Charge Data

[Date]

FOIA Office
Equal Employment Opportunity Commission
131 M Street, NE
Washington, DC 20507

Re: Freedom of Information Act Request

Dear FOIA Officer:

Pursuant to the Freedom of Information Act, 5 U.S.C. § 552, I request the following records:

All EEOC charge data for {{EMPLOYER_NAME}} for the period {{START_DATE}} to {{END_DATE}}, including:
- Number of charges filed by basis (race, sex, age, disability, etc.)
- Charge outcomes (settlement, dismissal, cause finding, etc.)
- Monetary relief obtained for charging parties
- Nature of allegations

Alternatively, if employer-specific data cannot be released, I request aggregated statistics for {{INDUSTRY}} in {{GEOGRAPHIC_AREA}}.

I request a fee waiver as a {{REQUESTER_CATEGORY}} seeking information in the public interest.

Please provide records electronically to {{YOUR_EMAIL}}.

Sincerely,

{{YOUR_NAME}}
{{YOUR_CONTACT_INFO}}',
  'FOIA Request - EEOC Charge Data',
  'Note: EEOC may withhold employer-specific data under Exemption 4 (confidential business information). Request may need to be for aggregate data. Fill in placeholders with specific employer, dates, or geographic area.',
  ARRAY['online portal', 'email', 'fax'],
  'https://www.eeoc.gov/foia',
  '5 U.S.C. § 552',
  20,
  true
);

-- 4. HUD Fair Housing Complaint Data
INSERT INTO public.foia_templates (
  title,
  template_type,
  agency_name,
  agency_type,
  template_body,
  subject_line,
  instructions,
  submission_method,
  submission_url,
  statute_citation,
  response_deadline_days
) VALUES (
  'HUD - Fair Housing Complaint Data',
  'federal',
  'Department of Housing and Urban Development',
  'Federal Agency',
  'FOIA Request - Fair Housing Complaint Data

[Date]

HUD FOIA Officer
U.S. Department of Housing and Urban Development
451 7th Street, SW
Washington, DC 20410

Re: Freedom of Information Act Request - Fair Housing Complaints

Dear FOIA Officer:

This is a request under the Freedom of Information Act, 5 U.S.C. § 552.

I request copies of all Fair Housing Act complaint data for {{GEOGRAPHIC_AREA}} from {{START_DATE}} to {{END_DATE}}, including:

- Number of complaints by protected class (race, disability, familial status, etc.)
- Types of housing discrimination alleged
- Complaint outcomes and conciliation agreements
- Patterns of discrimination by neighborhood or landlord (if available)

I am conducting research on housing discrimination patterns and request a fee waiver as this information serves the public interest.

Electronic delivery preferred to {{YOUR_EMAIL}}.

Sincerely,

{{YOUR_NAME}}
{{YOUR_CONTACT_INFO}}',
  'FOIA Request - Fair Housing Data [Geographic Area]',
  'HUD maintains regional offices. May be more efficient to submit to the regional office covering your area of interest. Specify geographic area (city, county, state) and date range.',
  ARRAY['online portal', 'email', 'mail'],
  'https://www.hud.gov/program_offices/administration/foia',
  '5 U.S.C. § 552',
  20
);

-- 5. Police Department Use of Force Records (Federal Template for Local Agencies)
INSERT INTO public.foia_templates (
  title,
  template_type,
  agency_type,
  template_body,
  subject_line,
  instructions,
  submission_method,
  fee_information,
  notes,
  is_popular
) VALUES (
  'Police Use of Force Records Request',
  'local',
  'Police Department',
  'Public Records Request - Use of Force Incidents

[Date]

{{POLICE_DEPARTMENT_NAME}}
Public Records Officer / FOIA Officer
{{DEPARTMENT_ADDRESS}}

Re: Public Records Request - Use of Force Data

Dear Records Officer:

Pursuant to [STATE_OPEN_RECORDS_LAW], I request the following records:

1. All use of force reports from {{START_DATE}} to {{END_DATE}}, including:
   - Date, time, and location of incident
   - Officers involved (names and badge numbers)
   - Type of force used (taser, firearm, physical restraint, etc.)
   - Subject demographics (age, race, gender)
   - Reason for force
   - Injuries sustained
   - Internal review outcomes

2. Department use of force policies and training materials

3. Disciplinary records for officers involved in use of force incidents

I request these records in electronic format (Excel, CSV, or PDF) to reduce costs.

I am willing to pay reasonable fees up to {{MAXIMUM_FEE}}. If costs exceed this amount, please contact me before processing.

[FOR JOURNALISTS: I request a fee waiver as a member of the news media gathering information for public dissemination.]

Please respond within the time period required by [STATE LAW].

Sincerely,

{{YOUR_NAME}}
{{YOUR_EMAIL}}
{{YOUR_PHONE}}',
  'Public Records Request - Use of Force Data',
  'This template should be adapted for your state''s open records law. State laws vary:
- Some states have specific "Sunshine Laws" or "Open Records Acts"
- Response times vary (typically 5-30 days)
- Fee structures differ by state
- Some information may be redacted (officer personnel records, ongoing investigations)

Check your state''s open government laws and police department records policy before submitting.',
  ARRAY['email', 'mail', 'online portal'],
  'Fees vary widely by jurisdiction. Some charge per page, others hourly for search/review time. Journalists often receive fee waivers.',
  'Officers'' names may be redacted in some states. Consider also requesting body camera footage if specific incidents are known. Some states have specific laws governing access to police records.',
  true
);

-- STATE-LEVEL TEMPLATES (Examples)

-- 6. California Public Records Act Template
INSERT INTO public.foia_templates (
  title,
  state,
  state_code,
  template_type,
  agency_type,
  template_body,
  subject_line,
  instructions,
  submission_method,
  fee_information,
  statute_citation,
  response_deadline_days,
  notes
) VALUES (
  'California Public Records Act (CPRA) Request',
  'California',
  'CA',
  'state',
  'State or Local Agency',
  'California Public Records Act Request

[Date]

Public Records Coordinator
{{AGENCY_NAME}}
{{AGENCY_ADDRESS}}

Re: California Public Records Act Request

Dear Public Records Coordinator:

Pursuant to the California Public Records Act (Government Code §§ 6250 et seq.), I request copies of the following public records:

{{RECORDS_DESCRIPTION}}

If any portions of these records are exempt from disclosure, please provide all segregable, non-exempt portions.

I request these records in electronic format if available.

Please provide an estimated date when the records will be available and the cost, if any, for copying.

If you deny all or any part of this request, please cite each specific exemption you believe justifies your refusal and notify me of appeal procedures.

Thank you for your prompt attention to this matter.

Sincerely,

{{YOUR_NAME}}
{{YOUR_EMAIL}}
{{YOUR_PHONE}}',
  'California Public Records Act Request - [Subject]',
  'California agencies must respond within 10 days, though they may request 14-day extension. Be specific about records requested. CPRA favors disclosure - agencies must justify withholding.',
  ARRAY['email', 'mail', 'online portal'],
  'Agencies may charge direct costs of duplication. First hour of search time typically free.',
  'Cal. Gov. Code §§ 6250-6270',
  10,
  'California has strong open records laws. Many cities and counties have online request portals. The CPRA applies to state and local agencies.'
);

-- 7. New York Freedom of Information Law (FOIL) Request
INSERT INTO public.foia_templates (
  title,
  state,
  state_code,
  template_type,
  agency_type,
  template_body,
  subject_line,
  instructions,
  submission_method,
  statute_citation,
  response_deadline_days
) VALUES (
  'New York Freedom of Information Law (FOIL) Request',
  'New York',
  'NY',
  'state',
  'State or Local Agency',
  'Freedom of Information Law Request

[Date]

Records Access Officer
{{AGENCY_NAME}}
{{AGENCY_ADDRESS}}

Re: Freedom of Information Law Request

Dear Records Access Officer:

Under the New York Freedom of Information Law (Public Officers Law, Article 6), I request access to and copies of the following records:

{{RECORDS_DESCRIPTION}}

If any portion of this request is denied, please provide a written explanation citing the specific statutory exemption and inform me of my right to appeal.

Please provide these records in electronic format if possible to reduce costs.

I expect a response within five business days as required by FOIL.

Thank you.

Sincerely,

{{YOUR_NAME}}
{{YOUR_EMAIL}}
{{YOUR_PHONE}}',
  'FOIL Request - [Subject]',
  'New York agencies must respond within 5 business days, either granting access, denying access, or acknowledging receipt with estimated date for determination. Appeals go to agency head, then potentially Article 78 proceeding.',
  ARRAY['email', 'mail'],
  'N.Y. Pub. Off. Law §§ 84-90',
  5
);

-- 8. Federal Agency Body Camera Footage Template
INSERT INTO public.foia_templates (
  title,
  template_type,
  agency_name,
  agency_type,
  template_body,
  subject_line,
  instructions,
  statute_citation,
  response_deadline_days,
  notes,
  is_popular
) VALUES (
  'Body Camera Footage Request (Federal Agencies)',
  'federal',
  'Federal Law Enforcement Agencies',
  'Federal Law Enforcement',
  'FOIA Request - Body Worn Camera Footage

[Date]

FOIA Officer
{{FEDERAL_AGENCY_NAME}}
{{AGENCY_ADDRESS}}

Re: Freedom of Information Act Request - Body Worn Camera Footage

Dear FOIA Officer:

This is a request under the Freedom of Information Act, 5 U.S.C. § 552.

I request a copy of all body worn camera (BWC) footage from the incident that occurred on {{DATE}} at approximately {{TIME}} at {{LOCATION}}.

Incident details:
- Officers involved: {{OFFICER_NAMES_OR_BADGE_NUMBERS}}
- Nature of incident: {{INCIDENT_DESCRIPTION}}
- Report number (if known): {{REPORT_NUMBER}}

I understand some portions may be redacted under FOIA exemptions (e.g., Exemption 6 for personal privacy, Exemption 7 for law enforcement records). Please release all segregable portions.

[IF SUBJECT OR FAMILY MEMBER: I am the subject of this incident / a family member of {{NAME}}, and consent to release of footage showing me/my family member.]

I request electronic delivery of the footage to {{YOUR_EMAIL}}.

Please contact me at {{YOUR_PHONE}} if you need additional information to locate this footage.

Sincerely,

{{YOUR_NAME}}
{{YOUR_CONTACT_INFO}}',
  'FOIA Request - BWC Footage [Date/Location]',
  'This template is for federal agencies (FBI, DEA, ATF, U.S. Marshals, ICE, Border Patrol, etc.). For local police, use state open records law. Body camera policies vary by agency. Some agencies require you to be the subject or have consent. Be as specific as possible about date, time, location, and officers to help locate footage.',
  '5 U.S.C. § 552',
  20,
  'Body camera footage may be withheld under FOIA Exemption 7(C) (invasion of personal privacy) or 7(E) (law enforcement techniques). Strongest case if you are the subject or have direct interest. Ongoing investigations may delay release.',
  true
);

-- Mark popular templates
UPDATE public.foia_templates SET is_popular = true WHERE title IN (
  'General Federal FOIA Request',
  'DOJ Civil Rights Division - Police Pattern or Practice Investigation Records',
  'Police Use of Force Records Request',
  'California Public Records Act (CPRA) Request',
  'Body Camera Footage Request (Federal Agencies)'
);
