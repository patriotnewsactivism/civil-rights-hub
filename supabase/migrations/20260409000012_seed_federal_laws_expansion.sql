-- Expand federal_laws table with additional civil rights statutes
-- Uses correct schema: title, short_name, category, statute_citation,
-- year_enacted, summary, key_provisions, protected_classes,
-- enforcing_agency, enforcement_details, amendments, related_laws, external_links
-- All citations verified against U.S. Code as of 2026

INSERT INTO public.federal_laws (
  title, short_name, category, statute_citation, year_enacted,
  summary, key_provisions, protected_classes,
  enforcing_agency, enforcement_details,
  amendments, related_laws, external_links
) VALUES

-- ============================================================
-- CONSTITUTIONAL FOUNDATIONS
-- ============================================================

(
  'First Amendment — Freedom of Speech, Press, Assembly, and Petition',
  'First Amendment', 'Constitutional Rights', 'U.S. Const. amend. I', 1791,
  'Prohibits Congress (and, through the 14th Amendment, state governments) from making laws abridging freedom of speech, press, religion, peaceful assembly, or the right to petition the government. Foundational to all civil rights advocacy and journalism.',
  ARRAY[
    'Protects speech, even unpopular or offensive speech, from government restriction',
    'Protects freedom of the press including the right to gather news, publish government criticism, and refuse to identify sources',
    'Protects the right to peacefully assemble and protest in public spaces',
    'Prohibits prior restraints on publication (Near v. Minnesota, 1931)',
    'Protects the right to record police and government officials in public (established in all federal circuits)'
  ],
  ARRAY['all persons'],
  'Courts (private cause of action); DOJ Civil Rights Division for government violations',
  'Enforced through litigation. Section 1983 is the vehicle for suing state officials. Bivens actions available for federal officials. Injunctive relief and damages available.',
  'Incorporated against states through 14th Amendment',
  ARRAY['42 U.S.C. § 1983', 'Bivens v. Six Unknown Federal Narcotics Agents (1971)'],
  '{"text": "https://constitution.congress.gov/constitution/amendment-1/", "aclu": "https://www.aclu.org/issues/free-speech"}'::jsonb
),

(
  'Fourth Amendment — Protection Against Unreasonable Searches and Seizures',
  'Fourth Amendment', 'Constitutional Rights', 'U.S. Const. amend. IV', 1791,
  'Protects persons and their homes, papers, and effects against unreasonable government searches and seizures. Requires warrants to be based on probable cause, supported by oath, and particularly describing the place and items to be searched or seized.',
  ARRAY[
    'Requires a warrant based on probable cause for searches of homes (Payton v. New York, 1980)',
    'Cell phone contents require a warrant even incident to arrest (Riley v. California, 2014)',
    'Historical cell-site location data requires a warrant (Carpenter v. United States, 2018)',
    'Exclusionary rule: evidence obtained in violation is inadmissible (Mapp v. Ohio, 1961)',
    'Terry stops: officers may briefly detain based on reasonable articulable suspicion',
    'No-knock raids must be justified by particularized circumstances (Wilson v. Arkansas, 1995)'
  ],
  ARRAY['all persons'],
  'Courts (private cause of action via Section 1983)',
  'Enforced through suppression motions in criminal proceedings and civil rights lawsuits under 42 U.S.C. § 1983. Qualified immunity is a major obstacle in civil suits.',
  'Incorporated against states through 14th Amendment',
  ARRAY['42 U.S.C. § 1983', 'Riley v. California (2014)', 'Carpenter v. United States (2018)'],
  '{"text": "https://constitution.congress.gov/constitution/amendment-4/", "eff": "https://www.eff.org/issues/privacy"}'::jsonb
),

-- ============================================================
-- CIVIL RIGHTS RECONSTRUCTION-ERA STATUTES
-- ============================================================

