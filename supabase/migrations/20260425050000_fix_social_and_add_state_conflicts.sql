-- =============================================================================
-- Migration: Fix Social Media Infrastructure & Add State Law Conflicts
-- Date: 2026-04-25
-- Purpose: Fix missing columns causing social feed bugs, add state law
--          conflicts data for challenging unconstitutional legislation
-- =============================================================================

-- ─── 1. FIX SOCIAL MEDIA BUGS ───────────────────────────────────────────────

-- 1a. Add poll_data JSONB column to posts table (polls crash without this)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS poll_data jsonb DEFAULT NULL;

-- 1b. Add parent_comment_id to comments for threaded replies
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_comment_id uuid DEFAULT NULL
  REFERENCES comments(id) ON DELETE CASCADE;

-- 1c. Create poll_votes table for tracking user votes
CREATE TABLE IF NOT EXISTS poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id, option_id)
);

-- 1d. Enable RLS on poll_votes
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read poll votes" ON poll_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON poll_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON poll_votes FOR DELETE
  USING (auth.uid() = user_id);

-- 1e. Index for fast poll vote lookups
CREATE INDEX IF NOT EXISTS idx_poll_votes_post_user ON poll_votes(post_id, user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_comment_id);

-- ─── 2. STATE LAW CONFLICTS TABLE ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS state_law_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text NOT NULL,
  conflict_title text NOT NULL,
  description text NOT NULL,
  affected_right text NOT NULL,       -- e.g. 'First Amendment', 'Fourth Amendment'
  federal_protection text NOT NULL,    -- The federal right being violated
  state_law_citation text NOT NULL,    -- The specific state law
  status text DEFAULT 'active',        -- 'active', 'challenged', 'struck_down', 'enjoined'
  challenge_tips text[] NOT NULL DEFAULT '{}',
  reporting_contacts jsonb DEFAULT '[]',
  severity text DEFAULT 'high',        -- 'critical', 'high', 'medium'
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE state_law_conflicts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read state law conflicts" ON state_law_conflicts
  FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_state_law_conflicts_state ON state_law_conflicts(state);
CREATE INDEX IF NOT EXISTS idx_state_law_conflicts_right ON state_law_conflicts(affected_right);

-- ─── 3. REPORTING CONTACTS TABLE ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reporting_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  organization text NOT NULL,
  contact_type text NOT NULL,          -- 'phone', 'email', 'web', 'hotline'
  contact_value text NOT NULL,
  category text NOT NULL,              -- 'police_misconduct', 'voting_rights', 'press_freedom', etc.
  scope text DEFAULT 'national',       -- 'national', 'state', 'local'
  state text,                          -- NULL for national contacts
  description text,
  is_emergency boolean DEFAULT false,
  available_hours text DEFAULT '24/7',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reporting_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read reporting contacts" ON reporting_contacts
  FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_reporting_contacts_category ON reporting_contacts(category);
CREATE INDEX IF NOT EXISTS idx_reporting_contacts_state ON reporting_contacts(state);

-- ─── 4. SEED STATE LAW CONFLICTS (REAL DATA) ────────────────────────────────

INSERT INTO state_law_conflicts (state, conflict_title, description, affected_right, federal_protection, state_law_citation, status, severity, challenge_tips, reporting_contacts) VALUES

-- ALABAMA
('Alabama', 'Anti-Protest Trespass Enhancement', 'HB 2, enacted 2021, creates felony penalties for blocking roadways during protests and criminalizes protest activity near critical infrastructure, chilling First Amendment assembly rights.', 'First Amendment', '1st Amendment right to peaceable assembly; NAACP v. Claiborne Hardware (1982)', 'Ala. Code § 13A-11-8.1 (HB 2, 2021)', 'active', 'high',
  ARRAY['Document the protest activity thoroughly on video', 'Contact ACLU of Alabama at (205) 328-0955 immediately if arrested', 'Assert that the law is unconstitutionally vague under Coates v. Cincinnati (1971)', 'File a Section 1983 civil rights complaint in federal court'],
  '[{"org": "ACLU of Alabama", "phone": "(205) 328-0955", "web": "https://www.aclualabama.org"}, {"org": "Southern Poverty Law Center", "phone": "(334) 956-8200", "web": "https://www.splcenter.org"}]'::jsonb),

