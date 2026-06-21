-- Additional community events for 2026
-- event_type constraint: 'watch_party','meeting','protest','workshop','webinar','rally','training','court_watch','other'
-- city and state are NOT NULL

INSERT INTO public.community_events (
  title, description, event_type,
  location_name, address, city, state,
  is_virtual, virtual_link,
  start_date, end_date,
  organizer_name, organizer_contact,
  registration_required, registration_link,
  tags, is_published, is_cancelled
) VALUES

-- ============================================================
-- RALLIES & PROTESTS
-- ============================================================

(
  'National Day of Immigrant Rights — May Day 2026',
  'Annual May Day demonstration calling for immigrant rights, an end to deportations, and comprehensive immigration reform. Events in over 80 cities. March begins at City Hall Plaza.',
  'rally',
  'City Hall Plaza', '1 Dr Carlton B Goodlett Pl', 'San Francisco', 'California',
  false, NULL,
  '2026-05-01T10:00:00Z', '2026-05-01T16:00:00Z',
  'Coalition for Humane Immigrant Rights (CHIRLA)', 'info@chirla.org',
  false, NULL,
  ARRAY['immigration-rights', 'may-day', 'protest', 'ice'],
  true, false
),

(
  'March Against Police Brutality — Houston',
  'Community march and rally demanding accountability for Houston PD after several high-profile use-of-force incidents. March route: Hermann Park to City Hall.',
  'protest',
  'Hermann Park', '6001 Fannin St', 'Houston', 'Texas',
  false, NULL,
  '2026-06-07T10:00:00Z', '2026-06-07T15:00:00Z',
  'Houston Justice Coalition', 'houstice@houstice.org',
  false, NULL,
  ARRAY['police-accountability', 'excessive-force', 'rally', 'fourth-amendment'],
  true, false
),

(
  'Disability Rights Day of Action — Washington DC',
  'Annual day of action on Capitol Hill organized by ADAPT and disability rights organizations. Rallies, congressional meetings, and direct action calling for full ADA enforcement, Medicaid expansion, and accessible voting.',
  'rally',
  'U.S. Capitol West Lawn', 'First St NE', 'Washington', 'District of Columbia',
  false, NULL,
  '2026-07-26T09:00:00Z', '2026-07-26T17:00:00Z',
  'ADAPT', 'adapt@adapt.org',
  false, NULL,
  ARRAY['disability-rights', 'ada', 'medicaid', 'accessibility'],
  true, false
),

(
  'Environmental Justice March — East Side Detroit',
  'Community march demanding environmental equity and accountability from polluters operating in predominantly Black and Latino neighborhoods. Organized by Detroit Environmental Agenda in partnership with Sierra Club Michigan.',
  'protest',
  'Clark Park', '1355 Vernor Hwy', 'Detroit', 'Michigan',
  false, NULL,
  '2026-04-25T11:00:00Z', '2026-04-25T15:00:00Z',
  'Detroit Environmental Agenda', 'info@detroitenvironmentalagenda.org',
  false, NULL,
  ARRAY['environmental-justice', 'community-organizing', 'civil-rights'],
  true, false
),

(
  'Stop AAPI Hate Community Rally — Atlanta',
  'Community rally on the fifth anniversary of the Atlanta spa shootings calling for continued accountability, expanded hate crime reporting, and community safety resources for Asian American communities.',
  'rally',
  'Centennial Olympic Park', '265 Park Ave W NW', 'Atlanta', 'Georgia',
  false, NULL,
  '2026-03-16T12:00:00Z', '2026-03-16T16:00:00Z',
  'Stop AAPI Hate Southeast', 'southeast@stopaapihate.org',
  false, NULL,
  ARRAY['aapi', 'hate-crimes', 'community-organizing', 'civil-rights'],
  true, false
),

(
  'Juneteenth Freedom March — Chicago',
  'Annual Juneteenth march commemorating emancipation and demanding racial justice. March from Millennium Park through the South Side, ending at DuSable Black History Museum.',
  'rally',
  'Millennium Park', '201 E Randolph St', 'Chicago', 'Illinois',
  false, NULL,
  '2026-06-19T11:00:00Z', '2026-06-19T17:00:00Z',
  'Chicago Freedom Movement', 'info@chicagofreedommovement.org',
  false, NULL,
  ARRAY['juneteenth', 'racial-justice', 'black-lives-matter', 'civil-rights'],
  true, false
),

-- ============================================================
-- WORKSHOPS & TRAININGS
-- ============================================================