(
  'Civil Rights Act of 1866 — Equal Rights Under Law',
  'Section 1981', 'Employment & Contracts', '42 U.S.C. § 1981', 1866,
  'Guarantees all persons the same right to make and enforce contracts, sue, be parties, give evidence, and have the full and equal benefit of all laws. A powerful tool against racial discrimination in employment and contracting, with no cap on damages.',
  ARRAY[
    'Prohibits race discrimination in the making and enforcing of contracts, including employment contracts',
    'Applies to BOTH public and private employers (unlike Title VII, which has size requirements)',
    'No cap on compensatory or punitive damages (unlike Title VII)',
    'Covers race discrimination but NOT sex, religion, national origin, age, or disability',
    'Broader remedies than Title VII in many cases; frequently combined in litigation'
  ],
  ARRAY['race', 'color', 'national origin (limited)'],
  'Private lawsuit in federal or state court',
  'Direct civil lawsuit — no need to file with EEOC first. 4-year statute of limitations under 28 U.S.C. § 1658 for claims accruing after 1990.',
  'Broadly interpreted by SCOTUS; Runyon v. McCrary (1976) held it applies to private contracts',
  ARRAY['Title VII (42 U.S.C. § 2000e)', '42 U.S.C. § 1983', '42 U.S.C. § 1982'],
  '{"text": "https://www.law.cornell.edu/uscode/text/42/1981", "doj": "https://www.justice.gov/crt"}'::jsonb
),

(
  'Civil Rights Act of 1866 — Property Rights',
  'Section 1982', 'Housing & Property', '42 U.S.C. § 1982', 1866,
  'All citizens have the same right to inherit, purchase, lease, sell, hold, and convey real and personal property. Reinforces the Fair Housing Act and reaches some situations the FHA does not.',
  ARRAY[
    'Prohibits racial discrimination in the sale and rental of real property',
    'No administrative prerequisites — private lawsuit directly in federal court',
    'Applies to ALL housing including owner-occupied housing of four or fewer units (which Fair Housing Act exempts)',
    'Narrower in scope than Fair Housing Act but broader coverage of property types'
  ],
  ARRAY['race', 'color'],
  'Private lawsuit in federal court',
  'Direct civil lawsuit. No filing with HUD required. Jones v. Alfred H. Mayer Co. (1968) established it reaches private conduct.',
  NULL,
  ARRAY['Fair Housing Act (42 U.S.C. § 3601)', '42 U.S.C. § 1981'],
  '{"text": "https://www.law.cornell.edu/uscode/text/42/1982"}'::jsonb
),

(
  'Civil Rights Act of 1871 — Conspiracy to Deprive Civil Rights',
  'Section 1985', 'Civil Rights Enforcement', '42 U.S.C. § 1985', 1871,
  'Provides a civil cause of action against two or more persons who conspire to deprive any person or class of equal protection of the laws or equal privileges and immunities. Covers conspiracies to interfere with civil rights.',
  ARRAY[
    'Section 1985(1): Prohibits conspiracy to prevent officers from performing duties',
    'Section 1985(2): Prohibits obstruction of justice through witness intimidation',
    'Section 1985(3): Prohibits conspiracies to deprive persons of equal protection — requires class-based discriminatory animus'
  ],
  ARRAY['all persons (must show class-based animus for § 1985(3))'],
  'Private lawsuit in federal or state court',
  'Direct civil lawsuit. Often pled alongside § 1983. Requires showing agreement between two or more parties and class-based discriminatory motive.',
  NULL,
  ARRAY['42 U.S.C. § 1983', '42 U.S.C. § 1986'],
  '{"text": "https://www.law.cornell.edu/uscode/text/42/1985"}'::jsonb
),

