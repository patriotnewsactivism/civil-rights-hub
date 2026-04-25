-- =============================================================================
-- Migration: Expand Federal Laws & Key Supreme Court Precedents
-- Adds landmark cases and additional federal statutes critical for civil rights
-- =============================================================================

-- Additional Federal Civil Rights Statutes
INSERT INTO public.federal_laws (
  title, short_name, category, statute_citation, year_enacted,
  summary, key_provisions, protected_classes,
  enforcing_agency, enforcement_details, amendments, related_laws, external_links
) VALUES

-- FIRST AMENDMENT PROTECTIONS
(
  'First Amendment to the U.S. Constitution',
  'First Amendment',
  'Constitutional Rights',
  'U.S. Const. amend. I',
  1791,
  'Prohibits Congress from making any law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.',
  ARRAY[
    'Free Speech: Government cannot restrict expression based on content or viewpoint',
    'Free Press: Journalists and citizens have the right to report on government activities',
    'Right to Record: Courts have recognized the right to record police in public (Glik v. Cunniffe)',
    'Right to Assemble: Peaceful protest on public property is constitutionally protected',
    'Right to Petition: Citizens can seek government action without retaliation'
  ],
  ARRAY['all persons', 'press', 'journalists', 'protesters', 'religious groups'],
  'DOJ Civil Rights Division',
  'Violations actionable under 42 U.S.C. § 1983 (state actors) and Bivens actions (federal actors). Criminal violations under 18 U.S.C. § 242.',
  'Incorporated against states via 14th Amendment (Gitlow v. New York, 1925)',
  ARRAY['Section 1983', 'Section 242', 'FOIA'],
  '{"constitution": "https://constitution.congress.gov/browse/amendment-1/", "crs_report": "https://crsreports.congress.gov"}'::jsonb
),

-- FOURTH AMENDMENT
(
  'Fourth Amendment to the U.S. Constitution',
  'Fourth Amendment',
  'Constitutional Rights',
  'U.S. Const. amend. IV',
  1791,
  'Protects against unreasonable searches and seizures. Requires warrants to be judicially sanctioned and supported by probable cause.',
  ARRAY[
    'Warrant Requirement: Searches generally require a warrant based on probable cause',
    'Exclusionary Rule: Evidence obtained in violation of the 4th Amendment is inadmissible (Mapp v. Ohio)',
    'Stop and Frisk: Limited pat-down allowed only with reasonable suspicion (Terry v. Ohio)',
    'Vehicle Searches: Automobile exception allows warrantless searches with probable cause',
    'Cell Phone Privacy: Warrant required to search cell phones (Riley v. California, 2014)',
    'Digital Privacy: Warrant required for cell-site location data (Carpenter v. United States, 2018)'
  ],
  ARRAY['all persons', 'criminal suspects', 'drivers', 'homeowners'],
  'DOJ Civil Rights Division',
  'Violations actionable under § 1983. Evidence suppressed under exclusionary rule. Officers may face civil liability.',
  'Incorporated against states via 14th Amendment (Mapp v. Ohio, 1961)',
  ARRAY['Section 1983', 'Privacy Act', 'Electronic Communications Privacy Act'],
  '{"constitution": "https://constitution.congress.gov/browse/amendment-4/"}'::jsonb
),

-- FIFTH AMENDMENT
(
  'Fifth Amendment to the U.S. Constitution',
  'Fifth Amendment',
  'Constitutional Rights',
  'U.S. Const. amend. V',
  1791,
  'Protects against self-incrimination, double jeopardy, and deprivation of life, liberty, or property without due process of law.',
  ARRAY[
    'Right to Silence: No person shall be compelled to be a witness against themselves',
    'Miranda Rights: Must be informed of rights before custodial interrogation (Miranda v. Arizona)',
    'Due Process: Government cannot deprive any person of life, liberty, or property without due process',
    'Double Jeopardy: Cannot be tried twice for the same offense',
    'Grand Jury: Felony charges require grand jury indictment in federal cases'
  ],
  ARRAY['all persons', 'criminal suspects', 'detainees'],
  'DOJ',
  'Miranda violations result in suppression of statements. Due process violations actionable under § 1983.',
  'Miranda requirements established 1966. Berghuis v. Thompkins (2010) clarified invocation must be unambiguous.',
  ARRAY['Section 1983', 'Sixth Amendment', 'Fourteenth Amendment'],
  '{"constitution": "https://constitution.congress.gov/browse/amendment-5/"}'::jsonb
),