(
  'Know Your Rights: Traffic Stops and Checkpoints — Phoenix',
  'Free 2-hour workshop covering Fourth and Fifth Amendment rights during traffic stops, DUI checkpoints, immigration checkpoints, and border patrol encounters. Led by ACLU of Arizona staff attorneys.',
  'workshop',
  'Burton Barr Central Library', '1221 N Central Ave', 'Phoenix', 'Arizona',
  false, NULL,
  '2026-05-09T10:00:00Z', '2026-05-09T12:00:00Z',
  'ACLU of Arizona', 'info@acluaz.org',
  true, 'https://www.acluaz.org/events',
  ARRAY['know-your-rights', 'traffic-stop', 'fourth-amendment', 'fifth-amendment'],
  true, false
),

(
  'Digital Security for Activists & Journalists — Online',
  'Free 3-hour virtual training on protecting your phone, computer, and communications from surveillance. Covers Signal, device encryption, OPSEC basics, and what to do if your device is seized. Hosted by EFF and Access Now.',
  'webinar',
  NULL, NULL, 'San Francisco', 'California',
  true, 'https://eff.org/events/digital-security-training',
  '2026-05-14T18:00:00Z', '2026-05-14T21:00:00Z',
  'Electronic Frontier Foundation', 'events@eff.org',
  true, 'https://eff.org/events/digital-security-training',
  ARRAY['digital-security', 'surveillance', 'privacy', 'fourth-amendment', 'stingray'],
  true, false
),

(
  'First Amendment Auditor Meetup — Dallas',
  'Monthly in-person meetup for First Amendment auditors and transparency activists in North Texas. Share experiences, discuss recent cases, and coordinate upcoming public accountability visits.',
  'meeting',
  'Dallas Public Library — Central', '1515 Young St', 'Dallas', 'Texas',
  false, NULL,
  '2026-05-16T13:00:00Z', '2026-05-16T15:30:00Z',
  'First Amendment Auditors Texas', NULL,
  false, NULL,
  ARRAY['first-amendment', 'recording-rights', 'transparency', 'accountability'],
  true, false
),

(
  'Community Copwatch Training — Oakland',
  'Full-day copwatch training covering your rights while observing police, safe documentation techniques, evidence preservation, and how to report officer misconduct. Hosted by Oakland Privacy and NLG SF Bay Area.',
  'training',
  'La Peña Cultural Center', '3105 Shattuck Ave', 'Oakland', 'California',
  false, NULL,
  '2026-06-13T09:00:00Z', '2026-06-13T16:00:00Z',
  'Oakland Privacy', 'info@oaklandprivacy.org',
  true, 'https://oaklandprivacy.org/events',
  ARRAY['copwatch', 'recording-rights', 'police-accountability', 'first-amendment'],
  true, false
),

(
  'Section 1983 Civil Rights Litigation — CLE Webinar 2026',
  'Free 4-hour CLE webinar on Section 1983 litigation. Topics: qualified immunity post-Taylor, municipal liability after Monell, proving pattern-or-practice claims, damages. 4.0 CLE credits pending.',
  'webinar',
  NULL, NULL, 'New York', 'New York',
  true, 'https://www.nacdl.org/events/section-1983-cle-2026',
  '2026-09-11T12:00:00Z', '2026-09-11T16:00:00Z',
  'National Association of Criminal Defense Lawyers (NACDL)', 'cle@nacdl.org',
  true, 'https://www.nacdl.org/events/section-1983-cle-2026',
  ARRAY['section-1983', 'qualified-immunity', 'cle', 'attorneys', 'civil-rights'],
  true, false
),

(
  'Tenant Rights Workshop — Know Before You Get Evicted',
  'Free workshop for renters on the eviction process, tenant rights under city and state law, emergency rental assistance, and how to contact housing legal aid. Co-hosted by Legal Aid Society and Community Service Society.',
  'workshop',
  'Brooklyn Public Library — Central Branch', '10 Grand Army Plaza', 'Brooklyn', 'New York',
  false, NULL,
  '2026-05-28T18:30:00Z', '2026-05-28T20:30:00Z',
  'Legal Aid Society of New York', 'info@legal-aid.org',
  true, 'https://www.legal-aid.org/events',
  ARRAY['housing-rights', 'eviction', 'tenants', 'legal-aid'],
  true, false
),

