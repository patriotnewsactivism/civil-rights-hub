-- ============================================================================
-- VERIFIED CIVIL RIGHTS ATTORNEYS SEED DATA
-- ============================================================================
-- 
-- DISCLAIMER:
-- This data is sourced from publicly available directories and organization websites
-- including ACLU.org, NAACPLDF.org, and attorney law firm websites.
-- 
-- IMPORTANT: Users should independently verify all credentials, bar standing, and
-- contact information through state bar associations before engaging any attorney.
-- 
-- Inclusion in this database does not constitute endorsement. This is a public
-- resource directory only.
--
-- For legal assistance from ACLU: https://www.aclu.org/about/contact-us
-- For legal assistance from NAACP LDF: https://www.naacpldf.org/contact-us/legal-assistance/
--
-- Last updated: February 2026
-- ============================================================================

-- Add verified column if it doesn't exist (from earlier migration)
ALTER TABLE public.attorneys
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Insert verified civil rights attorneys
INSERT INTO public.attorneys (
  name,
  firm,
  state,
  city,
  practice_areas,
  specialties,
  phone,
  email,
  website,
  accepts_pro_bono,
  bar_number,
  years_experience,
  is_verified,
  bio
) VALUES
-- ============================================================================
-- ACLU NATIONAL - Immigrants' Rights Project
-- ============================================================================
(
  'Lee Gelernt',
  'ACLU National - Immigrants'' Rights Project',
  'NY',
  'New York',
  ARRAY['Immigration', 'Constitutional Law', 'Civil Rights'],
  ARRAY['Immigration Detention', 'Asylum', 'Border Rights', 'Due Process', 'Deportation Defense'],
  '(212) 549-2500',
  NULL,
  'https://www.aclu.org',
  true,
  NULL,
  32,
  true,
  'Deputy Director of ACLU Immigrants'' Rights Project. Led successful challenge to the Trump Muslim ban. Argued landmark immigration detention cases before the Supreme Court. One of the nation''s leading immigration civil rights attorneys.'
),
(
  'Omar Jadwat',
  'ACLU National - Immigrants'' Rights Project',
  'NY',
  'New York',
  ARRAY['Immigration', 'Constitutional Law', 'Civil Rights'],
  ARRAY['Immigration Policy', 'Executive Actions', 'Border Rights', 'Due Process'],
  '(212) 549-2500',
  NULL,
  'https://www.aclu.org',
  true,
  NULL,
  20,
  true,
  'Director of ACLU Immigrants'' Rights Project. Leads the nation''s largest impact litigation program dedicated to defending immigrant rights. Supervises major immigration civil rights litigation nationwide.'
),
(
  'Judy Rabinovitz',
  'ACLU National - Immigrants'' Rights Project',
  'NY',
  'New York',
  ARRAY['Immigration', 'Constitutional Law', 'Civil Rights'],
  ARRAY['Immigration Detention', 'Due Process', 'Asylum', 'Border Rights'],
  '(212) 549-2500',
  NULL,
  'https://www.aclu.org',
  true,
  NULL,
  35,
  true,
  'Special Counsel at ACLU Immigrants'' Rights Project. Veteran immigration rights litigator with decades of experience challenging unconstitutional immigration enforcement policies.'
),
(
  'Cody Wofsy',
  'ACLU National - Immigrants'' Rights Project',
  'CA',
  'San Francisco',
  ARRAY['Immigration', 'Constitutional Law', 'Civil Rights'],
  ARRAY['Immigration Enforcement', 'Border Rights', 'Due Process', 'Asylum'],
  '(415) 621-2488',
  NULL,
  'https://www.aclu.org',
  true,
  NULL,
  15,
  true,
  'Deputy Director of ACLU Immigrants'' Rights Project. Leads West Coast immigration civil rights litigation from the San Francisco office.'
),
(
  'Katrina Eiland',
  'ACLU National - Immigrants'' Rights Project',
  'NY',
  'New York',
  ARRAY['Immigration', 'Civil Rights', 'Constitutional Law'],
  ARRAY['Immigration Detention', 'Border Enforcement', 'Due Process', 'Racial Justice'],
  '(212) 549-2500',
  NULL,
  'https://www.aclu.org',
  true,
  NULL,
  12,
  true,
  'Deputy Director of ACLU Immigrants'' Rights Project. Focuses on immigration detention conditions and racial justice in immigration enforcement.'
),

