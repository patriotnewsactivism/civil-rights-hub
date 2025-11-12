-- Seed data for federal_laws table - Major U.S. Civil Rights Statutes

INSERT INTO public.federal_laws (
  title,
  short_name,
  category,
  statute_citation,
  year_enacted,
  summary,
  key_provisions,
  protected_classes,
  enforcing_agency,
  enforcement_details,
  amendments,
  related_laws,
  external_links
) VALUES

-- Employment Discrimination Laws
(
  'Civil Rights Act of 1964 - Title VII',
  'Title VII',
  'Employment',
  '42 U.S.C. § 2000e et seq.',
  1964,
  'Prohibits employment discrimination based on race, color, religion, sex, or national origin. Applies to employers with 15 or more employees.',
  ARRAY[
    'Prohibits discrimination in hiring, firing, promotion, compensation, and other employment terms',
    'Prohibits workplace harassment based on protected characteristics',
    'Requires reasonable accommodation for religious practices',
    'Prohibits retaliation against employees who oppose discrimination'
  ],
  ARRAY['race', 'color', 'religion', 'sex', 'national origin'],
  'Equal Employment Opportunity Commission (EEOC)',
  'File charge with EEOC within 180 days (300 days in some states). EEOC investigates and may file suit. Private lawsuit possible after receiving right-to-sue letter.',
  'Amended by Pregnancy Discrimination Act (1978), Civil Rights Act of 1991',
  ARRAY['42 U.S.C. § 1981', 'Equal Pay Act', 'Pregnancy Discrimination Act'],
  '{"eeoc": "https://www.eeoc.gov/statutes/title-vii-civil-rights-act-1964", "text": "https://www.govinfo.gov/content/pkg/USCODE-2011-title42/pdf/USCODE-2011-title42-chap21-subchapVI.pdf"}'::jsonb
),

(
  'Americans with Disabilities Act',
  'ADA',
  'Employment',
  '42 U.S.C. § 12101 et seq.',
  1990,
  'Prohibits discrimination against individuals with disabilities in employment, public services, public accommodations, and telecommunications.',
  ARRAY[
    'Title I: Employment - Prohibits discrimination and requires reasonable accommodations',
    'Title II: Public Services - Requires accessibility in state/local government services',
    'Title III: Public Accommodations - Requires accessibility in private businesses open to public',
    'Title IV: Telecommunications - Requires relay services for hearing/speech impaired',
    'Title V: Miscellaneous provisions including prohibition on retaliation'
  ],
  ARRAY['disability'],
  'EEOC (Title I), Department of Justice (Titles II & III)',
  'Employment claims filed with EEOC. Public accommodations complaints to DOJ Civil Rights Division. Private lawsuits permitted.',
  'Amended by ADA Amendments Act of 2008 (broadened definition of disability)',
  ARRAY['Rehabilitation Act of 1973', 'Fair Housing Act'],
  '{"ada": "https://www.ada.gov/", "eeoc": "https://www.eeoc.gov/statutes/americans-disabilities-act-1990"}'::jsonb
),

(
  'Age Discrimination in Employment Act',
  'ADEA',
  'Employment',
  '29 U.S.C. § 621 et seq.',
  1967,
  'Protects employees and job applicants age 40 and older from age-based employment discrimination.',
  ARRAY[
    'Applies to employers with 20 or more employees',
    'Prohibits age-based decisions in hiring, firing, promotions, layoffs, compensation, benefits, and training',
    'Prohibits mandatory retirement (with limited exceptions)',
    'Allows age as a bona fide occupational qualification (BFOQ) in narrow circumstances'
  ],
  ARRAY['age (40+)'],
  'Equal Employment Opportunity Commission (EEOC)',
  'File charge with EEOC within 180 days (300 days in deferral states). Remedies include back pay, reinstatement, liquidated damages for willful violations.',
  'Amended by Older Workers Benefit Protection Act (1990)',
  ARRAY['Title VII', 'Equal Pay Act'],
  '{"eeoc": "https://www.eeoc.gov/statutes/age-discrimination-employment-act-1967"}'::jsonb
),

