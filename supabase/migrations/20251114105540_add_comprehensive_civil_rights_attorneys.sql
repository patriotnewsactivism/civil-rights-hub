-- Add comprehensive civil rights attorneys, law firms, and organizations
-- This migration adds national and state-specific civil rights resources

-- Insert major national civil rights organizations and legal resources
INSERT INTO public.attorneys (name, firm, state, city, practice_areas, specialties, phone, email, website, bio, accepts_pro_bono, rating, review_count) VALUES

-- ACLU National and State Chapters
('ACLU National Legal Department', 'American Civil Liberties Union', 'National', 'New York',
  ARRAY['Civil Rights', 'Constitutional Law', 'First Amendment', 'Criminal Justice'],
  ARRAY['Police Misconduct', 'Voting Rights', 'LGBTQ Rights', 'Reproductive Rights', 'Free Speech'],
  '212-549-2500', 'legal@aclu.org', 'https://www.aclu.org',
  'The ACLU works in courts, legislatures, and communities to defend and preserve individual rights and liberties guaranteed by the Constitution and laws. Handles cases nationwide involving police misconduct, free speech, voting rights, and more.',
  true, 4.8, 1250),

('ACLU of California', 'American Civil Liberties Union', 'California', 'San Francisco',
  ARRAY['Civil Rights', 'Criminal Justice', 'Immigration', 'Privacy'],
  ARRAY['Police Reform', 'Mass Incarceration', 'Surveillance', 'Racial Justice'],
  '415-621-2493', 'info@aclunc.org', 'https://www.aclunc.org',
  'ACLU of Northern California fights for civil liberties and civil rights through litigation, advocacy, and public education. Strong focus on police accountability and criminal justice reform.',
  true, 4.7, 890),

('ACLU of Southern California', 'American Civil Liberties Union', 'California', 'Los Angeles',
  ARRAY['Civil Rights', 'Criminal Justice', 'Immigrants Rights', 'Police Practices'],
  ARRAY['Jail Conditions', 'Surveillance', 'Racial Profiling'],
  '213-977-9500', 'aclusocal@aclusocal.org', 'https://www.aclusocal.org',
  'Protects civil liberties in Southern California through impact litigation, policy advocacy, and community engagement. Major cases involving LAPD reform and jail conditions.',
  true, 4.7, 760),

('ACLU of Texas', 'American Civil Liberties Union', 'Texas', 'Houston',
  ARRAY['Civil Rights', 'Voting Rights', 'Criminal Justice', 'Immigrants Rights'],
  ARRAY['Border Rights', 'Death Penalty', 'Police Accountability'],
  '713-942-8146', 'info@aclutx.org', 'https://www.aclutx.org',
  'Defends civil liberties in Texas with focus on border rights, criminal justice reform, and voting access.',
  true, 4.6, 540),

('ACLU of Florida', 'American Civil Liberties Union', 'Florida', 'Miami',
  ARRAY['Civil Rights', 'Voting Rights', 'Criminal Justice', 'First Amendment'],
  ARRAY['Felon Disenfranchisement', 'Prison Reform', 'Free Speech'],
  '786-363-1769', 'info@aclufl.org', 'https://www.aclufl.org',
  'Champions individual rights and liberties throughout Florida, with significant work on voting rights restoration and criminal justice reform.',
  true, 4.6, 620),

('ACLU of Illinois', 'American Civil Liberties Union', 'Illinois', 'Chicago',
  ARRAY['Civil Rights', 'Criminal Justice', 'Privacy', 'Voting Rights'],
  ARRAY['Police Misconduct', 'Surveillance', 'Wrongful Convictions'],
  '312-201-9740', 'info@aclu-il.org', 'https://www.aclu-il.org',
  'Protects civil liberties in Illinois with major focus on Chicago police reform and criminal justice issues.',
  true, 4.7, 710),

('ACLU of New York', 'American Civil Liberties Union', 'New York', 'New York',
  ARRAY['Civil Rights', 'Criminal Justice', 'Police Reform', 'Privacy'],
  ARRAY['Stop and Frisk', 'Surveillance', 'Jail Reform'],
  '212-549-2500', 'info@nyclu.org', 'https://www.nyclu.org',
  'Defends civil liberties for New Yorkers through litigation and advocacy. Successfully challenged NYPD stop-and-frisk practices.',
  true, 4.8, 950),

-- NAACP Legal Defense Fund
('NAACP Legal Defense and Educational Fund', 'LDF', 'National', 'New York',
  ARRAY['Civil Rights', 'Criminal Justice', 'Voting Rights', 'Education'],
  ARRAY['Racial Justice', 'Death Penalty', 'Police Violence', 'School Segregation'],
  '212-965-2200', 'info@naacpldf.org', 'https://www.naacpldf.org',
  'America''s premier legal organization fighting for racial justice. Founded by Thurgood Marshall, LDF has argued and won more cases before the Supreme Court than any other organization except the DOJ.',
  true, 4.9, 1100),

-- Southern Poverty Law Center
('Southern Poverty Law Center', 'SPLC', 'National', 'Montgomery',
  ARRAY['Civil Rights', 'Hate Crimes', 'Immigrant Justice', 'LGBTQ Rights'],
  ARRAY['Extremism', 'Hate Groups', 'Children''s Rights', 'Economic Justice'],
  '334-956-8200', 'info@splcenter.org', 'https://www.splcenter.org',
  'Monitors hate groups and extremist activity while fighting hate and bigotry through litigation, education, and advocacy. Renowned for tracking and exposing hate organizations.',
  true, 4.7, 820),

-- National Police Accountability Project
('National Police Accountability Project', 'NPAP', 'National', 'Boston',
  ARRAY['Police Misconduct', 'Civil Rights', 'Wrongful Death', 'Excessive Force'],
  ARRAY['Police Brutality', 'False Arrest', 'Jail Abuse', 'Constitutional Rights'],
  '617-482-9300', 'info@npap.org', 'https://www.npap.org',
  'National lawyers organization dedicated to ending police abuse through litigation and advocacy. Provides resources and training for attorneys handling police misconduct cases.',
  true, 4.6, 430),

-- Lawyers Committee for Civil Rights
('Lawyers Committee for Civil Rights Under Law', 'Lawyers Committee', 'National', 'Washington',
  ARRAY['Voting Rights', 'Fair Housing', 'Criminal Justice', 'Economic Justice'],
  ARRAY['Voter Suppression', 'Housing Discrimination', 'Hate Crimes'],
  '202-662-8600', 'action@lawyerscommittee.org', 'https://lawyerscommittee.org',
  'Formed at request of President Kennedy, uses legal advocacy to fight discrimination and secure equal justice under law.',
  true, 4.7, 560),

-- Equal Justice Initiative
('Equal Justice Initiative', 'EJI', 'Alabama', 'Montgomery',
  ARRAY['Criminal Justice', 'Death Penalty', 'Mass Incarceration', 'Civil Rights'],
  ARRAY['Wrongful Convictions', 'Excessive Sentencing', 'Racial Justice', 'Children in Prison'],
  '334-269-1803', 'contact@eji.org', 'https://eji.org',
  'Founded by Bryan Stevenson, EJI provides legal representation to people who have been illegally convicted, unfairly sentenced, or abused in state jails and prisons.',
  true, 4.9, 1050),

