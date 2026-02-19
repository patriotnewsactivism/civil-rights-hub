-- Seed FOIA templates for journalists and activists
-- Part of Phase 4: FOIA & Public Records Enhancement

INSERT INTO public.foia_templates (title, category, subject_template, body_template, description, applicable_agency_types, is_featured) VALUES

-- Journalist Templates
('Press Credential Verification Request', 'Journalism', 
'FOIA Request: Press Credential Verification Records',
'Pursuant to the Freedom of Information Act, 5 U.S.C. § 552, I hereby request records relating to press credential verification policies and procedures.

Specifically, I request:
1. Any policies, guidelines, or procedures governing the verification of press credentials for journalists
2. Records of press credential applications and approvals/denials from the past [TIMEFRAME]
3. Any communications regarding press credential requirements or restrictions
4. Fee schedules for press credential applications

I am a member of the news media and this request is made for news gathering purposes. I request a waiver of all fees as disclosure is in the public interest.

[YOUR_NAME]
[YOUR_EMAIL]',
'Request policies and records related to press credential verification',
ARRAY['Federal', 'State', 'Municipal'], true),

('Police Misconduct Complaint Data', 'Police Accountability',
'FOIA Request: Police Misconduct Complaint Records',
'Pursuant to the Freedom of Information Act, I hereby request records related to police misconduct complaints.

Specifically, I request:
1. All complaints filed against police officers from [START_DATE] to [END_DATE]
2. The nature of each complaint (excessive force, harassment, false arrest, etc.)
3. The disposition of each complaint (sustained, not sustained, unfounded, exonerated)
4. Any disciplinary actions taken as a result of sustained complaints
5. Demographic data of complainants and officers involved

If this request is denied in whole or in part, please cite the specific exemption and explain how it applies.

[YOUR_NAME]
[YOUR_EMAIL]',
'Request data on police misconduct complaints and outcomes',
ARRAY['State', 'County', 'Municipal'], true),

('Body Camera Footage Policy Request', 'Police Accountability',
'FOIA Request: Body-Worn Camera Policies and Procedures',
'Pursuant to the Freedom of Information Act, I hereby request records related to body-worn camera (BWC) policies and procedures.

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
'Request body camera policies and compliance data',
ARRAY['State', 'County', 'Municipal'], true),

('Arrest and Booking Records', 'Criminal Justice',
'FOIA Request: Arrest and Booking Records for [SUBJECT/DATE RANGE]',
'Pursuant to the Freedom of Information Act, I hereby request arrest and booking records.

Specifically, I request:
1. Arrest records for [SUBJECT NAME or DATE RANGE]
2. Booking photographs (mugshots)
3. Charges filed at arrest
4. Bond/bail information
5. Detention location
6. Court case numbers associated with arrests

[YOUR_NAME]
[YOUR_EMAIL]',
'Request arrest and booking records for specific individuals or time periods',
ARRAY['County', 'Municipal'], false),

-- Activist Templates  
('Protest Permit Denial Appeal Request', 'Activism',
'FOIA Request: Protest Permit Denial Records',
'Pursuant to the Freedom of Information Act, I hereby request records related to protest permit denials.

Specifically, I request:
1. All protest permit applications that were denied from [START_DATE] to [END_DATE]
2. The stated reasons for each denial
3. The reviewing official for each denied permit
4. Any internal communications regarding the denial decisions
5. Statistics on permits approved vs. denied during the specified timeframe
6. Any policies or guidelines used to evaluate permit applications

[YOUR_NAME]
[YOUR_EMAIL]',
'Request records on protest permit denials and appeals',
ARRAY['State', 'County', 'Municipal'], false),

('Police Use of Force Statistics', 'Police Accountability',
'FOIA Request: Use of Force Reports and Statistics',
'Pursuant to the Freedom of Information Act, I hereby request records related to police use of force.

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
'Request comprehensive use of force data and reports',
ARRAY['State', 'County', 'Municipal'], true),

('License Plate Reader Data Request', 'Surveillance',
'FOIA Request: Automated License Plate Reader (ALPR) Data and Policies',
'Pursuant to the Freedom of Information Act, I hereby request records related to automated license plate readers.

Specifically, I request:
1. The ALPR policy governing data collection, retention, and sharing
2. Number of ALPR scans conducted from [START_DATE] to [END_DATE]
3. Retention period for ALPR data
4. Third parties with whom ALPR data is shared
5. Audits or oversight reports on ALPR usage
6. Any agreements with federal agencies regarding ALPR data sharing

[YOUR_NAME]
[YOUR_EMAIL]',
'Request ALPR data collection and sharing policies',
ARRAY['State', 'County', 'Municipal'], false),

('Facial Recognition Technology Records', 'Surveillance',
'FOIA Request: Facial Recognition Technology Usage and Policies',
'Pursuant to the Freedom of Information Act, I hereby request records related to facial recognition technology.

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
'Request facial recognition technology policies and usage data',
ARRAY['Federal', 'State', 'County', 'Municipal'], false),

('Social Media Monitoring Records', 'Surveillance',
'FOIA Request: Social Media Monitoring and Surveillance Records',
'Pursuant to the Freedom of Information Act, I hereby request records related to social media monitoring.

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
'Request records on law enforcement social media surveillance',
ARRAY['Federal', 'State', 'County', 'Municipal'], false),

('Surveillance Technology Purchase Records', 'Surveillance',
'FOIA Request: Surveillance Technology Procurement Records',
'Pursuant to the Freedom of Information Act, I hereby request records related to surveillance technology purchases.

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
'Request procurement records for surveillance technologies',
ARRAY['Federal', 'State', 'County', 'Municipal'], true);

-- Create index for template searches
CREATE INDEX IF NOT EXISTS idx_foia_templates_category ON public.foia_templates(category);
CREATE INDEX IF NOT EXISTS idx_foia_templates_featured ON public.foia_templates(is_featured);
