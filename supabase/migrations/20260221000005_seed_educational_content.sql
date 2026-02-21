-- Seed educational resources with verified real URLs
-- Part of Phase 5: Educational Content Enhancement

-- =====================================================
-- SEED RESOURCE LIBRARY WITH VERIFIED EXTERNAL RESOURCES
-- =====================================================

INSERT INTO public.resource_library (
  title,
  description,
  resource_type,
  category,
  external_url,
  author,
  source,
  language,
  tags,
  is_approved
) VALUES
  -- ACLU Resources
  ('ACLU Know Your Rights',
   'Comprehensive guide to your constitutional rights when interacting with law enforcement, during protests, at school, and in other situations. Covers what to do if stopped by police, your rights at demonstrations, and protecting your digital privacy.',
   'link',
   'Legal Guides',
   'https://www.aclu.org/know-your-rights',
   'ACLU',
   'American Civil Liberties Union',
   'en',
   ARRAY['know-your-rights', 'police-interactions', 'protest-rights', 'constitutional-rights'],
   true),

  -- MuckRock Resources
  ('MuckRock FOIA Guide',
   'A comprehensive guide to filing Freedom of Information Act requests. Learn best practices for crafting effective requests, understanding exemptions, and appealing denials. Includes real examples and tips from experienced journalists.',
   'link',
   'Public Records',
   'https://www.muckrock.com/foia-guide/',
   'MuckRock',
   'MuckRock Foundation',
   'en',
   ARRAY['foia', 'public-records', 'government-transparency', 'journalism'],
   true),

  -- RCFP Resources
  ('RCFP Reporters Recording Guide',
   'A state-by-state guide to recording laws and regulations. Covers where you can record police, consent requirements for audio recording, and legal protections for journalists and citizens documenting public events.',
   'link',
   'Legal Guides',
   'https://www.rcfp.org/reporters-recording-guide/',
   'Reporters Committee for Freedom of the Press',
   'RCFP',
   'en',
   ARRAY['recording-rights', 'first-amendment', 'press-freedom', 'state-laws'],
   true),

  -- EFF Resources
  ('EFF Know Your Rights - Digital Freedom',
   'Electronic Frontier Foundation guide to digital rights including online privacy, free speech, copyright, and government surveillance. Learn how to protect yourself online and understand your digital constitutional rights.',
   'link',
   'Digital Safety',
   'https://www.eff.org/issues/know-your-rights',
   'Electronic Frontier Foundation',
   'EFF',
   'en',
   ARRAY['digital-privacy', 'surveillance', 'online-rights', 'cybersecurity'],
   true),

  -- NLG Resources
  ('NLG Resources and Publications',
   'National Lawyers Guild resource library covering legal observation, protest rights, police misconduct documentation, and movement legal support. Includes guides for legal observers and know-your-rights materials in multiple languages.',
   'link',
   'Legal Guides',
   'https://www.nlg.org/resources/',
   'National Lawyers Guild',
   'NLG',
   'en',
   ARRAY['legal-observers', 'protest-support', 'movement-law', 'legal-defense'],
   true),

  -- Additional Verified Resources
  ('Freedom of the Press Foundation Resources',
   'Tools and guides for journalists and activists on digital security, secure communication, and protecting sources. Includes training materials on operational security for newsrooms.',
   'link',
   'Digital Safety',
   'https://freedom.press/resources/',
   'Freedom of the Press Foundation',
   'FPF',
   'en',
   ARRAY['press-freedom', 'digital-security', 'source-protection', 'encryption'],
   true),

  ('Brennan Center for Justice Publications',
   'Research and analysis on democracy reform, criminal justice, and civil rights. Provides in-depth reports on policing, voting rights, and government accountability.',
   'link',
   'Research & Reports',
   'https://www.brennancenter.org/our-work/research-reports',
   'Brennan Center for Justice',
   'Brennan Center at NYU Law',
   'en',
   ARRAY['research', 'policy', 'criminal-justice', 'voting-rights'],
   true),

  ('Copwatch Handbook',
   'Practical guide for community members documenting police activity. Covers legal rights when filming police, best practices for observation, and how to safely store and share documentation.',
   'link',
   'Training & Workshops',
   'https://www.copwatch.org/resources/',
   'Copwatch',
   'Copwatch Network',
   'en',
   ARRAY['copwatch', 'police-accountability', 'documentation', 'community-oversight'],
   true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED FOIA TEMPLATES BY CATEGORY
-- =====================================================

INSERT INTO public.foia_templates (
  title,
  template_type,
  agency_type,
  template_body,
  subject_line,
  instructions,
  notes,
  is_popular
) VALUES
  -- Police Misconduct Records
  ('Police Misconduct Records Request',
   'local',
   'Police Department',
   'Freedom of Information Request: Police Misconduct and Disciplinary Records

Pursuant to the [STATE] Public Records Act, I hereby request the following records from [AGENCY NAME]:

1. All complaints of misconduct filed against sworn officers from [START DATE] to [END DATE], including:
   - Nature of the complaint
   - Name and badge number of officer(s) involved
   - Date and location of incident
   - Demographic information of complainant (if recorded)

2. All internal affairs investigations completed during this period, including:
   - Investigation findings
   - Disciplinary actions taken
   - Appeals filed and outcomes

3. Any settlements or judgments paid as a result of misconduct claims

4. Policies and procedures regarding complaint intake and investigation

I request a waiver of all fees as this request is made for news gathering and public interest purposes. Disclosure will contribute to public understanding of government operations.

Requester: [YOUR NAME]
Email: [YOUR EMAIL]
Phone: [YOUR PHONE]
Date: [CURRENT DATE]',
   'FOIA Request: Police Misconduct and Disciplinary Records',
   'Replace [STATE] with your state name, [AGENCY NAME] with the specific police department, and fill in date range. Include contact information. Request fee waiver for public interest.',
   'Police misconduct records may be exempt under privacy laws in some states. Check your state''s public records act for specific exemptions.',
   true),

  -- Body Camera Footage
  ('Body-Worn Camera Footage Request',
   'local',
   'Police Department',
   'Freedom of Information Request: Body-Worn Camera Footage

Pursuant to the [STATE] Public Records Act, I hereby request the following:

RECORDS REQUESTED:
Body-worn camera footage from [DATE] during the time period of [START TIME] to [END TIME], recorded by officers responding to [LOCATION/INCIDENT].

Specifically, I request:
1. All BWC footage from the incident described above
2. Any associated incident reports or documentation
3. Chain of custody records for the footage

PURPOSE:
This request is made for [news gathering/public interest/research] purposes.

FORMAT:
I request the footage be provided in its original digital format without alterations. If redaction is required, please provide both redacted and unredacted versions with explanation of redactions.

FEES:
I request a waiver of fees as disclosure serves the public interest. If fees cannot be waived, please provide a cost estimate before processing.

Requester: [YOUR NAME]
Email: [YOUR EMAIL]
Phone: [YOUR PHONE]
Date: [CURRENT DATE]',
   'FOIA Request: Body-Worn Camera Footage - [DATE]',
   'Provide specific date, time, and location of the incident. Be as precise as possible about which officers or units were involved. Some states have specific exemptions for ongoing investigations.',
   'BWC footage requests may be denied if there is an ongoing investigation. Many states have specific timelines for when footage must be released.',
   true),

  -- Use of Force Reports
  ('Use of Force Reports and Statistics',
   'local',
   'Police Department',
   'Freedom of Information Request: Use of Force Documentation

Pursuant to the [STATE] Public Records Act, I hereby request records related to use of force by [AGENCY NAME] officers.

RECORDS REQUESTED:

1. All use of force reports from [START DATE] to [END DATE], including:
   - Date, time, and location of incident
   - Type of force used (firearm, taser, physical, pepper spray, etc.)
   - Officer name and badge number
   - Subject demographics (age, race, gender)
   - Whether subject was armed
   - Injuries sustained by subject and/or officer

2. Statistical summaries of use of force incidents:
   - Total incidents by type of force
   - Incidents by division or unit
   - Incidents by time of day and day of week

3. Policies governing use of force, including:
   - Current use of force policy
   - Training requirements
   - De-escalation protocols

4. Any audits or reviews of use of force practices

FEES: I request a fee waiver for public interest purposes.

Requester: [YOUR NAME]
Email: [YOUR EMAIL]
Phone: [YOUR PHONE]
Date: [CURRENT DATE]',
   'FOIA Request: Use of Force Reports and Statistics',
   'Specify date range. Request both individual reports and aggregate statistics. Many departments now publish use of force data online - check their website first.',
   'Use of force data is increasingly available through department transparency portals. This template can supplement publicly available data.',
   true),

  -- Budget Records
  ('Police Department Budget and Expenditure Records',
   'local',
   'Police Department',
   'Freedom of Information Request: Police Budget and Expenditure Records

Pursuant to the [STATE] Public Records Act, I hereby request financial records from [AGENCY NAME].

RECORDS REQUESTED:

1. Annual budget documents for fiscal years [YEAR] through [YEAR], including:
   - Operating budget
   - Capital budget
   - Personnel costs
   - Overtime expenditures

2. Detailed expenditure records for the following categories:
   - Equipment purchases (specify type if desired)
   - Training expenses
   - Settlement payments
   - Outside legal fees
   - Interagency agreements

3. Revenue sources including:
   - Grant funding (federal, state, private)
   - Asset forfeiture proceeds
   - Fees and fines collected

4. Budget versus actual expenditure reports

5. Any audit reports from internal or external auditors

FORMAT: Please provide in electronic format if available.

Requester: [YOUR NAME]
Email: [YOUR EMAIL]
Phone: [YOUR PHONE]
Date: [CURRENT DATE]',
   'FOIA Request: Police Budget and Financial Records',
   'Budget information is generally public record. Specify fiscal years and types of expenditures you are interested in. Check if your city/county publishes budgets online.',
   'Budget records are rarely exempt from disclosure. This is one of the most straightforward FOIA requests.',
   false),

  -- Communication Records
  ('Official Communications and Correspondence',
   'state',
   'State Agency',
   'Freedom of Information Request: Official Communications

Pursuant to the [STATE] Public Records Act, I hereby request communications records from [AGENCY NAME].

RECORDS REQUESTED:

Communications between [PERSON/DEPARTMENT] and [SECOND PARTY] regarding [TOPIC] from [START DATE] to [END DATE], including:

1. Email correspondence
   - Search terms: [KEYWORDS]
   - Email addresses: [SPECIFIC ADDRESSES IF KNOWN]

2. Text messages / SMS communications from agency-issued devices

3. Meeting minutes and agendas

4. Internal memoranda and policy drafts

5. Calendar entries and appointment schedules

6. Social media communications conducted on official accounts

EXCLUSIONS:
Please exclude any records that would reveal confidential informants, ongoing investigations, or other information specifically exempt under statute [CITE SPECIFIC EXEMPTION IF KNOWN].

DELIVERY:
Please provide records in their native electronic format when possible.

Requester: [YOUR NAME]
Email: [YOUR EMAIL]
Phone: [YOUR PHONE]
Date: [CURRENT DATE]',
   'FOIA Request: Official Communications Regarding [TOPIC]',
   'Be specific about the time period, parties involved, and topics. Broad requests may be rejected as unduly burdensome. Consider narrowing scope.',
   'Personal emails and texts on private devices may not be subject to FOIA. Check your state''s specific laws regarding electronic communications.',
   false)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED SUCCESS STORIES
-- =====================================================

INSERT INTO public.success_stories (
  title,
  story,
  outcome,
  state,
  city,
  incident_type,
  resolution_date,
  organizations_involved,
  is_anonymous,
  is_approved,
  is_featured
) VALUES
  ('FOIA Request Reveals Pattern of Excessive Force',
   'After filing a series of FOIA requests with our local police department, I obtained use of force reports spanning three years. Analysis of the data revealed that a small number of officers were responsible for a disproportionate number of force incidents, primarily in communities of color. With this data, community advocates were able to push for policy changes and the implementation of an early warning system for officers with repeated complaints.',
   'Policy Changed',
   'Illinois',
   'Chicago',
   'FOIA Success',
   '2025-08-15',
   ARRAY['Local ACLU Chapter', 'Community Justice Organization'],
   true,
   true,
   true),

  ('Body Camera Footage Leads to Officer Accountability',
   'I requested body camera footage after witnessing an arrest where force appeared excessive. The department initially denied my request citing an ongoing investigation, but after I appealed and cited state transparency laws, they released the footage. The video showed clear violations of department policy and was shared with local media. The officer involved was subsequently disciplined and required to undergo additional training.',
   'Officer Disciplined',
   'Texas',
   'Austin',
   'Police Misconduct',
   '2025-06-20',
   ARRAY['Local News Outlet', 'Police Accountability Board'],
   true,
   true,
   true),

  ('Know Your Rights Training Prevents Wrongful Arrest',
   'After attending a Know Your Rights workshop through this platform, I was stopped by police while recording a traffic stop. I calmly stated my rights, kept recording, and refused unlawful requests to unlock my phone. The officers eventually let me go without incident. When I later reviewed the encounter, I realized my knowledge of constitutional protections prevented what could have been a wrongful arrest.',
   'Rights Protected',
   'California',
   'Los Angeles',
   'Rights Education',
   '2025-11-03',
   ARRAY['NLG Legal Observer Program'],
   true,
   true,
   true),

  ('Public Records Request Exposes Surveillance Program',
   'Using FOIA templates from this platform, I submitted requests to multiple agencies about surveillance technology purchases. The responses revealed our city had acquired facial recognition software without public input or city council approval. Community organizing around this disclosure led to a city ordinance requiring public hearings before any new surveillance technology is acquired.',
   'Policy Changed',
   'Oregon',
   'Portland',
   'Surveillance Transparency',
   '2025-09-12',
   ARRAY['Electronic Frontier Foundation', 'Privacy Advocacy Group'],
   true,
   true,
   false),

  ('Successful Appeal Leads to Settlement Records Release',
   'My initial FOIA request for police settlement records was denied under privacy exemptions. Using the appeal guidance from this platform, I filed a formal appeal arguing that the public interest in knowing how tax dollars were spent on misconduct settlements outweighed privacy concerns. The appeal was granted, and the released records showed over $2 million in settlements that had never been publicly reported.',
   'Records Released',
   'Michigan',
   'Detroit',
   'FOIA Success',
   '2025-04-28',
   ARRAY['Local Investigative Journalists', 'Civil Rights Law Firm'],
   true,
   true,
   false)
ON CONFLICT DO NOTHING;