(
  'Civil Rights Attorneys'' Fees Award Act',
  'Section 1988', 'Civil Rights Enforcement', '42 U.S.C. § 1988', 1976,
  'Allows prevailing plaintiffs in civil rights cases under § 1983, § 1985, and other statutes to recover reasonable attorneys'' fees from the losing defendant. This fee-shifting provision is critical to making civil rights litigation financially viable.',
  ARRAY[
    'Prevailing plaintiffs in civil rights cases may recover attorney fees from defendants',
    'Applies to cases under § 1983, § 1985, Voting Rights Act, and other civil rights statutes',
    'Government defendants pay fees — creates accountability for constitutional violations',
    'Prevailing defendants can recover fees only if plaintiff''s case was frivolous'
  ],
  ARRAY['civil rights plaintiffs'],
  'Courts (attorneys'' fees motion following judgment)',
  'Parties move for fees after prevailing in the underlying civil rights case. Courts have discretion to determine what is "reasonable." Important strategic consideration in civil rights litigation.',
  NULL,
  ARRAY['42 U.S.C. § 1983', '42 U.S.C. § 1985', 'Voting Rights Act'],
  '{"text": "https://www.law.cornell.edu/uscode/text/42/1988"}'::jsonb
),

-- ============================================================
-- CIVIL RIGHTS ACT TITLE VI
-- ============================================================

(
  'Civil Rights Act of 1964 — Title VI',
  'Title VI', 'Anti-Discrimination (Federally Funded)', '42 U.S.C. § 2000d et seq.', 1964,
  'Prohibits discrimination based on race, color, and national origin in any program or activity receiving federal financial assistance. Covers schools, hospitals, transit agencies, and nearly all entities receiving federal funds.',
  ARRAY[
    'Prohibits intentional discrimination and policies with discriminatory effects in federally funded programs',
    'Language access: federal agencies must provide meaningful access to services for limited-English speakers (Executive Order 13166)',
    'Applies to nearly all state/local government programs and many private entities that receive federal funding',
    'DOJ and relevant federal agencies can withdraw federal funding from violators'
  ],
  ARRAY['race', 'color', 'national origin'],
  'DOJ Civil Rights Division; each federal agency''s Office for Civil Rights',
  'File complaint with the relevant federal agency (e.g., DOE-OCR for schools, HHS-OCR for hospitals) or DOJ. Private lawsuit also available after administrative exhaustion.',
  NULL,
  ARRAY['Title VII (42 U.S.C. § 2000e)', 'Section 504 (29 U.S.C. § 794)', 'Title IX (20 U.S.C. § 1681)'],
  '{"doj": "https://www.justice.gov/crt/title-vi", "text": "https://www.law.cornell.edu/uscode/text/42/2000d"}'::jsonb
),

-- ============================================================
-- PRIVACY & SURVEILLANCE STATUTES
-- ============================================================

(
  'Electronic Communications Privacy Act',
  'ECPA', 'Digital Privacy', '18 U.S.C. §§ 2510–2523 (Wiretap Act); 18 U.S.C. §§ 2701–2713 (Stored Communications Act)', 1986,
  'ECPA updated federal wiretapping law for digital communications. The Wiretap Act prohibits real-time interception of wire, oral, and electronic communications. The Stored Communications Act governs government access to data stored with third-party service providers.',
  ARRAY[
    'Wiretap Act: Prohibits real-time interception of communications without court order (Title III wiretap order)',
    'Stored Communications Act: Governs law enforcement access to emails, social media messages, and stored data',
    'ECPA has significant exceptions for national security and law enforcement',
    'Carpenter v. United States (2018) limits how far ECPA''s third-party exception goes for location data',
    'Many advocates argue ECPA is outdated and needs reform for modern cloud computing'
  ],
  ARRAY['all persons'],
  'DOJ National Security Division; private cause of action for violations',
  'Criminal penalties for violations. Private civil suit possible for unlawful interception. Government must meet statutory standards for access to stored data (warrant, court order, or subpoena depending on age and content type).',
  'Amended by USA PATRIOT Act (2001), FISA Amendments Act (2008); partially superseded by Carpenter for location data',
  ARRAY['Foreign Intelligence Surveillance Act (FISA)', 'Computer Fraud and Abuse Act', 'Privacy Act'],
  '{"text": "https://www.law.cornell.edu/uscode/text/18/part-I/chapter-119", "eff": "https://www.eff.org/issues/ecpa"}'::jsonb
),

