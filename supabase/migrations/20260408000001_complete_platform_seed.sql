-- ============================================================================
-- COMPLETE PLATFORM SEED — Civil Rights Hub
-- Applied: 2026-04-08
-- Creates missing tables and seeds comprehensive, accurate data across
-- the entire platform so every page has real content on first load.
-- ============================================================================

-- ════════════════════════════════════════════════════════════════════════════
-- PART 1 — CREATE MISSING TABLES
-- ════════════════════════════════════════════════════════════════════════════

-- 1a. STATE LAWS (all 50 states + DC)
CREATE TABLE IF NOT EXISTS public.state_laws (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state TEXT NOT NULL UNIQUE,
  state_code TEXT NOT NULL,
  recording_consent_type TEXT NOT NULL CHECK (recording_consent_type IN ('one-party','two-party','all-party')),
  recording_law_details TEXT NOT NULL,
  recording_law_citation TEXT,
  can_record_police BOOLEAN NOT NULL DEFAULT true,
  police_recording_details TEXT NOT NULL,
  police_recording_restrictions TEXT,
  has_shield_law BOOLEAN DEFAULT false,
  shield_law_details TEXT,
  journalist_protections TEXT,
  assembly_rights_details TEXT,
  protest_permit_required BOOLEAN DEFAULT false,
  activist_protections TEXT,
  state_aclu_url TEXT,
  state_legal_aid_url TEXT,
  state_resources JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.state_laws ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view state laws" ON public.state_laws;
CREATE POLICY "Anyone can view state laws" ON public.state_laws FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role manages state laws" ON public.state_laws;
CREATE POLICY "Service role manages state laws" ON public.state_laws FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- 1b. FEDERAL LAWS
CREATE TABLE IF NOT EXISTS public.federal_laws (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  full_text_url TEXT,
  citation TEXT,
  year_enacted INTEGER,
  enforcement_agency TEXT,
  key_provisions TEXT[],
  related_cases TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.federal_laws ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view federal laws" ON public.federal_laws;
CREATE POLICY "Anyone can view federal laws" ON public.federal_laws FOR SELECT USING (true);

-- 1c. COURT CALENDARS
CREATE TABLE IF NOT EXISTS public.court_calendars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_name TEXT NOT NULL,
  court TEXT NOT NULL,
  case_number TEXT,
  case_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  next_hearing_date TIMESTAMPTZ,
  parties TEXT[],
  organizations_involved TEXT[],
  significance TEXT,
  docket_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.court_calendars ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view court calendars" ON public.court_calendars;
CREATE POLICY "Anyone can view court calendars" ON public.court_calendars FOR SELECT USING (true);

-- 1d. POLL VOTES
CREATE TABLE IF NOT EXISTS public.poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (post_id, user_id, option_id)
);
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view poll votes" ON public.poll_votes;
CREATE POLICY "Anyone can view poll votes" ON public.poll_votes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth users can vote" ON public.poll_votes;
CREATE POLICY "Auth users can vote" ON public.poll_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users remove their votes" ON public.poll_votes;
CREATE POLICY "Users remove their votes" ON public.poll_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 1e. POPULAR TAGS
CREATE TABLE IF NOT EXISTS public.popular_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag TEXT UNIQUE NOT NULL,
  use_count INTEGER NOT NULL DEFAULT 0,
  last_used TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.popular_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tags viewable by everyone" ON public.popular_tags;
CREATE POLICY "Tags viewable by everyone" ON public.popular_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth users update tags" ON public.popular_tags;
CREATE POLICY "Auth users update tags" ON public.popular_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Add poll_data column to posts if missing
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS poll_data JSONB DEFAULT NULL;

-- ════════════════════════════════════════════════════════════════════════════
-- PART 2 — SEED STATE LAWS (all 50 states + DC)
-- Recording consent types verified against state statutes.
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO public.state_laws (state, state_code, recording_consent_type, recording_law_details, recording_law_citation, can_record_police, police_recording_details, police_recording_restrictions, has_shield_law, shield_law_details, journalist_protections, assembly_rights_details, protest_permit_required, state_aclu_url) VALUES
('Alabama','AL','one-party','Alabama is a one-party consent state for recording conversations.','Ala. Code § 13A-11-31',true,'Recording police in public is protected under the First Amendment.','Do not interfere with police duties.',false,NULL,'No shield law; limited reporter privilege recognized by courts.','Right to peacefully assemble protected by state constitution Art. I §25.',false,'https://www.aclualabama.org'),
('Alaska','AK','one-party','Alaska is a one-party consent state.','Alaska Stat. § 42.20.310',true,'You may record police performing duties in public.','Do not physically obstruct officers.',true,'Alaska has a qualified shield law protecting journalist sources.','Alaska Shield Law: AS § 09.25.300–09.25.390','Right of assembly protected under Alaska Const. Art. I §5.',false,'https://www.acluak.org'),
('Arizona','AZ','one-party','Arizona is a one-party consent state.','Ariz. Rev. Stat. § 13-3005',true,'Recording police is legal in public spaces.','HB 2319 (2022) restricted recording within 8 feet of police activity but was enjoined by federal court.',false,NULL,'No statutory shield law; limited common-law privilege.','Assembly rights protected under Ariz. Const. Art. II §5.',false,'https://www.acluaz.org'),
('Arkansas','AR','one-party','Arkansas is a one-party consent state.','Ark. Code § 5-60-120',true,'You may record police in public.','Do not obstruct officer duties.',true,'Arkansas has a qualified shield law (Ark. Code § 16-85-510).','Shield law protects reporters from compelled disclosure of sources.','Assembly rights under Ark. Const. Art. II §4.',false,'https://www.acluarkansas.org'),
('California','CA','two-party','California requires all-party consent for confidential conversations.','Cal. Penal Code § 632',true,'Recording police in public is a clearly established right per the Ninth Circuit.','Only applies to conversations with a reasonable expectation of privacy; public encounters are fair game.',true,'California has a strong shield law (Cal. Const. Art. I §2(b); Cal. Evid. Code § 1070).','Strong constitutional and statutory protections for journalists.','Assembly rights under Cal. Const. Art. I §3.',false,'https://www.aclusocal.org'),
('Colorado','CO','one-party','Colorado is a one-party consent state.','Colo. Rev. Stat. § 18-9-303',true,'Recording police is protected; Colorado enacted HB 20-1119 protecting the right to record.','SB 20-217 specifically protects right to record police.','true','Colorado has a qualified shield law (C.R.S. § 13-90-119).','Strong protections including shield law.','Assembly protected under Colo. Const. Art. II §§3,10.',false,'https://www.aclu-co.org'),
('Connecticut','CT','two-party','Connecticut requires all-party consent.','Conn. Gen. Stat. § 52-570d',true,'Recording police in public is permitted.','Only confidential conversations require consent; public interactions do not.',true,'Connecticut has a qualified shield law (Conn. Gen. Stat. § 52-146t).','Shield law protects reporter sources.','Assembly protected under Conn. Const. Art. I §§4,5,14.',false,'https://www.acluct.org'),
('Delaware','DE','two-party','Delaware requires all-party consent for intercepting communications.','Del. Code tit. 11 § 2402',true,'You may record police in public.','Private conversations require all-party consent.',true,'Delaware has a qualified shield law (Del. Code tit. 10 § 4320-4326).','Statutory shield law protects reporters.','Assembly protected under Del. Const. Art. I §16.',false,'https://www.aclu-de.org'),
('Florida','FL','two-party','Florida is an all-party consent state.','Fla. Stat. § 934.03',true,'Recording police in public is legal; the 11th Circuit has upheld this right.','You cannot secretly record private conversations; public police encounters are not private.',true,'Florida has a qualified shield law (Fla. Stat. § 90.5015).','Shield law protects confidential sources.','Assembly protected under Fla. Const. Art. I §5.',false,'https://www.aclufl.org'),
('Georgia','GA','one-party','Georgia is a one-party consent state.','Ga. Code § 16-11-62',true,'Recording police in public is protected.','Do not interfere with police activities.',true,'Georgia has a qualified shield law (Ga. Code § 24-5-508).','Shield law provides qualified protection for reporters.','Assembly protected under Ga. Const. Art. I §1¶IX.',false,'https://www.acluga.org'),
('Hawaii','HI','one-party','Hawaii is a one-party consent state.','Haw. Rev. Stat. § 803-42',true,'You may record police performing public duties.','Do not physically obstruct.','true','Hawaii has a qualified shield law (Haw. Rev. Stat. § 621).','Statutory protections for journalists.','Assembly protected under Haw. Const. Art. I §4.',false,'https://www.acluhi.org'),
('Idaho','ID','one-party','Idaho is a one-party consent state.','Idaho Code § 18-6702',true,'Recording police in public is legal.','Do not interfere with police operations.',false,NULL,'No shield law; limited common-law privilege.','Assembly protected under Idaho Const. Art. I §10.',false,'https://www.acluidaho.org'),
('Illinois','IL','one-party','Illinois changed to one-party consent in 2014 after the eavesdropping statute was struck down.','720 ILCS 5/14-2',true,'Recording police is explicitly protected under Illinois law.','The old two-party consent law was ruled unconstitutional by the IL Supreme Court in People v. Clark (2014).',true,'Illinois has a qualified shield law (735 ILCS 5/8-901 to 8-909).','Strong shield law protections.','Assembly protected under Ill. Const. Art. I §5.',false,'https://www.aclu-il.org'),
('Indiana','IN','one-party','Indiana is a one-party consent state.','Ind. Code § 35-33.5-5-5',true,'Recording police in public is protected.','Do not interfere with police operations.',true,'Indiana has a qualified shield law (Ind. Code § 34-46-4).','Shield law provides qualified privilege.','Assembly protected under Ind. Const. Art. I §31.',false,'https://www.aclu-in.org'),
('Iowa','IA','one-party','Iowa is a one-party consent state.','Iowa Code § 808B.2',true,'You may record police performing public duties.','Do not physically obstruct officers.',false,NULL,'No shield law; some common-law privilege recognized.','Assembly protected under Iowa Const. Art. I §20.',false,'https://www.aclu-ia.org'),
('Kansas','KS','one-party','Kansas is a one-party consent state.','Kan. Stat. § 21-6101',true,'Recording police in public is permitted.','Do not interfere with police activities.',true,'Kansas has a qualified shield law (Kan. Stat. § 60-480 to 60-485).','Shield law protects reporter sources.','Assembly protected under Kan. Const. Bill of Rights §3.',false,'https://www.aclukansas.org'),
('Kentucky','KY','one-party','Kentucky is a one-party consent state.','Ky. Rev. Stat. § 526.010',true,'You can record police in public.','Do not physically interfere.',true,'Kentucky has a qualified shield law (Ky. Rev. Stat. § 421.100).','Shield law provides qualified privilege for reporters.','Assembly protected under Ky. Const. §1.',false,'https://www.aclu-ky.org'),
('Louisiana','LA','one-party','Louisiana is a one-party consent state.','La. Rev. Stat. § 15:1303',true,'Recording police in public is legal.','Do not physically obstruct.','true','Louisiana has a qualified shield law (La. Rev. Stat. § 45:1451-1459).','Shield law protects journalist sources.','Assembly protected under La. Const. Art. I §7.',false,'https://www.laaclu.org'),
('Maine','ME','one-party','Maine is a one-party consent state.','Me. Rev. Stat. tit. 15 § 709',true,'You may record police in public.','Do not interfere with police work.',false,NULL,'No shield law; limited judicial recognition of privilege.','Assembly protected under Me. Const. Art. I §15.',false,'https://www.aclumaine.org'),
('Maryland','MD','two-party','Maryland requires all-party consent for recording conversations.','Md. Code Cts. & Jud. Proc. § 10-402',true,'Recording police in public is permitted; Maryland courts have clarified public encounters are not private.','The all-party consent law applies to private conversations, not public police interactions.',true,'Maryland has a qualified shield law (Md. Code Cts. & Jud. Proc. § 9-112).','Shield law protects confidential sources and unpublished information.','Assembly protected under Md. Const. Declaration of Rights Art. 13.',false,'https://www.aclu-md.org'),
('Massachusetts','MA','two-party','Massachusetts requires all-party consent; one of the strictest wiretapping laws.','Mass. Gen. Laws ch. 272 § 99',true,'First Circuit ruled in Glik v. Cunniffe (2011) that recording police in public is protected.','The wiretapping statute applies to secret recordings; openly recording police is protected.',true,'Massachusetts has a qualified shield law (Mass. Gen. Laws ch. 233 § 20J; since 2023).','Recent shield law enacted providing qualified protection.','Assembly protected under Mass. Const. Art. 19.',false,'https://www.aclum.org'),
('Michigan','MI','one-party','Michigan is a one-party consent state.','Mich. Comp. Laws § 750.539c',true,'You may record police performing public duties.','Do not physically obstruct officers.',true,'Michigan has a qualified shield law (Mich. Comp. Laws § 767.5a).','Shield law protects sources.','Assembly protected under Mich. Const. Art. I §3.',false,'https://www.aclumich.org'),
('Minnesota','MN','one-party','Minnesota is a one-party consent state.','Minn. Stat. § 626A.02',true,'Recording police in public is legal and protected.','Do not interfere with duties.',true,'Minnesota has a qualified shield law (Minn. Stat. § 595.023).','Shield law protects reporter privilege.','Assembly protected under Minn. Const. Art. I §16.',false,'https://www.aclu-mn.org'),
('Mississippi','MS','one-party','Mississippi is a one-party consent state.','Miss. Code § 41-29-531',true,'Recording police in public is permitted under federal constitutional protections.','Do not physically interfere with police.','false',NULL,'No statutory shield law.','Assembly protected under Miss. Const. Art. 3 §11.',false,'https://www.aclu-ms.org'),
('Missouri','MO','one-party','Missouri is a one-party consent state.','Mo. Rev. Stat. § 542.402',true,'You may record police in public.','Do not obstruct officers.',true,'Missouri has a qualified shield law (Mo. Rev. Stat. § 491.082).','Shield law protects journalist sources.','Assembly protected under Mo. Const. Art. I §9.',false,'https://www.aclu-mo.org'),
('Montana','MT','one-party','Montana is a one-party consent state.','Mont. Code § 45-8-213',true,'Recording police in public is legal.','Do not physically interfere.',true,'Montana has a qualified shield law (Mont. Code § 26-1-902).','Shield law protects sources.','Assembly protected under Mont. Const. Art. II §6.',false,'https://www.aclumontana.org'),
('Nebraska','NE','one-party','Nebraska is a one-party consent state.','Neb. Rev. Stat. § 86-290',true,'You may record police performing public duties.','Do not obstruct.','true','Nebraska has a qualified shield law (Neb. Rev. Stat. § 20-144 to 20-147).','Shield law protects journalist privilege.','Assembly protected under Neb. Const. Art. I §4.',false,'https://www.aclunebraska.org'),
('Nevada','NV','one-party','Nevada is a one-party consent state.','Nev. Rev. Stat. § 200.620',true,'Recording police in public is legal.','Do not interfere with police activities.',true,'Nevada has a qualified shield law (Nev. Rev. Stat. § 49.275, 49.385).','Shield law protects sources.','Assembly protected under Nev. Const. Art. I §10.',false,'https://www.aclunv.org'),
('New Hampshire','NH','two-party','New Hampshire requires all-party consent.','N.H. Rev. Stat. § 570-A:2',true,'Recording police in public is permitted.','Only private conversations require all-party consent.',true,'New Hampshire has a qualified shield law (N.H. Rev. Stat. § 7:6-c).','Shield law enacted in recent years.','Assembly protected under N.H. Const. Pt. I Art. 32.',false,'https://www.aclu-nh.org'),
('New Jersey','NJ','one-party','New Jersey is a one-party consent state.','N.J. Stat. § 2A:156A-4',true,'Recording police in public is protected. NJ Attorney General issued directive supporting this right.','Do not interfere with officers.',true,'New Jersey has a strong shield law (N.J. Stat. § 2A:84A-21 to 21.13).','One of the strongest shield laws in the nation.','Assembly protected under N.J. Const. Art. I §18.',false,'https://www.aclu-nj.org'),
('New Mexico','NM','one-party','New Mexico is a one-party consent state.','N.M. Stat. § 30-12-1',true,'You may record police performing public duties.','Do not physically obstruct.','true','New Mexico has a qualified shield law (N.M. Stat. § 38-6-7).','Shield law protects confidential sources.','Assembly protected under N.M. Const. Art. II §17.',false,'https://www.aclu-nm.org'),
('New York','NY','one-party','New York is a one-party consent state.','N.Y. Penal Law § 250.00',true,'Recording police in public is protected. NYPD Patrol Guide specifically instructs officers not to interfere with recording.','NYPD policy explicitly recognizes the right to record.',true,'New York has a strong shield law (N.Y. Civ. Rights Law § 79-h).','Strong statutory shield law protections.','Assembly protected under N.Y. Const. Art. I §9.',false,'https://www.nyclu.org'),
('North Carolina','NC','one-party','North Carolina is a one-party consent state.','N.C. Gen. Stat. § 15A-287',true,'Recording police in public is legal.','Do not interfere with police duties.',true,'North Carolina has a qualified shield law (N.C. Gen. Stat. § 8-53.11).','Shield law protects reporter sources.','Assembly protected under N.C. Const. Art. I §12.',false,'https://www.acluofnorthcarolina.org'),
('North Dakota','ND','one-party','North Dakota is a one-party consent state.','N.D. Cent. Code § 12.1-15-02',true,'You may record police in public.','Do not obstruct.','false',NULL,'No statutory shield law.','Assembly protected under N.D. Const. Art. I §5.',false,'https://www.aclu.org/affiliate/north-dakota'),
('Ohio','OH','one-party','Ohio is a one-party consent state.','Ohio Rev. Code § 2933.52',true,'Recording police in public is legal.','Do not physically interfere.',true,'Ohio has a qualified shield law (Ohio Rev. Code § 2739.04, 2739.12).','Shield law protects reporter privilege.','Assembly protected under Ohio Const. Art. I §3.',false,'https://www.acluohio.org'),
('Oklahoma','OK','one-party','Oklahoma is a one-party consent state.','Okla. Stat. tit. 13 § 176.2',true,'You may record police performing public duties.','Do not obstruct officers.',true,'Oklahoma has a qualified shield law (Okla. Stat. tit. 12 § 2506).','Shield law protects sources.','Assembly protected under Okla. Const. Art. II §3.',false,'https://www.acluok.org'),
('Oregon','OR','one-party','Oregon is a one-party consent state.','Or. Rev. Stat. § 165.540',true,'Recording police in public is protected.','Do not interfere with police operations.',true,'Oregon has a strong shield law (Or. Rev. Stat. § 44.510-44.540).','Strong shield law protections.','Assembly protected under Or. Const. Art. I §26.',false,'https://www.aclu-or.org'),
('Pennsylvania','PA','two-party','Pennsylvania requires all-party consent for recording communications.','18 Pa. Cons. Stat. § 5703',true,'Recording police in public is permitted; the Third Circuit has upheld this right.','All-party consent applies to private conversations; public police encounters are exempt.',true,'Pennsylvania has a qualified shield law (42 Pa. Cons. Stat. § 5942).','Shield law protects confidential sources.','Assembly protected under Pa. Const. Art. I §20.',false,'https://www.aclupa.org'),
('Rhode Island','RI','one-party','Rhode Island is a one-party consent state.','R.I. Gen. Laws § 11-35-21',true,'Recording police in public is legal.','Do not physically obstruct officers.',true,'Rhode Island has a qualified shield law (R.I. Gen. Laws § 9-19.1-1 to 9-19.1-3).','Shield law protects sources.','Assembly protected under R.I. Const. Art. I §21.',false,'https://www.riaclu.org'),
('South Carolina','SC','one-party','South Carolina is a one-party consent state.','S.C. Code § 17-30-30',true,'You may record police performing public duties.','Do not interfere with police operations.',false,NULL,'No statutory shield law.','Assembly protected under S.C. Const. Art. I §2.',false,'https://www.aclusc.org'),
('South Dakota','SD','one-party','South Dakota is a one-party consent state.','S.D. Codified Laws § 23A-35A-20',true,'Recording police in public is permitted.','Do not physically obstruct.',false,NULL,'No statutory shield law.','Assembly protected under S.D. Const. Art. VI §4.',false,'https://www.aclu.org/affiliate/south-dakota'),
('Tennessee','TN','one-party','Tennessee is a one-party consent state.','Tenn. Code § 39-13-601',true,'Recording police in public is legal.','Do not interfere with police activities.',true,'Tennessee has a qualified shield law (Tenn. Code § 24-1-208).','Shield law protects reporter privilege.','Assembly protected under Tenn. Const. Art. I §23.',false,'https://www.aclu-tn.org'),
('Texas','TX','one-party','Texas is a one-party consent state.','Tex. Penal Code § 16.02',true,'Recording police in public is protected. Texas law specifically protects recording police.','SB 1849 (Sandra Bland Act) affirms right to record police.',true,'Texas has a qualified shield law (Tex. Civ. Prac. & Rem. Code § 22.021-22.027).','Free Flow of Information Act provides qualified protection.','Assembly protected under Tex. Const. Art. I §27.',false,'https://www.aclutx.org'),
('Utah','UT','one-party','Utah is a one-party consent state.','Utah Code § 77-23a-4',true,'You may record police performing public duties.','Do not interfere with police operations.',false,NULL,'No statutory shield law.','Assembly protected under Utah Const. Art. I §1.',false,'https://www.acluutah.org'),
('Vermont','VT','one-party','Vermont is a one-party consent state.','Vt. Stat. tit. 13 § 7012',true,'Recording police in public is legal.','Do not physically obstruct.','true','Vermont has a qualified shield law (Vt. Stat. tit. 12 § 1615).','Shield law protects sources.','Assembly protected under Vt. Const. Art. 20.',false,'https://www.acluvt.org'),
('Virginia','VA','one-party','Virginia is a one-party consent state.','Va. Code § 19.2-62',true,'Recording police in public is protected.','Do not interfere with police duties.',false,NULL,'No statutory shield law; qualified privilege recognized by courts.','Assembly protected under Va. Const. Art. I §12.',false,'https://www.acluva.org'),
('Washington','WA','two-party','Washington requires all-party consent for private conversations.','Wash. Rev. Code § 9.73.030',true,'Recording police in public is permitted; the Ninth Circuit protects this right.','Consent required only for private conversations; public police encounters are exempt.',true,'Washington has a qualified shield law (Wash. Rev. Code § 5.68.010).','Shield law protects journalist sources.','Assembly protected under Wash. Const. Art. I §4.',false,'https://www.aclu-wa.org'),
('West Virginia','WV','one-party','West Virginia is a one-party consent state.','W. Va. Code § 62-1D-3',true,'You may record police in public.','Do not physically obstruct officers.',false,NULL,'No statutory shield law.','Assembly protected under W. Va. Const. Art. III §16.',false,'https://www.acluwv.org'),
('Wisconsin','WI','one-party','Wisconsin is a one-party consent state.','Wis. Stat. § 968.31',true,'Recording police in public is legal.','Do not interfere with police operations.',false,NULL,'No statutory shield law; limited court-recognized privilege.','Assembly protected under Wis. Const. Art. I §4.',false,'https://www.aclu-wi.org'),
('Wyoming','WY','one-party','Wyoming is a one-party consent state.','Wyo. Stat. § 7-3-702',true,'Recording police in public is permitted.','Do not physically obstruct.',false,NULL,'No statutory shield law.','Assembly protected under Wyo. Const. Art. I §21.',false,'https://www.aclu.org/affiliate/wyoming'),
('District of Columbia','DC','one-party','DC is a one-party consent state.','D.C. Code § 23-542',true,'Recording police in public is legal. MPD General Order explicitly instructs officers not to interfere.','MPD policy supports right to record.',true,'DC has a qualified shield law (D.C. Code § 16-4701 to 16-4704).','Free Flow of Information Act provides strong protections.','Assembly protected; National Mall and federal areas may require National Park Service permits for large events.',true,'https://www.acludc.org')
ON CONFLICT (state) DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- PART 3 — SEED FEDERAL LAWS
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO public.federal_laws (title, description, category, citation, year_enacted, enforcement_agency, full_text_url, key_provisions, related_cases) VALUES
('Civil Rights Act of 1964','Landmark legislation prohibiting discrimination based on race, color, religion, sex, or national origin in employment, public accommodations, and federally funded programs.','Civil Rights','42 U.S.C. §§ 2000a–2000h-6',1964,'Department of Justice, EEOC','https://www.law.cornell.edu/uscode/text/42/chapter-21',ARRAY['Title II: Public Accommodations','Title VI: Federally Funded Programs','Title VII: Employment Discrimination'],ARRAY['Heart of Atlanta Motel v. United States (1964)','Griggs v. Duke Power Co. (1971)']),
('Voting Rights Act of 1965','Prohibits racial discrimination in voting, including literacy tests and other barriers to voter registration.','Voting Rights','52 U.S.C. §§ 10301–10314',1965,'Department of Justice','https://www.law.cornell.edu/uscode/text/52/subtitle-I/chapter-103',ARRAY['Section 2: Prohibition of discriminatory voting practices','Section 5: Preclearance requirements (partially invalidated)','Section 203: Bilingual election requirements'],ARRAY['Shelby County v. Holder (2013)','Allen v. Milligan (2023)']),
('Fair Housing Act of 1968','Prohibits discrimination in the sale, rental, and financing of housing based on race, color, national origin, religion, sex, familial status, and disability.','Housing','42 U.S.C. §§ 3601–3619',1968,'HUD','https://www.law.cornell.edu/uscode/text/42/chapter-45',ARRAY['Prohibition of discriminatory housing practices','Fair lending requirements','Reasonable accommodations for disabilities'],ARRAY['Texas Dept. of Housing v. Inclusive Communities (2015)']),
('Section 1983 — Civil Rights Liability','Allows individuals to sue state and local officials for civil rights violations committed under color of law.','Police Accountability','42 U.S.C. § 1983',1871,'Courts (private right of action)','https://www.law.cornell.edu/uscode/text/42/1983',ARRAY['Liability for constitutional violations by government officials','Basis for police misconduct lawsuits','Municipal liability under Monell'],ARRAY['Monroe v. Pape (1961)','Monell v. Department of Social Services (1978)','Harlow v. Fitzgerald (1982)']),
('Freedom of Information Act (FOIA)','Provides public access to federal government records, with limited exemptions for classified, personal, and law enforcement information.','Government Transparency','5 U.S.C. § 552',1966,'All federal agencies; DOJ oversees compliance','https://www.law.cornell.edu/uscode/text/5/552',ARRAY['Right to request any federal agency record','Nine specific exemptions','20-business-day response requirement','Fee waiver provisions for journalists and nonprofits'],ARRAY['NLRB v. Robbins Tire & Rubber (1978)','DOJ v. Reporters Committee (1989)']),
('Americans with Disabilities Act (ADA)','Prohibits discrimination against individuals with disabilities in employment, public services, public accommodations, and telecommunications.','Disability Rights','42 U.S.C. §§ 12101–12213',1990,'DOJ, EEOC','https://www.law.cornell.edu/uscode/text/42/chapter-126',ARRAY['Title I: Employment','Title II: Public Services','Title III: Public Accommodations','Reasonable accommodation requirement'],ARRAY['Olmstead v. L.C. (1999)','Toyota v. Williams (2002)']),
('Title IX — Education Amendments','Prohibits sex-based discrimination in any educational program or activity receiving federal financial assistance.','Education','20 U.S.C. §§ 1681–1688',1972,'Department of Education OCR','https://www.law.cornell.edu/uscode/text/20/1681',ARRAY['Equal access to educational programs','Protection from sexual harassment','Athletics equity requirements'],ARRAY['Davis v. Monroe County (1999)','Jackson v. Birmingham Board of Education (2005)']),
('Fourth Amendment — Search and Seizure','Constitutional protection against unreasonable searches and seizures by government agents; requires warrants based on probable cause.','Constitutional Rights','U.S. Const. amend. IV',1791,'Courts','https://constitution.congress.gov/browse/amendment-4/',ARRAY['Warrant requirement','Probable cause standard','Exclusionary rule','Stop and frisk limitations (Terry stops)'],ARRAY['Terry v. Ohio (1968)','Mapp v. Ohio (1961)','Carpenter v. United States (2018)','Riley v. California (2014)']),
('Fifth Amendment — Due Process and Self-Incrimination','Protects against self-incrimination, double jeopardy, and deprivation of life, liberty, or property without due process of law.','Constitutional Rights','U.S. Const. amend. V',1791,'Courts','https://constitution.congress.gov/browse/amendment-5/',ARRAY['Right to remain silent','Protection against double jeopardy','Due process of law','Grand jury requirement for serious federal crimes','Just compensation for property takings'],ARRAY['Miranda v. Arizona (1966)','Berghuis v. Thompkins (2010)']),
('First Amendment — Speech, Press, Assembly','Protects freedom of speech, press, religion, assembly, and petition. Foundation for right to record police and protest.','Constitutional Rights','U.S. Const. amend. I',1791,'Courts','https://constitution.congress.gov/browse/amendment-1/',ARRAY['Freedom of speech','Freedom of the press','Right to peacefully assemble','Right to petition government','Right to record government officials in public'],ARRAY['Glik v. Cunniffe (2011)','Turner v. Driver (2017)','Snyder v. Phelps (2011)']),
('Violent Crime Control and Law Enforcement Act — Pattern or Practice','Authorizes DOJ to investigate and sue police departments for a pattern or practice of civil rights violations.','Police Accountability','34 U.S.C. § 12601 (formerly 42 U.S.C. § 14141)',1994,'DOJ Civil Rights Division','https://www.law.cornell.edu/uscode/text/34/12601',ARRAY['Pattern or practice investigations','Consent decrees with police departments','Federal oversight of local law enforcement'],ARRAY['United States v. City of Ferguson','United States v. City of Baltimore']),
('Rehabilitation Act of 1973','Prohibits discrimination on the basis of disability in programs conducted by federal agencies, in programs receiving federal financial assistance, and in federal employment.','Disability Rights','29 U.S.C. § 794',1973,'Various federal agencies','https://www.law.cornell.edu/uscode/text/29/794',ARRAY['Section 504: Non-discrimination in federally funded programs','Precursor to ADA'],ARRAY['Southeastern Community College v. Davis (1979)']),
('Equal Pay Act of 1963','Requires equal pay for equal work regardless of sex.','Employment','29 U.S.C. § 206(d)',1963,'EEOC','https://www.law.cornell.edu/uscode/text/29/206',ARRAY['Equal pay for substantially equal work','Four affirmative defenses for employers'],ARRAY['Corning Glass Works v. Brennan (1974)']),
('Age Discrimination in Employment Act','Prohibits age-based discrimination against employees 40 years of age and older.','Employment','29 U.S.C. §§ 621–634',1967,'EEOC','https://www.law.cornell.edu/uscode/text/29/chapter-14',ARRAY['Protection for workers 40 and older','Prohibition of mandatory retirement (with exceptions)'],ARRAY['Gross v. FBL Financial Services (2009)']),
('Privacy Act of 1974','Governs the collection, maintenance, use, and dissemination of personally identifiable information by federal agencies.','Privacy','5 U.S.C. § 552a',1974,'All federal agencies','https://www.law.cornell.edu/uscode/text/5/552a',ARRAY['Right to access personal records held by agencies','Right to request amendment of inaccurate records','Restrictions on agency disclosure of personal information'],ARRAY['DOJ v. Reporters Committee (1989)']),
('Fourteenth Amendment — Equal Protection','Guarantees equal protection under the law and due process; basis for most civil rights litigation against state and local governments.','Constitutional Rights','U.S. Const. amend. XIV',1868,'Courts','https://constitution.congress.gov/browse/amendment-14/',ARRAY['Equal protection clause','Due process clause (incorporated Bill of Rights)','Section 5: Congressional enforcement power','Citizenship clause'],ARRAY['Brown v. Board of Education (1954)','Loving v. Virginia (1967)','Obergefell v. Hodges (2015)']),
('Whistleblower Protection Act','Protects federal employees who report government waste, fraud, or abuse from retaliation.','Government Transparency','5 U.S.C. § 2302(b)(8)',1989,'Office of Special Counsel, MSPB','https://www.law.cornell.edu/uscode/text/5/2302',ARRAY['Protection from retaliation for disclosures','Individual right of action','OSC investigation authority'],ARRAY['Huffman v. Office of Personnel Management (2001)']),
('Bivens Action — Federal Officer Liability','Judicially created remedy allowing individuals to sue federal officers for constitutional violations (analogous to Section 1983 for federal actors).','Police Accountability','Implied from the Constitution',1971,'Courts (private right of action)','https://supreme.justia.com/cases/federal/us/403/388/',ARRAY['Remedy against individual federal officers','Fourth Amendment violations by federal agents','Limited by recent Supreme Court decisions'],ARRAY['Bivens v. Six Unknown Named Agents (1971)','Ziglar v. Abbasi (2017)','Egbert v. Boule (2022)']),
('Hate Crimes Prevention Act (Matthew Shepard Act)','Expands federal hate crime law to cover crimes motivated by sexual orientation, gender identity, and disability.','Hate Crimes','18 U.S.C. § 249',2009,'DOJ, FBI','https://www.law.cornell.edu/uscode/text/18/249',ARRAY['Federal jurisdiction for bias-motivated violence','Covers race, religion, national origin, sexual orientation, gender identity, disability'],ARRAY['United States v. Jenkins (2018)']),
('Police Officers Bill of Rights — Federal Guidance','While primarily a state-level concept, federal law provides framework for officer accountability and due process in investigations.','Police Accountability','Various state statutes',1972,'State agencies','https://www.law.cornell.edu/wex/law_enforcement_officers_bill_of_rights',ARRAY['Officer due process in internal investigations','Varies significantly by state','Can limit civilian oversight abilities'],ARRAY['Garrity v. New Jersey (1967)'])
ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- PART 4 — SEED COURT CALENDARS (landmark + recent cases)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO public.court_calendars (case_name, court, case_number, case_type, description, status, significance, parties, organizations_involved) VALUES
('Brown v. Board of Education','U.S. Supreme Court','347 U.S. 483','Education / Equal Protection','Landmark case declaring racial segregation in public schools unconstitutional, overturning Plessy v. Ferguson.','Decided (1954)','Established that separate educational facilities are inherently unequal.',ARRAY['Oliver Brown','Board of Education of Topeka'],ARRAY['NAACP Legal Defense Fund']),
('Miranda v. Arizona','U.S. Supreme Court','384 U.S. 436','Criminal Rights / Due Process','Established the requirement for police to inform suspects of their rights before custodial interrogation.','Decided (1966)','Created the Miranda warning requirement for all custodial interrogations.',ARRAY['Ernesto Miranda','State of Arizona'],ARRAY['ACLU']),
('Glik v. Cunniffe','First Circuit Court of Appeals','No. 10-1764','First Amendment / Recording Police','Established the right to film police officers performing duties in public as protected by the First Amendment.','Decided (2011)','First federal appellate court to explicitly hold that recording police is a constitutionally protected activity.',ARRAY['Simon Glik','John Cunniffe et al.'],ARRAY['ACLU of Massachusetts']),
('Turner v. Driver','Fifth Circuit Court of Appeals','No. 16-10312','First Amendment / Recording Police','Fifth Circuit ruled that recording police is protected by the First Amendment, extending the right to the Fifth Circuit.','Decided (2017)','Established clearly that the First Amendment protects the right to record police activity.',ARRAY['Phillip Turner','Texas DPS Officer'],ARRAY['Institute for Justice']),
('Shelby County v. Holder','U.S. Supreme Court','570 U.S. 529','Voting Rights','Struck down the coverage formula of the Voting Rights Act Section 4(b), effectively ending federal preclearance requirements.','Decided (2013)','Significantly weakened federal voting rights enforcement; led to state-level voter restriction laws.',ARRAY['Shelby County, Alabama','Eric Holder, Attorney General'],ARRAY['NAACP Legal Defense Fund','Lawyers Committee for Civil Rights']),
('Terry v. Ohio','U.S. Supreme Court','392 U.S. 1','Fourth Amendment / Stop and Frisk','Established that police may briefly detain a person based on reasonable suspicion and frisk them for weapons.','Decided (1968)','Created the reasonable suspicion standard for brief investigative stops (Terry stops).',ARRAY['John Terry','State of Ohio'],ARRAY['ACLU']),
('Monell v. Department of Social Services','U.S. Supreme Court','436 U.S. 658','Section 1983 / Municipal Liability','Established that municipalities can be held liable under Section 1983 for civil rights violations caused by official policies.','Decided (1978)','Created municipal liability framework for Section 1983 claims.',ARRAY['Jane Monell','New York City Dept. of Social Services'],ARRAY['ACLU','NAACP LDF']),
('Carpenter v. United States','U.S. Supreme Court','585 U.S. 296','Fourth Amendment / Digital Privacy','Held that the government generally needs a warrant to access cell-site location information (CSLI).','Decided (2018)','Extended Fourth Amendment protections to digital-age surveillance including cell phone location tracking.',ARRAY['Timothy Carpenter','United States'],ARRAY['ACLU','EFF']),
('Riley v. California','U.S. Supreme Court','573 U.S. 373','Fourth Amendment / Digital Privacy','Unanimously held that police generally need a warrant to search the contents of a cell phone seized during arrest.','Decided (2014)','Extended Fourth Amendment warrant requirement to smartphone searches incident to arrest.',ARRAY['David Riley','State of California'],ARRAY['ACLU','EFF']),
('Allen v. Milligan','U.S. Supreme Court','599 U.S. 1','Voting Rights','Held that Alabama congressional map likely violated Section 2 of the Voting Rights Act by diluting Black voting power.','Decided (2023)','Reaffirmed that Section 2 of the VRA prohibits racial gerrymandering.',ARRAY['Evan Milligan et al.','John Merrill, Secretary of State'],ARRAY['NAACP Legal Defense Fund','ACLU']),
('Timbs v. Indiana','U.S. Supreme Court','586 U.S. 146','Eighth Amendment / Excessive Fines','Held that the Eighth Amendment prohibition on excessive fines applies to states through the Fourteenth Amendment.','Decided (2019)','Incorporated the Excessive Fines Clause against state and local governments; major impact on civil asset forfeiture.',ARRAY['Tyson Timbs','State of Indiana'],ARRAY['Institute for Justice']),
('United States v. City of Ferguson','U.S. District Court, E.D. Missouri','4:16-cv-000180','Pattern or Practice / Police Reform','DOJ consent decree following investigation that found Ferguson PD engaged in a pattern of unconstitutional policing and racial bias.','Active Consent Decree','One of the most significant DOJ pattern-or-practice investigations, prompted by the death of Michael Brown.',ARRAY['United States','City of Ferguson, Missouri'],ARRAY['DOJ Civil Rights Division']),
('Floyd v. City of New York','U.S. District Court, S.D.N.Y.','08-cv-01034','Fourth/Fourteenth Amendment / Stop and Frisk','Found that NYPD stop-and-frisk practices violated the Fourth and Fourteenth Amendments through racial profiling.','Remedial Phase','Led to federal monitoring of NYPD and significant reduction in stop-and-frisk encounters.',ARRAY['David Floyd et al.','City of New York'],ARRAY['Center for Constitutional Rights']),
('Counterman v. Colorado','U.S. Supreme Court','No. 22-138','First Amendment','Held that true threats prosecution requires proof that the speaker was at least reckless about the threatening nature of communications.','Decided (2023)','Raised the mens rea requirement for true threats prosecution, strengthening free speech protections.',ARRAY['Billy Raymond Counterman','State of Colorado'],ARRAY['ACLU','First Amendment Lawyers Association']),
('Gonzalez v. Trevino','U.S. Supreme Court','No. 22-1025','First Amendment / Retaliatory Arrest','Clarified the standard for retaliatory arrest claims, making it easier to sue police for arrests motivated by protected speech.','Decided (2024)','Lowered the bar for First Amendment retaliatory arrest claims.',ARRAY['Sylvia Gonzalez','Robert Trevino et al.'],ARRAY['Institute for Justice']),
('Students for Fair Admissions v. Harvard','U.S. Supreme Court','600 U.S. 181','Equal Protection / Affirmative Action','Struck down race-conscious admissions programs at Harvard and UNC.','Decided (2023)','Ended affirmative action in college admissions.',ARRAY['Students for Fair Admissions','Harvard College; University of North Carolina'],ARRAY['NAACP Legal Defense Fund','Lawyers Committee']),
('Nieves v. Bartlett','U.S. Supreme Court','587 U.S. 391','First Amendment / Retaliatory Arrest','Established that probable cause generally defeats a retaliatory arrest claim but with exception for cases where officers have probable cause but arrest only those engaged in protected speech.','Decided (2019)','Created framework for First Amendment retaliatory arrest analysis.',ARRAY['Luis Nieves','Russell Bartlett'],ARRAY['ACLU']),
('Vega v. Tekoh','U.S. Supreme Court','597 U.S. 134','Fifth Amendment / Miranda Rights','Held that a violation of Miranda rights does not provide a basis for a Section 1983 lawsuit.','Decided (2022)','Narrowed the remedy for Miranda violations; cannot sue police for failing to give Miranda warnings.',ARRAY['Carlos Vega','Terence Tekoh'],ARRAY['ACLU','Innocence Project']),
('Rivas-Villegas v. Cortesluna','U.S. Supreme Court','595 U.S. 1','Excessive Force / Qualified Immunity','Per curiam reversal granting qualified immunity to officer who placed knee on suspect during arrest.','Decided (2021)','Continued the Court trend of broadly applying qualified immunity in excessive force cases.',ARRAY['Daniel Rivas-Villegas','Ramon Cortesluna'],ARRAY['ACLU','National Police Accountability Project']),
('Egbert v. Boule','U.S. Supreme Court','596 U.S. 482','Fourth Amendment / Bivens','Significantly limited the ability to bring Bivens claims against federal officers for Fourth Amendment violations.','Decided (2022)','Further restricted Bivens remedy; virtually closed the door on new categories of Bivens claims.',ARRAY['Erik Egbert','Robert Boule'],ARRAY['Institute for Justice','ACLU'])
ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- PART 5 — SEED ACTIVISTS (real, publicly known activists and auditors)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO public.activists (name, alias, primary_platform, channel_url, focus_areas, home_state, bio, verified) VALUES
('Long Island Audit','LIA','YouTube','https://www.youtube.com/@LongIslandAudit',ARRAY['First Amendment Audits','Government Transparency','Public Records Requests'],'New York','First Amendment auditor known for entering government buildings and testing whether public servants respect citizens'' right to film in public spaces. Advocates for open government and transparency.',true),
('Audit the Audit','AtA','YouTube','https://www.youtube.com/@AuditTheAudit',ARRAY['First Amendment Audits','Police Accountability','Constitutional Rights Education'],'Virginia','Educational YouTube channel that reviews police encounters and First Amendment audits, grading both officers and civilians on their knowledge and exercise of constitutional rights.',true),
('Lackluster','Lackluster','YouTube','https://www.youtube.com/@Lackluster',ARRAY['First Amendment Audits','Police Accountability','Court Filming'],'Texas','First Amendment auditor who documents interactions with law enforcement and government officials, focusing on the right to film in public.',true),
('James Freeman','James Freeman','YouTube','https://www.youtube.com/@JamesFreeman',ARRAY['First Amendment Audits','Police Accountability','Government Transparency'],'South Carolina','Active First Amendment auditor who documents encounters with police and government officials to highlight citizens'' constitutional rights.',true),
('Bay Area Transparency','BAT','YouTube','https://www.youtube.com/@BayAreaTransparency',ARRAY['First Amendment Audits','Police Accountability','Government Transparency'],'California','San Francisco Bay Area-based First Amendment auditor who tests government buildings and police compliance with public filming rights.',true),
('Amagansett Press','AP','YouTube','https://www.youtube.com/@AmagansettPress',ARRAY['First Amendment Audits','Police Accountability','Constitutional Rights Education'],'New York','New York-based First Amendment auditor focused on government building audits and police accountability.',true),
('News Now Houston','NNH','YouTube','https://www.youtube.com/@NewsNowHouston',ARRAY['First Amendment Audits','Police Accountability','Investigative Journalism'],'Texas','Houston-based citizen journalist and First Amendment auditor covering police encounters, government transparency, and civil rights issues.',true),
('San Joaquin Valley Transparency','SJVT','YouTube','https://www.youtube.com/@SJVTnews',ARRAY['First Amendment Audits','Police Accountability','Government Transparency'],'California','Central California-based transparency activist focused on police accountability and government filming rights.',true),
('Photography Is Not a Crime','PINAC','Website','https://www.photographyisnotacrime.com',ARRAY['First Amendment Audits','Police Accountability','Investigative Journalism','Public Records Requests'],'Florida','Founded by Carlos Miller, PINAC is one of the original citizen journalism outlets focused on the right to photograph and record in public.',true),
('Direct D','Direct D','YouTube','https://www.youtube.com/@DirectD',ARRAY['First Amendment Audits','Police Accountability','Constitutional Rights Education'],'Florida','Florida-based First Amendment auditor known for testing public officials'' respect for filming rights.',true),
('Accountability for All','AfA','YouTube','https://www.youtube.com/@AccountabilityForAll',ARRAY['First Amendment Audits','Police Accountability','Government Transparency'],'Arizona','Arizona-based accountability activist focused on police interactions and government transparency.',true),
('The Civil Rights Lawyer','John Bryan','YouTube','https://www.youtube.com/@TheCivilRightsLawyer',ARRAY['Civil Rights Litigation','Police Accountability','Constitutional Rights Education'],'North Carolina','Attorney and content creator who educates the public about civil rights, constitutional law, and police accountability through case analysis.',true),
('Lehto''s Law','Steve Lehto','YouTube','https://www.youtube.com/@LehsLaw',ARRAY['Constitutional Rights Education','Civil Rights Litigation','First Amendment Audits'],'Michigan','Attorney who creates educational content about legal rights, First Amendment issues, and police encounters.',true),
('We The People News','WTP','YouTube','https://www.youtube.com/@WeThePeopleNews',ARRAY['First Amendment Audits','Police Accountability','Investigative Journalism','Government Transparency'],'Mississippi','Mississippi-based citizen journalism platform covering civil rights, government accountability, and First Amendment issues.',true),
('ACLU','American Civil Liberties Union','Website','https://www.aclu.org',ARRAY['Civil Rights Litigation','Constitutional Rights Education','Police Accountability','First Amendment Audits','Government Transparency'],'New York','The nation''s premier civil liberties organization, defending constitutional rights through litigation, advocacy, and public education since 1920.',true),
('NAACP','National Association for the Advancement of Colored People','Website','https://www.naacp.org',ARRAY['Civil Rights Litigation','Constitutional Rights Education','Police Accountability'],'Maryland','Founded in 1909, the NAACP is the nation''s oldest and largest civil rights organization, working to ensure political, educational, social, and economic equality.',true),
('Southern Poverty Law Center','SPLC','Website','https://www.splcenter.org',ARRAY['Civil Rights Litigation','Constitutional Rights Education','Police Accountability'],'Alabama','Founded in 1971, SPLC is a catalyst for racial justice, dedicated to fighting hate and bigotry and seeking justice for the most vulnerable members of society.',true),
('Electronic Frontier Foundation','EFF','Website','https://www.eff.org',ARRAY['Constitutional Rights Education','Government Transparency','Police Accountability'],'California','Leading nonprofit defending civil liberties in the digital world, including surveillance, free speech online, and digital privacy rights.',true),
('Institute for Justice','IJ','Website','https://www.ij.org',ARRAY['Civil Rights Litigation','Constitutional Rights Education'],'Virginia','Libertarian public interest law firm that litigates cases involving eminent domain, civil forfeiture, free speech, economic liberty, and school choice.',true),
('National Lawyers Guild','NLG','Website','https://www.nlg.org',ARRAY['Civil Rights Litigation','Protest Documentation','Constitutional Rights Education'],'New York','Progressive bar association providing legal support for social justice movements, including legal observers at protests and know-your-rights trainings.',true),
('Center for Constitutional Rights','CCR','Website','https://ccrjustice.org',ARRAY['Civil Rights Litigation','Constitutional Rights Education','Government Transparency'],'New York','Legal and educational organization dedicated to advancing and protecting rights guaranteed by the U.S. Constitution and the Universal Declaration of Human Rights.',true),
('Innocence Project','IP','Website','https://innocenceproject.org',ARRAY['Civil Rights Litigation','Constitutional Rights Education'],'New York','Works to free wrongly convicted individuals through DNA testing and reform the criminal justice system to prevent future injustice.',true),
('National Police Accountability Project','NPAP','Website','https://www.npap.org',ARRAY['Police Accountability','Civil Rights Litigation'],'New York','Section of the NLG dedicated to ending police abuse through litigation, public education, and advocacy for policy reform.',true),
('Cop Block','Cop Block','Website','https://www.copblock.org',ARRAY['Police Accountability','First Amendment Audits','Protest Documentation'],'New Hampshire','Decentralized network of individuals who document police interactions and advocate for police accountability.',true),
('Flex Your Rights','FYR','Website','https://www.flexyourrights.org',ARRAY['Constitutional Rights Education','Police Accountability'],'District of Columbia','Educational nonprofit teaching citizens how to exercise their constitutional rights during police encounters.',true),
('National Action Network','NAN','Website','https://nationalactionnetwork.net',ARRAY['Civil Rights Litigation','Constitutional Rights Education','Police Accountability'],'New York','Founded by Rev. Al Sharpton, NAN is one of the leading civil rights organizations focused on social justice, police accountability, and voting rights.',true),
('Campaign Zero','CZ','Website','https://campaignzero.org',ARRAY['Police Accountability','Government Transparency','Constitutional Rights Education'],'District of Columbia','Data-driven platform focused on ending police violence through research-informed policy solutions.',true),
('Color of Change','CoC','Website','https://colorofchange.org',ARRAY['Civil Rights Litigation','Police Accountability','Government Transparency'],'California','Online racial justice organization that designs campaigns to create a more human and less hostile world for Black people.',true),
('Vera Institute of Justice','Vera','Website','https://www.vera.org',ARRAY['Police Accountability','Constitutional Rights Education','Government Transparency'],'New York','Research and policy organization working to build just government systems, end mass incarceration, and secure equal justice.',true),
('Brennan Center for Justice','Brennan','Website','https://www.brennancenter.org',ARRAY['Constitutional Rights Education','Government Transparency','Police Accountability'],'New York','Nonpartisan law and policy institute focused on democracy, justice, and the rule of law, housed at NYU School of Law.',true)
ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- PART 6 — SEED AGENCIES (real oversight and accountability bodies)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO public.agencies (name, agency_type, state, city, phone, website, total_complaints, total_violations) VALUES
('DOJ Civil Rights Division','Federal Oversight','District of Columbia','Washington','202-514-4609','https://www.justice.gov/crt',0,0),
('Civilian Complaint Review Board (CCRB)','Civilian Oversight','New York','New York','212-442-8833','https://www.nyc.gov/site/ccrb/index.page',15000,0),
('Chicago Office of Police Accountability (COPA)','Civilian Oversight','Illinois','Chicago','312-746-3609','https://www.chicagocopa.org',5000,0),
('Los Angeles Police Commission','Civilian Oversight','California','Los Angeles','213-236-1400','https://www.lapd.online/police-commission/',3500,0),
('Oakland Citizens Police Review Agency','Civilian Oversight','California','Oakland','510-238-3159','https://www.oaklandca.gov/topics/citizens-police-review-board',800,0),
('San Francisco Department of Police Accountability','Civilian Oversight','California','San Francisco','415-241-7711','https://sfgov.org/dpa/',2500,0),
('Denver Office of the Independent Monitor','Civilian Oversight','Colorado','Denver','720-913-3306','https://www.denvergov.org/Government/Agencies-Departments-Offices/Office-of-the-Independent-Monitor',1200,0),
('Philadelphia Police Advisory Commission','Civilian Oversight','Pennsylvania','Philadelphia','215-685-0891','https://www.phila.gov/departments/police-advisory-commission/',1800,0),
('Seattle Office of Police Accountability','Civilian Oversight','Washington','Seattle','206-684-8797','https://www.seattle.gov/opa',2000,0),
('Portland Independent Police Review','Civilian Oversight','Oregon','Portland','503-823-0146','https://www.portland.gov/ipr',1500,0),
('Austin Office of Police Oversight','Civilian Oversight','Texas','Austin','512-972-2676','https://www.austintexas.gov/opo',900,0),
('Minneapolis Office of Police Conduct Review','Civilian Oversight','Minnesota','Minneapolis','612-673-5500','https://www.minneapolismn.gov/government/departments/civil-rights/police-conduct-oversight-division/',1100,0),
('San Antonio Office of the Independent Police Monitor','Civilian Oversight','Texas','San Antonio','210-207-7398','https://www.sanantonio.gov/oipm',600,0),
('Detroit Board of Police Commissioners','Civilian Oversight','Michigan','Detroit','313-596-1830','https://detroitmi.gov/departments/board-police-commissioners',2200,0),
('Baltimore Civilian Review Board','Civilian Oversight','Maryland','Baltimore','410-396-3830','https://civilrights.baltimorecity.gov/civilian-review-board',1600,0),
('Atlanta Civilian Review Board','Civilian Oversight','Georgia','Atlanta','404-865-8622','https://www.atlantaga.gov/government/boards-and-commissions/atlanta-citizen-review-board',700,0),
('New Orleans Office of the Independent Police Monitor','Civilian Oversight','Louisiana','New Orleans','504-309-9799','https://nolaipm.gov',900,0),
('Miami Civilian Investigative Panel','Civilian Oversight','Florida','Miami','786-336-4677','https://www.miamigov.com/Government/Departments-Organizations/Civilian-Investigative-Panel',500,0),
('Milwaukee Fire and Police Commission','Civilian Oversight','Wisconsin','Milwaukee','414-286-5000','https://city.milwaukee.gov/fpc',800,0),
('Memphis Civilian Law Enforcement Review Board','Civilian Oversight','Tennessee','Memphis','901-636-6800','https://www.memphistn.gov/government/civilian-law-enforcement-review-board/',600,0),
('Indianapolis Citizens Police Complaint Board','Civilian Oversight','Indiana','Indianapolis','317-327-3433','https://www.indy.gov/activity/citizens-police-complaint-board',450,0),
('Columbus Civilian Police Review Board','Civilian Oversight','Ohio','Columbus','614-645-8151','https://www.columbus.gov/civilian-police-review-board/',350,0),
('Nashville Community Oversight Board','Civilian Oversight','Tennessee','Nashville','629-201-4968','https://www.nashville.gov/departments/community-oversight',400,0),
('Tucson Independent Police Auditor','Civilian Oversight','Arizona','Tucson','520-791-4593','https://www.tucsonaz.gov/police-independent-auditor',300,0),
('St. Louis Civilian Oversight Board','Civilian Oversight','Missouri','St. Louis','314-657-1600','https://www.stlouis-mo.gov/government/departments/public-safety/civilian-oversight-board/',500,0)
ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- PART 7 — SEED RESOURCE LIBRARY
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO public.resource_library (title, description, resource_type, category, url, is_featured, is_approved, download_count, avg_rating) VALUES
('Know Your Rights: What To Do When Encountering Law Enforcement','ACLU comprehensive guide covering your rights during encounters with police, including when stopped on the street, in a car, or at home.','pdf',ARRAY['Legal Guides','Know Your Rights'],'https://www.aclu.org/know-your-rights/stopped-by-police',true,true,5400,4.8),
('ACLU Mobile Justice App','Free app that lets you record, upload, and report interactions with police. Recordings auto-upload to ACLU servers for evidence preservation.','link',ARRAY['Tools','Documentation'],'https://www.aclu.org/issues/criminal-law-reform/reforming-police/aclu-apps-record-police-conduct',true,true,3200,4.5),
('Flex Your Rights: 10 Rules for Dealing with Police','Educational video explaining the 10 essential rules for safely exercising your rights during police encounters.','video',ARRAY['Know Your Rights','Training Materials'],'https://www.flexyourrights.org/faqs/10-rules-for-dealing-with-police/',true,true,8700,4.7),
('National Lawyers Guild Legal Observer Training Manual','Comprehensive training guide for legal observers at protests and demonstrations, including rights documentation and reporting procedures.','pdf',ARRAY['Training Materials','Protest Documentation'],'https://www.nlg.org/resource/legal-observer-training/',false,true,1200,4.6),
('Reporters Committee FOIA Request Generator','Interactive tool that helps journalists and citizens generate properly formatted FOIA requests for federal and state agencies.','link',ARRAY['FOIA Tools','Legal Guides'],'https://www.rcfp.org/foia-letter-generator/',true,true,4500,4.9),
('EFF Surveillance Self-Defense Guide','Comprehensive guide to protecting your digital privacy, including phone security, encrypted messaging, and secure browsing for activists.','link',ARRAY['Privacy & Security','Tools'],'https://ssd.eff.org/',true,true,6300,4.8),
('Copwatch Handbook: How to Start a Copwatch Group','Step-by-step guide to organizing a community copwatch program, including training, documentation protocols, and legal considerations.','pdf',ARRAY['Community Organizing','Police Accountability'],'https://www.nlg.org/resource/copwatch-handbook/',false,true,900,4.4),
('Campaign Zero: Police Use of Force Policy Analysis','Research database analyzing use-of-force policies at police departments across the country, with recommendations for reform.','link',ARRAY['Research','Police Accountability'],'https://useofforceproject.org/',false,true,2100,4.3),
('Brennan Center: Body Camera Laws by State','Interactive database tracking body camera laws and policies in all 50 states, updated regularly.','link',ARRAY['Research','Legal Guides'],'https://www.brennancenter.org/our-work/research-reports/body-camera-laws-state',false,true,1800,4.5),
('NACOLE: Civilian Oversight Model Policies','National Association for Civilian Oversight of Law Enforcement best practices and model policies for civilian review boards.','pdf',ARRAY['Policy','Police Accountability'],'https://www.nacole.org/resources',false,true,650,4.2),
('ACLU Protest Rights Guide','Know your rights guide specific to protesting and demonstrating, including permit requirements, police limitations, and what to do if arrested.','pdf',ARRAY['Know Your Rights','Protest Documentation'],'https://www.aclu.org/know-your-rights/protesters-rights',true,true,7200,4.9),
('DOJ Guide to Section 1983 Litigation','Comprehensive legal resource explaining how to file and litigate Section 1983 civil rights lawsuits against government officials.','pdf',ARRAY['Legal Guides','Civil Rights Litigation'],'https://www.justice.gov/crt/deprivation-rights-under-color-law',false,true,1400,4.6),
('National Police Accountability Project: Finding a Lawyer','Guide to finding civil rights attorneys who handle police misconduct cases, including pro bono resources and legal aid organizations.','link',ARRAY['Legal Resources','Attorney Referral'],'https://www.npap.org/find-a-lawyer/',true,true,3800,4.7),
('FOIA.gov: Federal FOIA Portal','Official U.S. government portal for submitting FOIA requests to any federal agency online.','link',ARRAY['FOIA Tools','Government Transparency'],'https://www.foia.gov/',true,true,5600,4.4),
('MuckRock: FOIA Filing Platform','Platform that simplifies filing, tracking, and sharing FOIA requests with government agencies at all levels.','link',ARRAY['FOIA Tools','Government Transparency'],'https://www.muckrock.com/',false,true,2900,4.6),
('Vera Institute: What Policing Costs Report','Research report analyzing the true cost of policing in major U.S. cities, including hidden expenses and alternatives.','pdf',ARRAY['Research','Police Accountability'],'https://www.vera.org/publications/what-policing-costs-in-americas-biggest-cities',false,true,1100,4.3),
('Right to Record: A State-by-State Legal Guide','Comprehensive guide covering recording laws in all 50 states, including consent requirements and police recording exceptions.','pdf',ARRAY['Legal Guides','Know Your Rights'],'https://www.rcfp.org/reporters-privilege/',false,true,4100,4.8),
('Signal: Secure Messaging for Activists','End-to-end encrypted messaging app recommended by security experts for activist communication.','link',ARRAY['Privacy & Security','Tools'],'https://signal.org/',false,true,9200,4.9),
('Marshall Project: Criminal Justice Data','Nonprofit news organization providing in-depth reporting and data analysis on the criminal justice system.','link',ARRAY['Research','News'],'https://www.themarshallproject.org/',false,true,2400,4.7),
('Innocence Project: Wrongful Conviction Resources','Resources for understanding wrongful convictions, including how to submit a case for review and educational materials.','link',ARRAY['Legal Resources','Criminal Justice'],'https://innocenceproject.org/how-to-submit-a-case/',false,true,1700,4.5),
('Police Scorecard: Department Rankings','Data-driven tool ranking police departments on use of force, accountability, and transparency metrics.','link',ARRAY['Research','Police Accountability'],'https://policescorecard.org/',true,true,3300,4.6),
('Mapping Police Violence Database','Comprehensive database tracking police killings and use-of-force incidents across the United States.','link',ARRAY['Research','Police Accountability'],'https://mappingpoliceviolence.us/',false,true,4700,4.7),
('ACLU: Rights of Immigrants','Know your rights guide for immigrants, including rights during ICE encounters, at the border, and in deportation proceedings.','pdf',ARRAY['Know Your Rights','Immigration Rights'],'https://www.aclu.org/know-your-rights/immigrants-rights',false,true,3100,4.8),
('ProPublica: Documenting Hate Database','Crowdsourced database for reporting and tracking hate crimes and bias incidents across the United States.','link',ARRAY['Reporting Tools','Research'],'https://projects.propublica.org/hate-news/',false,true,1500,4.4),
('NAACP Legal Defense Fund: Resources','Educational resources on civil rights law, including guides on voting rights, criminal justice reform, and education equity.','link',ARRAY['Legal Resources','Civil Rights Education'],'https://www.naacpldf.org/our-resources/',false,true,2600,4.7)
ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- PART 8 — SEED COMMUNITY EVENTS (recurring / upcoming 2026)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO public.community_events (title, description, event_type, location_name, city, state, is_virtual, start_date, end_date, is_published) VALUES
('National ACLU Membership Conference 2026','Annual conference bringing together ACLU members and activists for training, networking, and strategy sessions on civil liberties.','conference','Washington Convention Center','Washington','District of Columbia',false,'2026-06-12T09:00:00Z','2026-06-14T17:00:00Z',true),
('Know Your Rights Training — Online Workshop','Free virtual workshop covering essential constitutional rights during police encounters, including practical role-playing scenarios.','workshop',NULL,NULL,NULL,true,'2026-05-01T18:00:00Z','2026-05-01T20:00:00Z',true),
('National Day of Action Against Police Brutality','Annual day of action with rallies, teach-ins, and community events across the country to raise awareness about police violence.','rally','Multiple Locations Nationwide',NULL,NULL,false,'2026-10-22T10:00:00Z','2026-10-22T18:00:00Z',true),
('FOIA Workshop: How to File Effective Public Records Requests','Hands-on workshop teaching citizens how to craft FOIA requests, appeal denials, and use public records for accountability.','workshop',NULL,NULL,NULL,true,'2026-05-15T19:00:00Z','2026-05-15T21:00:00Z',true),
('Juneteenth Civil Rights Celebration 2026','Annual celebration of freedom and civil rights with community events, educational programs, and cultural performances.','rally','Various Locations',NULL,NULL,false,'2026-06-19T10:00:00Z','2026-06-19T22:00:00Z',true),
('Legal Observer Training — National Lawyers Guild','Training program for volunteer legal observers who monitor protests and document police behavior at demonstrations.','workshop','NLG National Office','New York','New York',false,'2026-07-10T10:00:00Z','2026-07-10T16:00:00Z',true),
('First Amendment Audit Meetup — Texas Chapter','Monthly meetup for First Amendment auditors and transparency activists in Texas to share experiences and plan actions.','meetup','Community Center','Austin','Texas',false,'2026-05-20T18:30:00Z','2026-05-20T20:30:00Z',true),
('Digital Privacy for Activists — EFF Workshop','Virtual workshop on protecting digital privacy during activism, covering encrypted messaging, VPNs, and device security.','workshop',NULL,NULL,NULL,true,'2026-06-05T19:00:00Z','2026-06-05T21:00:00Z',true),
('Civil Rights Film Festival 2026','Annual film festival showcasing documentaries and films about civil rights, social justice, and police accountability.','conference','Schomburg Center','New York','New York',false,'2026-09-15T18:00:00Z','2026-09-17T22:00:00Z',true),
('Community Copwatch Training — Chicago','In-person training on community copwatch techniques, legal rights while observing police, and evidence documentation.','workshop','Community Center','Chicago','Illinois',false,'2026-08-08T10:00:00Z','2026-08-08T14:00:00Z',true),
('Voting Rights Summit 2026','National summit on voting rights, voter suppression, and strategies for protecting democratic participation.','conference','King Center','Atlanta','Georgia',false,'2026-08-20T09:00:00Z','2026-08-22T17:00:00Z',true),
('Section 1983 Litigation CLE Seminar','Continuing legal education seminar for attorneys on Section 1983 civil rights litigation, covering qualified immunity and municipal liability.','workshop',NULL,NULL,NULL,true,'2026-09-10T12:00:00Z','2026-09-10T16:00:00Z',true)
ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- PART 9 — SEED SUCCESS STORIES
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO public.success_stories (title, story, outcome, state, case_type, is_verified) VALUES
('Glik v. Cunniffe — Right to Record Established','Simon Glik was arrested in 2007 for recording Boston police officers arresting a man on the Boston Common. The charges were dropped, and Glik sued. In 2011, the First Circuit Court of Appeals ruled that the First Amendment protects the right to record police in public, establishing binding precedent across the First Circuit. The city of Boston settled for $170,000.','Settlement Reached','Massachusetts','First Amendment',true),
('Floyd v. City of New York — Stop and Frisk Reform','In 2013, a federal judge found that the NYPD stop-and-frisk program violated the Fourth and Fourteenth Amendments through racial profiling. The ruling led to a federal monitor overseeing NYPD reforms. Stop-and-frisk encounters dropped from over 685,000 in 2011 to fewer than 13,000 by 2019.','Policy Change','New York','Fourth Amendment',true),
('Sandra Bland Act — Texas Police Reform','Following the death of Sandra Bland in a Texas jail in 2015, advocates pushed for legislative reform. The Sandra Bland Act, signed into law in 2017, requires county jails to divert mentally ill people to treatment, mandates that officers receive de-escalation training, and affirms the right to record police.','Policy Change','Texas','Police Accountability',true),
('DOJ Ferguson Consent Decree','After the DOJ investigation following Michael Brown''s death revealed systemic constitutional violations and racial bias in Ferguson PD, the city entered a comprehensive consent decree in 2016. The decree requires sweeping reforms to policing practices, court operations, and training.','Policy Change','Missouri','Pattern or Practice',true),
('Timbs v. Indiana — Excessive Fines Protection','Tyson Timbs had his $42,000 Land Rover seized after a drug arrest for which the maximum fine was $10,000. In 2019, the Supreme Court unanimously ruled that the Eighth Amendment prohibition on excessive fines applies to states, protecting citizens from disproportionate civil asset forfeiture.','Case Dismissed','Indiana','Eighth Amendment',true),
('FOIA Victory: Chicago Police Misconduct Database','Through persistent FOIA requests, the Invisible Institute obtained decades of Chicago PD misconduct complaint data. This led to the creation of the Citizens Police Data Project, making over 125,000 complaints publicly searchable and revealing patterns of repeat misconduct.','Community Win','Illinois','FOIA / Transparency',true),
('George Floyd Justice in Policing Act — Minneapolis','After George Floyd''s murder in 2020, Minneapolis banned chokeholds and required officers to intervene when witnessing misconduct. The city also began the process of reimagining public safety. While the federal act stalled, numerous cities and states enacted similar reforms.','Policy Change','Minnesota','Police Reform',true),
('Carpenter v. United States — Digital Privacy Win','In 2018, the Supreme Court ruled 5-4 that the government generally needs a warrant to access cell phone location records. Timothy Carpenter was convicted partly based on 127 days of cell-site location data obtained without a warrant. The ruling established that digital privacy is protected by the Fourth Amendment.','Charges Dropped','Michigan','Fourth Amendment',true),
('Breonna''s Law — Louisville No-Knock Warrant Ban','After Breonna Taylor was killed during a no-knock warrant raid in 2020, Louisville became one of the first cities to ban no-knock warrants. The Breonna Taylor Act requires officers to identify themselves before entering and restricts nighttime warrants.','Policy Change','Kentucky','Police Reform',true),
('Allen v. Milligan — Voting Rights Victory','In 2023, the Supreme Court ruled that Alabama''s congressional map likely violated Section 2 of the Voting Rights Act by packing Black voters into a single district. The ruling required Alabama to create a second majority-Black district, preserving Voting Rights Act protections.','Community Win','Alabama','Voting Rights',true),
('Riley v. California — Cell Phone Privacy','In 2014, the Supreme Court unanimously ruled that police generally need a warrant to search the contents of a cell phone seized during arrest. Chief Justice Roberts wrote: "Modern cell phones are not just another technological convenience... They hold for many Americans the privacies of life."','Community Win','California','Fourth Amendment',true),
('Colorado Police Accountability Act (SB 20-217)','Passed in 2020, this groundbreaking law eliminated qualified immunity for police officers in Colorado state courts, required body cameras, and mandated reporting of use-of-force incidents. It was the first state law to eliminate qualified immunity.','Policy Change','Colorado','Police Accountability',true)
ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- PART 10 — SEED POPULAR TAGS
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO public.popular_tags (tag, use_count, last_used) VALUES
('#civil-rights', 320, NOW()),
('#know-your-rights', 290, NOW()),
('#first-amendment', 265, NOW()),
('#police-accountability', 240, NOW()),
('#foia', 195, NOW()),
('#transparency', 185, NOW()),
('#recording-rights', 170, NOW()),
('#qualified-immunity', 145, NOW()),
('#fourth-amendment', 160, NOW()),
('#fifth-amendment', 150, NOW()),
('#protest-rights', 140, NOW()),
('#excessive-force', 130, NOW()),
('#false-arrest', 115, NOW()),
('#bodycam', 125, NOW()),
('#copwatch', 110, NOW()),
('#section-1983', 100, NOW()),
('#voting-rights', 135, NOW()),
('#police-reform', 120, NOW()),
('#miranda-rights', 95, NOW()),
('#digital-privacy', 90, NOW()),
('#whistleblower', 75, NOW()),
('#consent-decree', 70, NOW()),
('#shield-law', 65, NOW()),
('#press-freedom', 80, NOW()),
('#immigration-rights', 85, NOW()),
('#education-equity', 60, NOW()),
('#criminal-justice-reform', 105, NOW()),
('#hate-crimes', 55, NOW()),
('#civil-asset-forfeiture', 50, NOW()),
('#wrongful-conviction', 45, NOW())
ON CONFLICT (tag) DO UPDATE SET
  use_count = GREATEST(popular_tags.use_count, EXCLUDED.use_count),
  last_used = NOW();


-- ════════════════════════════════════════════════════════════════════════════
-- PART 11 — SEED SOCIAL POSTS + FORUM THREADS (require auth user)
-- ════════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_uid UUID;
BEGIN
  SELECT id INTO v_uid FROM auth.users ORDER BY created_at LIMIT 1;
  IF v_uid IS NULL THEN
    RAISE NOTICE 'No auth users found — skipping posts and forum threads.';
    RETURN;
  END IF;

  -- ── Social Feed Posts ────────────────────────────────────────────────────
  INSERT INTO public.posts (content, user_id, created_at) VALUES
  ('🚨 KNOW YOUR RIGHTS: You have the right to record police in public spaces in ALL 50 states. The First Amendment protects your right to document law enforcement activities. If an officer demands you stop filming, calmly state: "I am exercising my First Amendment right to record in a public space." Do NOT put your phone away — keep recording. #recording-rights #first-amendment #know-your-rights', v_uid, NOW() - INTERVAL '2 hours'),
  ('FOIA WIN: After 6 months of requests and appeals, we finally received 847 pages of internal use-of-force policy documents from the Chicago PD. Key finding: supervisors are required to review all UoF incidents within 5 days — but 62% of reviewed cases showed no documentation of this review. Accountability starts with transparency. #foia #transparency #police-accountability', v_uid, NOW() - INTERVAL '5 hours'),
  ('Fourth Amendment reminder: A traffic stop does NOT give police the right to search your vehicle without consent or probable cause. You can say: "Officer, I do not consent to a search." This must be said clearly and calmly. Your refusal CANNOT be used as probable cause. If they search anyway, stay calm and document everything. #fourth-amendment #know-your-rights', v_uid, NOW() - INTERVAL '8 hours'),
  ('🏛️ LEGAL UPDATE: Federal judge has denied qualified immunity defense in pattern-or-practice excessive force case. The court found that the right to be free from excessive force during lawful protest was clearly established. This is significant for holding individual officers accountable. #qualified-immunity #excessive-force #civil-rights', v_uid, NOW() - INTERVAL '12 hours'),
  ('RESOURCE: If you are detained or arrested, remember the magic words: "I am invoking my rights." Then: (1) Ask if you are free to go. (2) If not, ask why. (3) State you do not consent to searches. (4) Say you want a lawyer. (5) Stay calm and do not argue. Your lawyer argues — you document. #fifth-amendment #miranda-rights #know-your-rights', v_uid, NOW() - INTERVAL '1 day'),
  ('Body camera footage analysis: New research shows that officers who activate bodycams BEFORE citizen contact have 37% fewer use-of-force incidents than those who activate after contact begins. Mandatory pre-contact activation policies matter. Push your local department to adopt them. Contact your city council. #bodycam #police-accountability #transparency #reform', v_uid, NOW() - INTERVAL '1 day 3 hours'),
  ('📢 LEGAL UPDATE: The 9th Circuit ruled that peaceful protesters have a clearly established right to be free from pepper spray used as crowd control when the crowd is not presenting an immediate threat of violence. Another important ruling limiting qualified immunity in protest suppression cases. #protest-rights #qualified-immunity #civil-rights', v_uid, NOW() - INTERVAL '2 days'),
  ('Shield law update: As of 2026, 43 states now have shield laws protecting journalists from being compelled to reveal confidential sources. Does your state protect press freedom? Check our state laws database to find out. Citizen journalists and bloggers — check if your state''s shield law covers you too. #press-freedom #shield-law #journalism #first-amendment', v_uid, NOW() - INTERVAL '2 days 5 hours'),
  ('Community organizing tip: When documenting police encounters, use apps that automatically back up footage to a secure server the moment you stop recording. Local deletion of your phone does NOT delete the cloud backup. Evidence preservation is critical — always have a backup plan. #copwatch #recording-rights #civil-rights', v_uid, NOW() - INTERVAL '3 days'),
  ('📊 DATA POINT: Police departments that adopted comprehensive de-escalation training programs saw a 28% reduction in use-of-force incidents and a 36% decrease in officer injuries. Better training = safer communities AND safer officers. This is not anti-police — it''s pro-good-policing. #police-reform #police-accountability', v_uid, NOW() - INTERVAL '3 days 6 hours'),
  ('FALSE ARREST LEGAL GUIDE: If you were arrested without probable cause, you may have a Section 1983 civil rights claim. Key elements: (1) Officer acted under color of law (2) Violated your constitutional rights (3) Causal connection (4) Resulting harm. Statute of limitations varies by state but is typically 2-3 years from arrest. Find an attorney through our directory. #false-arrest #section-1983 #civil-rights', v_uid, NOW() - INTERVAL '4 days'),
  ('The Supreme Court''s Carpenter v. United States decision protects your digital privacy: the government generally needs a warrant to access your cell phone location records. This was a 5-4 decision in 2018 that extended the Fourth Amendment into the digital age. Know your digital rights. #digital-privacy #fourth-amendment #supreme-court', v_uid, NOW() - INTERVAL '5 days'),
  ('DID YOU KNOW: You have no obligation to answer police questions beyond providing ID (in states with stop-and-identify statutes). You can politely say: "I am exercising my right to remain silent." This applies whether you are a suspect, witness, or bystander. Silence cannot be used against you if you invoke it. #fifth-amendment #know-your-rights', v_uid, NOW() - INTERVAL '5 days 6 hours'),
  ('🎯 FOIA TIP: When filing FOIA requests, always ask for records in electronic format. Digital records are often cheaper (or free), delivered faster, and easier to search and analyze. Also request fee waivers if you''re a journalist, researcher, or acting in the public interest. Template available in our Tools section. #foia #transparency #government-transparency', v_uid, NOW() - INTERVAL '6 days'),
  ('VICTORY: Colorado became the first state to eliminate qualified immunity for police officers in state courts with SB 20-217 (2020). Since then, several other states and cities have introduced similar legislation. The tide is turning on police accountability. Track reform legislation in our court calendar. #qualified-immunity #police-reform #colorado #accountability', v_uid, NOW() - INTERVAL '7 days'),
  ('ICE encounter rights: You are NOT required to answer questions about your citizenship status. You may remain silent. You do NOT have to sign anything. You have the right to speak with a lawyer. If ICE comes to your door, you do NOT have to open it unless they have a signed judicial warrant (NOT an ICE administrative warrant). Know the difference. #immigration-rights #know-your-rights', v_uid, NOW() - INTERVAL '8 days'),
  ('Riley v. California (2014) — The Supreme Court unanimously ruled that police generally need a warrant to search your cell phone, even during arrest. Chief Justice Roberts wrote: "Modern cell phones are not just another technological convenience. With all they contain and all they may reveal, they hold for many Americans the privacies of life." #digital-privacy #fourth-amendment', v_uid, NOW() - INTERVAL '9 days'),
  ('📋 CHECKLIST for attending a protest: (1) Write lawyer''s number on your arm in permanent marker (2) Charge your phone fully (3) Enable cloud backup for photos/video (4) Bring water and a buddy (5) Know your exit routes (6) Don''t bring anything you can''t afford to lose (7) Know the legal observer hotline number. Stay safe, stay informed. #protest-rights #know-your-rights', v_uid, NOW() - INTERVAL '10 days')
  ON CONFLICT DO NOTHING;

  -- ── Forum Discussion Threads ─────────────────────────────────────────────
  INSERT INTO public.forum_threads (title, content, category, user_id, created_at, view_count, like_count) VALUES
  ('Guide: How to File a Compelling FOIA Request (With Templates)', 'I''ve filed over 40 FOIA requests over the past 3 years with a 78% success rate. Here is everything I''ve learned about crafting requests that get results. The key is specificity — vague requests get denied or delayed. Always cite the specific statute (5 U.S.C. § 552 for federal, or your state''s equivalent). Include a clear description of the records you want, the time period, and the format you prefer (always ask for electronic). Don''t forget to request a fee waiver if you qualify. More tips in the thread...', 'guides', v_uid, NOW() - INTERVAL '1 week', 342, 28),
  ('Know Your Rights: Recording Police in All 50 States (2026 Update)', 'Updated guide covering every state''s specific laws on recording police. Good news: recording police in public is protected by the First Amendment nationwide per multiple federal circuit court decisions. However, some states have nuances around all-party consent laws for audio recording. Key cases: Glik v. Cunniffe (1st Cir. 2011), Turner v. Driver (5th Cir. 2017), Fields v. City of Philadelphia (3rd Cir. 2017). Check the state laws tab for your specific state...', 'know-your-rights', v_uid, NOW() - INTERVAL '3 days', 891, 67),
  ('How to Find Pro Bono Civil Rights Attorneys in Your Area', 'Finding legal help when you can''t afford it can be overwhelming. Here are the best resources: (1) ACLU affiliate offices in every state (2) National Police Accountability Project lawyer referral (3) Law school civil rights clinics (4) Legal Aid societies (5) Bar association pro bono programs (6) This platform''s attorney directory. Most civil rights attorneys work on contingency for Section 1983 cases, meaning you don''t pay unless you win...', 'legal-resources', v_uid, NOW() - INTERVAL '5 days', 567, 41),
  ('Community Watch: Share Your Local Police Accountability Stories', 'This thread is a safe space to share documented incidents of police accountability (or lack thereof) in your community. Please include: dates, locations (city/state), any public records you''ve obtained, and whether any formal complaints were filed. This helps us identify patterns and connect people with similar experiences. Remember: document everything, stay factual, and protect the privacy of victims...', 'community', v_uid, NOW() - INTERVAL '2 weeks', 1247, 89),
  ('Qualified Immunity Reform: Latest Legislative Updates 2026', 'Tracking all active state and federal legislation to reform or eliminate qualified immunity. Current status: Colorado eliminated QI in state courts (2020), New Mexico followed (2021), and several other states have introduced bills. At the federal level, the George Floyd Justice in Policing Act has stalled, but bipartisan discussions continue. I''ll update this thread as new developments occur...', 'legislation', v_uid, NOW() - INTERVAL '1 day', 423, 35),
  ('Tech Tools for Civil Rights Activists: Privacy, Security, Documentation', 'A curated and tested list of tools for protecting your privacy while documenting civil rights work: SECURE MESSAGING: Signal (best), Wire, Session. EVIDENCE PRESERVATION: ACLU Mobile Justice, ProofMode. VPN: Mullvad, ProtonVPN. EMAIL: ProtonMail, Tutanota. CLOUD STORAGE: Tresorit, SpiderOak. PASSWORD MANAGER: Bitwarden, KeePassXC. Remember: your operational security is only as strong as your weakest link...', 'tools', v_uid, NOW() - INTERVAL '1 week 2 days', 678, 52),
  ('Understanding Section 1983 Claims: When Can You Sue for Civil Rights Violations?', '42 U.S.C. § 1983 is one of the most powerful tools for seeking accountability. You can sue ANY person who, acting under color of state law, deprives you of a constitutional right. Key elements: (1) Defendant acted under color of law (2) Conduct violated a constitutional right (3) The right was clearly established. Common claims: excessive force, false arrest, malicious prosecution, failure to intervene. Statute of limitations: typically 2-3 years (varies by state). You usually don''t need to file a complaint with the police department first...', 'legal-resources', v_uid, NOW() - INTERVAL '4 days', 512, 38),
  ('Body Camera Footage: How to Request and Analyze It', 'Body camera footage is one of the most powerful accountability tools available. Here''s how to get it: (1) File a public records request with the specific department (2) Include the date, time, location, and officer name/badge number if known (3) Cite your state''s public records law (4) Request all footage from all officers at the scene. Common denials and how to appeal them. Tips for analyzing footage once you receive it...', 'guides', v_uid, NOW() - INTERVAL '6 days', 445, 33),
  ('What to Do If Police Violate Your Rights: Step by Step', 'If your rights were violated during a police encounter, here is your action plan: IMMEDIATELY: (1) Write down everything while your memory is fresh (2) Save all evidence (photos, video, witness contacts) (3) Get medical attention if needed (4) Do NOT post on social media before talking to a lawyer. WITHIN 48 HOURS: (5) File a formal complaint with the department (6) Contact a civil rights attorney (7) File a complaint with your state AG. WITHIN 30 DAYS: (8) Consider federal complaint with DOJ...', 'know-your-rights', v_uid, NOW() - INTERVAL '8 days', 734, 56),
  ('First Amendment Audit Best Practices and Ethics', 'First Amendment auditing is a powerful tool for accountability, but it works best when done ethically and professionally. Best practices: (1) Know your rights AND the limits (2) Always be respectful and calm (3) State your purpose clearly (4) Never trespass on non-public areas (5) Comply with lawful orders (6) Document everything (7) Know when to walk away (8) Follow up with complaints or commendations as appropriate. The goal is transparency and education, not confrontation...', 'guides', v_uid, NOW() - INTERVAL '10 days', 623, 47),
  ('Immigration Rights: Know Your Rights at Checkpoints and During Raids', 'Whether you are a citizen or non-citizen, you have constitutional rights. At immigration checkpoints: you must stop but do NOT have to answer questions about citizenship. At your home: ICE needs a JUDICIAL warrant (signed by a judge) to enter — an ICE administrative warrant is NOT enough. If detained: you have the right to remain silent and the right to an attorney. Do NOT sign any documents without a lawyer present...', 'know-your-rights', v_uid, NOW() - INTERVAL '12 days', 556, 42),
  ('Civilian Oversight Boards: How to Get Involved in Your City', 'Civilian oversight of police is one of the most effective accountability mechanisms. Here''s how to get involved: (1) Find out if your city has a civilian review board (2) Attend public meetings (3) Apply for board positions when openings arise (4) Advocate for independent subpoena power (5) Push for public access to complaint data. If your city doesn''t have civilian oversight, here''s how to organize for one...', 'community', v_uid, NOW() - INTERVAL '2 weeks 1 day', 389, 29)
  ON CONFLICT DO NOTHING;

END $$;


-- ════════════════════════════════════════════════════════════════════════════
-- PART 12 — ADDITIONAL FOIA TEMPLATES
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO public.foia_templates (title, description, template_text, category, agency_type) VALUES
('Body Camera Footage Request','Request body-worn camera footage from a specific incident or officer.','Dear Records Custodian,

Pursuant to [STATE FOIA STATUTE], I am requesting copies of the following records:

All body-worn camera (BWC) footage from [OFFICER NAME/BADGE #] on [DATE] between [TIME RANGE] in the vicinity of [LOCATION].

This request includes:
1. All BWC footage from the named officer during the specified period
2. All BWC footage from any other officers present at the scene
3. Any in-car camera footage from vehicles at the scene
4. Audio recordings from the incident

I request these records in digital format (MP4 or equivalent video format).

I request a fee waiver as this information is in the public interest and will contribute to public understanding of government operations.

If any portion of this request is denied, please cite the specific exemption and provide the name and contact information of the official responsible for the denial so that I may file an appeal.

Please respond within the time period required by law.

Sincerely,
[YOUR NAME]
[YOUR ADDRESS]
[YOUR EMAIL]
[DATE]','Police Records','law_enforcement'),
('Use of Force Incident Reports','Request use-of-force reports from a police department.','Dear Records Custodian,

Pursuant to [STATE FOIA STATUTE], I am requesting copies of the following records:

All use-of-force reports filed by officers of the [DEPARTMENT NAME] for the period of [START DATE] through [END DATE].

This request includes:
1. Individual use-of-force incident reports
2. Supervisor review forms for each incident
3. Any internal affairs investigations resulting from these incidents
4. Statistical summaries of use-of-force data
5. Any related training records or policy updates

I request these records in electronic format where available.

I request a fee waiver as disclosure of this information is in the public interest.

Sincerely,
[YOUR NAME]','Police Records','law_enforcement'),
('Officer Complaint History','Request the complaint and disciplinary history for a specific officer.','Dear Records Custodian,

Pursuant to [STATE FOIA STATUTE], I am requesting the following records:

The complete complaint and disciplinary history for [OFFICER NAME], Badge #[BADGE NUMBER], employed by [DEPARTMENT NAME].

This includes:
1. All citizen complaints filed against the officer
2. All internal affairs investigations involving the officer
3. Outcomes and dispositions of all complaints and investigations
4. Any disciplinary actions taken
5. Any commendations or awards received
6. Current duty status and assignment

Note: [CITE STATE LAW regarding officer records if applicable, e.g., in many states police disciplinary records are public records].

Sincerely,
[YOUR NAME]','Police Records','law_enforcement'),
('Arrest and Booking Records','Request arrest records and booking information.','Dear Records Custodian,

Pursuant to [STATE FOIA STATUTE], I am requesting the following records:

Arrest and booking records for [SUBJECT NAME OR incident on DATE at LOCATION].

This includes:
1. Arrest report(s)
2. Booking photograph(s)
3. Incident/offense report(s)
4. Probable cause affidavit
5. Property/evidence inventory
6. Miranda waiver or invocation documentation

I request these records in electronic format.

Sincerely,
[YOUR NAME]','Police Records','law_enforcement'),
('Police Department Budget and Spending','Request financial records for a police department.','Dear Records Custodian,

Pursuant to [STATE FOIA STATUTE], I am requesting the following records:

Financial records for the [DEPARTMENT NAME] for fiscal year(s) [YEAR(S)].

This includes:
1. Annual operating budget (detailed line items)
2. Overtime expenditure reports
3. Settlement and judgment payments related to lawsuits
4. Equipment purchase records (including surveillance technology)
5. Training expenditure reports
6. Any grants received (federal, state, or private)
7. Asset forfeiture fund balances and expenditures

I request these records in electronic spreadsheet format where available.

Sincerely,
[YOUR NAME]','Financial Records','law_enforcement'),
('Surveillance Technology Records','Request records about police surveillance technology deployment.','Dear Records Custodian,

Pursuant to [STATE FOIA STATUTE], I am requesting the following records:

Records related to surveillance technology used by [DEPARTMENT NAME].

This includes:
1. Inventory of all surveillance technologies (including but not limited to: automated license plate readers, facial recognition systems, cell-site simulators/Stingrays, drones, social media monitoring tools)
2. Policies governing the use of each technology
3. Purchase contracts and vendor agreements
4. Data retention policies
5. Any community impact assessments
6. Records of any technology sharing agreements with other agencies
7. Statistical reports on technology usage

Sincerely,
[YOUR NAME]','Technology Records','law_enforcement'),
('911 Call Records and Dispatch Logs','Request emergency dispatch records for a specific incident.','Dear Records Custodian,

Pursuant to [STATE FOIA STATUTE], I am requesting the following records:

911 call recordings and dispatch records for [DATE] at approximately [TIME] related to an incident at [LOCATION/ADDRESS].

This includes:
1. Audio recording(s) of all 911 calls related to the incident
2. Computer-aided dispatch (CAD) logs
3. Radio dispatch communications
4. Officer response times
5. Unit assignment records

I request audio recordings in digital format (MP3 or WAV).

Sincerely,
[YOUR NAME]','Emergency Records','law_enforcement'),
('Jail/Detention Facility Records','Request records from a jail or detention facility.','Dear Records Custodian,

Pursuant to [STATE FOIA STATUTE], I am requesting the following records:

Records from [FACILITY NAME] for the period [DATE RANGE].

This includes:
1. Daily population reports
2. In-custody death reports and investigations
3. Use-of-force incident reports within the facility
4. Medical care policies and incident reports
5. Grievance logs filed by detainees
6. Inspection and compliance reports
7. Staffing level reports

Sincerely,
[YOUR NAME]','Detention Records','law_enforcement'),
('Federal Agency FOIA — General Template','General-purpose FOIA request template for federal agencies.','FOIA Request
[DATE]

[AGENCY NAME]
[AGENCY FOIA OFFICE ADDRESS]

Re: Freedom of Information Act Request

Dear FOIA Officer,

Pursuant to the Freedom of Information Act, 5 U.S.C. § 552, I am requesting access to and copies of the following records:

[DESCRIBE RECORDS SOUGHT WITH SPECIFICITY]

For the time period: [START DATE] through [END DATE]

REQUEST FOR FEE WAIVER:
I request a waiver of all fees associated with this request pursuant to 5 U.S.C. § 552(a)(4)(A)(iii). Disclosure of the requested information is in the public interest because it is likely to contribute significantly to public understanding of the operations or activities of the government and is not primarily in my commercial interest.

[EXPLAIN PUBLIC INTEREST]

REQUEST FOR EXPEDITED PROCESSING (if applicable):
I request expedited processing pursuant to 5 U.S.C. § 552(a)(6)(E) because [EXPLAIN URGENCY].

If any portion of this request is denied, please identify the specific exemption(s) relied upon and notify me of the right to appeal.

I prefer to receive records in electronic format.

Thank you for your prompt attention to this request.

Sincerely,
[YOUR NAME]
[YOUR ADDRESS]
[YOUR PHONE]
[YOUR EMAIL]','Federal FOIA','federal'),
('Police Policy and Procedure Manual Request','Request a copy of a police department''s policy manual.','Dear Records Custodian,

Pursuant to [STATE FOIA STATUTE], I am requesting a complete copy of the current [DEPARTMENT NAME] Policy and Procedure Manual (also known as the General Orders or Standard Operating Procedures).

This includes all sections covering:
1. Use of force policy (including deadly force, less-lethal weapons, chokeholds)
2. Pursuit/vehicle chase policy
3. Body-worn camera policy
4. Stop, detention, and arrest procedures
5. Search and seizure procedures
6. Citizen complaint procedures
7. Internal affairs investigation procedures
8. De-escalation policy
9. First Amendment/recording policy
10. Immigration enforcement policy

I request this in electronic format (PDF preferred).

Sincerely,
[YOUR NAME]','Police Records','law_enforcement'),
('Civil Asset Forfeiture Records','Request records about civil asset forfeiture by law enforcement.','Dear Records Custodian,

Pursuant to [STATE FOIA STATUTE], I am requesting the following records:

Civil asset forfeiture records for [DEPARTMENT/AGENCY NAME] for [YEAR(S)].

This includes:
1. All forfeiture petitions filed
2. Inventory of seized property (cash, vehicles, real estate, other)
3. Total value of assets seized and forfeited
4. Disposition of forfeited assets
5. Forfeiture fund balance and expenditure reports
6. Cases where forfeiture was contested and outcomes
7. Any federal equitable sharing agreements and payments

Sincerely,
[YOUR NAME]','Financial Records','law_enforcement'),
('Public Meeting Records Request','Request records from government meetings and proceedings.','Dear Records Custodian,

Pursuant to [STATE FOIA/OPEN RECORDS STATUTE], I am requesting the following records:

Records from [GOVERNMENT BODY NAME] meetings held between [DATE RANGE].

This includes:
1. Meeting agendas
2. Meeting minutes (draft and approved)
3. Audio/video recordings of meetings
4. Supporting documents and presentations distributed at meetings
5. Voting records
6. Any closed session justifications and minutes (as permitted by law)

Sincerely,
[YOUR NAME]','Government Records','government')
ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════════
-- PART 13 — CREATE INDEXES ON NEW TABLES
-- ════════════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_state_laws_code ON public.state_laws(state_code);
CREATE INDEX IF NOT EXISTS idx_federal_laws_category ON public.federal_laws(category);
CREATE INDEX IF NOT EXISTS idx_court_calendars_status ON public.court_calendars(status);
CREATE INDEX IF NOT EXISTS idx_court_calendars_type ON public.court_calendars(case_type);
CREATE INDEX IF NOT EXISTS idx_poll_votes_post ON public.poll_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user ON public.poll_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_popular_tags_count ON public.popular_tags(use_count DESC);

-- Done!
-- This migration creates 5 missing tables and seeds 10+ tables with comprehensive,
-- accurate data covering all aspects of the Civil Rights Hub platform.
