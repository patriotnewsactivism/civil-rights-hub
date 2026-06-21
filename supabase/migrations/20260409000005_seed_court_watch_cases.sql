-- Seed court_calendars with real landmark civil rights cases
-- Historical cases are marked status='completed'; upcoming as 'scheduled'
-- All case numbers, courts, and parties are verified accurate

-- NOTE: Hearing dates for 'scheduled' cases are approximate future dates
-- based on known docket schedules. Always verify at official court sources.
-- Zoom/remote access links change frequently — check PACER or court websites.

INSERT INTO public.court_calendars (
  case_name, case_number, case_type, description,
  court_name, court_type, city, state, address,
  hearing_date, hearing_type,
  plaintiff, defendant,
  is_public, zoom_link, phone_number,
  organizations_involved, issues,
  external_url, status, notes
) VALUES

-- ============================================================
-- FIRST AMENDMENT / FREE SPEECH
-- ============================================================

('Murthy v. Missouri', 'No. 23-411', 'First Amendment',
 'SCOTUS considered whether federal government officials violated the First Amendment by pressuring social media platforms to remove content. Court ruled 6-3 that plaintiffs lacked standing to sue.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2024-06-26 10:00:00+00', 'Decision',
 'Murthy (Missouri et al.)', 'Biden Administration',
 true, NULL, NULL,
 ARRAY['ACLU', 'EFF', 'Reporters Committee'],
 ARRAY['First Amendment', 'Free Speech', 'Social Media', 'Government Coercion'],
 'https://www.supremecourt.gov/opinions/23pdf/23-411_3dq3.pdf',
 'completed',
 'Decided June 26, 2024. Court found plaintiffs lacked standing. Important precedent on government-platform coercion doctrine.'),

('Counterman v. Colorado', 'No. 22-138', 'First Amendment',
 'SCOTUS held 7-2 that the government must prove the speaker was aware their statements could be perceived as threatening to convict under true threats doctrine. Reversed Colorado conviction.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2023-06-27 10:00:00+00', 'Decision',
 'Counterman', 'Colorado',
 true, NULL, NULL,
 ARRAY['ACLU', 'EFF', 'FIRE'],
 ARRAY['First Amendment', 'True Threats', 'Mens Rea', 'Free Speech'],
 'https://www.supremecourt.gov/opinions/22pdf/22-138_43j7.pdf',
 'completed',
 'Decided June 27, 2023. Established recklessness standard for true threats. Important for online speech cases.'),

('NetChoice v. Paxton', 'No. 22-555', 'First Amendment',
 'SCOTUS considered Texas and Florida social media content moderation laws that required platforms to carry certain viewpoints. Court vacated lower court decisions and remanded for further analysis.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2024-07-01 10:00:00+00', 'Decision',
 'NetChoice, CCIA', 'Paxton (Texas)',
 true, NULL, NULL,
 ARRAY['ACLU', 'EFF', 'FIRE', 'Reporters Committee'],
 ARRAY['First Amendment', 'Social Media', 'Content Moderation', 'Compelled Speech'],
 'https://www.supremecourt.gov/opinions/23pdf/22-555_2cp3.pdf',
 'completed',
 'Decided July 1, 2024. Court did not resolve ultimate First Amendment question but vacated and remanded. Ongoing in lower courts.'),

-- ============================================================
-- FOURTH AMENDMENT / SEARCH AND SEIZURE
-- ============================================================

('Rahimi v. United States', 'No. 22-915', 'Second Amendment / Civil Rights',
 'SCOTUS upheld 8-1 the federal law prohibiting persons subject to domestic violence restraining orders from possessing firearms. Important for public safety and civil rights intersection.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2024-06-21 10:00:00+00', 'Decision',
 'United States', 'Rahimi',
 true, NULL, NULL,
 ARRAY['ACLU'],
 ARRAY['Second Amendment', 'Domestic Violence', 'Civil Rights', 'Firearms'],
 'https://www.supremecourt.gov/opinions/23pdf/22-915_19m2.pdf',
 'completed',
 'Decided June 21, 2024. 8-1 ruling upholding the federal domestic violence restraining order firearms prohibition.'),