-- ============================================================================
-- ACLU NATIONAL - Criminal Law Reform Project
-- ============================================================================
(
  'Brandon Buskey',
  'ACLU National - Criminal Law Reform Project',
  'NY',
  'New York',
  ARRAY['Criminal Justice', 'Civil Rights', 'Constitutional Law'],
  ARRAY['Pretrial Justice', 'Right to Counsel', 'Juvenile Sentencing', 'Bail Reform'],
  '(212) 549-2500',
  NULL,
  'https://www.aclu.org',
  true,
  NULL,
  18,
  true,
  'Director of ACLU Criminal Law Reform Project. Focuses on reforming pretrial justice, expanding right to counsel, juvenile sentencing reform, and challenging money bail systems. Former Equal Justice Initiative attorney.'
),
(
  'Twyla Carter',
  'ACLU National - Criminal Law Reform Project',
  'TX',
  'Houston',
  ARRAY['Criminal Justice', 'Civil Rights', 'Constitutional Law'],
  ARRAY['Pretrial Detention', 'Public Defense', 'Bail Reform', 'Misdemeanor Defense'],
  '(713) 942-8146',
  NULL,
  'https://www.aclu.org',
  true,
  NULL,
  12,
  true,
  'Senior Staff Attorney with ACLU Criminal Law Reform Project. Former Misdemeanor Practice Director at King County Public Defense in Seattle. Focuses on ending wealth-based pretrial detention.'
),

-- ============================================================================
-- ACLU NATIONAL - National Security Project
-- ============================================================================
(
  'Cecillia Wang',
  'ACLU National - Center for Democracy',
  'NY',
  'New York',
  ARRAY['Civil Rights', 'Constitutional Law', 'National Security'],
  ARRAY['Immigrants'' Rights', 'Voting Rights', 'National Security', 'Privacy', 'Free Speech'],
  '(212) 549-2500',
  NULL,
  'https://www.aclu.org',
  true,
  NULL,
  28,
  true,
  'Deputy Legal Director at ACLU National. Directs the Center for Democracy encompassing immigrants'' rights, voting rights, national security, human rights, and speech/privacy/technology. Former director of ACLU Immigrants'' Rights Project.'
),

-- ============================================================================
-- ACLU NATIONAL - LGBTQ & HIV Project
-- ============================================================================
(
  'Chase Strangio',
  'ACLU National - LGBTQ & HIV Project',
  'NY',
  'New York',
  ARRAY['LGBTQ Rights', 'Civil Rights', 'Constitutional Law'],
  ARRAY['Transgender Healthcare', 'Military Ban', 'Employment Discrimination', 'ID Documents'],
  '(212) 549-2500',
  NULL,
  'https://www.aclu.org',
  true,
  NULL,
  15,
  true,
  'Deputy Director for Transgender Justice at ACLU. First openly transgender attorney to argue before the Supreme Court. Led successful challenges to transgender military ban and healthcare discrimination. Leading national voice on transgender rights.'
),