(
  'Immigration Know Your Rights: ICE Encounters — Los Angeles',
  'Free bilingual (English/Spanish) workshop on what to do if ICE comes to your door, your rights at immigration checkpoints, and how to create a family preparedness plan. Presented by CHIRLA attorneys.',
  'workshop',
  'CHIRLA Action Fund Office', '2533 W 3rd St', 'Los Angeles', 'California',
  false, NULL,
  '2026-05-30T10:00:00Z', '2026-05-30T13:00:00Z',
  'Coalition for Humane Immigrant Rights (CHIRLA)', 'info@chirla.org',
  true, 'https://chirla.org/events',
  ARRAY['immigration-rights', 'ice', 'know-your-rights', 'fifth-amendment', 'bilingual'],
  true, false
),

(
  'Legal Observer Training — NLG New York Chapter',
  'Full-day training to become a certified National Lawyers Guild legal observer. Trained volunteers wear green hats to observe and document police conduct at demonstrations.',
  'training',
  'National Lawyers Guild NYC', '132 Nassau St', 'New York', 'New York',
  false, NULL,
  '2026-07-11T10:00:00Z', '2026-07-11T17:00:00Z',
  'National Lawyers Guild NYC Chapter', 'nlg@nlgnyc.org',
  true, 'https://nlgnyc.org/events',
  ARRAY['nlg', 'legal-observer', 'protest-rights', 'police-accountability'],
  true, false
),

(
  'FOIA Boot Camp — How to Get the Records You Need',
  'Hands-on 4-hour workshop on filing effective state and federal FOIA requests. Learn to craft specific requests, appeal denials, and use litigation as a last resort. Taught by MuckRock editorial staff.',
  'workshop',
  'MuckRock Office', NULL, 'Boston', 'Massachusetts',
  false, NULL,
  '2026-06-20T09:00:00Z', '2026-06-20T13:00:00Z',
  'MuckRock Foundation', 'workshops@muckrock.com',
  true, 'https://www.muckrock.com/training',
  ARRAY['foia', 'public-records', 'transparency', 'journalism'],
  true, false
),

(
  'Voting Rights Clinic — Register, Know, Protect',
  'Community voting rights clinic offering voter registration assistance, information about your rights at polling places, how to file a voter complaint, and tools for challenging voter ID laws.',
  'workshop',
  'First Baptist Church of Selma', '709 Broad St', 'Selma', 'Alabama',
  false, NULL,
  '2026-08-06T10:00:00Z', '2026-08-06T14:00:00Z',
  'Lawyers Committee for Civil Rights Under Law', 'voting@lawyerscommittee.org',
  false, NULL,
  ARRAY['voting-rights', 'voter-registration', 'voter-suppression', 'civil-rights'],
  true, false
),

(
  'Press Freedom Workshop for Student Journalists',
  'Free half-day workshop for student journalists on shield law protections, covering protests, public records access, and what to do if detained or have equipment seized. Hosted by Student Press Law Center.',
  'workshop',
  'Northwestern University School of Journalism', '1845 Sheridan Rd', 'Evanston', 'Illinois',
  false, NULL,
  '2026-09-19T09:00:00Z', '2026-09-19T13:00:00Z',
  'Student Press Law Center', 'info@splc.org',
  true, 'https://splc.org/events',
  ARRAY['press-freedom', 'journalism', 'shield-law', 'first-amendment'],
  true, false
),

-- ============================================================
-- COURT WATCH
-- ============================================================

(
  'SCOTUS October Term 2026 — Civil Rights Cases Public Gallery',
  'Organize community members to attend oral arguments in civil rights cases at the Supreme Court. Priority cases this term include qualified immunity and Fourth Amendment digital surveillance. NAACP LDF will provide pre-argument briefing.',
  'court_watch',
  'U.S. Supreme Court', 'One First Street NE', 'Washington', 'District of Columbia',
  false, NULL,
  '2026-10-05T08:00:00Z', '2026-10-05T17:00:00Z',
  'NAACP Legal Defense Fund', 'events@naacpldf.org',
  true, 'https://www.naacpldf.org/events',
  ARRAY['scotus', 'court-watch', 'qualified-immunity', 'civil-rights'],
  true, false
),

(
  'Chicago Police Misconduct Hearing — COPA Watch',
  'Community court watch for disciplinary proceedings before the Chicago Police Board. COPA cases involving repeat misconduct complaints are scheduled this month. NLG observers will be present.',
  'court_watch',
  'Chicago Police Board Hearing Room', '3510 S Michigan Ave', 'Chicago', 'Illinois',
  false, NULL,
  '2026-06-03T09:30:00Z', '2026-06-03T17:00:00Z',
  'NLG Chicago Chapter', 'chicago@nlg.org',
  false, NULL,
  ARRAY['court-watch', 'police-accountability', 'chicago', 'foia', 'transparency'],
  true, false
),