-- ARIZONA
('Arizona', 'Recording Police Restriction (Buffer Zone)', 'HB 2319 (2022) makes it a misdemeanor to record law enforcement within 8 feet of police activity, directly conflicting with the First Amendment right to record police.', 'First Amendment', 'First Amendment right to record police; Glik v. Cunniffe (1st Cir. 2011); Turner v. Driver (5th Cir. 2017)', 'Ariz. Rev. Stat. § 13-3732 (HB 2319, 2022)', 'enjoined', 'critical',
  ARRAY['A federal judge blocked key parts of this law in Sept 2022', 'You have the constitutional right to record police in public per Glik v. Cunniffe', 'Keep filming from any distance; if told to stop, calmly state your First Amendment right', 'Contact the ACLU of Arizona if threatened with arrest for recording'],
  '[{"org": "ACLU of Arizona", "phone": "(602) 650-1854", "web": "https://www.acluaz.org"}, {"org": "First Amendment Coalition", "web": "https://firstamendmentcoalition.org"}]'::jsonb),

-- ARKANSAS
('Arkansas', 'Right-to-Film Limitations', 'Act 1023 (2023) restricts recording in or near correctional facilities and limits recording near certain government operations, creating a chilling effect on accountability journalism.', 'First Amendment', 'First Amendment freedom of the press; Richmond Newspapers v. Virginia (1980)', 'Ark. Code Ann. § 5-54-136 (Act 1023, 2023)', 'active', 'high',
  ARRAY['The First Amendment protects recording government operations in public', 'Document any interference by officials on camera', 'Contact Reporters Committee for Freedom of the Press for legal support', 'File a complaint with the Arkansas Press Association'],
  '[{"org": "ACLU of Arkansas", "phone": "(501) 374-2660", "web": "https://www.acluarkansas.org"}, {"org": "Reporters Committee", "web": "https://www.rcfp.org"}]'::jsonb),

-- FLORIDA
('Florida', 'Anti-Protest Law (HB 1)', 'HB 1 (2021) creates enhanced penalties for protest-related offenses, allows citizens to sue local governments that reduce police funding, and grants immunity to drivers who hit protesters blocking roads.', 'First Amendment', '1st Amendment assembly rights; 14th Amendment due process; Edwards v. South Carolina (1963)', 'Fla. Stat. §§ 870.01-870.04 (HB 1, 2021)', 'challenged', 'critical',
  ARRAY['Federal judge struck down parts of this law as unconstitutionally vague in 2021', 'Document everything if arrested during a protest', 'Contact Southern Legal Counsel or ACLU of Florida immediately', 'The "mob intimidation" provision was ruled unconstitutional - cite NAACP v. Claiborne Hardware'],
  '[{"org": "ACLU of Florida", "phone": "(786) 363-2700", "web": "https://www.aclufl.org"}, {"org": "Southern Legal Counsel", "phone": "(352) 271-8890", "web": "https://www.southernlegal.org"}]'::jsonb),

('Florida', 'Dont Say Gay / Parental Rights in Education', 'HB 1557 (2022) restricts classroom discussion of sexual orientation and gender identity, conflicting with First Amendment free speech and 14th Amendment equal protection.', 'First Amendment', '1st Amendment free speech; 14th Amendment equal protection', 'Fla. Stat. § 1001.42(8)(c) (HB 1557, 2022)', 'active', 'high',
  ARRAY['Teachers and students retain First Amendment rights in schools under Tinker v. Des Moines', 'Document any disciplinary action taken under this law', 'Contact Lambda Legal or Equality Florida for legal assistance', 'File complaints with the Department of Education Office for Civil Rights'],
  '[{"org": "Lambda Legal", "phone": "(866) 542-8336", "web": "https://www.lambdalegal.org"}, {"org": "Equality Florida", "web": "https://www.eqfl.org"}]'::jsonb),