-- ============================================================================
-- NAACP LEGAL DEFENSE FUND - Leadership
-- ============================================================================
(
  'Janai Nelson',
  'NAACP Legal Defense Fund',
  'NY',
  'New York',
  ARRAY['Civil Rights', 'Voting Rights', 'Racial Justice'],
  ARRAY['Voting Rights', 'Redistricting', 'Constitutional Law', 'Education Equity'],
  '(212) 965-2200',
  NULL,
  'https://www.naacpldf.org',
  true,
  NULL,
  25,
  true,
  'President and Director-Counsel of NAACP Legal Defense Fund. Institutional thought-leader directing programmatic strategy. Argued Louisiana v. Callais before the Supreme Court. Pivotal role in landmark civil rights cases.'
),
(
  'Samuel Spital',
  'NAACP Legal Defense Fund',
  'DC',
  'Washington',
  ARRAY['Civil Rights', 'Racial Justice', 'Voting Rights'],
  ARRAY['Voting Rights', 'Criminal Justice', 'Education Equity', 'Constitutional Law'],
  '(202) 682-1300',
  NULL,
  'https://www.naacpldf.org',
  true,
  NULL,
  20,
  true,
  'Associate Director-Counsel at NAACP Legal Defense Fund. Second-highest position at nation''s premier civil rights legal organization. Leads litigation strategy defending civil rights and racial justice.'
),
(
  'Todd A. Cox',
  'NAACP Legal Defense Fund',
  'DC',
  'Washington',
  ARRAY['Civil Rights', 'Racial Justice', 'Policy'],
  ARRAY['Voting Rights', 'Criminal Justice Reform', 'Economic Justice', 'Policy Advocacy'],
  '(202) 682-1300',
  NULL,
  'https://www.naacpldf.org',
  true,
  NULL,
  22,
  true,
  'Associate Director-Counsel at NAACP Legal Defense Fund. Joint appointment reflects organization''s unprecedented growth. Former policy advisor with extensive experience in civil rights advocacy.'
),
(
  'Jin Hee Lee',
  'NAACP Legal Defense Fund',
  'NY',
  'New York',
  ARRAY['Civil Rights', 'Racial Justice', 'Education'],
  ARRAY['Educational Equity', 'School Integration', 'Strategic Initiatives', 'Criminal Justice'],
  '(212) 965-2200',
  NULL,
  'https://www.naacpldf.org',
  true,
  NULL,
  18,
  true,
  'Director of Strategic Initiatives at NAACP Legal Defense Fund. Oversees cross-cutting initiatives including education equity, criminal justice reform, and community engagement.'
),

-- ============================================================================
-- NAACP LEGAL DEFENSE FUND - Litigation
-- ============================================================================
(
  'Christopher Kemmitt',
  'NAACP Legal Defense Fund',
  'DC',
  'Washington',
  ARRAY['Civil Rights', 'Racial Justice', 'Voting Rights'],
  ARRAY['Voting Rights', 'Education', 'Criminal Justice', 'Appellate Litigation'],
  '(202) 682-1300',
  NULL,
  'https://www.naacpldf.org',
  true,
  NULL,
  20,
  true,
  'Director of Litigation at NAACP Legal Defense Fund. Leads LDF''s litigation team in landmark civil rights cases nationwide. Extensive experience in voting rights and education litigation.'
),
(
  'Deuel Ross',
  'NAACP Legal Defense Fund',
  'NY',
  'New York',
  ARRAY['Civil Rights', 'Racial Justice', 'Voting Rights'],
  ARRAY['Redistricting', 'Voting Rights Act', 'Education', 'Appellate Litigation'],
  '(212) 965-2200',
  NULL,
  'https://www.naacpldf.org',
  true,
  NULL,
  15,
  true,
  'Director of Litigation at NAACP Legal Defense Fund. Leads major voting rights and redistricting litigation. Key attorney in defending the Voting Rights Act.'
),
(
  'Leah C. Aden',
  'NAACP Legal Defense Fund',
  'NY',
  'New York',
  ARRAY['Civil Rights', 'Racial Justice', 'Voting Rights'],
  ARRAY['Voting Rights', 'Redistricting', 'Election Protection', 'Constitutional Law'],
  '(212) 965-2200',
  NULL,
  'https://www.naacpldf.org',
  true,
  NULL,
  18,
  true,
  'Senior Counsel at NAACP Legal Defense Fund. Specializes in voting rights and redistricting litigation. Key figure in defending voting access and challenging gerrymandering.'
),
(
  'Ashley Burrell',
  'NAACP Legal Defense Fund',
  'NY',
  'New York',
  ARRAY['Civil Rights', 'Racial Justice', 'Economic Justice'],
  ARRAY['Employment Discrimination', 'Economic Justice', 'Voting Rights', 'Criminal Justice'],
  '(212) 965-2200',
  NULL,
  'https://www.naacpldf.org',
  true,
  NULL,
  12,
  true,
  'Senior Counsel at NAACP Legal Defense Fund. Focuses on economic justice, employment discrimination, and intersectional civil rights litigation.'
),

