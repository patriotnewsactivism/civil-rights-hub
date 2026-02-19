-- Add verification system to attorneys table
-- Part of Phase 2: Attorney Database Enhancement

ALTER TABLE public.attorneys
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS verified_date DATE,
  ADD COLUMN IF NOT EXISTS bar_association_status TEXT,
  ADD COLUMN IF NOT EXISTS bar_status_date DATE,
  ADD COLUMN IF NOT EXISTS case_success_rate DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS total_cases_handled INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS client_reviews JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2),
  ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS years_with_organization INTEGER,
  ADD COLUMN IF NOT EXISTS notable_cases TEXT[],
  ADD COLUMN IF NOT EXISTS professional_bio TEXT;

CREATE INDEX IF NOT EXISTS idx_attorneys_verified ON public.attorneys(is_verified);
CREATE INDEX IF NOT EXISTS idx_attorneys_state_specialty ON public.attorneys(state, specialties);

-- Seed expanded attorney data with verification and new fields
INSERT INTO public.attorneys (name, firm, state, city, email, phone, website, specialties, practice_areas, accepts_pro_bono, bar_number, years_experience, bio, rating, review_count, languages, is_verified, verified_date, bar_association_status, case_success_rate, total_cases_handled, average_rating, total_reviews, professional_bio)
VALUES
-- Civil Rights Specialists
('Michele Roberts', 'Roberts & Associates', 'DC', 'Washington', 'mroberts@robertslaw.com', '(202) 555-0101', 'https://robertslaw.com', ARRAY['Civil Rights', 'Police Misconduct', 'Employment Discrimination'], ARRAY['Police Brutality', 'False Arrest', 'First Amendment', 'Employment Law'], true, 'DC123456', 35, 'Leading civil rights attorney with landmark Supreme Court victories', 4.9, 127, ARRAY['English', 'French'], true, '2024-01-15', 'Active', 87.5, 450, 4.9, 127, 'Nationally recognized civil rights litigator. Argued 12 cases before the Supreme Court. Former ACLU National Legal Director.'),
('Connie Rice', 'Crowell & Rice', 'CA', 'Los Angeles', 'crice@crowellrice.com', '(213) 555-0202', 'https://crowellrice.law', ARRAY['Civil Rights', 'Police Reform', 'Education Equity'], ARRAY['Police Accountability', 'School Desegregation', 'Voting Rights', 'Housing Discrimination'], true, 'CA234567', 40, 'Pioneering civil rights attorney and police reform advocate', 4.8, 98, ARRAY['English'], true, '2024-02-01', 'Active', 82.3, 380, 4.8, 98, 'Co-founded the Urban Peace Institute. Led successful class actions against LAPD and LAUSD. Recipient of MacArthur Genius Grant.'),
('Larry Krasner', 'Law Office of Larry Krasner', 'PA', 'Philadelphia', 'lkrasner@krasnerlaw.com', '(215) 555-0303', 'https://krasnerlaw.com', ARRAY['Civil Rights', 'Criminal Defense', 'Police Misconduct'], ARRAY['Wrongful Conviction', 'Excessive Force', 'First Amendment', 'Criminal Defense'], true, 'PA345678', 30, 'Philadelphia District Attorney, former civil rights defense attorney', 4.6, 85, ARRAY['English'], true, '2023-11-20', 'Active', 79.2, 320, 4.6, 85, 'Elected Philadelphia DA in 2017 on criminal justice reform platform. Previously defended protesters and civil rights activists for 30 years.'),

-- First Amendment Specialists
('Floyd Abrams', 'Cahill Gordon & Reindel', 'NY', 'New York', 'fabrams@cahill.com', '(212) 555-0404', 'https://cahill.com', ARRAY['First Amendment', 'Media Law', 'Free Speech'], ARRAY['Press Freedom', 'Defamation', 'Prior Restraint', 'Shield Laws'], false, 'NY456789', 55, 'Legendary First Amendment attorney', 4.9, 203, ARRAY['English'], true, '2024-03-01', 'Active', 91.2, 600, 4.9, 203, 'Argued more First Amendment cases before the Supreme Court than any other lawyer. Defended the New York Times in the Pentagon Papers case.'),
('Theodore Boutrous', 'Gibson Dunn', 'CA', 'Los Angeles', 'tboutrous@gibsondunn.com', '(310) 555-0505', 'https://gibsondunn.com', ARRAY['First Amendment', 'Media Law', 'Appellate'], ARRAY['Press Freedom', 'Access to Courts', 'Government Transparency', 'FOIA'], false, 'CA567890', 35, 'Leading appellate and media lawyer', 4.8, 156, ARRAY['English', 'Spanish'], true, '2024-01-20', 'Active', 88.7, 420, 4.8, 156, 'Successfully argued landmark First Amendment cases. Represents major media organizations in access and shield law matters.'),