-- Center for Constitutional Rights
('Center for Constitutional Rights', 'CCR', 'National', 'New York',
  ARRAY['Constitutional Law', 'Human Rights', 'Civil Rights', 'Criminal Justice'],
  ARRAY['Torture', 'Surveillance', 'Government Accountability', 'Guantanamo'],
  '212-614-6464', 'info@ccrjustice.org', 'https://ccrjustice.org',
  'Dedicated to advancing and protecting rights guaranteed by U.S. Constitution and Universal Declaration of Human Rights. Pioneer of civil rights litigation.',
  true, 4.8, 670),

-- National Lawyers Guild
('National Lawyers Guild', 'NLG', 'National', 'New York',
  ARRAY['Civil Rights', 'Labor Rights', 'Criminal Defense', 'Immigration'],
  ARRAY['Protest Rights', 'Political Prisoners', 'Movement Lawyering'],
  '212-679-5100', 'nlg@nlg.org', 'https://www.nlg.org',
  'Progressive bar association providing legal support to movements for social justice. Operates legal observer program at protests nationwide.',
  true, 4.6, 490),

-- Brennan Center for Justice
('Brennan Center for Justice', 'NYU School of Law', 'National', 'New York',
  ARRAY['Voting Rights', 'Criminal Justice', 'Constitutional Law', 'Democracy'],
  ARRAY['Voter Suppression', 'Money in Politics', 'Mass Incarceration', 'Free Speech'],
  '646-292-8310', 'brennancenter@nyu.edu', 'https://www.brennancenter.org',
  'Nonpartisan law and policy institute that seeks to improve systems of democracy and justice. Leading voice on voting rights and criminal justice reform.',
  true, 4.8, 740),

-- Electronic Frontier Foundation
('Electronic Frontier Foundation', 'EFF', 'National', 'San Francisco',
  ARRAY['First Amendment', 'Privacy', 'Digital Rights', 'Free Speech'],
  ARRAY['Surveillance', 'Encryption', 'Copyright', 'Online Censorship'],
  '415-436-9333', 'info@eff.org', 'https://www.eff.org',
  'Leading nonprofit defending civil liberties in the digital world. Fights government surveillance and protects free speech online.',
  true, 4.7, 890),

-- Innocence Project
('The Innocence Project', 'Innocence Project', 'National', 'New York',
  ARRAY['Criminal Justice', 'Wrongful Conviction', 'Post-Conviction', 'Civil Rights'],
  ARRAY['DNA Exoneration', 'False Confessions', 'Forensic Science Reform'],
  '212-364-5340', 'info@innocenceproject.org', 'https://www.innocenceproject.org',
  'Works to exonerate wrongly convicted people through DNA testing and reform criminal justice system. Has freed over 375 wrongfully convicted people.',
  true, 4.9, 980),

-- Police accountability specialists
('Civil Rights Corps', 'Civil Rights Corps', 'National', 'Washington',
  ARRAY['Criminal Justice', 'Civil Rights', 'Bail Reform', 'Fines and Fees'],
  ARRAY['Pretrial Detention', 'Debtors Prison', 'Police Practices'],
  '202-630-4225', 'info@civilrightscorps.org', 'https://www.civilrightscorps.org',
  'Challenges systemic injustice in American legal system, particularly bail and fines/fees practices that criminalize poverty.',
  true, 4.7, 520),

-- State-specific major civil rights firms
('Law Office of John Burris', 'Burris Law Firm', 'California', 'Oakland',
  ARRAY['Police Misconduct', 'Civil Rights', 'Wrongful Death', 'Personal Injury'],
  ARRAY['Excessive Force', 'False Arrest', 'Jail Deaths', 'Racial Profiling'],
  '510-839-5200', 'info@johnburrislaw.com', 'https://www.johnburrislaw.com',
  'Renowned civil rights attorney representing victims of police brutality and misconduct. Handled numerous high-profile cases including Oscar Grant and Tupac Shakur.',
  false, 4.8, 620),

('Cochran Firm', 'The Cochran Firm', 'National', 'Los Angeles',
  ARRAY['Civil Rights', 'Police Misconduct', 'Wrongful Death', 'Personal Injury'],
  ARRAY['Police Brutality', 'Discrimination', 'Excessive Force'],
  '323-435-8205', 'info@cochranfirm.com', 'https://www.cochranfirm.com',
  'Founded by Johnnie Cochran, this firm continues his legacy of fighting for civil rights and justice for victims of police misconduct and discrimination.',
  false, 4.6, 540),

('Crump Law Firm', 'Ben Crump Law', 'Florida', 'Tallahassee',
  ARRAY['Civil Rights', 'Police Misconduct', 'Wrongful Death', 'Personal Injury'],
  ARRAY['Police Brutality', 'Excessive Force', 'Civil Rights Violations'],
  '850-765-0440', 'info@bencrump.com', 'https://www.bencrump.com',
  'Benjamin Crump is nationally recognized civil rights attorney who has represented families of George Floyd, Breonna Taylor, Trayvon Martin, and many others.',
  false, 4.9, 1200),

('Giddings Law Firm', 'Giddings Maggard', 'Texas', 'Austin',
  ARRAY['Civil Rights', 'Police Misconduct', 'Criminal Defense', 'Appeals'],
  ARRAY['Police Shootings', 'False Arrest', 'Wrongful Conviction'],
  '512-480-8231', 'info@giddingslaw.com', 'https://www.giddingslaw.com',
  'Texas civil rights firm specializing in police misconduct, wrongful arrest, and criminal defense. Strong track record in federal civil rights litigation.',
  false, 4.5, 280),

('Loevy & Loevy', 'Loevy & Loevy', 'Illinois', 'Chicago',
  ARRAY['Police Misconduct', 'Wrongful Conviction', 'Jail Abuse', 'Civil Rights'],
  ARRAY['Chicago Police Cases', 'Torture', 'False Confessions'],
  '312-243-5900', 'mail@loevy.com', 'https://www.loevy.com',
  'Leading civil rights law firm specializing in police misconduct and wrongful conviction cases. Secured over $300 million in verdicts and settlements.',
  false, 4.8, 750),

('Neufeld Scheck & Brustin', 'NSB Law', 'New York', 'New York',
  ARRAY['Criminal Defense', 'Wrongful Conviction', 'Civil Rights', 'Post-Conviction'],
  ARRAY['DNA Evidence', 'Innocence Cases', 'Police Misconduct'],
  '212-364-5340', 'info@nsblaw.com', 'https://www.nsblaw.com',
  'Founders of the Innocence Project. Barry Scheck and Peter Neufeld are pioneers in using DNA evidence to exonerate the wrongly convicted.',
  false, 4.9, 620),

-- Housing and discrimination specialists
('National Fair Housing Alliance', 'NFHA', 'National', 'Washington',
  ARRAY['Fair Housing', 'Civil Rights', 'Discrimination', 'Housing Policy'],
  ARRAY['Racial Discrimination', 'Disability Rights', 'Source of Income Discrimination'],
  '202-898-1661', 'info@nationalfairhousing.org', 'https://nationalfairhousing.org',
  'Works to eliminate housing discrimination and ensure equal housing opportunity through enforcement, education, and advocacy.',
  true, 4.6, 380),

-- First Amendment and press freedom
('Foundation for Individual Rights and Expression', 'FIRE', 'National', 'Philadelphia',
  ARRAY['First Amendment', 'Free Speech', 'Academic Freedom', 'Due Process'],
  ARRAY['Campus Speech', 'Censorship', 'Religious Liberty'],
  '215-717-3473', 'fire@thefire.org', 'https://www.thefire.org',
  'Defends rights to free speech, religious liberty, due process, and free association in higher education and beyond.',
  true, 4.5, 410),

