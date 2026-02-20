-- Seed FOIA templates for journalists and activists
-- Part of Phase 4: FOIA & Public Records Enhancement

INSERT INTO public.foia_templates (title, template_type, agency_type, template_body, subject_line, instructions, notes, is_popular) VALUES

-- Journalist Templates
('Press Credential Verification Request', 'federal', 'Federal Agency',
'FOIA Request: Press Credential Verification Records

Pursuant to the Freedom of Information Act, 5 U.S.C. § 552, I hereby request records relating to press credential verification policies and procedures.

Specifically, I request:
1. Any policies, guidelines, or procedures governing the verification of press credentials for journalists
2. Records of press credential applications and approvals/denials from the past [TIMEFRAME]
3. Any communications regarding press credential requirements or restrictions
4. Fee schedules for press credential applications

I am a member of the news media and this request is made for news gathering purposes. I request a waiver of all fees as disclosure is in the public interest.

[YOUR_NAME]
[YOUR_EMAIL]',
'FOIA Request: Press Credential Verification Records',
'Request policies and records related to press credential verification. Fill in [TIMEFRAME], [YOUR_NAME], and [YOUR_EMAIL].',
'Applicable to federal, state, and municipal agencies.', true),

('Police Misconduct Complaint Data', 'local', 'Police Department',
'FOIA Request: Police Misconduct Complaint Records

Pursuant to the Freedom of Information Act, I hereby request records related to police misconduct complaints.

Specifically, I request:
1. All complaints filed against police officers from [START_DATE] to [END_DATE]
2. The nature of each complaint (excessive force, harassment, false arrest, etc.)
3. The disposition of each complaint (sustained, not sustained, unfounded, exonerated)
4. Any disciplinary actions taken as a result of sustained complaints
5. Demographic data of complainants and officers involved

If this request is denied in whole or in part, please cite the specific exemption and explain how it applies.

[YOUR_NAME]
[YOUR_EMAIL]',
'FOIA Request: Police Misconduct Complaint Records',
'Request data on police misconduct complaints and outcomes. Fill in date range and contact information.',
'Applicable to state, county, and municipal agencies.', true),

('Body Camera Footage Policy Request', 'local', 'Police Department',
'FOIA Request: Body-Worn Camera Policies and Procedures

Pursuant to the Freedom of Information Act, I hereby request records related to body-worn camera (BWC) policies and procedures.

Specifically, I request:
1. The current body-worn camera policy
2. When officers are required to activate BWCs
3. When officers are permitted to deactivate BWCs
4. Retention periods for BWC footage
5. Public access procedures for requesting BWC footage
6. Any audits or reports on BWC compliance
7. Data on BWC activations and deactivations from [TIMEFRAME]

[YOUR_NAME]
[YOUR_EMAIL]',
'FOIA Request: Body-Worn Camera Policies and Procedures',
'Request body camera policies and compliance data. Fill in timeframe and contact info.',
'Applicable to state, county, and municipal agencies.', true),

('Arrest and Booking Records', 'local', 'County Agency',
'FOIA Request: Arrest and Booking Records for [SUBJECT/DATE RANGE]

Pursuant to the Freedom of Information Act, I hereby request arrest and booking records.

Specifically, I request:
1. Arrest records for [SUBJECT NAME or DATE RANGE]
2. Booking photographs (mugshots)
3. Charges filed at arrest
4. Bond/bail information
5. Detention location
6. Court case numbers associated with arrests

[YOUR_NAME]
[YOUR_EMAIL]',
'FOIA Request: Arrest and Booking Records for [SUBJECT/DATE RANGE]',
'Request arrest and booking records for specific individuals or time periods. Fill in subject name or date range.',
'Applicable to county and municipal agencies.', false),

-- Activist Templates  
('Protest Permit Denial Appeal Request', 'local', 'Municipal Agency',
'FOIA Request: Protest Permit Denial Records

Pursuant to the Freedom of Information Act, I hereby request records related to protest permit denials.

Specifically, I request:
1. All protest permit applications that were denied from [START_DATE] to [END_DATE]
2. The stated reasons for each denial
3. The reviewing official for each denied permit
4. Any internal communications regarding the denial decisions
5. Statistics on permits approved vs. denied during the specified timeframe
6. Any policies or guidelines used to evaluate permit applications

[YOUR_NAME]
[YOUR_EMAIL]',
'FOIA Request: Protest Permit Denial Records',
'Request records on protest permit denials and appeals. Fill in date range and contact info.',
'Applicable to state, county, and municipal agencies.', false),

