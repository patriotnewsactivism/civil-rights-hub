-- Seed data for foia_templates table - FOIA and open records request templates

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
) VALUES

-- Federal FOIA Templates
(
  'Federal FOIA Request - Police Misconduct Records',
  NULL,
  NULL,
  'federal',
  'Department of Justice',
  'Federal Agency',
  'Re: Freedom of Information Act Request

Dear FOIA Officer:

This is a request under the Freedom of Information Act (5 U.S.C. § 552).

I request copies of all records concerning:

{{SPECIFIC_RECORDS}}

For example, this request includes but is not limited to:
- Incident reports and investigative files
- Internal affairs records
- Disciplinary records
- Body camera and dashboard camera footage
- 911 calls and dispatch recordings
- Use of force reports
- Witness statements and interviews

I request records for the time period: {{DATE_RANGE}}

I am willing to pay fees for this request up to {{FEE_LIMIT}}. If you estimate that the fees will exceed this limit, please inform me first.

I request a waiver of all fees for this request pursuant to 5 U.S.C. § 552(a)(4)(A)(iii) because disclosure of the requested information is in the public interest and will contribute significantly to public understanding of government operations and activities.

If my request is denied in whole or part, I ask that you justify all deletions by reference to specific exemptions of the FOIA. I expect the release of all segregable portions of otherwise exempt material.

Please provide the records in electronic format if available.

I look forward to your reply within 20 business days, as required by law.

Sincerely,
{{YOUR_NAME}}
{{YOUR_ADDRESS}}
{{YOUR_EMAIL}}
{{YOUR_PHONE}}',
  'FOIA Request - {{BRIEF_DESCRIPTION}}',
  'Fill in the placeholders in double curly braces {{}} with your specific information:
- {{SPECIFIC_RECORDS}}: Describe the exact records you want (be as specific as possible)
- {{DATE_RANGE}}: Specify the time period (e.g., "January 1, 2024 to December 31, 2024")
- {{FEE_LIMIT}}: Maximum amount you will pay (e.g., "$50" or "no fee limit")
- {{YOUR_NAME}}, {{YOUR_ADDRESS}}, {{YOUR_EMAIL}}, {{YOUR_PHONE}}: Your contact information
- {{BRIEF_DESCRIPTION}}: Short description for subject line

For DOJ Civil Rights Division records, send to:
- Email: CRTRDC.FOIARequests@usdoj.gov
- Or use online portal at https://www.foia.gov/',
  ARRAY['email', 'online portal', 'mail'],
  'CRTRDC.FOIARequests@usdoj.gov',
  'Department of Justice, Civil Rights Division, FOIA/PA Unit, 950 Pennsylvania Avenue, NW, Washington, DC 20530',
  'https://www.foia.gov/',
  'First 100 pages free for non-commercial requesters. Fee waiver available for public interest requests.',
  '5 U.S.C. § 552',
  20,
  'If request is denied, you may appeal to the agency head within 90 days. Include reasons why denial is improper. If appeal is denied, you may file suit in federal district court.',
  'Use this template for requesting records from any federal agency. Modify the recipient agency as needed.',
  true
),