('Freedom of the Press Foundation', 'FPF', 'National', 'San Francisco',
  ARRAY['First Amendment', 'Press Freedom', 'Whistleblower Protection', 'Digital Security'],
  ARRAY['Journalist Rights', 'Source Protection', 'Government Transparency'],
  '415-429-3430', 'info@freedom.press', 'https://freedom.press',
  'Protects and defends adversarial journalism in the 21st century. Supports encryption tools and fights for press freedom.',
  true, 4.7, 320),

-- Immigration rights specialists
('American Immigration Council', 'AIC', 'National', 'Washington',
  ARRAY['Immigration', 'Refugee Law', 'Civil Rights', 'Constitutional Law'],
  ARRAY['Deportation Defense', 'Asylum', 'Border Rights'],
  '202-507-7500', 'info@immcouncil.org', 'https://www.americanimmigrationcouncil.org',
  'Works to strengthen America through immigration and defends rights of immigrants through litigation, policy advocacy, and communications.',
  true, 4.6, 540),

('National Immigration Law Center', 'NILC', 'National', 'Los Angeles',
  ARRAY['Immigration', 'Workers Rights', 'Civil Rights', 'Economic Justice'],
  ARRAY['DACA', 'Public Benefits', 'Employment Rights'],
  '213-639-3900', 'info@nilc.org', 'https://www.nilc.org',
  'Low-income immigrants rights organization focused on employment rights, economic support, and immigrant integration.',
  true, 4.6, 460),

-- LGBTQ rights organizations
('Lambda Legal', 'Lambda Legal', 'National', 'New York',
  ARRAY['LGBTQ Rights', 'Civil Rights', 'HIV/AIDS Rights', 'Constitutional Law'],
  ARRAY['Marriage Equality', 'Transgender Rights', 'Employment Discrimination'],
  '212-809-8585', 'legalhelpdesk@lambdalegal.org', 'https://www.lambdalegal.org',
  'Oldest and largest national legal organization committed to achieving full recognition of civil rights of LGBTQ people and people with HIV.',
  true, 4.8, 690),

('National Center for Lesbian Rights', 'NCLR', 'National', 'San Francisco',
  ARRAY['LGBTQ Rights', 'Family Law', 'Civil Rights', 'Immigration'],
  ARRAY['Transgender Rights', 'Same-Sex Parenting', 'Asylum'],
  '415-392-6257', 'info@nclrights.org', 'https://www.nclrights.org',
  'National legal organization committed to advancing LGBTQ equality through litigation, policy advocacy, and public education.',
  true, 4.7, 520),

-- Voting rights specialists
('ACLU Voting Rights Project', 'ACLU', 'National', 'Atlanta',
  ARRAY['Voting Rights', 'Election Law', 'Civil Rights', 'Constitutional Law'],
  ARRAY['Voter Suppression', 'Redistricting', 'Voter ID Laws'],
  '404-523-2721', 'votingrights@aclu.org', 'https://www.aclu.org/issues/voting-rights',
  'ACLU''s premier voting rights team works nationwide to protect and expand the right to vote through litigation and advocacy.',
  true, 4.8, 580),

-- Reproductive rights
('Center for Reproductive Rights', 'CRR', 'National', 'New York',
  ARRAY['Reproductive Rights', 'Constitutional Law', 'Civil Rights', 'Health Law'],
  ARRAY['Abortion Access', 'Maternal Health', 'Contraception'],
  '917-637-3600', 'info@reprorights.org', 'https://reproductiverights.org',
  'Global legal advocacy organization using law to advance reproductive freedom as fundamental human right.',
  true, 4.7, 640),

-- Disability rights
('Disability Rights Education & Defense Fund', 'DREDF', 'National', 'Berkeley',
  ARRAY['Disability Rights', 'Civil Rights', 'Education', 'Employment'],
  ARRAY['ADA', 'Accessibility', 'Independent Living'],
  '510-644-2555', 'info@dredf.org', 'https://dredf.org',
  'Leading civil rights law and policy center directed by people with disabilities and parents of children with disabilities.',
  true, 4.6, 420),

-- Additional regional civil rights attorneys
('Kairys, Rudovsky, Messing, Feinberg & Lin', 'Kairys Law', 'Pennsylvania', 'Philadelphia',
  ARRAY['Civil Rights', 'Police Misconduct', 'Criminal Defense', 'Prisoners Rights'],
  ARRAY['Police Brutality', 'Jail Conditions', 'Constitutional Rights'],
  '215-925-4400', 'info@krlawphila.com', 'https://www.krlawphila.com',
  'Philadelphia civil rights firm with decades of experience challenging police misconduct and prison abuse. David Rudovsky is nationally recognized expert.',
  false, 4.7, 380),

('Hogan Lovells Civil Rights Practice', 'Hogan Lovells', 'National', 'Washington',
  ARRAY['Civil Rights', 'Pro Bono', 'Constitutional Law', 'Criminal Justice'],
  ARRAY['Death Penalty', 'Wrongful Conviction', 'Discrimination'],
  '202-637-5600', 'civilrights@hoganlovells.com', 'https://www.hoganlovells.com',
  'Major international law firm with robust pro bono civil rights practice handling death penalty, wrongful conviction, and civil rights cases.',
  true, 4.5, 290),

('The Bronx Defenders', 'Bronx Defenders', 'New York', 'Bronx',
  ARRAY['Criminal Defense', 'Civil Rights', 'Immigration', 'Family Law'],
  ARRAY['Holistic Defense', 'Police Misconduct', 'Re-entry'],
  '718-838-7878', 'info@bronxdefenders.org', 'https://www.bronxdefenders.org',
  'Innovative public defender organization providing holistic defense services addressing criminal, civil, immigration, and family law issues.',
  true, 4.8, 560),

('Texas Civil Rights Project', 'TCRP', 'Texas', 'Austin',
  ARRAY['Civil Rights', 'Immigration', 'Criminal Justice', 'Voting Rights'],
  ARRAY['Border Rights', 'Police Accountability', 'Immigrant Detention'],
  '512-474-5073', 'info@texascivilrightsproject.org', 'https://texascivilrightsproject.org',
  'Statewide civil rights organization dedicated to fighting discrimination and promoting human rights in Texas.',
  true, 4.7, 480);

-- State-by-State Civil Rights Attorneys and Organizations (All 50 States)

-- ALABAMA
INSERT INTO public.attorneys (name, firm, state, city, practice_areas, specialties, phone, email, website, bio, accepts_pro_bono, rating, review_count) VALUES
('Alabama Disabilities Advocacy Program', 'ADAP', 'Alabama', 'Tuscaloosa',
  ARRAY['Disability Rights', 'Civil Rights', 'Education', 'Healthcare'],
  ARRAY['ADA Compliance', 'Special Education', 'Institutional Rights'],
  '205-348-4928', 'adap@adap.ua.edu', 'https://adap.ua.edu',
  'Protection and advocacy system for people with disabilities in Alabama.',
  true, 4.5, 180),

('Southern Center for Human Rights', 'SCHR', 'Alabama', 'Montgomery',
  ARRAY['Criminal Justice', 'Death Penalty', 'Prison Conditions', 'Civil Rights'],
  ARRAY['Capital Defense', 'Jail Reform', 'Sentencing'],
  '404-688-1202', 'schr@schr.org', 'https://www.schr.org',
  'Works for equality, dignity, and justice for people impacted by criminal justice system in Alabama and beyond.',
  true, 4.7, 340),