(
  'Equal Pay Act',
  'EPA',
  'Employment',
  '29 U.S.C. § 206(d)',
  1963,
  'Requires equal pay for equal work regardless of sex. Prohibits wage discrimination between men and women performing substantially equal work.',
  ARRAY[
    'Applies to all employers covered by Fair Labor Standards Act',
    'Equal work determined by skill, effort, responsibility, and working conditions',
    'Pay differentials permitted if based on seniority, merit, quantity/quality of production, or factor other than sex',
    'Prohibits reducing wages of either sex to equalize pay'
  ],
  ARRAY['sex'],
  'Equal Employment Opportunity Commission (EEOC)',
  'File with EEOC or proceed directly to court. Two-year statute of limitations (three years for willful violations).',
  'Part of Fair Labor Standards Act',
  ARRAY['Title VII', 'Lilly Ledbetter Fair Pay Act'],
  '{"eeoc": "https://www.eeoc.gov/statutes/equal-pay-act-1963"}'::jsonb
),

-- Housing Discrimination Laws
(
  'Fair Housing Act',
  'FHA',
  'Housing',
  '42 U.S.C. § 3601 et seq.',
  1968,
  'Prohibits discrimination in housing-related transactions including sale, rental, financing, and advertising based on protected characteristics.',
  ARRAY[
    'Prohibits discrimination in sale or rental of housing',
    'Prohibits discriminatory advertising',
    'Prohibits discrimination in mortgage lending and homeowner insurance',
    'Prohibits blockbusting and steering',
    'Requires reasonable accommodations for people with disabilities',
    'Prohibits harassment and intimidation'
  ],
  ARRAY['race', 'color', 'national origin', 'religion', 'sex', 'familial status', 'disability'],
  'Department of Housing and Urban Development (HUD)',
  'File complaint with HUD within one year. HUD investigates and may refer to DOJ for litigation. Private lawsuit also permitted.',
  'Originally part of Civil Rights Act of 1968; amended 1974 (sex), 1988 (disability, familial status)',
  ARRAY['Civil Rights Act of 1866', 'ADA'],
  '{"hud": "https://www.hud.gov/program_offices/fair_housing_equal_opp/fair_housing_act_overview"}'::jsonb
),

-- Voting Rights Laws
(
  'Voting Rights Act of 1965',
  'VRA',
  'Voting',
  '52 U.S.C. § 10301 et seq.',
  1965,
  'Prohibits racial discrimination in voting. Originally included preclearance requirement for jurisdictions with history of discrimination.',
  ARRAY[
    'Section 2: Prohibits voting practices that discriminate on basis of race',
    'Section 5: Required preclearance (struck down in Shelby County v. Holder, 2013)',
    'Prohibits literacy tests and similar devices',
    'Provides for federal election observers',
    'Protects language minority voters'
  ],
  ARRAY['race', 'color', 'language minority'],
  'Department of Justice - Civil Rights Division',
  'DOJ may bring enforcement actions. Private individuals may bring Section 2 claims. Remedies include injunctive relief and damages.',
  'Reauthorized and amended in 1970, 1975, 1982, 2006. Section 5 preclearance struck down 2013.',
  ARRAY['National Voter Registration Act', 'Help America Vote Act'],
  '{"doj": "https://www.justice.gov/crt/statutes-enforced-voting-section"}'::jsonb
),

(
  'National Voter Registration Act',
  'NVRA / Motor Voter Act',
  'Voting',
  '52 U.S.C. § 20501 et seq.',
  1993,
  'Makes voter registration more accessible by requiring states to offer registration at DMV offices, public assistance agencies, and by mail.',
  ARRAY[
    'Requires voter registration opportunities at DMV offices',
    'Requires registration at public assistance agencies',
    'Requires states to accept mail-in registration',
    'Limits removal of voters from registration rolls',
    'Protects against discriminatory purges'
  ],
  ARRAY['all eligible voters'],
  'Department of Justice - Civil Rights Division',
  'DOJ may bring civil actions. Private right of action exists. Injunctive relief available.',
  NULL,
  ARRAY['Voting Rights Act', 'Help America Vote Act'],
  '{"doj": "https://www.justice.gov/crt/national-voter-registration-act-1993-nvra"}'::jsonb
),

-- Education Laws
(
  'Title IX of the Education Amendments of 1972',
  'Title IX',
  'Education',
  '20 U.S.C. § 1681 et seq.',
  1972,
  'Prohibits sex-based discrimination in education programs and activities receiving federal financial assistance.',
  ARRAY[
    'Applies to all federally funded educational institutions',
    'Prohibits discrimination in admissions, athletics, financial aid, and academic programs',
    'Requires schools to address sexual harassment and sexual violence',
    'Protects pregnant and parenting students',
    'Prohibits retaliation against those who report violations'
  ],
  ARRAY['sex', 'pregnancy', 'gender identity'],
  'Department of Education - Office for Civil Rights',
  'File complaint with OCR within 180 days. OCR investigates and may withdraw federal funding. Private lawsuit also permitted.',
  'Regulations updated in 2020 and 2024 regarding sexual harassment procedures',
  ARRAY['Title VI', 'Title VII', 'Clery Act'],
  '{"ocr": "https://www2.ed.gov/about/offices/list/ocr/docs/tix_dis.html"}'::jsonb
),