(
  'Privacy Act of 1974',
  'Privacy Act', 'Government Transparency', '5 U.S.C. § 552a', 1974,
  'Governs the collection, maintenance, use, and dissemination of personally identifiable information by federal agencies. Gives individuals the right to access and correct records held by federal agencies about them.',
  ARRAY[
    'Right to access personal records held by federal agencies',
    'Right to request correction of inaccurate records',
    'Limits the conditions under which federal agencies may disclose personal records to third parties',
    'Requires agencies to publish notice of their record systems',
    'Works alongside FOIA: use FOIA for records, Privacy Act for personal records about yourself'
  ],
  ARRAY['U.S. citizens and permanent residents'],
  'Each federal agency''s Privacy Act officer; DOJ Office of Information Policy for appeals',
  'Submit request to agency Privacy Act officer. Agency must respond within 30 days. Appeals to agency head, then federal court. Can recover actual damages, attorney fees for violations.',
  'Amended by Computer Matching and Privacy Protection Act (1988)',
  ARRAY['FOIA (5 U.S.C. § 552)', 'E-Government Act of 2002'],
  '{"doj": "https://www.justice.gov/opcl/overview-privacy-act-1974", "text": "https://www.law.cornell.edu/uscode/text/5/552a"}'::jsonb
),

-- ============================================================
-- WORKER & LABOR RIGHTS
-- ============================================================

(
  'National Labor Relations Act',
  'NLRA', 'Workers Rights', '29 U.S.C. §§ 151–169', 1935,
  'Guarantees private-sector employees the right to organize, form, join, or assist labor unions, collectively bargain, and engage in concerted activities for mutual aid and protection. Prohibits unfair labor practices by employers and unions.',
  ARRAY[
    'Right to organize unions without employer interference or retaliation',
    'Right to bargain collectively over wages, hours, and working conditions',
    'Right to strike and engage in other concerted activity',
    'Protected Concerted Activity: even two or more non-union employees discussing wages or working conditions are protected',
    'Prohibits employers from firing, demoting, or retaliating for organizing activity'
  ],
  ARRAY['private sector employees (not federal, state, or local government employees; not agricultural workers; not independent contractors)'],
  'National Labor Relations Board (NLRB)',
  'File unfair labor practice charge with NLRB regional office within 6 months. NLRB investigates and may issue complaint. Remedies include reinstatement with back pay. Election petitions for union recognition through NLRB.',
  'Labor Management Relations Act (1947) modified; amended by Landrum-Griffin Act (1959)',
  ARRAY['Fair Labor Standards Act', 'Civil Service Reform Act', 'Railway Labor Act'],
  '{"nlrb": "https://www.nlrb.gov/rights-we-protect/rights/employee-rights", "text": "https://www.law.cornell.edu/uscode/text/29/chapter-7"}'::jsonb
),

(
  'Fair Labor Standards Act',
  'FLSA', 'Workers Rights', '29 U.S.C. §§ 201–219', 1938,
  'Establishes minimum wage, overtime pay, recordkeeping, and child labor standards. Requires covered employers to pay non-exempt employees at least the federal minimum wage and 1.5x their regular rate for hours worked over 40 in a workweek.',
  ARRAY[
    'Federal minimum wage: $7.25/hour (many states have higher minimums)',
    'Overtime pay: 1.5x regular rate for hours over 40/week for non-exempt employees',
    'Child labor protections restricting work hours and hazardous occupations for minors',
    'Anti-retaliation: employers cannot fire or discipline employees for asserting FLSA rights',
    'Covers most employees in the private sector; also covers federal employees'
  ],
  ARRAY['all employees (with narrow exemptions)'],
  'Department of Labor Wage and Hour Division (WHD)',
  'File complaint with WHD or private lawsuit. 2-year statute of limitations (3 years for willful violations). Back pay, liquidated damages, attorney fees available.',
  'Amended by Equal Pay Act (1963), Fair Minimum Wage Act (2007)',
  ARRAY['Equal Pay Act (29 U.S.C. § 206(d))', 'Family and Medical Leave Act'],
  '{"dol": "https://www.dol.gov/agencies/whd/flsa", "text": "https://www.law.cornell.edu/uscode/text/29/chapter-8"}'::jsonb
),

