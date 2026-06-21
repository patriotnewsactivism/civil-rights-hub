-- Additional resource library entries covering civil rights topics not yet
-- fully represented: environmental justice, youth rights, prisoner rights,
-- Native American rights, civil rights history, organizing handbooks,
-- legal self-representation, and media/journalism resources.

INSERT INTO public.resource_library (
  title, description, resource_type, category,
  file_url, file_size, external_url,
  author, source, language,
  tags, is_approved, download_count, view_count
) VALUES

-- ============================================================
-- ENVIRONMENTAL JUSTICE
-- ============================================================

('Environmental Justice: Civil Rights and the Environment',
 'How environmental racism — the disproportionate placement of polluting facilities in communities of color — is a civil rights issue. Covers legal tools including Title VI complaints to the EPA, federal environmental justice requirements, and community organizing strategies.',
 'pdf', 'Environmental Justice',
 NULL, NULL, 'https://www.nrdc.org/stories/environmental-justice-movement',
 'Natural Resources Defense Council', 'NRDC', 'en',
 ARRAY['environmental-justice', 'racism', 'title-vi', 'epa', 'pollution', 'community-rights'],
 true, 0, 0),

('Fence-Line Communities Toolkit: Monitoring Industrial Pollution',
 'Practical guide for frontline communities to document air and water pollution, file regulatory complaints, and use environmental data in civil rights claims. Includes bucket brigade air sampling methodology and EPA enforcement complaint templates.',
 'pdf', 'Environmental Justice',
 NULL, NULL, 'https://www.ejnet.org/ej/toolkit.pdf',
 'Environmental Justice Network', 'EJNET', 'en',
 ARRAY['environmental-justice', 'pollution-monitoring', 'epa-complaints', 'community-organizing', 'fenceline'],
 true, 0, 0),

('Standing Rock and the Right to Protest Pipelines: Legal Analysis',
 'Legal analysis of the Standing Rock Sioux Tribe v. Army Corps of Engineers litigation, treaty rights, First Amendment protest rights at pipeline sites, and what the courts decided. Includes background on water protector arrests and charges.',
 'pdf', 'Environmental Justice',
 NULL, NULL, 'https://earthjustice.org/cases/2019/standing-rock-sioux-tribe-v-army-corps-of-engineers',
 'Earthjustice', 'Earthjustice', 'en',
 ARRAY['standing-rock', 'native-rights', 'pipeline-protest', 'treaty-rights', 'first-amendment', 'water-rights'],
 true, 0, 0),

-- ============================================================
-- NATIVE AMERICAN / INDIGENOUS RIGHTS
-- ============================================================

('Tribal Sovereignty and Federal Civil Rights Law',
 'Overview of how tribal sovereignty interacts with federal civil rights protections, including application of the Indian Civil Rights Act of 1968 (25 U.S.C. § 1301 et seq.), habeas corpus rights in tribal courts, and when federal civil rights remedies apply on tribal lands.',
 'pdf', 'Native American Rights',
 NULL, NULL, 'https://www.narf.org/cases/tribal-civil-rights',
 'Native American Rights Fund', 'NARF', 'en',
 ARRAY['native-american', 'tribal-sovereignty', 'indian-civil-rights-act', 'icra', 'habeas-corpus', 'tribal-courts'],
 true, 0, 0),

('Treaty Rights 101: What They Are and Why They Matter',
 'Plain-language explanation of treaty rights between the US government and Native Nations — including fishing, hunting, water, and land rights. Explains the "reserved rights doctrine" and how treaties have been enforced (and violated) in federal courts.',
 'pdf', 'Native American Rights',
 NULL, NULL, 'https://www.narf.org/nill/resources/treatyrights.html',
 'Native American Rights Fund', 'NARF', 'en',
 ARRAY['native-american', 'treaty-rights', 'reserved-rights', 'fishing-rights', 'water-rights', 'land-rights'],
 true, 0, 0),