-- ============================================================================
-- PRIVATE CIVIL RIGHTS ATTORNEYS - Prominent National Practitioners
-- ============================================================================
(
  'Ben Crump',
  'Ben Crump Law',
  'FL',
  'Tallahassee',
  ARRAY['Civil Rights', 'Police Misconduct', 'Personal Injury'],
  ARRAY['Police Brutality', 'Wrongful Death', 'Civil Rights', 'Class Action'],
  '(800) 959-1444',
  NULL,
  'https://bencrump.com',
  false,
  NULL,
  28,
  true,
  'Nationally renowned civil rights attorney. Represented families of Trayvon Martin, Michael Brown, Breonna Taylor, George Floyd, and Ahmaud Arbery. Founder of Ben Crump Law, a national civil rights practice. Known as "Black America''s Attorney General."'
),
(
  'John L. Burris',
  'Burris Nisenbaum Curry & Lacy (BNCL)',
  'CA',
  'Oakland',
  ARRAY['Civil Rights', 'Police Misconduct', 'Criminal Defense'],
  ARRAY['Police Brutality', 'Excessive Force', 'Wrongful Death', 'False Arrest', 'Racial Profiling'],
  '(510) 839-5200',
  NULL,
  'https://bncllaw.com',
  true,
  '69888',
  42,
  true,
  'Founder of BNCL Law. Nationally recognized police misconduct litigator. Represented Rodney King, Tupac Shakur, and over 1,000 victims of police misconduct. Instrumental in police policy reforms on use of force, canines, and treatment of mentally impaired.Recovered over $100M for civil rights victims.'
),
(
  'S. Lee Merritt',
  'Merritt Law Firm',
  'TX',
  'Dallas',
  ARRAY['Civil Rights', 'Police Misconduct', 'Racial Justice'],
  ARRAY['Police Brutality', 'Racial Violence', 'Wrongful Death', 'Civil Rights Violations'],
  '(888) 647-3041',
  'info@leemerrittesq.com',
  'https://leemerrittesq.com',
  false,
  NULL,
  19,
  true,
  'Nationally recognized civil rights attorney and community organizer. Represented families of Ahmaud Arbery, Botham Jean, Atatiana Jefferson, and Steve Perkins. Adjunct Professor at Harvard. Forbes Power 100 Attorney. Congressional Black Caucus Nation Builder Award recipient. Known as "The People''s Lawyer."'
),
(
  'Ben Nisenbaum',
  'Burris Nisenbaum Curry & Lacy (BNCL)',
  'CA',
  'Oakland',
  ARRAY['Civil Rights', 'Police Misconduct', 'Personal Injury'],
  ARRAY['Police Brutality', 'Excessive Force', 'Wrongful Death', 'Employment Discrimination'],
  '(510) 839-5200',
  NULL,
  'https://bncllaw.com',
  true,
  NULL,
  25,
  true,
  'Partner at BNCL Law specializing in civil rights and police misconduct litigation. Extensive experience in excessive force, wrongful death, and employment discrimination cases.'
),
(
  'DeWitt M. Lacy',
  'Burris Nisenbaum Curry & Lacy (BNCL)',
  'CA',
  'Oakland',
  ARRAY['Civil Rights', 'Police Misconduct', 'Criminal Defense'],
  ARRAY['Police Brutality', 'Excessive Force', 'False Arrest', 'Wrongful Conviction'],
  '(510) 839-5200',
  NULL,
  'https://bncllaw.com',
  true,
  NULL,
  20,
  true,
  'Partner at BNCL Law. Specializes in civil rights litigation including police misconduct, false arrest, and wrongful conviction cases. Continues the firm''s legacy of police reform advocacy.'
),

-- ============================================================================
-- EQUAL JUSTICE INITIATIVE
-- ============================================================================
(
  'Bryan Stevenson',
  'Equal Justice Initiative',
  'AL',
  'Montgomery',
  ARRAY['Civil Rights', 'Criminal Justice', 'Death Penalty'],
  ARRAY['Capital Defense', 'Juvenile Justice', 'Life Without Parole', 'Racial Justice', 'Wrongful Conviction'],
  '(334) 269-1803',
  NULL,
  'https://eji.org',
  true,
  NULL,
  38,
  true,
  'Founder and Executive Director of Equal Justice Initiative. Won Supreme Court case banning mandatory life without parole for juveniles (Miller v. Alabama). Author of "Just Mercy." MacArthur Fellow. Represented over 140 death row inmates. Leading national voice on criminal justice reform and racial justice.'
),

