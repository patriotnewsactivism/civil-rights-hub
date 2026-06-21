-- Expand resource library with verified civil rights resources
-- Covers: immigration rights, disability rights, press freedom, housing rights,
--         digital security, LGBTQ+ rights, worker rights, voting rights,
--         police accountability, mental health for organizers, criminal justice

INSERT INTO public.resource_library (
  title, description, resource_type, category,
  file_url, file_size, external_url,
  author, source, language,
  tags, is_approved, download_count, view_count
) VALUES

-- ============================================================
-- IMMIGRATION RIGHTS
-- ============================================================

('Know Your Rights If ICE Comes to Your Door',
 'Step-by-step guide in English and Spanish on what to do if ICE agents come to your home. Covers the difference between judicial and administrative warrants, your right to remain silent, and family emergency planning.',
 'pdf', 'Immigration Rights',
 NULL, NULL, 'https://www.aclu.org/know-your-rights/immigrants-rights',
 'American Civil Liberties Union', 'ACLU', 'en',
 ARRAY['immigration-rights', 'ice', 'know-your-rights', 'fifth-amendment', 'deportation'],
 true, 0, 0),

('DACA: Legal Rights and Practical Guidance (2025 Update)',
 'Comprehensive guide to DACA eligibility, renewal procedures, employment authorization, travel advisories, and how to respond if your DACA status is questioned by law enforcement.',
 'pdf', 'Immigration Rights',
 NULL, NULL, 'https://www.nilc.org/issues/daca',
 'National Immigration Law Center', 'NILC', 'en',
 ARRAY['daca', 'immigration-rights', 'employment', 'know-your-rights'],
 true, 0, 0),

('Bilingual Know Your Rights Card — Immigration (English/Spanish)',
 'Printable wallet-sized Know Your Rights card for immigrants in English and Spanish. Covers the right to remain silent, right to an attorney, and how to respond to ICE.',
 'pdf', 'Immigration Rights',
 NULL, NULL, 'https://www.unitedwedream.org/resources/know-your-rights-card',
 'United We Dream', 'United We Dream', 'en',
 ARRAY['immigration-rights', 'ice', 'bilingual', 'printable', 'know-your-rights'],
 true, 0, 0),

('Legal Rights for Asylum Seekers at the Border',
 'Guide to the asylum process, credible fear interviews, the right to counsel, conditions of detention, and how to contact immigration legal aid from detention.',
 'pdf', 'Immigration Rights',
 NULL, NULL, 'https://www.raicestexas.org/resources',
 'RAICES', 'RAICES', 'en',
 ARRAY['asylum', 'immigration-rights', 'detention', 'border', 'legal-aid'],
 true, 0, 0),

-- ============================================================
-- DISABILITY RIGHTS
-- ============================================================

('Americans with Disabilities Act — A Guide to Your Rights',
 'Plain-language overview of ADA Title I (employment), Title II (state and local government), and Title III (public accommodations). Covers how to file a complaint with the EEOC or DOJ.',
 'pdf', 'Disability Rights',
 NULL, NULL, 'https://www.ada.gov/resources/disability-rights-guide',
 'U.S. Department of Justice Civil Rights Division', 'ADA.gov', 'en',
 ARRAY['disability-rights', 'ada', 'employment', 'accommodation', 'discrimination'],
 true, 0, 0),

('Voting with a Disability: Know Your Rights at the Polls',
 'Guide to voting rights for people with disabilities, including accessible polling place requirements, the right to assistance, absentee voting, and how to report accessibility violations.',
 'pdf', 'Disability Rights',
 NULL, NULL, 'https://dredf.org/voting-rights',
 'Disability Rights Education & Defense Fund', 'DREDF', 'en',
 ARRAY['disability-rights', 'voting-rights', 'ada', 'accessibility', 'polls'],
 true, 0, 0),

('Police Encounters and Disability: A Safety Guide',
 'Practical guidance for people with disabilities on interacting with law enforcement. Covers communication barriers, psychiatric disabilities, mobility disabilities, and de-escalation strategies.',
 'pdf', 'Disability Rights',
 NULL, NULL, 'https://www.disabilityrightsca.org/resources/police-encounters-disability',
 'Disability Rights California', 'Disability Rights California', 'en',
 ARRAY['disability-rights', 'police', 'know-your-rights', 'de-escalation', 'mental-health'],
 true, 0, 0),

-- ============================================================
-- PRESS FREEDOM & JOURNALIST SAFETY
-- ============================================================