('Missing and Murdered Indigenous Women (MMIW) Advocacy Guide',
 'Resources for families and advocates dealing with cases of missing and murdered Indigenous women. Covers Savanna''s Act (2020), tribal law enforcement coordination, federal databases, and community advocacy strategies.',
 'pdf', 'Native American Rights',
 NULL, NULL, 'https://www.niwrc.org/resources/savannas-act-resources',
 'National Indigenous Women''s Resource Center', 'NIWRC', 'en',
 ARRAY['mmiw', 'native-women', 'savannas-act', 'violence-against-women', 'law-enforcement', 'tribal-justice'],
 true, 0, 0),

-- ============================================================
-- YOUTH RIGHTS
-- ============================================================

('Know Your Rights: Students and School Discipline',
 'What students can and cannot be punished for, search and seizure law in schools (New Jersey v. T.L.O.), police searches on school grounds, zero-tolerance policies, suspension and expulsion due process rights, and the school-to-prison pipeline.',
 'pdf', 'Youth Rights',
 NULL, NULL, 'https://www.aclu.org/know-your-rights/student-rights',
 'American Civil Liberties Union', 'ACLU', 'en',
 ARRAY['student-rights', 'school-discipline', 'search-seizure', 'tlo', 'school-to-prison', 'due-process'],
 true, 0, 0),

('Free Speech in Schools: What the First Amendment Protects',
 'Comprehensive guide to student free speech rights covering Tinker v. Des Moines (1969), Hazelwood v. Kuhlmeier (1988), Mahanoy Area School District v. B.L. (2021 — off-campus speech), social media discipline, and rights in private vs. public schools.',
 'pdf', 'Youth Rights',
 NULL, NULL, 'https://www.thefire.org/resources/student-rights-k12',
 'Foundation for Individual Rights and Expression', 'FIRE', 'en',
 ARRAY['student-rights', 'free-speech', 'first-amendment', 'tinker', 'hazelwood', 'social-media', 'school'],
 true, 0, 0),

('Know Your Rights: Youth and Police Encounters',
 'Tailored guide for young people on police encounters — including what to do if stopped, whether juveniles must provide ID, parents'' rights to be present during interrogation, and Miranda rights for juveniles (In re Gault, J.D.B. v. North Carolina).',
 'pdf', 'Youth Rights',
 NULL, NULL, 'https://www.aclu.org/know-your-rights/what-do-when-encountering-law-enforcement',
 'American Civil Liberties Union', 'ACLU', 'en',
 ARRAY['youth-rights', 'juvenile-rights', 'police-encounters', 'miranda', 'jdb-v-north-carolina', 'interrogation'],
 true, 0, 0),

-- ============================================================
-- PRISONER RIGHTS
-- ============================================================

('Prisoner Civil Rights: Filing § 1983 Claims from Prison',
 'Step-by-step guide to filing civil rights lawsuits under 42 U.S.C. § 1983 from prison. Covers the Prison Litigation Reform Act (PLRA) exhaustion requirement, the three-strikes rule, injunctive relief standards, and what constitutes deliberate indifference under the Eighth Amendment.',
 'pdf', 'Prisoner Rights',
 NULL, NULL, 'https://www.prisonerresource.com/resources',
 'National Prisoner Resource Center', 'NPRC', 'en',
 ARRAY['prisoner-rights', '1983-claims', 'plra', 'eighth-amendment', 'deliberate-indifference', 'civil-rights-lawsuit'],
 true, 0, 0),

('Solitary Confinement and the Constitution',
 'Analysis of when solitary confinement constitutes cruel and unusual punishment under the Eighth Amendment, including Wilkinson v. Austin (2005), current circuit court standards, and mental health claims. Includes prisoner complaint templates.',
 'pdf', 'Prisoner Rights',
 NULL, NULL, 'https://www.aclu.org/report/solitary-confinement-facts',
 'American Civil Liberties Union', 'ACLU', 'en',
 ARRAY['prisoner-rights', 'solitary-confinement', 'eighth-amendment', 'cruel-unusual-punishment', 'mental-health', 'atkins'],
 true, 0, 0),

