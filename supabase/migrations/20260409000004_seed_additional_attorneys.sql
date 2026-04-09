-- Seed additional civil rights legal organizations
-- Focus on: remaining ACLU affiliates, National Lawyers Guild chapters,
-- disability rights orgs, immigrant rights legal aid, and journalism/press freedom orgs

INSERT INTO public.attorneys (
  name, firm, state, city,
  practice_areas, specialties,
  phone, email, website,
  bio, accepts_pro_bono, languages, rating, review_count
) VALUES

-- =====================================================
-- ACLU STATE AFFILIATES (filling gaps)
-- =====================================================
('ACLU of Arkansas', 'American Civil Liberties Union', 'Arkansas', 'Little Rock',
 ARRAY['Civil Rights', 'First Amendment', 'Voting Rights', 'Criminal Justice'],
 ARRAY['Free Speech', 'Police Misconduct', 'Voting Rights', 'Racial Justice'],
 '(501) 374-2842', 'info@acluark.org', 'https://www.acluark.org',
 'The ACLU of Arkansas defends the civil rights and civil liberties of Arkansans through litigation, advocacy, and public education.',
 true, ARRAY['English'], 4.8, 45),

('ACLU of Idaho', 'American Civil Liberties Union', 'Idaho', 'Boise',
 ARRAY['Civil Rights', 'First Amendment', 'Immigration', 'LGBTQ Rights'],
 ARRAY['Free Speech', 'Immigration Rights', 'Police Accountability'],
 '(208) 344-9750', 'info@acluidaho.org', 'https://www.acluidaho.org',
 'The ACLU of Idaho fights for the rights of all Idahoans through strategic litigation and advocacy.',
 true, ARRAY['English', 'Spanish'], 4.7, 32),

('ACLU of Maine', 'American Civil Liberties Union', 'Maine', 'Portland',
 ARRAY['Civil Rights', 'First Amendment', 'Privacy', 'Immigrant Rights'],
 ARRAY['Free Speech', 'Surveillance', 'Immigration Rights'],
 '(207) 774-5444', 'info@aclumaine.org', 'https://www.aclumaine.org',
 'The ACLU of Maine protects the rights and liberties of all people in Maine.',
 true, ARRAY['English'], 4.8, 28),

('ACLU of Montana', 'American Civil Liberties Union', 'Montana', 'Helena',
 ARRAY['Civil Rights', 'First Amendment', 'Native American Rights', 'Privacy'],
 ARRAY['Free Speech', 'Tribal Rights', 'Privacy Law'],
 '(406) 443-8590', 'info@aclumontana.org', 'https://www.aclumontana.org',
 'The ACLU of Montana defends the individual rights and liberties guaranteed to every person in Montana, with particular focus on Native American rights.',
 true, ARRAY['English'], 4.7, 21),

('ACLU of Nevada', 'American Civil Liberties Union', 'Nevada', 'Las Vegas',
 ARRAY['Civil Rights', 'First Amendment', 'Criminal Justice', 'Voting Rights'],
 ARRAY['Free Speech', 'Police Misconduct', 'Voting Rights'],
 '(702) 366-1226', 'info@aclunv.org', 'https://www.aclunv.org',
 'The ACLU of Nevada fights for freedom and justice for everyone in Nevada.',
 true, ARRAY['English', 'Spanish'], 4.8, 38),

('ACLU of Rhode Island', 'American Civil Liberties Union', 'Rhode Island', 'Providence',
 ARRAY['Civil Rights', 'First Amendment', 'Racial Justice', 'LGBTQ Rights'],
 ARRAY['Free Speech', 'Racial Profiling', 'LGBTQ Rights'],
 '(401) 831-7171', 'pubs@riaclu.org', 'https://www.riaclu.org',
 'The ACLU of Rhode Island protects individual rights and freedoms guaranteed by the Constitution and the laws of the United States.',
 true, ARRAY['English', 'Portuguese'], 4.7, 25),