(
  'FBI Records Request - Civil Rights Investigations',
  NULL,
  NULL,
  'federal',
  'Federal Bureau of Investigation',
  'Federal Agency',
  'Re: Freedom of Information Act Request

Dear FBI FOIA Officer:

Pursuant to the Freedom of Information Act (5 U.S.C. § 552), I request access to and copies of all records concerning:

{{SPECIFIC_SUBJECT}}

This request includes but is not limited to:
- Investigation files and case reports
- Memoranda and correspondence
- Photographs and video recordings
- Audio recordings and transcripts
- Reports of interviews
- Surveillance logs

Time period: {{DATE_RANGE}}
Location (if applicable): {{LOCATION}}

I request that fees be waived because this request is in the public interest and will contribute significantly to public understanding of government operations. I am not seeking these records for commercial use.

If any portions of the requested records are exempt from release, please release any reasonably segregable non-exempt portions.

Please confirm receipt of this request and provide an estimated date of completion.

Sincerely,
{{YOUR_NAME}}
{{YOUR_ADDRESS}}
{{YOUR_EMAIL}}
{{YOUR_PHONE}}',
  'FOIA Request for FBI Records - {{SUBJECT}}',
  'Fill in the placeholders:
- {{SPECIFIC_SUBJECT}}: What you want records about (e.g., "investigation into civil rights violations by officers in Case #123")
- {{DATE_RANGE}}: Time period for records
- {{LOCATION}}: Relevant city/state if applicable
- {{SUBJECT}}: Brief description for subject line
- Your contact information

Submit via:
- Online: https://efoia.fbi.gov/
- Email: foiparequest@fbi.gov
- Mail to address listed below',
  ARRAY['online portal', 'email', 'mail'],
  'foiparequest@fbi.gov',
  'FBI FOIA/PA Request, Record/Information Dissemination Section, 170 Marcel Drive, Winchester, VA 22602',
  'https://efoia.fbi.gov/',
  'No fees for first 100 pages and 2 hours of search time for non-commercial requests.',
  '5 U.S.C. § 552',
  20,
  'Appeal denied requests to FBI Office of Information Policy within 90 days.',
  'FBI may take longer than 20 days for complex requests.',
  true
),

-- State Templates - California
(
  'California Public Records Act Request',
  'California',
  'CA',
  'state',
  NULL,
  'State/Local Agency',
  'Re: California Public Records Act Request

Dear Public Records Coordinator:

Pursuant to the California Public Records Act (Government Code § 6250 et seq.), I request copies of the following public records:

{{SPECIFIC_RECORDS}}

This request includes but is not limited to:
- {{RECORD_TYPE_1}}
- {{RECORD_TYPE_2}}
- {{RECORD_TYPE_3}}

Time period: {{DATE_RANGE}}

Under the California Public Records Act, I ask that you provide responsive records in electronic format if available. If any portion of this request is denied, please cite the specific exemption that justifies the withholding and provide all segregable portions.

Please acknowledge receipt of this request within 10 days and provide an estimated completion date. Under California law, records must be produced promptly.

I understand that duplication costs may apply. Please notify me if costs will exceed {{FEE_LIMIT}} before processing this request.

Thank you for your attention to this matter.

Sincerely,
{{YOUR_NAME}}
{{YOUR_EMAIL}}
{{YOUR_PHONE}}',
  'Public Records Request - {{DESCRIPTION}}',
  'Fill in all {{PLACEHOLDERS}}:
- {{SPECIFIC_RECORDS}}: Overall description of what you want
- {{RECORD_TYPE_1}}, {{RECORD_TYPE_2}}, {{RECORD_TYPE_3}}: Specific types of records
- {{DATE_RANGE}}: Time period
- {{FEE_LIMIT}}: Maximum fee you will pay (e.g., "$50")
- {{DESCRIPTION}}: Brief description for subject line
- Your contact information

Find the correct agency contact:
- Police departments: Usually have Public Records Act coordinator
- State agencies: Check agency website for PRA contact
- Cities/counties: City clerk or county clerk

California law requires prompt response, typically within 10 days.',
  ARRAY['email', 'mail', 'online portal'],
  NULL,
  NULL,
  NULL,
  'Agencies may charge duplication costs (typically $0.10-0.25 per page). First hour of search time often free.',
  'Cal. Gov. Code § 6250 et seq.',
  10,
  'If request denied, agency must cite specific exemption. You may seek review by agency head or file lawsuit in superior court.',
  'California has strong public records law. Police misconduct records became more accessible under SB 1421 and SB 16.',
  true
),