-- GEORGIA
('Georgia', 'Voter Suppression Provisions (SB 202)', 'SB 202 (2021) criminalizes giving food or water to voters in line, restricts mail ballot access, limits drop boxes, and allows state takeover of county election boards, conflicting with the Voting Rights Act and 14th/15th Amendments.', 'Fourteenth Amendment', '14th & 15th Amendments; Voting Rights Act of 1965 §2', 'Ga. Code Ann. § 21-2-414 (SB 202, 2021)', 'challenged', 'critical',
  ARRAY['The DOJ filed suit challenging this law in June 2021', 'If denied the right to vote, demand a provisional ballot', 'Document any voter intimidation on camera', 'Contact the Georgia NAACP voter protection hotline: 1-866-OUR-VOTE', 'Report to Election Protection at 866-OUR-VOTE'],
  '[{"org": "Georgia NAACP", "phone": "(404) 577-8977", "web": "https://www.naacpga.org"}, {"org": "Election Protection", "phone": "866-687-8683", "web": "https://866ourvote.org"}]'::jsonb),

-- INDIANA
('Indiana', 'Anti-Transgender Healthcare Ban (SB 480)', 'SB 480 (2023) bans gender-affirming medical care for minors, conflicting with 14th Amendment substantive due process and equal protection.', 'Fourteenth Amendment', '14th Amendment due process and equal protection; parents fundamental right to direct medical care', 'Ind. Code § 25-1-22 (SB 480, 2023)', 'challenged', 'high',
  ARRAY['Federal courts have blocked similar bans in other states', 'Contact the ACLU of Indiana for legal counsel', 'Document any denial of previously received medical care', 'File a complaint with HHS Office for Civil Rights'],
  '[{"org": "ACLU of Indiana", "phone": "(317) 635-4059", "web": "https://www.aclu-in.org"}, {"org": "Indiana Youth Group", "web": "https://www.indianayouthgroup.org"}]'::jsonb),

-- IOWA
('Iowa', 'Ag-Gag Law (Iowa Code § 717A.3A)', 'Iowa''s agricultural trespass law criminalizes undercover investigations at factory farms, restricting journalists and whistleblowers from documenting animal cruelty and food safety violations.', 'First Amendment', '1st Amendment freedom of the press; ALDF v. Reynolds (S.D. Iowa 2019) struck down prior version', 'Iowa Code § 717A.3A', 'challenged', 'high',
  ARRAY['Federal courts struck down Iowa''s first ag-gag law in 2019 as unconstitutional', 'Document any interference with reporting from public property', 'Contact the Animal Legal Defense Fund for support', 'Journalists can record from public roads and rights-of-way'],
  '[{"org": "Animal Legal Defense Fund", "web": "https://aldf.org"}, {"org": "Iowa ACLU", "phone": "(515) 243-3576", "web": "https://www.aclu-ia.org"}]'::jsonb),

-- LOUISIANA
('Louisiana', 'Critical Infrastructure Protection Act (HB 727)', 'HB 727 (2018) created enhanced felony penalties for trespassing near pipelines and other "critical infrastructure" during protests, targeting environmental and indigenous land defenders.', 'First Amendment', '1st Amendment right to peaceable assembly and protest', 'La. Rev. Stat. § 14:61 (HB 727, 2018)', 'active', 'high',
  ARRAY['Challenge the law as overbroad under the First Amendment', 'Document your location relative to the infrastructure on video', 'Contact the Center for Constitutional Rights', 'Louisiana ACLU has challenged similar enforcement'],
  '[{"org": "Louisiana ACLU", "phone": "(504) 522-0628", "web": "https://www.laaclu.org"}, {"org": "Center for Constitutional Rights", "web": "https://ccrjustice.org"}]'::jsonb),

-- MISSISSIPPI
('Mississippi', 'Religious Freedom Restoration Act (HB 1523)', 'HB 1523 (2016) allows government employees and businesses to refuse services based on religious beliefs about marriage and gender identity, conflicting with 14th Amendment equal protection.', 'Fourteenth Amendment', '14th Amendment equal protection; Romer v. Evans (1996)', 'Miss. Code Ann. § 11-62-1 et seq. (HB 1523, 2016)', 'active', 'high',
  ARRAY['Document any service refusal with date, time, location, and witnesses', 'File a complaint with the DOJ Civil Rights Division', 'Contact the Mississippi Center for Justice', 'The 5th Circuit reversed an injunction in 2018 but equal protection challenges remain viable'],
  '[{"org": "Mississippi Center for Justice", "phone": "(601) 352-2269", "web": "https://mscenterforjustice.org"}, {"org": "Campaign for Southern Equality", "web": "https://southernequality.org"}]'::jsonb),