-- FOURTEENTH AMENDMENT
(
  'Fourteenth Amendment to the U.S. Constitution',
  'Fourteenth Amendment',
  'Constitutional Rights',
  'U.S. Const. amend. XIV',
  1868,
  'Guarantees equal protection under the law and due process rights against state governments. The most litigated amendment in civil rights history.',
  ARRAY[
    'Equal Protection Clause: No state shall deny any person equal protection of the laws',
    'Due Process Clause: No state shall deprive any person of life, liberty, or property without due process',
    'Incorporation Doctrine: Applies Bill of Rights protections to state governments',
    'Substantive Due Process: Protects fundamental rights from government interference',
    'State Action Doctrine: Applies only to government actors, not private parties'
  ],
  ARRAY['all persons', 'racial minorities', 'women', 'immigrants', 'LGBTQ+ individuals'],
  'DOJ Civil Rights Division',
  'Foundation for nearly all civil rights litigation against state and local governments. Enforced through § 1983 lawsuits.',
  'Ratified during Reconstruction. Interpreted broadly in Brown v. Board of Education (1954), Loving v. Virginia (1967), Obergefell v. Hodges (2015).',
  ARRAY['Section 1983', 'Civil Rights Act of 1964', 'Voting Rights Act'],
  '{"constitution": "https://constitution.congress.gov/browse/amendment-14/"}'::jsonb
),

-- ELECTRONIC COMMUNICATIONS PRIVACY ACT
(
  'Electronic Communications Privacy Act of 1986',
  'ECPA',
  'Privacy',
  '18 U.S.C. §§ 2510-2522, 2701-2712',
  1986,
  'Extends government restrictions on wiretaps to include electronic data transmissions. Protects wire, oral, and electronic communications while in transit and in storage.',
  ARRAY[
    'Title I (Wiretap Act): Prohibits intentional interception of wire, oral, or electronic communications',
    'Title II (Stored Communications Act): Protects communications held in electronic storage',
    'Title III (Pen Register Act): Regulates collection of non-content communications metadata',
    'Requires warrants for most real-time interception',
    'Private right of action for violations with statutory damages'
  ],
  ARRAY['all persons', 'email users', 'phone users', 'internet users'],
  'DOJ',
  'Criminal penalties up to 5 years imprisonment. Civil damages of $10,000 per violation minimum. Private right of action available.',
  'Amended by USA PATRIOT Act (2001), FISA Amendments Act (2008). Carpenter v. United States (2018) strengthened warrant requirements for location data.',
  ARRAY['Fourth Amendment', 'Privacy Act', 'FOIA'],
  '{"statute": "https://www.law.cornell.edu/uscode/text/18/part-I/chapter-119"}'::jsonb
),

-- RELIGIOUS FREEDOM RESTORATION ACT
(
  'Religious Freedom Restoration Act of 1993',
  'RFRA',
  'Religious Liberty',
  '42 U.S.C. §§ 2000bb through 2000bb-4',
  1993,
  'Prohibits the federal government from substantially burdening a person''s exercise of religion unless it demonstrates a compelling governmental interest and uses the least restrictive means.',
  ARRAY[
    'Strict Scrutiny: Government must show compelling interest to burden religious exercise',
    'Least Restrictive Means: Government must use the least restrictive method available',
    'Applies to all federal law and its implementation',
    'Does not apply to state/local government after City of Boerne v. Flores (1997)'
  ],
  ARRAY['all persons', 'religious individuals', 'religious organizations'],
  'DOJ',
  'Available as a defense or affirmative claim in federal cases. Many states have enacted their own RFRA statutes.',
  'Passed unanimously by House, 97-3 in Senate. City of Boerne v. Flores (1997) limited to federal actions. Hobby Lobby (2014) extended to closely held corporations.',
  ARRAY['First Amendment', 'Religious Land Use and Institutionalized Persons Act'],
  '{"statute": "https://www.law.cornell.edu/uscode/text/42/chapter-21B"}'::jsonb
),