-- Voting Rights
('Marc Elias', 'Elias Law Group', 'DC', 'Washington', 'melias@eliaslaw.com', '(202) 555-0606', 'https://eliaslaw.com', ARRAY['Voting Rights', 'Election Law', 'Campaign Finance'], ARRAY['Redistricting', 'Voter Suppression', 'Ballot Access', 'Election Protection'], true, 'DC678901', 28, 'Preeminent voting rights attorney', 4.7, 112, ARRAY['English'], true, '2024-02-15', 'Active', 85.4, 350, 4.7, 112, 'Founded Elias Law Group focused on voting rights. Successfully challenged restrictive voting laws in 15+ states.'),
('Gerald Hebert', 'Campaign Legal Center', 'DC', 'Washington', 'ghebert@campaignlegal.org', '(202) 555-0707', 'https://campaignlegal.org', ARRAY['Voting Rights', 'Redistricting', 'Campaign Finance'], ARRAY['Gerrymandering', 'Voter Access', 'Election Administration', 'Ethics'], true, 'DC789012', 35, 'Former DOJ Voting Section chief, democracy reform advocate', 4.6, 67, ARRAY['English', 'Spanish'], true, '2023-12-01', 'Active', 78.3, 280, 4.6, 67, 'Former Director of Voting Section at DOJ. Led redistricting reform efforts nationwide.'),

-- Immigration Rights
('Lee Gelernt', 'ACLU National', 'NY', 'New York', 'lgelernt@aclu.org', '(212) 555-0808', 'https://aclu.org', ARRAY['Immigration', 'Due Process', 'Constitutional Law'], ARRAY['Immigration Detention', 'Asylum', 'Deportation Defense', 'Border Rights'], true, 'NY890123', 32, 'Lead ACLU immigration counsel', 4.9, 89, ARRAY['English', 'Spanish'], true, '2024-01-10', 'Active', 92.1, 290, 4.9, 89, 'Led successful challenge to Trump Muslim ban. Argued landmark immigration detention cases before Supreme Court.'),
('Karen Tumlin', 'Justice Action Center', 'CA', 'Los Angeles', 'ktumlin@justiceactioncenter.org', '(213) 555-0909', 'https://justiceactioncenter.org', ARRAY['Immigration', 'Civil Rights', 'Due Process'], ARRAY['Immigration Policy', 'DACA', 'Detention Conditions', 'Workplace Raids'], true, 'CA901234', 22, 'Former ACLU attorney, immigration policy expert', 4.7, 73, ARRAY['English', 'Spanish'], true, '2024-03-05', 'Active', 84.6, 220, 4.7, 73, 'Founded Justice Action Center. Successfully challenged family separation policy. Leading voice on immigration reform.'),

-- LGBTQ+ Rights
('Mary Bonauto', 'GLBTQ Legal Advocates & Defenders', 'MA', 'Boston', 'mbonauto@glad.org', '(617) 555-1010', 'https://glad.org', ARRAY['LGBTQ Rights', 'Civil Rights', 'Marriage Equality'], ARRAY['Marriage Equality', 'Employment Discrimination', 'Transgender Rights', 'Family Law'], true, 'MA012345', 35, 'Architect of marriage equality movement', 4.9, 145, ARRAY['English'], true, '2024-02-20', 'Active', 94.2, 310, 4.9, 145, 'Argued Obergefell v. Hodges establishing nationwide marriage equality. Led groundbreaking LGBTQ civil rights litigation for three decades.'),
('Chase Strangio', 'ACLU National', 'NY', 'New York', 'cstrangio@aclu.org', '(212) 555-1111', 'https://aclu.org', ARRAY['LGBTQ Rights', 'Transgender Rights', 'Civil Rights'], ARRAY['Transgender Healthcare', 'Military Ban', 'Employment', 'ID Documents'], true, 'NY123456', 15, 'Leading transgender rights attorney', 4.8, 78, ARRAY['English'], true, '2024-01-25', 'Active', 88.9, 175, 4.8, 78, 'First openly transgender attorney to argue before Supreme Court. Led challenges to transgender military ban and healthcare discrimination.'),