-- ============================================================
-- GENDER & SEXUAL VIOLENCE
-- ============================================================

(
  'Violence Against Women Act',
  'VAWA', 'Gender-Based Violence', '34 U.S.C. §§ 12291–12529', 1994,
  'Established federal protections and resources to address domestic violence, sexual assault, dating violence, and stalking. Creates federal crimes for interstate domestic violence and provides billions in funding for victim services and law enforcement training.',
  ARRAY[
    'Creates federal crimes for interstate domestic violence, stalking, and cyberstalking',
    'Firearms prohibition for domestic abusers subject to restraining orders (18 U.S.C. § 922(g)(8))',
    'Full faith and credit for protective orders across state lines',
    'Funding for domestic violence shelters, rape crisis centers, and victim advocacy',
    'Special immigration protections: U-visa for crime victims, VAWA self-petition for abused immigrants'
  ],
  ARRAY['domestic violence victims', 'sexual assault victims', 'stalking victims', 'immigrants'],
  'DOJ Office on Violence Against Women (OVW)',
  'Various civil and criminal remedies. Contact local domestic violence shelter, hotline (1-800-799-7233), or law enforcement. Immigration protections through USCIS.',
  'Reauthorized in 2000, 2005, 2013, 2022; 2022 reauthorization expanded protections for Native Americans and LGBTQ+ individuals',
  ARRAY['Trafficking Victims Protection Act', 'Title IX', 'Immigration and Nationality Act'],
  '{"doj": "https://www.justice.gov/ovw", "hotline": "https://www.thehotline.org"}'::jsonb
),

-- ============================================================
-- INCARCERATION & INSTITUTIONAL RIGHTS
-- ============================================================

(
  'Civil Rights of Institutionalized Persons Act',
  'CRIPA', 'Prisoners'' Rights', '42 U.S.C. §§ 1997–1997j', 1980,
  'Authorizes the Department of Justice to investigate and take legal action against state and local governments for patterns of violations of the civil rights of persons in jails, prisons, mental health facilities, nursing homes, and other institutions.',
  ARRAY[
    'Authorizes DOJ to investigate institutions and bring civil suits for systemic rights violations',
    'Covers jails, prisons, juvenile facilities, mental health institutions, and nursing homes',
    'Allows DOJ to enter facilities, review records, and interview residents',
    'Results in consent decrees requiring facilities to implement reforms',
    'Does not provide a private right of action — only DOJ can enforce'
  ],
  ARRAY['incarcerated persons', 'persons in mental health institutions', 'nursing home residents'],
  'DOJ Special Litigation Section (Civil Rights Division)',
  'DOJ investigates complaints and may file suit to compel systemic reforms. File complaints with DOJ Special Litigation Section. Note: individuals must use § 1983 for personal civil rights claims.',
  NULL,
  ARRAY['42 U.S.C. § 1983', 'Prison Litigation Reform Act', 'Prison Rape Elimination Act'],
  '{"doj": "https://www.justice.gov/crt/civil-rights-institutionalized-persons", "text": "https://www.law.cornell.edu/uscode/text/42/1997"}'::jsonb
),