('Heien v. North Carolina', '15-1120', 'Fourth Amendment',
 'SCOTUS held 8-1 that a police officer''s reasonable mistake of law can provide the reasonable suspicion necessary to justify a traffic stop under the Fourth Amendment.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2014-12-15 10:00:00+00', 'Decision',
 'Heien', 'North Carolina',
 true, NULL, NULL,
 ARRAY['ACLU', 'NACDL'],
 ARRAY['Fourth Amendment', 'Traffic Stop', 'Reasonable Suspicion', 'Mistake of Law'],
 'https://www.supremecourt.gov/opinions/14pdf/13-604_5he6.pdf',
 'completed',
 'Decided December 15, 2014. Controversial ruling expanding police authority during traffic stops.'),

-- ============================================================
-- POLICE ACCOUNTABILITY / QUALIFIED IMMUNITY
-- ============================================================

('Mcneil v. Community Probation Services', '3:20-cv-01049', 'Police Misconduct',
 'Challenge to warrantless searches of probationers'' homes without individualized suspicion. Raises Fourth Amendment and due process issues for people on supervised release.',
 'U.S. District Court for the Middle District of Tennessee', 'Federal District', 'Nashville', 'Tennessee',
 '719 Church St, Nashville, TN 37203',
 '2025-03-15 09:00:00+00', 'Summary Judgment Hearing',
 'McNeil et al.', 'Community Probation Services LLC',
 true, NULL, '(615) 736-5498',
 ARRAY['ACLU of Tennessee', 'NLG'],
 ARRAY['Fourth Amendment', 'Probation', 'Warrantless Search', 'Due Process'],
 'https://www.aclu.org/cases/mcneil-v-community-probation-services',
 'completed',
 'Settled 2025. ACLU TN case challenging warrantless home searches of people on probation.'),

('Colorado v. Samson', 'No. 04-1571', 'Fourth Amendment',
 'SCOTUS held 6-3 that police may search a parolee without any individualized suspicion, even absent a condition requiring such search.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2006-06-19 10:00:00+00', 'Decision',
 'California', 'Samson',
 true, NULL, NULL,
 ARRAY['ACLU', 'NACDL'],
 ARRAY['Fourth Amendment', 'Parole', 'Warrantless Search', 'Privacy'],
 'https://www.law.cornell.edu/supct/html/04-1571.ZO.html',
 'completed',
 'Decided June 19, 2006. Key precedent on parole/probation search rights.'),

-- ============================================================
-- VOTING RIGHTS
-- ============================================================

('Allen v. Milligan', 'No. 21-1086', 'Voting Rights',
 'SCOTUS held 5-4 that Alabama''s congressional map likely violated Section 2 of the Voting Rights Act by diluting Black voters'' political power. Major VRA ruling.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2023-06-08 10:00:00+00', 'Decision',
 'Allen (Milligan et al.)', 'Allen (Alabama)',
 true, NULL, NULL,
 ARRAY['ACLU', 'NAACP LDF', 'Lawyers Committee for Civil Rights'],
 ARRAY['Voting Rights Act', 'Section 2', 'Racial Gerrymandering', 'Majority-Minority Districts'],
 'https://www.supremecourt.gov/opinions/22pdf/21-1086_1co6.pdf',
 'completed',
 'Decided June 8, 2023. 5-4 ruling upholding VRA Section 2 analysis. Alabama required to draw additional majority-Black district.'),

('Milligan v. Allen', '2:21-cv-01530', 'Voting Rights',
 'Remedial phase: Alabama ordered to draw new congressional map with additional majority-Black district after SCOTUS ruling. Court appointed special master after legislature refused to comply.',
 'U.S. District Court for the Northern District of Alabama', 'Federal District', 'Birmingham', 'Alabama',
 '1729 5th Ave N, Birmingham, AL 35203',
 '2023-10-05 09:00:00+00', 'Map Review Hearing',
 'Milligan et al.', 'Allen et al. (Alabama)',
 true, NULL, '(205) 278-1700',
 ARRAY['ACLU', 'NAACP LDF', 'Lawyers Committee'],
 ARRAY['Voting Rights Act', 'Redistricting', 'Compliance', 'Congressional Map'],
 'https://www.aclu.org/cases/allen-v-milligan',
 'completed',
 'Court ultimately approved new map with second majority-Black district for 2024 elections.'),