('Incarcerated People''s Rights During Medical Emergencies',
 'Constitutional standards for medical care in jails and prisons, including the deliberate indifference standard (Estelle v. Gamble, 1976), ADA rights for disabled prisoners, and how to document and report inadequate medical care.',
 'pdf', 'Prisoner Rights',
 NULL, NULL, 'https://www.prisonpolicy.org/resources/medical-care',
 'Prison Policy Initiative', 'Prison Policy Initiative', 'en',
 ARRAY['prisoner-rights', 'medical-care', 'estelle-v-gamble', 'eighth-amendment', 'ada', 'deliberate-indifference'],
 true, 0, 0),

-- ============================================================
-- ORGANIZING AND MOVEMENT BUILDING
-- ============================================================

('Building Power: A Handbook for Community Organizers',
 'Comprehensive organizing manual covering: base-building, power mapping, constituency development, running effective meetings, conflict resolution, campaign strategy, and coalition building. Based on decades of labor and civil rights organizing experience.',
 'pdf', 'Organizing & Activism',
 NULL, NULL, 'https://www.trainingforchange.org/resources',
 'Training for Change', 'Training for Change', 'en',
 ARRAY['organizing', 'community-power', 'coalition-building', 'campaign-strategy', 'activism', 'social-movement'],
 true, 0, 0),

('Non-Violent Direct Action Training Manual',
 'Full NVDA training curriculum covering: the theory of nonviolent resistance, affinity groups, roles in direct action (spotter, legal observer, support), deescalation, consensus decision-making, police liaison protocols, and post-action debriefs.',
 'pdf', 'Organizing & Activism',
 NULL, NULL, 'https://ruckus.org/training-materials',
 'Ruckus Society', 'Ruckus Society', 'en',
 ARRAY['nvda', 'direct-action', 'nonviolent-resistance', 'affinity-groups', 'deescalation', 'protest-training'],
 true, 0, 0),

('Healing Justice: Sustaining Activists for the Long Haul',
 'Resources on preventing activist burnout, trauma-informed organizing practices, building sustainable movements, collective care, and integrating mental health support into organizing work. Includes practical exercises and organizational assessment tools.',
 'pdf', 'Mental Health & Wellness',
 NULL, NULL, 'https://healingjustice.org/resources',
 'Healing Justice Project', 'Healing Justice Project', 'en',
 ARRAY['healing-justice', 'burnout', 'self-care', 'trauma-informed', 'mental-health', 'sustainable-activism', 'collective-care'],
 true, 0, 0),

('Security Culture for Activists',
 'Operational security guide for organizers covering: information security, social media hygiene, digital security, secure communications, infiltration awareness, informants and COINTELPRO tactics, and maintaining security culture without paranoia.',
 'pdf', 'Digital Security',
 NULL, NULL, 'https://crimethinc.com/tools/security-culture',
 'CrimethInc', 'CrimethInc', 'en',
 ARRAY['security-culture', 'opsec', 'informants', 'cointelpro', 'activist-security', 'digital-security'],
 true, 0, 0),

-- ============================================================
-- LEGAL SELF-REPRESENTATION
-- ============================================================

('Pro Se Litigation Guide: Representing Yourself in Federal Court',
 'Practical guide to filing and arguing federal civil rights cases without a lawyer. Covers: complaint drafting, service of process, discovery procedures, motions practice, summary judgment, and trial procedures. Includes templates for common civil rights claims.',
 'pdf', 'Legal Resources',
 NULL, NULL, 'https://www.uscourts.gov/services-forms/representing-yourself',
 'US Courts', 'US Federal Judiciary', 'en',
 ARRAY['pro-se', 'self-representation', 'federal-court', 'civil-rights-lawsuit', '1983', 'complaint-drafting'],
 true, 0, 0),