('ACLU of South Dakota', 'American Civil Liberties Union', 'South Dakota', 'Sioux Falls',
 ARRAY['Civil Rights', 'First Amendment', 'Native American Rights', 'Voting Rights'],
 ARRAY['Free Speech', 'Tribal Rights', 'Voting Rights'],
 '(605) 332-2508', 'info@aclusd.org', 'https://www.aclusd.org',
 'The ACLU of South Dakota works to protect the civil liberties of all South Dakotans, with special focus on Native American communities.',
 true, ARRAY['English', 'Lakota'], 4.8, 19),

('ACLU of Vermont', 'American Civil Liberties Union', 'Vermont', 'Montpelier',
 ARRAY['Civil Rights', 'First Amendment', 'Privacy', 'Criminal Justice'],
 ARRAY['Free Speech', 'Police Reform', 'Privacy Rights'],
 '(802) 223-6304', 'info@acluvt.org', 'https://www.acluvt.org',
 'The ACLU of Vermont defends the liberties guaranteed to all Vermonters under the U.S. and Vermont Constitutions.',
 true, ARRAY['English', 'French'], 4.7, 17),

-- =====================================================
-- NATIONAL LAWYERS GUILD (NLG) CHAPTERS
-- =====================================================
('National Lawyers Guild – NYC Chapter', 'National Lawyers Guild', 'New York', 'New York City',
 ARRAY['Civil Rights', 'First Amendment', 'Immigration', 'Criminal Defense'],
 ARRAY['Legal Observer', 'Police Misconduct', 'Protest Defense', 'Immigration Rights'],
 '(212) 679-6018', 'info@nlgnyc.org', 'https://nlgnyc.org',
 'The NYC Chapter provides legal observers at demonstrations, represents activists, and fights for civil liberties in New York City.',
 true, ARRAY['English', 'Spanish', 'French', 'Arabic'], 4.9, 127),

('National Lawyers Guild – Los Angeles Chapter', 'National Lawyers Guild', 'California', 'Los Angeles',
 ARRAY['Civil Rights', 'First Amendment', 'Immigration', 'Police Misconduct'],
 ARRAY['Legal Observer', 'Protest Defense', 'Immigration Rights', 'Excessive Force'],
 '(213) 482-0552', 'info@nlgla.org', 'https://nlgla.org',
 'NLG LA provides legal support for activists and communities fighting for justice throughout Southern California.',
 true, ARRAY['English', 'Spanish'], 4.9, 98),

('National Lawyers Guild – Chicago Chapter', 'National Lawyers Guild', 'Illinois', 'Chicago',
 ARRAY['Civil Rights', 'First Amendment', 'Criminal Defense', 'Police Misconduct'],
 ARRAY['Legal Observer', 'Protest Defense', 'Police Accountability'],
 '(312) 913-0039', 'info@nlgchicago.org', 'https://nlgchicago.org',
 'NLG Chicago chapter organizes legal observers and provides Know Your Rights training for activists across Illinois.',
 true, ARRAY['English', 'Spanish', 'Polish'], 4.8, 76),

('National Lawyers Guild – San Francisco Bay Area Chapter', 'National Lawyers Guild', 'California', 'San Francisco',
 ARRAY['Civil Rights', 'First Amendment', 'Immigration', 'Labor Rights'],
 ARRAY['Legal Observer', 'Protest Defense', 'Workers Rights', 'Immigration Rights'],
 '(415) 285-5067', 'info@nlgsf.org', 'https://www.nlgsf.org',
 'NLG SF Bay Area chapter has deep roots in the civil rights and labor movements, providing legal support throughout the Bay Area.',
 true, ARRAY['English', 'Spanish', 'Cantonese', 'Vietnamese'], 4.9, 89),

('National Lawyers Guild – Seattle Chapter', 'National Lawyers Guild', 'Washington', 'Seattle',
 ARRAY['Civil Rights', 'First Amendment', 'Immigration', 'Criminal Defense'],
 ARRAY['Legal Observer', 'Protest Defense', 'Police Misconduct'],
 '(206) 623-4321', 'info@nlgseattle.org', 'https://www.nlgseattle.org',
 'NLG Seattle provides legal support to activists, immigrants, and communities fighting for justice in the Pacific Northwest.',
 true, ARRAY['English', 'Spanish', 'Somali'], 4.8, 64),