-- POLICE ACCOUNTABILITY - PATTERN OR PRACTICE
(
  'Violent Crime Control and Law Enforcement Act of 1994 - Section 14141',
  'Pattern or Practice',
  'Police Accountability',
  '34 U.S.C. § 12601 (formerly 42 U.S.C. § 14141)',
  1994,
  'Authorizes the Department of Justice to investigate and bring civil actions against law enforcement agencies engaged in a pattern or practice of conduct that deprives persons of constitutional rights.',
  ARRAY[
    'DOJ can investigate police departments for systemic civil rights violations',
    'Can seek consent decrees requiring reforms',
    'Covers excessive force, false arrests, discriminatory policing',
    'Has been used against 70+ law enforcement agencies',
    'Consent decrees may require independent monitors'
  ],
  ARRAY['all persons', 'racial minorities', 'communities subject to over-policing'],
  'DOJ Civil Rights Division, Special Litigation Section',
  'DOJ initiates investigations based on complaints, news reports, or referrals. Can negotiate consent decrees or file lawsuits.',
  NULL,
  ARRAY['Section 1983', 'Fourth Amendment', 'Fourteenth Amendment'],
  '{"doj_page": "https://www.justice.gov/crt/special-litigation-section"}'::jsonb
),

-- WHISTLEBLOWER PROTECTION
(
  'Whistleblower Protection Act of 1989',
  'WPA',
  'Government Accountability',
  '5 U.S.C. § 2302(b)(8)',
  1989,
  'Protects federal employees who disclose evidence of waste, fraud, abuse, or threats to public health and safety from retaliation.',
  ARRAY[
    'Protects disclosures of illegality, gross mismanagement, waste of funds',
    'Protects disclosures of abuse of authority or substantial danger to public health/safety',
    'Prohibits retaliation including termination, demotion, or harassment',
    'Complaints filed with Office of Special Counsel',
    'Whistleblower Protection Enhancement Act (2012) strengthened protections'
  ],
  ARRAY['federal employees', 'government contractors', 'whistleblowers'],
  'Office of Special Counsel (OSC)',
  'File complaint with OSC within 3 years. OSC can seek corrective action from Merit Systems Protection Board. Individual right of action if OSC declines.',
  'Enhanced by WPEA (2012) to cover scientific censorship and clarify protected disclosures.',
  ARRAY['False Claims Act (qui tam)', 'Inspector General Act', 'First Amendment'],
  '{"osc": "https://osc.gov/Pages/whistleblower.aspx"}'::jsonb
),

-- FALSE CLAIMS ACT
(
  'False Claims Act (Lincoln Law)',
  'FCA / Qui Tam',
  'Government Accountability',
  '31 U.S.C. §§ 3729-3733',
  1863,
  'Allows private citizens (relators) to file lawsuits on behalf of the federal government against entities that have defrauded the government. Whistleblowers receive 15-30% of recovered funds.',
  ARRAY[
    'Qui Tam Provision: Private citizens can file suits on behalf of the government',
    'Whistleblower Reward: Relators receive 15-30% of recovered funds',
    'Anti-Retaliation: Protects employees who file qui tam actions from employer retaliation',
    'Treble Damages: Violators pay triple the government''s damages plus penalties per false claim',
    'Most successful fraud-fighting tool — recovered $70+ billion since 1986 amendments'
  ],
  ARRAY['whistleblowers', 'government contractors', 'healthcare workers'],
  'DOJ Civil Division',
  'File under seal with DOJ. Government has 60 days (often extended) to decide whether to intervene. Relator can proceed even if government declines.',
  'Originally enacted 1863 during Civil War. Major amendments in 1986, 2009 (FERA), and 2010 (ACA).',
  ARRAY['Whistleblower Protection Act', 'Inspector General Act'],
  '{"doj": "https://www.justice.gov/civil/fraud-statistics"}'::jsonb
),