('Journalist Security Guide — Digital and Physical Safety',
 'Comprehensive physical and digital security guide for journalists covering travel safety, source protection, encrypted communications, counter-surveillance, and legal rights when covering protests.',
 'pdf', 'Press Freedom',
 NULL, NULL, 'https://cpj.org/journalist-security-guide',
 'Committee to Protect Journalists', 'CPJ', 'en',
 ARRAY['press-freedom', 'journalist', 'digital-security', 'surveillance', 'source-protection'],
 true, 0, 0),

('U.S. Press Freedom Tracker: State-by-State Shield Laws',
 'Interactive guide to journalist shield laws in all 50 states. Covers which states protect source confidentiality, which shield laws have been tested in court, and gaps in federal shield law protection.',
 'link', 'Press Freedom',
 NULL, NULL, 'https://pressfreedomtracker.us/shield-law',
 'Freedom of the Press Foundation', 'Freedom of the Press Foundation', 'en',
 ARRAY['press-freedom', 'shield-law', 'journalism', 'first-amendment', 'sources'],
 true, 0, 0),

('Reporter''s Recording Rights by State',
 'State-by-state breakdown of one-party vs. all-party consent for recording conversations, how this affects journalists recording public officials, and recent case law affecting recording rights.',
 'link', 'Press Freedom',
 NULL, NULL, 'https://www.rcfp.org/reporters-recording-guide',
 'Reporters Committee for Freedom of the Press', 'RCFP', 'en',
 ARRAY['recording-rights', 'press-freedom', 'journalism', 'first-amendment', 'police'],
 true, 0, 0),

('Legal Guide for Student Journalists',
 'Free legal handbook covering First Amendment rights in school newspapers, yearbooks, and student media. Covers censorship, prior review, libel, privacy, and press access.',
 'pdf', 'Press Freedom',
 NULL, NULL, 'https://splc.org/legal-guide',
 'Student Press Law Center', 'SPLC', 'en',
 ARRAY['press-freedom', 'journalism', 'first-amendment', 'students', 'censorship'],
 true, 0, 0),

-- ============================================================
-- HOUSING RIGHTS
-- ============================================================

('Tenant Rights: The Eviction Process Explained',
 'Step-by-step guide to the eviction process in most states, from the notice to vacate through court hearings and the lockout. Explains what defenses tenants can raise and when to contact legal aid.',
 'pdf', 'Housing Rights',
 NULL, NULL, 'https://www.nhlp.org/resources/tenant-rights-eviction-guide',
 'National Housing Law Project', 'NHLP', 'en',
 ARRAY['housing-rights', 'eviction', 'tenants', 'legal-aid', 'due-process'],
 true, 0, 0),

('Fair Housing Act: Protections Against Discrimination',
 'Plain-language guide to the Fair Housing Act covering protected classes, prohibited actions, how to file a HUD complaint, and how to find a fair housing attorney.',
 'pdf', 'Housing Rights',
 NULL, NULL, 'https://www.hud.gov/sites/documents/FHEO_FHACT.PDF',
 'U.S. Department of Housing and Urban Development', 'HUD', 'en',
 ARRAY['housing-rights', 'discrimination', 'fair-housing', 'civil-rights', 'hud'],
 true, 0, 0),

('Emergency Rental Assistance — How to Apply by State',
 'Directory of emergency rental assistance programs by state with application links, income eligibility thresholds, and average processing times. Updated monthly.',
 'link', 'Housing Rights',
 NULL, NULL, 'https://nlihc.org/rental-assistance',
 'National Low Income Housing Coalition', 'NLIHC', 'en',
 ARRAY['housing-rights', 'rental-assistance', 'eviction', 'emergency', 'mutual-aid'],
 true, 0, 0),

-- ============================================================
-- DIGITAL SECURITY & SURVEILLANCE
-- ============================================================

('Security in a Box: Digital Security Tools for Activists',
 'Comprehensive guide to digital security tools including encrypted messaging (Signal), VPNs, secure email (ProtonMail), two-factor authentication, and safe file storage. Maintained by Frontline Defenders.',
 'link', 'Digital Safety',
 NULL, NULL, 'https://securityinabox.org',
 'Frontline Defenders & Tactical Tech', 'Security in a Box', 'en',
 ARRAY['digital-security', 'signal', 'vpn', 'encryption', 'surveillance'],
 true, 0, 0),

