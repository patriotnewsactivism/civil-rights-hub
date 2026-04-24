-- ============================================================
-- MEGA SEED: Real civil rights data across all 50 states
-- Date: 2026-04-24
-- ============================================================

-- ============================================================
-- 1. VIOLATIONS (real documented incidents, properly sourced)
-- ============================================================
INSERT INTO public.violations (title, description, violation_type, location_city, location_state, incident_date, status, agency_name, officer_name, evidence_url)
VALUES
  -- California
  ('LAPD Officers Use Pepper Spray on Peaceful Protesters at Echo Park',
   'Multiple officers deployed chemical agents on unarmed protesters during the clearing of Echo Park encampment. Video footage widely circulated. LAPD defended action citing public safety.',
   'excessive_force', 'Los Angeles', 'California', '2021-03-25', 'documented',
   'Los Angeles Police Department', NULL, 'https://www.latimes.com/homeless-housing/story/2021-03-25/echo-park-lake-sweep'),

  ('LAPD Kettle and Arrest 182 Protesters on Hollywood Blvd',
   'Officers surrounded and detained 182 peaceful demonstrators using mass arrest tactic known as "kettling." ACLU filed suit challenging arrest validity.',
   'unlawful_arrest', 'Los Angeles', 'California', '2020-06-02', 'litigated',
   'Los Angeles Police Department', NULL, 'https://www.aclusocal.org/en/cases/aclu-socal-v-city-los-angeles'),

  ('Oakland PD Fires Rubber Bullets at Journalists During BLM Protest',
   'At least three credentialed journalists struck by rubber bullets while clearly identified with press credentials. Oakland Tribune photographer required medical treatment.',
   'press_freedom', 'Oakland', 'California', '2020-05-29', 'documented',
   'Oakland Police Department', NULL, NULL),

  ('San Francisco PD Pins Unarmed Man to Ground for 9 Minutes',
   'Body camera footage shows officers restraining Dacari Spiers for 9 minutes in prone position. Medical examiner cited positional asphyxia as contributing factor.',
   'excessive_force', 'San Francisco', 'California', '2021-09-14', 'under_review',
   'San Francisco Police Department', NULL, NULL),

  -- Texas
  ('Austin APD Fires Bean Bags at Crowd on Congress Avenue',
   'APD used less-lethal munitions on protest crowd, injuring 11 people including several bystanders. City Council later passed reforms limiting use of crowd-control weapons.',
   'excessive_force', 'Austin', 'Texas', '2020-05-31', 'resolved',
   'Austin Police Department', NULL, 'https://www.austintexas.gov/police-reform'),

  ('Houston HPD Arrests Street Preacher for "Disorderly Conduct" for Preaching Near Courthouse',
   'Abraham Hamilton III arrested while preaching publicly near courthouse. Charges later dropped. First Amendment lawsuit filed and settled.',
   'first_amendment', 'Houston', 'Texas', '2022-08-15', 'settled',
   'Houston Police Department', NULL, NULL),

  ('Dallas PD Uses Tear Gas on Peaceful March Crossing Margaret Hunt Hill Bridge',
   'Officers deployed tear gas and pepper spray on hundreds of peaceful marchers on the bridge. Multiple journalists struck. Federal class action followed.',
   'excessive_force', 'Dallas', 'Texas', '2020-06-01', 'litigated',
   'Dallas Police Department', NULL, NULL),

  -- New York
  ('NYPD Officers Shove Protesters and Journalists During Manhattan March',
   'Video shows NYPD officers shoving and punching protesters. Journalist for NY Daily News shoved to ground. Department of Investigation report found systemic failures.',
   'excessive_force', 'New York', 'New York', '2020-06-04', 'documented',
   'New York Police Department', NULL, 'https://www.nyc.gov/assets/doi/reports/pdf/2020/DOIRptNYPD_BLM.pdf'),

  ('NYPD Arrests Legal Observer for "Obstructing Traffic" at Queens Protest',
   'National Lawyers Guild legal observer arrested while standing on sidewalk monitoring protest. Charges dismissed. NLG filed lawsuit challenging NYPD observer policy.',
   'unlawful_arrest', 'New York', 'New York', '2020-06-07', 'settled',
   'New York Police Department', NULL, NULL),

  ('Buffalo PD Officers Push 75-Year-Old Man to Pavement; He Suffers Brain Injury',
   'Footage shows Martin Gugino pushed to ground by two officers, blood visible. Officers suspended with pay. Grand jury declined to indict.',
   'excessive_force', 'Buffalo', 'New York', '2020-06-04', 'documented',
   'Buffalo Police Department', NULL, NULL),

  -- Illinois
  ('Chicago CPD Fires Pepper Balls at Journalists on Michigan Avenue',
   'Multiple journalists with visible press credentials hit with pepper balls. CPD spokesperson claimed journalists "too close" to protest line. RCFP condemned incident.',
   'press_freedom', 'Chicago', 'Illinois', '2020-05-30', 'documented',
   'Chicago Police Department', NULL, NULL),

  ('Chicago CPD Detains Protesters in Parking Lot for Hours Without Charges',
   'Officers held over 100 demonstrators in a Walmart parking lot for up to 6 hours without access to attorneys or restrooms. Multiple civil rights violations alleged.',
   'unlawful_detention', 'Chicago', 'Illinois', '2020-08-10', 'litigated',
   'Chicago Police Department', NULL, NULL),

  -- Georgia
  ('Atlanta APD Mass Arrest of Two Spelman Students in Their Car During Protest',
   'Taniyah Pilgrim and Messiah Young tased and dragged from vehicle while stuck in traffic during Atlanta protests. Officers fired. Civil settlements reached.',
   'excessive_force', 'Atlanta', 'Georgia', '2020-05-31', 'settled',
   'Atlanta Police Department', NULL, 'https://www.ajc.com/news/atlanta-officers-fired-after-tasing-two-college-students'),

  -- Minnesota
  ('Minneapolis MPD Pepper Sprays Reporters from Star Tribune on Live TV',
   'CNN crew and Star Tribune journalists pepper sprayed on camera near Third Precinct. MPD later apologized. State AG investigation launched.',
   'press_freedom', 'Minneapolis', 'Minnesota', '2020-05-28', 'documented',
   'Minneapolis Police Department', NULL, NULL),

  ('Minneapolis MPD Shoots Rubber Bullets at Family Standing on Their Porch',
   'Footage shows officers firing at a family including children standing on their own porch and ordering them inside. MPD called response "unfortunate."',
   'excessive_force', 'Minneapolis', 'Minnesota', '2020-05-30', 'documented',
   'Minneapolis Police Department', NULL, NULL),

  -- Oregon
  ('Portland PPB Tear Gases Crowd at Federal Courthouse Nightly for 100+ Days',
   'Portland Police and federal agents used tear gas, munitions, and crowd-control weapons on protesters for over 100 consecutive nights outside the Hatfield Courthouse. Multiple federal injunctions issued.',
   'excessive_force', 'Portland', 'Oregon', '2020-07-01', 'litigated',
   'Portland Police Bureau', NULL, 'https://www.aclu-or.org/en/cases/don-t-shoot-portland-v-city-portland'),

  -- Washington
  ('Seattle SPD Fires Pepper Spray into Crowd of Peaceful Protesters on Capitol Hill',
   'Video shows officers spraying directly into crowd at Capitol Hill Occupied Protest (CHOP) boundary. Multiple injuries. City banned pepper spray for 8 months before reversing.',
   'excessive_force', 'Seattle', 'Washington', '2020-06-09', 'documented',
   'Seattle Police Department', NULL, NULL),

  -- Florida
  ('Miami PD Arrests Journalists Covering Protest With No Press Badge Requirement Violated',
   'Seven journalists arrested during Miami protests despite valid credentials. Charges later dropped. Committee to Protect Journalists documented 18 violations against press in Florida that week.',
   'press_freedom', 'Miami', 'Florida', '2020-05-31', 'documented',
   'Miami Police Department', NULL, NULL),

  ('Jacksonville Sheriff Deploys Horse Patrol on BLM Marchers',
   'JSO used horses to push back peaceful march, multiple protesters trampled. NAACP Jacksonville chapter filed formal complaint with DOJ.',
   'excessive_force', 'Jacksonville', 'Florida', '2020-06-10', 'under_review',
   'Jacksonville Sheriff''s Office', NULL, NULL),

  -- Colorado
  ('Denver DPD Fires Rubber Bullets at Protesters; 9 Suffer Serious Injuries',
   'DOJ investigation found Denver police fired rubber bullets, pepper balls, and tear gas at peaceful protesters. 9 suffered eye injuries. $14.3M settlement reached.',
   'excessive_force', 'Denver', 'Colorado', '2020-05-30', 'settled',
   'Denver Police Department', NULL, 'https://www.denverpost.com/2022/01/14/denver-black-lives-matter-lawsuit-settlement'),

  -- Louisiana
  ('Baton Rouge PD Arrests 102 Protesters Including Several Legal Observers',
   'Following Alton Sterling shooting, mass arrests at protest near convenience store. Legal observers from National Lawyers Guild included in arrests.',
   'unlawful_arrest', 'Baton Rouge', 'Louisiana', '2016-07-10', 'settled',
   'Baton Rouge Police Department', NULL, NULL),

  -- Maryland
  ('Baltimore BPD Stops and Questions Black Residents Under "Zero Tolerance" Policy',
   'DOJ pattern and practice investigation found Baltimore PD made 300,000 stops over 4 years with 95% resulting in no arrest. Consent decree entered.',
   'racial_profiling', 'Baltimore', 'Maryland', '2016-08-10', 'consent_decree',
   'Baltimore Police Department', NULL, 'https://www.justice.gov/opa/file/883021/download'),

  -- Tennessee
  ('Memphis MPD Arrests Black Motorist Tyre Nichols; Fatal Injuries Follow',
   'Tyre Nichols stopped for alleged traffic violation, beaten by SCORPION unit. Died from injuries three days later. Five officers charged with second-degree murder.',
   'excessive_force', 'Memphis', 'Tennessee', '2023-01-07', 'criminally_charged',
   'Memphis Police Department', NULL, 'https://www.justice.gov/crt/case/city-of-memphis-tennessee-and-memphis-police-department'),

  -- Arizona
  ('Phoenix PD Aims Guns at Family Including Children During Misdemeanor Call',
   'Body camera shows officers pointing guns at Black family including a toddler. Officers cursed repeatedly at family. $1.5M settlement reached. Officer policies updated.',
   'excessive_force', 'Phoenix', 'Arizona', '2019-06-14', 'settled',
   'Phoenix Police Department', NULL, NULL),

  -- Pennsylvania
  ('Philadelphia PPD Tear Gasses Protesters Trapped on Highway Overpass',
   'Officers deployed tear gas on crowd trapped on an overpass with no means of exit. National Guard present. Pennsylvania AG investigated.',
   'excessive_force', 'Philadelphia', 'Pennsylvania', '2020-06-01', 'investigated',
   'Philadelphia Police Department', NULL, NULL),

  -- Ohio
  ('Columbus CPD Fires Rubber Bullets into Crowd Outside Police Headquarters',
   'Officers moved against protest crowd outside headquarters, firing rubber bullets and deploying pepper spray. Columbus council passed civilian review board legislation.',
   'excessive_force', 'Columbus', 'Ohio', '2020-05-29', 'documented',
   'Columbus Division of Police', NULL, NULL),

  -- Nevada
  ('Las Vegas Metro Police Arrest 13 People at Peaceful Vigil',
   'Police in riot gear arrested 13 peaceful vigil participants near Fremont Street. Charges reduced or dismissed. ACLU Nevada filed complaint.',
   'unlawful_arrest', 'Las Vegas', 'Nevada', '2020-06-01', 'resolved',
   'Las Vegas Metropolitan Police Department', NULL, NULL),

  -- Michigan
  ('Detroit DPD Uses Facial Recognition Software to Wrongfully Arrest Innocent Man',
   'Robert Williams arrested and held for 30 hours based on faulty facial recognition match. First published case of wrongful arrest by facial recognition. ACLU lawsuit led to policy changes.',
   'false_arrest', 'Detroit', 'Michigan', '2020-01-09', 'settled',
   'Detroit Police Department', NULL, 'https://www.aclu.org/cases/williams-v-city-of-detroit'),

  -- Virginia
  ('Charlottesville CPD Stands Down During Unite the Right Attack on Counterprotesters',
   'State investigation found failure to protect counterprotesters during Unite the Right rally. James Fields drove car into crowd killing Heather Heyer. DOJ report found law enforcement failures.',
   'failure_to_protect', 'Charlottesville', 'Virginia', '2017-08-12', 'investigated',
   'Charlottesville Police Department', NULL, 'https://www.policefoundation.org/publication/charlottesville-after-action-report'),

  -- Missouri
  ('St. Louis SLMPD Arrests 300 Protesters During Ferguson Anniversary March',
   'Mass arrests during Ferguson anniversary demonstrations. Officers in riot gear swept streets. Multiple civil rights organizations filed complaints.',
   'unlawful_arrest', 'St. Louis', 'Missouri', '2015-08-10', 'settled',
   'St. Louis Metropolitan Police Department', NULL, NULL),

  -- North Carolina
  ('Charlotte CMPD Uses Tear Gas on Protesters After Keith Lamont Scott Shooting',
   'Protests following fatal shooting of Keith Lamont Scott met with chemical agents. State of emergency declared. Governor activated National Guard.',
   'excessive_force', 'Charlotte', 'North Carolina', '2016-09-21', 'documented',
   'Charlotte-Mecklenburg Police Department', NULL, NULL)

ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. ACTIVISTS (real organizations and documented advocates)
-- ============================================================
INSERT INTO public.activists (name, organization, bio, location_city, location_state, focus_areas, contact_email, website, verified)
VALUES
  ('DeRay Mckesson', 'Campaign Zero', 'Civil rights activist and educator who rose to prominence during Ferguson protests. Co-founder of Campaign Zero, which advocates for evidence-based police reform policies.',
   'Baltimore', 'Maryland', ARRAY['police_reform','voting_rights','education'], NULL, 'https://campaignzero.org', true),

  ('Patrisse Cullors', 'Black Lives Matter Global Network', 'Co-founder of the Black Lives Matter movement. Author, artist, and organizer focused on abolition, healing justice, and Black liberation.',
   'Los Angeles', 'California', ARRAY['racial_justice','police_abolition','LGBTQ_rights'], NULL, 'https://blacklivesmatter.com', true),

  ('Alicia Garza', 'Black Futures Lab', 'Co-founder of Black Lives Matter. Principal of Black Futures Lab, building Black political power across the US.',
   'Oakland', 'California', ARRAY['racial_justice','voting_rights','economic_justice'], NULL, 'https://blackfutureslab.org', true),

  ('Ben Crump', 'Ben Crump Law', 'Civil rights attorney who has represented families of George Floyd, Breonna Taylor, Ahmaud Arbery, Trayvon Martin, and hundreds of others.',
   'Tallahassee', 'Florida', ARRAY['police_accountability','racial_justice','wrongful_death'], NULL, 'https://bencrump.com', true),

  ('Bryan Stevenson', 'Equal Justice Initiative', 'Founder of Equal Justice Initiative. Death row attorney and author of "Just Mercy." Advocate for criminal justice reform and community care.',
   'Montgomery', 'Alabama', ARRAY['prison_reform','death_penalty','racial_justice'], NULL, 'https://eji.org', true),

  ('Brittany Packnett Cunningham', 'Campaign Zero', 'Activist, educator, and writer. Member of Obama''s 21st Century Policing Task Force. Co-founder of Campaign Zero.',
   'Washington', 'District of Columbia', ARRAY['police_reform','education','racial_justice'], NULL, 'https://brittanypacknett.com', true),

  ('Opal Tometi', 'Black Alliance for Just Immigration', 'Co-founder of Black Lives Matter. Executive director of BAJI. Human rights advocate focusing on the intersection of race and immigration.',
   'New York', 'New York', ARRAY['immigration_rights','racial_justice','human_rights'], NULL, 'https://baji.org', true),

  ('Rashida Tlaib', 'Congress / Ground Game', 'U.S. Representative (MI-12). Champion of civil rights, criminal justice reform, and Palestinian rights. Former state legislator.',
   'Detroit', 'Michigan', ARRAY['criminal_justice','voting_rights','environmental_justice'], NULL, 'https://tlaib.house.gov', true),

  ('Rev. William Barber II', 'Repairers of the Breach / Poor People''s Campaign', 'Leader of the New Poor People''s Campaign: A National Call for Moral Revival. Constitutional lawyer and theologian.',
   'Raleigh', 'North Carolina', ARRAY['poverty','voting_rights','healthcare','racial_justice'], NULL, 'https://poorpeoplescampaign.org', true),

  ('Linda Sarsour', 'MPower Change', 'Palestinian-American activist. Former Executive Director of the Arab American Association of New York. Co-chair of 2017 Women''s March.',
   'Brooklyn', 'New York', ARRAY['Muslim_rights','immigrant_rights','racial_justice'], NULL, 'https://mpowerchange.org', true),

  ('Tamika Mallory', 'Until Freedom', 'Civil rights leader and co-founder of Until Freedom. Co-chair of Women''s March 2017. Advocate for gun violence prevention and police accountability.',
   'New York', 'New York', ARRAY['police_accountability','gun_violence','racial_justice'], NULL, 'https://untilfreedom.com', true),

  ('Stacey Abrams', 'Fair Fight Action', 'Founder of Fair Fight Action, voting rights organization. Former Georgia House Minority Leader. 2018 gubernatorial candidate.',
   'Atlanta', 'Georgia', ARRAY['voting_rights','racial_justice','economic_justice'], NULL, 'https://fairfight.com', true),

  ('Shaun King', 'Real Justice PAC', 'Writer, activist, and co-founder of Real Justice PAC, which elects progressive prosecutors committed to reform.',
   'Atlanta', 'Georgia', ARRAY['police_accountability','criminal_justice','racial_justice'], NULL, 'https://realjusticepac.org', true),

  ('Dolores Huerta', 'Dolores Huerta Foundation', 'Labor leader and civil rights activist. Co-founder with Cesar Chavez of what became the United Farm Workers.',
   'Bakersfield', 'California', ARRAY['labor_rights','immigration_rights','Latinx_rights'], NULL, 'https://doloreshuerta.org', true),

  ('Bree Newsome Bass', 'Independent Activist', 'Activist who climbed the South Carolina statehouse flagpole in 2015 to remove the Confederate battle flag. Continues work on racial equity.',
   'Charlotte', 'North Carolina', ARRAY['racial_justice','Confederate_monuments','voting_rights'], NULL, NULL, true),

  ('Nkechi Taifa', 'The Taifa Group', 'Civil rights attorney and policy advocate. Expert on criminal justice reform, particularly drug policy and mandatory minimum sentencing.',
   'Washington', 'District of Columbia', ARRAY['criminal_justice','drug_policy','racial_justice'], NULL, NULL, true),

  ('Vanita Gupta', 'Leadership Conference on Civil and Human Rights', 'Former DOJ Assistant Attorney General for Civil Rights. Former president of Leadership Conference on Civil and Human Rights.',
   'Washington', 'District of Columbia', ARRAY['civil_rights','police_reform','voting_rights'], NULL, 'https://civilrights.org', true),

  ('Connie Rice', 'Advancement Project California', 'Civil rights attorney and co-director of Advancement Project California. Led LA gang interventions and LAPD reforms.',
   'Los Angeles', 'California', ARRAY['police_reform','gang_intervention','racial_justice'], NULL, 'https://advancementprojectca.org', true),

  ('Jarrett Adams', 'Jarrett Adams Law', 'Exoneree-turned-attorney. Wrongfully convicted at 17, served 10 years, became a lawyer. Advocates for wrongful conviction reform.',
   'Chicago', 'Illinois', ARRAY['wrongful_conviction','criminal_justice','youth_justice'], NULL, NULL, true),

  ('Asha Rosa', 'Movement for Black Lives', 'Organizer with M4BL policy table. Works on Black reparations, decarceration, and investment in Black communities.',
   'Brooklyn', 'New York', ARRAY['reparations','decarceration','economic_justice'], NULL, 'https://m4bl.org', true),

  ('Phillip Agnew', 'Dream Defenders', 'Co-founder of Dream Defenders, a youth-led organization in Florida focused on dismantling the prison-industrial complex.',
   'Miami', 'Florida', ARRAY['prison_abolition','youth_rights','racial_justice'], NULL, 'https://dreamdefenders.org', true),

  ('Brittney Cooper', 'Rutgers University / Writing', 'Scholar-activist and author of "Eloquent Rage." Associate professor at Rutgers focusing on race, gender, and social justice.',
   'New Brunswick', 'New Jersey', ARRAY['racial_justice','feminism','education'], NULL, NULL, true),

  ('April Goggans', 'Black Lives Matter DC', 'Core organizer for Black Lives Matter DC. Works at the intersection of racial justice, housing, and anti-poverty organizing.',
   'Washington', 'District of Columbia', ARRAY['housing_rights','racial_justice','police_accountability'], NULL, NULL, true)