-- PRISONERS' RIGHTS
(
  'Prison Litigation Reform Act of 1995',
  'PLRA',
  'Prisoner Rights',
  '42 U.S.C. § 1997e',
  1995,
  'Requires prisoners to exhaust administrative remedies before filing federal lawsuits. Creates barriers to prisoner civil rights litigation but does not eliminate the right to sue.',
  ARRAY[
    'Exhaustion Requirement: Must complete prison grievance process before filing suit',
    'Three Strikes Rule: Bars filing fee waivers after three frivolous dismissals',
    'Physical Injury Requirement: No mental/emotional damages without physical injury for some claims',
    'Attorney Fee Limits: Caps attorney fees in prisoner cases',
    'Does NOT bar constitutional claims — only adds procedural requirements'
  ],
  ARRAY['prisoners', 'detainees', 'incarcerated persons'],
  'Federal courts',
  'File grievance through prison administrative system first. Document every step. Keep copies of all grievances and responses. File § 1983 suit after exhausting remedies.',
  NULL,
  ARRAY['Section 1983', 'Eighth Amendment', 'Civil Rights of Institutionalized Persons Act'],
  '{"statute": "https://www.law.cornell.edu/uscode/text/42/1997e"}'::jsonb
)

ON CONFLICT DO NOTHING;

-- ============================================================================
-- KEY SUPREME COURT PRECEDENTS (stored as federal_laws with category 'Supreme Court Precedent')
-- These are the cases every citizen should know
-- ============================================================================

INSERT INTO public.federal_laws (
  title, short_name, category, statute_citation, year_enacted,
  summary, key_provisions, protected_classes,
  enforcing_agency, enforcement_details, related_laws, external_links
) VALUES

(
  'Glik v. Cunniffe (2011) — Right to Record Police',
  'Glik v. Cunniffe',
  'Supreme Court Precedent',
  '655 F.3d 78 (1st Cir. 2011)',
  2011,
  'First Circuit held that recording police officers performing duties in public is protected by the First Amendment. Landmark case establishing the right to film police.',
  ARRAY[
    'Recording police in public is a clearly established First Amendment right',
    'Officers who arrest or retaliate against people for recording can be held liable under § 1983',
    'Qualified immunity does not protect officers who violate this right',
    'Applies to all recording devices including smartphones',
    'Cited by multiple circuits as persuasive authority'
  ],
  ARRAY['all persons', 'journalists', 'bystanders', 'First Amendment auditors'],
  'Federal courts',
  'If arrested for recording police in public, cite this case. File § 1983 lawsuit for damages. Contact ACLU or Reporters Committee for Freedom of the Press.',
  ARRAY['First Amendment', 'Section 1983'],
  '{"case": "https://caselaw.findlaw.com/court/us-1st-circuit/1577193.html"}'::jsonb
),

(
  'Terry v. Ohio (1968) — Stop and Frisk Standards',
  'Terry v. Ohio',
  'Supreme Court Precedent',
  '392 U.S. 1 (1968)',
  1968,
  'Supreme Court held that police may briefly stop and frisk a person if they have reasonable articulable suspicion of criminal activity. Established the "Terry stop" standard.',
  ARRAY[
    'Officers need reasonable articulable suspicion (not probable cause) for brief investigatory stops',
    'Pat-down limited to outer clothing for weapons only',
    'You have the right to ask: Am I free to go?',
    'You do NOT have to consent to a search beyond a pat-down',
    'Officer must be able to articulate specific facts justifying the stop',
    'A hunch is NOT enough — must be based on specific, articulable facts'
  ],
  ARRAY['all persons', 'pedestrians', 'criminal suspects'],
  'Federal and state courts',
  'If stopped: Ask "Am I being detained or am I free to go?" Do not consent to searches. State "I do not consent to a search." Remain calm and do not resist physically.',
  ARRAY['Fourth Amendment', 'Fourteenth Amendment'],
  '{"case": "https://supreme.justia.com/cases/federal/us/392/1/"}'::jsonb
),