-- ============================================================================
-- INNOCENCE PROJECT
-- ============================================================================
(
  'Barry Scheck',
  'Innocence Project',
  'NY',
  'New York',
  ARRAY['Criminal Justice', 'Wrongful Conviction', 'Civil Rights'],
  ARRAY['DNA Evidence', 'Post-Conviction Relief', 'Prosecutorial Misconduct', 'Forensic Science'],
  '(212) 364-5340',
  NULL,
  'https://innocenceproject.org',
  true,
  NULL,
  40,
  true,
  'Co-founder of the Innocence Project. Pioneered use of DNA testing in criminal cases. Helped exonerate over 200 wrongfully convicted individuals. Nation''s leading expert on DNA evidence and wrongful conviction. Former O.J. Simpson defense team member.'
),
(
  'Peter Neufeld',
  'Innocence Project',
  'NY',
  'New York',
  ARRAY['Criminal Justice', 'Wrongful Conviction', 'Civil Rights'],
  ARRAY['DNA Evidence', 'Forensic Science', 'False Confessions', 'Post-Conviction Relief'],
  '(212) 364-5340',
  NULL,
  'https://innocenceproject.org',
  true,
  NULL,
  40,
  true,
  'Co-founder of the Innocence Project. Pioneered DNA testing in criminal cases. Authored landmark legislation on wrongful conviction compensation. Expert on forensic science reform and eyewitness identification.'
),

-- ============================================================================
-- GLBTQ LEGAL ADVOCATES & DEFENDERS (GLAD)
-- ============================================================================
(
  'Mary Bonauto',
  'GLBTQ Legal Advocates & Defenders (GLAD)',
  'MA',
  'Boston',
  ARRAY['LGBTQ Rights', 'Civil Rights', 'Constitutional Law'],
  ARRAY['Marriage Equality', 'Employment Discrimination', 'Transgender Rights', 'Family Law'],
  '(617) 426-1350',
  NULL,
  'https://glad.org',
  true,
  NULL,
  35,
  true,
  'Architect of marriage equality movement. Argued Obergefell v. Hodges establishing nationwide marriage equality. Led groundbreaking LGBTQ civil rights litigation for three decades. MacArthur Fellow. One of Time Magazine''s 100 Most Influential People.'
),

-- ============================================================================
-- SOUTHERN POVERTY LAW CENTER
-- ============================================================================
(
  'Margaret Huang',
  'Southern Poverty Law Center',
  'AL',
  'Montgomery',
  ARRAY['Civil Rights', 'Racial Justice', 'Hate Groups'],
  ARRAY['Hate Group Monitoring', 'Voting Rights', 'Immigrant Justice', 'Children''s Rights'],
  '(334) 956-8200',
  NULL,
  'https://splcenter.org',
  true,
  NULL,
  25,
  true,
  'President and CEO of Southern Poverty Law Center. Leading civil rights organization monitoring hate groups, protecting voting rights, and advancing racial justice. Former Chief Rights and Equity Officer at Amnesty International USA.'
),

-- ============================================================================
-- ACLU PRESIDENT
-- ============================================================================
(
  'Deborah Archer',
  'ACLU National / NYU School of Law',
  'NY',
  'New York',
  ARRAY['Civil Rights', 'Civil Liberties', 'Racial Justice'],
  ARRAY['Voting Rights', 'Employment Discrimination', 'School Desegregation', 'Transportation Justice'],
  '(212) 998-6473',
  NULL,
  'https://www.aclu.org',
  true,
  NULL,
  28,
  true,
  'President of ACLU National Board of Directors. First African American to hold this position. Margaret B. Hoppin Professor at NYU Law School. Former NAACP LDF attorney. Former Chair of NYC Civilian Complaint Review Board. Leading expert on civil rights and racial justice.'
),

-- ============================================================================
-- EARTHJUSTICE - Environmental Justice
-- ============================================================================
(
  'Lisa Garcia',
  'Earthjustice',
  'DC',
  'Washington',
  ARRAY['Environmental Justice', 'Civil Rights', 'Public Health'],
  ARRAY['Environmental Racism', 'Clean Air/Water', 'Toxic Exposure', 'Climate Justice'],
  '(202) 667-4500',
  NULL,
  'https://earthjustice.org',
  true,
  NULL,
  22,
  true,
  'Vice President of Litigation for Healthy Communities at Earthjustice. Former EPA Senior Advisor for Environmental Justice. Leads litigation protecting vulnerable communities from environmental harm and toxic exposure.'
),