-- State Templates - New York
(
  'New York Freedom of Information Law Request',
  'New York',
  'NY',
  'state',
  NULL,
  'State/Local Agency',
  'Re: Freedom of Information Law Request

Dear Records Access Officer:

Pursuant to the New York Freedom of Information Law (Public Officers Law § 84 et seq.), I request access to and copies of:

{{SPECIFIC_RECORDS}}

These records should include:
- {{DETAIL_1}}
- {{DETAIL_2}}
- {{DETAIL_3}}

Date range: {{DATE_RANGE}}

I request these records in electronic format if available. Under FOIL, agencies must provide records in the format requested if the records are maintained in that format.

If any portion of this request is denied, please provide a written explanation citing the specific exemption and the reasons for its application. Please release all reasonably segregable portions of partially exempt records.

Please acknowledge this request within 5 business days and inform me of the approximate date when the request will be granted or denied. I understand agencies must respond within 20 business days of receipt.

I am willing to pay reasonable copying fees up to {{FEE_LIMIT}}. Please inform me if fees will exceed this amount.

Sincerely,
{{YOUR_NAME}}
{{YOUR_ADDRESS}}
{{YOUR_EMAIL}}
{{YOUR_PHONE}}',
  'FOIL Request - {{SUBJECT}}',
  'Complete all {{PLACEHOLDERS}}:
- {{SPECIFIC_RECORDS}}: What records you need
- {{DETAIL_1}}, {{DETAIL_2}}, {{DETAIL_3}}: Specific details
- {{DATE_RANGE}}: Time period
- {{FEE_LIMIT}}: Maximum fee amount
- {{SUBJECT}}: Brief subject description
- Your information

Send to:
- State agencies: Records Access Officer at each agency
- NYPD: NYPD Records Access Appeals Officer, One Police Plaza, New York, NY 10038
- Local police: Send to each department''s FOIL officer

New York law requires 5-day acknowledgment and 20-day response.',
  ARRAY['mail', 'email'],
  NULL,
  NULL,
  NULL,
  'Up to $0.25 per page for copies. First 2 hours of search time free for non-commercial requests.',
  'N.Y. Pub. Off. Law § 84 et seq.',
  20,
  'If denied, appeal to agency head within 30 days. If appeal denied, file Article 78 proceeding in state court within 4 months.',
  'New York Civil Rights Law § 50-a was repealed in 2020, making police disciplinary records accessible.',
  true
),

-- State Templates - Texas
(
  'Texas Public Information Act Request',
  'Texas',
  'TX',
  'state',
  NULL,
  'State/Local Agency',
  'Re: Texas Public Information Act Request

Dear Public Information Officer:

Pursuant to the Texas Public Information Act (Tex. Gov''t Code § 552 et seq.), I request access to and copies of the following public information:

{{REQUESTED_RECORDS}}

This request includes:
{{RECORD_DETAILS}}

Time frame: {{DATE_RANGE}}

If any requested information is withheld, please provide a written explanation identifying the specific exception that applies and a description of the withheld information.

I request records in electronic format if maintained electronically.

Please provide a written statement of estimated charges if costs will exceed {{FEE_AMOUNT}}. Under Section 552.261, I may be entitled to a cost reduction or waiver if release of the information primarily benefits the general public.

Please respond within 10 business days as required by law.

Thank you,
{{YOUR_NAME}}
{{YOUR_EMAIL}}
{{YOUR_PHONE}}
{{YOUR_ADDRESS}}',
  'Texas PIA Request - {{TOPIC}}',
  'Fill in these fields:
- {{REQUESTED_RECORDS}}: Describe the records you want
- {{RECORD_DETAILS}}: Provide specific details about what to include
- {{DATE_RANGE}}: Specify time period
- {{FEE_AMOUNT}}: Maximum you will pay (e.g., "$100")
- {{TOPIC}}: Short topic description
- Your complete contact information

Locate the Public Information Officer:
- City/County: Usually city secretary or county clerk
- Police: Department''s PIO or city attorney''s office
- State agencies: Check agency website

Texas requires response within 10 business days.',
  ARRAY['email', 'mail', 'online portal'],
  NULL,
  NULL,
  NULL,
  'Standard charges: $0.10/page. Labor charged if request requires >15 minutes of personnel time at hourly rate.',
  'Tex. Gov''t Code § 552',
  10,
  'Request Attorney General opinion if records withheld (agency must do this). You may file suit after AG ruling or if agency fails to request ruling.',
  'Texas has strong presumption of openness. Many police records are public.',
  true
),