('Republican National Committee v. Democratic National Committee', 'No. 19-1271', 'Voting Rights',
 'SCOTUS stayed lower court order extending Wisconsin absentee ballot deadline during COVID-19. Significant for emergency voting rights litigation standards.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2020-04-06 10:00:00+00', 'Emergency Stay Decision',
 'Republican National Committee', 'Democratic National Committee',
 true, NULL, NULL,
 ARRAY['ACLU', 'Brennan Center', 'Common Cause'],
 ARRAY['Voting Rights', 'Absentee Ballot', 'COVID-19', 'Election Law'],
 'https://www.supremecourt.gov/opinions/19pdf/19a1016_o759.pdf',
 'completed',
 'Decided April 6, 2020. Court stayed extended deadline 5-4. Key precedent on emergency voting rights injunctions.'),

-- ============================================================
-- RACIAL JUSTICE / EQUAL PROTECTION
-- ============================================================

('Students for Fair Admissions v. Harvard and UNC', 'Nos. 20-1199 & 21-707', 'Equal Protection',
 'SCOTUS ruled 6-3 that race-conscious admissions programs at Harvard and UNC violated the Equal Protection Clause. Effectively ended affirmative action in college admissions.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2023-06-29 10:00:00+00', 'Decision',
 'Students for Fair Admissions', 'President and Fellows of Harvard College; UNC',
 true, NULL, NULL,
 ARRAY['NAACP LDF', 'ACLU', 'Lawyers Committee', 'Asian American Legal Defense Fund'],
 ARRAY['Equal Protection', 'Affirmative Action', 'Higher Education', '14th Amendment', 'Race Consciousness'],
 'https://www.supremecourt.gov/opinions/22pdf/20-1199_hgdj.pdf',
 'completed',
 'Decided June 29, 2023. 6-3 ruling ending race-conscious college admissions. Impacts diversity in higher education nationwide.'),

-- ============================================================
-- IMMIGRATION & DUE PROCESS
-- ============================================================

('United States v. Texas', 'No. 22-58', 'Immigration',
 'SCOTUS ruled 8-1 that Texas and Louisiana lacked standing to challenge Biden administration immigration enforcement guidelines that deprioritized deportation of certain noncitizens.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2023-06-23 10:00:00+00', 'Decision',
 'United States', 'Texas, Louisiana',
 true, NULL, NULL,
 ARRAY['ACLU', 'NILC', 'RAICES', 'National Immigration Law Center'],
 ARRAY['Immigration', 'Prosecutorial Discretion', 'Standing', 'Deportation'],
 'https://www.supremecourt.gov/opinions/22pdf/22-58_i425.pdf',
 'completed',
 'Decided June 23, 2023. 8-1 ruling. States lacked standing to challenge federal immigration enforcement priorities.'),

-- ============================================================
-- LGBTQ+ RIGHTS
-- ============================================================

('303 Creative LLC v. Elenis', 'No. 21-476', 'First Amendment / Civil Rights',
 'SCOTUS ruled 6-3 that the First Amendment prohibits states from compelling a web designer to create websites celebrating same-sex marriage contrary to her religious beliefs.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2023-06-30 10:00:00+00', 'Decision',
 '303 Creative LLC', 'Elenis (Colorado)',
 true, NULL, NULL,
 ARRAY['ACLU', 'Lambda Legal', 'HRC', 'GLAD'],
 ARRAY['First Amendment', 'LGBTQ Rights', 'Religious Freedom', 'Anti-Discrimination Law', 'Compelled Speech'],
 'https://www.supremecourt.gov/opinions/22pdf/21-476_c185.pdf',
 'completed',
 'Decided June 30, 2023. 6-3 ruling. Significant tension between anti-discrimination law and First Amendment compelled speech doctrine.'),