('Police Use of Force Statistics', 'local', 'Police Department',
'FOIA Request: Use of Force Reports and Statistics

Pursuant to the Freedom of Information Act, I hereby request records related to police use of force.

Specifically, I request:
1. All use of force reports from [START_DATE] to [END_DATE]
2. Type of force used (firearm, Taser, physical, etc.)
3. Demographics of individuals subjected to force
4. Demographics of officers using force
5. Injuries sustained by individuals and officers
6. Whether the individual was armed
7. Disposition of any internal investigations

[YOUR_NAME]
[YOUR_EMAIL]',
'FOIA Request: Use of Force Reports and Statistics',
'Request comprehensive use of force data and reports. Fill in date range and contact info.',
'Applicable to state, county, and municipal agencies.', true),

('License Plate Reader Data Request', 'local', 'Police Department',
'FOIA Request: Automated License Plate Reader (ALPR) Data and Policies

Pursuant to the Freedom of Information Act, I hereby request records related to automated license plate readers.

Specifically, I request:
1. The ALPR policy governing data collection, retention, and sharing
2. Number of ALPR scans conducted from [START_DATE] to [END_DATE]
3. Retention period for ALPR data
4. Third parties with whom ALPR data is shared
5. Audits or oversight reports on ALPR usage
6. Any agreements with federal agencies regarding ALPR data sharing

[YOUR_NAME]
[YOUR_EMAIL]',
'FOIA Request: Automated License Plate Reader (ALPR) Data and Policies',
'Request ALPR data collection and sharing policies. Fill in date range and contact info.',
'Applicable to state, county, and municipal agencies.', false),

('Facial Recognition Technology Records', 'federal', 'Federal Agency',
'FOIA Request: Facial Recognition Technology Usage and Policies

Pursuant to the Freedom of Information Act, I hereby request records related to facial recognition technology.

Specifically, I request:
1. Any contracts or agreements for facial recognition software or services
2. Policies governing the use of facial recognition technology
3. Number of facial recognition searches conducted from [START_DATE] to [END_DATE]
4. Purpose of each search (criminal investigation, identification, etc.)
5. Accuracy rates and false positive data
6. Training materials for facial recognition systems
7. Audit logs or oversight reports

[YOUR_NAME]
[YOUR_EMAIL]',
'FOIA Request: Facial Recognition Technology Usage and Policies',
'Request facial recognition technology policies and usage data. Fill in date range and contact info.',
'Applicable to federal, state, county, and municipal agencies.', false),

('Social Media Monitoring Records', 'federal', 'Federal Agency',
'FOIA Request: Social Media Monitoring and Surveillance Records

Pursuant to the Freedom of Information Act, I hereby request records related to social media monitoring.

Specifically, I request:
1. Policies governing social media monitoring by law enforcement
2. Contracts or agreements with social media monitoring companies
3. Keywords, hashtags, or accounts monitored
4. Reports generated from social media monitoring
5. How monitored information was used or shared
6. Training materials for social media monitoring
7. Budget allocations for social media monitoring

[YOUR_NAME]
[YOUR_EMAIL]',
'FOIA Request: Social Media Monitoring and Surveillance Records',
'Request records on law enforcement social media surveillance. Fill in date range and contact info.',
'Applicable to federal, state, county, and municipal agencies.', false),

('Surveillance Technology Purchase Records', 'federal', 'Federal Agency',
'FOIA Request: Surveillance Technology Procurement Records

Pursuant to the Freedom of Information Act, I hereby request records related to surveillance technology purchases.

Specifically, I request:
1. Purchase orders or contracts for surveillance equipment including:
   - Cell site simulators (Stingray/Hailstorm)
   - Drones/UAVs
   - License plate readers
   - Facial recognition systems
   - Gunshot detection systems
   - Predictive policing software
2. Grant applications or funding sources for surveillance technology
3. Training materials for surveillance equipment
4. Policies governing the use of each technology type

[YOUR_NAME]
[YOUR_EMAIL]',
'FOIA Request: Surveillance Technology Procurement Records',
'Request procurement records for surveillance technologies. Fill in contact info.',
'Applicable to federal, state, county, and municipal agencies.', true);