('What Data Your Phone Gives Police: A Practical Guide',
 'Explains what law enforcement can access from your phone: call logs, text messages, location history, cloud data, and social media. Covers what requires a warrant under Carpenter v. United States.',
 'pdf', 'Digital Safety',
 NULL, NULL, 'https://ssd.eff.org/module/things-to-consider-when-crossing-us-border',
 'Electronic Frontier Foundation', 'EFF Surveillance Self-Defense', 'en',
 ARRAY['digital-security', 'fourth-amendment', 'surveillance', 'phone', 'warrant'],
 true, 0, 0),

('IMSI Catchers (Stingrays): What They Are and How to Protect Yourself',
 'Explains how Stingray devices work, which jurisdictions require warrants for their use, and practical steps to reduce your exposure at protests (airplane mode, Signal, mesh messaging apps).',
 'pdf', 'Digital Safety',
 NULL, NULL, 'https://www.aclu.org/issues/privacy-technology/surveillance-technologies/stingray-tracking-devices',
 'ACLU', 'ACLU', 'en',
 ARRAY['surveillance', 'stingray', 'fourth-amendment', 'privacy', 'protest-rights'],
 true, 0, 0),

-- ============================================================
-- LGBTQ+ RIGHTS
-- ============================================================

('LGBTQ+ Know Your Rights: Employment and Housing',
 'Guide to federal and state protections for LGBTQ+ people in employment (Title VII under Bostock), housing (FHA), healthcare (Section 1557), and how to file discrimination complaints.',
 'pdf', 'LGBTQ+ Rights',
 NULL, NULL, 'https://www.lambdalegal.org/know-your-rights',
 'Lambda Legal', 'Lambda Legal', 'en',
 ARRAY['lgbtq-rights', 'discrimination', 'employment', 'housing-rights', 'civil-rights'],
 true, 0, 0),

('Transgender Rights: Name and Gender Marker Change Guide',
 'State-by-state guide to changing your name and gender marker on ID documents including driver''s license, passport, Social Security card, and birth certificate. Updated 2025.',
 'link', 'LGBTQ+ Rights',
 NULL, NULL, 'https://transequality.org/documents',
 'National Center for Transgender Equality', 'NCTE', 'en',
 ARRAY['lgbtq-rights', 'transgender', 'gender-identity', 'documentation', 'civil-rights'],
 true, 0, 0),

-- ============================================================
-- WORKER RIGHTS
-- ============================================================

('Workers'' Rights: NLRA and the Right to Organize',
 'Plain-language guide to the National Labor Relations Act, including the right to form a union, bargain collectively, engage in protected concerted activity, and file an unfair labor practice charge.',
 'pdf', 'Workers Rights',
 NULL, NULL, 'https://www.nlrb.gov/rights-we-protect/rights/employee-rights',
 'National Labor Relations Board', 'NLRB', 'en',
 ARRAY['workers-rights', 'union', 'nlra', 'organizing', 'civil-rights'],
 true, 0, 0),

('Whistleblower Protections: Your Rights Under Federal Law',
 'Overview of federal whistleblower protections including the False Claims Act, OSHA retaliation protections, IRS whistleblower program, SEC whistleblower rules, and how to contact a whistleblower attorney.',
 'pdf', 'Workers Rights',
 NULL, NULL, 'https://whistleblower.gov/resources',
 'Government Accountability Project', 'Government Accountability Project', 'en',
 ARRAY['whistleblower', 'workers-rights', 'retaliation', 'first-amendment', 'civil-rights'],
 true, 0, 0),

-- ============================================================
-- VOTING RIGHTS
-- ============================================================

('Voter ID Laws by State: What You Need to Vote in 2026',
 'State-by-state breakdown of voter ID requirements for the 2026 midterm elections. Covers strict photo ID states, non-strict ID states, and states with no ID requirement. Includes free ID resources.',
 'link', 'Voting Rights',
 NULL, NULL, 'https://www.ncsl.org/elections-and-campaigns/voter-id',
 'National Conference of State Legislatures', 'NCSL', 'en',
 ARRAY['voting-rights', 'voter-id', 'elections', 'voter-suppression', 'civil-rights'],
 true, 0, 0),

('What to Do If Your Vote Is Challenged at the Polls',
 'Know your rights if a poll worker or challenger questions your eligibility. Covers provisional ballots, how to appeal a rejected ballot, and the Election Protection hotline (1-866-OUR-VOTE).',
 'pdf', 'Voting Rights',
 NULL, NULL, 'https://866ourvote.org',
 'Lawyers Committee for Civil Rights Under Law', 'Lawyers Committee', 'en',
 ARRAY['voting-rights', 'voter-suppression', 'provisional-ballot', 'elections', 'know-your-rights'],
 true, 0, 0),