('Filing a Civil Rights Complaint with the Department of Justice',
 'Step-by-step instructions for filing civil rights complaints with DOJ Civil Rights Division, including: how to submit complaints online, what information to include, how complaints are investigated, and your rights during the process.',
 'pdf', 'Legal Resources',
 NULL, NULL, 'https://civilrights.justice.gov',
 'US Department of Justice', 'DOJ Civil Rights Division', 'en',
 ARRAY['doj', 'civil-rights-complaint', 'department-of-justice', 'discrimination', 'federal-complaint'],
 true, 0, 0),

('How to File an ADA Complaint',
 'Comprehensive guide to filing complaints under the Americans with Disabilities Act with the Equal Employment Opportunity Commission (EEOC) for employment discrimination, and with the DOJ for public accommodations, state/local government services, and transportation.',
 'pdf', 'Disability Rights',
 NULL, NULL, 'https://www.ada.gov/file-a-complaint',
 'ADA National Network', 'ADA.gov', 'en',
 ARRAY['ada', 'disability-rights', 'eeoc', 'doj', 'complaint', 'discrimination', 'accessibility'],
 true, 0, 0),

-- ============================================================
-- CIVIL RIGHTS HISTORY
-- ============================================================

('The History of COINTELPRO: FBI Surveillance of Civil Rights Leaders',
 'Documented history of the FBI''s COINTELPRO program (1956-1971), which surveilled, infiltrated, and disrupted civil rights organizations including the NAACP, SCLC, SNCC, Black Panther Party, and American Indian Movement. Based on declassified FBI documents.',
 'pdf', 'Civil Rights History',
 NULL, NULL, 'https://www.fbi.gov/history/famous-cases/cointelpro',
 'Church Committee Investigation', 'National Archives', 'en',
 ARRAY['cointelpro', 'fbi-surveillance', 'civil-rights-history', 'black-panther', 'mlk', 'church-committee'],
 true, 0, 0),

('Timeline of Civil Rights Legislation in America: 1865-2026',
 'Comprehensive timeline from the 13th Amendment through the Civil Rights Act of 1964, Voting Rights Act of 1965, Fair Housing Act of 1968, Americans with Disabilities Act (1990), Matthew Shepard Act (2009), and ongoing legislative developments through 2026.',
 'pdf', 'Civil Rights History',
 NULL, NULL, 'https://www.civilrights.org/timeline',
 'Leadership Conference on Civil and Human Rights', 'Leadership Conference', 'en',
 ARRAY['civil-rights-history', 'legislation', 'timeline', '13th-amendment', 'civil-rights-act', 'voting-rights-act'],
 true, 0, 0),

('Reconstruction and Its Betrayal: The Legal History of Jim Crow',
 'Historical analysis of how the 14th Amendment''s equal protection guarantees were systematically undermined through Plessy v. Ferguson (1896), disenfranchisement laws, and the failure of Reconstruction — and the parallels with present-day rollbacks.',
 'pdf', 'Civil Rights History',
 NULL, NULL, 'https://eji.org/reports/reconstruction-in-america',
 'Equal Justice Initiative', 'Equal Justice Initiative', 'en',
 ARRAY['jim-crow', 'reconstruction', 'plessy-v-ferguson', '14th-amendment', 'equal-protection', 'segregation'],
 true, 0, 0),

-- ============================================================
-- MEDIA AND JOURNALISM
-- ============================================================

('Journalist Legal Defense Handbook: Know Your Rights in the Field',
 'Comprehensive legal guide for journalists on: First Amendment protections, shield laws by state, press credentials and access rights, recording law by state, protecting sources, responding to subpoenas, newsroom searches, and covering protests safely.',
 'pdf', 'Press Freedom',
 NULL, NULL, 'https://rcfp.org/resources/handbook-on-law-journalism',
 'Reporters Committee for Freedom of the Press', 'RCFP', 'en',
 ARRAY['journalist-rights', 'press-freedom', 'shield-laws', 'first-amendment', 'sources-protection', 'subpoenas'],
 true, 0, 0),