(
  'Miranda v. Arizona (1966) — Right to Remain Silent',
  'Miranda v. Arizona',
  'Supreme Court Precedent',
  '384 U.S. 436 (1966)',
  1966,
  'Supreme Court held that detained criminal suspects must be informed of their Fifth Amendment right against self-incrimination and Sixth Amendment right to counsel before interrogation.',
  ARRAY[
    'Right to remain silent — anything you say can be used against you',
    'Right to an attorney — one will be appointed if you cannot afford one',
    'Rights must be read BEFORE custodial interrogation',
    'Waiver must be voluntary, knowing, and intelligent',
    'Statements obtained without Miranda warnings are inadmissible',
    'You can invoke Miranda at any time during questioning — interrogation must stop'
  ],
  ARRAY['all persons', 'criminal suspects', 'detainees'],
  'Federal and state courts',
  'If detained: Clearly state "I invoke my right to remain silent" and "I want a lawyer." Do not answer questions. Do not waive your rights.',
  ARRAY['Fifth Amendment', 'Sixth Amendment'],
  '{"case": "https://supreme.justia.com/cases/federal/us/384/436/"}'::jsonb
),

(
  'Riley v. California (2014) — Cell Phone Privacy',
  'Riley v. California',
  'Supreme Court Precedent',
  '573 U.S. 373 (2014)',
  2014,
  'Supreme Court unanimously held that police must obtain a warrant before searching the digital contents of a cell phone seized during an arrest. Major digital privacy protection.',
  ARRAY[
    'Police CANNOT search your phone without a warrant, even during a lawful arrest',
    'Applies to all digital content: texts, photos, emails, apps, browsing history',
    'Exception: Exigent circumstances (imminent destruction of evidence, threat to life)',
    'You do NOT have to unlock your phone for police',
    'You do NOT have to provide your passcode',
    'Biometric unlock (face/fingerprint) legal status varies by jurisdiction'
  ],
  ARRAY['all persons', 'phone users', 'digital privacy'],
  'Federal and state courts',
  'If police ask to search your phone: State "I do not consent to a search of my phone." If they search anyway, do not physically resist but note it for your attorney.',
  ARRAY['Fourth Amendment', 'ECPA', 'Carpenter v. United States'],
  '{"case": "https://supreme.justia.com/cases/federal/us/573/373/"}'::jsonb
),

(
  'Carpenter v. United States (2018) — Location Data Privacy',
  'Carpenter v. United States',
  'Supreme Court Precedent',
  '585 U.S. ___ (2018)',
  2018,
  'Supreme Court held that accessing historical cell-site location information (CSLI) constitutes a search under the Fourth Amendment and generally requires a warrant.',
  ARRAY[
    'Government needs a warrant to access cell phone location records',
    'Even though data is held by third parties (cell carriers), 4th Amendment applies',
    'Narrowed the "third-party doctrine" for digital records',
    'Seven days of CSLI data at issue — court declined to set minimum',
    'Major victory for digital privacy in the surveillance age'
  ],
  ARRAY['all persons', 'phone users', 'digital privacy'],
  'Federal and state courts',
  'If government is tracking your location: Challenge warrantless access to cell-site data citing this case. Request suppression of evidence obtained without a warrant.',
  ARRAY['Fourth Amendment', 'ECPA', 'Riley v. California'],
  '{"case": "https://supreme.justia.com/cases/federal/us/585/16-402/"}'::jsonb
),

(
  'Tinker v. Des Moines (1969) — Student Free Speech',
  'Tinker v. Des Moines',
  'Supreme Court Precedent',
  '393 U.S. 503 (1969)',
  1969,
  'Supreme Court held that students do not shed their constitutional rights at the schoolhouse gate. Schools cannot suppress student expression unless it substantially disrupts school operations.',
  ARRAY[
    'Students retain First Amendment rights in school',
    'Schools must show "substantial disruption" to restrict speech',
    'Passive, non-disruptive expression (armbands, shirts, etc.) is protected',
    'Schools cannot suppress speech simply because they disagree with the message',
    'Applies to all public schools K-12'
  ],
  ARRAY['students', 'minors', 'public school students'],
  'Federal courts',
  'If punished for protected speech in school: Document the expression and the school''s response. File complaint with school district. Contact ACLU or student rights organizations.',
  ARRAY['First Amendment', 'Fourteenth Amendment'],
  '{"case": "https://supreme.justia.com/cases/federal/us/393/503/"}'::jsonb
),