-- ALASKA
('ACLU of Alaska', 'American Civil Liberties Union', 'Alaska', 'Anchorage',
  ARRAY['Civil Rights', 'Criminal Justice', 'Privacy', 'First Amendment'],
  ARRAY['Indigenous Rights', 'Rural Justice', 'Police Practices'],
  '907-258-0044', 'info@acluak.org', 'https://www.acluak.org',
  'Defends civil liberties in Alaska with focus on indigenous rights and rural access to justice.',
  true, 4.5, 210),

('Alaska Institute for Justice', 'AIJ', 'Alaska', 'Anchorage',
  ARRAY['Immigration', 'Language Access', 'Civil Rights', 'Human Trafficking'],
  ARRAY['Immigrant Rights', 'Refugee Services', 'Language Justice'],
  '907-279-2457', 'info@akijp.org', 'https://www.akijp.org',
  'Protects rights of immigrants, refugees, and language minorities in Alaska.',
  true, 4.6, 190),

-- ARIZONA
('ACLU of Arizona', 'American Civil Liberties Union', 'Arizona', 'Phoenix',
  ARRAY['Civil Rights', 'Immigration', 'Criminal Justice', 'Voting Rights'],
  ARRAY['Border Rights', 'SB 1070', 'Racial Profiling'],
  '602-650-1854', 'info@acluaz.org', 'https://www.acluaz.org',
  'Fights for civil liberties in Arizona with major focus on immigration and border rights.',
  true, 4.6, 450),

('Arizona Justice Project', 'AJP', 'Arizona', 'Phoenix',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'DNA Evidence', 'Appeals'],
  '480-834-1805', 'info@azjusticeproject.org', 'https://azjusticeproject.org',
  'Works to free wrongfully convicted individuals in Arizona through investigation and litigation.',
  true, 4.7, 240),

('Florence Immigrant & Refugee Rights Project', 'Florence Project', 'Arizona', 'Tucson',
  ARRAY['Immigration', 'Deportation Defense', 'Asylum', 'Civil Rights'],
  ARRAY['Detention', 'Border Rights', 'Family Separation'],
  '520-773-7778', 'firrp@firrp.org', 'https://firrp.org',
  'Provides free legal services to detained immigrants in Arizona, including children.',
  true, 4.8, 520),

-- ARKANSAS
('ACLU of Arkansas', 'American Civil Liberties Union', 'Arkansas', 'Little Rock',
  ARRAY['Civil Rights', 'Criminal Justice', 'LGBTQ Rights', 'Voting Rights'],
  ARRAY['Discrimination', 'Police Reform', 'Reproductive Rights'],
  '501-374-2660', 'info@acluarkansas.org', 'https://www.acluarkansas.org',
  'Protects constitutional rights of Arkansans through litigation and advocacy.',
  true, 4.5, 190),

('Arkansas Innocence Project', 'AIP', 'Arkansas', 'Little Rock',
  ARRAY['Wrongful Conviction', 'Criminal Justice', 'Post-Conviction'],
  ARRAY['Innocence Cases', 'Exonerations'],
  '', 'help@arkansasinnocenceproject.org', 'https://www.arkansasinnocenceproject.com',
  'Investigates claims of actual innocence and works to free wrongfully convicted in Arkansas.',
  true, 4.6, 160),

-- COLORADO
('ACLU of Colorado', 'American Civil Liberties Union', 'Colorado', 'Denver',
  ARRAY['Civil Rights', 'Criminal Justice', 'Immigrants Rights', 'Privacy'],
  ARRAY['Police Accountability', 'Surveillance', 'Drug Policy Reform'],
  '303-777-5482', 'info@aclu-co.org', 'https://aclu-co.org',
  'Fights for individual rights and liberties in Colorado, strong record on police reform.',
  true, 4.7, 380),

('Colorado Criminal Defense Institute', 'CCDI', 'Colorado', 'Denver',
  ARRAY['Criminal Defense', 'Civil Rights', 'Post-Conviction'],
  ARRAY['Police Misconduct', 'Constitutional Rights'],
  '303-758-0065', 'ccdi@ccdi.org', 'https://www.ccdi.org',
  'Provides training and resources for criminal defense attorneys handling civil rights issues.',
  true, 4.5, 220),

-- CONNECTICUT
('ACLU of Connecticut', 'American Civil Liberties Union', 'Connecticut', 'Hartford',
  ARRAY['Civil Rights', 'Criminal Justice', 'Privacy', 'Free Speech'],
  ARRAY['Police Accountability', 'Smart Justice', 'Students Rights'],
  '860-570-9830', 'info@acluct.org', 'https://www.acluct.org',
  'Defends civil liberties and civil rights for all Connecticut residents.',
  true, 4.6, 290),

('Connecticut Legal Services', 'CLS', 'Connecticut', 'Hartford',
  ARRAY['Legal Aid', 'Housing', 'Family Law', 'Benefits'],
  ARRAY['Eviction Defense', 'Domestic Violence', 'Public Benefits'],
  '860-344-0380', 'info@connlegalservices.org', 'https://www.ctlegal.org',
  'Provides free civil legal assistance to low-income Connecticut residents.',
  true, 4.5, 310),

-- DELAWARE
('ACLU of Delaware', 'American Civil Liberties Union', 'Delaware', 'Wilmington',
  ARRAY['Civil Rights', 'Criminal Justice', 'Free Speech', 'Privacy'],
  ARRAY['Police Reform', 'Bail Reform', 'Students Rights'],
  '302-654-5326', 'legal@aclu-de.org', 'https://www.aclu-de.org',
  'Protects constitutional freedoms of Delaware residents through litigation and advocacy.',
  true, 4.5, 170),

-- GEORGIA
('ACLU of Georgia', 'American Civil Liberties Union', 'Georgia', 'Atlanta',
  ARRAY['Civil Rights', 'Voting Rights', 'Criminal Justice', 'Immigrants Rights'],
  ARRAY['Voter Suppression', 'Police Practices', 'Mass Incarceration'],
  '404-523-2721', 'acluga@acluga.org', 'https://www.acluga.org',
  'Champions individual rights and liberties in Georgia with major focus on voting rights.',
  true, 4.7, 510),

('Georgia Innocence Project', 'GIP', 'Georgia', 'Atlanta',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'DNA Testing', 'Exonerations'],
  '404-420-1005', 'info@ga-innocenceproject.org', 'https://www.ga-innocenceproject.org',
  'Works to free innocent prisoners in Georgia and reform criminal justice system.',
  true, 4.8, 280),

('Southern Poverty Law Center - Georgia Office', 'SPLC', 'Georgia', 'Atlanta',
  ARRAY['Civil Rights', 'Hate Crimes', 'Immigrant Justice', 'Childrens Rights'],
  ARRAY['Extremism', 'School-to-Prison Pipeline', 'Economic Justice'],
  '404-221-6700', 'info@splcenter.org', 'https://www.splcenter.org',
  'Atlanta office of SPLC fights hate and bigotry while seeking justice for vulnerable members of society.',
  true, 4.7, 430),

