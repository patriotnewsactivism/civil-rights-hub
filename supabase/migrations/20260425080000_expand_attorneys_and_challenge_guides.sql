-- ============================================================================
-- Migration: Expand attorneys, challenge guides, and reporting tips
-- Date: 2026-04-25
-- ============================================================================

-- ── More Civil Rights Attorneys ──────────────────────────────────────────────

INSERT INTO attorneys (name, firm, specialty, state, city, phone, email, website, pro_bono, description, is_verified)
VALUES
  ('Ben Crump', 'Ben Crump Law', 'Civil Rights / Police Brutality', 'FL', 'Tallahassee',
   '800-840-1090', 'info@bencrump.com', 'https://bencrump.com',
   false, 'Nationally recognized civil rights attorney who has represented families in high-profile police brutality and wrongful death cases including George Floyd, Breonna Taylor, and Ahmaud Arbery.', true),

  ('Lee Merritt', 'Merritt Law Firm', 'Civil Rights / Racial Justice', 'TX', 'Dallas',
   '214-210-3107', 'info@leemerritt.com', 'https://leemerritt.com',
   false, 'Civil rights attorney representing victims of police violence and racial injustice. Known for cases involving Botham Jean and other high-profile civil rights matters.', true),

  ('Saad Ahmad', 'ACLU of Mississippi', 'First Amendment / Policing', 'MS', 'Jackson',
   '601-354-3408', NULL, 'https://www.aclu-ms.org',
   true, 'ACLU Mississippi staff attorney handling First Amendment, policing, and criminal justice reform cases throughout Mississippi.', true),

  ('Emerson Sykes', 'ACLU National', 'First Amendment / Free Speech', 'NY', 'New York',
   '212-549-2500', NULL, 'https://www.aclu.org',
   true, 'Senior staff attorney with the ACLU Speech, Privacy, and Technology Project focusing on free expression and press freedom.', true),

  ('Katherine Hawkins', 'Project On Government Oversight', 'Whistleblower Protection', 'DC', 'Washington',
   '202-347-1122', NULL, 'https://www.pogo.org',
   true, 'Senior policy analyst focusing on police oversight, civil liberties, and whistleblower protection at the federal level.', true),

  ('Alec Karakatsanis', 'Civil Rights Corps', 'Criminal Justice Reform', 'DC', 'Washington',
   '202-894-6126', 'info@civilrightscorps.org', 'https://www.civilrightscorps.org',
   true, 'Founder of Civil Rights Corps, challenging systemic injustice in the criminal legal system including cash bail, fines, and fees.', true),

  ('Damon Hewitt', 'Lawyers Committee for Civil Rights', 'Voting Rights / Civil Rights', 'DC', 'Washington',
   '202-662-8600', NULL, 'https://www.lawyerscommittee.org',
   true, 'Executive Director of the Lawyers Committee for Civil Rights Under Law, leading national efforts on voting rights and civil rights enforcement.', true),

  ('Kristen Clarke', 'National Urban League (prev. DOJ)', 'Civil Rights Enforcement', 'DC', 'Washington',
   NULL, NULL, 'https://nul.org',
   false, 'Former Assistant Attorney General for Civil Rights at DOJ, led federal enforcement of civil rights laws including police pattern-or-practice investigations.', true),

  ('Jon Greenbaum', 'Lawyers Committee for Civil Rights', 'Voting Rights / Police Accountability', 'DC', 'Washington',
   '202-662-8600', NULL, 'https://www.lawyerscommittee.org',
   true, 'Chief Counsel at the Lawyers Committee, overseeing litigation on voting rights, hate crimes, and police accountability.', true),

  ('Seth Stoughton', 'University of South Carolina', 'Use of Force / Police Training', 'SC', 'Columbia',
   NULL, NULL, 'https://sc.edu/study/colleges_schools/law/',
   false, 'Former police officer turned law professor, nationally recognized expert on police use of force who testifies in civil rights cases.', true)
ON CONFLICT DO NOTHING;


-- ── Challenge Guide Templates ────────────────────────────────────────────────
-- These go into a new table for step-by-step guides on how to challenge
-- rights violations. Referenced by StateConflictLaws component.