('Mississippi', 'Qualified Immunity for Police Officers', 'Mississippi applies the federal qualified immunity doctrine broadly, making it nearly impossible for victims of police misconduct to hold officers personally liable in civil suits.', 'Fourth Amendment', '4th Amendment protection against unreasonable seizure; Bivens v. Six Unknown Named Agents (1971)', 'Harlow v. Fitzgerald (1982) applied via state court precedent', 'active', 'critical',
  ARRAY['File Section 1983 claims in federal court rather than state court', 'Document every detail of the encounter immediately after', 'File complaints with both the police department and the DOJ', 'Contact the Mississippi ACLU civil liberties hotline', 'Support legislative efforts to reform qualified immunity'],
  '[{"org": "Mississippi ACLU", "phone": "(601) 354-3408", "web": "https://www.aclu-ms.org"}, {"org": "Institute for Justice", "web": "https://ij.org"}]'::jsonb),

-- MISSOURI
('Missouri', 'Second Amendment Preservation Act (HB 85)', 'HB 85 (2021) attempts to nullify federal gun laws within Missouri and penalizes local police for cooperating with federal firearms enforcement, conflicting with the Supremacy Clause.', 'Supremacy Clause', 'U.S. Const. Art. VI, cl. 2 (Supremacy Clause); federal firearms laws', 'Mo. Rev. Stat. § 1.410 (HB 85, 2021)', 'challenged', 'high',
  ARRAY['A federal judge ruled the law unconstitutional in March 2023', 'Federal law enforcement can still enforce federal firearms laws in Missouri', 'Report nullification attempts to the DOJ', 'Contact Missouri ACLU for updates on the ongoing litigation'],
  '[{"org": "Missouri ACLU", "phone": "(314) 652-3114", "web": "https://www.aclu-mo.org"}]'::jsonb),

-- MONTANA
('Montana', 'Drag Show Restriction Act (SB 458)', 'SB 458 (2023) restricts "sexually oriented performances" in public spaces and near children, broadly defined in a way that could target protected artistic expression and LGBTQ+ events.', 'First Amendment', '1st Amendment freedom of expression; Schad v. Mount Ephraim (1981)', 'Mont. Code Ann. § 45-8-112 (SB 458, 2023)', 'challenged', 'high',
  ARRAY['This law uses overbroad definitions that could chill protected speech', 'Document any enforcement action and contact the ACLU immediately', 'The Supreme Court protects expressive performance art under the 1st Amendment', 'Challenge vagueness under the void-for-vagueness doctrine'],
  '[{"org": "ACLU of Montana", "phone": "(406) 443-8590", "web": "https://www.aclumontana.org"}]'::jsonb),

-- NORTH DAKOTA
('North Dakota', 'Anti-Protest Pipeline Law (HB 1293)', 'HB 1293 (2017, amended 2019) creates felony penalties for trespassing near pipeline construction sites, enacted in response to Standing Rock protests, chilling indigenous and environmental activism.', 'First Amendment', '1st Amendment assembly and petition rights', 'N.D. Cent. Code § 12.1-21-06 (HB 1293)', 'active', 'high',
  ARRAY['This law was enacted specifically to suppress pipeline protests', 'Document your distance from actual infrastructure', 'Contact the National Lawyers Guild legal observers', 'ACLU of North Dakota can provide rapid-response legal assistance'],
  '[{"org": "ACLU of North Dakota", "web": "https://www.aclu.org/affiliate/north-dakota"}, {"org": "Water Protector Legal Collective", "web": "https://waterprotectorlegal.org"}]'::jsonb),

-- OHIO
('Ohio', 'Fetal Heartbeat Abortion Ban (SB 23)', 'SB 23 bans abortion after detection of embryonic cardiac activity (~6 weeks), before many people know they are pregnant, conflicting with 14th Amendment substantive due process.', 'Fourteenth Amendment', '14th Amendment liberty and privacy rights; Roe v. Wade legacy; Planned Parenthood v. Casey', 'Ohio Rev. Code § 2919.195 (SB 23)', 'active', 'critical',
  ARRAY['Ohio voters approved a constitutional amendment protecting reproductive rights in Nov 2023', 'Contact the ACLU of Ohio for enforcement guidance post-amendment', 'Document any denial of healthcare and report to the state medical board', 'File complaints with the Ohio Attorney General if rights under the amendment are violated'],
  '[{"org": "ACLU of Ohio", "phone": "(614) 586-1972", "web": "https://www.acluohio.org"}, {"org": "Planned Parenthood Ohio", "web": "https://www.plannedparenthood.org/planned-parenthood-greater-ohio"}]'::jsonb),