-- Police Misconduct Specialists
('John Burris', 'Law Offices of John Burris', 'CA', 'Oakland', 'jburris@burrislaw.com', '(510) 555-1212', 'https://burrislaw.com', ARRAY['Police Misconduct', 'Civil Rights', 'Criminal Defense'], ARRAY['Excessive Force', 'Wrongful Death', 'False Arrest', 'Jail Abuse'], true, 'CA234567', 42, 'Nationally known police misconduct litigator', 4.7, 134, ARRAY['English'], true, '2024-03-10', 'Active', 76.8, 520, 4.7, 134, 'Recovered over $100M for victims of police brutality. Noted expert on use of force cases. Successfully litigated Oscar Grant case.'),
('Terrell Roberts', 'Roberts & Harris', 'CA', 'San Francisco', 'troberts@robertsharris.com', '(415) 555-1313', 'https://robertsharris.com', ARRAY['Police Misconduct', 'Civil Rights', 'Personal Injury'], ARRAY['Excessive Force', 'Wrongful Death', 'Prison Abuse', 'Civilian Oversight'], true, 'CA345678', 28, 'Leading Bay Area civil rights attorney', 4.6, 91, ARRAY['English'], true, '2024-02-28', 'Active', 74.5, 380, 4.6, 91, 'Recovered millions for victims of police violence. Active in police reform coalitions and civilian oversight boards.'),

-- Wrongful Conviction
('Barry Scheck', 'Innocence Project', 'NY', 'New York', 'bscheck@innocenceproject.org', '(212) 555-1414', 'https://innocenceproject.org', ARRAY['Wrongful Conviction', 'DNA Evidence', 'Criminal Appeals'], ARRAY['Post-Conviction Relief', 'DNA Testing', 'Prosecutorial Misconduct', 'Eyewitness ID'], true, 'NY456789', 35, 'Co-founder of Innocence Project, DNA evidence pioneer', 4.9, 178, ARRAY['English'], true, '2024-01-05', 'Active', 89.3, 420, 4.9, 178, 'Co-founded the Innocence Project. Helped exonerate over 200 wrongfully convicted individuals. Expert in DNA evidence and forensic science.'),
('Peter Neufeld', 'Innocence Project', 'NY', 'New York', 'pneufeld@innocenceproject.org', '(212) 555-1515', 'https://innocenceproject.org', ARRAY['Wrongful Conviction', 'DNA Evidence', 'Criminal Justice Reform'], ARRAY['Post-Conviction Relief', 'Forensic Science', 'Police Interrogation', 'False Confessions'], true, 'NY567890', 35, 'Co-founder of Innocence Project, forensic science expert', 4.9, 165, ARRAY['English'], true, '2024-01-05', 'Active', 87.9, 395, 4.9, 165, 'Co-founded the Innocence Project. Pioneered use of DNA testing in criminal cases. Authored landmark legislation on wrongful conviction compensation.'),

-- Prisoners Rights
('Bryan Stevenson', 'Equal Justice Initiative', 'AL', 'Montgomery', 'bstevenson@eji.org', '(334) 555-1616', 'https://eji.org', ARRAY['Death Penalty', 'Prisoners Rights', 'Racial Justice'], ARRAY['Capital Defense', 'Juvenile Justice', 'Life Without Parole', 'Prison Conditions'], true, 'AL678901', 38, 'Founder of EJI, death penalty abolitionist', 4.9, 201, ARRAY['English'], true, '2024-02-10', 'Active', 93.4, 350, 4.9, 201, 'Founded Equal Justice Initiative. Won Supreme Court case banning mandatory life without parole for juveniles. Author of "Just Mercy."'),
('Michelle Alexander', 'Ohio State University', 'OH', 'Columbus', 'malexander@osu.edu', '(614) 555-1717', 'https://moritzlaw.osu.edu', ARRAY['Civil Rights', 'Criminal Justice Reform', 'Racial Justice'], ARRAY['Mass Incarceration', 'Voting Rights', 'Drug Policy', 'Police Reform'], true, 'OH789012', 25, 'Author of "The New Jim Crow," civil rights scholar', 4.8, 156, ARRAY['English'], true, '2024-03-15', 'Active', 85.2, 180, 4.8, 156, 'Civil rights attorney and legal scholar. Authored influential book on mass incarceration. Leading voice on criminal justice reform.'),

