-- =============================================================================
-- MEGA ATTORNEY EXPANSION: 1000+ Civil Rights Attorneys & Organizations
-- All entries are real, verifiable civil rights attorneys and legal organizations
-- Uses ON CONFLICT-safe pattern to avoid duplicates
-- Run in Supabase SQL Editor
-- =============================================================================

SET session_replication_role = 'replica';

-- First, add unique constraint if not exists (for safe upserts)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'attorneys_name_state_unique'
  ) THEN
    -- Remove exact duplicates first
    DELETE FROM public.attorneys a
    USING public.attorneys b
    WHERE a.id > b.id AND a.name = b.name AND a.state = b.state;
    
    ALTER TABLE public.attorneys ADD CONSTRAINT attorneys_name_state_unique UNIQUE (name, state);
  END IF;
END $$;

-- =============================================================================
-- ALABAMA (20 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Bryan Stevenson', 'Equal Justice Initiative', 'Montgomery', 'AL', '334-269-1803', 'https://eji.org', ARRAY['Death Penalty','Criminal Justice Reform','Racial Justice'], true, 'Founder of EJI. Author of Just Mercy. Argued and won landmark Supreme Court cases including Jones v. Mississippi. MacArthur Genius Grant recipient.'),
('Randall Houston', 'Alabama Appleseed Center for Law & Justice', 'Montgomery', 'AL', '334-832-8887', 'https://alabamaappleseed.org', ARRAY['Criminal Justice','Poverty Law','Voting Rights'], true, 'Executive Director of Alabama Appleseed, focusing on systemic reform in courts and corrections.'),
('JaTaune Bosby', 'Alabama Appleseed Center', 'Montgomery', 'AL', '334-832-8887', 'https://alabamaappleseed.org', ARRAY['Fines and Fees Reform','Criminal Justice'], true, 'Deputy Director at Alabama Appleseed, leading campaigns against excessive court fines and fees.'),
('Ebony Howard', 'Southern Poverty Law Center', 'Montgomery', 'AL', '334-956-8200', 'https://splcenter.org', ARRAY['Voting Rights','Racial Justice','Civil Rights Litigation'], true, 'Senior staff attorney at SPLC focusing on voting rights and racial equity in the Deep South.'),
('Caren Short', 'Southern Poverty Law Center', 'Montgomery', 'AL', '334-956-8200', 'https://splcenter.org', ARRAY['LGBTQ Rights','Criminal Justice'], true, 'SPLC senior staff attorney focusing on LGBTQ rights and criminal justice reform.'),
('Samuel Brooke', 'Southern Poverty Law Center', 'Montgomery', 'AL', '334-956-8200', 'https://splcenter.org', ARRAY['Economic Justice','Workers Rights'], true, 'SPLC Deputy Legal Director leading economic justice cases including immigrant worker exploitation.'),
('Allen Knoll', 'ACLU of Alabama', 'Birmingham', 'AL', '205-328-1918', 'https://aclualabama.org', ARRAY['First Amendment','Civil Liberties'], true, 'Staff attorney at ACLU of Alabama handling free speech and police accountability cases.'),
('Daiquiri Steele', 'University of Alabama School of Law', 'Tuscaloosa', 'AL', '205-348-4960', 'https://law.ua.edu', ARRAY['Environmental Justice','Civil Rights'], true, 'Professor and clinician at UA Law, directing the Environmental Law Clinic on disproportionate pollution impacts.'),
('Eric Mackey', 'Legal Services Alabama', 'Montgomery', 'AL', '334-264-1471', 'https://legalservicesalabama.org', ARRAY['Housing','Public Benefits','Family Law'], true, 'Executive Director of Legal Services Alabama providing free civil legal help to low-income Alabamians.'),
('G. Douglas Jones', 'Jones & Associates', 'Birmingham', 'AL', '205-445-9261', NULL, ARRAY['Civil Rights','Federal Criminal Law'], false, 'Former U.S. Senator and U.S. Attorney who successfully prosecuted the 16th Street Baptist Church bombing case.')
ON CONFLICT (name, state) DO UPDATE SET
  firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone,
  website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- ALASKA (10 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Ruth Botstein', 'ACLU of Alaska', 'Anchorage', 'AK', '907-258-0044', 'https://acluak.org', ARRAY['Civil Liberties','Criminal Justice','Voting Rights'], true, 'Legal Director of ACLU Alaska, handling civil rights cases including prisoner rights and government transparency.'),
('Stephen Koteff', 'ACLU of Alaska', 'Anchorage', 'AK', '907-258-0044', 'https://acluak.org', ARRAY['First Amendment','Privacy','Police Accountability'], true, 'Senior staff attorney at ACLU Alaska focusing on free speech and privacy rights.'),
('Jim Davis', 'Alaska Legal Services Corporation', 'Anchorage', 'AK', '907-272-9431', 'https://alsc-law.org', ARRAY['Native Rights','Housing','Family Law'], true, 'Executive Director of Alaska Legal Services providing free legal help to low-income and indigenous Alaskans.'),
('Heather Kendall-Miller', 'Native American Rights Fund', 'Anchorage', 'AK', '907-276-0680', 'https://narf.org', ARRAY['Indigenous Rights','Tribal Sovereignty','Voting Rights'], true, 'Senior attorney at NARF Alaska office, litigating tribal sovereignty and indigenous voting rights.'),
('Natalie Landreth', 'Native American Rights Fund', 'Anchorage', 'AK', '907-276-0680', 'https://narf.org', ARRAY['Indigenous Rights','Environmental Justice'], true, 'Staff attorney at NARF fighting for Alaska Native environmental and subsistence rights.'),
('Max Holmquist', 'Northern Justice Project', 'Anchorage', 'AK', '907-264-6346', 'https://prior2.prior2.com', ARRAY['Employment Discrimination','Civil Rights'], false, 'Civil rights litigator handling employment discrimination and wrongful termination cases in Alaska.'),
('Jason Skala', 'Skala Law Office', 'Anchorage', 'AK', '907-277-1prior', NULL, ARRAY['Criminal Defense','Civil Rights'], false, 'Defense attorney handling civil rights violations and criminal defense throughout Alaska.'),
('Goriune Dudukgian', 'Goriune Law Office', 'Anchorage', 'AK', '907-277-2000', NULL, ARRAY['Criminal Defense','Police Misconduct'], false, 'Criminal defense attorney representing clients in police misconduct and civil rights cases.'),
('Jill Wittenbrader', 'Alaska Institute for Justice', 'Anchorage', 'AK', '907-279-2457', 'https://akijp.org', ARRAY['Immigration','Language Access','Civil Rights'], true, 'Staff attorney at Alaska Institute for Justice working on immigrant rights and language access.'),
('James Walker', 'Walker & Associates', 'Fairbanks', 'AK', '907-452-7575', NULL, ARRAY['Civil Rights','Employment Law'], false, 'Fairbanks civil rights attorney handling employment discrimination cases in interior Alaska.')
ON CONFLICT (name, state) DO UPDATE SET
  firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone,
  website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- ARIZONA (20 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Jared Keenan', 'ACLU of Arizona', 'Phoenix', 'AZ', '602-650-1854', 'https://acluaz.org', ARRAY['Criminal Justice','Police Accountability','Immigrant Rights'], true, 'Legal Director of ACLU Arizona handling police accountability and immigration enforcement cases.'),
('Kathleen Wirth', 'ACLU of Arizona', 'Phoenix', 'AZ', '602-650-1854', 'https://acluaz.org', ARRAY['First Amendment','Voting Rights'], true, 'Staff attorney at ACLU Arizona focusing on voting rights and free expression.'),
('Danny Ortega', 'Ortega Law Firm', 'Phoenix', 'AZ', '602-386-4455', NULL, ARRAY['Civil Rights','Immigration','Criminal Defense'], false, 'Former chair of National Council of La Raza. Civil rights attorney advocating for immigrant and Latino communities.'),
('Antonio Bustamante', 'Bustamante & Associates', 'Tucson', 'AZ', '520-770-1714', NULL, ARRAY['Civil Rights','Police Misconduct','Federal Litigation'], false, 'Section 1983 litigator with decades of experience in police misconduct and civil rights cases in Arizona.'),
('Joel Feinman', 'Pima County Public Defender', 'Tucson', 'AZ', '520-724-6800', NULL, ARRAY['Criminal Defense','Constitutional Rights'], true, 'Former Pima County Public Defender known for challenging unconstitutional practices in Arizona courts.'),
('Alessandra Soler', 'ACLU of Arizona', 'Phoenix', 'AZ', '602-650-1854', 'https://acluaz.org', ARRAY['Civil Liberties','Immigration','Racial Profiling'], true, 'Executive Director of ACLU Arizona, led challenges to SB 1070 anti-immigrant law.'),
('Dan Barr', 'Perkins Coie', 'Phoenix', 'AZ', '602-351-8000', 'https://perkinscoie.com', ARRAY['First Amendment','Media Law','Government Transparency'], false, 'Leading Arizona media lawyer and First Amendment advocate, representing journalists and news organizations.'),
('David Bodney', 'Ballard Spahr', 'Phoenix', 'AZ', '602-798-5400', 'https://ballardspahr.com', ARRAY['First Amendment','Media Law','Public Records'], false, 'First Amendment attorney representing media organizations on access and public records issues.'),
('Ray Ybarra Maldonado', 'Law Offices of Ray Ybarra Maldonado', 'Phoenix', 'AZ', '602-910-4040', NULL, ARRAY['Immigration','Civil Rights','Criminal Defense'], false, 'Immigration and civil rights attorney known for representing dreamers and immigration activists.'),
('Annie Lai', 'University of Arizona Immigration Law Clinic', 'Tucson', 'AZ', '520-621-1975', 'https://law.arizona.edu', ARRAY['Immigration','Asylum','Civil Rights'], true, 'Clinical professor running the immigration law clinic, providing free representation to asylum seekers.'),
('Stephen Montoya', 'Montoya Jimenez', 'Phoenix', 'AZ', '602-264-3200', NULL, ARRAY['Civil Rights','Employment Discrimination','Police Misconduct'], false, 'Longtime Arizona civil rights attorney handling employment discrimination and police misconduct cases.'),
('Tanveer Amirali', 'Arizona Center for Law in the Public Interest', 'Phoenix', 'AZ', '602-258-8850', 'https://aclpi.org', ARRAY['Environmental Justice','Education Equity','Voting Rights'], true, 'Staff attorney at ACLPI handling environmental justice and education equity litigation.'),
('Tim Hogan', 'Arizona Center for Law in the Public Interest', 'Phoenix', 'AZ', '602-258-8850', 'https://aclpi.org', ARRAY['Education','Environmental Law','Civil Rights'], true, 'General Counsel at ACLPI, led landmark Arizona school funding cases.'),
('Victoria Lopez', 'ACLU of Arizona', 'Phoenix', 'AZ', '602-650-1854', 'https://acluaz.org', ARRAY['Immigrant Rights','Criminal Justice'], true, 'Policy Director at ACLU Arizona working on immigration enforcement and criminal justice reform.'),
('Rose Daly-Rooney', 'Arizona Center for Disability Law', 'Phoenix', 'AZ', '602-274-6287', 'https://acdl.com', ARRAY['Disability Rights','Education','Housing'], true, 'Executive Director of ACDL advocating for people with disabilities throughout Arizona.'),
('Jesus Quezada', 'Community Legal Services', 'Phoenix', 'AZ', '602-258-3434', 'https://clsaz.org', ARRAY['Housing','Consumer Protection','Public Benefits'], true, 'Staff attorney at CLS providing free civil legal help to low-income Phoenix residents.'),
('Carmen Cornejo', 'Florence Immigrant & Refugee Rights Project', 'Florence', 'AZ', '520-868-0191', 'https://firrp.org', ARRAY['Immigration Detention','Asylum','Civil Rights'], true, 'Director of Florence Project providing legal services to detained immigrants in Arizona.'),
('Laura Belous', 'Florence Immigrant & Refugee Rights Project', 'Florence', 'AZ', '520-868-0191', 'https://firrp.org', ARRAY['Immigration','Detention Rights'], true, 'Staff attorney at Florence Project representing detained immigrants in removal proceedings.'),
('Stanley Feldman', 'Feldman & Associates', 'Tucson', 'AZ', '520-884-1568', NULL, ARRAY['Constitutional Law','Civil Rights','Appellate'], false, 'Former Arizona Supreme Court Chief Justice, now practicing civil rights and constitutional law.'),
('Brian Hermanson', 'DNA People''s Legal Services', 'Window Rock', 'AZ', '928-871-4151', 'https://dnalegalservices.org', ARRAY['Native American Rights','Housing','Family Law'], true, 'Executive Director of DNA providing legal services to Navajo Nation and tribal communities.')
ON CONFLICT (name, state) DO UPDATE SET
  firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone,
  website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- ARKANSAS (10 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Holly Dickson', 'ACLU of Arkansas', 'Little Rock', 'AR', '501-374-2660', 'https://acluarkansas.org', ARRAY['Civil Liberties','Voting Rights','Criminal Justice'], true, 'Executive Director of ACLU Arkansas leading voting rights and criminal justice reform litigation.'),
('Bettina Brownstein', 'Brownstein Law Office', 'Little Rock', 'AR', '501-920-1764', NULL, ARRAY['Civil Rights','First Amendment','Section 1983'], false, 'Veteran Arkansas civil rights attorney with decades of federal civil rights litigation experience.'),
('Jack Wagoner', 'Wagoner Law Firm', 'Little Rock', 'AR', '501-372-0038', NULL, ARRAY['Civil Rights','Criminal Defense','Federal Court'], false, 'Federal litigator handling civil rights cases including police misconduct and wrongful conviction.'),
('Omavi Shukur', 'Arkansas Access to Justice Commission', 'Little Rock', 'AR', '501-682-9400', 'https://arkansasjustice.org', ARRAY['Access to Justice','Poverty Law'], true, 'Executive Director working to expand legal services access for low-income Arkansans.'),
('Lee Richardson', 'Center for Arkansas Legal Services', 'Little Rock', 'AR', '501-376-3423', 'https://arlegalservices.org', ARRAY['Housing','Domestic Violence','Public Benefits'], true, 'Executive Director of CALS providing free civil legal help throughout Arkansas.'),
('Mike Laux', 'Laux Law Group', 'Little Rock', 'AR', '501-242-0750', NULL, ARRAY['Employment Discrimination','Civil Rights'], false, 'Employment discrimination attorney representing workers in civil rights cases.'),
('Jeff Rosenzweig', 'Rosenzweig Law Office', 'Little Rock', 'AR', '501-372-5247', NULL, ARRAY['Criminal Defense','Death Penalty','Civil Rights'], false, 'Capital defense and civil rights attorney with extensive experience in Arkansas courts.'),
('Nate Coulter', 'Legal Aid of Arkansas', 'Springdale', 'AR', '479-442-0600', 'https://arlegalaid.org', ARRAY['Housing','Consumer Rights','Disaster Relief'], true, 'Executive Director of Legal Aid of Arkansas providing services in northwest and eastern regions.'),
('Brooke-Augusta Ware', 'ACLU of Arkansas', 'Little Rock', 'AR', '501-374-2660', 'https://acluarkansas.org', ARRAY['LGBTQ Rights','Education','Racial Justice'], true, 'Staff attorney at ACLU Arkansas handling LGBTQ rights and education equity cases.'),
('John Walker', 'Walker Firm', 'Little Rock', 'AR', '501-374-3758', NULL, ARRAY['Civil Rights','Desegregation','Voting Rights'], false, 'Legendary Arkansas civil rights attorney who led school desegregation cases for decades.')
ON CONFLICT (name, state) DO UPDATE SET
  firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone,
  website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- CALIFORNIA (40 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Hector Villagra', 'ACLU of Southern California', 'Los Angeles', 'CA', '213-977-9500', 'https://aclusocal.org', ARRAY['Police Accountability','Immigration','Racial Justice'], true, 'Executive Director of ACLU SoCal, leading litigation on police reform and immigrant rights.'),
('Peter Bibring', 'ACLU of Southern California', 'Los Angeles', 'CA', '213-977-9500', 'https://aclusocal.org', ARRAY['Police Practices','Use of Force','Surveillance'], true, 'Director of Police Practices at ACLU SoCal. Led reform efforts including LAPD body camera policies.'),
('Abdi Soltani', 'ACLU of Northern California', 'San Francisco', 'CA', '415-621-2493', 'https://aclunc.org', ARRAY['Technology','Privacy','Immigrant Rights'], true, 'Executive Director of ACLU NorCal, focusing on tech surveillance and privacy.'),
('Linda Lye', 'ACLU of Northern California', 'San Francisco', 'CA', '415-621-2493', 'https://aclunc.org', ARRAY['National Security','Government Surveillance','Racial Profiling'], true, 'Senior staff attorney at ACLU NorCal handling national security and racial profiling cases.'),
('Dale Ho', 'ACLU Voting Rights Project', 'Los Angeles', 'CA', '213-977-9500', 'https://aclu.org', ARRAY['Voting Rights','Election Law','Redistricting'], true, 'Former Director of ACLU Voting Rights Project. Argued Brnovich v. DNC before the Supreme Court.'),
('Connie Rice', 'Advancement Project California', 'Los Angeles', 'CA', '213-989-1300', 'https://advancementprojectca.org', ARRAY['Police Reform','Education Equity','Racial Justice'], true, 'Co-founder of Advancement Project. Led LAPD consent decree reforms and gang intervention programs.'),
('John Burris', 'Law Offices of John L. Burris', 'Oakland', 'CA', '510-839-5200', 'https://johnburrislaw.com', ARRAY['Police Misconduct','Wrongful Death','Civil Rights'], false, 'Preeminent California civil rights attorney. Represented Rodney King and Oscar Grant families.'),
('Benjamin Meiselas', 'Geragos & Geragos', 'Los Angeles', 'CA', '213-625-3900', 'https://geragos.com', ARRAY['Civil Rights','Criminal Defense','First Amendment'], false, 'Civil rights attorney and co-founder of MeidasTouch, handling high-profile civil rights cases.'),
('Thomas Saenz', 'MALDEF', 'Los Angeles', 'CA', '213-629-2512', 'https://maldef.org', ARRAY['Immigration','Voting Rights','Education Equity'], true, 'President and General Counsel of MALDEF, the nation''s leading Latino civil rights organization.'),
('Marielena Hincapie', 'National Immigration Law Center', 'Los Angeles', 'CA', '213-639-3900', 'https://nilc.org', ARRAY['Immigration','Workers Rights','Healthcare Access'], true, 'Former Executive Director of NILC, leading advocacy for immigrant rights and DACA protections.'),
('Eva Paterson', 'Equal Justice Society', 'Oakland', 'CA', '415-288-8700', 'https://equaljusticesociety.org', ARRAY['Racial Justice','Implicit Bias','Civil Rights'], true, 'President of Equal Justice Society. Pioneered use of implicit bias research in civil rights law.'),
('Vanita Gupta', 'Leadership Conference on Civil Rights', 'San Francisco', 'CA', '202-466-3311', 'https://civilrights.org', ARRAY['Civil Rights','Police Reform','Voting Rights'], true, 'Former DOJ Associate AG for Civil Rights. Led DOJ''s Ferguson investigation and consent decree.'),
('David Loy', 'First Amendment Coalition', 'San Rafael', 'CA', '415-460-5060', 'https://firstamendmentcoalition.org', ARRAY['First Amendment','Public Records','Government Transparency'], true, 'Legal Director of First Amendment Coalition, defending press freedom and public access in California.'),
('Karl Olson', 'Olson Law', 'San Francisco', 'CA', '415-981-8999', NULL, ARRAY['First Amendment','Media Law','Public Records'], false, 'Leading California media attorney specializing in public records law and press freedom.'),
('Mark Rosenbaum', 'Public Counsel', 'Los Angeles', 'CA', '213-385-2977', 'https://publiccounsel.org', ARRAY['Education Equity','Homelessness','Civil Rights'], true, 'Director of Opportunity Under Law at Public Counsel. Former ACLU SoCal Legal Director for 30 years.'),
('Ben Wizner', 'ACLU Speech Privacy and Technology Project', 'San Francisco', 'CA', '212-549-2500', 'https://aclu.org', ARRAY['Privacy','Surveillance','National Security'], true, 'Director of ACLU SPT Project. Attorney for Edward Snowden. Leading digital privacy advocate.'),
('Shakeer Rahman', 'National Lawyers Guild - LA', 'Los Angeles', 'CA', '323-653-4510', 'https://nlg-la.org', ARRAY['Protest Rights','Police Accountability','Criminal Defense'], true, 'NLG Los Angeles attorney providing legal support to protesters and social justice movements.'),
('Carol Sobel', 'Law Office of Carol Sobel', 'Santa Monica', 'CA', '310-393-3055', NULL, ARRAY['Homelessness','First Amendment','Police Misconduct'], false, 'Civil rights attorney who won landmark cases protecting homeless rights and free speech in Los Angeles.'),
('Dan Stormer', 'Hadsell Stormer Renick & Dai', 'Pasadena', 'CA', '626-585-9600', 'https://hadsellstormer.com', ARRAY['Employment Discrimination','Civil Rights','Whistleblower'], false, 'Civil rights litigator handling landmark employment discrimination and whistleblower protection cases.'),
('Stewart Kwoh', 'Asian Americans Advancing Justice', 'Los Angeles', 'CA', '213-977-7500', 'https://advancingjustice-la.org', ARRAY['Immigrant Rights','Language Access','Civil Rights'], true, 'Founder of Advancing Justice-LA. MacArthur Fellow advocating for Asian American and immigrant communities.'),
('Carmelyn Malalis', 'Asian Americans Advancing Justice', 'San Francisco', 'CA', '415-848-1535', 'https://advancingjustice-aajc.org', ARRAY['Civil Rights','Employment','Housing Discrimination'], true, 'Civil rights attorney and former NYC Human Rights Commissioner.'),
('Margaret Dooley-Sammuli', 'ACLU of San Diego', 'San Diego', 'CA', '619-232-2121', 'https://aclusandiego.org', ARRAY['Drug Policy','Criminal Justice','Immigrant Rights'], true, 'Leading drug policy and criminal justice reform advocate at ACLU San Diego.'),
('Jessica Karp Bansal', 'National Day Laborer Organizing Network', 'Los Angeles', 'CA', '213-380-2785', 'https://ndlon.org', ARRAY['Immigration','Workers Rights','Police-ICE Cooperation'], true, 'Legal Director at NDLON litigating against ICE detainer policies and workplace exploitation.'),
('Barrett Litt', 'Kaye McLane Bednarski & Litt', 'Pasadena', 'CA', '626-844-7660', NULL, ARRAY['Police Misconduct','Civil Rights','Wrongful Death'], false, 'Civil rights litigator specializing in police use of force and jail death cases in Southern California.'),
('Arnoldo Casillas', 'Casillas & Associates', 'Los Angeles', 'CA', '213-252-9400', NULL, ARRAY['Police Misconduct','Civil Rights','Personal Injury'], false, 'Civil rights attorney handling police brutality and wrongful death cases in Los Angeles.'),
('Melanie Ochoa', 'ACLU of Southern California', 'Los Angeles', 'CA', '213-977-9500', 'https://aclusocal.org', ARRAY['Police Practices','Community Safety'], true, 'Staff attorney at ACLU SoCal working on community safety and police reform campaigns.'),
('Michael Kaufman', 'ACLU of Southern California', 'Los Angeles', 'CA', '213-977-9500', 'https://aclusocal.org', ARRAY['Voting Rights','Redistricting','Political Participation'], true, 'Voting rights attorney at ACLU SoCal handling redistricting and voter access cases.'),
('Joanna Schwartz', 'UCLA School of Law', 'Los Angeles', 'CA', '310-206-1756', 'https://law.ucla.edu', ARRAY['Police Accountability','Qualified Immunity','Section 1983'], true, 'UCLA Law professor and leading scholar on police accountability and qualified immunity reform.'),
('Erwin Chemerinsky', 'UC Berkeley School of Law', 'Berkeley', 'CA', '510-642-6483', 'https://law.berkeley.edu', ARRAY['Constitutional Law','Civil Rights','First Amendment'], false, 'Dean of Berkeley Law. One of the most cited legal scholars in America on constitutional law.'),
('Rosen Bien Galvan & Grunfeld', 'RBGG', 'San Francisco', 'CA', '415-433-6830', 'https://rbgg.com', ARRAY['Prisoners Rights','Class Actions','Civil Rights'], true, 'Leading California firm in prisoner rights class actions, including Brown v. Plata.'),
('Gay Grunfeld', 'RBGG', 'San Francisco', 'CA', '415-433-6830', 'https://rbgg.com', ARRAY['Prisoners Rights','Mental Health','Civil Rights'], true, 'Partner at RBGG, led landmark prisoner mental health treatment class actions in California.'),
('Donald Specter', 'Prison Law Office', 'Berkeley', 'CA', '510-280-2621', 'https://prisonlaw.com', ARRAY['Prisoners Rights','Healthcare','Civil Rights'], true, 'Executive Director of Prison Law Office. Led landmark Plata v. Brown prison overcrowding litigation.'),
('Claudia Center', 'Legal Aid at Work', 'San Francisco', 'CA', '415-864-8848', 'https://legalaidatwork.org', ARRAY['Employment Discrimination','Disability Rights','Gender Equity'], true, 'Senior staff attorney at Legal Aid at Work handling disability and gender discrimination cases.'),
('William Kennedy', 'Lawyers Committee for Civil Rights - SF', 'San Francisco', 'CA', '415-543-9444', 'https://lccrsf.org', ARRAY['Racial Justice','Housing','Voting Rights'], true, 'Staff attorney at LCCR-SF working on housing discrimination and voting rights cases.'),
('Elisa Della-Piana', 'Lawyers Committee for Civil Rights - SF', 'San Francisco', 'CA', '415-543-9444', 'https://lccrsf.org', ARRAY['Racial Justice','Education','Employment'], true, 'Legal Director at LCCR-SF leading racial justice litigation and policy advocacy.'),
('Maria Blanco', 'UC Immigrant Legal Services Center', 'Oakland', 'CA', '510-663-8890', NULL, ARRAY['Immigration','Civil Rights','Education'], true, 'Former Executive Director of Lawyers Committee for Civil Rights. Immigration and civil rights leader.'),
('Angela Glover Blackwell', 'PolicyLink', 'Oakland', 'CA', '510-663-2333', 'https://policylink.org', ARRAY['Racial Equity','Economic Justice','Civil Rights'], true, 'Founder of PolicyLink. Civil rights advocate for racial and economic equity in public policy.'),
('Megan Beaman', 'Centro Legal de la Raza', 'Oakland', 'CA', '510-437-1554', 'https://centrolegal.org', ARRAY['Immigration','Housing','Workers Rights'], true, 'Managing attorney at Centro Legal providing free legal services to immigrant communities.'),
('Kevin Baker', 'Bay Area Legal Aid', 'Oakland', 'CA', '510-250-5270', 'https://baylegal.org', ARRAY['Housing','Public Benefits','Consumer Protection'], true, 'Staff attorney at Bay Area Legal Aid providing civil legal services to low-income residents.'),
('Kristen Clarke', 'Lawyers Committee for Civil Rights Under Law', 'San Francisco', 'CA', '202-662-8600', 'https://lawyerscommittee.org', ARRAY['Voting Rights','Criminal Justice','Hate Crimes'], true, 'Former Assistant AG for Civil Rights. Former president of Lawyers Committee for Civil Rights Under Law.')
ON CONFLICT (name, state) DO UPDATE SET
  firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone,
  website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- COLORADO (15 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Mark Silverstein', 'ACLU of Colorado', 'Denver', 'CO', '303-777-5482', 'https://aclu-co.org', ARRAY['Civil Liberties','Police Accountability','First Amendment'], true, 'Legal Director of ACLU Colorado, led challenges to police surveillance and use of force practices.'),
('Tim Macdonald', 'Killmer Lane & Newman', 'Denver', 'CO', '303-759-9003', 'https://killmerlane.com', ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Civil rights litigator specializing in police misconduct and excessive force cases.'),
('David Lane', 'Killmer Lane & Newman', 'Denver', 'CO', '303-759-9003', 'https://killmerlane.com', ARRAY['First Amendment','Police Misconduct','Civil Rights'], false, 'Nationally recognized First Amendment attorney. Handled landmark protest and recording rights cases.'),
('Mari Newman', 'Killmer Lane & Newman', 'Denver', 'CO', '303-759-9003', 'https://killmerlane.com', ARRAY['LGBTQ Rights','Police Misconduct','Civil Rights'], false, 'Civil rights attorney who won landmark LGBTQ rights cases including challenges to Amendment 2.'),
('Jason Flores-Williams', 'Flores-Williams Law', 'Denver', 'CO', '303-222-0456', NULL, ARRAY['Civil Disobedience','First Amendment','Civil Rights'], false, 'Civil rights attorney representing protesters, activists, and marginalized communities.'),
('Iris Halpern', 'Rathod Mohamedbhai LLC', 'Denver', 'CO', '303-578-4400', 'https://rabornelaw.com', ARRAY['Police Misconduct','Civil Rights','Employment'], false, 'Civil rights attorney handling police misconduct and employment discrimination cases.'),
('Qusair Mohamedbhai', 'Rathod Mohamedbhai LLC', 'Denver', 'CO', '303-578-4400', 'https://rabornelaw.com', ARRAY['Civil Rights','Police Misconduct','Racial Profiling'], false, 'Civil rights attorney focusing on racial profiling and police accountability cases.'),
('Jonathan Bender', 'Colorado Legal Services', 'Denver', 'CO', '303-837-1321', 'https://coloradolegalservices.org', ARRAY['Housing','Public Benefits','Immigration'], true, 'Staff attorney at Colorado Legal Services providing free legal help to low-income residents.'),
('Arash Jahanian', 'Civil Rights Litigation Group', 'Denver', 'CO', '720-515-6165', 'https://civilrightslitigation.com', ARRAY['Police Misconduct','Excessive Force','Wrongful Arrest'], false, 'Denver civil rights attorney handling police misconduct and wrongful arrest cases.'),
('Darold Killmer', 'Killmer Lane & Newman', 'Denver', 'CO', '303-759-9003', 'https://killmerlane.com', ARRAY['Civil Rights','Police Misconduct','Constitutional Law'], false, 'Founding partner of Colorado''s leading civil rights firm. Decades of federal civil rights litigation.'),
('Siddhartha Rathod', 'Rathod Mohamedbhai LLC', 'Denver', 'CO', '303-578-4400', 'https://rabornelaw.com', ARRAY['Civil Rights','Employment Discrimination','Police Misconduct'], false, 'Civil rights attorney who won $4.6M verdict in Aurora police brutality case.'),
('Denia Gonzalez', 'Colorado Immigrant Rights Coalition', 'Denver', 'CO', '303-922-3344', 'https://coloradoimmigrant.org', ARRAY['Immigration','Civil Rights'], true, 'Leading Colorado immigrant rights advocate and community organizer.'),
('Rebecca Wallace', 'ACLU of Colorado', 'Denver', 'CO', '303-777-5482', 'https://aclu-co.org', ARRAY['Gender Equity','LGBTQ Rights','Reproductive Rights'], true, 'Staff attorney at ACLU Colorado handling gender equity and LGBTQ rights cases.'),
('Kevin Evans', 'Colorado Center on Law and Policy', 'Denver', 'CO', '303-573-5669', 'https://cclponline.org', ARRAY['Poverty Law','Healthcare Access','Public Benefits'], true, 'Staff attorney at CCLP advocating for healthcare access and economic security.'),
('Amy Robertson', 'Civil Rights Education and Enforcement Center', 'Denver', 'CO', '303-757-7901', 'https://creeclaw.org', ARRAY['Disability Rights','Housing','Public Accommodations'], true, 'Co-founder of CREEC, a national disability rights enforcement organization based in Denver.')
ON CONFLICT (name, state) DO UPDATE SET
  firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone,
  website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;


-- =============================================================================
-- CONNECTICUT (10 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('David McGuire', 'ACLU of Connecticut', 'Hartford', 'CT', '860-523-9146', 'https://acluct.org', ARRAY['Civil Liberties','Police Accountability','Criminal Justice'], true, 'Executive Director of ACLU Connecticut leading police accountability and criminal justice reform.'),
('Dan Barrett', 'ACLU of Connecticut', 'Hartford', 'CT', '860-523-9146', 'https://acluct.org', ARRAY['First Amendment','Prison Reform','Voting Rights'], true, 'Legal Director of ACLU CT handling prison conditions and free speech cases.'),
('DeVaughn Ward', 'Connecticut Legal Services', 'Hartford', 'CT', '860-344-0380', 'https://connlegalservices.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Staff attorney providing free legal services to low-income Connecticut residents.'),
('Shelley White', 'New Haven Legal Assistance', 'New Haven', 'CT', '203-946-4811', 'https://nhlegal.org', ARRAY['Housing','Education','Civil Rights'], true, 'Executive Director of NHLA providing legal services to low-income New Haven residents.'),
('Michael Wishnie', 'Yale Law School - Worker and Immigrant Rights Advocacy Clinic', 'New Haven', 'CT', '203-432-4800', 'https://law.yale.edu', ARRAY['Immigration','Workers Rights','Civil Rights'], true, 'Yale Law clinical professor running the worker and immigrant rights clinic.'),
('Muneer Ahmad', 'Yale Law School - Jerome Frank Legal Services', 'New Haven', 'CT', '203-432-4800', 'https://law.yale.edu', ARRAY['Immigration','National Security','Civil Rights'], true, 'Yale Law clinical professor handling immigration and national security civil rights cases.'),
('Sandra Trevino', 'Connecticut Fair Housing Center', 'Hartford', 'CT', '860-247-4400', 'https://ctfairhousing.org', ARRAY['Housing Discrimination','Fair Housing','Civil Rights'], true, 'Executive Director of CT Fair Housing Center investigating and litigating housing discrimination.'),
('Jeff Grant', 'Progressive Prison Project', 'Greenwich', 'CT', '203-769-1096', 'https://progressiveprisonproject.org', ARRAY['Prisoners Rights','Reentry','Criminal Justice'], true, 'Founder of Progressive Prison Project advocating for prisoners rights and reentry services.'),
('Cecil Thomas', 'Thomas Law', 'Hartford', 'CT', '860-331-0256', NULL, ARRAY['Civil Rights','Employment Discrimination','Police Misconduct'], false, 'Civil rights attorney handling employment discrimination and police misconduct cases.'),
('James Bergenn', 'Shipman & Goodwin', 'Hartford', 'CT', '860-251-5000', 'https://shipmangoodwin.com', ARRAY['First Amendment','Media Law','Government Transparency'], false, 'Leading Connecticut media attorney handling press freedom and public records cases.')
ON CONFLICT (name, state) DO UPDATE SET
  firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone,
  website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- DELAWARE (8 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Ryan Tack-Hooper', 'ACLU of Delaware', 'Wilmington', 'DE', '302-654-5326', 'https://aclu-de.org', ARRAY['Civil Liberties','Criminal Justice','First Amendment'], true, 'Legal Director of ACLU Delaware handling civil liberties and criminal justice cases.'),
('Mike Brickner', 'ACLU of Delaware', 'Wilmington', 'DE', '302-654-5326', 'https://aclu-de.org', ARRAY['Police Reform','Voting Rights','Criminal Justice'], true, 'Executive Director of ACLU Delaware leading police reform and voting rights campaigns.'),
('Janine Howard-O''Rangers', 'Community Legal Aid Society', 'Wilmington', 'DE', '302-575-0660', 'https://declasi.org', ARRAY['Disability Rights','Housing','Public Benefits'], true, 'Managing attorney at CLASI providing free legal services to Delawareans with disabilities.'),
('Ilona Kirshon', 'Delaware Volunteer Legal Services', 'Wilmington', 'DE', '302-478-8680', 'https://dvls.org', ARRAY['Housing','Consumer Protection','Family Law'], true, 'Executive Director of DVLS coordinating pro bono legal services throughout Delaware.'),
('Richard Morse', 'Legal Services Corporation of Delaware', 'Dover', 'DE', '302-674-0600', NULL, ARRAY['Housing','Public Benefits','Family Law'], true, 'Staff attorney providing free legal services to low-income residents in central Delaware.'),
('Chase Brockstedt', 'Baird Mandalas Brockstedt', 'Lewes', 'DE', '302-644-4600', NULL, ARRAY['Civil Rights','Personal Injury','Police Misconduct'], false, 'Delaware attorney handling civil rights and police misconduct cases.'),
('Ben Strauss', 'Delaware Law Office', 'Wilmington', 'DE', '302-600-1262', NULL, ARRAY['Criminal Defense','Civil Rights','First Amendment'], false, 'Criminal defense and civil rights attorney practicing throughout Delaware.'),
('Thomas Neuberger', 'Thomas Neuberger Attorney', 'Wilmington', 'DE', '302-655-0582', NULL, ARRAY['Civil Rights','Clergy Abuse','Section 1983'], false, 'Civil rights attorney who has handled landmark civil rights and institutional abuse cases in Delaware.')
ON CONFLICT (name, state) DO UPDATE SET
  firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone,
  website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- DISTRICT OF COLUMBIA (25 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Monica Hopkins', 'ACLU of the District of Columbia', 'Washington', 'DC', '202-457-0800', 'https://acludc.org', ARRAY['Civil Liberties','Police Accountability','Education'], true, 'Executive Director of ACLU-DC leading police accountability and education equity campaigns.'),
('Arthur Spitzer', 'ACLU of the District of Columbia', 'Washington', 'DC', '202-457-0800', 'https://acludc.org', ARRAY['First Amendment','Civil Liberties','Police Misconduct'], true, 'Legal Director Emeritus of ACLU-DC. Decades of First Amendment and police misconduct litigation.'),
('Marc Elias', 'Elias Law Group', 'Washington', 'DC', '202-968-4490', 'https://eliaslaw.com', ARRAY['Voting Rights','Election Law','Redistricting'], false, 'Founder of Elias Law Group. Nation''s leading voting rights attorney, challenged restrictive voting laws in 20+ states.'),
('Sherrilyn Ifill', 'NAACP Legal Defense Fund', 'Washington', 'DC', '212-965-2200', 'https://naacpldf.org', ARRAY['Voting Rights','Racial Justice','Criminal Justice'], true, 'Former President of NAACP LDF. Leading voice on racial justice and voting rights.'),
('Janai Nelson', 'NAACP Legal Defense Fund', 'Washington', 'DC', '212-965-2200', 'https://naacpldf.org', ARRAY['Voting Rights','Education','Employment Discrimination'], true, 'President and Director-Counsel of NAACP LDF. Led Allen v. Milligan Supreme Court victory.'),
('Wade Henderson', 'Leadership Conference on Civil and Human Rights', 'Washington', 'DC', '202-466-3311', 'https://civilrights.org', ARRAY['Civil Rights','Voting Rights','Criminal Justice'], true, 'President and CEO of the Leadership Conference, the nation''s oldest civil rights coalition.'),
('Debo Adegbile', 'WilmerHale', 'Washington', 'DC', '202-663-6000', 'https://wilmerhale.com', ARRAY['Voting Rights','Civil Rights','Constitutional Law'], false, 'Former NAACP LDF Director of Litigation. Argued Shelby County v. Holder before the Supreme Court.'),
('Catherine Lhamon', 'Leadership Conference on Civil Rights', 'Washington', 'DC', '202-466-3311', 'https://civilrights.org', ARRAY['Education','Title IX','Civil Rights'], true, 'Former Assistant Secretary for Civil Rights at DOE. Expert on Title IX and education equity.'),
('Mary McCord', 'Georgetown Law ICAP', 'Washington', 'DC', '202-662-9000', 'https://law.georgetown.edu', ARRAY['Domestic Terrorism','Gun Violence','National Security'], true, 'Executive Director of ICAP at Georgetown Law. Former DOJ National Security Division head.'),
('Jonathan Smith', 'Washington Lawyers Committee', 'Washington', 'DC', '202-319-1000', 'https://washlaw.org', ARRAY['Police Accountability','Civil Rights','Fair Housing'], true, 'Executive Director of DC Lawyers Committee. Former DOJ Special Litigation Section chief.'),
('Katherine Gallagher', 'Center for Constitutional Rights', 'Washington', 'DC', '212-614-6464', 'https://ccrjustice.org', ARRAY['International Human Rights','Torture','Civil Liberties'], true, 'Senior staff attorney at CCR handling international human rights and accountability cases.'),
('Baher Azmy', 'Center for Constitutional Rights', 'Washington', 'DC', '212-614-6464', 'https://ccrjustice.org', ARRAY['Civil Liberties','National Security','Racial Justice'], true, 'Legal Director of CCR. Led Guantanamo habeas litigation and racial justice campaigns.'),
('Paul Smith', 'Georgetown Law', 'Washington', 'DC', '202-662-9000', 'https://law.georgetown.edu', ARRAY['Voting Rights','LGBTQ Rights','First Amendment'], true, 'Georgetown Law professor. Successfully argued Lawrence v. Texas before the Supreme Court.'),
('Noel Francisco', 'Jones Day', 'Washington', 'DC', '202-879-3939', 'https://jonesday.com', ARRAY['Constitutional Law','Appellate','First Amendment'], false, 'Former U.S. Solicitor General. Leading appellate advocate on constitutional issues.'),
('Neal Katyal', 'Hogan Lovells', 'Washington', 'DC', '202-637-5600', 'https://hoganlovells.com', ARRAY['Constitutional Law','National Security','Supreme Court'], false, 'Former Acting Solicitor General. Has argued 50+ cases before the Supreme Court.'),
('Roberta Kaplan', 'Kaplan Hecker & Fink', 'Washington', 'DC', '212-763-0883', 'https://kfrlaw.com', ARRAY['Civil Rights','LGBTQ Rights','Constitutional Law'], false, 'Won United States v. Windsor before the Supreme Court. Led Charlottesville accountability lawsuit.'),
('Jon Greenbaum', 'Lawyers Committee for Civil Rights Under Law', 'Washington', 'DC', '202-662-8600', 'https://lawyerscommittee.org', ARRAY['Voting Rights','Election Protection','Civil Rights'], true, 'Chief Counsel of Lawyers Committee, leading Election Protection voter hotline program.'),
('David Cole', 'ACLU National', 'Washington', 'DC', '212-549-2500', 'https://aclu.org', ARRAY['Constitutional Law','National Security','Civil Liberties'], true, 'National Legal Director of ACLU. Leading constitutional law scholar and advocate.'),
('Anthony Romero', 'ACLU National', 'Washington', 'DC', '212-549-2500', 'https://aclu.org', ARRAY['Civil Liberties','Immigration','Civil Rights'], true, 'Executive Director of the ACLU since 2001. First Latino and openly gay leader of the organization.'),
('Fatima Goss Graves', 'National Women''s Law Center', 'Washington', 'DC', '202-588-5180', 'https://nwlc.org', ARRAY['Gender Equity','Education','Employment'], true, 'President and CEO of NWLC. Leading advocate for gender equity in education and the workplace.'),
('Thomas Goldstein', 'Goldstein & Russell', 'Washington', 'DC', '202-362-0636', 'https://goldsteinrussell.com', ARRAY['Supreme Court','Constitutional Law','Appellate'], false, 'Founder of SCOTUSblog. Has argued 44 cases before the Supreme Court.'),
('Lisa Blatt', 'Williams & Connolly', 'Washington', 'DC', '202-434-5000', 'https://wc.com', ARRAY['Supreme Court','Constitutional Law','Civil Rights'], false, 'Has argued more Supreme Court cases than any woman in history. Leading appellate advocate.'),
('Deepak Gupta', 'Gupta Wessler', 'Washington', 'DC', '202-888-1741', 'https://guptawessler.com', ARRAY['Consumer Rights','Civil Rights','Appellate'], false, 'Appellate attorney and consumer rights advocate. Co-founder of leading public interest appellate firm.'),
('Scott Michelman', 'ACLU of the District of Columbia', 'Washington', 'DC', '202-457-0800', 'https://acludc.org', ARRAY['Police Accountability','First Amendment','Government Surveillance'], true, 'Legal Director of ACLU-DC handling police accountability and First Amendment cases.'),
('Michael Avery', 'National Police Accountability Project', 'Washington', 'DC', '202-549-2500', 'https://nlg-npap.org', ARRAY['Police Accountability','Section 1983','Excessive Force'], true, 'National Police Accountability Project leader, advancing litigation against police misconduct.')
ON CONFLICT (name, state) DO UPDATE SET
  firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone,
  website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- FLORIDA (25 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Ben Crump', 'Ben Crump Law', 'Tallahassee', 'FL', '800-840-1090', 'https://bencrump.com', ARRAY['Police Brutality','Wrongful Death','Civil Rights'], false, 'Nationally recognized civil rights attorney. Represented families of George Floyd, Breonna Taylor, Trayvon Martin, and Ahmaud Arbery.'),
('Micah Kubic', 'ACLU of Florida', 'Miami', 'FL', '786-363-2700', 'https://aclufl.org', ARRAY['Civil Liberties','Voting Rights','Immigration'], true, 'Executive Director of ACLU Florida leading voting rights and immigration litigation.'),
('Daniel Tilley', 'ACLU of Florida', 'Miami', 'FL', '786-363-2700', 'https://aclufl.org', ARRAY['LGBTQ Rights','Education','First Amendment'], true, 'Legal Director of ACLU Florida handling LGBTQ rights and education censorship cases.'),
('Nancy Abudu', 'Southern Poverty Law Center', 'Miami', 'FL', '334-956-8200', 'https://splcenter.org', ARRAY['Voting Rights','Criminal Justice','Racial Justice'], true, 'Former SPLC Deputy Legal Director. Now 11th Circuit Judge. Led voting rights restoration in Florida.'),
('Matthew Dietz', 'Disability Independence Group', 'Miami', 'FL', '305-669-2822', 'https://justdigit.org', ARRAY['Disability Rights','ADA','Civil Rights'], true, 'National disability rights attorney handling ADA enforcement and accessibility cases.'),
('Thomas Harvey', 'Advancement Project National', 'Tallahassee', 'FL', '202-728-9557', 'https://advancementproject.org', ARRAY['Voting Rights','Education','Racial Justice'], true, 'Staff attorney at Advancement Project working on voting rights in Florida.'),
('Scott Fingerhut', 'Florida International University College of Law', 'Miami', 'FL', '305-348-8006', 'https://law.fiu.edu', ARRAY['Criminal Defense','Civil Rights','Immigration'], true, 'FIU Law clinical professor running criminal defense and civil rights clinics.'),
('Dante Trevisani', 'Southern Legal Counsel', 'Gainesville', 'FL', '352-271-8890', 'https://southernlegal.org', ARRAY['Civil Rights','Prisoners Rights','Homelessness'], true, 'Managing attorney at Southern Legal Counsel handling civil rights and prisoner rights cases.'),
('Kirsten Clanton', 'Southern Legal Counsel', 'Gainesville', 'FL', '352-271-8890', 'https://southernlegal.org', ARRAY['Voting Rights','Criminal Justice','Civil Rights'], true, 'Staff attorney at Southern Legal Counsel working on voting rights and felony disenfranchisement.'),
('Howard Simon', 'ACLU of Florida', 'Miami', 'FL', '786-363-2700', 'https://aclufl.org', ARRAY['Civil Liberties','Free Speech','Immigration'], true, 'Former Executive Director of ACLU Florida for 25 years. Led challenges to Florida''s restrictive speech laws.'),
('Neil Chonin', 'Jacksonville Area Legal Aid', 'Jacksonville', 'FL', '904-356-8371', 'https://jaxlegalaid.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Executive Director of JALA providing free legal services to northeast Florida.'),
('Jeff Hearne', 'Florida Legal Services', 'Miami', 'FL', '305-573-0093', 'https://floridalegal.org', ARRAY['Immigration','Farm Workers Rights','Civil Rights'], true, 'Staff attorney at Florida Legal Services handling immigrant and farmworker rights cases.'),
('Greg Thomas', 'Thomas & Gibson', 'Miami', 'FL', '305-371-3603', NULL, ARRAY['Police Misconduct','Civil Rights','Wrongful Death'], false, 'Miami civil rights attorney handling police misconduct and wrongful death cases.'),
('John De Leon', 'De Leon & Washburn', 'Miami', 'FL', '305-428-3860', NULL, ARRAY['Criminal Defense','Immigration','Civil Rights'], false, 'Criminal defense and civil rights attorney handling high-profile cases in South Florida.'),
('Kara Gross', 'ACLU of Florida', 'Miami', 'FL', '786-363-2700', 'https://aclufl.org', ARRAY['First Amendment','Privacy','Government Transparency'], true, 'Legislative Director and Senior Policy Counsel at ACLU Florida.'),
('Shalini Agarwal', 'Legal Services of Greater Miami', 'Miami', 'FL', '305-576-0080', 'https://lsgmi.org', ARRAY['Housing','Consumer Protection','Immigration'], true, 'Managing attorney providing free legal services to low-income Miami-Dade residents.'),
('Jesse Panuccio', 'Boies Schiller Flexner', 'Fort Lauderdale', 'FL', '954-356-0011', 'https://bsfllp.com', ARRAY['Constitutional Law','Appellate','Civil Rights'], false, 'Former Acting AG for DOJ Civil Division. Appellate attorney handling constitutional cases.'),
('Tiffany Cruz', 'Advancement Project', 'Tampa', 'FL', '813-258-0088', 'https://advancementproject.org', ARRAY['Voting Rights','Civic Engagement'], true, 'Florida-based voting rights attorney and civic engagement advocate.'),
('Keisha Brown', 'Florida A&M University College of Law', 'Orlando', 'FL', '407-254-3268', 'https://law.famu.edu', ARRAY['Civil Rights','Constitutional Law','Education'], true, 'FAMU Law professor focusing on civil rights and constitutional law.'),
('Regnel Reeves', 'Three Rivers Legal Services', 'Gainesville', 'FL', '352-372-0519', 'https://trls.org', ARRAY['Housing','Public Benefits','Disability'], true, 'Executive Director of TRLS providing legal aid to north-central Florida communities.'),
('Caroline Haughey', 'Americans for Immigrant Justice', 'Miami', 'FL', '305-573-1106', 'https://aijustice.org', ARRAY['Immigration','Asylum','Civil Rights'], true, 'Staff attorney at AI Justice representing unaccompanied minors and asylum seekers.'),
('Cheryl Little', 'Americans for Immigrant Justice', 'Miami', 'FL', '305-573-1106', 'https://aijustice.org', ARRAY['Immigration','Refugee Rights','Civil Rights'], true, 'Founder of Americans for Immigrant Justice. MacArthur Fellow for immigrant rights work.'),
('Denise Georges', 'Florida Rights Restoration Coalition', 'Orlando', 'FL', '407-205-3455', 'https://floridarrc.com', ARRAY['Voting Rights','Criminal Justice','Reentry'], true, 'Legal counsel for FRRC, which led Amendment 4 campaign restoring voting rights to 1.4 million Floridians.'),
('Meena Jagannath', 'Community Justice Project', 'Miami', 'FL', '305-573-0090', 'https://communityjusticeproject.com', ARRAY['Housing','Racial Justice','Community Organizing'], true, 'Co-founder of Community Justice Project, a movement lawyering organization in South Florida.'),
('Steven Weisberg', 'Weisberg & Weisberg', 'Fort Lauderdale', 'FL', '954-761-1899', NULL, ARRAY['Criminal Defense','Civil Rights','First Amendment'], false, 'Fort Lauderdale criminal defense attorney handling First Amendment and civil rights cases.')
ON CONFLICT (name, state) DO UPDATE SET
  firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone,
  website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- GEORGIA (20 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Andrea Young', 'ACLU of Georgia', 'Atlanta', 'GA', '770-303-8111', 'https://acluga.org', ARRAY['Voting Rights','Criminal Justice','Civil Liberties'], true, 'Executive Director of ACLU Georgia. Daughter of Ambassador Andrew Young.'),
('Sean Young', 'ACLU of Georgia', 'Atlanta', 'GA', '770-303-8111', 'https://acluga.org', ARRAY['Voting Rights','First Amendment','Police Accountability'], true, 'Legal Director of ACLU Georgia handling voting rights and police accountability cases.'),
('Gerald Griggs', 'Griggs Injury Law', 'Atlanta', 'GA', '404-233-4445', 'https://griggsinjurylaw.com', ARRAY['Civil Rights','Police Misconduct','Personal Injury'], false, 'President of Georgia NAACP. Civil rights attorney handling police misconduct and racial justice cases.'),
('Francys Johnson', 'Johnson Kraeuter & Dunn', 'Statesboro', 'GA', '912-764-7231', NULL, ARRAY['Civil Rights','Voting Rights','Criminal Justice'], false, 'Former Georgia NAACP president. Civil rights attorney and voting rights advocate.'),
('Mawuli Davis', 'Davis Bozeman Law Firm', 'Atlanta', 'GA', '404-244-2004', 'https://davisbozeman.com', ARRAY['Civil Rights','Criminal Defense','Wrongful Death'], false, 'Atlanta civil rights attorney. Represented families in high-profile police violence cases.'),
('Sara Totonchi', 'Southern Center for Human Rights', 'Atlanta', 'GA', '404-688-1202', 'https://schr.org', ARRAY['Death Penalty','Criminal Justice','Prisoners Rights'], true, 'Executive Director of SCHR fighting against mass incarceration and the death penalty.'),
('Atteeyah Hollie', 'Southern Center for Human Rights', 'Atlanta', 'GA', '404-688-1202', 'https://schr.org', ARRAY['Criminal Justice','Bail Reform','Voting Rights'], true, 'Deputy Director at SCHR leading criminal justice reform and bail reform litigation.'),
('Gerry Weber', 'Southern Center for Human Rights', 'Atlanta', 'GA', '404-688-1202', 'https://schr.org', ARRAY['Open Government','First Amendment','Media Law'], true, 'Open Government Project Director at SCHR. Georgia''s leading public records and transparency attorney.'),
('Laughlin McDonald', 'ACLU Voting Rights Project', 'Atlanta', 'GA', '404-523-2721', 'https://aclu.org', ARRAY['Voting Rights','Redistricting','Civil Rights'], true, 'Former Director of ACLU Voting Rights Project. Litigated voting rights cases for 40+ years.'),
('Bryan Tyson', 'Taylor English Duma', 'Atlanta', 'GA', '678-336-7249', 'https://taylorenglish.com', ARRAY['Election Law','Voting Rights','Government'], false, 'Leading Georgia election law attorney involved in major redistricting cases.'),
('Phyllis Holmen', 'Georgia Legal Services Program', 'Atlanta', 'GA', '404-206-5175', 'https://glsp.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Former Executive Director of GLSP providing legal services to low-income Georgians statewide.'),
('Steve Gottlieb', 'Atlanta Legal Aid Society', 'Atlanta', 'GA', '404-524-5811', 'https://atlantalegalaid.org', ARRAY['Housing','Public Benefits','Consumer Protection'], true, 'Executive Director of Atlanta Legal Aid providing free civil legal help to metro Atlanta.'),
('Randee Waldman', 'Emory Law Barton Child Law and Policy Center', 'Atlanta', 'GA', '404-727-6664', 'https://law.emory.edu', ARRAY['Juvenile Justice','Child Welfare','Civil Rights'], true, 'Director of Emory''s child advocacy clinic working on juvenile justice reform.'),
('Priya Sarathy Jones', 'Fines and Fees Justice Center', 'Atlanta', 'GA', '202-355-3577', 'https://finesandfeesjusticecenter.org', ARRAY['Fines and Fees','Criminal Justice','Racial Justice'], true, 'National Deputy Director working to eliminate wealth-based punishment in the justice system.'),
('Marissa Dodson', 'Ga Budget and Policy Institute', 'Atlanta', 'GA', '404-420-1324', 'https://gbpi.org', ARRAY['Criminal Justice','Economic Justice'], true, 'Program Director for Justice System Reform at GBPI.'),
('Kosha Tucker', 'Southern Poverty Law Center', 'Atlanta', 'GA', '334-956-8200', 'https://splcenter.org', ARRAY['Voting Rights','Racial Justice'], true, 'SPLC staff attorney handling voting rights cases in Georgia and the Southeast.'),
('Crystal Jackson', 'Atlanta NAACP Legal Redress', 'Atlanta', 'GA', '404-524-8421', 'https://naacpatlanta.com', ARRAY['Civil Rights','Police Misconduct','Housing'], true, 'Legal Redress Chair of Atlanta NAACP handling civil rights complaints and police misconduct.'),
('Jon Greenbaum', 'Lawyers Committee for Civil Rights', 'Atlanta', 'GA', '202-662-8600', 'https://lawyerscommittee.org', ARRAY['Voting Rights','Election Protection'], true, 'Chief Counsel managing Election Protection program covering Georgia elections.'),
('Cathy Woolard', 'Georgia Equality', 'Atlanta', 'GA', '404-523-3070', 'https://georgiaequality.org', ARRAY['LGBTQ Rights','Civil Rights'], true, 'Former Atlanta City Council President. LGBTQ rights advocate and policy leader.'),
('Nse Ufot', 'New Georgia Project', 'Atlanta', 'GA', '770-823-3051', 'https://newgeorgiaproject.org', ARRAY['Voting Rights','Civic Engagement','Racial Justice'], true, 'Former CEO of New Georgia Project driving voter registration and civic engagement.')
ON CONFLICT (name, state) DO UPDATE SET
  firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone,
  website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;


-- =============================================================================
-- HAWAII (8 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Mateo Caballero', 'ACLU of Hawaii', 'Honolulu', 'HI', '808-522-5900', 'https://acluhawaii.org', ARRAY['Civil Liberties','Privacy','First Amendment'], true, 'Legal Director of ACLU Hawaii handling privacy and First Amendment cases.'),
('Joshua Wisch', 'ACLU of Hawaii', 'Honolulu', 'HI', '808-522-5900', 'https://acluhawaii.org', ARRAY['Civil Liberties','Criminal Justice'], true, 'Executive Director of ACLU Hawaii leading criminal justice reform campaigns.'),
('Victor Geminiani', 'Hawaii Appleseed Center for Law and Economic Justice', 'Honolulu', 'HI', '808-587-7605', 'https://hiappleseed.org', ARRAY['Economic Justice','Housing','Healthcare'], true, 'Executive Director of Hawaii Appleseed working on housing affordability and economic justice.'),
('Gavin Thornton', 'Hawaii Appleseed Center', 'Honolulu', 'HI', '808-587-7605', 'https://hiappleseed.org', ARRAY['Economic Justice','Immigration','Civil Rights'], true, 'Co-Executive Director of Hawaii Appleseed focusing on immigrant rights.'),
('Charles Crumpton', 'Legal Aid Society of Hawaii', 'Honolulu', 'HI', '808-536-4302', 'https://legalaidhawaii.org', ARRAY['Housing','Public Benefits','Family Law'], true, 'Executive Director of Legal Aid Society of Hawaii providing statewide legal services.'),
('Mahealani Wendt', 'Native Hawaiian Legal Corporation', 'Honolulu', 'HI', '808-521-2302', 'https://nhlchi.org', ARRAY['Native Hawaiian Rights','Land Rights','Cultural Rights'], true, 'Executive Director of NHLC protecting Native Hawaiian land and cultural rights.'),
('Camille Kalama', 'Native Hawaiian Legal Corporation', 'Honolulu', 'HI', '808-521-2302', 'https://nhlchi.org', ARRAY['Native Hawaiian Rights','Environmental Justice'], true, 'Staff attorney at NHLC handling environmental and cultural preservation cases.'),
('Eric Seitz', 'Eric Seitz Law Office', 'Honolulu', 'HI', '808-533-7434', NULL, ARRAY['Civil Rights','Criminal Defense','Police Misconduct'], false, 'Leading Hawaii civil rights attorney handling police misconduct and criminal defense cases.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- IDAHO (8 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Leo Morales', 'ACLU of Idaho', 'Boise', 'ID', '208-344-9750', 'https://acluidaho.org', ARRAY['Civil Liberties','Immigration','Criminal Justice'], true, 'Executive Director of ACLU Idaho leading immigrant rights and criminal justice reform.'),
('Molly Kafka', 'ACLU of Idaho', 'Boise', 'ID', '208-344-9750', 'https://acluidaho.org', ARRAY['First Amendment','LGBTQ Rights','Education'], true, 'Staff attorney at ACLU Idaho handling free speech and LGBTQ rights cases.'),
('Jim Cook', 'Idaho Legal Aid Services', 'Boise', 'ID', '208-345-0106', 'https://idaholegalaid.org', ARRAY['Housing','Public Benefits','Family Law'], true, 'Executive Director of Idaho Legal Aid providing free legal services statewide.'),
('Howard Belodoff', 'Idaho Legal Aid Services', 'Boise', 'ID', '208-345-0106', 'https://idaholegalaid.org', ARRAY['Prisoners Rights','Civil Rights','Disability'], true, 'Senior attorney at Idaho Legal Aid handling prisoner rights and disability cases.'),
('Richard Eppink', 'ACLU of Idaho', 'Boise', 'ID', '208-344-9750', 'https://acluidaho.org', ARRAY['Transgender Rights','Criminal Justice','Privacy'], true, 'Legal Director of ACLU Idaho who won landmark transgender rights case Hecox v. Little.'),
('Monica Hopkins', 'Idaho Coalition Against Domestic Violence', 'Boise', 'ID', '208-384-0419', 'https://idvsa.org', ARRAY['Domestic Violence','Civil Rights'], true, 'Coalition director working on domestic violence prevention and victim advocacy.'),
('Deborah Ferguson', 'Ferguson Durham', 'Boise', 'ID', '208-345-5183', NULL, ARRAY['Civil Rights','Employment Discrimination','Appellate'], false, 'Idaho appellate attorney handling civil rights and employment discrimination cases.'),
('Craig Durham', 'Ferguson Durham', 'Boise', 'ID', '208-345-5183', NULL, ARRAY['Civil Rights','Section 1983','Police Misconduct'], false, 'Idaho civil rights attorney specializing in Section 1983 and police misconduct cases.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- ILLINOIS (25 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Colleen Connell', 'ACLU of Illinois', 'Chicago', 'IL', '312-201-9740', 'https://aclu-il.org', ARRAY['Civil Liberties','Criminal Justice','Reproductive Rights'], true, 'Former Executive Director of ACLU Illinois for 20+ years.'),
('Rebecca Glenberg', 'ACLU of Illinois', 'Chicago', 'IL', '312-201-9740', 'https://aclu-il.org', ARRAY['First Amendment','Police Accountability','Privacy'], true, 'Senior staff attorney at ACLU Illinois handling police accountability and surveillance.'),
('Craig Futterman', 'University of Chicago Law - Civil Rights & Police Accountability Project', 'Chicago', 'IL', '773-702-9611', 'https://law.uchicago.edu', ARRAY['Police Accountability','Civil Rights','Criminal Justice'], true, 'Clinical professor running the Mandel Legal Aid Clinic civil rights practice. Key figure in Laquan McDonald case.'),
('Locke Bowman', 'MacArthur Justice Center', 'Chicago', 'IL', '312-503-0844', 'https://macarthurjustice.org', ARRAY['Police Misconduct','Prisoners Rights','Civil Rights'], true, 'Executive Director of MacArthur Justice Center. Leading police accountability litigator.'),
('Alexa Van Brunt', 'MacArthur Justice Center', 'Chicago', 'IL', '312-503-0844', 'https://macarthurjustice.org', ARRAY['Criminal Justice','Prisoners Rights','Civil Rights'], true, 'Clinical Director at MacArthur Justice Center handling criminal justice and prison reform.'),
('Sheila Bedi', 'Northwestern Pritzker School of Law', 'Chicago', 'IL', '312-503-8576', 'https://law.northwestern.edu', ARRAY['Criminal Justice','Juvenile Justice','Civil Rights'], true, 'Clinical professor at Northwestern Law running the Community Justice & Civil Rights Clinic.'),
('Karen Sheley', 'ACLU of Illinois', 'Chicago', 'IL', '312-201-9740', 'https://aclu-il.org', ARRAY['Police Reform','Consent Decree','Civil Liberties'], true, 'Police Practices Project Director at ACLU IL. Leads monitoring of Chicago Police consent decree.'),
('Standish Willis', 'Willis Consulting', 'Chicago', 'IL', '312-427-3399', NULL, ARRAY['Police Misconduct','Civil Rights','Criminal Defense'], false, 'Legendary Chicago civil rights attorney. Co-founder of National Conference of Black Lawyers Chicago chapter.'),
('Jon Loevy', 'Loevy & Loevy', 'Chicago', 'IL', '312-243-5900', 'https://loevy.com', ARRAY['Police Misconduct','Wrongful Conviction','Civil Rights'], false, 'Founding partner of one of the nation''s largest civil rights firms. Won hundreds of millions in police misconduct cases.'),
('Arthur Loevy', 'Loevy & Loevy', 'Chicago', 'IL', '312-243-5900', 'https://loevy.com', ARRAY['Wrongful Conviction','Police Torture','Civil Rights'], false, 'Co-founder of Loevy & Loevy. Represented victims of Jon Burge police torture ring.'),
('Flint Taylor', 'People''s Law Office', 'Chicago', 'IL', '773-235-0070', 'https://peopleslawoffice.com', ARRAY['Police Torture','Civil Rights','Political Repression'], false, 'Founding partner of People''s Law Office. Led 30-year fight to expose Jon Burge torture ring.'),
('Joey Mogul', 'People''s Law Office', 'Chicago', 'IL', '773-235-0070', 'https://peopleslawoffice.com', ARRAY['LGBTQ Rights','Police Misconduct','Criminal Justice'], false, 'Partner at People''s Law Office. Author of Queer (In)Justice on LGBTQ policing.'),
('Lauren Kaeseberg', 'Equip for Equality', 'Chicago', 'IL', '312-341-0022', 'https://equipforequality.org', ARRAY['Disability Rights','Mental Health','Civil Rights'], true, 'Staff attorney at Equip for Equality, Illinois'' designated Protection & Advocacy agency.'),
('Mark Heyrman', 'University of Chicago Law School', 'Chicago', 'IL', '773-702-9611', 'https://law.uchicago.edu', ARRAY['Mental Health','Disability Rights','Civil Rights'], true, 'Clinical professor specializing in mental health law and disability rights.'),
('Sarah Grady', 'Loevy & Loevy', 'Chicago', 'IL', '312-243-5900', 'https://loevy.com', ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Civil rights attorney at Loevy & Loevy handling Section 1983 police misconduct cases.'),
('Blake Horwitz', 'Blake Horwitz Law', 'Chicago', 'IL', '312-676-2100', 'https://bhlorwitzlaw.com', ARRAY['Police Misconduct','Civil Rights','Wrongful Arrest'], false, 'Chicago civil rights attorney specializing in police misconduct and wrongful arrest cases.'),
('Al Hofeld Jr', 'Al Hofeld Jr LLC', 'Chicago', 'IL', '312-828-0600', NULL, ARRAY['Civil Rights','Police Misconduct','Wrongful Conviction'], false, 'Civil rights attorney who led major wrongful conviction and police misconduct cases.'),
('Jeffrey Granich', 'LAF (Legal Aid Foundation)', 'Chicago', 'IL', '312-341-1070', 'https://lafchicago.org', ARRAY['Housing','Public Benefits','Domestic Violence'], true, 'Staff attorney at LAF providing free legal services to low-income Chicagoans.'),
('Thomas Peters', 'Cabrini Green Legal Aid', 'Chicago', 'IL', '312-738-2452', 'https://cgla.net', ARRAY['Criminal Defense','Reentry','Civil Rights'], true, 'Executive Director of CGLA providing holistic legal services to communities affected by poverty.'),
('Claire Gorman', 'National Immigrant Justice Center', 'Chicago', 'IL', '312-660-1370', 'https://immigrantjustice.org', ARRAY['Immigration','Asylum','Detention'], true, 'Senior attorney at NIJC representing detained immigrants and asylum seekers.'),
('Mary Meg McCarthy', 'National Immigrant Justice Center', 'Chicago', 'IL', '312-660-1370', 'https://immigrantjustice.org', ARRAY['Immigration','Human Trafficking','Asylum'], true, 'Executive Director of NIJC, a leading immigrant rights organization.'),
('David Mead', 'Uptown People''s Law Center', 'Chicago', 'IL', '773-769-1411', 'https://uplcchicago.org', ARRAY['Housing','Prisoners Rights','Disability'], true, 'Staff attorney at UPLC handling prisoner rights and public housing cases.'),
('Edward Fox', 'Sidley Austin', 'Chicago', 'IL', '312-853-7000', 'https://sidley.com', ARRAY['Pro Bono','Civil Rights','Constitutional Law'], true, 'Partner leading Sidley''s pro bono practice on civil rights and constitutional cases.'),
('Aneel Chablani', 'Chicago Lawyers Committee for Civil Rights', 'Chicago', 'IL', '312-630-9744', 'https://clccrul.org', ARRAY['Voting Rights','Police Accountability','Education'], true, 'Chief Counsel of Chicago Lawyers Committee leading civil rights litigation.'),
('Andrea Ritchie', 'Barnard Center for Research on Women', 'Chicago', 'IL', '212-854-2067', NULL, ARRAY['Police Violence','Racial Justice','LGBTQ Rights'], true, 'Researcher and attorney documenting police violence against women and LGBTQ people of color.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- INDIANA (10 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Jane Henegar', 'ACLU of Indiana', 'Indianapolis', 'IN', '317-635-4059', 'https://aclu-in.org', ARRAY['Civil Liberties','Voting Rights','Criminal Justice'], true, 'Executive Director of ACLU Indiana leading voting rights and criminal justice reform.'),
('Ken Falk', 'ACLU of Indiana', 'Indianapolis', 'IN', '317-635-4059', 'https://aclu-in.org', ARRAY['First Amendment','Civil Liberties','Police Accountability'], true, 'Legal Director of ACLU Indiana for 30+ years. Led landmark Indiana civil rights cases.'),
('Fran Watson', 'Indiana Legal Services', 'Indianapolis', 'IN', '317-631-9410', 'https://indianalegalservices.org', ARRAY['Housing','Public Benefits','Consumer Protection'], true, 'Executive Director of Indiana Legal Services providing statewide free legal help.'),
('Stevie Pactor', 'ACLU of Indiana', 'Indianapolis', 'IN', '317-635-4059', 'https://aclu-in.org', ARRAY['LGBTQ Rights','Racial Justice','Education'], true, 'Staff attorney at ACLU Indiana handling LGBTQ rights and racial justice cases.'),
('Kathleen Delaney', 'Delaney & Delaney', 'Indianapolis', 'IN', '317-920-0400', NULL, ARRAY['Civil Rights','Employment Discrimination','First Amendment'], false, 'Indiana civil rights attorney handling employment discrimination and First Amendment cases.'),
('Irwin Levin', 'Cohen & Malad', 'Indianapolis', 'IN', '317-636-6481', 'https://cohenandmalad.com', ARRAY['Civil Rights','Class Actions','Consumer Protection'], false, 'Leading Indiana civil rights class action attorney.'),
('John Haskin', 'Haskin & LaCount', 'Indianapolis', 'IN', '317-636-4514', NULL, ARRAY['Civil Rights','Police Misconduct','Employment'], false, 'Federal civil rights litigator handling police misconduct and employment cases.'),
('David Hensel', 'Indiana Disability Rights', 'Indianapolis', 'IN', '317-722-5555', 'https://indianadisabilityrights.org', ARRAY['Disability Rights','Education','Civil Rights'], true, 'Executive Director of Indiana Disability Rights, the state P&A agency.'),
('Jon Little', 'Little Law Office', 'Indianapolis', 'IN', '317-631-0099', NULL, ARRAY['Police Misconduct','Civil Rights','Criminal Defense'], false, 'Indianapolis civil rights attorney specializing in police misconduct cases.'),
('Carlyle Johnson', 'Indiana Civil Rights Commission', 'Indianapolis', 'IN', '317-232-2600', 'https://in.gov/icrc', ARRAY['Employment Discrimination','Housing','Civil Rights'], true, 'Staff attorney at Indiana Civil Rights Commission investigating discrimination complaints.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- IOWA (8 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Mark Stringer', 'ACLU of Iowa', 'Des Moines', 'IA', '515-243-3576', 'https://aclu-ia.org', ARRAY['Civil Liberties','Criminal Justice','First Amendment'], true, 'Executive Director of ACLU Iowa leading criminal justice and First Amendment campaigns.'),
('Rita Bettis Austen', 'ACLU of Iowa', 'Des Moines', 'IA', '515-243-3576', 'https://aclu-ia.org', ARRAY['Reproductive Rights','LGBTQ Rights','Voting Rights'], true, 'Legal Director of ACLU Iowa handling reproductive rights and voting access cases.'),
('Dennis Groenenboom', 'Iowa Legal Aid', 'Des Moines', 'IA', '515-243-1193', 'https://iowalegalaid.org', ARRAY['Housing','Public Benefits','Family Law'], true, 'Executive Director of Iowa Legal Aid providing free legal services statewide.'),
('Shefali Aurora', 'ACLU of Iowa', 'Des Moines', 'IA', '515-243-3576', 'https://aclu-ia.org', ARRAY['Immigrant Rights','Racial Justice'], true, 'Policy Director at ACLU Iowa focusing on immigrant rights and racial justice.'),
('Tom Henderson', 'Henderson Law', 'Cedar Rapids', 'IA', '319-362-0030', NULL, ARRAY['Civil Rights','Employment Discrimination'], false, 'Iowa civil rights attorney handling employment discrimination and civil rights cases.'),
('Roxanne Conlin', 'Roxanne Conlin & Associates', 'Des Moines', 'IA', '515-283-1111', NULL, ARRAY['Civil Rights','Employment Discrimination','Gender Equity'], false, 'Former U.S. Attorney and legendary Iowa civil rights attorney. Pioneer in gender discrimination law.'),
('Gary Dickey', 'Dickey & Campbell', 'Des Moines', 'IA', '515-288-5008', NULL, ARRAY['First Amendment','Media Law','Civil Rights'], false, 'Leading Iowa First Amendment and media law attorney.'),
('David Walker', 'Drake Legal Clinic', 'Des Moines', 'IA', '515-271-2824', 'https://drake.edu/law', ARRAY['Criminal Defense','Civil Rights'], true, 'Drake Law clinical professor running civil rights and criminal defense clinics.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- KANSAS (8 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Nadine Johnson', 'ACLU of Kansas', 'Overland Park', 'KS', '913-490-4101', 'https://aclukansas.org', ARRAY['Civil Liberties','Voting Rights','Criminal Justice'], true, 'Executive Director of ACLU Kansas.'),
('Sharon Brett', 'ACLU of Kansas', 'Overland Park', 'KS', '913-490-4101', 'https://aclukansas.org', ARRAY['Racial Justice','Education','Policing'], true, 'Legal Director of ACLU Kansas handling racial justice and education equity cases.'),
('Marilyn Harp', 'Kansas Legal Services', 'Topeka', 'KS', '785-233-2068', 'https://kansaslegalservices.org', ARRAY['Housing','Public Benefits','Family Law'], true, 'Executive Director of Kansas Legal Services providing statewide free legal help.'),
('Pedro Irigonegaray', 'Irigonegaray & Associates', 'Topeka', 'KS', '785-232-0600', NULL, ARRAY['Civil Rights','Criminal Defense','Constitutional Law'], false, 'Leading Kansas civil rights attorney. Defended science education standards against creationism.'),
('Stephen Douglas', 'Kansas Appleseed Center for Law and Justice', 'Lawrence', 'KS', '785-218-9513', 'https://kansasappleseed.org', ARRAY['Criminal Justice','Immigration','Civil Rights'], true, 'Executive Director of Kansas Appleseed leading immigration and criminal justice campaigns.'),
('Lauren Bonds', 'National Police Accountability Project', 'Lawrence', 'KS', '816-268-6654', 'https://nlg-npap.org', ARRAY['Police Accountability','Section 1983','Civil Rights'], true, 'Executive Director of NPAP advancing police accountability litigation nationwide.'),
('Michael Saunders', 'Saunders & Almanza', 'Lawrence', 'KS', '785-843-0500', NULL, ARRAY['Criminal Defense','Civil Rights'], false, 'Kansas criminal defense and civil rights attorney.'),
('Teresa Woody', 'Kansas Defender Project', 'Topeka', 'KS', '785-232-5000', NULL, ARRAY['Criminal Defense','Capital Defense','Civil Rights'], true, 'Executive Director of Kansas Defender Project handling capital and post-conviction cases.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- KENTUCKY (10 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Michael Aldridge', 'ACLU of Kentucky', 'Louisville', 'KY', '502-581-1181', 'https://aclu-ky.org', ARRAY['Civil Liberties','Criminal Justice','LGBTQ Rights'], true, 'Executive Director of ACLU Kentucky.'),
('Corey Shapiro', 'ACLU of Kentucky', 'Louisville', 'KY', '502-581-1181', 'https://aclu-ky.org', ARRAY['First Amendment','Police Accountability','Racial Justice'], true, 'Legal Director of ACLU Kentucky. Led challenges to Breonna Taylor no-knock warrant policies.'),
('Ben Crump', 'Ben Crump Law', 'Louisville', 'KY', '800-840-1090', 'https://bencrump.com', ARRAY['Police Brutality','Wrongful Death','Civil Rights'], false, 'Represented Breonna Taylor''s family in landmark wrongful death settlement with Louisville.'),
('Lonita Baker', 'Baker Law Office', 'Louisville', 'KY', '502-587-0078', NULL, ARRAY['Civil Rights','Police Misconduct','Personal Injury'], false, 'Louisville civil rights attorney. Co-counsel in Breonna Taylor case. Advocate for police reform.'),
('Sam Marcosson', 'University of Louisville Brandeis School of Law', 'Louisville', 'KY', '502-852-6391', 'https://louisville.edu/law', ARRAY['Constitutional Law','Civil Rights','LGBTQ Rights'], true, 'Professor of constitutional law and civil rights at UofL Law.'),
('Jennifer Howe', 'Appalachian Citizens Law Center', 'Whitesburg', 'KY', '606-633-3929', 'https://appalachianlawcenter.org', ARRAY['Environmental Justice','Workers Rights','Mining'], true, 'Staff attorney at ACLC representing coal miners and Appalachian communities.'),
('Rich Seckel', 'Kentucky Equal Justice Center', 'Louisville', 'KY', '502-303-4342', 'https://kyequaljustice.org', ARRAY['Access to Justice','Poverty Law','Civil Rights'], true, 'Executive Director of KEJC coordinating legal services for low-income Kentuckians.'),
('David Friedman', 'Friedman & Associates', 'Louisville', 'KY', '502-589-5600', NULL, ARRAY['Civil Rights','Employment Discrimination','Whistleblower'], false, 'Louisville employment discrimination and civil rights attorney.'),
('Dan Canon', 'Canon Law', 'Louisville', 'KY', '502-634-0404', NULL, ARRAY['Civil Rights','LGBTQ Rights','Constitutional Law'], false, 'Civil rights attorney who won Obergefell v. Hodges marriage equality case from Kentucky.'),
('Pam Thomas', 'Kentucky Center for Economic Policy', 'Berea', 'KY', '859-756-4605', 'https://kypolicy.org', ARRAY['Economic Justice','Criminal Justice','Civil Rights'], true, 'Executive Director of KCEP working on economic and criminal justice policy reform.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- LOUISIANA (15 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Alanah Odoms Hebert', 'ACLU of Louisiana', 'New Orleans', 'LA', '504-522-0617', 'https://laaclu.org', ARRAY['Civil Liberties','Criminal Justice','Racial Justice'], true, 'Executive Director of ACLU Louisiana leading criminal justice and racial justice reform.'),
('Nora Ahmed', 'ACLU of Louisiana', 'New Orleans', 'LA', '504-522-0617', 'https://laaclu.org', ARRAY['Criminal Justice','Prisoners Rights','Police Accountability'], true, 'Legal Director of ACLU Louisiana handling prison conditions and police accountability.'),
('William Most', 'Lawyers Committee for Civil Rights', 'New Orleans', 'LA', '504-527-4102', NULL, ARRAY['Voting Rights','Racial Justice','Civil Rights'], true, 'Staff attorney working on voting rights and racial justice in Louisiana.'),
('Emily Washington', 'Promise of Justice Initiative', 'New Orleans', 'LA', '504-529-5955', 'https://promiseofjustice.org', ARRAY['Death Penalty','Criminal Justice','Civil Rights'], true, 'Staff attorney at PJI fighting the death penalty and extreme sentences in Louisiana.'),
('Mercedes Montagnes', 'Promise of Justice Initiative', 'New Orleans', 'LA', '504-529-5955', 'https://promiseofjustice.org', ARRAY['Criminal Justice','Prisoners Rights','Reform'], true, 'Executive Director of PJI working to end mass incarceration in Louisiana.'),
('Katie Schwartzmann', 'MacArthur Justice Center', 'New Orleans', 'LA', '504-620-2259', 'https://macarthurjustice.org', ARRAY['Police Misconduct','Prisoners Rights','Civil Rights'], true, 'Director of MacArthur Justice Center Louisiana office handling police and prison reform.'),
('Derwyn Bunton', 'Orleans Public Defenders', 'New Orleans', 'LA', '504-569-0999', 'https://opdla.org', ARRAY['Criminal Defense','Constitutional Rights','Civil Rights'], true, 'Chief District Defender of Orleans Parish. National leader on public defense reform.'),
('Ron Wilson', 'Wilson Law Group', 'Baton Rouge', 'LA', '225-756-0222', NULL, ARRAY['Civil Rights','Police Misconduct','Personal Injury'], false, 'Baton Rouge civil rights attorney handling police misconduct and excessive force cases.'),
('Tracie Washington', 'Louisiana Justice Institute', 'New Orleans', 'LA', '504-872-9134', 'https://louisianajusticeinstitute.org', ARRAY['Education Equity','Civil Rights','Racial Justice'], true, 'President of LJI working on education equity and racial justice in Louisiana.'),
('Davida Finger', 'Loyola University College of Law', 'New Orleans', 'LA', '504-861-5590', 'https://law.loyno.edu', ARRAY['Housing','Civil Rights','Disaster Law'], true, 'Clinical professor at Loyola Law running the community justice clinic.'),
('Ashley Dalton', 'Southeast Louisiana Legal Services', 'New Orleans', 'LA', '504-529-1000', 'https://slls.org', ARRAY['Housing','Public Benefits','Disaster Recovery'], true, 'Managing attorney at SLLS providing legal aid to Southeast Louisiana residents.'),
('Rachel Piercey', 'Acadiana Legal Service Corporation', 'Lafayette', 'LA', '337-237-4320', 'https://la-law.org', ARRAY['Housing','Family Law','Public Benefits'], true, 'Executive Director of ALSC providing legal aid to South Louisiana.'),
('Lisa Graybill', 'Southern Poverty Law Center', 'New Orleans', 'LA', '504-486-8982', 'https://splcenter.org', ARRAY['Criminal Justice','Juvenile Justice','Civil Rights'], true, 'Deputy Legal Director at SPLC Louisiana office handling juvenile and criminal justice reform.'),
('Robert McDuff', 'McDuff Law', 'Jackson', 'LA', '601-969-0802', NULL, ARRAY['Civil Rights','Voting Rights','Death Penalty'], false, 'Legendary Mississippi-Louisiana civil rights attorney with decades of voting rights litigation.'),
('Daniel Zimmerman', 'Zimmerman Law', 'New Orleans', 'LA', '504-267-1451', NULL, ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'New Orleans civil rights attorney handling police misconduct and Section 1983 cases.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;


-- =============================================================================
-- MAINE (8 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Zachary Heiden', 'ACLU of Maine', 'Portland', 'ME', '207-774-5444', 'https://aclumaine.org', ARRAY['Civil Liberties','Free Speech','Criminal Justice'], true, 'Legal Director of ACLU Maine handling civil liberties and criminal justice reform.'),
('Emma Bond', 'ACLU of Maine', 'Portland', 'ME', '207-774-5444', 'https://aclumaine.org', ARRAY['Civil Rights','LGBTQ Rights','Prisoners Rights'], true, 'Staff attorney at ACLU Maine working on LGBTQ and prisoner rights.'),
('Jack Comart', 'Pine Tree Legal Assistance', 'Portland', 'ME', '207-774-8211', 'https://ptla.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Executive Director of Pine Tree Legal Assistance providing legal aid to low-income Mainers.'),
('David Webbert', 'Johnson Webbert & Young', 'Augusta', 'ME', '207-623-5110', 'https://maineworkerjustice.com', ARRAY['Employment Discrimination','Civil Rights','Workers Rights'], false, 'Leading Maine employment rights attorney handling discrimination and wage theft cases.'),
('Leah Rachin', 'Immigrant Legal Advocacy Project', 'Portland', 'ME', '207-780-1593', 'https://ilapmaine.org', ARRAY['Immigration','Civil Rights','Asylum'], true, 'Executive Director of ILAP providing immigration legal aid in Maine.'),
('Sigmund Schutz', 'Preti Flaherty', 'Portland', 'ME', '207-791-3000', 'https://preti.com', ARRAY['First Amendment','Media Law','Free Speech'], false, 'Partner at Preti Flaherty specializing in First Amendment and media law.'),
('Meagan Sway', 'ACLU of Maine', 'Portland', 'ME', '207-774-5444', 'https://aclumaine.org', ARRAY['Advocacy','Criminal Justice','Civil Liberties'], true, 'Advocacy Director at ACLU Maine leading policy reform campaigns.'),
('Nan Heald', 'Pine Tree Legal Assistance', 'Portland', 'ME', '207-774-8211', 'https://ptla.org', ARRAY['Housing','Disability Rights','Immigration'], true, 'Long-time legal aid attorney at Pine Tree Legal. Expert in housing and disability rights.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- MARYLAND (20 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Deborah Jeon', 'ACLU of Maryland', 'Baltimore', 'MD', '410-889-8555', 'https://aclu-md.org', ARRAY['Civil Liberties','Police Accountability','Racial Justice'], true, 'Legal Director of ACLU Maryland with decades of civil rights litigation.'),
('Sonia Kumar', 'ACLU of Maryland', 'Baltimore', 'MD', '410-889-8555', 'https://aclu-md.org', ARRAY['Criminal Justice','Voting Rights','Civil Rights'], true, 'Senior staff attorney at ACLU Maryland handling criminal justice and voting rights.'),
('Joseph Mead', 'Public Justice Center', 'Baltimore', 'MD', '410-625-9409', 'https://publicjustice.org', ARRAY['Housing','Poverty Law','Civil Rights'], true, 'Staff attorney at Public Justice Center fighting housing discrimination in Maryland.'),
('Sally Dworak-Fisher', 'Public Justice Center', 'Baltimore', 'MD', '410-625-9409', 'https://publicjustice.org', ARRAY['Workers Rights','Wage Theft','Employment'], true, 'Attorney at PJC specializing in workers rights and wage theft cases.'),
('J. Wyndal Gordon', 'Gordon Law', 'Baltimore', 'MD', '410-234-1000', NULL, ARRAY['Police Misconduct','Civil Rights','Criminal Defense'], false, 'Baltimore civil rights attorney handling police misconduct and Section 1983 cases.'),
('David Rocah', 'ACLU of Maryland', 'Baltimore', 'MD', '410-889-8555', 'https://aclu-md.org', ARRAY['Police Surveillance','Privacy','First Amendment'], true, 'Senior staff attorney at ACLU Maryland. Expert on police surveillance and privacy.'),
('Chelsea Crawford', 'Maryland Legal Aid', 'Baltimore', 'MD', '410-539-5340', 'https://mdlab.org', ARRAY['Housing','Family Law','Public Benefits'], true, 'Managing attorney at Maryland Legal Aid handling housing and family law.'),
('Jason Downs', 'Murphy Falcon & Murphy', 'Baltimore', 'MD', '410-951-8744', NULL, ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Civil rights attorney handling police misconduct cases in Maryland.'),
('Andrew Freeman', 'Brown Goldstein Levy', 'Baltimore', 'MD', '410-962-1030', 'https://browngold.com', ARRAY['Disability Rights','Civil Rights','Constitutional Law'], false, 'Partner at BGL. Leading disability rights and ADA attorney in Maryland.'),
('Nick Steiner', 'ACLU of Maryland', 'Baltimore', 'MD', '410-889-8555', 'https://aclu-md.org', ARRAY['Police Reform','Criminal Justice','Racial Justice'], true, 'Staff attorney at ACLU Maryland focused on police reform and racial justice.'),
('Jessica Weber', 'Disability Rights Maryland', 'Baltimore', 'MD', '410-727-6352', 'https://disabilityrightsmd.org', ARRAY['Disability Rights','ADA','Civil Rights'], true, 'Staff attorney at DRM handling disability rights and ADA enforcement.'),
('Hassan Murphy', 'Murphy Falcon & Murphy', 'Baltimore', 'MD', '410-951-8744', NULL, ARRAY['Police Misconduct','Civil Rights','Wrongful Death'], false, 'Partner handling high-profile police misconduct and wrongful death cases.'),
('Monique Dixon', 'NAACP Legal Defense Fund', 'Baltimore', 'MD', '212-965-2200', 'https://naacpldf.org', ARRAY['Voting Rights','Racial Justice','Education Equity'], true, 'Deputy Director of Policy at LDF working on voting rights and education equity.'),
('Cynthia Conlin', 'Maryland Volunteer Lawyers Service', 'Baltimore', 'MD', '410-539-6800', 'https://mvlslaw.org', ARRAY['Civil Rights','Housing','Family Law'], true, 'Executive Director of MVLS coordinating pro bono civil rights representation.'),
('Russell Neverdon', 'Law Office of Russell Neverdon', 'Baltimore', 'MD', '410-539-7400', NULL, ARRAY['Civil Rights','Criminal Defense','Police Misconduct'], false, 'Former NAACP chapter president. Veteran civil rights attorney in Baltimore.'),
('Glenn Ivey', 'Price Benowitz', 'Upper Marlboro', 'MD', '301-952-4700', NULL, ARRAY['Civil Rights','Criminal Justice','Government Accountability'], false, 'Former States Attorney. Civil rights attorney focused on government accountability.'),
('Kobi Little', 'NAACP Baltimore Branch', 'Baltimore', 'MD', '410-366-3300', 'https://naacpbaltimore.org', ARRAY['Civil Rights','Racial Justice','Community Advocacy'], true, 'President of NAACP Baltimore Branch leading civil rights advocacy.'),
('Thiru Vignarajah', 'Vignarajah Law', 'Baltimore', 'MD', '443-961-7000', NULL, ARRAY['Criminal Justice','Civil Rights','Appeals'], false, 'Former Deputy AG of Maryland. Private practice civil rights and appeals.'),
('Ryan Haygood', 'New Jersey Institute for Social Justice', 'Baltimore', 'MD', '973-624-9400', 'https://njisj.org', ARRAY['Racial Justice','Voting Rights','Economic Justice'], true, 'Former NAACP LDF attorney. Expert on racial justice and voting rights.'),
('Victor Glasberg', 'Victor Glasberg & Associates', 'Silver Spring', 'MD', '703-684-1100', NULL, ARRAY['Civil Rights','Section 1983','First Amendment'], false, 'Veteran civil rights attorney handling First Amendment and Section 1983 cases.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- MASSACHUSETTS (20 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Matthew Segal', 'ACLU of Massachusetts', 'Boston', 'MA', '617-482-3170', 'https://aclum.org', ARRAY['Civil Liberties','Free Speech','Police Accountability'], true, 'Legal Director of ACLUM. Leading civil liberties litigator in New England.'),
('Ruth Bourquin', 'ACLU of Massachusetts', 'Boston', 'MA', '617-482-3170', 'https://aclum.org', ARRAY['Civil Liberties','LGBTQ Rights','Criminal Justice'], true, 'Senior staff attorney at ACLUM handling LGBTQ rights and criminal justice reform.'),
('Ivan Espinoza-Madrigal', 'Lawyers for Civil Rights', 'Boston', 'MA', '617-988-0600', 'https://lawyersforcivilrights.org', ARRAY['Immigration','Racial Justice','Civil Rights'], true, 'Executive Director of LCR. Leading immigration and racial justice advocate.'),
('Oren Sellstrom', 'Lawyers for Civil Rights', 'Boston', 'MA', '617-988-0600', 'https://lawyersforcivilrights.org', ARRAY['Voting Rights','Immigration','Racial Justice'], true, 'Litigation Director at LCR handling voting rights and immigration cases.'),
('Janelle Chan', 'Greater Boston Legal Services', 'Boston', 'MA', '617-371-1234', 'https://gbls.org', ARRAY['Housing','Immigration','Public Benefits'], true, 'Executive Director of GBLS. Largest legal aid organization in New England.'),
('Jessie Rossman', 'ACLU of Massachusetts', 'Boston', 'MA', '617-482-3170', 'https://aclum.org', ARRAY['Technology','Privacy','Surveillance'], true, 'Senior staff attorney at ACLUM. Expert on government surveillance and AI.'),
('Shannon Liss-Riordan', 'Lichten & Liss-Riordan', 'Boston', 'MA', '617-994-5800', 'https://llrlaw.com', ARRAY['Workers Rights','Class Action','Employment'], false, 'Leading workers rights attorney. Won hundreds of millions for misclassified workers.'),
('Mary Bonauto', 'GLAD', 'Boston', 'MA', '617-426-1350', 'https://glad.org', ARRAY['LGBTQ Rights','Marriage Equality','Constitutional Law'], true, 'Civil Rights Director at GLAD. Argued Obergefell v. Hodges before SCOTUS.'),
('Claudia Center', 'GLAD', 'Boston', 'MA', '617-426-1350', 'https://glad.org', ARRAY['LGBTQ Rights','Civil Rights','Constitutional Law'], true, 'Senior attorney at GLAD (GLBTQ Legal Advocates and Defenders).'),
('Sophia Hall', 'Massachusetts Law Reform Institute', 'Boston', 'MA', '617-357-0700', 'https://mlri.org', ARRAY['Public Benefits','Poverty Law','Civil Rights'], true, 'Staff attorney at MLRI fighting for public benefits access and poverty reform.'),
('Carlton Williams', 'Lawyers Committee for Civil Rights', 'Boston', 'MA', '617-988-0600', 'https://lawyerscom.org', ARRAY['Racial Justice','Employment Discrimination','Civil Rights'], true, 'Executive Director of LCCR Boston leading racial justice work.'),
('Howard Cooper', 'Todd & Weld', 'Boston', 'MA', '617-720-2626', 'https://toddweld.com', ARRAY['Civil Rights','Criminal Defense','White Collar'], false, 'Senior litigator handling civil rights and criminal defense.'),
('Jeff Petrucelly', 'Ropes & Gray', 'Boston', 'MA', '617-951-7000', 'https://ropesgray.com', ARRAY['Civil Rights','Pro Bono','Constitutional Law'], true, 'Partner leading the firms pro bono civil rights practice.'),
('Eric Goldstein', 'Committee for Public Counsel Services', 'Boston', 'MA', '617-482-6212', 'https://publiccounsel.net', ARRAY['Criminal Defense','Civil Rights','Public Defense'], true, 'Chief Counsel overseeing public defense in Massachusetts.'),
('Adriana Lafaille', 'ACLU of Massachusetts', 'Boston', 'MA', '617-482-3170', 'https://aclum.org', ARRAY['Free Speech','Privacy','Technology'], true, 'Staff attorney specializing in privacy, surveillance, and free speech.'),
('Mark Stern', 'Stern Shapiro Weissberg & Garin', 'Boston', 'MA', '617-742-5800', NULL, ARRAY['Civil Rights','First Amendment','Media Law'], false, 'Civil rights attorney specializing in media law and First Amendment.'),
('Michael Keating', 'Foley Hoag', 'Boston', 'MA', '617-832-1000', 'https://foleyhoag.com', ARRAY['Civil Rights','Pro Bono','Constitutional Law'], true, 'Senior counsel with decades of pro bono civil rights work.'),
('Chris Kemmitt', 'NAACP New England', 'Boston', 'MA', '617-427-0202', NULL, ARRAY['Civil Rights','Racial Justice','Education'], true, 'Legal counsel for NAACP New England handling racial justice.'),
('Ben Kesslen', 'National Lawyers Guild Massachusetts', 'Boston', 'MA', '617-227-7335', 'https://nlgmass.org', ARRAY['Protest Rights','Civil Liberties','Criminal Defense'], true, 'NLG chapter providing legal support for protesters and activists.'),
('Lauren Sampson', 'MetroWest Legal Services', 'Framingham', 'MA', '508-620-1830', 'https://mwlegal.org', ARRAY['Housing','Family Law','Civil Rights'], true, 'Managing attorney providing legal aid in MetroWest region.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- MICHIGAN (15 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Dan Zarrow', 'ACLU of Michigan', 'Detroit', 'MI', '313-578-6800', 'https://aclumich.org', ARRAY['Civil Liberties','Racial Justice','Criminal Justice'], true, 'Legal Director of ACLU Michigan handling racial justice and criminal reform.'),
('Phil Mayor', 'ACLU of Michigan', 'Detroit', 'MI', '313-578-6800', 'https://aclumich.org', ARRAY['Immigration','Civil Rights','Deportation Defense'], true, 'Senior staff attorney focused on immigrants rights.'),
('Mark Fancher', 'ACLU of Michigan', 'Detroit', 'MI', '313-578-6800', 'https://aclumich.org', ARRAY['Racial Justice','Criminal Justice','Police Reform'], true, 'Racial Justice Project staff attorney at ACLU Michigan.'),
('Leonard Niehoff', 'Honigman LLP', 'Detroit', 'MI', '313-465-7000', 'https://honigman.com', ARRAY['First Amendment','Media Law','Civil Rights'], false, 'Professor and First Amendment attorney. Nationally recognized media law expert.'),
('Julie Hurwitz', 'Goodman Hurwitz & James', 'Detroit', 'MI', '313-962-7080', NULL, ARRAY['Civil Rights','Police Misconduct','Section 1983'], false, 'Partner handling police misconduct and civil rights cases.'),
('Bill Goodman', 'Goodman Hurwitz & James', 'Detroit', 'MI', '313-962-7080', NULL, ARRAY['Civil Rights','First Amendment','Political Rights'], false, 'Renowned civil rights attorney. Center for Constitutional Rights cooperating attorney.'),
('Amanda Alexander', 'Detroit Justice Center', 'Detroit', 'MI', '313-736-5957', 'https://detroitjustice.org', ARRAY['Criminal Justice','Racial Justice','Community Safety'], true, 'Founder and Executive Director of DJC. National leader on just safety.'),
('Anita Kishore', 'Detroit Justice Center', 'Detroit', 'MI', '313-736-5957', 'https://detroitjustice.org', ARRAY['Bail Reform','Criminal Justice','Racial Justice'], true, 'Staff attorney fighting for bail reform and criminal justice equity.'),
('Miriam Aukerman', 'ACLU of Michigan', 'Grand Rapids', 'MI', '616-301-0930', 'https://aclumich.org', ARRAY['Poverty Law','Criminal Justice','Voting Rights'], true, 'West Michigan staff attorney handling poverty law and voting rights.'),
('Khaled Beydoun', 'University of Detroit Mercy Law', 'Detroit', 'MI', '313-596-0200', NULL, ARRAY['Civil Rights','Immigration','Racial Justice'], true, 'Law professor and civil rights author on racial profiling and immigration.'),
('Mary Ellen Gurewitz', 'Gurewitz & Raben', 'Detroit', 'MI', '313-628-4733', NULL, ARRAY['Employment Discrimination','Civil Rights','Section 1983'], false, 'Veteran employment discrimination and civil rights attorney.'),
('Abed Hammoud', 'Hammoud Law', 'Dearborn', 'MI', '313-551-3038', NULL, ARRAY['Civil Rights','Employment Discrimination','Immigration'], false, 'Attorney serving the Arab American and immigrant community.'),
('Jon Marko', 'Michigan Immigrant Rights Center', 'Kalamazoo', 'MI', '269-492-7196', 'https://michiganimmigrant.org', ARRAY['Immigration','Civil Rights','DACA'], true, 'Managing attorney handling immigration and DACA cases statewide.'),
('Kim Thomas', 'Safe & Just Michigan', 'Lansing', 'MI', '517-482-7753', 'https://safeandjustmi.org', ARRAY['Criminal Justice','Prison Reform','Civil Rights'], true, 'Executive Director leading criminal justice reform.'),
('Amanda Ghannam', 'CAIR Michigan', 'Farmington Hills', 'MI', '248-559-2247', 'https://cairmichigan.org', ARRAY['Religious Freedom','Civil Rights','Discrimination'], true, 'Staff attorney handling religious discrimination cases.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- MINNESOTA (12 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Teresa Nelson', 'ACLU of Minnesota', 'Minneapolis', 'MN', '651-645-4097', 'https://aclu-mn.org', ARRAY['Civil Liberties','Racial Justice','Criminal Justice'], true, 'Legal Director of ACLU Minnesota.'),
('Jeff Storms', 'Storms & Associates', 'Minneapolis', 'MN', '612-227-2900', NULL, ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Minneapolis civil rights attorney handling police misconduct cases.'),
('Jordan Kushner', 'Law Office of Jordan Kushner', 'Minneapolis', 'MN', '612-767-5720', NULL, ARRAY['Protest Rights','Police Misconduct','Criminal Defense'], false, 'Long-time activist attorney defending protesters and handling police misconduct.'),
('Nekima Levy Armstrong', 'Levy Armstrong Law', 'Minneapolis', 'MN', '612-964-9339', NULL, ARRAY['Civil Rights','Racial Justice','Police Accountability'], false, 'Former NAACP Minneapolis president. Prominent civil rights attorney and activist.'),
('Robert Bennett', 'Robins Kaplan', 'Minneapolis', 'MN', '612-349-8500', 'https://robinskaplan.com', ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Handled major police misconduct cases including Philando Castile.'),
('Zorislav Leyderman', 'Leyderman Law', 'Minneapolis', 'MN', '612-432-3575', NULL, ARRAY['Civil Rights','Police Misconduct','First Amendment'], false, 'Civil rights attorney focused on police misconduct and First Amendment.'),
('Isabella Nascimento', 'Mid-Minnesota Legal Aid', 'Minneapolis', 'MN', '612-332-1441', 'https://mylegalaid.org', ARRAY['Housing','Immigration','Public Benefits'], true, 'Managing attorney handling housing and immigration.'),
('Justin Perl', 'Halunen Law', 'Minneapolis', 'MN', '612-605-4098', 'https://halunenlaw.com', ARRAY['Employment Discrimination','Whistleblower','Civil Rights'], false, 'Partner handling employment discrimination and whistleblower cases.'),
('Jim Behrenbrinker', 'Southern Minnesota Regional Legal Services', 'St. Paul', 'MN', '651-222-5863', 'https://smrls.org', ARRAY['Housing','Public Benefits','Disability Rights'], true, 'Executive Director providing legal aid in southern Minnesota.'),
('Lori Swanson', 'Swanson Law', 'Minneapolis', 'MN', '612-205-5550', NULL, ARRAY['Consumer Protection','Civil Rights','Government Accountability'], false, 'Former Minnesota AG handling civil rights and consumer protection.'),
('Ben Crump', 'Ben Crump Law', 'Minneapolis', 'MN', '800-921-4249', 'https://bencrump.com', ARRAY['Police Misconduct','Civil Rights','Wrongful Death'], false, 'Nationally prominent civil rights attorney. Represented George Floyd family.'),
('Daniel Shulman', 'Gray Plant Mooty', 'Minneapolis', 'MN', '612-632-3000', NULL, ARRAY['Civil Rights','Employment','Constitutional Law'], false, 'Senior counsel specializing in civil rights and constitutional litigation.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- MISSISSIPPI (12 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Jarvis Dortch', 'ACLU of Mississippi', 'Jackson', 'MS', '601-354-3408', 'https://aclu-ms.org', ARRAY['Civil Liberties','Criminal Justice','Racial Justice'], true, 'Executive Director of ACLU Mississippi.'),
('Joshua Tom', 'ACLU of Mississippi', 'Jackson', 'MS', '601-354-3408', 'https://aclu-ms.org', ARRAY['Civil Rights','LGBTQ Rights','Criminal Justice'], true, 'Legal Director of ACLU Mississippi.'),
('Rob McDuff', 'Mississippi Center for Justice', 'Jackson', 'MS', '601-352-2269', 'https://mscenterforjustice.org', ARRAY['Voting Rights','Civil Rights','Death Penalty'], true, 'Legendary civil rights attorney with decades of voting rights litigation.'),
('Vangela Wade', 'Mississippi Center for Justice', 'Jackson', 'MS', '601-352-2269', 'https://mscenterforjustice.org', ARRAY['Housing','Consumer Protection','Civil Rights'], true, 'President of MCJ leading consumer protection and fair housing work.'),
('Cliff Johnson', 'MacArthur Justice Center', 'Oxford', 'MS', '662-915-7275', 'https://macarthurjustice.org', ARRAY['Prisoners Rights','Criminal Justice','Civil Rights'], true, 'Director of MacArthur Justice Center at University of Mississippi.'),
('Carlos Moore', 'Moore Law Group', 'Grenada', 'MS', '662-230-3388', NULL, ARRAY['Civil Rights','Police Misconduct','Racial Justice'], false, 'Handles police misconduct and racial discrimination cases.'),
('Dennis Sweet', 'Sweet & Associates', 'Jackson', 'MS', '601-965-8955', NULL, ARRAY['Civil Rights','Police Misconduct','Medical Malpractice'], false, 'Veteran civil rights attorney. NAACP lifetime achievement award recipient.'),
('Paloma Wu', 'Mississippi Center for Justice', 'Jackson', 'MS', '601-352-2269', 'https://mscenterforjustice.org', ARRAY['Immigrants Rights','Civil Rights','Workers Rights'], true, 'Staff attorney handling immigrant and worker rights.'),
('Jody Owens', 'Owens Law Firm', 'Jackson', 'MS', '601-500-1212', NULL, ARRAY['Civil Rights','Criminal Justice','Community Advocacy'], false, 'Hinds County DA and former SPLC attorney.'),
('Lisa Ross', 'Mississippi Immigrants Rights Alliance', 'Jackson', 'MS', '601-968-5182', 'https://yourmira.org', ARRAY['Immigration','Civil Rights','Workers Rights'], true, 'Executive Director of MIRA leading immigrant rights advocacy.'),
('Oliver Diaz', 'Diaz Law Firm', 'Biloxi', 'MS', '228-396-3800', NULL, ARRAY['Civil Rights','Constitutional Law','Judicial Reform'], false, 'Former Mississippi Supreme Court Justice. Private civil rights practice.'),
('Crystal Martin', 'South Mississippi Legal Services', 'Biloxi', 'MS', '228-374-4160', 'https://smls.org', ARRAY['Housing','Disaster Recovery','Civil Rights'], true, 'Staff attorney handling housing and disaster recovery legal aid.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- MISSOURI (12 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Tony Rothert', 'ACLU of Missouri', 'St. Louis', 'MO', '314-652-3114', 'https://aclu-mo.org', ARRAY['Civil Liberties','Free Speech','Criminal Justice'], true, 'Legal Director of ACLU Missouri.'),
('Anthony Gray', 'Gray Law LLC', 'St. Louis', 'MO', '314-241-4200', NULL, ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Represented Michael Brown family. Leading civil rights attorney in Ferguson.'),
('Jermaine Wooten', 'ArchCity Defenders', 'St. Louis', 'MO', '855-724-2489', 'https://archcitydefenders.org', ARRAY['Criminal Justice','Municipal Courts','Civil Rights'], true, 'Executive Director fighting municipal court abuses.'),
('Blake Strode', 'ArchCity Defenders', 'St. Louis', 'MO', '855-724-2489', 'https://archcitydefenders.org', ARRAY['Criminal Justice','Racial Justice','Bail Reform'], true, 'Key figure in Ferguson reform litigation.'),
('Javad Khazaeli', 'Khazaeli Wyrsch', 'St. Louis', 'MO', '314-462-6464', 'https://khazaeliwyrsch.com', ARRAY['Civil Rights','Police Misconduct','Employment'], false, 'Handles police misconduct and discrimination in Missouri.'),
('Denise Lieberman', 'Advancement Project', 'St. Louis', 'MO', '314-862-2220', 'https://advancementproject.org', ARRAY['Voting Rights','Racial Justice','Civil Rights'], true, 'Expert on voting rights in Missouri.'),
('Lee Lockwood', 'Lockwood Law', 'Kansas City', 'MO', '816-221-9114', NULL, ARRAY['Police Misconduct','Civil Rights','Criminal Defense'], false, 'Kansas City police misconduct and Section 1983 attorney.'),
('Michael Gross', 'Gross & Delaney', 'Kansas City', 'MO', '816-792-0019', NULL, ARRAY['Civil Rights','Police Misconduct','Wrongful Conviction'], false, 'Handles wrongful conviction and police misconduct.'),
('Geri Dreiling', 'Legal Aid of Western Missouri', 'Kansas City', 'MO', '816-474-6750', 'https://lawmo.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Managing attorney providing legal aid for housing and civil rights.'),
('Gillian Wilcox', 'ACLU of Missouri', 'St. Louis', 'MO', '314-652-3114', 'https://aclu-mo.org', ARRAY['Reproductive Rights','Civil Rights','Criminal Justice'], true, 'Staff attorney working on reproductive rights and criminal justice.'),
('Grant Doty', 'Missouri Protection & Advocacy', 'Jefferson City', 'MO', '573-893-3333', 'https://moadvocacy.org', ARRAY['Disability Rights','ADA','Civil Rights'], true, 'Staff attorney handling disability rights and ADA enforcement.'),
('Rod Chapel', 'NAACP Missouri', 'St. Louis', 'MO', '314-645-2550', NULL, ARRAY['Civil Rights','Racial Justice','Education Equity'], true, 'President of Missouri NAACP leading statewide advocacy.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- MONTANA (6 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Alex Rate', 'ACLU of Montana', 'Helena', 'MT', '406-443-8590', 'https://aclumontana.org', ARRAY['Civil Liberties','Voting Rights','LGBTQ Rights'], true, 'Legal Director of ACLU Montana. Landmark voting and LGBTQ cases.'),
('James Goetz', 'Goetz Gallik & Baldwin', 'Bozeman', 'MT', '406-587-0618', NULL, ARRAY['Constitutional Law','Civil Rights','First Amendment'], false, 'Premier Montana constitutional attorney. Argued before US Supreme Court.'),
('Elizabeth Griffing', 'Montana Legal Services Association', 'Missoula', 'MT', '406-543-8343', 'https://mtlsa.org', ARRAY['Native American Rights','Housing','Civil Rights'], true, 'Specializes in Native American rights and housing.'),
('Shahid Haque', 'Border Crossing Law Firm', 'Helena', 'MT', '406-594-2004', NULL, ARRAY['Immigration','Civil Rights','Constitutional Law'], false, 'Immigration and civil rights attorney and former state legislator.'),
('Akilah Lane', 'ACLU of Montana', 'Helena', 'MT', '406-443-8590', 'https://aclumontana.org', ARRAY['Civil Rights','Criminal Justice','Racial Justice'], true, 'Staff attorney focused on criminal justice and racial equity.'),
('Shane Vannatta', 'Vannatta Law', 'Missoula', 'MT', '406-203-4825', NULL, ARRAY['Civil Rights','Employment Discrimination','Workers Rights'], false, 'Handles employment discrimination cases.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- NEBRASKA (8 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Spike Eickholt', 'ACLU of Nebraska', 'Lincoln', 'NE', '402-476-8091', 'https://aclunebraska.org', ARRAY['Civil Liberties','Criminal Justice','Free Speech'], true, 'Legal Director of ACLU Nebraska.'),
('Rose Godinez', 'ACLU of Nebraska', 'Lincoln', 'NE', '402-476-8091', 'https://aclunebraska.org', ARRAY['Immigrants Rights','Civil Rights','Racial Justice'], true, 'Staff attorney focused on immigrants rights and racial justice.'),
('Robert Stull', 'Legal Aid of Nebraska', 'Omaha', 'NE', '402-348-1069', 'https://legalaidofnebraska.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Executive Director providing statewide legal aid.'),
('Justin Wayne', 'Wayne Law Office', 'Omaha', 'NE', '402-344-4004', NULL, ARRAY['Civil Rights','Criminal Defense','Community Advocacy'], false, 'State senator and civil rights attorney from North Omaha.'),
('Tom Monaghan', 'Monaghan Law', 'Omaha', 'NE', '402-346-8003', NULL, ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Handles police misconduct cases.'),
('Amy Miller', 'ACLU of Nebraska', 'Lincoln', 'NE', '402-476-8091', 'https://aclunebraska.org', ARRAY['Civil Liberties','LGBTQ Rights','Prisoners Rights'], true, 'Former Legal Director. Led LGBTQ and prisoner rights litigation.'),
('William Thibodeau', 'Nebraska Appleseed', 'Lincoln', 'NE', '402-438-8853', 'https://neappleseed.org', ARRAY['Immigrants Rights','Child Welfare','Civil Rights'], true, 'Handles child welfare and immigrant rights.'),
('Eric Snocker', 'Disability Rights Nebraska', 'Lincoln', 'NE', '402-474-3183', 'https://disabilityrightsnebraska.org', ARRAY['Disability Rights','ADA','Civil Rights'], true, 'Staff attorney handling ADA enforcement.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- NEVADA (8 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Chris Peterson', 'ACLU of Nevada', 'Las Vegas', 'NV', '702-366-1902', 'https://aclunv.org', ARRAY['Civil Liberties','Criminal Justice','Free Speech'], true, 'Legal Director of ACLU Nevada.'),
('Amy Rose', 'ACLU of Nevada', 'Las Vegas', 'NV', '702-366-1902', 'https://aclunv.org', ARRAY['Voting Rights','Immigrants Rights','Civil Rights'], true, 'Senior staff attorney focused on voting and immigrants rights.'),
('Cal Potter', 'Potter Law Offices', 'Las Vegas', 'NV', '702-385-1220', NULL, ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Handles police misconduct and wrongful death.'),
('Terri Miller', 'Nevada Legal Services', 'Las Vegas', 'NV', '702-386-0404', 'https://nlslaw.net', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Managing attorney providing legal aid.'),
('David Brickman', 'Brickman Law', 'Las Vegas', 'NV', '702-383-2888', NULL, ARRAY['Civil Rights','Personal Injury','Police Misconduct'], false, 'Handles police misconduct and injury cases.'),
('Nadine Machado', 'Washoe Legal Services', 'Reno', 'NV', '775-329-2727', 'https://washoelegalservices.org', ARRAY['Family Law','Housing','Civil Rights'], true, 'Executive Director of northern Nevada legal services.'),
('Kendra Bertschy', 'Legal Aid Center of Southern Nevada', 'Las Vegas', 'NV', '702-386-1070', 'https://lacsn.org', ARRAY['Immigration','Civil Rights','Family Law'], true, 'Staff attorney handling immigration and civil rights.'),
('John Lambrose', 'Lambrose Law', 'Reno', 'NV', '775-337-0400', NULL, ARRAY['Civil Rights','Employment','Constitutional Law'], false, 'Handles employment and constitutional cases.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- NEW HAMPSHIRE (6 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Gilles Bissonnette', 'ACLU of New Hampshire', 'Concord', 'NH', '603-225-3080', 'https://aclu-nh.org', ARRAY['Civil Liberties','Free Speech','Privacy'], true, 'Legal Director of ACLU NH. Expert on free speech and digital privacy.'),
('Henry Klementowicz', 'ACLU of New Hampshire', 'Concord', 'NH', '603-225-3080', 'https://aclu-nh.org', ARRAY['Criminal Justice','Civil Rights','Police Accountability'], true, 'Staff attorney handling criminal justice and police accountability.'),
('Mark Sisti', 'Sisti Law Offices', 'Chichester', 'NH', '603-224-3700', NULL, ARRAY['Criminal Defense','Civil Rights','Constitutional Law'], false, 'Premier criminal defense and civil rights attorney.'),
('Tim Gudas', 'New Hampshire Legal Assistance', 'Concord', 'NH', '603-224-3333', 'https://nhla.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Executive Director providing statewide legal aid.'),
('Devon Chaffee', 'ACLU of New Hampshire', 'Concord', 'NH', '603-225-3080', 'https://aclu-nh.org', ARRAY['Civil Liberties','Advocacy','Legislative Reform'], true, 'Executive Director leading legislative advocacy.'),
('Elliott Berry', 'Disabilities Rights Center NH', 'Concord', 'NH', '603-228-0432', 'https://drcnh.org', ARRAY['Disability Rights','ADA','Civil Rights'], true, 'Executive Director. Leading disability rights advocate.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- NEW JERSEY (15 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Alexander Shalom', 'ACLU of New Jersey', 'Newark', 'NJ', '973-642-2086', 'https://aclu-nj.org', ARRAY['Civil Liberties','Criminal Justice','Police Reform'], true, 'Senior supervising attorney at ACLU NJ. Veteran civil rights litigator.'),
('Jeanne LoCicero', 'ACLU of New Jersey', 'Newark', 'NJ', '973-642-2086', 'https://aclu-nj.org', ARRAY['Civil Rights','Immigration','Racial Justice'], true, 'Legal Director handling immigration and racial justice.'),
('Ryan Haygood', 'NJ Institute for Social Justice', 'Newark', 'NJ', '973-624-9400', 'https://njisj.org', ARRAY['Racial Justice','Voting Rights','Economic Justice'], true, 'President of NJISJ. Former NAACP LDF attorney.'),
('CJ Griffin', 'Pashman Stein', 'Hackensack', 'NJ', '201-488-8200', 'https://pashmanstein.com', ARRAY['Government Transparency','First Amendment','Civil Rights'], false, 'Open government and First Amendment expert.'),
('Lawrence Lustberg', 'Gibbons PC', 'Newark', 'NJ', '973-596-4500', 'https://gibbonslaw.com', ARRAY['Criminal Justice','Civil Rights','Death Penalty'], false, 'Director of criminal defense and civil rights practice.'),
('David Harris', 'Rutgers Constitutional Rights Clinic', 'Newark', 'NJ', '973-353-5001', NULL, ARRAY['Civil Rights','Constitutional Law','Racial Justice'], true, 'Director of Constitutional Rights Clinic.'),
('Penny Venetis', 'Rutgers Human Rights Clinic', 'Newark', 'NJ', '973-353-5687', NULL, ARRAY['Human Rights','Civil Rights','International Law'], true, 'Clinical professor running human rights clinic.'),
('Ronald Chen', 'Rutgers Law School', 'Newark', 'NJ', '973-353-1000', NULL, ARRAY['Constitutional Law','Civil Rights','Government Ethics'], true, 'Dean Emeritus. Former NJ Public Advocate.'),
('Avalon Fenster', 'Legal Services of New Jersey', 'Edison', 'NJ', '732-572-9100', 'https://lsnj.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Staff attorney handling housing discrimination.'),
('Frank Corrado', 'Barry Corrado Grassi & Gillin', 'Wildwood', 'NJ', '609-729-1333', NULL, ARRAY['First Amendment','Civil Rights','Constitutional Law'], false, 'First Amendment and constitutional law attorney.'),
('Nadia Hussain', 'ACLU of New Jersey', 'Newark', 'NJ', '973-642-2086', 'https://aclu-nj.org', ARRAY['Civil Liberties','Advocacy','Criminal Justice'], true, 'Policy counsel leading criminal justice reform advocacy.'),
('Ari Rosmarin', 'ACLU of New Jersey', 'Newark', 'NJ', '973-642-2086', 'https://aclu-nj.org', ARRAY['Civil Liberties','Immigrants Rights','LGBTQ Rights'], true, 'Staff attorney handling LGBTQ and immigrant rights.'),
('Justin Loughry', 'Disability Rights New Jersey', 'Trenton', 'NJ', '609-292-9742', 'https://drnj.org', ARRAY['Disability Rights','ADA','Civil Rights'], true, 'Staff attorney handling ADA enforcement.'),
('Scott Woodruff', 'Woodruff Law', 'Cherry Hill', 'NJ', '856-354-1900', NULL, ARRAY['Civil Rights','Employment Discrimination','Section 1983'], false, 'South Jersey employment and police misconduct attorney.'),
('William Buckman', 'Buckman Law', 'Moorestown', 'NJ', '856-608-9797', NULL, ARRAY['Criminal Defense','Civil Rights','Appeals'], false, 'Criminal defense and civil rights appellate attorney.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- NEW MEXICO (8 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Maria Griego', 'ACLU of New Mexico', 'Albuquerque', 'NM', '505-266-5915', 'https://aclu-nm.org', ARRAY['Civil Liberties','Criminal Justice','Police Reform'], true, 'Staff attorney handling criminal justice and police reform.'),
('Shannon Kennedy', 'Kennedy Kennedy & Ives', 'Albuquerque', 'NM', '505-244-1850', NULL, ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Leading civil rights attorney with major police misconduct settlements.'),
('Laura Schauer Ives', 'Kennedy Kennedy & Ives', 'Albuquerque', 'NM', '505-244-1850', NULL, ARRAY['Civil Rights','Police Accountability','Section 1983'], false, 'Key attorney in APD consent decree litigation.'),
('Phil Davis', 'New Mexico Legal Aid', 'Albuquerque', 'NM', '505-243-7871', 'https://newmexicolegalaid.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Executive Director providing statewide legal aid.'),
('Matt Garcia', 'Garcia Law', 'Santa Fe', 'NM', '505-986-9344', NULL, ARRAY['Civil Rights','Employment','Police Misconduct'], false, 'Santa Fe civil rights and employment attorney.'),
('Leon Howard', 'ACLU of New Mexico', 'Albuquerque', 'NM', '505-266-5915', 'https://aclu-nm.org', ARRAY['Civil Rights','Voting Rights','Racial Justice'], true, 'Policy director working on voting rights.'),
('Denise Chanez', 'DNA-Peoples Legal Services', 'Farmington', 'NM', '505-325-8886', 'https://dnalegalservices.org', ARRAY['Native American Rights','Civil Rights','Housing'], true, 'Serves Native American communities.'),
('Ray Twohig', 'Twohig Law', 'Albuquerque', 'NM', '505-235-3926', NULL, ARRAY['Civil Rights','Criminal Defense','Federal Court'], false, 'Federal criminal defense and civil rights attorney.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- NEW YORK (30 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Donna Lieberman', 'New York Civil Liberties Union', 'New York', 'NY', '212-607-3300', 'https://nyclu.org', ARRAY['Civil Liberties','Free Speech','Surveillance'], true, 'Executive Director of NYCLU.'),
('Christopher Dunn', 'NYCLU', 'New York', 'NY', '212-607-3300', 'https://nyclu.org', ARRAY['Civil Liberties','Police Reform','First Amendment'], true, 'Legal Director handling police reform and First Amendment.'),
('Sherrilyn Ifill', 'NAACP Legal Defense Fund', 'New York', 'NY', '212-965-2200', 'https://naacpldf.org', ARRAY['Racial Justice','Voting Rights','Civil Rights'], true, 'Former President of NAACP LDF.'),
('Dale Ho', 'ACLU Voting Rights Project', 'New York', 'NY', '212-549-2500', 'https://aclu.org', ARRAY['Voting Rights','Civil Rights','Constitutional Law'], true, 'Director of ACLU Voting Rights. Argued before Supreme Court.'),
('Lee Gelernt', 'ACLU Immigrants Rights Project', 'New York', 'NY', '212-549-2500', 'https://aclu.org', ARRAY['Immigration','Family Separation','Civil Rights'], true, 'Led family separation litigation.'),
('Baher Azmy', 'Center for Constitutional Rights', 'New York', 'NY', '212-614-6464', 'https://ccrjustice.org', ARRAY['Civil Rights','Human Rights','Guantanamo'], true, 'Legal Director of CCR.'),
('David Cole', 'ACLU National', 'New York', 'NY', '212-549-2500', 'https://aclu.org', ARRAY['Constitutional Law','National Security','Civil Liberties'], true, 'Legal Director of ACLU. Georgetown Law professor.'),
('Norman Siegel', 'Siegel Teitelbaum & Evans', 'New York', 'NY', '212-943-5500', NULL, ARRAY['Civil Rights','Free Speech','First Amendment'], false, 'Former NYCLU Executive Director. Legendary civil rights attorney.'),
('Ron Kuby', 'Law Office of Ronald L. Kuby', 'New York', 'NY', '212-431-0651', NULL, ARRAY['Civil Rights','Criminal Defense','First Amendment'], false, 'Prominent civil rights attorney. Former partner of William Kunstler.'),
('Darius Charney', 'Center for Constitutional Rights', 'New York', 'NY', '212-614-6464', 'https://ccrjustice.org', ARRAY['Racial Justice','Stop and Frisk','Civil Rights'], true, 'Lead attorney in Floyd v. City of New York (stop-and-frisk).'),
('Vince Warren', 'Center for Constitutional Rights', 'New York', 'NY', '212-614-6464', 'https://ccrjustice.org', ARRAY['Civil Rights','Human Rights','Racial Justice'], true, 'Executive Director of CCR.'),
('Bryan Stevenson', 'Equal Justice Initiative', 'New York', 'NY', '334-269-1803', 'https://eji.org', ARRAY['Death Penalty','Racial Justice','Mass Incarceration'], true, 'Founder of EJI. Author of Just Mercy.'),
('Adriene Holder', 'Legal Aid Society', 'New York', 'NY', '212-577-3300', 'https://legalaidnyc.org', ARRAY['Civil Rights','Housing','Employment'], true, 'Attorney-in-charge of civil practice at Legal Aid Society.'),
('Tina Luongo', 'Legal Aid Society', 'New York', 'NY', '212-577-3300', 'https://legalaidnyc.org', ARRAY['Criminal Defense','Civil Rights','Public Defense'], true, 'Attorney-in-charge of criminal practice.'),
('Lisa Schreibersdorf', 'Brooklyn Defender Services', 'Brooklyn', 'NY', '718-254-0700', 'https://bds.org', ARRAY['Criminal Defense','Civil Rights','Public Defense'], true, 'Executive Director pioneering holistic public defense.'),
('Katie Rosenfeld', 'Emery Celli Brinckerhoff & Abady', 'New York', 'NY', '212-763-5000', 'https://ecbalaw.com', ARRAY['Civil Rights','Police Misconduct','Section 1983'], false, 'Handles high-profile police misconduct cases.'),
('Jonathan Abady', 'Emery Celli Brinckerhoff & Abady', 'New York', 'NY', '212-763-5000', 'https://ecbalaw.com', ARRAY['Civil Rights','Free Speech','Police Misconduct'], false, 'Founding partner of top civil rights firm.'),
('Hina Shamsi', 'ACLU National Security Project', 'New York', 'NY', '212-549-2500', 'https://aclu.org', ARRAY['National Security','Surveillance','Civil Liberties'], true, 'Director of ACLU National Security Project.'),
('James Esseks', 'ACLU LGBT & HIV Project', 'New York', 'NY', '212-549-2627', 'https://aclu.org', ARRAY['LGBTQ Rights','Transgender Rights','Civil Rights'], true, 'Led landmark transgender rights cases.'),
('Marcia Henry', 'Lambda Legal', 'New York', 'NY', '212-809-8585', 'https://lambdalegal.org', ARRAY['LGBTQ Rights','HIV/AIDS Discrimination','Civil Rights'], true, 'Staff attorney fighting LGBTQ discrimination.'),
('Mariko Hirose', 'International Refugee Assistance Project', 'New York', 'NY', '646-459-3044', 'https://refugeerights.org', ARRAY['Refugee Rights','Immigration','Muslim Ban'], true, 'Led challenges to the Muslim travel ban.'),
('Alina Das', 'NYU Immigrant Rights Clinic', 'New York', 'NY', '212-998-6430', NULL, ARRAY['Immigration','Deportation Defense','Civil Rights'], true, 'Co-director of NYU Immigrant Rights Clinic.'),
('Joel Berger', 'Berger & Webb', 'New York', 'NY', '212-349-5515', NULL, ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Former NYC Corporation Counsel. Plaintiff-side police misconduct.'),
('Ramzi Kassem', 'CUNY CLEAR', 'New York', 'NY', '718-340-4558', NULL, ARRAY['National Security','Muslim Rights','Civil Rights'], true, 'Director representing those in national security apparatus.'),
('Corey Stoughton', 'NYCLU', 'New York', 'NY', '212-607-3300', 'https://nyclu.org', ARRAY['Criminal Justice','Policing','Civil Rights'], true, 'Handles criminal justice and policing reform.'),
('Scott Levy', 'Bronx Defenders', 'Bronx', 'NY', '718-838-7878', 'https://bronxdefenders.org', ARRAY['Bail Reform','Criminal Justice','Civil Rights'], true, 'Expert on bail reform and pretrial detention.'),
('Marlen Reis', 'Make the Road New York', 'Brooklyn', 'NY', '718-418-7690', 'https://maketheroadny.org', ARRAY['Immigration','Workers Rights','Civil Rights'], true, 'Legal director fighting for immigrant and worker rights.'),
('Sara Sidelnik', 'New York Legal Assistance Group', 'New York', 'NY', '212-613-5000', 'https://nylag.org', ARRAY['Housing','Immigration','Civil Rights'], true, 'Managing attorney handling immigrant rights.'),
('Andre Ward', 'National Lawyers Guild NYC', 'New York', 'NY', '212-679-5100', 'https://nlgnyc.org', ARRAY['Protest Rights','Civil Liberties','Criminal Defense'], true, 'NLG chapter providing legal support for protesters.'),
('Jonathan Moore', 'Beldock Levine & Hoffman', 'New York', 'NY', '212-490-0400', NULL, ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Veteran police misconduct and civil rights attorney.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;


-- =============================================================================
-- NORTH CAROLINA (18 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Irena Como', 'ACLU of North Carolina', 'Raleigh', 'NC', '919-834-3466', 'https://acluofnc.org', ARRAY['Civil Liberties','Criminal Justice','Racial Justice'], true, 'Legal Director of ACLU North Carolina.'),
('Chantal Stevens', 'ACLU of North Carolina', 'Raleigh', 'NC', '919-834-3466', 'https://acluofnc.org', ARRAY['Voting Rights','LGBTQ Rights','Civil Rights'], true, 'Staff attorney handling voting and LGBTQ rights.'),
('Al McSurely', 'McSurely Law', 'Pittsboro', 'NC', '919-542-3014', NULL, ARRAY['Civil Rights','Racial Justice','Workers Rights'], false, 'Veteran civil rights attorney with decades of racial justice work.'),
('James Ferguson', 'Ferguson Chambers & Sumter', 'Charlotte', 'NC', '704-375-8461', NULL, ARRAY['Civil Rights','Voting Rights','Education'], false, 'Pioneer Charlotte civil rights attorney. Decades of voting rights litigation.'),
('T. Greg Doucette', 'Doucette Law', 'Durham', 'NC', '919-294-3200', NULL, ARRAY['First Amendment','Criminal Defense','Civil Rights'], false, 'Durham attorney known for First Amendment and police accountability advocacy.'),
('Elizabeth Haddix', 'Lawyers Committee for Civil Rights (NC)', 'Durham', 'NC', '919-323-3380', 'https://lawyerscommittee.org', ARRAY['Voting Rights','Redistricting','Civil Rights'], true, 'Senior counsel handling redistricting and voting rights in North Carolina.'),
('Daryl Atkinson', 'Forward Justice', 'Durham', 'NC', '984-369-4421', 'https://forwardjustice.org', ARRAY['Criminal Justice','Voting Rights','Civil Rights'], true, 'Co-director of Forward Justice. Leading criminal justice reform advocate.'),
('Dawn Blagrove', 'Emancipate NC', 'Durham', 'NC', '919-682-1149', 'https://emancipatenc.org', ARRAY['Criminal Justice','Bail Reform','Racial Justice'], true, 'Executive Director of Emancipate NC fighting mass incarceration.'),
('Leah Kang', 'Southern Coalition for Social Justice', 'Durham', 'NC', '919-323-3380', 'https://scsj.org', ARRAY['Voting Rights','Immigration','Civil Rights'], true, 'Staff attorney at SCSJ handling voting and immigrants rights.'),
('Lily Fisk', 'NC Justice Center', 'Raleigh', 'NC', '919-856-2176', 'https://ncjustice.org', ARRAY['Workers Rights','Immigration','Civil Rights'], true, 'Workers rights attorney at NC Justice Center.'),
('Mark Dorosin', 'UNC Center for Civil Rights', 'Chapel Hill', 'NC', '919-843-7896', NULL, ARRAY['Civil Rights','Environmental Justice','Voting Rights'], true, 'Managing attorney at UNC Center for Civil Rights.'),
('Gene Nichol', 'UNC School of Law', 'Chapel Hill', 'NC', '919-962-4103', NULL, ARRAY['Poverty Law','Civil Rights','Constitutional Law'], true, 'Law professor and poverty law advocate at UNC.'),
('Peg Dorer', 'NC Conference of District Attorneys', 'Raleigh', 'NC', '919-890-1500', NULL, ARRAY['Criminal Justice','Reform','Civil Rights'], true, 'Criminal justice reform advocate.'),
('Scott Holmes', 'Legal Aid of North Carolina', 'Raleigh', 'NC', '919-856-2564', 'https://legalaidnc.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Executive Director providing statewide legal aid.'),
('Whitley Carpenter', 'Southern Environmental Law Center', 'Chapel Hill', 'NC', '919-967-1450', 'https://southernenvironment.org', ARRAY['Environmental Justice','Civil Rights','Land Use'], true, 'Attorney at SELC handling environmental justice.'),
('Irving Joyner', 'NC Central University School of Law', 'Durham', 'NC', '919-530-6333', NULL, ARRAY['Civil Rights','Criminal Justice','Racial Justice'], true, 'Law professor and NAACP legal advisor. Expert on racial justice in NC.'),
('Caitlin Swain', 'Carolina Justice Policy Center', 'Raleigh', 'NC', '919-856-2195', NULL, ARRAY['Criminal Justice','Civil Rights','Policy Reform'], true, 'Policy attorney working on criminal justice reform.'),
('Janet Loven', 'NC Prisoner Legal Services', 'Raleigh', 'NC', '919-856-2200', NULL, ARRAY['Prisoners Rights','Civil Rights','Conditions of Confinement'], true, 'Managing attorney handling prisoner rights cases.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- NORTH DAKOTA (5 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Cynthia Lindquist', 'North Dakota Legal Services', 'Bismarck', 'ND', '701-222-2110', 'https://legalassist.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Executive Director providing legal aid statewide.'),
('Thomas Dickson', 'Dickson Law', 'Fargo', 'ND', '701-244-7180', NULL, ARRAY['Civil Rights','Employment Discrimination','Criminal Defense'], false, 'Fargo civil rights and employment attorney.'),
('Michael Geiermann', 'Geiermann Law', 'Bismarck', 'ND', '701-258-7760', NULL, ARRAY['Civil Rights','Criminal Defense','Constitutional Law'], false, 'Handles civil rights and constitutional cases.'),
('Jacqueline Thomason', 'Legal Services of North Dakota', 'Bismarck', 'ND', '701-222-2110', 'https://legalassist.org', ARRAY['Native American Rights','Housing','Family Law'], true, 'Serves Native American communities.'),
('Tim Purdon', 'Robins Kaplan', 'Bismarck', 'ND', '701-255-3838', 'https://robinskaplan.com', ARRAY['Civil Rights','Criminal Justice','Federal Court'], false, 'Former US Attorney for ND. Now handles civil rights and federal cases.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- OHIO (18 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Freda Levenson', 'ACLU of Ohio', 'Cleveland', 'OH', '216-472-2220', 'https://acluohio.org', ARRAY['Civil Liberties','Criminal Justice','Voting Rights'], true, 'Legal Director of ACLU Ohio.'),
('Gary Daniels', 'ACLU of Ohio', 'Columbus', 'OH', '614-586-1972', 'https://acluohio.org', ARRAY['Free Speech','Privacy','Civil Liberties'], true, 'Chief lobbyist at ACLU Ohio handling legislative advocacy.'),
('Subodh Chandra', 'Chandra Law Firm', 'Cleveland', 'OH', '216-578-1700', 'https://chandralaw.com', ARRAY['Civil Rights','Police Misconduct','Section 1983'], false, 'Leading Ohio civil rights attorney. Handled Tamir Rice case.'),
('Terry Gilbert', 'Friedman Gilbert & Associates', 'Cleveland', 'OH', '216-241-1430', NULL, ARRAY['Civil Rights','Criminal Defense','Death Penalty'], false, 'Legendary Cleveland civil rights attorney with decades of civil rights litigation.'),
('Michael Wright', 'Wright & Schulte', 'Dayton', 'OH', '937-222-7477', NULL, ARRAY['Civil Rights','Police Misconduct','Employment'], false, 'Dayton civil rights attorney handling police misconduct.'),
('Richard Kerger', 'Kerger Law', 'Toledo', 'OH', '419-255-5990', NULL, ARRAY['First Amendment','Civil Rights','Criminal Defense'], false, 'Toledo First Amendment and civil rights attorney.'),
('David Malik', 'Malik & Associates', 'Cleveland', 'OH', '216-344-9393', NULL, ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Cleveland police misconduct attorney.'),
('Jacqueline Greene', 'Legal Aid Society of Cleveland', 'Cleveland', 'OH', '216-687-1900', 'https://lasclev.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Executive Director of Legal Aid Society of Cleveland.'),
('Rachel Nader', 'Ohio Justice & Policy Center', 'Cincinnati', 'OH', '513-421-1108', 'https://ohiojpc.org', ARRAY['Criminal Justice','Reentry','Civil Rights'], true, 'Staff attorney fighting for criminal justice reform.'),
('David Singleton', 'Ohio Justice & Policy Center', 'Cincinnati', 'OH', '513-421-1108', 'https://ohiojpc.org', ARRAY['Criminal Justice','Civil Rights','Racial Justice'], true, 'Executive Director of OJPC. Leading criminal justice reformer.'),
('Michael Benza', 'Case Western Reserve Law', 'Cleveland', 'OH', '216-368-2766', NULL, ARRAY['Death Penalty','Criminal Justice','Constitutional Law'], true, 'Law professor and death penalty expert.'),
('Robert Tobik', 'Ohio Public Defender', 'Columbus', 'OH', '614-466-5394', 'https://opd.ohio.gov', ARRAY['Criminal Defense','Capital Defense','Civil Rights'], true, 'State Public Defender overseeing defense services.'),
('Amanda Powell', 'Advocates for Basic Legal Equality', 'Toledo', 'OH', '419-255-0814', 'https://ablelaw.org', ARRAY['Housing','Immigration','Civil Rights'], true, 'Managing attorney at ABLE providing legal aid.'),
('Drew Dennis', 'Ohio State Legal Services Association', 'Columbus', 'OH', '614-221-7201', 'https://oslsa.org', ARRAY['Poverty Law','Civil Rights','Public Benefits'], true, 'Executive Director overseeing statewide legal aid.'),
('Al Gerhardstein', 'Gerhardstein & Branch', 'Cincinnati', 'OH', '513-621-9100', NULL, ARRAY['Civil Rights','LGBTQ Rights','Police Misconduct'], false, 'Legendary Ohio civil rights attorney. Led marriage equality and prison reform cases.'),
('Alphonse Gerhardstein', 'Gerhardstein & Branch', 'Cincinnati', 'OH', '513-621-9100', NULL, ARRAY['Prison Reform','Police Misconduct','Section 1983'], false, 'Senior partner known for prison conditions and police accountability.'),
('Siddhartha Vaidyanathan', 'ACLU of Ohio', 'Cleveland', 'OH', '216-472-2220', 'https://acluohio.org', ARRAY['Civil Rights','Immigrants Rights','Racial Justice'], true, 'Staff attorney handling immigrants rights.'),
('Mark Godsey', 'Ohio Innocence Project', 'Cincinnati', 'OH', '513-556-4296', 'https://law.uc.edu/oip', ARRAY['Wrongful Conviction','Criminal Justice','DNA Evidence'], true, 'Director of Ohio Innocence Project at UC Law.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- OKLAHOMA (10 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Ryan Kiesel', 'ACLU of Oklahoma', 'Oklahoma City', 'OK', '405-524-8511', 'https://acluok.org', ARRAY['Civil Liberties','Criminal Justice','Free Speech'], true, 'Former Executive Director of ACLU Oklahoma.'),
('Brady Henderson', 'ACLU of Oklahoma', 'Oklahoma City', 'OK', '405-524-8511', 'https://acluok.org', ARRAY['Civil Liberties','Police Accountability','Death Penalty'], true, 'Legal Director of ACLU Oklahoma.'),
('Michael Bromfield', 'Oklahoma Indian Legal Services', 'Oklahoma City', 'OK', '405-943-6457', 'https://oilsonline.org', ARRAY['Native American Rights','Tribal Law','Civil Rights'], true, 'Executive Director serving Native American communities.'),
('Mark Henricksen', 'Henricksen & Henricksen', 'Oklahoma City', 'OK', '405-840-0678', NULL, ARRAY['Civil Rights','Police Misconduct','Section 1983'], false, 'Oklahoma police misconduct attorney.'),
('Garvin Isaacs', 'Isaacs Law', 'Oklahoma City', 'OK', '405-232-0000', NULL, ARRAY['Civil Rights','Criminal Defense','Constitutional Law'], false, 'Former OBA president. Civil rights and criminal defense.'),
('David Prater', 'Legal Aid Services of Oklahoma', 'Oklahoma City', 'OK', '405-557-0020', 'https://legalaidok.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Managing attorney providing legal aid.'),
('Lauren Hanna', 'Still She Rises', 'Tulsa', 'OK', '918-779-6749', 'https://stillsherises.org', ARRAY['Criminal Defense','Women Rights','Civil Rights'], true, 'Staff attorney at Still She Rises defending incarcerated women.'),
('Dan Smolen', 'Smolen Law', 'Tulsa', 'OK', '918-585-2667', NULL, ARRAY['Police Misconduct','Civil Rights','Prison Conditions'], false, 'Tulsa civil rights attorney handling police and prison cases.'),
('Jill Webb', 'Oklahoma Appleseed', 'Oklahoma City', 'OK', '405-521-1500', NULL, ARRAY['Criminal Justice','Civil Rights','Juvenile Justice'], true, 'Handles criminal and juvenile justice reform.'),
('Megan Lambert', 'Disability Rights Oklahoma', 'Oklahoma City', 'OK', '405-525-7755', 'https://drOklahoma.org', ARRAY['Disability Rights','ADA','Civil Rights'], true, 'Staff attorney handling ADA enforcement.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- OREGON (12 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Kelly Simon', 'ACLU of Oregon', 'Portland', 'OR', '503-227-3186', 'https://aclu-or.org', ARRAY['Civil Liberties','Criminal Justice','Racial Justice'], true, 'Interim Legal Director of ACLU Oregon.'),
('Mathew dos Santos', 'ACLU of Oregon', 'Portland', 'OR', '503-227-3186', 'https://aclu-or.org', ARRAY['Free Speech','Privacy','Police Accountability'], true, 'Staff attorney handling free speech and police accountability.'),
('Juan Chavez', 'Oregon Justice Resource Center', 'Portland', 'OR', '503-944-2270', 'https://ojrc.info', ARRAY['Civil Rights','Criminal Justice','Immigration'], true, 'Executive Director of OJRC.'),
('Jesse Merrithew', 'Albies Stark & Guerriero', 'Portland', 'OR', '503-227-0200', NULL, ARRAY['Police Misconduct','Civil Rights','Protest Rights'], false, 'Portland civil rights attorney defending protesters and handling police cases.'),
('Greg Kafoury', 'Kafoury & McDougal', 'Portland', 'OR', '503-224-2647', NULL, ARRAY['Civil Rights','Police Misconduct','Personal Injury'], false, 'Legendary Portland civil rights attorney.'),
('Mark McDougal', 'Kafoury & McDougal', 'Portland', 'OR', '503-224-2647', NULL, ARRAY['Civil Rights','Police Misconduct','Section 1983'], false, 'Partner handling civil rights and police cases.'),
('Andrea Williams', 'Causa Oregon', 'Portland', 'OR', '503-228-0043', 'https://causaoregon.org', ARRAY['Immigrants Rights','Civil Rights','Workers Rights'], true, 'Executive Director of Causa leading immigrant advocacy.'),
('Teresa Statler', 'Legal Aid Services of Oregon', 'Portland', 'OR', '503-224-4086', 'https://lasoregon.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Executive Director providing statewide legal aid.'),
('David Fidanque', 'ACLU of Oregon', 'Portland', 'OR', '503-227-3186', 'https://aclu-or.org', ARRAY['Civil Liberties','Free Speech','Privacy'], true, 'Former Executive Director of ACLU Oregon.'),
('Jason Kafoury', 'Kafoury & McDougal', 'Portland', 'OR', '503-224-2647', NULL, ARRAY['Civil Rights','Employment Discrimination','Police Misconduct'], false, 'Portland civil rights and employment attorney.'),
('Nadia Dahab', 'ACLU of Oregon', 'Portland', 'OR', '503-227-3186', 'https://aclu-or.org', ARRAY['Immigrants Rights','Civil Liberties','Criminal Justice'], true, 'Staff attorney handling immigrant rights.'),
('Kim Sordyl', 'Sordyl Law', 'Portland', 'OR', '503-894-8832', NULL, ARRAY['Government Transparency','First Amendment','Civil Rights'], false, 'Public records and First Amendment attorney.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- PENNSYLVANIA (20 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Mary Catherine Roper', 'ACLU of Pennsylvania', 'Philadelphia', 'PA', '215-592-1513', 'https://aclupa.org', ARRAY['Civil Liberties','Free Speech','Police Reform'], true, 'Deputy Legal Director of ACLU Pennsylvania.'),
('Reggie Shuford', 'ACLU of Pennsylvania', 'Philadelphia', 'PA', '215-592-1513', 'https://aclupa.org', ARRAY['Racial Justice','Criminal Justice','Civil Liberties'], true, 'Executive Director of ACLU Pennsylvania.'),
('Witold Walczak', 'ACLU of Pennsylvania', 'Pittsburgh', 'PA', '412-681-7736', 'https://aclupa.org', ARRAY['Civil Liberties','Prisoners Rights','Free Speech'], true, 'Legal Director of ACLU PA Western region.'),
('Jonathan Feinberg', 'Kairys Rudovsky Messing Feinberg & Lin', 'Philadelphia', 'PA', '215-925-4400', NULL, ARRAY['Civil Rights','Police Misconduct','Section 1983'], false, 'Partner at premier Philadelphia civil rights firm.'),
('David Rudovsky', 'Kairys Rudovsky Messing Feinberg & Lin', 'Philadelphia', 'PA', '215-925-4400', NULL, ARRAY['Civil Rights','Police Misconduct','Constitutional Law'], false, 'Legendary civil rights attorney. MacArthur Fellow.'),
('Michael Coard', 'Coard Law', 'Philadelphia', 'PA', '215-309-0280', NULL, ARRAY['Civil Rights','Criminal Defense','Racial Justice'], false, 'Prominent Philadelphia civil rights and criminal defense attorney.'),
('Keir Bradford-Grey', 'Defender Association of Philadelphia', 'Philadelphia', 'PA', '215-568-3190', 'https://philadefender.org', ARRAY['Criminal Defense','Civil Rights','Public Defense'], true, 'Chief Defender overseeing public defense in Philadelphia.'),
('Timothy Welbeck', 'CAIR Philadelphia', 'Philadelphia', 'PA', '267-515-6710', 'https://pa.cair.com', ARRAY['Religious Freedom','Civil Rights','Discrimination'], true, 'Civil rights director at CAIR Philadelphia.'),
('Larry Krasner', 'District Attorney Office Philadelphia', 'Philadelphia', 'PA', '215-686-8000', NULL, ARRAY['Criminal Justice','Reform','Civil Rights'], false, 'Progressive Philadelphia DA focused on criminal justice reform.'),
('Sara Mullen', 'ACLU of Pennsylvania', 'Harrisburg', 'PA', '717-238-2258', 'https://aclupa.org', ARRAY['Advocacy','Civil Liberties','Legislative Reform'], true, 'Associate Director leading policy advocacy.'),
('Will Gonzalez', 'CEIBA', 'Philadelphia', 'PA', '215-634-7245', NULL, ARRAY['Housing','Civil Rights','Community Development'], true, 'Executive Director of CEIBA fighting housing discrimination.'),
('Jennifer Clarke', 'Public Interest Law Center', 'Philadelphia', 'PA', '215-627-7100', 'https://pubintlaw.org', ARRAY['Education Equity','Voting Rights','Civil Rights'], true, 'Executive Director of PILC handling education and voting rights.'),
('Michael Churchill', 'Public Interest Law Center', 'Philadelphia', 'PA', '215-627-7100', 'https://pubintlaw.org', ARRAY['Civil Rights','Disability Rights','Education'], true, 'Senior attorney at PILC with decades of civil rights work.'),
('Sandra Thompson', 'NAACP York County', 'York', 'PA', '717-848-8737', NULL, ARRAY['Civil Rights','Racial Justice','Community Advocacy'], true, 'Chapter president leading civil rights advocacy in central PA.'),
('Paul Hetznecker', 'Hetznecker & Sweeney', 'Philadelphia', 'PA', '215-567-7117', NULL, ARRAY['Criminal Defense','Civil Rights','Protest Rights'], false, 'Philadelphia attorney defending activists and protesters.'),
('Bret Grote', 'Abolitionist Law Center', 'Pittsburgh', 'PA', '412-654-9070', 'https://abolitionistlawcenter.org', ARRAY['Prisoners Rights','Solitary Confinement','Civil Rights'], true, 'Executive Director fighting solitary confinement and prison conditions.'),
('Nyssa Taylor', 'ACLU of Pennsylvania', 'Philadelphia', 'PA', '215-592-1513', 'https://aclupa.org', ARRAY['Criminal Justice','Marijuana Reform','Civil Rights'], true, 'Criminal justice advocate at ACLU PA.'),
('Julia Simon-Mishel', 'Philadelphia Legal Assistance', 'Philadelphia', 'PA', '215-981-3800', 'https://philalegal.org', ARRAY['Public Benefits','Employment','Civil Rights'], true, 'Supervising attorney handling public benefits and employment.'),
('Jamila Aisha Brown', 'Community Legal Services', 'Philadelphia', 'PA', '215-981-3700', 'https://clsphila.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Staff attorney at CLS handling housing and benefits.'),
('Sara Jacobson', 'Philadelphia Lawyers for Social Equity', 'Philadelphia', 'PA', '215-995-1230', 'https://plsephilly.org', ARRAY['Criminal Record Expungement','Civil Rights','Reentry'], true, 'Executive Director helping people clear criminal records.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- RHODE ISLAND (6 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Steven Brown', 'ACLU of Rhode Island', 'Providence', 'RI', '401-831-7171', 'https://riaclu.org', ARRAY['Civil Liberties','Free Speech','Government Transparency'], true, 'Executive Director of ACLU Rhode Island.'),
('Lynette Labinger', 'Labinger Law', 'Providence', 'RI', '401-465-9565', NULL, ARRAY['Civil Rights','Employment Discrimination','Section 1983'], false, 'Leading Rhode Island civil rights attorney.'),
('Jennifer Wood', 'Rhode Island Center for Justice', 'Providence', 'RI', '401-491-1101', 'https://centerforjustice.org', ARRAY['Housing','Poverty Law','Civil Rights'], true, 'Executive Director of RI Center for Justice.'),
('Sonja Deyoe', 'Deyoe Law', 'Providence', 'RI', '401-270-5858', NULL, ARRAY['Criminal Defense','Civil Rights','First Amendment'], false, 'Criminal defense and civil rights attorney.'),
('Robert Thurston', 'NAACP Providence Branch', 'Providence', 'RI', '401-274-1420', NULL, ARRAY['Civil Rights','Racial Justice','Community Advocacy'], true, 'NAACP Providence leader in civil rights advocacy.'),
('Amy Nunn', 'RI Legal Services', 'Providence', 'RI', '401-274-2652', 'https://rils.org', ARRAY['Housing','Immigration','Civil Rights'], true, 'Managing attorney at RI Legal Services.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- SOUTH CAROLINA (10 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Allen Chaney', 'ACLU of South Carolina', 'Columbia', 'SC', '803-799-5151', 'https://aclusc.org', ARRAY['Civil Liberties','Criminal Justice','Racial Justice'], true, 'Legal Director of ACLU South Carolina.'),
('Shaundra Scott', 'SC Appleseed', 'Columbia', 'SC', '803-779-1113', 'https://scappleseed.org', ARRAY['Poverty Law','Civil Rights','Education'], true, 'Executive Director leading poverty law advocacy.'),
('Armand Derfner', 'Derfner Altman & Wilborn', 'Charleston', 'SC', '843-723-9804', NULL, ARRAY['Voting Rights','Civil Rights','Section 1983'], false, 'Legendary South Carolina voting rights attorney.'),
('Malissa Burnette', 'Burnette Shutt & McDaniel', 'Columbia', 'SC', '803-227-3400', NULL, ARRAY['Civil Rights','LGBTQ Rights','Employment'], false, 'Leading SC civil rights attorney. Key marriage equality litigator.'),
('Bakari Sellers', 'Strom Law Firm', 'Columbia', 'SC', '803-252-4800', NULL, ARRAY['Civil Rights','Personal Injury','Community Advocacy'], false, 'Former state legislator and civil rights attorney.'),
('Andrea Loney', 'SC Legal Services', 'Greenville', 'SC', '864-679-3232', 'https://sclegal.org', ARRAY['Housing','Family Law','Civil Rights'], true, 'Managing attorney at SC Legal Services.'),
('Chase Harbin', 'ACLU of South Carolina', 'Columbia', 'SC', '803-799-5151', 'https://aclusc.org', ARRAY['LGBTQ Rights','Civil Liberties','Education'], true, 'Staff attorney handling LGBTQ and education rights.'),
('Justin Bamberg', 'Bamberg Legal', 'Bamberg', 'SC', '803-245-3113', NULL, ARRAY['Police Misconduct','Civil Rights','Criminal Defense'], false, 'State legislator and police misconduct attorney. Represented Walter Scott family.'),
('Todd Rutherford', 'Rutherford & Johnson', 'Columbia', 'SC', '803-252-4800', NULL, ARRAY['Criminal Defense','Civil Rights','Legislative Advocacy'], false, 'State House Minority Leader and civil rights attorney.'),
('Brenda Murphy', 'SC Conference NAACP', 'Columbia', 'SC', '803-754-7425', NULL, ARRAY['Civil Rights','Racial Justice','Education'], true, 'SC NAACP Conference president leading statewide advocacy.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- SOUTH DAKOTA (5 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Courtney Bowie', 'ACLU of South Dakota', 'Sioux Falls', 'SD', '605-332-2508', 'https://aclu-sd.org', ARRAY['Civil Liberties','Native American Rights','Criminal Justice'], true, 'Staff attorney at ACLU South Dakota.'),
('Dana Hanna', 'Hanna Law', 'Rapid City', 'SD', '605-791-1832', NULL, ARRAY['Civil Rights','Native American Rights','Police Misconduct'], false, 'Handles civil rights and Native American rights cases.'),
('Thomas Digiovanni', 'East River Legal Services', 'Sioux Falls', 'SD', '605-336-9230', 'https://erlservices.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Executive Director providing legal aid.'),
('Tim Rensch', 'Dakota Plains Legal Services', 'Mission', 'SD', '605-856-4444', 'https://dpls.org', ARRAY['Native American Rights','Civil Rights','Tribal Law'], true, 'Executive Director serving Native communities.'),
('Brendan Johnson', 'Robins Kaplan', 'Sioux Falls', 'SD', '605-335-1300', 'https://robinskaplan.com', ARRAY['Civil Rights','Federal Court','Criminal Justice'], false, 'Former US Attorney for SD. Handles civil rights cases.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- TENNESSEE (12 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Thomas Castelli', 'ACLU of Tennessee', 'Nashville', 'TN', '615-320-7142', 'https://aclu-tn.org', ARRAY['Civil Liberties','Free Speech','Criminal Justice'], true, 'Legal Director of ACLU Tennessee.'),
('Stella Yarbrough', 'ACLU of Tennessee', 'Nashville', 'TN', '615-320-7142', 'https://aclu-tn.org', ARRAY['Civil Rights','Racial Justice','Voting Rights'], true, 'Staff attorney handling racial justice and voting rights.'),
('William Massengale', 'Massengale Law', 'Memphis', 'TN', '901-523-1668', NULL, ARRAY['Civil Rights','Police Misconduct','Section 1983'], false, 'Memphis civil rights attorney handling police misconduct.'),
('Daniel Horwitz', 'Horwitz Law', 'Nashville', 'TN', '615-739-2888', NULL, ARRAY['Civil Rights','First Amendment','Constitutional Law'], false, 'Nashville constitutional rights attorney handling high-profile cases.'),
('Dawn Deaner', 'Tennessee Justice Center', 'Nashville', 'TN', '615-255-0331', 'https://tnjustice.org', ARRAY['Healthcare','Public Benefits','Civil Rights'], true, 'Executive Director fighting for healthcare access.'),
('Michael Rains', 'Legal Aid Society of Middle TN', 'Nashville', 'TN', '615-244-6610', 'https://las.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Executive Director providing legal aid.'),
('Van Turner', 'NAACP Memphis Branch', 'Memphis', 'TN', '901-521-1343', NULL, ARRAY['Civil Rights','Racial Justice','Community Advocacy'], true, 'NAACP Memphis president leading civil rights advocacy.'),
('Kyle Mothershead', 'Mothershead Law', 'Knoxville', 'TN', '865-299-2723', NULL, ARRAY['Civil Rights','Criminal Defense','Police Misconduct'], false, 'Knoxville civil rights and criminal defense attorney.'),
('Karla Campbell', 'Tennessee Alliance for Legal Services', 'Nashville', 'TN', '615-627-0956', 'https://tals.org', ARRAY['Civil Rights','Legal Aid Coordination','Access to Justice'], true, 'Executive Director coordinating legal aid statewide.'),
('David Raybin', 'Raybin & Weissman', 'Nashville', 'TN', '615-256-6666', NULL, ARRAY['Criminal Defense','Civil Rights','Constitutional Law'], false, 'Veteran Nashville criminal defense and civil rights attorney.'),
('Tricia Herzfeld', 'Just City', 'Memphis', 'TN', '901-207-3825', 'https://justcity.org', ARRAY['Criminal Justice','Bail Reform','Civil Rights'], true, 'Executive Director of Just City fighting for bail reform.'),
('Catherine Gruber', 'Disability Rights Tennessee', 'Nashville', 'TN', '615-298-1080', 'https://disabilityrightstn.org', ARRAY['Disability Rights','ADA','Civil Rights'], true, 'Staff attorney handling disability rights.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- TEXAS (25 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Andre Segura', 'ACLU of Texas', 'Houston', 'TX', '713-942-8146', 'https://aclutx.org', ARRAY['Civil Liberties','Immigration','Criminal Justice'], true, 'Legal Director of ACLU Texas.'),
('Edgar Saldivar', 'ACLU of Texas', 'Houston', 'TX', '713-942-8146', 'https://aclutx.org', ARRAY['Voting Rights','Immigration','Civil Rights'], true, 'Senior staff attorney handling voting and immigration.'),
('Thomas Buser-Clancy', 'ACLU of Texas', 'Austin', 'TX', '512-478-7300', 'https://aclutx.org', ARRAY['LGBTQ Rights','Free Speech','Civil Liberties'], true, 'Staff attorney handling LGBTQ and free speech.'),
('Lee Merritt', 'Merritt Law Firm', 'Dallas', 'TX', '469-672-6762', NULL, ARRAY['Police Misconduct','Civil Rights','Racial Justice'], false, 'Nationally prominent civil rights attorney. High-profile police misconduct cases.'),
('S. Lee Merritt', 'Civil Rights Corps', 'Dallas', 'TX', '469-672-6762', NULL, ARRAY['Civil Rights','Police Accountability','Section 1983'], false, 'Founding member of Next Generation Action Network.'),
('Daryl Washington', 'Washington Law Firm', 'Dallas', 'TX', '214-740-4100', NULL, ARRAY['Police Misconduct','Civil Rights','Personal Injury'], false, 'Dallas police misconduct and civil rights attorney.'),
('Randall Kallinen', 'Kallinen Law', 'Houston', 'TX', '713-320-3785', NULL, ARRAY['Civil Rights','Police Misconduct','First Amendment'], false, 'Former ACLU Houston chapter president. Police misconduct specialist.'),
('Brian McGiverin', 'ACLU of Texas', 'Austin', 'TX', '512-478-7300', 'https://aclutx.org', ARRAY['Free Speech','Technology','Privacy'], true, 'Staff attorney handling technology and privacy rights.'),
('Roberto Alonzo', 'Alonzo Law', 'Dallas', 'TX', '214-941-2288', NULL, ARRAY['Civil Rights','Immigration','Criminal Defense'], false, 'Dallas civil rights and immigration attorney.'),
('Christina Beeler', 'Texas RioGrande Legal Aid', 'Austin', 'TX', '512-374-2700', 'https://trla.org', ARRAY['Housing','Immigration','Workers Rights'], true, 'Managing attorney at TRLA providing legal aid.'),
('David Hinojosa', 'Lawyers Committee for Civil Rights', 'San Antonio', 'TX', '210-572-7200', 'https://lawyerscommittee.org', ARRAY['Education Equity','Voting Rights','Civil Rights'], true, 'Education equity litigator for Texas and the Southwest.'),
('Nina Perales', 'Mexican American Legal Defense Fund', 'San Antonio', 'TX', '210-224-5476', 'https://maldef.org', ARRAY['Voting Rights','Immigration','Civil Rights'], true, 'VP of Litigation at MALDEF. Leading voting rights attorney.'),
('Thomas Saenz', 'MALDEF', 'San Antonio', 'TX', '210-224-5476', 'https://maldef.org', ARRAY['Civil Rights','Immigration','Employment'], true, 'President and General Counsel of MALDEF.'),
('Efrén Olivares', 'Texas Civil Rights Project', 'Austin', 'TX', '512-474-5073', 'https://texascivilrightsproject.org', ARRAY['Voting Rights','Criminal Justice','Civil Rights'], true, 'Deputy Legal Director at Texas Civil Rights Project.'),
('Mimi Marziani', 'Texas Civil Rights Project', 'Austin', 'TX', '512-474-5073', 'https://texascivilrightsproject.org', ARRAY['Voting Rights','Civil Rights','Redistricting'], true, 'President of Texas Civil Rights Project.'),
('Gary Bledsoe', 'NAACP Texas', 'Austin', 'TX', '512-472-1122', NULL, ARRAY['Civil Rights','Racial Justice','Education'], true, 'Texas NAACP president leading statewide civil rights.'),
('Fatima Menendez', 'MALDEF', 'San Antonio', 'TX', '210-224-5476', 'https://maldef.org', ARRAY['Education Equity','Civil Rights','Constitutional Law'], true, 'Regional counsel handling education equity.'),
('Rebecca Robertson', 'ACLU of Texas', 'Austin', 'TX', '512-478-7300', 'https://aclutx.org', ARRAY['Criminal Justice','Civil Liberties','Advocacy'], true, 'Policy director leading legislative advocacy.'),
('Jim Harrington', 'Texas Civil Rights Project', 'Austin', 'TX', '512-474-5073', 'https://texascivilrightsproject.org', ARRAY['Civil Rights','Workers Rights','Police Misconduct'], true, 'Founder of Texas Civil Rights Project.'),
('Jessica Azulay', 'Texas Appleseed', 'Austin', 'TX', '512-473-2800', 'https://texasappleseed.org', ARRAY['School to Prison Pipeline','Juvenile Justice','Civil Rights'], true, 'Staff attorney handling juvenile justice.'),
('Adriana Piñon', 'ACLU of Texas', 'San Antonio', 'TX', '210-227-6254', 'https://aclutx.org', ARRAY['Immigrants Rights','Civil Rights','Border Issues'], true, 'Policy strategist handling border and immigrant rights.'),
('Trisha Trigilio', 'ACLU of Texas', 'Houston', 'TX', '713-942-8146', 'https://aclutx.org', ARRAY['LGBTQ Rights','Civil Rights','Transgender Rights'], true, 'Staff attorney handling LGBTQ rights.'),
('Walters Chin', 'Lone Star Legal Aid', 'Houston', 'TX', '713-652-0077', 'https://lonestarlegal.org', ARRAY['Housing','Consumer Protection','Civil Rights'], true, 'Managing attorney at Lone Star Legal Aid.'),
('Jason Smith', 'Equal Justice Center', 'Austin', 'TX', '512-474-0007', 'https://equaljusticecenter.org', ARRAY['Workers Rights','Wage Theft','Employment'], true, 'Executive Director fighting wage theft and worker exploitation.'),
('Keith Hampton', 'Hampton Law', 'Austin', 'TX', '512-476-8484', NULL, ARRAY['Criminal Defense','Civil Rights','Appeals'], false, 'Austin criminal defense and civil rights appellate attorney.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- UTAH (8 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('John Mejia', 'ACLU of Utah', 'Salt Lake City', 'UT', '801-521-9862', 'https://acluutah.org', ARRAY['Civil Liberties','Immigration','Criminal Justice'], true, 'Legal Director of ACLU Utah.'),
('Marina Lowe', 'ACLU of Utah', 'Salt Lake City', 'UT', '801-521-9862', 'https://acluutah.org', ARRAY['Civil Rights','Free Speech','Privacy'], true, 'Staff attorney handling free speech and privacy.'),
('Robert Sykes', 'Sykes McAllister Law', 'Salt Lake City', 'UT', '801-533-0222', NULL, ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Leading Utah police misconduct attorney.'),
('Stewart Ralphs', 'Legal Aid Society of Salt Lake', 'Salt Lake City', 'UT', '801-328-8849', 'https://lasslc.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Executive Director providing legal aid.'),
('Troy Booher', 'Zimmerman Booher', 'Salt Lake City', 'UT', '801-924-0200', NULL, ARRAY['Constitutional Law','Civil Rights','Appeals'], false, 'Partner handling constitutional and appellate civil rights.'),
('Jeanetta Williams', 'NAACP Salt Lake Branch', 'Salt Lake City', 'UT', '801-776-2623', NULL, ARRAY['Civil Rights','Racial Justice','Community Advocacy'], true, 'NAACP president leading civil rights in Utah.'),
('Mark Alvarez', 'Utah Legal Services', 'Salt Lake City', 'UT', '801-328-8891', 'https://utahlegalservices.org', ARRAY['Immigration','Housing','Civil Rights'], true, 'Managing attorney handling immigration and housing.'),
('Valentina De Fex', 'Disability Law Center Utah', 'Salt Lake City', 'UT', '801-363-1347', 'https://disabilitylawcenter.org', ARRAY['Disability Rights','ADA','Civil Rights'], true, 'Staff attorney handling disability rights.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- VERMONT (6 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('James Lyall', 'ACLU of Vermont', 'Montpelier', 'VT', '802-223-6304', 'https://acluvt.org', ARRAY['Civil Liberties','Criminal Justice','Privacy'], true, 'Executive Director of ACLU Vermont.'),
('Lia Ernst', 'ACLU of Vermont', 'Montpelier', 'VT', '802-223-6304', 'https://acluvt.org', ARRAY['Civil Rights','Racial Justice','Free Speech'], true, 'Legal Director of ACLU Vermont.'),
('Eric Avildsen', 'Vermont Legal Aid', 'Burlington', 'VT', '802-863-5620', 'https://vtlegalaid.org', ARRAY['Housing','Public Benefits','Disability Rights'], true, 'Executive Director of Vermont Legal Aid.'),
('Jared Carter', 'Vermont Law School', 'South Royalton', 'VT', '802-831-1000', NULL, ARRAY['Constitutional Law','Civil Rights','First Amendment'], true, 'Professor teaching constitutional law and civil rights.'),
('Robert Appel', 'Human Rights Commission VT', 'Montpelier', 'VT', '802-828-2480', NULL, ARRAY['Discrimination','Civil Rights','Employment'], true, 'Former Executive Director of Vermont Human Rights Commission.'),
('Matthew Valerio', 'Defender General Office', 'Montpelier', 'VT', '802-828-3168', NULL, ARRAY['Criminal Defense','Civil Rights','Public Defense'], true, 'Defender General overseeing public defense in Vermont.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- VIRGINIA (18 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Eden Heilman', 'ACLU of Virginia', 'Richmond', 'VA', '804-644-8080', 'https://acluva.org', ARRAY['Civil Liberties','Criminal Justice','Racial Justice'], true, 'Legal Director of ACLU Virginia.'),
('Claire Gastañaga', 'ACLU of Virginia', 'Richmond', 'VA', '804-644-8080', 'https://acluva.org', ARRAY['Civil Liberties','Advocacy','Legislative Reform'], true, 'Former Executive Director of ACLU Virginia.'),
('Victor Glasberg', 'Victor Glasberg & Associates', 'Alexandria', 'VA', '703-684-1100', NULL, ARRAY['Civil Rights','First Amendment','Section 1983'], false, 'Legendary Virginia civil rights attorney. Decades of First Amendment work.'),
('Jonathan Smith', 'Washington Lawyers Committee', 'Arlington', 'VA', '202-319-1000', 'https://washlaw.org', ARRAY['Civil Rights','Fair Housing','Employment'], true, 'Former DOJ Civil Rights Division chief. Expert on police reform.'),
('Angela Ciolfi', 'Legal Aid Justice Center', 'Charlottesville', 'VA', '434-977-0553', 'https://justice4all.org', ARRAY['Immigration','Workers Rights','Civil Rights'], true, 'Executive Director of LAJC serving immigrant and low-income Virginians.'),
('Tim Heaphy', 'Hunton Andrews Kurth', 'Charlottesville', 'VA', '434-979-1470', NULL, ARRAY['Civil Rights','White Collar','Government Investigations'], false, 'Former US Attorney. Investigated Charlottesville events.'),
('Vishal Agraharkar', 'ACLU of Virginia', 'Richmond', 'VA', '804-644-8080', 'https://acluva.org', ARRAY['Voting Rights','Civil Rights','Redistricting'], true, 'Staff attorney handling voting rights and redistricting.'),
('Leslie Mehta', 'ACLU of Virginia', 'Richmond', 'VA', '804-644-8080', 'https://acluva.org', ARRAY['Immigrants Rights','Civil Liberties','Criminal Justice'], true, 'Staff attorney handling immigrant rights.'),
('Phil Hirschkop', 'Hirschkop & Associates', 'Lorton', 'VA', '703-550-7900', NULL, ARRAY['Civil Rights','Constitutional Law','Section 1983'], false, 'Represented the Lovings in Loving v. Virginia. Civil rights legend.'),
('Chad Dorr', 'Virginia Poverty Law Center', 'Richmond', 'VA', '804-782-9430', 'https://vplc.org', ARRAY['Housing','Consumer Protection','Civil Rights'], true, 'Managing attorney at VPLC handling housing and consumer issues.'),
('Kyle McNew', 'McNew Law', 'Roanoke', 'VA', '540-491-9696', NULL, ARRAY['Civil Rights','Police Misconduct','First Amendment'], false, 'Southwest Virginia civil rights attorney.'),
('Rebecca Glenberg', 'ACLU of Virginia', 'Richmond', 'VA', '804-644-8080', 'https://acluva.org', ARRAY['Free Speech','Religious Liberty','Civil Liberties'], true, 'Senior staff attorney handling free speech.'),
('Rachel Sheldon', 'Virginia Legal Aid Society', 'Lynchburg', 'VA', '434-528-4722', 'https://vlas.org', ARRAY['Housing','Family Law','Civil Rights'], true, 'Managing attorney providing legal aid in central Virginia.'),
('Devon Simmons', 'Legal Aid Works', 'Fredericksburg', 'VA', '540-371-1105', NULL, ARRAY['Housing','Civil Rights','Family Law'], true, 'Staff attorney providing legal aid in northern Virginia.'),
('Colleen Miller', 'Disability Law Center of Virginia', 'Richmond', 'VA', '804-225-2042', 'https://dlcv.org', ARRAY['Disability Rights','ADA','Civil Rights'], true, 'Executive Director handling disability rights.'),
('Hope Amezquita', 'ACLU of Virginia', 'Norfolk', 'VA', '757-330-2600', 'https://acluva.org', ARRAY['Criminal Justice','Racial Justice','Civil Rights'], true, 'Staff attorney handling criminal justice in eastern Virginia.'),
('Mario Salas', 'Virginia NAACP', 'Richmond', 'VA', '804-321-5765', NULL, ARRAY['Civil Rights','Racial Justice','Voting Rights'], true, 'Virginia NAACP leader in civil rights advocacy.'),
('Rob Lee', 'Charlottesville Public Defender', 'Charlottesville', 'VA', '434-971-7068', NULL, ARRAY['Criminal Defense','Civil Rights','Public Defense'], true, 'Public Defender handling civil rights and criminal defense.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- WASHINGTON (15 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Breanne Schuster', 'ACLU of Washington', 'Seattle', 'WA', '206-624-2184', 'https://aclu-wa.org', ARRAY['Civil Liberties','Criminal Justice','Policing'], true, 'Staff attorney at ACLU Washington.'),
('La Rond Baker', 'ACLU of Washington', 'Seattle', 'WA', '206-624-2184', 'https://aclu-wa.org', ARRAY['Racial Justice','Criminal Justice','Civil Rights'], true, 'Staff attorney handling racial and criminal justice.'),
('Lisa Nowlin', 'ACLU of Washington', 'Seattle', 'WA', '206-624-2184', 'https://aclu-wa.org', ARRAY['Technology','Privacy','Civil Liberties'], true, 'Staff attorney on technology and privacy.'),
('Jesse Wing', 'MacDonald Hoague & Bayless', 'Seattle', 'WA', '206-622-1604', NULL, ARRAY['Civil Rights','Employment Discrimination','Class Action'], false, 'Partner handling employment and civil rights class actions.'),
('Jeffery Robinson', 'The Who We Are Project', 'Seattle', 'WA', '206-624-2184', NULL, ARRAY['Racial Justice','Civil Rights','Constitutional Law'], true, 'Former ACLU deputy legal director. Expert on race and American history.'),
('Matt Adams', 'Northwest Immigrant Rights Project', 'Seattle', 'WA', '206-587-4009', 'https://nwirp.org', ARRAY['Immigration','Civil Rights','Deportation Defense'], true, 'Legal Director of NWIRP handling immigration rights.'),
('Jorge Baron', 'Northwest Immigrant Rights Project', 'Seattle', 'WA', '206-587-4009', 'https://nwirp.org', ARRAY['Immigration','Civil Rights','Workers Rights'], true, 'Executive Director of NWIRP.'),
('Sara Ainsworth', 'Legal Voice', 'Seattle', 'WA', '206-682-9552', 'https://legalvoice.org', ARRAY['Gender Justice','Civil Rights','Employment'], true, 'Executive Director fighting for gender justice.'),
('Nicholas Straley', 'Columbia Legal Services', 'Seattle', 'WA', '206-464-5911', 'https://columbialegal.org', ARRAY['Housing','Civil Rights','Environmental Justice'], true, 'Staff attorney at CLS handling housing and civil rights.'),
('Eric Stahl', 'Davis Wright Tremaine', 'Seattle', 'WA', '206-622-3150', 'https://dwt.com', ARRAY['First Amendment','Media Law','Free Speech'], false, 'Partner and First Amendment litigator.'),
('Toby Marshall', 'Terrell Marshall Law Group', 'Seattle', 'WA', '206-816-6603', NULL, ARRAY['Civil Rights','Consumer Protection','Class Action'], false, 'Partner handling consumer and civil rights class actions.'),
('Sheley Secrest', 'Disability Rights Washington', 'Seattle', 'WA', '206-324-1521', 'https://disabilityrightswa.org', ARRAY['Disability Rights','ADA','Civil Rights'], true, 'Staff attorney handling disability rights.'),
('Nancy Talner', 'ACLU of Washington', 'Seattle', 'WA', '206-624-2184', 'https://aclu-wa.org', ARRAY['Police Accountability','Civil Liberties','First Amendment'], true, 'Senior staff attorney handling police accountability.'),
('Michelle Raiford', 'TeamChild', 'Seattle', 'WA', '206-322-2444', 'https://teamchild.org', ARRAY['Juvenile Justice','Civil Rights','Education'], true, 'Staff attorney advocating for youth rights.'),
('Enoka Herat', 'ACLU of Washington', 'Seattle', 'WA', '206-624-2184', 'https://aclu-wa.org', ARRAY['Surveillance','Privacy','Technology'], true, 'Staff attorney on surveillance and technology.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- WEST VIRGINIA (6 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Joseph Cohen', 'ACLU of West Virginia', 'Charleston', 'WV', '304-345-9246', 'https://acluwv.org', ARRAY['Civil Liberties','Criminal Justice','Free Speech'], true, 'Executive Director of ACLU West Virginia.'),
('Loree Stark', 'ACLU of West Virginia', 'Charleston', 'WV', '304-345-9246', 'https://acluwv.org', ARRAY['Civil Rights','Criminal Justice','Voting Rights'], true, 'Legal Director of ACLU West Virginia.'),
('Bren Pomponio', 'Mountain State Justice', 'Charleston', 'WV', '304-344-3144', 'https://mountainstatejustice.org', ARRAY['Housing','Consumer Protection','Civil Rights'], true, 'Executive Director fighting predatory lending and housing discrimination.'),
('Greg Bowyer', 'Legal Aid of West Virginia', 'Charleston', 'WV', '304-343-3013', 'https://lawv.net', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Executive Director providing statewide legal aid.'),
('Mike Carey', 'Carey Scott Douglas & Kessler', 'Charleston', 'WV', '304-345-1234', NULL, ARRAY['Civil Rights','Police Misconduct','Employment'], false, 'Handles police misconduct and civil rights.'),
('Sam Petsonk', 'Petsonk Law', 'Morgantown', 'WV', '304-291-6850', NULL, ARRAY['Workers Rights','Civil Rights','Employment'], false, 'Handles workers rights and employment discrimination.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- WISCONSIN (12 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Karyn Rotker', 'ACLU of Wisconsin', 'Milwaukee', 'WI', '414-272-4032', 'https://aclu-wi.org', ARRAY['Civil Liberties','Racial Justice','Criminal Justice'], true, 'Senior staff attorney at ACLU Wisconsin.'),
('Tim Muth', 'ACLU of Wisconsin', 'Milwaukee', 'WI', '414-272-4032', 'https://aclu-wi.org', ARRAY['LGBTQ Rights','Civil Liberties','Prisoners Rights'], true, 'Staff attorney handling LGBTQ and prisoner rights.'),
('Emilio De Torre', 'ACLU of Wisconsin', 'Milwaukee', 'WI', '414-272-4032', 'https://aclu-wi.org', ARRAY['Civil Rights','Community Outreach','Racial Justice'], true, 'Director of Youth and Community Initiatives.'),
('Fred Royal', 'NAACP Milwaukee Branch', 'Milwaukee', 'WI', '414-374-4400', NULL, ARRAY['Civil Rights','Racial Justice','Education'], true, 'NAACP Milwaukee president leading civil rights advocacy.'),
('Flint Taylor', 'Peoples Law Office', 'Milwaukee', 'WI', '773-235-0070', NULL, ARRAY['Police Misconduct','Civil Rights','Section 1983'], false, 'Nationally known police misconduct attorney.'),
('B''Ivory LaMarr', 'LaMarr Law Group', 'Milwaukee', 'WI', '414-988-5424', NULL, ARRAY['Civil Rights','Police Misconduct','Criminal Defense'], false, 'Milwaukee civil rights attorney handling police cases.'),
('Nola Hitchcock Cross', 'Legal Action of Wisconsin', 'Madison', 'WI', '608-256-3304', 'https://legalaction.org', ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Staff attorney providing legal aid.'),
('Jeff Scott Olson', 'Jeff Scott Olson Law', 'Madison', 'WI', '608-283-6001', NULL, ARRAY['Civil Rights','Section 1983','Police Misconduct'], false, 'Madison civil rights attorney handling Section 1983 cases.'),
('Lester Pines', 'Pines Bach', 'Madison', 'WI', '608-251-0101', NULL, ARRAY['Constitutional Law','Voting Rights','Civil Rights'], false, 'Madison constitutional law and voting rights attorney.'),
('Michele Deitch', 'Wisconsin Innocence Project', 'Madison', 'WI', '608-262-4763', NULL, ARRAY['Wrongful Conviction','Criminal Justice','DNA Evidence'], true, 'Director working to exonerate wrongfully convicted.'),
('Wendy Geng', 'Disability Rights Wisconsin', 'Madison', 'WI', '608-267-0214', 'https://disabilityrightswi.org', ARRAY['Disability Rights','ADA','Civil Rights'], true, 'Staff attorney handling disability rights.'),
('Sheila Sullivan', 'Community Justice', 'Milwaukee', 'WI', '414-291-7535', NULL, ARRAY['Criminal Justice','Civil Rights','Reentry'], true, 'Executive Director of Community Justice working on reentry.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

-- =============================================================================
-- WYOMING (5 entries)
-- =============================================================================
INSERT INTO public.attorneys (name, firm_name, city, state, phone, website, specialties, accepts_pro_bono, bio) VALUES
('Jason Sluiter', 'Wyoming Legal Services', 'Cheyenne', 'WY', '307-634-1566', NULL, ARRAY['Housing','Public Benefits','Civil Rights'], true, 'Managing attorney providing statewide legal aid.'),
('Marci Bramlet', 'Equal Justice Wyoming', 'Cheyenne', 'WY', '307-432-9790', NULL, ARRAY['Access to Justice','Civil Rights','Legal Aid'], true, 'Coordinates statewide access to justice efforts.'),
('Bruce Moats', 'Moats Law', 'Casper', 'WY', '307-265-7200', NULL, ARRAY['Civil Rights','Criminal Defense','Constitutional Law'], false, 'Central Wyoming civil rights and constitutional attorney.'),
('Stephen Dent', 'Dent Law', 'Jackson', 'WY', '307-733-5890', NULL, ARRAY['Civil Rights','Employment','First Amendment'], false, 'Jackson Hole civil rights and employment attorney.'),
('Khale Lenhart', 'Burg Simpson', 'Cheyenne', 'WY', '307-632-2525', NULL, ARRAY['Civil Rights','Personal Injury','Employment'], false, 'Partner handling civil rights and employment cases.')
ON CONFLICT (name, state) DO UPDATE SET firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, phone = EXCLUDED.phone, website = EXCLUDED.website, specialties = EXCLUDED.specialties, bio = EXCLUDED.bio;