-- Police Body Camera Footage Template
(
  'Police Body Camera Footage Request',
  NULL,
  NULL,
  'local',
  NULL,
  'Police Department',
  'Re: Request for Police Body Camera Footage

Dear Records Custodian:

Pursuant to [STATE PUBLIC RECORDS LAW], I request copies of body-worn camera footage from the following incident:

Incident Details:
- Date: {{INCIDENT_DATE}}
- Time: {{INCIDENT_TIME}}
- Location: {{INCIDENT_LOCATION}}
- Officers Involved: {{OFFICER_NAMES_OR_BADGE_NUMBERS}}
- Incident/Case Number (if known): {{CASE_NUMBER}}
- Brief Description: {{INCIDENT_DESCRIPTION}}

I request footage from all officers who responded to or were present at the scene.

I also request:
- Dispatch recordings and CAD reports for this incident
- Any dashboard camera footage
- Incident reports and supplemental reports
- Use of force reports (if applicable)

I understand that some redaction may be necessary to protect privacy, but I request that redactions be limited to what is legally required and that I be notified of any redactions with legal justification.

I request the footage in digital format (e.g., MP4, AVI) on a USB drive or via secure download link.

Please notify me of any fees before processing this request. I am willing to pay up to {{FEE_LIMIT}} for this request.

Time is of the essence as this footage may be subject to deletion under your retention policy.

Sincerely,
{{YOUR_NAME}}
{{YOUR_EMAIL}}
{{YOUR_PHONE}}
{{YOUR_ADDRESS}}',
  'Body Camera Footage Request - {{DATE}} Incident',
  'Complete these fields with as much detail as possible:
- {{INCIDENT_DATE}}: Exact date of incident
- {{INCIDENT_TIME}}: Approximate time (be as specific as possible)
- {{INCIDENT_LOCATION}}: Exact address or intersection
- {{OFFICER_NAMES_OR_BADGE_NUMBERS}}: Any identifying information about officers
- {{CASE_NUMBER}}: If you have an incident/case number
- {{INCIDENT_DESCRIPTION}}: Brief factual description
- {{DATE}}: Date for subject line
- {{FEE_LIMIT}}: Maximum fee
- Your contact information

IMPORTANT: Many departments delete body camera footage after 60-90 days unless it is evidence. Submit your request as soon as possible.

Each state and department has different rules about body camera access. Some may require you to be the subject of the recording.',
  ARRAY['email', 'mail'],
  NULL,
  NULL,
  NULL,
  'Varies widely. Can range from $20-$500+ depending on length and redaction required.',
  'Varies by state',
  NULL,
  'If denied, appeal under your state''s public records law. Some states require you to be involved in the incident to obtain footage.',
  'Act quickly - many departments have short retention periods for body camera footage.',
  true
),