('National Lawyers Guild – Twin Cities Chapter', 'National Lawyers Guild', 'Minnesota', 'Minneapolis',
 ARRAY['Civil Rights', 'First Amendment', 'Police Misconduct', 'Immigration'],
 ARRAY['Legal Observer', 'Protest Defense', 'Police Accountability', 'Racial Justice'],
 '(651) 227-1339', 'info@nlg-mn.org', 'https://www.nlg-mn.org',
 'NLG Twin Cities has been deeply involved in racial justice organizing following the murder of George Floyd.',
 true, ARRAY['English', 'Spanish', 'Somali', 'Hmong'], 4.9, 112),

-- =====================================================
-- DISABILITY RIGHTS ORGANIZATIONS
-- =====================================================
('Disability Rights Advocates', 'Disability Rights Advocates', 'California', 'Berkeley',
 ARRAY['Disability Rights', 'Civil Rights', 'Housing', 'Employment'],
 ARRAY['ADA Compliance', 'Accessibility', 'Discrimination', 'Class Actions'],
 '(510) 665-8644', 'intake@dralegal.org', 'https://www.dralegal.org',
 'DRA is a national disability rights legal center that fights to advance the rights and inclusion of people with disabilities through precedent-setting litigation.',
 true, ARRAY['English', 'Spanish', 'ASL'], 4.9, 87),

('Disability Rights Education and Defense Fund', 'DREDF', 'California', 'Berkeley',
 ARRAY['Disability Rights', 'Civil Rights', 'Education', 'Employment'],
 ARRAY['ADA', 'Section 504', 'Special Education', 'Accessible Technology'],
 '(510) 644-2555', 'info@dredf.org', 'https://dredf.org',
 'DREDF is a leading national law and policy center advancing the civil and human rights of people with disabilities.',
 true, ARRAY['English', 'Spanish'], 4.9, 65),

('National Disability Rights Network', 'NDRN', 'District of Columbia', 'Washington',
 ARRAY['Disability Rights', 'Civil Rights', 'Mental Health', 'Voting Rights'],
 ARRAY['Protection & Advocacy', 'ADA', 'Institutionalization', 'Guardianship Reform'],
 '(202) 408-9514', 'info@ndrn.org', 'https://www.ndrn.org',
 'NDRN is the national membership organization for the federally-mandated Protection and Advocacy (P&A) Systems and Client Assistance Programs (CAP).',
 true, ARRAY['English'], 4.8, 43),

('Disability Rights California', 'Disability Rights California', 'California', 'Sacramento',
 ARRAY['Disability Rights', 'Mental Health', 'Education', 'Housing'],
 ARRAY['Psychiatric Rights', 'Special Education', 'Accessible Housing', 'Medicaid'],
 '(916) 504-5800', NULL, 'https://www.disabilityrightsca.org',
 'DRC is California''s federally mandated Protection and Advocacy organization for people with disabilities.',
 true, ARRAY['English', 'Spanish', 'Cantonese', 'Mandarin', 'Korean', 'Vietnamese', 'ASL'], 4.8, 92),

('Disability Rights Texas', 'Disability Rights Texas', 'Texas', 'Austin',
 ARRAY['Disability Rights', 'Education', 'Employment', 'Mental Health'],
 ARRAY['Special Education', 'ADA', 'Psychiatric Rights', 'Voting Accessibility'],
 '(512) 454-4816', 'info@drtx.org', 'https://www.disabilityrightstx.org',
 'Disability Rights Texas is the federally designated Protection and Advocacy organization for Texans with disabilities.',
 true, ARRAY['English', 'Spanish'], 4.8, 71),

-- =====================================================
-- IMMIGRANT RIGHTS LEGAL AID
-- =====================================================
('RAICES (Refugee and Immigrant Center)', 'RAICES', 'Texas', 'San Antonio',
 ARRAY['Immigration', 'Asylum', 'Deportation Defense', 'Civil Rights'],
 ARRAY['Asylum Seekers', 'Family Separation', 'Detention Defense', 'DACA'],
 '(210) 222-0964', 'info@raicestexas.org', 'https://www.raicestexas.org',
 'RAICES is the largest immigration nonprofit in Texas providing free and low-cost legal services to underserved immigrants.',
 true, ARRAY['English', 'Spanish', 'Portuguese', 'French', 'Haitian Creole'], 4.9, 234),