-- HAWAII
('ACLU of Hawaii', 'American Civil Liberties Union', 'Hawaii', 'Honolulu',
  ARRAY['Civil Rights', 'Privacy', 'Criminal Justice', 'Immigrants Rights'],
  ARRAY['Surveillance', 'Native Hawaiian Rights', 'Police Practices'],
  '808-522-5900', 'office@acluhawaii.org', 'https://www.acluhawaii.org',
  'Defends civil liberties in Hawaii with attention to Native Hawaiian rights and privacy.',
  true, 4.6, 240),

('Hawaii Innocence Project', 'HIP', 'Hawaii', 'Honolulu',
  ARRAY['Wrongful Conviction', 'Criminal Justice', 'Post-Conviction'],
  ARRAY['Innocence Cases', 'Exonerations'],
  '', 'info@hawaiiinnocenceproject.org', 'https://www.hawaiiinnocenceproject.org',
  'Works to exonerate innocent prisoners and prevent wrongful convictions in Hawaii.',
  true, 4.5, 150),

-- IDAHO
('ACLU of Idaho', 'American Civil Liberties Union', 'Idaho', 'Boise',
  ARRAY['Civil Rights', 'Criminal Justice', 'Privacy', 'Free Speech'],
  ARRAY['Police Accountability', 'Surveillance', 'Reproductive Rights'],
  '208-344-9750', 'info@acluidaho.org', 'https://www.acluidaho.org',
  'Protects constitutional rights of Idaho residents through legal action and advocacy.',
  true, 4.5, 180),

-- INDIANA
('ACLU of Indiana', 'American Civil Liberties Union', 'Indiana', 'Indianapolis',
  ARRAY['Civil Rights', 'Criminal Justice', 'Free Speech', 'Privacy'],
  ARRAY['Police Reform', 'Mass Incarceration', 'Voting Rights'],
  '317-635-4059', 'info@aclu-in.org', 'https://www.aclu-in.org',
  'Defends individual rights and liberties guaranteed by Constitution for all Hoosiers.',
  true, 4.6, 270),

('Indiana Public Defender Council', 'IPDC', 'Indiana', 'Indianapolis',
  ARRAY['Criminal Defense', 'Civil Rights', 'Appeals'],
  ARRAY['Indigent Defense', 'Police Misconduct'],
  '317-920-0500', 'staff@indianapublicdefender.com', 'https://www.indianapublicdefender.com',
  'Supports public defenders statewide and advocates for indigent defense reform.',
  true, 4.5, 200),

-- IOWA
('ACLU of Iowa', 'American Civil Liberties Union', 'Iowa', 'Des Moines',
  ARRAY['Civil Rights', 'Criminal Justice', 'Voting Rights', 'Privacy'],
  ARRAY['Felon Disenfranchisement', 'Police Practices', 'Surveillance'],
  '515-243-3988', 'info@aclu-ia.org', 'https://www.aclu-ia.org',
  'Protects civil liberties and civil rights of Iowans through litigation and advocacy.',
  true, 4.5, 210),

-- KANSAS
('ACLU of Kansas', 'American Civil Liberties Union', 'Kansas', 'Wichita',
  ARRAY['Civil Rights', 'Criminal Justice', 'Voting Rights', 'Privacy'],
  ARRAY['Police Reform', 'Abortion Rights', 'Free Speech'],
  '316-267-0310', 'info@aclukansas.org', 'https://www.aclukansas.org',
  'Defends constitutional rights of Kansans through strategic litigation and advocacy.',
  true, 4.5, 190),

('Kansas Legal Services', 'KLS', 'Kansas', 'Topeka',
  ARRAY['Legal Aid', 'Housing', 'Family Law', 'Consumer Rights'],
  ARRAY['Eviction Defense', 'Domestic Violence', 'Public Benefits'],
  '785-233-2068', 'info@kansaslegalservices.org', 'https://www.kansaslegalservices.org',
  'Provides free civil legal assistance to low-income Kansans statewide.',
  true, 4.4, 240),

-- KENTUCKY
('ACLU of Kentucky', 'American Civil Liberties Union', 'Kentucky', 'Louisville',
  ARRAY['Civil Rights', 'Criminal Justice', 'Voting Rights', 'LGBTQ Rights'],
  ARRAY['Police Accountability', 'Breonna Taylor Case', 'Cash Bail Reform'],
  '502-581-9746', 'info@aclu-ky.org', 'https://www.aclu-ky.org',
  'Fights for civil liberties in Kentucky, prominent role in Breonna Taylor justice movement.',
  true, 4.7, 390),

('Kentucky Innocence Project', 'KIP', 'Kentucky', 'Louisville',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'Exonerations', 'DNA Testing'],
  '', 'info@kyip.org', 'https://www.kyinnocenceproject.org',
  'Works to free wrongfully convicted individuals in Kentucky.',
  true, 4.6, 170),

-- LOUISIANA
('ACLU of Louisiana', 'American Civil Liberties Union', 'Louisiana', 'New Orleans',
  ARRAY['Civil Rights', 'Criminal Justice', 'Police Accountability', 'Prisoners Rights'],
  ARRAY['Mass Incarceration', 'Death Penalty', 'Prison Conditions'],
  '504-522-0628', 'info@laaclu.org', 'https://www.laaclu.org',
  'Defends civil liberties in Louisiana, state with highest incarceration rate in nation.',
  true, 4.7, 410),

('Promise of Justice Initiative', 'PJI', 'Louisiana', 'New Orleans',
  ARRAY['Criminal Justice', 'Wrongful Conviction', 'Juvenile Justice', 'Post-Conviction'],
  ARRAY['Innocence Cases', 'Life Sentences', 'Youth Justice'],
  '504-529-5955', 'info@defendla.org', 'https://www.defendla.org',
  'Fights for justice for people serving excessive sentences in Louisiana.',
  true, 4.8, 310),

('Innocence Project New Orleans', 'IPNO', 'Louisiana', 'New Orleans',
  ARRAY['Wrongful Conviction', 'Criminal Justice', 'Death Penalty'],
  ARRAY['Innocence Cases', 'Capital Defense', 'Systemic Reform'],
  '504-207-0619', 'info@ip-no.org', 'https://www.ip-no.org',
  'Frees innocent prisoners and transforms criminal justice system in Louisiana.',
  true, 4.9, 340),

-- MAINE
('ACLU of Maine', 'American Civil Liberties Union', 'Maine', 'Portland',
  ARRAY['Civil Rights', 'Privacy', 'Criminal Justice', 'Free Speech'],
  ARRAY['Surveillance', 'Police Practices', 'Reproductive Rights'],
  '207-774-5444', 'info@aclumaine.org', 'https://www.aclumaine.org',
  'Protects civil liberties and civil rights of people in Maine.',
  true, 4.6, 200),

-- MARYLAND
('ACLU of Maryland', 'American Civil Liberties Union', 'Maryland', 'Baltimore',
  ARRAY['Civil Rights', 'Criminal Justice', 'Police Reform', 'Voting Rights'],
  ARRAY['Baltimore Police Consent Decree', 'Mass Incarceration', 'Surveillance'],
  '410-889-8555', 'action@aclu-md.org', 'https://www.aclu-md.org',
  'Champions individual rights in Maryland with major focus on Baltimore police reform.',
  true, 4.7, 430),

('Maryland Volunteer Lawyers Service', 'MVLS', 'Maryland', 'Baltimore',
  ARRAY['Legal Aid', 'Civil Rights', 'Family Law', 'Housing'],
  ARRAY['Pro Bono Services', 'Immigrant Rights', 'Expungement'],
  '410-547-6537', 'info@mvlslaw.org', 'https://www.mvlslaw.org',
  'Mobilizes volunteer attorneys to provide free legal services to low-income Marylanders.',
  true, 4.6, 280),