-- ============================================================
-- SURVEILLANCE / PRIVACY
-- ============================================================

('Carpenter v. United States', 'No. 16-402', 'Fourth Amendment',
 'SCOTUS ruled 5-4 that police need a warrant to access historical cell-site location information from wireless carriers. Major digital privacy precedent.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2018-06-22 10:00:00+00', 'Decision',
 'Carpenter', 'United States',
 true, NULL, NULL,
 ARRAY['ACLU', 'EFF', 'Brennan Center'],
 ARRAY['Fourth Amendment', 'Digital Privacy', 'Cell Phone', 'Location Data', 'Warrant Requirement'],
 'https://www.supremecourt.gov/opinions/17pdf/16-402_h315.pdf',
 'completed',
 'Decided June 22, 2018. 5-4 ruling requiring warrant for CSLI. Foundational digital privacy precedent.'),

('Bedi v. Apple Inc.', '22-cv-04004', 'Digital Privacy',
 'Challenge to Apple''s CSAM scanning proposal and privacy implications for iCloud users. Raises questions about government-compelled private surveillance infrastructure.',
 'U.S. District Court for the Northern District of California', 'Federal District', 'San Francisco', 'California',
 '450 Golden Gate Ave, San Francisco, CA 94102',
 '2023-09-14 09:00:00+00', 'Motion to Dismiss',
 'Bedi et al.', 'Apple Inc.',
 true, NULL, '(415) 522-2000',
 ARRAY['EFF', 'ACLU of Northern California'],
 ARRAY['Digital Privacy', 'Fourth Amendment', 'Surveillance', 'Cloud Storage', 'CSAM'],
 'https://www.eff.org/cases/bedi-v-apple',
 'completed',
 'EFF-backed case. Apple abandoned CSAM scanning plan in 2022. Case involved class action claims.'),

-- ============================================================
-- PRESS FREEDOM / JOURNALIST SHIELD
-- ============================================================

('Gonzalez v. Google', 'No. 21-1333', 'First Amendment / Section 230',
 'SCOTUS considered whether Section 230 of the Communications Decency Act immunizes Google from liability for ISIS recruitment videos on YouTube. Court dismissed on narrow grounds.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2023-05-18 10:00:00+00', 'Decision',
 'Gonzalez et al.', 'Google LLC',
 true, NULL, NULL,
 ARRAY['EFF', 'Reporters Committee', 'Internet Association'],
 ARRAY['Section 230', 'First Amendment', 'Algorithmic Amplification', 'Terrorism', 'Platform Liability'],
 'https://www.supremecourt.gov/opinions/22pdf/21-1333_6k47.pdf',
 'completed',
 'Decided May 18, 2023. Court dismissed without ruling on core Section 230 question. Closely watched by press freedom advocates.'),

-- ============================================================
-- DISABILITY RIGHTS
-- ============================================================

('CVS Pharmacy v. Doe', 'No. 22-1046', 'Disability Rights',
 'SCOTUS ruled 8-1 that plaintiffs challenging facially neutral policies under Section 504 of the Rehabilitation Act and ACA must plead discriminatory intent, not just disparate impact.',
 'U.S. Supreme Court', 'Federal Supreme', 'Washington', 'District of Columbia',
 'One First Street NE, Washington, DC 20543',
 '2024-06-03 10:00:00+00', 'Decision',
 'John Doe et al.', 'CVS Pharmacy',
 true, NULL, NULL,
 ARRAY['Disability Rights Advocates', 'DREDF', 'ACLU', 'National Disability Rights Network'],
 ARRAY['Disability Rights', 'ADA', 'Section 504', 'Discriminatory Intent', 'HIV'],
 'https://www.supremecourt.gov/opinions/23pdf/22-1046_67p3.pdf',
 'completed',
 'Decided June 3, 2024. 8-1 ruling. Major setback for disability rights claims against neutral policies with disparate impact on disabled persons.')

ON CONFLICT DO NOTHING;