-- OKLAHOMA
('Oklahoma', 'Anti-Protest Driver Immunity (HB 1674)', 'HB 1674 (2021) grants civil and criminal immunity to motorists who injure or kill protesters while "fleeing from a riot," creating a chilling effect on the right to protest.', 'First Amendment', '1st Amendment right to peaceable assembly; 14th Amendment due process', 'Okla. Stat. tit. 21 § 1320.12 (HB 1674, 2021)', 'active', 'critical',
  ARRAY['This law does not legalize deliberately running over protesters', 'Document any vehicular assault at a protest and contact police immediately', 'Contact the ACLU of Oklahoma to report enforcement of this law', 'File a Section 1983 suit if local government fails to protect protest rights'],
  '[{"org": "ACLU of Oklahoma", "phone": "(405) 524-8511", "web": "https://www.acluok.org"}]'::jsonb),

-- SOUTH DAKOTA
('South Dakota', 'Riot Boosting / Pipeline Protest Law', 'SB 189 (2019) created "riot boosting" penalties targeting organizations that fund or encourage protest activities near pipeline construction, directly chilling First Amendment associational rights.', 'First Amendment', '1st Amendment freedom of association; NAACP v. Claiborne Hardware (1982)', 'S.D. Codified Laws § 20-9-54 (SB 189, 2019)', 'challenged', 'high',
  ARRAY['The ACLU challenged this law and portions were struck down', 'Organizations have the right to fund and support lawful protest', 'Document any financial penalties or threats related to protest support', 'Contact the ACLU of South Dakota'],
  '[{"org": "ACLU of South Dakota", "web": "https://www.aclu.org/affiliate/south-dakota"}, {"org": "National Lawyers Guild", "web": "https://nlg.org"}]'::jsonb),

-- TENNESSEE
('Tennessee', 'Protest Camping Criminalization (HB 8005)', 'HB 8005 (2022) makes camping on state property a felony, enacted after racial justice protests on the Tennessee Capitol grounds, directly targeting protest encampments.', 'First Amendment', '1st Amendment assembly and petition rights; Clark v. Community for Creative Non-Violence (1984)', 'Tenn. Code Ann. § 39-14-414 (HB 8005, 2022)', 'active', 'critical',
  ARRAY['Making peaceful protest a felony is unconstitutional under the First Amendment', 'If arrested, invoke your right to remain silent and demand an attorney', 'Contact the ACLU of Tennessee immediately at (615) 320-7142', 'File a Section 1983 claim in federal court challenging the felony classification'],
  '[{"org": "ACLU of Tennessee", "phone": "(615) 320-7142", "web": "https://www.aclu-tn.org"}]'::jsonb),

('Tennessee', 'Anti-Drag Show Law (SB 3)', 'SB 3 (2023) banned "adult cabaret performances" in public or in the presence of minors, broadly targeting drag performances. A federal judge blocked the law as unconstitutional.', 'First Amendment', '1st Amendment freedom of expression; Reed v. Town of Gilbert (2015)', 'Tenn. Code Ann. § 7-51-1401 (SB 3, 2023)', 'struck_down', 'high',
  ARRAY['A federal judge struck this law down as unconstitutional in June 2023', 'If any local ordinance attempts to replicate this ban, contact the ACLU', 'Drag performance is protected artistic expression under the First Amendment', 'Document any harassment or interference and report to local civil rights organizations'],
  '[{"org": "ACLU of Tennessee", "phone": "(615) 320-7142", "web": "https://www.aclu-tn.org"}, {"org": "Tennessee Equality Project", "web": "https://www.tnep.org"}]'::jsonb),