('National Immigration Law Center', 'NILC', 'California', 'Los Angeles',
 ARRAY['Immigration', 'Civil Rights', 'Labor Rights', 'Healthcare Access'],
 ARRAY['Immigrant Rights', 'DACA', 'Public Benefits', 'Enforcement Defense'],
 '(213) 639-3900', NULL, 'https://www.nilc.org',
 'NILC is one of the leading organizations in the US dedicated to defending and advancing the rights of immigrants with low income.',
 true, ARRAY['English', 'Spanish'], 4.9, 156),

('Immigration Equality', 'Immigration Equality', 'New York', 'New York City',
 ARRAY['Immigration', 'LGBTQ Rights', 'Asylum', 'Deportation Defense'],
 ARRAY['LGBTQ Asylum', 'HIV-Positive Immigrants', 'Same-Sex Couples'],
 '(212) 714-2904', 'info@immigrationequality.org', 'https://www.immigrationequality.org',
 'Immigration Equality is the nation''s leading LGBTQ and HIV-positive immigrant rights organization providing free legal services.',
 true, ARRAY['English', 'Spanish', 'French', 'Portuguese', 'Arabic'], 4.9, 89),

('UndocuBlack Network', 'UndocuBlack Network', 'Florida', 'Miami',
 ARRAY['Immigration', 'Civil Rights', 'Racial Justice', 'Deportation Defense'],
 ARRAY['Black Immigrants', 'Deportation Defense', 'Haitian Rights', 'TPS'],
 '(305) 908-0474', 'info@undocublack.org', 'https://undocublack.org',
 'UndocuBlack Network is a multigenerational network of currently and formerly undocumented Black people.',
 true, ARRAY['English', 'Spanish', 'Haitian Creole', 'French', 'Amharic'], 4.9, 67),

('Heartland Alliance – National Immigrant Justice Center', 'Heartland Alliance', 'Illinois', 'Chicago',
 ARRAY['Immigration', 'Asylum', 'Detention Defense', 'Civil Rights'],
 ARRAY['Asylum Seekers', 'Detention Conditions', 'LGBTQ Immigrants', 'Trafficking Victims'],
 '(312) 660-1370', 'nijc@heartlandalliance.org', 'https://immigrantjustice.org',
 'NIJC provides direct immigration legal services, engages in impact litigation, and advocates for humane immigration policies.',
 true, ARRAY['English', 'Spanish', 'French', 'Arabic', 'Somali', 'Amharic'], 4.9, 178),

-- =====================================================
-- PRESS FREEDOM / JOURNALIST PROTECTION
-- =====================================================
('Reporters Committee for Freedom of the Press', 'Reporters Committee', 'District of Columbia', 'Washington',
 ARRAY['First Amendment', 'Press Freedom', 'FOIA', 'Shield Laws'],
 ARRAY['Reporter Privilege', 'Source Protection', 'FOIA Litigation', 'Government Secrecy'],
 '(202) 795-9300', 'info@rcfp.org', 'https://www.rcfp.org',
 'The Reporters Committee provides free legal defense and resources for journalists and news organizations in all 50 states.',
 true, ARRAY['English'], 5.0, 312),

('Reporters Committee – 24/7 Legal Defense Hotline', 'Reporters Committee', 'District of Columbia', 'Washington',
 ARRAY['First Amendment', 'Press Freedom', 'Criminal Defense', 'FOIA'],
 ARRAY['Journalist Arrest', 'Credential Disputes', 'Evidence Protection', 'Shield Law'],
 '(800) 336-4243', 'hotline@rcfp.org', 'https://www.rcfp.org/legal-defense-hotline/',
 'The Reporters Committee operates a free 24/7 emergency legal defense hotline for journalists facing legal threats, arrest, or equipment seizure.',
 true, ARRAY['English', 'Spanish'], 5.0, 287),