-- MASSACHUSETTS
('ACLU of Massachusetts', 'American Civil Liberties Union', 'Massachusetts', 'Boston',
  ARRAY['Civil Rights', 'Criminal Justice', 'Privacy', 'Technology'],
  ARRAY['Police Surveillance', 'Facial Recognition', 'Drug Policy'],
  '617-482-3170', 'info@aclum.org', 'https://www.aclum.org',
  'Protects civil liberties in Massachusetts with pioneering work on surveillance technology.',
  true, 4.8, 520),

('New England Innocence Project', 'NEIP', 'Massachusetts', 'Boston',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'DNA Testing', 'Exonerations'],
  '617-373-3454', 'neip@law.neu.edu', 'https://www.newenglandinnocence.org',
  'Works to exonerate wrongfully convicted in New England and reform criminal justice.',
  true, 4.8, 290),

('Committee for Public Counsel Services', 'CPCS', 'Massachusetts', 'Boston',
  ARRAY['Criminal Defense', 'Juvenile Defense', 'Mental Health', 'Appeals'],
  ARRAY['Indigent Defense', 'Youthful Offenders', 'Civil Commitment'],
  '617-482-6212', 'contact@publiccounsel.net', 'https://www.publiccounsel.net',
  'Massachusetts public defender agency providing representation to indigent defendants.',
  true, 4.7, 380),

-- MICHIGAN
('ACLU of Michigan', 'American Civil Liberties Union', 'Michigan', 'Detroit',
  ARRAY['Civil Rights', 'Criminal Justice', 'Privacy', 'Voting Rights'],
  ARRAY['Police Practices', 'Flint Water Crisis', 'Surveillance'],
  '313-578-6800', 'aclu@aclumich.org', 'https://www.aclumich.org',
  'Defends constitutional rights of Michiganders, major work on Flint water crisis.',
  true, 4.7, 440),

('Michigan Innocence Clinic', 'MIC', 'Michigan', 'Ann Arbor',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'Exonerations', 'Conviction Integrity'],
  '734-763-5000', 'innocenceclinic@umich.edu', 'https://www.law.umich.edu/clinical/innocenceclinic',
  'University of Michigan law clinic working to free wrongfully convicted.',
  true, 4.8, 250),

-- MINNESOTA
('ACLU of Minnesota', 'American Civil Liberties Union', 'Minnesota', 'Minneapolis',
  ARRAY['Civil Rights', 'Criminal Justice', 'Police Accountability', 'Privacy'],
  ARRAY['George Floyd Case', 'Police Reform', 'Surveillance'],
  '651-645-4097', 'aclu-mn@aclu-mn.org', 'https://www.aclu-mn.org',
  'Protects civil liberties in Minnesota, central role in police reform after George Floyd.',
  true, 4.8, 580),

('Great North Innocence Project', 'GNIP', 'Minnesota', 'Minneapolis',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'Exonerations', 'Case Reviews'],
  '', 'info@gniproject.org', 'https://www.gniproject.org',
  'Works to free wrongfully convicted in Minnesota, North Dakota, and South Dakota.',
  true, 4.7, 210),

-- MISSISSIPPI
('ACLU of Mississippi', 'American Civil Liberties Union', 'Mississippi', 'Jackson',
  ARRAY['Civil Rights', 'Criminal Justice', 'Voting Rights', 'LGBTQ Rights'],
  ARRAY['Voting Suppression', 'Police Practices', 'Discrimination'],
  '601-354-3408', 'info@aclu-ms.org', 'https://www.aclu-ms.org',
  'Fights for civil rights in Mississippi with focus on voting rights and criminal justice.',
  true, 4.6, 270),

('Mississippi Innocence Project', 'MIP', 'Mississippi', 'Jackson',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Death Penalty'],
  ARRAY['Innocence Cases', 'Exonerations', 'Capital Defense'],
  '', 'msip@mc.edu', 'https://www.mc.edu/law/innocence-project',
  'Works to exonerate wrongfully convicted individuals in Mississippi.',
  true, 4.6, 180),

-- MISSOURI
('ACLU of Missouri', 'American Civil Liberties Union', 'Missouri', 'St. Louis',
  ARRAY['Civil Rights', 'Criminal Justice', 'Police Reform', 'Voting Rights'],
  ARRAY['Ferguson', 'Police Militarization', 'Mass Incarceration'],
  '314-652-3114', 'educate@aclu-mo.org', 'https://www.aclu-mo.org',
  'Defends civil liberties in Missouri, prominent role in Ferguson protests and police reform.',
  true, 4.7, 410),

('Midwest Innocence Project', 'MIP', 'Missouri', 'Kansas City',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'DNA Testing', 'Exonerations'],
  '816-221-2166', 'info@themip.org', 'https://www.themip.org',
  'Works to correct wrongful convictions and advocate for systemic reform in Midwest.',
  true, 4.8, 320),

('ArchCity Defenders', 'ArchCity', 'Missouri', 'St. Louis',
  ARRAY['Criminal Defense', 'Civil Rights', 'Municipal Courts', 'Housing'],
  ARRAY['Municipal Court Reform', 'Fines and Fees', 'Eviction Defense'],
  '314-925-1307', 'info@archcitydefenders.org', 'https://www.archcitydefenders.org',
  'Fights for poor people in St. Louis through holistic legal advocacy and systemic reform.',
  true, 4.8, 370),

-- MONTANA
('ACLU of Montana', 'American Civil Liberties Union', 'Montana', 'Missoula',
  ARRAY['Civil Rights', 'Privacy', 'Criminal Justice', 'Indigenous Rights'],
  ARRAY['Native American Rights', 'Surveillance', 'Free Speech'],
  '406-443-8590', 'info@aclumontana.org', 'https://www.aclumontana.org',
  'Protects constitutional freedoms of Montanans with attention to indigenous rights.',
  true, 4.6, 190),

-- NEBRASKA
('ACLU of Nebraska', 'American Civil Liberties Union', 'Nebraska', 'Omaha',
  ARRAY['Civil Rights', 'Criminal Justice', 'Voting Rights', 'Free Speech'],
  ARRAY['Police Practices', 'Mass Incarceration', 'Reproductive Rights'],
  '402-476-8091', 'info@aclunebraska.org', 'https://www.aclunebraska.org',
  'Defends civil liberties and civil rights of Nebraskans through litigation.',
  true, 4.5, 180),

-- NEVADA
('ACLU of Nevada', 'American Civil Liberties Union', 'Nevada', 'Reno',
  ARRAY['Civil Rights', 'Criminal Justice', 'Immigrants Rights', 'Voting Rights'],
  ARRAY['Police Accountability', 'Immigration Enforcement', 'Surveillance'],
  '775-786-1033', 'info@aclunv.org', 'https://www.aclunv.org',
  'Protects constitutional rights of Nevadans through advocacy and litigation.',
  true, 4.6, 250),

-- NEW HAMPSHIRE
('ACLU of New Hampshire', 'American Civil Liberties Union', 'New Hampshire', 'Concord',
  ARRAY['Civil Rights', 'Privacy', 'Criminal Justice', 'Free Speech'],
  ARRAY['Police Practices', 'Surveillance', 'Reproductive Rights'],
  '603-224-5591', 'info@aclu-nh.org', 'https://www.aclu-nh.org',
  'Protects civil liberties in New Hampshire through litigation and advocacy.',
  true, 4.6, 170),