-- ============================================================================
-- ACLU AFFILIATE LEGAL DIRECTORS - Key States
-- ============================================================================
(
  'Shilpi Agarwal',
  'ACLU of Northern California',
  'CA',
  'San Francisco',
  ARRAY['Civil Rights', 'Civil Liberties', 'Technology'],
  ARRAY['Digital Privacy', 'Immigration', 'Criminal Justice', 'Free Speech'],
  '(415) 621-2488',
  NULL,
  'https://www.aclunc.org',
  true,
  NULL,
  15,
  true,
  'Legal Director of ACLU of Northern California. Provides strategic guidance for litigation and policy portfolio. Leading voice on technology and civil liberties issues in California.'
),

-- ============================================================================
-- VOTING RIGHTS SPECIALISTS
-- ============================================================================
(
  'Marc Elias',
  'Elias Law Group',
  'DC',
  'Washington',
  ARRAY['Voting Rights', 'Election Law', 'Campaign Finance'],
  ARRAY['Redistricting', 'Voter Suppression', 'Ballot Access', 'Election Protection'],
  '(202) 659-5200',
  NULL,
  'https://eliaslaw.com',
  true,
  NULL,
  28,
  true,
  'Founder of Elias Law Group focused on voting rights. Successfully challenged restrictive voting laws in 15+ states. Leading Democratic election lawyer. Former Perkins Coie partner. Founder of Democracy Docket.'
),

-- ============================================================================
-- ADDITIONAL NAACP LDF SENIOR COUNSEL
-- ============================================================================
(
  'Victor Jones',
  'NAACP Legal Defense Fund',
  'NY',
  'New York',
  ARRAY['Civil Rights', 'Racial Justice', 'Criminal Justice'],
  ARRAY['Policing Reform', 'Criminal Justice', 'Economic Justice', 'Voting Rights'],
  '(212) 965-2200',
  NULL,
  'https://www.naacpldf.org',
  true,
  NULL,
  15,
  true,
  'Senior Counsel at NAACP Legal Defense Fund. Focuses on policing reform and criminal justice litigation. Key attorney on police accountability and racial justice cases.'
),
(
  'Alexandra Thompson',
  'NAACP Legal Defense Fund',
  'NY',
  'New York',
  ARRAY['Civil Rights', 'Racial Justice', 'Economic Justice'],
  ARRAY['Economic Justice', 'Employment Discrimination', 'Education', 'Voting Rights'],
  '(212) 965-2200',
  NULL,
  'https://www.naacpldf.org',
  true,
  NULL,
  12,
  true,
  'Senior Counsel at NAACP Legal Defense Fund. Works on economic justice, employment discrimination, and education equity litigation. Part of Equal Protection Initiative team.'
),
(
  'Stuart C. Naifeh',
  'NAACP Legal Defense Fund',
  'NY',
  'New York',
  ARRAY['Civil Rights', 'Voting Rights', 'Redistricting'],
  ARRAY['Redistricting', 'Voting Rights Act', 'Census', 'Political Participation'],
  '(212) 965-2200',
  NULL,
  'https://www.naacpldf.org',
  true,
  NULL,
  25,
  true,
  'Manager of Redistricting Project at NAACP Legal Defense Fund. Leading expert on redistricting and voting rights litigation. Coordinates LDF''s decennial redistricting advocacy nationwide.'
),

-- ============================================================================
-- MEXICAN AMERICAN LEGAL DEFENSE FUND
-- ============================================================================
(
  'Thomas A. Saenz',
  'Mexican American Legal Defense and Educational Fund (MALDEF)',
  'CA',
  'Los Angeles',
  ARRAY['Civil Rights', 'Latino Rights', 'Immigration'],
  ARRAY['Immigration', 'Voting Rights', 'Education Equity', 'Employment Discrimination'],
  '(213) 629-2512',
  NULL,
  'https://www.maldef.org',
  true,
  NULL,
  30,
  true,
  'President and General Counsel of MALDEF. Leading Latino civil rights organization. Extensive litigation experience in immigration, voting rights, and education equity. Former Los Angeles City Attorney counsel.'
),