CREATE TABLE IF NOT EXISTS challenge_guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'first_amendment', 'fourth_amendment', 'recording', 'protest', 'foia', 'police_encounter'
  difficulty TEXT NOT NULL DEFAULT 'moderate', -- 'easy', 'moderate', 'advanced'
  description TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  legal_basis TEXT,
  estimated_time TEXT,
  tools_needed TEXT[],
  important_warnings TEXT[],
  success_stories TEXT,
  related_laws TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO challenge_guides (title, category, difficulty, description, steps, legal_basis, estimated_time, tools_needed, important_warnings, success_stories, related_laws)
VALUES
(
  'How to File a Police Misconduct Complaint',
  'police_encounter',
  'easy',
  'Step-by-step guide to filing an official complaint against law enforcement officers who violated your rights.',
  '[
    {"step": 1, "title": "Document everything immediately", "detail": "Write down exactly what happened within 24 hours. Include date, time, location, officer badge numbers/names, patrol car numbers, and names of witnesses. Take photos of any injuries or property damage."},
    {"step": 2, "title": "Preserve all evidence", "detail": "Back up any video/audio recordings to cloud storage. Screenshot any relevant text messages. Gather medical records if applicable."},
    {"step": 3, "title": "File with Internal Affairs", "detail": "Contact the police department''s Internal Affairs division. You can file in person, by mail, or often online. Request a copy of your complaint with a tracking number."},
    {"step": 4, "title": "File with civilian oversight board", "detail": "If your city has a civilian review board or police oversight committee, file a parallel complaint. These are independent of the police department."},
    {"step": 5, "title": "File a DOJ complaint", "detail": "Submit a complaint to the Department of Justice Civil Rights Division at civilrights.justice.gov. This is especially important for pattern-or-practice violations."},
    {"step": 6, "title": "Contact the ACLU", "detail": "File an intake form at aclu.org/contact/legal-intake. They can advise on whether your case merits legal action."},
    {"step": 7, "title": "Consider a §1983 lawsuit", "detail": "Consult a civil rights attorney about filing a Section 1983 federal civil rights lawsuit for monetary damages and injunctive relief."}
  ]'::jsonb,
  '42 U.S.C. § 1983, 18 U.S.C. § 242, 34 U.S.C. § 12601',
  '1-4 hours for initial filing',
  ARRAY['Phone/camera for documentation', 'Written timeline', 'Witness contact information', 'Medical records (if applicable)'],
  ARRAY['There may be a statute of limitations — act quickly', 'Do not discuss your complaint on social media before consulting an attorney', 'Retaliation by officers is illegal under federal law'],
  'In 2023, a DOJ pattern-or-practice investigation of Minneapolis PD following a citizen complaint led to a consent decree requiring sweeping reforms.',
  ARRAY['42 U.S.C. § 1983', '18 U.S.C. § 242', '34 U.S.C. § 12601']
),
(
  'How to Assert Your Right to Record Police',
  'first_amendment',
  'easy',
  'Know your rights when recording law enforcement in public and how to respond if officers try to stop you.',
  '[
    {"step": 1, "title": "Know the law", "detail": "The First Amendment protects your right to record police performing their duties in public. This has been affirmed by federal courts in every circuit, most notably Glik v. Cunniffe (1st Circuit, 2011)."},
    {"step": 2, "title": "Stay in a safe public area", "detail": "You have the right to record from any place you have a legal right to be. Maintain a reasonable distance that does not physically interfere with police activity."},
    {"step": 3, "title": "Say this if confronted", "detail": "Calmly state: ''I am exercising my First Amendment right to record. I am not interfering with your duties. I am in a public place.''"},
    {"step": 4, "title": "Do NOT stop recording", "detail": "If ordered to stop, politely decline. Say: ''I understand your request, but I have a constitutional right to record in public.'' Continue recording."},
    {"step": 5, "title": "Auto-backup your footage", "detail": "Use apps like ACLU Mobile Justice, or enable automatic cloud backup so footage is preserved even if your phone is seized."},
    {"step": 6, "title": "If your phone is seized", "detail": "Say: ''I do not consent to a search of my phone.'' Under Riley v. California (2014), police need a warrant to search your phone. Note the officer''s name and badge number."},
    {"step": 7, "title": "File a complaint and contact an attorney", "detail": "If you were prevented from recording or your phone was seized, file a complaint with IA and contact the ACLU or a First Amendment attorney."}
  ]'::jsonb,
  'First Amendment, Glik v. Cunniffe (2011), Riley v. California (2014)',
  '5 minutes to know your rights',
  ARRAY['Smartphone', 'Cloud backup app (ACLU Mobile Justice, Google Drive, iCloud)', 'Emergency contact list'],
  ARRAY['Never physically resist — assert your rights verbally only', 'Two-party consent states may affect audio recording of private conversations, but do NOT apply to recording police in public', 'Interfering with police activity is NOT the same as recording from a distance'],
  'In Glik v. Cunniffe, a bystander recorded police on Boston Common. After his arrest, the First Circuit ruled definitively that recording police is protected by the First Amendment.',
  ARRAY['First Amendment', 'Glik v. Cunniffe, 655 F.3d 78 (1st Cir. 2011)', 'Riley v. California, 573 U.S. 373 (2014)']
),
(
  'How to Challenge an Unlawful Stop or Search',
  'fourth_amendment',
  'moderate',
  'Understanding your Fourth Amendment rights during police encounters and how to legally challenge violations.',
  '[
    {"step": 1, "title": "Ask ''Am I free to go?''", "detail": "This is the most important question. If the officer says yes, leave calmly. If not, you are being detained and have specific rights."},
    {"step": 2, "title": "Ask ''What is your reasonable suspicion?''", "detail": "Under Terry v. Ohio, officers need reasonable articulable suspicion that you are involved in criminal activity to detain you. They must be able to explain it."},
    {"step": 3, "title": "State clearly: ''I do not consent to a search''", "detail": "Say it clearly and calmly. Even if they search you anyway, your verbal refusal preserves your right to challenge it in court later."},
    {"step": 4, "title": "Do NOT physically resist", "detail": "Even if the stop or search is illegal, physically resisting can lead to additional charges. Assert your rights verbally and challenge it legally afterward."},
    {"step": 5, "title": "Document everything", "detail": "Note the time, location, officer names/badge numbers, what was said, and what was searched. Record if possible."},
    {"step": 6, "title": "File a motion to suppress", "detail": "If evidence was found during an unlawful search, your attorney can file a motion to suppress under the exclusionary rule (Mapp v. Ohio, 1961)."},
    {"step": 7, "title": "File a §1983 claim", "detail": "If your rights were violated, you may have a claim for damages under Section 1983 against the officer and potentially the department."}
  ]'::jsonb,
  'Fourth Amendment, Terry v. Ohio (1968), Mapp v. Ohio (1961)',
  'Immediate action during encounter; legal follow-up 1-2 weeks',
  ARRAY['Phone for recording', 'Written notes', 'Civil rights attorney'],
  ARRAY['NEVER physically resist a search — verbal refusal is sufficient', 'Stop-and-identify laws vary by state — check your state requirements', 'Anything you say can be used against you'],
  'In Mapp v. Ohio, the Supreme Court ruled that evidence obtained through an unconstitutional search cannot be used in state courts, establishing the exclusionary rule.',
  ARRAY['Fourth Amendment', 'Terry v. Ohio, 392 U.S. 1 (1968)', 'Mapp v. Ohio, 367 U.S. 643 (1961)']
),
(
  'How to File a FOIA / Public Records Request',
  'foia',
  'easy',
  'Detailed guide to filing Freedom of Information Act requests at federal and state levels to obtain government records.',
  '[
    {"step": 1, "title": "Identify the right agency", "detail": "Determine which federal agency or state/local government body holds the records you want. Each has its own FOIA office."},
    {"step": 2, "title": "Be specific in your request", "detail": "Describe exactly what records you want, including date ranges, departments, and types of documents. Vague requests are more likely to be denied or delayed."},
    {"step": 3, "title": "Submit your request", "detail": "Federal: Use the agency''s FOIA portal or mail to their FOIA officer. State: Use your state''s public records request process (varies by state)."},
    {"step": 4, "title": "Request a fee waiver", "detail": "If you are a journalist, researcher, or requesting in the public interest, you can request a fee waiver. Explain how the information will benefit the public."},
    {"step": 5, "title": "Track your request", "detail": "Save your confirmation number. Federal agencies must respond within 20 business days. State timelines vary."},
    {"step": 6, "title": "Appeal denials", "detail": "If your request is denied, you have the right to appeal. Most agencies have an internal appeal process. Cite specific FOIA exemptions they claimed and why they don''t apply."},
    {"step": 7, "title": "Escalate if needed", "detail": "If appeals fail, you can file a FOIA lawsuit in federal court. Organizations like RCFP, MuckRock, and the National Freedom of Information Coalition can help."}
  ]'::jsonb,
  '5 U.S.C. § 552 (Federal FOIA), State public records laws',
  '30 minutes to draft; 20+ business days for response',
  ARRAY['Written request letter/form', 'Agency FOIA portal access', 'MuckRock account (optional but helpful)'],
  ARRAY['Agencies may charge fees for searching and copying — request a fee waiver upfront', 'Some records have legitimate exemptions (national security, personal privacy, ongoing investigations)', 'Keep copies of all correspondence'],
  'Journalists have used FOIA to uncover police use-of-force data, body camera policies, and disciplinary records that led to major reforms in departments across the country.',
  ARRAY['5 U.S.C. § 552', 'State open records laws']
),
(
  'How to Organize a Legal Protest',
  'protest',
  'moderate',
  'Guide to exercising your First Amendment right to peaceful assembly while minimizing legal risk.',
  '[
    {"step": 1, "title": "Know your rights", "detail": "The First Amendment protects peaceful assembly on public sidewalks, parks, and plazas. You generally do NOT need a permit for sidewalk marches that don''t block traffic."},
    {"step": 2, "title": "Check local permit requirements", "detail": "Large gatherings, marches in streets, or events using amplified sound may require permits. Permit requirements cannot be used to suppress speech — only to manage logistics."},
    {"step": 3, "title": "Designate legal observers", "detail": "Recruit trained legal observers from the NLG (National Lawyers Guild) to document any police misconduct. They wear green hats and are protected from arrest."},
    {"step": 4, "title": "Brief participants on rights", "detail": "Distribute know-your-rights cards. Ensure everyone knows: do not resist arrest, invoke the 5th Amendment, ask for a lawyer, record everything."},
    {"step": 5, "title": "Set up a jail support team", "detail": "Have volunteers ready with bail money, attorney contact info, and a plan to track anyone who gets arrested."},
    {"step": 6, "title": "Document everything", "detail": "Record from multiple angles. Livestream if possible. This protects against false narratives and provides evidence if rights are violated."},
    {"step": 7, "title": "Debrief and follow up", "detail": "After the event, collect all footage and witness statements. File complaints for any police misconduct observed. Share your story with media."}
  ]'::jsonb,
  'First Amendment (Assembly Clause), Shuttlesworth v. City of Birmingham (1969)',
  '1-2 weeks for planning; 1 hour for rights briefing',
  ARRAY['Know-your-rights cards', 'Legal observer training', 'Bail fund', 'First aid supplies', 'Phone chargers'],
  ARRAY['Counter-protesters have the same rights — do not engage physically', 'Police may issue dispersal orders — know your rights if this happens', 'In many jurisdictions, masks at protests may violate anti-mask laws'],
  'The March on Washington in 1963 demonstrated the power of organized, peaceful protest, leading directly to the Civil Rights Act of 1964.',
  ARRAY['First Amendment', 'Shuttlesworth v. City of Birmingham, 394 U.S. 147 (1969)']
),
(
  'How to Handle Warrant Service at Your Home',
  'fourth_amendment',
  'moderate',
  'Know what to do when police come to your door with or without a warrant.',
  '[
    {"step": 1, "title": "Do NOT open the door", "detail": "You are not required to open your door. Speak through the door or a window. Ask: ''Do you have a warrant?''"},
    {"step": 2, "title": "If they claim a warrant, ask to see it", "detail": "Ask them to slide the warrant under the door or hold it up to a window. A valid warrant must be signed by a judge and describe the specific place to be searched."},
    {"step": 3, "title": "Verify the warrant details", "detail": "Check: Is it signed by a judge? Does it list your specific address? Is it dated? What specific items are they authorized to search for?"},
    {"step": 4, "title": "If the warrant is valid", "detail": "You must allow entry. Do not physically resist. State clearly: ''I do not consent to this search beyond the scope of the warrant.'' Record everything."},
    {"step": 5, "title": "If there is NO warrant", "detail": "Politely but firmly state: ''I do not consent to entry or a search. Please come back with a warrant.'' You have every right to refuse."},
    {"step": 6, "title": "Document the search", "detail": "Record video if possible. Note what rooms they enter, what they touch/take. Ask for an inventory of seized items."},
    {"step": 7, "title": "Contact an attorney immediately", "detail": "Whether the search was lawful or not, contact a criminal defense or civil rights attorney to review what happened and advise on next steps."}
  ]'::jsonb,
  'Fourth Amendment, Payton v. New York (1980), Kentucky v. King (2011)',
  'Immediate during encounter',
  ARRAY['Phone for recording', 'Attorney contact information', 'Knowledge of your rights'],
  ARRAY['There are exceptions to the warrant requirement (exigent circumstances, hot pursuit, plain view)', 'An arrest warrant is different from a search warrant', 'If police claim exigent circumstances, you can challenge this later in court'],
  'In Payton v. New York, the Supreme Court ruled that police need a warrant to enter a home to make an arrest, establishing the sanctity of the home under the Fourth Amendment.',
  ARRAY['Fourth Amendment', 'Payton v. New York, 445 U.S. 573 (1980)']
)
ON CONFLICT DO NOTHING;