-- TEXAS
('Texas', 'SB 8 Abortion Bounty Law', 'SB 8 (2021) created a private enforcement mechanism allowing any person to sue anyone who "aids or abets" an abortion, effectively deputizing citizens to enforce unconstitutional restrictions.', 'Fourteenth Amendment', '14th Amendment liberty; the private enforcement mechanism circumvents judicial review', 'Tex. Health & Safety Code § 171.201 (SB 8, 2021)', 'active', 'critical',
  ARRAY['The private enforcement mechanism was designed to evade federal court review', 'If sued under SB 8, contact the Center for Reproductive Rights immediately', 'Document any threats or lawsuits filed under this provision', 'Multiple legal challenges are ongoing in federal and state courts'],
  '[{"org": "Center for Reproductive Rights", "web": "https://reproductiverights.org"}, {"org": "ACLU of Texas", "phone": "(713) 942-8146", "web": "https://www.aclutx.org"}]'::jsonb),

('Texas', 'Anti-Protest Critical Infrastructure Law (HB 9)', 'HB 9 (2021) creates enhanced felony penalties for protests near oil/gas facilities and other critical infrastructure, with vague definitions that can be applied to peaceful demonstrations.', 'First Amendment', '1st Amendment right to peaceable assembly', 'Tex. Penal Code § 30.05 (HB 9, 2021)', 'active', 'high',
  ARRAY['Peaceful protest near public-facing infrastructure is protected by the First Amendment', 'Film everything and stay on public property', 'Contact the Texas Civil Rights Project for rapid legal assistance', 'Challenge vague "critical infrastructure" definitions under void-for-vagueness doctrine'],
  '[{"org": "Texas Civil Rights Project", "phone": "(512) 474-5073", "web": "https://txcivilrights.org"}, {"org": "ACLU of Texas", "phone": "(713) 942-8146", "web": "https://www.aclutx.org"}]'::jsonb),

('Texas', 'Social Media Censorship Law (HB 20)', 'HB 20 (2021) prohibits large social media platforms from removing content based on viewpoint, conflicting with the First Amendment rights of private companies to moderate content.', 'First Amendment', '1st Amendment; Miami Herald v. Tornillo (1974); Moody v. NetChoice (2024)', 'Tex. Bus. & Com. Code § 120.001 (HB 20, 2021)', 'challenged', 'medium',
  ARRAY['The Supreme Court sent this case back to lower courts for further review in 2024', 'Private companies have First Amendment editorial discretion', 'This law conflicts with Section 230 of the Communications Decency Act', 'Contact the Electronic Frontier Foundation for digital rights guidance'],
  '[{"org": "Electronic Frontier Foundation", "web": "https://www.eff.org"}, {"org": "ACLU of Texas", "phone": "(713) 942-8146", "web": "https://www.aclutx.org"}]'::jsonb),

-- UTAH
('Utah', 'Transgender Youth Healthcare Ban (SB 16)', 'SB 16 (2023) bans gender-affirming surgical procedures and hormone treatments for minors, conflicting with parental rights and 14th Amendment equal protection.', 'Fourteenth Amendment', '14th Amendment due process and equal protection', 'Utah Code § 58-68-502.5 (SB 16, 2023)', 'active', 'high',
  ARRAY['Federal courts have blocked similar bans in other states under equal protection', 'Contact the ACLU of Utah for legal assistance', 'Document any denial of previously prescribed medical treatment', 'File a complaint with HHS Office for Civil Rights'],
  '[{"org": "ACLU of Utah", "phone": "(801) 521-9862", "web": "https://www.acluutah.org"}, {"org": "Equality Utah", "web": "https://www.equalityutah.org"}]'::jsonb),

-- WEST VIRGINIA
('West Virginia', 'Anti-Protest Law (SB 6)', 'SB 6 (2021) increases penalties for protest-related offenses including blocking roads, damaging property during protests, and "intimidating" public officials, with vague definitions.', 'First Amendment', '1st Amendment right to peaceable assembly; Coates v. Cincinnati (1971)', 'W. Va. Code § 61-6-6b (SB 6, 2021)', 'active', 'high',
  ARRAY['Challenge "intimidation" provisions as unconstitutionally vague', 'Document all protest activity on video for legal protection', 'Contact the ACLU of West Virginia for legal assistance', 'File a Section 1983 claim if arrested for peaceful protest'],
  '[{"org": "ACLU of West Virginia", "phone": "(304) 345-9246", "web": "https://www.acluwv.org"}]'::jsonb)

ON CONFLICT DO NOTHING;