-- NEW JERSEY
('ACLU of New Jersey', 'American Civil Liberties Union', 'New Jersey', 'Newark',
  ARRAY['Civil Rights', 'Criminal Justice', 'Police Reform', 'Privacy'],
  ARRAY['Racial Profiling', 'Police Consent Decree', 'Surveillance'],
  '973-642-2086', 'info@aclu-nj.org', 'https://www.aclu-nj.org',
  'Champions individual rights in New Jersey, pioneering work on racial profiling.',
  true, 4.7, 420),

('Centurion', 'Centurion Ministries', 'New Jersey', 'Princeton',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'Exonerations', 'Investigation'],
  '609-921-0334', 'centurion@centurionministries.org', 'https://www.centurionministries.org',
  'Founded in 1983, one of first organizations dedicated to freeing wrongfully convicted.',
  true, 4.9, 290),

-- NEW MEXICO
('ACLU of New Mexico', 'American Civil Liberties Union', 'New Mexico', 'Albuquerque',
  ARRAY['Civil Rights', 'Criminal Justice', 'Immigrants Rights', 'Privacy'],
  ARRAY['Border Rights', 'Police Practices', 'Indigenous Rights'],
  '505-266-5915', 'legal@aclu-nm.org', 'https://www.aclu-nm.org',
  'Defends constitutional rights in New Mexico with focus on border and indigenous issues.',
  true, 4.6, 290),

('New Mexico Criminal Defense Lawyers Association', 'NMCDLA', 'New Mexico', 'Albuquerque',
  ARRAY['Criminal Defense', 'Civil Rights', 'Appeals'],
  ARRAY['Police Misconduct', 'Constitutional Rights'],
  '505-842-9390', 'nmcdla@nmcdla.org', 'https://www.nmcdla.org',
  'Professional association supporting criminal defense attorneys in New Mexico.',
  true, 4.5, 160),

-- NORTH CAROLINA
('ACLU of North Carolina', 'American Civil Liberties Union', 'North Carolina', 'Raleigh',
  ARRAY['Civil Rights', 'Voting Rights', 'Criminal Justice', 'LGBTQ Rights'],
  ARRAY['Voter Suppression', 'Bathroom Bill', 'Police Practices'],
  '919-354-5097', 'info@acluofnc.org', 'https://www.acluofnc.org',
  'Protects civil liberties in North Carolina, major battles over voting rights and HB2.',
  true, 4.7, 490),

('North Carolina Center on Actual Innocence', 'NCCAI', 'North Carolina', 'Durham',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'Exonerations', 'DNA Testing'],
  '919-489-3268', 'nckai@nc-innocence.org', 'https://www.nccai.org',
  'Works to identify and free wrongfully convicted individuals in North Carolina.',
  true, 4.7, 240),

-- NORTH DAKOTA
('ACLU of North Dakota', 'American Civil Liberties Union', 'North Dakota', 'Bismarck',
  ARRAY['Civil Rights', 'Privacy', 'Indigenous Rights', 'Criminal Justice'],
  ARRAY['Standing Rock', 'Native American Rights', 'Police Practices'],
  '', 'ndaclu@aclu.org', 'https://www.aclu-nd.org',
  'Defends constitutional rights in North Dakota, prominent role in Standing Rock protests.',
  true, 4.6, 210),

-- OHIO
('ACLU of Ohio', 'American Civil Liberties Union', 'Ohio', 'Cleveland',
  ARRAY['Civil Rights', 'Criminal Justice', 'Police Reform', 'Voting Rights'],
  ARRAY['Police Consent Decrees', 'Voting Access', 'Mass Incarceration'],
  '216-472-2220', 'info@acluohio.org', 'https://www.acluohio.org',
  'Fights for civil liberties in Ohio with major work on police reform in Cleveland.',
  true, 4.7, 460),

('Ohio Innocence Project', 'OIP', 'Ohio', 'Cincinnati',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'DNA Testing', 'Exonerations'],
  '513-556-0925', 'info@ohioinnocenceproject.org', 'https://www.ohioinnocenceproject.org',
  'University of Cincinnati law clinic working to free wrongfully convicted in Ohio.',
  true, 4.8, 270),

-- OKLAHOMA
('ACLU of Oklahoma', 'American Civil Liberties Union', 'Oklahoma', 'Oklahoma City',
  ARRAY['Civil Rights', 'Criminal Justice', 'Voting Rights', 'LGBTQ Rights'],
  ARRAY['Mass Incarceration', 'Death Penalty', 'Police Practices'],
  '405-524-8511', 'info@acluok.org', 'https://www.acluok.org',
  'Protects constitutional rights in Oklahoma, state with highest female incarceration rate.',
  true, 4.6, 280),

('Oklahoma Innocence Project', 'OKIP', 'Oklahoma', 'Norman',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Death Penalty'],
  ARRAY['Innocence Cases', 'Exonerations', 'Capital Defense'],
  '405-325-1988', 'okip@ou.edu', 'https://www.oklahomainnocence.org',
  'Works to free wrongfully convicted individuals in Oklahoma through investigation and litigation.',
  true, 4.7, 230),

-- OREGON
('ACLU of Oregon', 'American Civil Liberties Union', 'Oregon', 'Portland',
  ARRAY['Civil Rights', 'Criminal Justice', 'Privacy', 'Free Speech'],
  ARRAY['Police Practices', 'Surveillance', 'Protest Rights'],
  '503-227-3186', 'info@aclu-or.org', 'https://www.aclu-or.org',
  'Defends civil liberties in Oregon with strong focus on privacy and free speech.',
  true, 4.7, 410),

('Oregon Innocence Project', 'OIP', 'Oregon', 'Eugene',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'Exonerations'],
  '', 'innocenceproject@law.uoregon.edu', 'https://law.uoregon.edu/academics/legal-clinics/oregon-innocence-project',
  'University of Oregon law clinic investigating wrongful conviction claims.',
  true, 4.6, 180),

-- PENNSYLVANIA
('ACLU of Pennsylvania', 'American Civil Liberties Union', 'Pennsylvania', 'Philadelphia',
  ARRAY['Civil Rights', 'Criminal Justice', 'Voting Rights', 'Free Speech'],
  ARRAY['Police Reform', 'Mass Incarceration', 'Voting Access'],
  '215-592-1513', 'info@aclupa.org', 'https://www.aclupa.org',
  'Protects constitutional rights of Pennsylvanians through litigation and advocacy.',
  true, 4.7, 470),

('Pennsylvania Innocence Project', 'PIP', 'Pennsylvania', 'Philadelphia',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'DNA Testing', 'Exonerations'],
  '', 'info@pennsinnocenceproject.org', 'https://pennsylvaniainnocenceproject.org',
  'Works to exonerate wrongfully convicted and reform criminal justice in Pennsylvania.',
  true, 4.8, 290),

-- RHODE ISLAND
('ACLU of Rhode Island', 'American Civil Liberties Union', 'Rhode Island', 'Providence',
  ARRAY['Civil Rights', 'Criminal Justice', 'Privacy', 'Immigrants Rights'],
  ARRAY['Police Practices', 'Surveillance', 'ICE Enforcement'],
  '401-831-7171', 'info@riaclu.org', 'https://www.riaclu.org',
  'Defends civil liberties in Rhode Island through litigation, advocacy, and education.',
  true, 4.6, 220),