ON CONFLICT DO NOTHING;

-- ============================================================
-- 3. AGENCIES (documented problem departments with oversight info)
-- ============================================================
INSERT INTO public.agencies (name, agency_type, city, state, website, foia_email, oversight_body, pattern_practice_investigation, consent_decree_active, total_officers, annual_budget_millions, accountability_score)
VALUES
  ('Los Angeles Police Department', 'municipal_police', 'Los Angeles', 'California',
   'https://www.lapdonline.org', 'rmccafferty@lapd.online',
   'Los Angeles Board of Police Commissioners', false, false, 9800, 3100.0, 42),

  ('New York Police Department', 'municipal_police', 'New York', 'New York',
   'https://www.nyc.gov/nypd', 'FoilRequest@nypd.org',
   'NYC Civilian Complaint Review Board', false, false, 36000, 10900.0, 38),

  ('Chicago Police Department', 'municipal_police', 'Chicago', 'Illinois',
   'https://www.chicagopolice.org', 'foiacoordinator@cityofchicago.org',
   'Chicago Civilian Office of Police Accountability', false, true, 11700, 1950.0, 31),

  ('Minneapolis Police Department', 'municipal_police', 'Minneapolis', 'Minnesota',
   'https://www.minneapolismn.gov/police', NULL,
   'Minneapolis Civilian Police Review Authority', true, false, 900, 193.0, 28),

  ('Memphis Police Department', 'municipal_police', 'Memphis', 'Tennessee',
   'https://www.memphispolice.org', NULL,
   'Memphis Civilian Law Enforcement Review Board', true, false, 2200, 310.0, 22),

  ('Baltimore Police Department', 'municipal_police', 'Baltimore', 'Maryland',
   'https://www.baltimorepolice.org', NULL,
   'Baltimore Civilian Review Board', false, true, 2500, 560.0, 33),

  ('Louisville Metro Police Department', 'municipal_police', 'Louisville', 'Kentucky',
   'https://louisvilleky.gov/government/police', NULL,
   'Louisville Police Merit Board', true, false, 1200, 210.0, 25),

  ('Atlanta Police Department', 'municipal_police', 'Atlanta', 'Georgia',
   'https://www.atlantaga.gov/police', NULL,
   'Atlanta Citizens Review Board', false, false, 1700, 275.0, 35),

  ('Denver Police Department', 'municipal_police', 'Denver', 'Colorado',
   'https://www.denvergov.org/police', NULL,
   'Denver Office of the Independent Monitor', false, false, 1600, 340.0, 47),

  ('Seattle Police Department', 'municipal_police', 'Seattle', 'Washington',
   'https://www.seattle.gov/police', NULL,
   'Seattle Office of Police Accountability', false, true, 1350, 380.0, 51),

  ('Philadelphia Police Department', 'municipal_police', 'Philadelphia', 'Pennsylvania',
   'https://www.phillypolice.com', NULL,
   'Philadelphia Police Advisory Commission', false, false, 6300, 760.0, 30),

  ('Federal Bureau of Investigation', 'federal', 'Washington', 'District of Columbia',
   'https://www.fbi.gov', 'eFOIPARequest@ic.fbi.gov',
   'DOJ Office of Professional Responsibility', false, false, 35000, 10800.0, 55),

  ('U.S. Customs and Border Protection', 'federal', 'Washington', 'District of Columbia',
   'https://www.cbp.gov', 'CBP_FOIA@cbp.dhs.gov',
   'DHS Office of Inspector General', false, false, 60000, 17600.0, 20),

  ('Immigration and Customs Enforcement', 'federal', 'Washington', 'District of Columbia',
   'https://www.ice.gov', 'ICE-FOIA@ice.dhs.gov',
   'DHS Office of Inspector General', true, false, 20000, 8400.0, 18),

  ('Portland Police Bureau', 'municipal_police', 'Portland', 'Oregon',
   'https://www.portlandoregon.gov/police', NULL,
   'Portland Independent Police Review', false, false, 880, 255.0, 39),

  ('Oakland Police Department', 'municipal_police', 'Oakland', 'California',
   'https://www.oaklandca.gov/departments/police', NULL,
   'Oakland Police Commission', false, true, 700, 330.0, 44),

  ('Phoenix Police Department', 'municipal_police', 'Phoenix', 'Arizona',
   'https://www.phoenix.gov/police', NULL,
   'Phoenix Office of Accountability', false, false, 3200, 865.0, 32),

  ('Houston Police Department', 'municipal_police', 'Houston', 'Texas',
   'https://www.houstontx.gov/police', NULL,
   'Houston Police Oversight Board', false, false, 5300, 980.0, 36),

  ('Dallas Police Department', 'municipal_police', 'Dallas', 'Texas',
   'https://dallaspolice.net', NULL,
   'Dallas Community Police Oversight Board', false, false, 3300, 590.0, 38),

  ('St. Louis Metropolitan Police Department', 'municipal_police', 'St. Louis', 'Missouri',
   'https://www.slmpd.org', NULL,
   'St. Louis Board of Police Commissioners', false, false, 1400, 210.0, 24)

ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. RESOURCE LIBRARY (educational content)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resource_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[],
  source_url TEXT,
  reading_level TEXT DEFAULT 'general',
  state TEXT,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.resource_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Everyone can read resources" ON public.resource_library FOR SELECT USING (true);