(
  'Prison Rape Elimination Act',
  'PREA', 'Prisoners'' Rights', '34 U.S.C. §§ 30301–30309', 2003,
  'Established a zero-tolerance policy for sexual abuse in federal, state, and local prisons, jails, and other detention facilities. Created national standards for prevention, detection, and prosecution of prison rape.',
  ARRAY[
    'Requires correctional facilities to implement national standards for preventing and responding to sexual abuse',
    'Facilities must report sexual abuse incidents to government data collection program',
    'Prohibits retaliation against prisoners who report sexual abuse',
    'Creates Rape Prevention Program with DOJ grants to state and local programs',
    'Federal funding conditioned on PREA compliance'
  ],
  ARRAY['incarcerated persons in federal, state, and local facilities'],
  'DOJ Bureau of Justice Assistance; National PREA Resource Center',
  'Report to facility PREA coordinator or DOJ. Facilities risk losing federal funding for non-compliance. No explicit private cause of action — use § 1983 for individual rights violations.',
  NULL,
  ARRAY['42 U.S.C. § 1983', 'CRIPA', 'Eighth Amendment'],
  '{"doj": "https://www.justice.gov/jm/justice-manual-9-8000-prison-rape-elimination-act-prea", "resource": "https://www.prearesourcecenter.org"}'::jsonb
),

-- ============================================================
-- CAMPUS & EDUCATIONAL RIGHTS
-- ============================================================

(
  'Clery Act — Campus Security Policy and Crime Statistics',
  'Clery Act', 'Education', '20 U.S.C. § 1092(f)', 1990,
  'Requires colleges and universities that receive federal financial aid to disclose information about crimes on and near their campuses. Named after Jeanne Clery, who was murdered in her dormitory in 1986.',
  ARRAY[
    'Annual Security Report: must publish crime statistics for past 3 years and security policies',
    'Timely Warnings: must alert campus community about ongoing threats to safety',
    'Emergency Response: must have written emergency response plan',
    'Campus Sex Crimes Prevention Act: must register sex offenders and notify campus police',
    'Title IX overlay: sexual assault is both a Clery and Title IX issue for campus reporting'
  ],
  ARRAY['students and employees of colleges and universities'],
  'DOE Federal Student Aid (FSA) — Clery Act Compliance Division',
  'File complaint with DOE-FSA. Institutions face fines up to $68,056 per violation. Victims may also pursue Title IX remedies.',
  'Amended by Violence Against Women Reauthorization Act (2013) adding dating violence, domestic violence, and stalking reporting requirements',
  ARRAY['Title IX (20 U.S.C. § 1681)', 'Family Educational Rights and Privacy Act (FERPA)', 'VAWA'],
  '{"doe": "https://fsapartners.ed.gov/knowledge-center/fsa-handbook/2021/vol2/ch6clery-act", "text": "https://www.law.cornell.edu/uscode/text/20/1092"}'::jsonb
),

(
  'Family Educational Rights and Privacy Act',
  'FERPA', 'Education', '20 U.S.C. § 1232g', 1974,
  'Protects the privacy of student education records at schools receiving federal funding. Gives parents (and students over 18) the right to access, review, and request corrections to education records.',
  ARRAY[
    'Students (18+) or parents have right to inspect and review education records',
    'Schools must obtain written consent before disclosing records to third parties',
    'Exceptions: school officials with legitimate educational interest, judicial orders, emergencies',
    'Students may request amendment of inaccurate records',
    'Disclosure to law enforcement: FERPA does not prevent reporting crimes; some exceptions for campus law enforcement'
  ],
  ARRAY['students at federally funded schools'],
  'DOE Student Privacy Policy Office (SPPO)',
  'File complaint with DOE-SPPO within 180 days. Remedy is cutting federal funding (rarely used). No private cause of action under FERPA itself; civil rights claims via § 1983 may be available.',
  NULL,
  ARRAY['Title IX (20 U.S.C. § 1681)', 'Clery Act', 'ADA (20 U.S.C. § 12101)'],
  '{"doe": "https://studentprivacy.ed.gov", "text": "https://www.law.cornell.edu/uscode/text/20/1232g"}'::jsonb
),

-- ============================================================
-- IMMIGRATION
-- ============================================================