(
  'Mapp v. Ohio (1961) — Exclusionary Rule',
  'Mapp v. Ohio',
  'Supreme Court Precedent',
  '367 U.S. 643 (1961)',
  1961,
  'Supreme Court held that evidence obtained through an unreasonable search and seizure in violation of the Fourth Amendment is inadmissible in state court proceedings.',
  ARRAY[
    'Exclusionary Rule: Illegally obtained evidence cannot be used at trial',
    'Applies to both federal and state courts',
    'Fruit of the Poisonous Tree: Evidence derived from illegal evidence is also excluded',
    'Good Faith Exception: Evidence may be admissible if officers relied on a warrant later found invalid (Leon, 1984)',
    'Deterrence rationale: Rule exists to deter police misconduct'
  ],
  ARRAY['all persons', 'criminal defendants'],
  'Federal and state courts',
  'If evidence was obtained through an illegal search: File motion to suppress evidence. Challenge the legality of the search. Document everything about the encounter.',
  ARRAY['Fourth Amendment', 'Fourteenth Amendment'],
  '{"case": "https://supreme.justia.com/cases/federal/us/367/643/"}'::jsonb
),

(
  'Brandenburg v. Ohio (1969) — Limits on Speech Restrictions',
  'Brandenburg v. Ohio',
  'Supreme Court Precedent',
  '395 U.S. 444 (1969)',
  1969,
  'Supreme Court held that government cannot punish inflammatory speech unless it is directed to inciting imminent lawless action and is likely to produce such action.',
  ARRAY[
    'Speech can only be restricted if it incites IMMINENT lawless action',
    'The speech must be LIKELY to produce such action',
    'Mere advocacy of illegal action is protected',
    'Replaced the "clear and present danger" test',
    'Critical protection for protest speech and political advocacy'
  ],
  ARRAY['all persons', 'protesters', 'political speakers'],
  'Federal and state courts',
  'If charged with incitement during a protest: The prosecution must prove your speech was directed at producing imminent lawless action AND was likely to succeed. Mere advocacy is protected.',
  ARRAY['First Amendment', 'Section 1983'],
  '{"case": "https://supreme.justia.com/cases/federal/us/395/444/"}'::jsonb
),

(
  'Bivens v. Six Unknown Named Agents (1971) — Suing Federal Officers',
  'Bivens v. Six Unknown Agents',
  'Supreme Court Precedent',
  '403 U.S. 388 (1971)',
  1971,
  'Supreme Court recognized an implied private right of action for damages against federal officers who violate constitutional rights. The federal equivalent of § 1983.',
  ARRAY[
    'Allows lawsuits against FEDERAL officers for constitutional violations (§ 1983 only covers state actors)',
    'Originally applied to Fourth Amendment violations',
    'Extended to Fifth Amendment (Davis v. Passman) and Eighth Amendment (Carlson v. Green)',
    'Recent Supreme Court decisions have significantly limited expansion to new contexts',
    'Egbert v. Boule (2022) made it very difficult to bring new Bivens claims'
  ],
  ARRAY['all persons', 'persons harmed by federal officers'],
  'Federal courts',
  'For federal officer misconduct: File Bivens claim in federal court. Note that recent case law has narrowed availability. Consider administrative remedies and FTCA claims as alternatives.',
  ARRAY['Section 1983', 'Fourth Amendment', 'Federal Tort Claims Act'],
  '{"case": "https://supreme.justia.com/cases/federal/us/403/388/"}'::jsonb
),

(
  'Graham v. Connor (1989) — Excessive Force Standard',
  'Graham v. Connor',
  'Supreme Court Precedent',
  '490 U.S. 386 (1989)',
  1989,
  'Supreme Court established that claims of excessive force by law enforcement during an arrest or investigatory stop must be analyzed under the Fourth Amendment''s "objective reasonableness" standard.',
  ARRAY[
    'Excessive force claims judged under "objective reasonableness" standard',
    'Analysis considers: severity of crime, whether suspect poses immediate threat, whether suspect is actively resisting',
    'Judged from perspective of a reasonable officer on the scene',
    'Does NOT require proof of malicious intent',
    'Must consider the totality of the circumstances',
    'This is the standard used in nearly all police excessive force cases'
  ],
  ARRAY['all persons', 'arrestees', 'detainees'],
  'Federal courts',
  'If subjected to excessive force: Document injuries immediately (photos, medical records). Identify witnesses. File complaint with department internal affairs. Contact civil rights attorney for § 1983 claim.',
  ARRAY['Fourth Amendment', 'Section 1983', 'Pattern or Practice'],
  '{"case": "https://supreme.justia.com/cases/federal/us/490/386/"}'::jsonb
)