-- SOUTH CAROLINA
('ACLU of South Carolina', 'American Civil Liberties Union', 'South Carolina', 'Charleston',
  ARRAY['Civil Rights', 'Criminal Justice', 'Voting Rights', 'LGBTQ Rights'],
  ARRAY['Police Practices', 'Voting Access', 'Discrimination'],
  '843-720-1423', 'info@aclusc.org', 'https://www.aclusc.org',
  'Protects constitutional rights of South Carolinians through strategic litigation.',
  true, 4.6, 250),

-- SOUTH DAKOTA
('ACLU of South Dakota', 'American Civil Liberties Union', 'South Dakota', 'Sioux Falls',
  ARRAY['Civil Rights', 'Indigenous Rights', 'Criminal Justice', 'Privacy'],
  ARRAY['Native American Rights', 'Police Practices', 'Voting Rights'],
  '605-332-2508', 'info@aclusd.org', 'https://www.aclusd.org',
  'Defends civil liberties in South Dakota with attention to indigenous rights.',
  true, 4.5, 170),

-- TENNESSEE
('ACLU of Tennessee', 'American Civil Liberties Union', 'Tennessee', 'Nashville',
  ARRAY['Civil Rights', 'Criminal Justice', 'Voting Rights', 'Free Speech'],
  ARRAY['Police Practices', 'Mass Incarceration', 'Protest Rights'],
  '615-320-7142', 'info@aclu-tn.org', 'https://www.aclu-tn.org',
  'Protects constitutional freedoms of Tennesseans through litigation and advocacy.',
  true, 4.6, 310),

('Tennessee Innocence Project', 'TIP', 'Tennessee', 'Chattanooga',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'Exonerations', 'Case Review'],
  '', 'info@tninnocenceproject.org', 'https://www.tninnocenceproject.org',
  'Works to free wrongfully convicted individuals in Tennessee.',
  true, 4.6, 190),

-- UTAH
('ACLU of Utah', 'American Civil Liberties Union', 'Utah', 'Salt Lake City',
  ARRAY['Civil Rights', 'Criminal Justice', 'Privacy', 'Free Speech'],
  ARRAY['Police Practices', 'Surveillance', 'Religious Freedom'],
  '801-521-9289', 'info@acluutah.org', 'https://www.acluutah.org',
  'Defends individual rights and liberties in Utah through litigation and advocacy.',
  true, 4.6, 260),

('Rocky Mountain Innocence Center', 'RMIC', 'Utah', 'Salt Lake City',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'DNA Testing', 'Exonerations'],
  '801-363-0400', 'info@rmip.org', 'https://www.rmip.org',
  'Works to exonerate wrongfully convicted in Utah, Nevada, and Wyoming.',
  true, 4.7, 200),

-- VERMONT
('ACLU of Vermont', 'American Civil Liberties Union', 'Vermont', 'Montpelier',
  ARRAY['Civil Rights', 'Privacy', 'Criminal Justice', 'Free Speech'],
  ARRAY['Police Practices', 'Surveillance', 'Drug Policy'],
  '802-223-6304', 'info@acluvt.org', 'https://www.acluvt.org',
  'Protects constitutional rights of Vermonters through litigation and advocacy.',
  true, 4.6, 180),

-- VIRGINIA
('ACLU of Virginia', 'American Civil Liberties Union', 'Virginia', 'Richmond',
  ARRAY['Civil Rights', 'Criminal Justice', 'Voting Rights', 'Free Speech'],
  ARRAY['Police Reform', 'Felon Disenfranchisement', 'Charlottesville'],
  '804-644-8080', 'acluva@acluva.org', 'https://www.acluva.org',
  'Defends civil liberties in Virginia, major work after Charlottesville Unite the Right rally.',
  true, 4.7, 400),

('Mid-Atlantic Innocence Project', 'MAIP', 'Virginia', 'Washington',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'DNA Testing', 'Exonerations'],
  '202-455-9145', 'info@exonerate.org', 'https://www.exonerate.org',
  'Works to exonerate wrongfully convicted in Virginia, Maryland, and D.C.',
  true, 4.8, 270),

-- WASHINGTON
('ACLU of Washington', 'American Civil Liberties Union', 'Washington', 'Seattle',
  ARRAY['Civil Rights', 'Privacy', 'Criminal Justice', 'Technology'],
  ARRAY['Police Surveillance', 'Facial Recognition', 'Immigration Enforcement'],
  '206-624-2184', 'info@aclu-wa.org', 'https://www.aclu-wa.org',
  'Protects civil liberties in Washington with cutting-edge work on technology and privacy.',
  true, 4.8, 530),

('Washington Innocence Project', 'WIP', 'Washington', 'Seattle',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'DNA Testing', 'Exonerations'],
  '206-616-0335', 'wip@uw.edu', 'https://www.washingtoninnocenceproject.org',
  'University of Washington law clinic working to free wrongfully convicted.',
  true, 4.8, 260),

-- WEST VIRGINIA
('ACLU of West Virginia', 'American Civil Liberties Union', 'West Virginia', 'Charleston',
  ARRAY['Civil Rights', 'Criminal Justice', 'Voting Rights', 'Privacy'],
  ARRAY['Police Practices', 'Drug Policy', 'Surveillance'],
  '304-345-9246', 'contactus@acluwv.org', 'https://www.acluwv.org',
  'Defends constitutional rights of West Virginians through litigation and advocacy.',
  true, 4.5, 170),

-- WISCONSIN
('ACLU of Wisconsin', 'American Civil Liberties Union', 'Wisconsin', 'Milwaukee',
  ARRAY['Civil Rights', 'Criminal Justice', 'Voting Rights', 'Privacy'],
  ARRAY['Police Reform', 'Voter ID Laws', 'School Discipline'],
  '414-272-4032', 'info@aclu-wi.org', 'https://www.aclu-wi.org',
  'Protects civil liberties in Wisconsin with major work on voting rights and criminal justice.',
  true, 4.7, 390),

('Wisconsin Innocence Project', 'WIP', 'Wisconsin', 'Madison',
  ARRAY['Wrongful Conviction', 'Post-Conviction', 'Criminal Justice'],
  ARRAY['Innocence Cases', 'DNA Testing', 'Exonerations'],
  '608-261-1375', 'wip@law.wisc.edu', 'https://www.law.wisc.edu/fjr/innocence',
  'Law school clinic working to exonerate wrongfully convicted in Wisconsin.',
  true, 4.8, 250),

-- WYOMING
('ACLU of Wyoming', 'American Civil Liberties Union', 'Wyoming', 'Laramie',
  ARRAY['Civil Rights', 'Privacy', 'Criminal Justice', 'LGBTQ Rights'],
  ARRAY['Police Practices', 'Surveillance', 'Discrimination'],
  '307-637-4565', 'info@aclu-wy.org', 'https://www.aclu-wy.org',
  'Defends constitutional freedoms of Wyoming residents through litigation and advocacy.',
  true, 4.5, 150),

-- WASHINGTON D.C.
('ACLU of the District of Columbia', 'American Civil Liberties Union', 'District of Columbia', 'Washington',
  ARRAY['Civil Rights', 'Criminal Justice', 'Police Reform', 'Voting Rights'],
  ARRAY['Police Practices', 'Statehood', 'Surveillance'],
  '202-457-0800', 'info@acludc.org', 'https://www.acludc.org',
  'Protects civil liberties in nation''s capital with focus on police reform and statehood.',
  true, 4.7, 410);