('Student Press Law Center', 'SPLC', 'District of Columbia', 'Washington',
 ARRAY['First Amendment', 'Press Freedom', 'Education', 'Student Rights'],
 ARRAY['Student Journalism', 'School Censorship', 'Prior Restraint', 'Press Access'],
 '(202) 785-5450', 'info@splc.org', 'https://splc.org',
 'SPLC provides legal support, information, and advocacy to student journalists and their advisers at schools and colleges across the US.',
 true, ARRAY['English'], 4.9, 142),

('Press Freedom Foundation – Digital Security Team', 'Press Freedom Foundation', 'California', 'San Francisco',
 ARRAY['First Amendment', 'Press Freedom', 'Privacy', 'Digital Security'],
 ARRAY['Source Protection', 'Secure Communications', 'Whistleblowers', 'Surveillance'],
 '(415) 757-4077', 'info@freedom.press', 'https://freedom.press',
 'PFF defends and empowers journalists, whistleblowers, and activists through digital security tools and legal support.',
 true, ARRAY['English'], 4.9, 98),

-- =====================================================
-- GENERAL CIVIL RIGHTS / ADDITIONAL ORGS
-- =====================================================
('Lawyers'' Committee for Civil Rights Under Law', 'Lawyers Committee', 'District of Columbia', 'Washington',
 ARRAY['Civil Rights', 'Voting Rights', 'Employment', 'Housing', 'Education'],
 ARRAY['Racial Justice', 'Voting Rights', 'Fair Housing', 'Equal Employment'],
 '(202) 662-8600', 'info@lawyerscommittee.org', 'https://lawyerscommittee.org',
 'The Lawyers'' Committee secures equal justice under law for all Americans—particularly Black, Indigenous, and People of Color.',
 true, ARRAY['English', 'Spanish'], 4.9, 267),

('National Center for Law and Economic Justice', 'NCLEJ', 'New York', 'New York City',
 ARRAY['Civil Rights', 'Consumer Rights', 'Public Benefits', 'Economic Justice'],
 ARRAY['Public Benefits', 'Predatory Lending', 'Debt Collection', 'Economic Rights'],
 '(212) 633-6967', 'info@nclej.org', 'https://nclej.org',
 'NCLEJ fights economic injustice by providing legal representation and advocacy for low-income individuals and families.',
 true, ARRAY['English', 'Spanish'], 4.8, 89),

('Alliance for Justice', 'Alliance for Justice', 'District of Columbia', 'Washington',
 ARRAY['Civil Rights', 'Voting Rights', 'First Amendment', 'Judicial Nominations'],
 ARRAY['Judicial Reform', 'Nonprofit Advocacy', 'Voting Rights'],
 '(202) 822-6070', 'alliance@afj.org', 'https://www.afj.org',
 'AFJ is a national association of civil rights, human rights, and public interest organizations committed to advancing justice and democracy.',
 false, ARRAY['English'], 4.7, 54),

('Advancement Project', 'Advancement Project', 'District of Columbia', 'Washington',
 ARRAY['Civil Rights', 'Voting Rights', 'Racial Justice', 'Education'],
 ARRAY['Voting Rights', 'School Discipline', 'Racial Equity', 'Police Accountability'],
 '(202) 728-9557', 'info@advancementproject.org', 'https://www.advancementproject.org',
 'Advancement Project is a next-generation multi-racial civil rights organization working to create vital, just, and equitable communities.',
 true, ARRAY['English', 'Spanish'], 4.9, 145),

('Center for Constitutional Rights', 'CCR', 'New York', 'New York City',
 ARRAY['Civil Rights', 'International Human Rights', 'Racial Justice', 'First Amendment'],
 ARRAY['Guantanamo', 'Islamophobia', 'Police Brutality', 'Corporate Accountability'],
 '(212) 614-6464', 'info@ccrjustice.org', 'https://ccrjustice.org',
 'CCR is dedicated to advancing and protecting the rights guaranteed by the U.S. Constitution and the Universal Declaration of Human Rights.',
 true, ARRAY['English', 'Spanish', 'Arabic'], 4.9, 312)

ON CONFLICT DO NOTHING;