ON CONFLICT DO NOTHING;

-- ============================================================================
-- Additional attorneys specializing in First Amendment and civil rights
-- ============================================================================

INSERT INTO public.attorneys (
  name, email, phone, state, city, specialties, organization,
  practice_areas, is_pro_bono, bio, website, is_verified
) VALUES
(
  'Mickey Osterreicher',
  NULL,
  NULL,
  'New York',
  'Buffalo',
  ARRAY['press freedom', 'photographer rights', 'First Amendment'],
  'National Press Photographers Association',
  ARRAY['First Amendment', 'Media Law'],
  false,
  'General Counsel for NPPA. Leading advocate for the rights of visual journalists and photographers. Has intervened in numerous cases involving press access and the right to record.',
  'https://nppa.org',
  true
),
(
  'Ari Cohn',
  NULL,
  NULL,
  'District of Columbia',
  'Washington',
  ARRAY['First Amendment', 'free speech', 'content moderation'],
  'TechFreedom',
  ARRAY['First Amendment', 'Technology Law'],
  false,
  'First Amendment attorney focusing on free expression issues in digital media and technology. Extensive experience in speech rights advocacy.',
  NULL,
  true
),
(
  'Lee Rowland',
  NULL,
  NULL,
  'New York',
  'New York',
  ARRAY['free speech', 'privacy', 'protest rights'],
  'ACLU',
  ARRAY['First Amendment', 'Privacy', 'Civil Rights'],
  true,
  'Senior staff attorney with ACLU Speech, Privacy, and Technology Project. Works on First Amendment, privacy, and protest rights cases nationwide.',
  'https://www.aclu.org',
  true
),
(
  'Nora Ahmed',
  NULL,
  NULL,
  'Louisiana',
  'New Orleans',
  ARRAY['police accountability', 'criminal justice reform', 'civil rights'],
  'ACLU of Louisiana',
  ARRAY['Civil Rights', 'Criminal Justice', 'Police Accountability'],
  true,
  'Legal Director of ACLU Louisiana. Leads litigation on police misconduct, criminal justice reform, and constitutional rights in the Deep South.',
  'https://www.laaclu.org',
  true
),
(
  'David Loy',
  NULL,
  NULL,
  'California',
  'San Diego',
  ARRAY['First Amendment', 'government transparency', 'border rights'],
  'First Amendment Coalition',
  ARRAY['First Amendment', 'FOIA', 'Government Transparency'],
  true,
  'Legal Director of the First Amendment Coalition. Specializes in open government, public records, and press freedom issues throughout California.',
  'https://firstamendmentcoalition.org',
  true
),
(
  'Andrew Marcantel',
  NULL,
  NULL,
  'Mississippi',
  'Jackson',
  ARRAY['civil rights', 'voting rights', 'police misconduct'],
  'Mississippi Center for Justice',
  ARRAY['Civil Rights', 'Voting Rights', 'Criminal Justice'],
  true,
  'Staff attorney at Mississippi Center for Justice, focusing on voting rights, access to justice, and civil rights enforcement across Mississippi.',
  'https://mscenterforjustice.org',
  true
),
(
  'Scott Medlock',
  NULL,
  NULL,
  'Texas',
  'Austin',
  ARRAY['prisoners rights', 'conditions of confinement', 'civil rights'],
  'Texas Civil Rights Project',
  ARRAY['Civil Rights', 'Prisoner Rights', 'Criminal Justice'],
  true,
  'Legal Director at Texas Civil Rights Project. Leads litigation on prisoners'' rights, jail conditions, and police accountability throughout Texas.',
  'https://txcivilrights.org',
  true
)

ON CONFLICT DO NOTHING;