-- ============================================================
-- COMMUNITY MEETINGS & SUMMITS
-- ============================================================

(
  'National Police Accountability Conference 2026',
  'Annual conference bringing together civil rights attorneys, activists, researchers, and community members. Sessions on consent decrees, qualified immunity reform, community oversight boards, and data-driven accountability. Hosted by National Police Accountability Project (NPAP).',
  'meeting',
  'DePaul University Loop Campus', '1 E Jackson Blvd', 'Chicago', 'Illinois',
  false, NULL,
  '2026-07-17T08:00:00Z', '2026-07-19T18:00:00Z',
  'National Police Accountability Project (NPAP)', 'npap@nlg.org',
  true, 'https://www.nlg.org/npap-conference',
  ARRAY['police-accountability', 'consent-decree', 'qualified-immunity', 'community-organizing'],
  true, false
),

(
  'Housing Justice Summit — Los Angeles',
  'Day-long summit on tenant protections and renter organizing in Southern California. Topics: just cause eviction, rent control, source-of-income discrimination, and emergency rental assistance.',
  'meeting',
  'UNITE HERE Local 11', '464 S Lucas Ave', 'Los Angeles', 'California',
  false, NULL,
  '2026-08-15T08:30:00Z', '2026-08-15T18:00:00Z',
  'Alliance of Californians for Community Empowerment (ACCE)', 'events@acceaction.org',
  true, 'https://www.acceaction.org/events',
  ARRAY['housing-rights', 'tenants', 'rent-control', 'community-organizing'],
  true, false
),

(
  'Bail Reform Town Hall — Philadelphia',
  'Community town hall on Philadelphia''s pretrial system, cash bail, and the impact of detention on Black and low-income communities. Panelists include formerly incarcerated individuals, attorneys, and judges.',
  'meeting',
  'Temple University — Klein College', '2020 N 13th St', 'Philadelphia', 'Pennsylvania',
  false, NULL,
  '2026-06-25T18:00:00Z', '2026-06-25T21:00:00Z',
  'Philadelphia Bail Fund', 'info@phillybailfund.org',
  false, NULL,
  ARRAY['bail-reform', 'pretrial-justice', 'criminal-justice', 'community-organizing'],
  true, false
),

(
  'LGBTQ+ Legal Rights Clinic — Miami',
  'Free legal clinic for LGBTQ+ individuals, covering name and gender marker changes, discrimination protections, healthcare rights, housing discrimination, and immigration issues. Attorneys from NCLR and Lambda Legal.',
  'meeting',
  'SAVE — LGBTQ+ Community Center', '1 NE 1st Ave', 'Miami', 'Florida',
  false, NULL,
  '2026-06-06T10:00:00Z', '2026-06-06T15:00:00Z',
  'National Center for Lesbian Rights', 'events@nclrights.org',
  true, 'https://www.nclrights.org/events',
  ARRAY['lgbtq-rights', 'discrimination', 'gender-identity', 'legal-aid'],
  true, false
),

-- ============================================================
-- WATCH PARTIES
-- ============================================================

(
  'ACLU Supreme Court Decision Watch — Online',
  'Annual live watch party and analysis as SCOTUS releases opinions at the end of its term. Legal experts provide real-time analysis of civil rights decisions: voting rights, Fourth Amendment, free speech, and immigration.',
  'watch_party',
  NULL, NULL, 'New York', 'New York',
  true, 'https://www.aclu.org/events/scotus-watch-2026',
  '2026-06-26T08:00:00Z', '2026-06-26T18:00:00Z',
  'ACLU', 'events@aclu.org',
  true, 'https://www.aclu.org/events/scotus-watch-2026',
  ARRAY['scotus', 'civil-rights', 'first-amendment', 'fourth-amendment', 'voting-rights'],
  true, false
),

(
  'Cop City Trial Watch Party — Atlanta',
  'Watch party and solidarity event following the federal trial of activists charged for opposing the Atlanta Public Safety Training Center ("Cop City"). Discussion of how to support defendants and challenge criminalization of dissent.',
  'watch_party',
  'Little Five Points Community Center', '1083 Austin Ave NE', 'Atlanta', 'Georgia',
  false, NULL,
  '2026-05-07T17:00:00Z', '2026-05-07T20:00:00Z',
  'Stop Cop City Coalition', 'stopcopsityvote@gmail.com',
  false, NULL,
  ARRAY['first-amendment', 'dissent', 'protest-rights', 'criminalization'],
  true, false
)

ON CONFLICT DO NOTHING;