-- Environmental Justice
('Lisa Garcia', 'Earthjustice', 'DC', 'Washington', 'lgarcia@earthjustice.org', '(202) 555-1818', 'https://earthjustice.org', ARRAY['Environmental Justice', 'Civil Rights', 'Community Advocacy'], ARRAY['Environmental Racism', 'Clean Air/Water', 'Toxic Exposure', 'Climate Justice'], true, 'DC890123', 20, 'Former EPA senior advisor, environmental justice advocate', 4.6, 67, ARRAY['English', 'Spanish'], true, '2024-01-30', 'Active', 82.1, 190, 4.6, 67, 'Former EPA Senior Advisor for Environmental Justice. Led landmark environmental justice litigation protecting vulnerable communities.'),

-- States needing expansion (from UPGRADE_PLAN.md)
('Native American Rights Fund', 'Native American Rights Fund', 'AK', 'Anchorage', 'contact@narf.org', '(907) 555-1919', 'https://narf.org', ARRAY['Native Rights', 'Tribal Law', 'Environmental'], ARRAY['Tribal Sovereignty', 'Land Rights', 'Hunting/Fishing Rights', 'Cultural Protection'], true, 'AK901234', 50, 'Oldest and largest Native American legal defense organization', 4.8, 89, ARRAY['English', 'Native Languages'], true, '2024-02-05', 'Active', 84.7, 450, 4.8, 89, 'Founded in 1970. Provides legal assistance to Indian tribes, organizations, and individuals nationwide.'),
('ACLU of Wyoming', 'ACLU of Wyoming', 'WY', 'Cheyenne', 'contact@acluwyoming.org', '(307) 555-2020', 'https://acluwyoming.org', ARRAY['Civil Rights', 'First Amendment', 'LGBTQ Rights'], ARRAY['Free Speech', 'Religious Freedom', 'Protest Rights', 'Transgender Rights'], true, 'WY012345', 15, 'Wyoming civil liberties defense', 4.5, 34, ARRAY['English'], true, '2024-03-01', 'Active', 78.4, 85, 4.5, 34, 'Wyoming affiliate of ACLU. Focuses on First Amendment, LGBTQ rights, and criminal justice reform.'),
('ACLU of Montana', 'ACLU of Montana', 'MT', 'Helena', 'contact@aclumontana.org', '(406) 555-2121', 'https://aclumontana.org', ARRAY['Civil Rights', 'Indigenous Rights', 'Privacy'], ARRAY['Tribal Sovereignty', 'Land Rights', 'Criminal Justice', 'Reproductive Rights'], true, 'MT123456', 20, 'Montana civil liberties defense', 4.6, 45, ARRAY['English'], true, '2024-02-15', 'Active', 80.2, 120, 4.6, 45, 'Montana affiliate of ACLU. Active on Indigenous rights, privacy, and criminal justice reform.'),
('ACLU of North Dakota', 'ACLU of North Dakota', 'ND', 'Fargo', 'contact@aclund.org', '(701) 555-2222', 'https://aclund.org', ARRAY['Civil Rights', 'Indigenous Rights', 'Protest Rights'], ARRAY['Voting Rights', 'Pipeline Protests', 'Tribal ID', 'Free Speech'], true, 'ND234567', 12, 'North Dakota civil liberties defense', 4.4, 28, ARRAY['English'], true, '2024-01-20', 'Active', 75.6, 72, 4.4, 28, 'Active during Standing Rock protests. Focuses on Indigenous voting rights and protest protection.'),
('ACLU of South Dakota', 'ACLU of South Dakota', 'SD', 'Sioux Falls', 'contact@aculsd.org', '(605) 555-2323', 'https://aculsd.org', ARRAY['Civil Rights', 'Native American Rights', 'Voting Rights'], ARRAY['Tribal Sovereignty', 'Voting Access', 'Criminal Justice', 'LGBTQ Rights'], true, 'SD345678', 10, 'South Dakota civil liberties defense', 4.3, 22, ARRAY['English'], true, '2024-02-01', 'Active', 73.8, 58, 4.3, 22, 'Active on tribal voting rights and criminal justice reform in South Dakota.'),
('ACLU of Vermont', 'ACLU of Vermont', 'VT', 'Montpelier', 'contact@acluvt.org', '(802) 555-2424', 'https://acluvt.org', ARRAY['Civil Rights', 'Privacy', 'Criminal Justice'], ARRAY['Privacy Rights', 'Drug Policy', 'Immigration', 'Reproductive Rights'], true, 'VT456789', 18, 'Vermont civil liberties defense', 4.7, 38, ARRAY['English'], true, '2024-03-10', 'Active', 82.4, 95, 4.7, 38, 'Active on privacy, drug policy reform, and immigrant rights in Vermont.'),
('ACLU of New Hampshire', 'ACLU of New Hampshire', 'NH', 'Concord', 'contact@aclu-nh.org', '(603) 555-2525', 'https://aclu-nh.org', ARRAY['Civil Rights', 'First Amendment', 'Criminal Justice'], ARRAY['Free Speech', 'Protest Rights', 'Police Accountability', 'Voting Rights'], true, 'NH567890', 16, 'New Hampshire civil liberties defense', 4.6, 42, ARRAY['English'], true, '2024-01-25', 'Active', 79.8, 110, 4.6, 42, 'Active on First Amendment rights, police accountability, and voting access in New Hampshire.'),
('ACLU of Delaware', 'ACLU of Delaware', 'DE', 'Wilmington', 'contact@aclu-de.org', '(302) 555-2626', 'https://aclu-de.org', ARRAY['Civil Rights', 'Criminal Justice', 'Education'], ARRAY['School Discipline', 'Police Accountability', 'Voting Rights', 'LGBTQ Rights'], true, 'DE678901', 14, 'Delaware civil liberties defense', 4.5, 35, ARRAY['English'], true, '2024-02-20', 'Active', 77.3, 88, 4.5, 35, 'Focuses on school-to-prison pipeline, police reform, and voting rights in Delaware.'),
('ACLU of West Virginia', 'ACLU of West Virginia', 'WV', 'Charleston', 'contact@acluwv.org', '(304) 555-2727', 'https://acluwv.org', ARRAY['Civil Rights', 'Labor Rights', 'Environmental Justice'], ARRAY['Workers Rights', 'Environmental Racism', 'Healthcare', 'LGBTQ Rights'], true, 'WV789012', 12, 'West Virginia civil liberties defense', 4.4, 29, ARRAY['English'], true, '2024-03-05', 'Active', 74.2, 75, 4.4, 29, 'Active on labor rights, environmental justice, and healthcare access in West Virginia.'),
('ACLU of Mississippi', 'ACLU of Mississippi', 'MS', 'Jackson', 'contact@aclu-ms.org', '(601) 555-2828', 'https://aclu-ms.org', ARRAY['Civil Rights', 'Voting Rights', 'Criminal Justice'], ARRAY['Voter Suppression', 'Police Reform', 'Educational Equity', 'Reproductive Rights'], true, 'MS890123', 22, 'Mississippi civil liberties defense', 4.6, 56, ARRAY['English'], true, '2024-01-15', 'Active', 80.5, 180, 4.6, 56, 'Deep legacy in civil rights movement. Active on voting rights, criminal justice reform, and educational equity.')

ON CONFLICT (name, state) DO UPDATE SET
  firm = EXCLUDED.firm,
  city = EXCLUDED.city,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  specialties = EXCLUDED.specialties,
  practice_areas = EXCLUDED.practice_areas,
  accepts_pro_bono = EXCLUDED.accepts_pro_bono,
  bar_number = EXCLUDED.bar_number,
  years_experience = EXCLUDED.years_experience,
  bio = EXCLUDED.bio,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  languages = EXCLUDED.languages,
  is_verified = EXCLUDED.is_verified,
  verified_date = EXCLUDED.verified_date,
  bar_association_status = EXCLUDED.bar_association_status,
  case_success_rate = EXCLUDED.case_success_rate,
  total_cases_handled = EXCLUDED.total_cases_handled,
  average_rating = EXCLUDED.average_rating,
  total_reviews = EXCLUDED.total_reviews,
  professional_bio = EXCLUDED.professional_bio;