('Restoration of Voting Rights After a Felony Conviction',
 'State-by-state guide to felon disenfranchisement laws and the process for restoring voting rights. Covers automatic restoration, petition processes, and the 17 states where rights are restored after release.',
 'link', 'Voting Rights',
 NULL, NULL, 'https://www.sentencingproject.org/research/felony-disenfranchisement',
 'The Sentencing Project', 'The Sentencing Project', 'en',
 ARRAY['voting-rights', 'felony-disenfranchisement', 'reentry', 'prison-reform', 'civil-rights'],
 true, 0, 0),

-- ============================================================
-- POLICE ACCOUNTABILITY
-- ============================================================

('Citizen''s Guide to Civilian Complaint Review Boards',
 'How to file a misconduct complaint with your city''s civilian oversight board, what to document, how to get your case number, and what to expect during the review process. Covers 20 major city boards.',
 'pdf', 'Police Accountability',
 NULL, NULL, 'https://www.nacole.org/resources',
 'National Association for Civilian Oversight of Law Enforcement', 'NACOLE', 'en',
 ARRAY['police-accountability', 'misconduct', 'complaint', 'transparency', 'civilian-oversight'],
 true, 0, 0),

('Body Camera Footage: How to Request and Use It',
 'Guide to requesting body camera footage from local police departments under state public records laws. Covers what agencies must release, common exemptions, how to appeal denials, and how to authenticate footage for court.',
 'pdf', 'Police Accountability',
 NULL, NULL, 'https://www.vera.org/publications/body-camera-footage-guide',
 'Vera Institute of Justice', 'Vera Institute', 'en',
 ARRAY['bodycam', 'foia', 'public-records', 'police-accountability', 'transparency'],
 true, 0, 0),

('How to Read a Police Use-of-Force Report',
 'Explainer on what use-of-force reports contain, how to obtain them via FOIA, how to interpret common terms (force matrix, continuum, de-escalation failure), and what to look for when comparing against body camera footage.',
 'pdf', 'Police Accountability',
 NULL, NULL, 'https://policingproject.org/resources',
 'The Policing Project at NYU School of Law', 'Policing Project', 'en',
 ARRAY['police-accountability', 'use-of-force', 'foia', 'transparency', 'bodycam'],
 true, 0, 0),

-- ============================================================
-- MENTAL HEALTH & WELLNESS FOR ORGANIZERS
-- ============================================================

('Healing Justice Toolkit for Movement Organizers',
 'Practices, rituals, and resources for sustaining organizers through the long haul. Covers vicarious trauma, activist burnout, boundaries, grief, joy, and building community care cultures.',
 'pdf', 'Wellness & Healing',
 NULL, NULL, 'https://buildingmovement.org/resources/healing-justice-toolkit',
 'Building Movement Project', 'Building Movement Project', 'en',
 ARRAY['mental-health', 'healing-justice', 'organizers', 'community-organizing', 'wellness'],
 true, 0, 0),

-- ============================================================
-- CRIMINAL JUSTICE & INCARCERATION
-- ============================================================

('Rights of Incarcerated People: A Legal Primer',
 'Overview of constitutional rights retained after conviction, including Eighth Amendment protection from cruel and unusual punishment, First Amendment rights in prison, access to courts, and the Prison Litigation Reform Act.',
 'pdf', 'Criminal Justice',
 NULL, NULL, 'https://www.prisonpolicy.org/resources',
 'Prison Policy Initiative', 'Prison Policy Initiative', 'en',
 ARRAY['prison-reform', 'incarceration', 'eighth-amendment', 'civil-rights', 'criminal-justice'],
 true, 0, 0),

('Solitary Confinement: The Legal Challenge and Your Rights',
 'Guide to challenging solitary confinement under the Eighth Amendment, Fourteenth Amendment due process, and the ADA. Covers how to file a civil rights complaint and find legal representation.',
 'pdf', 'Criminal Justice',
 NULL, NULL, 'https://www.aclu.org/issues/prisoners-rights/solitary-confinement',
 'ACLU National Prison Project', 'ACLU', 'en',
 ARRAY['prison-reform', 'solitary-confinement', 'eighth-amendment', 'disability-rights', 'civil-rights'],
 true, 0, 0)

ON CONFLICT DO NOTHING;