(
  'Individuals with Disabilities Education Act',
  'IDEA',
  'Education',
  '20 U.S.C. § 1400 et seq.',
  1975,
  'Ensures students with disabilities receive free appropriate public education (FAPE) in the least restrictive environment.',
  ARRAY[
    'Requires individualized education programs (IEPs)',
    'Free Appropriate Public Education (FAPE) in Least Restrictive Environment (LRE)',
    'Procedural safeguards for parents',
    'Early intervention services for infants and toddlers',
    'Transition services for students aging out'
  ],
  ARRAY['disability'],
  'Department of Education - Office of Special Education',
  'Due process hearings at state level. Appeal to state or federal court. Mediation and resolution sessions available.',
  'Originally Education for All Handicapped Children Act (1975); renamed IDEA 1990; reauthorized 2004',
  ARRAY['Section 504', 'ADA', 'Rehabilitation Act'],
  '{"idea": "https://sites.ed.gov/idea/"}'::jsonb
),

-- Police Accountability & Civil Rights Enforcement
(
  'Civil Rights Act of 1871 - Section 1983',
  'Section 1983',
  'Police Accountability',
  '42 U.S.C. § 1983',
  1871,
  'Allows individuals to sue state and local officials, including police officers, for constitutional violations including excessive force, false arrest, and other civil rights abuses.',
  ARRAY[
    'Creates cause of action for deprivation of constitutional rights under color of law',
    'Applies to state and local government officials (not federal)',
    'Most common vehicle for police misconduct lawsuits',
    'Qualified immunity defense available to individual officers',
    'Municipalities liable only for official policy or custom',
    'Remedies include damages and injunctive relief'
  ],
  ARRAY['all constitutional rights'],
  'Private enforcement through lawsuits',
  'File in federal district court. Qualified immunity frequently raised as defense. Monell claims against cities require showing official policy or custom.',
  'Ku Klux Klan Act of 1871; originally targeted KKK violence, now primary civil rights enforcement tool',
  ARRAY['Bivens claims (federal officers)', '42 U.S.C. § 1985', '42 U.S.C. § 1986'],
  '{"cornell": "https://www.law.cornell.edu/uscode/text/42/1983"}'::jsonb
),

(
  'Law Enforcement Misconduct Statute',
  'Pattern or Practice',
  'Police Accountability',
  '34 U.S.C. § 12601',
  1994,
  'Authorizes DOJ to sue police departments and other law enforcement agencies for patterns or practices of constitutional violations.',
  ARRAY[
    'DOJ may bring civil actions against law enforcement agencies',
    'Addresses systemic patterns of excessive force, false arrests, discrimination',
    'Results in consent decrees requiring police reform',
    'Covers constitutional violations and federal law violations',
    'No private right of action - DOJ enforcement only'
  ],
  ARRAY['all persons subject to law enforcement'],
  'Department of Justice - Civil Rights Division',
  'DOJ Special Litigation Section investigates and may file suit. Consent decrees impose reforms. Court-appointed monitors oversee compliance.',
  'Part of Violent Crime Control and Law Enforcement Act of 1994',
  ARRAY['42 U.S.C. § 1983', '18 U.S.C. § 242'],
  '{"doj": "https://www.justice.gov/crt/addressing-police-misconduct-laws-enforced-department-justice"}'::jsonb
),

(
  'Criminal Civil Rights Violations',
  'Section 242',
  'Police Accountability',
  '18 U.S.C. § 242',
  1968,
  'Makes it a federal crime for someone acting under color of law to willfully deprive a person of constitutional rights.',
  ARRAY[
    'Criminal statute for constitutional violations by government officials',
    'Requires willful conduct',
    'Common charges: excessive force, false arrest, sexual assault by officers',
    'Penalties up to life in prison if death results',
    'Federal prosecution when state prosecution inadequate'
  ],
  ARRAY['all constitutional rights'],
  'Department of Justice - Civil Rights Division',
  'Federal prosecutors must prove willfulness. Often used when state fails to prosecute. Criminal trial with jury.',
  'Part of Civil Rights Act of 1968',
  ARRAY['18 U.S.C. § 241 (conspiracy)', '42 U.S.C. § 1983'],
  '{"doj": "https://www.justice.gov/crt/deprivation-rights-under-color-law"}'::jsonb
),