('Citizen Journalism: Legal Rights and Responsibilities',
 'Legal guide for non-professional journalists and video activists on: when you are and aren''t considered press, recording rights, copyright when posting footage online, libel risk, and how platforms respond to police requests to remove content.',
 'pdf', 'Press Freedom',
 NULL, NULL, 'https://rcfp.org/resources/citizen-journalism',
 'Reporters Committee for Freedom of the Press', 'RCFP', 'en',
 ARRAY['citizen-journalism', 'recording-rights', 'copyright', 'platform-liability', 'press-freedom', 'video-activism'],
 true, 0, 0),

-- ============================================================
-- ELECTION AND VOTING RIGHTS (2026 UPDATE)
-- ============================================================

('Voter Suppression Tactics: A 2026 Guide to Recognizing and Reporting',
 'Current guide to documented voter suppression tactics — voter purges, polling place closures, ID laws, misinformation, intimidation — and how to report violations to the DOJ Voting Section, state election officials, and nonpartisan monitoring organizations.',
 'pdf', 'Voting Rights',
 NULL, NULL, 'https://www.protectthevote.net/resources',
 'Election Protection Coalition', 'Election Protection', 'en',
 ARRAY['voter-suppression', 'voting-rights', 'voter-purge', 'voter-id', 'intimidation', 'vra', 'reporting'],
 true, 0, 0),

('Restoring Voting Rights After a Conviction: A State-by-State Guide',
 'State-by-state guide to when and how formerly incarcerated people can restore their voting rights. Covers waiting periods, parole/probation restrictions, application procedures, and automatic restoration states. Updated to reflect 2025-2026 legislative changes.',
 'pdf', 'Voting Rights',
 NULL, NULL, 'https://www.sentencingproject.org/publications/voting-rights-incarcerated-people',
 'The Sentencing Project', 'Sentencing Project', 'en',
 ARRAY['voting-rights', 'felon-disenfranchisement', 'reentry', 'rights-restoration', 'voting-while-incarcerated'],
 true, 0, 0),

-- ============================================================
-- POLICE ACCOUNTABILITY (NEW ADDITIONS)
-- ============================================================

('How to File an Effective Police Misconduct Complaint',
 'Step-by-step guide to filing police misconduct complaints including: choosing the right body (internal affairs, civilian review board, state AG, DOJ), what information to gather, how to get a lawyer involved, the FOIA process for officer records, and what to expect after filing.',
 'pdf', 'Police Accountability',
 NULL, NULL, 'https://www.aclu.org/know-your-rights/police-misconduct',
 'American Civil Liberties Union', 'ACLU', 'en',
 ARRAY['police-misconduct', 'complaint-process', 'internal-affairs', 'civilian-review', 'accountability', 'doj'],
 true, 0, 0),

('Pattern-or-Practice Investigations: What They Are and How to Trigger One',
 'Explanation of DOJ Civil Rights Division pattern-or-practice investigations (42 U.S.C. § 14141 / 34 U.S.C. § 12601), when they''re triggered, what they found in cities like Ferguson, Baltimore, and Chicago, and how communities can request an investigation.',
 'pdf', 'Police Accountability',
 NULL, NULL, 'https://www.justice.gov/crt/police-misconduct-investigations',
 'DOJ Civil Rights Division', 'US Department of Justice', 'en',
 ARRAY['pattern-or-practice', 'doj-investigation', 'police-reform', '34-usc-12601', 'consent-decree', 'accountability'],
 true, 0, 0),

('Community Control Over Police: Models and Case Studies',
 'Analysis of different models of community oversight — civilian review boards (advisory vs. investigative), police commissions with hiring/firing authority, community control models, and participatory budgeting applied to police. Case studies from Los Angeles, Minneapolis, Denver, and Camden NJ.',
 'pdf', 'Police Accountability',
 NULL, NULL, 'https://communitycontrol.org/resources',
 'Coalition for Community Control Over Police', 'CCOP', 'en',
 ARRAY['civilian-oversight', 'police-accountability', 'community-control', 'civilian-review-board', 'police-commission', 'camden', 'minneapolis'],
 true, 0, 0)

ON CONFLICT DO NOTHING;