-- ─── 5. SEED NATIONAL REPORTING CONTACTS ────────────────────────────────────

INSERT INTO reporting_contacts (name, organization, contact_type, contact_value, category, scope, description, is_emergency, available_hours) VALUES
-- Police misconduct
('Civil Rights Division Complaint', 'U.S. Department of Justice', 'web', 'https://civilrights.justice.gov/report/', 'police_misconduct', 'national', 'File a federal civil rights complaint about police misconduct, excessive force, or pattern-and-practice violations.', false, 'Online 24/7'),
('FBI Civil Rights Tip Line', 'Federal Bureau of Investigation', 'phone', '1-800-CALL-FBI (1-800-225-5324)', 'police_misconduct', 'national', 'Report federal civil rights violations including police brutality, hate crimes, and color-of-law abuses.', true, '24/7'),
('ACLU National Legal Intake', 'American Civil Liberties Union', 'web', 'https://www.aclu.org/contact-us', 'police_misconduct', 'national', 'Submit a legal complaint to the ACLU for evaluation of potential civil rights violations.', false, 'Business hours'),
('National Police Accountability Project', 'National Lawyers Guild', 'web', 'https://www.nlg-npap.org/', 'police_misconduct', 'national', 'Find attorneys specializing in police misconduct cases and get referrals for Section 1983 litigation.', false, 'Business hours'),

-- Voting rights
('Election Protection Hotline', 'Lawyers Committee for Civil Rights', 'phone', '1-866-OUR-VOTE (1-866-687-8683)', 'voting_rights', 'national', 'Report voter intimidation, suppression, or any problems at the polls. Multilingual support available.', true, 'During elections'),
('DOJ Voting Section', 'U.S. Department of Justice', 'phone', '1-800-253-3931', 'voting_rights', 'national', 'Report voting rights violations including voter intimidation, poll access problems, and discriminatory voting laws.', true, '24/7 during elections'),

-- Press freedom
('Reporter Legal Defense Hotline', 'Reporters Committee for Freedom of the Press', 'phone', '1-800-336-4243', 'press_freedom', 'national', 'Emergency legal assistance for journalists facing arrest, subpoenas, or interference while reporting.', true, '24/7'),
('Press Freedom Tracker', 'Freedom of the Press Foundation', 'web', 'https://pressfreedomtracker.us/submit/', 'press_freedom', 'national', 'Report incidents of press freedom violations including arrests, equipment seizures, and interference.', false, 'Online 24/7'),
('Committee to Protect Journalists', 'Committee to Protect Journalists', 'email', 'report@cpj.org', 'press_freedom', 'national', 'Report threats, attacks, or legal actions against journalists in the United States.', false, 'Business hours'),

-- General civil rights
('Civil Rights Complaint', 'U.S. Department of Education OCR', 'web', 'https://ocrcas.ed.gov/', 'education_rights', 'national', 'File complaints about discrimination in education including Title VI, Title IX, and disability rights violations.', false, 'Online 24/7'),
('Fair Housing Complaint', 'U.S. Department of HUD', 'phone', '1-800-669-9777', 'housing_rights', 'national', 'Report housing discrimination based on race, color, religion, sex, disability, familial status, or national origin.', false, 'Business hours'),
('EEOC Charge of Discrimination', 'Equal Employment Opportunity Commission', 'web', 'https://www.eeoc.gov/filing-charge-discrimination', 'employment_rights', 'national', 'File workplace discrimination complaints based on race, color, religion, sex, national origin, age, disability.', false, 'Business hours'),
('Immigration Rights Hotline', 'National Immigrant Justice Center', 'phone', '(312) 660-1370', 'immigration_rights', 'national', 'Legal assistance for immigrants facing rights violations, detention, or deportation proceedings.', true, 'Business hours'),
('Trans Lifeline', 'Trans Lifeline', 'phone', '(877) 565-8860', 'lgbtq_rights', 'national', 'Crisis hotline run by trans people for trans people, including those facing discrimination and harassment.', true, '24/7'),
('NAACP Legal Defense Fund', 'NAACP LDF', 'web', 'https://www.naacpldf.org/take-action/', 'racial_justice', 'national', 'Report racial discrimination, police violence, and voter suppression for potential legal action.', false, 'Business hours')

ON CONFLICT DO NOTHING;