-- 911 Call Recordings Request
(
  'Emergency 911 Call Recording Request',
  NULL,
  NULL,
  'local',
  NULL,
  'Police Department',
  'Re: Request for 911 Call Recordings

Dear Records Officer:

Under [STATE OPEN RECORDS LAW], I request copies of the following 911 emergency call recordings:

Call Information:
- Date of Call: {{CALL_DATE}}
- Approximate Time: {{CALL_TIME}}
- Location/Address: {{CALL_LOCATION}}
- Caller Name (if known): {{CALLER_NAME}}
- Incident Type: {{INCIDENT_TYPE}}

I also request:
- Computer-Aided Dispatch (CAD) records for this incident
- Dispatch radio communications
- Call logs and incident reports

Please provide the recordings in digital audio format (MP3 or WAV preferred).

If any information must be redacted, please provide an explanation of the legal basis for each redaction.

I am willing to pay reasonable fees up to {{FEE_LIMIT}}. Please provide a cost estimate before processing.

Thank you for your prompt attention to this request.

Sincerely,
{{YOUR_NAME}}
{{YOUR_EMAIL}}
{{YOUR_PHONE}}
{{YOUR_ADDRESS}}',
  '911 Call Recording Request - {{DATE}}',
  'Provide as much information as possible:
- {{CALL_DATE}}: Date the 911 call was made
- {{CALL_TIME}}: Time of call (even approximate)
- {{CALL_LOCATION}}: Where the emergency was
- {{CALLER_NAME}}: Your name or the caller''s name if you know it
- {{INCIDENT_TYPE}}: Type of call (e.g., "traffic stop", "welfare check")
- {{DATE}}: Date for subject line
- {{FEE_LIMIT}}: Maximum fee you will pay
- Your information

Send to:
- Usually handled by police department records division
- Some areas: 911 dispatch center directly
- Check local government website for correct office

Note: Some jurisdictions may redact portions to protect privacy.',
  ARRAY['email', 'mail'],
  NULL,
  NULL,
  NULL,
  'Typically $5-25 per recording. Some agencies charge by minute of audio.',
  'Varies by state',
  NULL,
  'Appeals follow your state public records law process.',
  '911 calls are generally public records but may have privacy exceptions.',
  true
),

-- Arrest Records Request
(
  'Arrest and Booking Records Request',
  NULL,
  NULL,
  'local',
  NULL,
  'Police Department',
  'Re: Request for Arrest and Booking Records

Dear Records Officer:

Pursuant to [STATE PUBLIC RECORDS ACT], I request copies of arrest and booking records for:

Subject Information:
- Name: {{SUBJECT_NAME}}
- Date of Birth: {{DATE_OF_BIRTH}}
- Arrest Date: {{ARREST_DATE}}
- Arrest Location: {{ARREST_LOCATION}}
- Booking Number (if known): {{BOOKING_NUMBER}}

I request the following records:
- Arrest report and narrative
- Booking photograph (mugshot)
- Booking documents and intake forms
- Property/evidence receipts
- Citations or complaints
- Witness statements
- Any video or audio recordings related to the arrest

If I am the subject of these records, please note that I am entitled to access my own records. [If requesting your own records, include: I have enclosed a copy of my ID for verification.]

I request electronic copies if available.

Please advise me of any fees before processing. I will pay up to {{FEE_LIMIT}}.

Sincerely,
{{YOUR_NAME}}
{{YOUR_EMAIL}}
{{YOUR_PHONE}}
{{YOUR_ADDRESS}}',
  'Arrest Records Request - {{NAME}}',
  'Fill in the requested information:
- {{SUBJECT_NAME}}: Full legal name of arrested person
- {{DATE_OF_BIRTH}}: DOB if known
- {{ARREST_DATE}}: Date of arrest
- {{ARREST_LOCATION}}: Where arrest occurred
- {{BOOKING_NUMBER}}: If you have this number
- {{NAME}}: Name for subject line
- {{FEE_LIMIT}}: Fee limit
- Your information

If requesting your own records:
- Include copy of government-issued ID
- Many states provide free or reduced-fee access to your own records

Send to:
- Police department records division for arrest reports
- County jail or sheriff for booking records

Note: Arrest records are usually public, but some states restrict access to certain information.',
  ARRAY['mail', 'email'],
  NULL,
  NULL,
  NULL,
  'Usually $0.10-0.50 per page. Mugshots may have additional fees.',
  'Varies by state',
  NULL,
  'Follow state public records appeal process if denied.',
  'Arrest records are generally public. You have enhanced rights to your own records.',
  true
);