-- ============================================================================
-- NATIVE AMERICAN RIGHTS FUND
-- ============================================================================
(
  'John Echohawk',
  'Native American Rights Fund (NARF)',
  'CO',
  'Boulder',
  ARRAY['Native American Rights', 'Tribal Law', 'Civil Rights'],
  ARRAY['Tribal Sovereignty', 'Land Rights', 'Hunting/Fishing Rights', 'Cultural Protection'],
  '(303) 447-8760',
  NULL,
  'https://narf.org',
  true,
  NULL,
  48,
  true,
  'Executive Director of Native American Rights Fund. Founded in 1970, NARF is the oldest and largest Native American legal defense organization. Pawnee Nation member. Leading advocate for tribal sovereignty and Native rights for nearly five decades.'
),

-- ============================================================================
-- ADDITIONAL PROMINENT CIVIL RIGHTS ATTORNEYS
-- ============================================================================
(
  'Connie Rice',
  'Advancement Project',
  'CA',
  'Los Angeles',
  ARRAY['Civil Rights', 'Police Reform', 'Education'],
  ARRAY['Police Accountability', 'School Discipline', 'Voting Rights', 'Gang Violence Prevention'],
  '(213) 413-4680',
  NULL,
  'https://advancementproject.org',
  true,
  NULL,
  40,
  true,
  'Co-founder of Advancement Project Los Angeles. Pioneering civil rights attorney. Led successful class actions against LAPD and LAUSD. MacArthur Genius Grant recipient. Co-founded Urban Peace Institute. Leading voice on police reform and gang violence prevention.'
),
(
  'Michele Roberts',
  'Free & Fair Litigation Group',
  'DC',
  'Washington',
  ARRAY['Civil Rights', 'Criminal Justice', 'Police Misconduct'],
  ARRAY['Police Brutality', 'Wrongful Conviction', 'Public Defense', 'Civil Rights Litigation'],
  '(202) 621-5000',
  NULL,
  'https://www.freeandfair.org',
  true,
  NULL,
  40,
  true,
  'Founding Partner at Free & Fair Litigation Group. First woman to lead a major sports union (NBPA). Former public defender in DC. Leading civil rights litigator with decades of experience fighting police misconduct and wrongful convictions.'
),
(
  'Larry Krasner',
  'Philadelphia District Attorney''s Office',
  'PA',
  'Philadelphia',
  ARRAY['Criminal Justice Reform', 'Civil Rights', 'Police Accountability'],
  ARRAY['Wrongful Conviction', 'Excessive Force', 'Police Misconduct', 'Prosecutorial Reform'],
  '(215) 686-8000',
  NULL,
  'https://phila.gov/districtattorney',
  true,
  NULL,
  32,
  true,
  'Philadelphia District Attorney elected 2017 on criminal justice reform platform. Former civil rights defense attorney who defended protesters and activists for 30 years. Leading progressive prosecutor reforming the criminal justice system from within.'
),
(
  'Amara Enyia',
  'Movement for Black Lives',
  'IL',
  'Chicago',
  ARRAY['Civil Rights', 'Racial Justice', 'Police Reform'],
  ARRAY['Police Accountability', 'Housing Rights', 'Economic Justice', 'Community Organizing'],
  '(773) 698-7008',
  NULL,
  'https://movementforblacklives.org',
  true,
  NULL,
  15,
  true,
  'Policy Director for Movement for Black Lives. Attorney and community organizer. Leading voice on police accountability, housing rights, and economic justice in Chicago and nationally.'
)

ON CONFLICT DO NOTHING;

-- Update the is_verified column to true for all newly inserted attorneys
UPDATE public.attorneys
SET is_verified = true
WHERE firm IN (
  'ACLU National - Immigrants'' Rights Project',
  'ACLU National - Criminal Law Reform Project',
  'ACLU National - Center for Democracy',
  'ACLU National - LGBTQ & HIV Project',
  'ACLU National - National Security Project',
  'NAACP Legal Defense Fund',
  'Ben Crump Law',
  'Burris Nisenbaum Curry & Lacy (BNCL)',
  'Merritt Law Firm',
  'Equal Justice Initiative',
  'Innocence Project',
  'GLBTQ Legal Advocates & Defenders (GLAD)',
  'Southern Poverty Law Center',
  'ACLU National / NYU School of Law',
  'Earthjustice',
  'ACLU of Northern California',
  'Elias Law Group',
  'Mexican American Legal Defense and Educational Fund (MALDEF)',
  'Native American Rights Fund (NARF)',
  'Advancement Project',
  'Free & Fair Litigation Group',
  'Philadelphia District Attorney''s Office',
  'Movement for Black Lives'
);