-- ── Quick Reporting Tips ─────────────────────────────────────────────────────
-- Add more reporting contacts for immediate action

INSERT INTO reporting_contacts (name, organization, contact_type, contact_value, category, scope, description, is_emergency, available_hours)
VALUES
  ('FBI Internet Crime Complaint Center', 'FBI IC3', 'website', 'https://www.ic3.gov', 'cyber_rights', 'national',
   'Report online civil rights threats, doxxing, cyberstalking, and digital harassment targeting activists.', false, '24/7 online submission'),
  
  ('Reporters Committee for Freedom of the Press Legal Defense Hotline', 'RCFP', 'phone', '1-800-336-4243', 'press_freedom', 'national',
   'Free legal help for journalists facing arrest, subpoenas, or interference while reporting. Available to all working journalists and citizen journalists.', true, '24/7 hotline'),
  
  ('Congressional Civil Rights Complaints', 'U.S. Congress', 'website', 'https://www.house.gov/representatives/find-your-representative', 'legislative', 'national',
   'Contact your congressional representative to report civil rights concerns at the federal level. Elected officials have constituent service offices that can intervene with federal agencies.', false, 'Business hours'),
  
  ('National Association for Civilian Oversight of Law Enforcement', 'NACOLE', 'website', 'https://www.nacole.org', 'police_oversight', 'national',
   'Find your local civilian oversight agency. NACOLE connects citizens with independent police oversight bodies across the country.', false, 'Business hours'),
  
  ('Equal Employment Opportunity Commission', 'EEOC', 'phone', '1-800-669-4000', 'employment_rights', 'national',
   'File charges of employment discrimination based on race, color, religion, sex, national origin, age, disability, or genetic information.', false, 'Mon-Fri 8am-8pm ET'),
  
  ('HUD Fair Housing Complaint Line', 'HUD', 'phone', '1-800-669-9777', 'housing_rights', 'national',
   'Report housing discrimination based on race, color, national origin, religion, sex, familial status, or disability.', false, 'Mon-Fri 9am-5pm local time'),
  
  ('Office for Civil Rights (Education)', 'U.S. Dept of Education', 'website', 'https://ocrcas.ed.gov', 'education_rights', 'national',
   'File complaints about discrimination in schools receiving federal funding, including Title VI (race), Title IX (sex), and Section 504 (disability).', false, 'Business hours'),
  
  ('National Immigrant Justice Center', 'Heartland Alliance', 'phone', '312-660-1370', 'immigration_rights', 'national',
   'Legal services and advocacy for immigrants, refugees, and asylum seekers facing civil rights violations.', false, 'Mon-Fri 9am-5pm CT')
ON CONFLICT DO NOTHING;