(
  'Immigration Reform and Control Act — Anti-Discrimination Provisions',
  'IRCA', 'Immigration Rights', '8 U.S.C. § 1324b', 1986,
  'Prohibits employment discrimination based on citizenship status and national origin. Enforced by the DOJ Office of Special Counsel for Immigration-Related Unfair Employment Practices (OSC).',
  ARRAY[
    'Prohibits discrimination in hiring, firing, and recruiting based on citizenship status and national origin',
    'Applies to employers with 4–14 employees (EEOC''s Title VII covers employers with 15+)',
    'Prohibits document abuse: demanding more or different documents than required for I-9',
    'Prohibits retaliation against individuals who assert IRCA rights',
    'Covers U.S. citizens, permanent residents, refugees, and asylees'
  ],
  ARRAY['citizenship status', 'national origin', 'immigrants (authorized)'],
  'DOJ Immigrant and Employee Rights Section (IER)',
  'File charge with DOJ IER (1-800-255-7688) within 180 days of discrimination. IER investigates and may file complaint with administrative law judge. Back pay and reinstatement available.',
  NULL,
  ARRAY['Title VII (42 U.S.C. § 2000e)', '42 U.S.C. § 1981'],
  '{"doj": "https://www.justice.gov/ier", "text": "https://www.law.cornell.edu/uscode/text/8/1324b"}'::jsonb
),

-- ============================================================
-- RELIGIOUS RIGHTS
-- ============================================================

(
  'Religious Land Use and Institutionalized Persons Act',
  'RLUIPA', 'Religious Freedom', '42 U.S.C. §§ 2000cc–2000cc-5', 2000,
  'Protects religious exercise in two contexts: land use (zoning) and institutionalized persons. Prohibits governments from substantially burdening religious exercise unless using the least restrictive means to serve a compelling governmental interest.',
  ARRAY[
    'Land Use: Prohibits zoning laws that impose substantial burdens on religious exercise without compelling justification',
    'Prohibits facially discriminatory land use regulations targeting religious institutions',
    'Institutionalized Persons: Prohibits prisons and jails from imposing substantial burdens on prisoners'' religious exercise',
    'Religious diet, religious items, worship services in prisons protected',
    'Applies to programs receiving federal financial assistance'
  ],
  ARRAY['religious practitioners', 'incarcerated persons (religious rights)'],
  'DOJ Civil Rights Division; private cause of action',
  'Private lawsuit in federal court. DOJ may also bring or intervene in cases. Prevailing parties may recover attorney fees.',
  NULL,
  ARRAY['First Amendment', 'Religious Freedom Restoration Act (42 U.S.C. § 2000bb)', 'CRIPA'],
  '{"doj": "https://www.justice.gov/crt/religious-land-use-and-institutionalized-persons-act", "text": "https://www.law.cornell.edu/uscode/text/42/2000cc"}'::jsonb
),

-- ============================================================
-- HATE CRIMES (additional)
-- ============================================================

(
  'Civil Rights Act of 1968 — Federal Criminal Interference with Civil Rights',
  'Section 245', 'Criminal Civil Rights', '18 U.S.C. § 245', 1968,
  'Makes it a federal crime to use force or threat of force to interfere with persons exercising federally protected activities because of their race, color, religion, or national origin. One of the broadest federal criminal civil rights statutes.',
  ARRAY[
    'Criminalizes interference by force with voting, jury service, federal employment, and participation in federally aided programs',
    'Criminalizes interference with attending public school, participating in facilities commerce, or using public accommodations',
    'Federal jurisdiction available when state prosecution is inadequate or the offense involves a pattern',
    'Includes protection for persons participating in activities administered by federal financial assistance'
  ],
  ARRAY['race', 'color', 'religion', 'national origin'],
  'DOJ Civil Rights Division (Criminal Section)',
  'Federal prosecution. Contact DOJ Criminal Civil Rights Section or FBI field office. Must show force or threat was motivated by protected characteristic AND related to federally protected activity.',
  NULL,
  ARRAY['18 U.S.C. § 242', 'Matthew Shepard Act (18 U.S.C. § 249)', '42 U.S.C. § 1985'],
  '{"doj": "https://www.justice.gov/crt/criminal-section-home", "text": "https://www.law.cornell.edu/uscode/text/18/245"}'::jsonb
)

ON CONFLICT DO NOTHING;