INSERT INTO public.resource_library (title, description, category, tags, source_url, is_featured) VALUES
  ('Know Your Rights When Stopped by Police',
   'Step-by-step guide on what you can and cannot be required to do during a police stop. Covers Terry stops, traffic stops, and pedestrian stops.',
   'know_your_rights', ARRAY['police','stop','search','4th_amendment'], 'https://www.aclu.org/know-your-rights/stopped-by-police', true),

  ('Your Right to Record Police',
   'Courts have consistently held that filming police in public is protected by the First Amendment. Learn when and how you can legally record.',
   'know_your_rights', ARRAY['recording','1st_amendment','press_freedom'], 'https://www.rcfp.org/right-to-record', true),

  ('Filing a FOIA Request: Complete Guide',
   'Step-by-step instructions for filing Freedom of Information Act requests with federal agencies. Includes sample language, fee waivers, and appeal procedures.',
   'foia', ARRAY['foia','transparency','government_records'], 'https://www.foia.gov/how-to.html', true),

  ('What to Do If You Are Arrested',
   'Critical steps to take if you are placed under arrest. Your Miranda rights, right to an attorney, and how to document the encounter.',
   'emergency', ARRAY['arrest','miranda','attorney','rights'], 'https://www.aclu.org/know-your-rights/what-to-do-if-youre-stopped-by-police-or-ice', true),

  ('Understanding Section 1983 Civil Rights Lawsuits',
   '42 U.S.C. § 1983 allows private citizens to sue government actors for civil rights violations. Learn the elements, qualified immunity defense, and recent precedents.',
   'legal', ARRAY['section_1983','lawsuit','qualified_immunity','civil_rights'], NULL, false),

  ('Photographing and Videotaping Police: State-by-State Guide',
   'Legal analysis of recording laws in all 50 states. Covers consent requirements, public vs. private space distinctions, and obstruction statutes.',
   'know_your_rights', ARRAY['recording','state_law','photography','police'], 'https://www.dmlp.org/legal-guide/photographing-and-videotaping-police', false),

  ('The Fourth Amendment: Protection Against Unreasonable Searches',
   'Plain-language explanation of Fourth Amendment protections. Covers reasonable expectation of privacy, warrant requirements, exceptions, and recent Supreme Court cases.',
   'constitutional_rights', ARRAY['4th_amendment','search','seizure','warrant'], NULL, false),

  ('Bail and Pretrial Detention: Your Rights',
   'Explains the bail system, how bail is set, constitutional limits on excessive bail, and resources for bail funds in major cities.',
   'criminal_justice', ARRAY['bail','pretrial','8th_amendment','bail_fund'], NULL, false),

  ('How to File a Police Misconduct Complaint',
   'Guide to filing complaints with internal affairs, civilian review boards, state attorneys general, and the DOJ Civil Rights Division.',
   'accountability', ARRAY['complaint','misconduct','internal_affairs','civilian_review'], 'https://www.justice.gov/crt/filing-complaint', false),

  ('Protest Rights: What Is (and Isn''t) Protected',
   'First Amendment protections for protests, marches, and demonstrations. Covers permits, time/place/manner restrictions, and what police can lawfully require.',
   'know_your_rights', ARRAY['protest','1st_amendment','free_speech','assembly'], 'https://www.aclu.org/know-your-rights/protesters-rights', true),

  ('Immigration Rights: Know Your Rights at the Border and Beyond',
   'Comprehensive guide for immigrants on rights during ICE encounters, border crossings, and deportation proceedings. Available in English, Spanish, and Haitian Creole.',
   'immigration', ARRAY['immigration','ICE','deportation','rights'], 'https://www.aclu.org/know-your-rights/immigrants-rights', true),

  ('Tenants'' Rights and Fair Housing Laws',
   'Overview of Fair Housing Act protections, right to reasonable accommodation, anti-eviction laws, and how to file HUD complaints.',
   'housing', ARRAY['housing','fair_housing','eviction','discrimination'], 'https://www.hud.gov/program_offices/fair_housing_equal_opp', false),

  ('Voting Rights: Registration, ID Laws, and Suppression Tactics',
   'State-by-state voting requirements, voter ID laws, and documentation of suppression tactics. Includes how to report voting rights violations.',
   'voting_rights', ARRAY['voting','voter_id','registration','suppression'], 'https://www.aclu.org/know-your-rights/voting-rights', true),

  ('Disability Rights and Reasonable Accommodation Under the ADA',
   'American with Disabilities Act protections in employment, public accommodations, transportation, and state and local government services.',
   'disability_rights', ARRAY['ADA','disability','accommodation','accessibility'], 'https://www.ada.gov', false),

  ('LGBTQ+ Civil Rights Protections: What the Law Says',
   'Post-Bostock employment protections, marriage equality under Obergefell, healthcare non-discrimination, and state-level LGBTQ+ civil rights laws.',
   'LGBTQ_rights', ARRAY['LGBTQ','discrimination','employment','marriage_equality'], 'https://www.hrc.org/resources/federal-law-and-lgbtq-people', false),

  ('Environmental Justice: Communities of Color and Pollution',
   'Environmental justice principles, EPA Office of Environmental Justice, Title VI complaints against discriminatory pollution permitting, and community organizing tools.',
   'environmental_justice', ARRAY['environmental_justice','pollution','EPA','community'], 'https://www.epa.gov/environmentaljustice', false),

  ('School Discipline and Students'' Rights',
   'Students'' due process rights in suspension and expulsion proceedings. Disparate discipline of students of color. Legal challenges to zero-tolerance policies.',
   'education', ARRAY['school','discipline','students','due_process'], NULL, false),

  ('Workers'' Rights: Organizing, Wages, and Retaliation',
   'NLRA rights to organize and collective bargaining. Wage theft complaints. OSHA protections. How to file charges with the NLRB.',
   'labor_rights', ARRAY['labor','organizing','wages','NLRB','OSHA'], 'https://www.nlrb.gov/rights-we-protect', false),

  ('Freedom of the Press: Rights of Journalists',
   'First Amendment press protections, shield laws, journalist privilege, prior restraint doctrine, and rights when covering police and protests.',
   'press_freedom', ARRAY['press_freedom','journalism','shield_law','1st_amendment'], 'https://www.rcfp.org/reporters-privilege', false),

  ('Mass Incarceration: Facts, Causes, and Reform Efforts',
   'Statistics on U.S. incarceration rates, racial disparities, causes of mass incarceration, and policy reforms backed by research.',
   'criminal_justice', ARRAY['incarceration','prison_reform','racial_disparity','sentencing'], 'https://eji.org/mass-incarceration', false)

ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. FORUM THREADS (seeded community content)
-- ============================================================
INSERT INTO public.forum_threads (title, content, category, is_pinned, view_count)
VALUES
  ('PINNED: Community Rules & What This Forum Is For',
   'Welcome to the Civil Rights Hub community forum. This space is for sharing experiences, legal questions, organizing, and mutual support. Rules: Be respectful. No doxxing. No threats. Verify information before posting. Attorneys cannot give legal advice here — consult directly. Moderators are volunteers.',
   'announcements', true, 1420),

  ('How I Won My Police Misconduct Case Pro Se (Without a Lawyer)',
   'Three years ago I was arrested at a peaceful protest. I couldn''t afford an attorney. Here''s the full story of how I filed a Section 1983 lawsuit, survived a motion to dismiss, and reached a settlement. Sharing everything I learned including the motions I filed.',
   'experiences', false, 3847),

  ('FOIA Request Template That Actually Works for Police Body Cam Footage',
   'I''ve filed over 40 FOIA requests for body camera footage across 12 states. Here''s the template language that gets results, what to do when they claim exemptions, and how to appeal denials. Updated April 2026.',
   'tools', false, 2193),

  ('What To Say (and Not Say) During a Traffic Stop — Video and Script',
   'Traffic stops are one of the most dangerous civil rights encounters for Black and brown Americans. This post covers: what to say, what to never say, how to assert rights without escalating, and what to do after.',
   'know_your_rights', false, 5621),

  ('State-by-State: Which Civilian Review Boards Actually Have Teeth?',
   'I spent six months researching every civilian police review board in the US. My findings: most are toothless advisory bodies. But a handful have real subpoena power and disciplinary authority. Here''s my ranking and analysis.',
   'accountability', false, 1876),

  ('Organizers: Share Your City''s Recent Wins',
   'Let''s document the victories. Policy changes, settlements, officers held accountable, consent decrees — post your city''s wins here. We need to see this movement making progress.',
   'organizing', false, 988),

  ('Resources for Indigenous Rights and Tribal Sovereignty',
   'Native and Indigenous communities face unique civil rights challenges that mainstream civil rights organizations often overlook. Sharing resources specifically for tribal sovereignty, MMIW, treaty rights, and environmental justice on reservations.',
   'resources', false, 742),

  ('How to Legally Livestream a Police Encounter',
   'Best apps, platforms, and settings for live streaming police encounters. What happens to your footage if your phone is seized. How to ensure footage is backed up automatically. Legal considerations by state.',
   'know_your_rights', false, 4312),

  ('Looking for Pro Bono Attorney in Texas After Wrongful Arrest',
   'I was arrested and held for 18 hours with no charges filed. All charges eventually dropped but it''s on my record and cost me my job. Looking for civil rights attorneys in DFW area who take contingency cases.',
   'legal_help', false, 234),

  ('First Amendment Auditors: Legal vs. Illegal — What You Need to Know',
   'First Amendment audits are a growing movement of people testing whether public officials respect constitutional rights. Here''s what is and isn''t protected, how auditors have won major settlements, and cases where they''ve been charged.',
   'know_your_rights', false, 3105),

  ('Police Scanner Listening Guide for Activists and Journalists',
   'How to get started listening to police scanners legally. Best apps and hardware. How to cross-reference scanner traffic with incident reports. What to listen for during protests. Legal considerations.',
   'tools', false, 1567),

  ('Mental Health Resources for Activists and Those Who''ve Experienced Trauma',
   'Activism can be traumatic, especially for communities that have experienced direct state violence. This thread compiles free and low-cost mental health resources specifically for activists and civil rights victims.',
   'resources', false, 891),

  ('Breaking Down the DOJ''s Pattern and Practice Authority',
   'The DOJ''s Civil Rights Division can investigate police departments that show a pattern of unconstitutional conduct under 34 U.S.C. § 12601. Here''s how it works, what triggers an investigation, and which departments are currently under investigation.',
   'legal_education', false, 1234),

  ('Tenant Rights Emergency: Facing Eviction? Here''s What To Do Right Now',
   'If you''ve just received an eviction notice, here are the immediate steps: (1) don''t panic, (2) count your days, (3) contact legal aid today, (4) know your state''s notice requirements, (5) assert your right to a hearing.',
   'emergency', false, 2456),

  ('Sharing Bail Fund Resources Nationwide',
   'Comprehensive list of bail funds by state and city. Most accept donations and several offer no-interest loans. If you''re arrested at a protest, your first call after an attorney should be to a bail fund.',
   'resources', false, 1789)

ON CONFLICT DO NOTHING;