-- First Amendment & Press Freedom
(
  'Freedom of Information Act',
  'FOIA',
  'Government Transparency',
  '5 U.S.C. § 552',
  1966,
  'Provides public access to federal agency records unless protected by one of nine exemptions.',
  ARRAY[
    'Any person can request federal agency records',
    'Agencies must respond within 20 business days',
    'Nine exemptions (national security, trade secrets, privacy, etc.)',
    'Fee waivers available for public interest requests',
    'Administrative appeal and court review available'
  ],
  ARRAY['all persons'],
  'Each federal agency has FOIA office',
  'Submit request to agency FOIA office. Appeal denial to agency head. File suit in federal court to compel disclosure.',
  'Amended by FOIA Improvement Act (2016), OPEN FOIA Act (2009)',
  ARRAY['Privacy Act', 'Government in Sunshine Act'],
  '{"foia": "https://www.foia.gov/"}'::jsonb
),

-- Accessibility
(
  'Rehabilitation Act of 1973 - Section 504',
  'Section 504',
  'Accessibility',
  '29 U.S.C. § 794',
  1973,
  'Prohibits discrimination based on disability in programs receiving federal financial assistance.',
  ARRAY[
    'Applies to federally funded programs and activities',
    'Requires reasonable accommodations and modifications',
    'Requires accessibility in federally funded facilities',
    'Prohibits exclusion from participation',
    'Precursor to ADA'
  ],
  ARRAY['disability'],
  'Department enforcing relevant program (Education, HHS, etc.)',
  'File complaint with funding agency. Private lawsuit permitted. Remedies include injunctive relief and damages.',
  'Section 508 added 1998 (electronic accessibility)',
  ARRAY['ADA', 'IDEA'],
  '{"hhs": "https://www.hhs.gov/civil-rights/for-individuals/disability/index.html"}'::jsonb
),

-- Immigration
(
  'Immigration and Nationality Act - Anti-Discrimination',
  'INA § 274B',
  'Employment',
  '8 U.S.C. § 1324b',
  1986,
  'Prohibits discrimination based on citizenship status and national origin in hiring, firing, and recruitment.',
  ARRAY[
    'Prohibits citizenship status discrimination (with exceptions)',
    'Prohibits national origin discrimination in employment',
    'Covers employers with 4+ employees',
    'Protects work-authorized individuals',
    'Prohibits unfair documentary practices in I-9 verification'
  ],
  ARRAY['citizenship status', 'national origin'],
  'Department of Justice - Civil Rights Division - Immigrant and Employee Rights Section',
  'File charge with IER within 180 days. Administrative hearing before judge. Appeal to federal court.',
  'Part of Immigration Reform and Control Act (IRCA) 1986',
  ARRAY['Title VII'],
  '{"doj": "https://www.justice.gov/crt/immigrant-and-employee-rights-section"}'::jsonb
),

-- Hate Crimes
(
  'Matthew Shepard and James Byrd Jr. Hate Crimes Prevention Act',
  'Hate Crimes Act',
  'Hate Crimes',
  '18 U.S.C. § 249',
  2009,
  'Expands federal hate crime law to include crimes motivated by actual or perceived sexual orientation, gender identity, disability, or gender.',
  ARRAY[
    'Federal prosecution of hate crimes based on race, color, religion, national origin',
    'Also covers sexual orientation, gender identity, disability, gender',
    'Removes requirement that victim be engaged in federally protected activity',
    'Provides federal assistance to state/local law enforcement',
    'Enhanced penalties for hate-motivated crimes'
  ],
  ARRAY['race', 'color', 'religion', 'national origin', 'sexual orientation', 'gender identity', 'disability', 'gender'],
  'Department of Justice - Civil Rights Division',
  'Federal prosecution when state prosecution inadequate or unavailable. Must prove hate motivation beyond reasonable doubt.',
  'Amended previous hate crimes statute (18 U.S.C. § 245)',
  ARRAY['18 U.S.C. § 245', '42 U.S.C. § 3631 (housing-related hate crimes)'],
  '{"doj": "https://www.justice.gov/crt/hate-crime-laws"}'::jsonb
);
