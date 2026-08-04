-- ============================================================
-- Monetization Schema + Content Seeding
-- Applied retroactively 2026-08-03
-- Revenue models: all free to end users.
--   1. Premium attorney placement (attorneys pay for visibility)
--   2. Attorney lead routing (match tool engine)
--   3. Sponsored content (orgs sponsor guides/sections)
--   4. API access keys (paid structured API for firms/journalists)
--   5. Newsletter sponsorships
-- Plus: 9 Know Your Rights cards + 3 Challenge Guides seeded
-- ============================================================

-- 1. PREMIUM ATTORNEY PLACEMENT
ALTER TABLE public.attorneys
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS premium_tier TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS premium_featured_state BOOLEAN DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS premium_bio TEXT,
  ADD COLUMN IF NOT EXISTS lead_email TEXT,
  ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS contact_clicks INTEGER DEFAULT 0 NOT NULL;

COMMENT ON COLUMN public.attorneys.premium_tier IS 'NULL = free listing. basic = verified badge. featured = top of state search. spotlight = homepage rotation.';

-- 2. ATTORNEY LEADS TABLE
CREATE TABLE IF NOT EXISTS public.attorney_leads (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name            TEXT,
  email           TEXT,
  phone           TEXT,
  state           TEXT NOT NULL,
  city            TEXT,
  practice_area   TEXT NOT NULL,
  description     TEXT NOT NULL,
  urgency         TEXT DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent', 'emergency')),
  consent_contact BOOLEAN DEFAULT true NOT NULL,
  matched_attorney_ids UUID[] DEFAULT '{}',
  status          TEXT DEFAULT 'new' CHECK (status IN ('new', 'matched', 'contacted', 'closed', 'expired')),
  expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days') NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.attorney_leads ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='attorney_leads' AND policyname='leads_owner_select') THEN
    CREATE POLICY leads_owner_select ON public.attorney_leads FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='attorney_leads' AND policyname='leads_anon_insert') THEN
    CREATE POLICY leads_anon_insert ON public.attorney_leads FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='attorney_leads' AND policyname='leads_owner_update') THEN
    CREATE POLICY leads_owner_update ON public.attorney_leads FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS attorney_leads_state_idx ON public.attorney_leads(state, status);
CREATE INDEX IF NOT EXISTS attorney_leads_practice_idx ON public.attorney_leads(practice_area, status);
CREATE INDEX IF NOT EXISTS attorney_leads_expires_idx ON public.attorney_leads(expires_at);

-- 3. SPONSORED CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.sponsored_content (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sponsor_name    TEXT NOT NULL,
  sponsor_logo_url TEXT,
  sponsor_url     TEXT,
  sponsor_blurb   TEXT,
  content_type    TEXT NOT NULL CHECK (content_type IN ('challenge_guide', 'know_your_rights', 'resource_section', 'newsletter', 'homepage_banner')),
  content_id      UUID,
  placement       TEXT DEFAULT 'bottom' CHECK (placement IN ('top', 'bottom', 'sidebar', 'inline')),
  tier            TEXT DEFAULT 'standard' CHECK (tier IN ('standard', 'premium', 'exclusive')),
  starts_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ends_at         TIMESTAMPTZ NOT NULL,
  is_active       BOOLEAN DEFAULT true NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.sponsored_content ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sponsored_content' AND policyname='sponsored_select') THEN
    CREATE POLICY sponsored_select ON public.sponsored_content FOR SELECT USING (is_active AND ends_at > NOW());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sponsored_content' AND policyname='sponsored_admin_all') THEN
    CREATE POLICY sponsored_admin_all ON public.sponsored_content FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS sponsored_content_active_idx ON public.sponsored_content(content_type, content_id, is_active, ends_at);

-- 4. API ACCESS TRACKING
CREATE TABLE IF NOT EXISTS public.api_access_keys (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_name        TEXT NOT NULL,
  contact_email   TEXT NOT NULL,
  api_key_hash    TEXT NOT NULL,
  rate_limit      INTEGER DEFAULT 100 NOT NULL,
  requests_today  INTEGER DEFAULT 0 NOT NULL,
  last_request_at TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT true NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.api_access_keys ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='api_access_keys' AND policyname='api_keys_admin') THEN
    CREATE POLICY api_keys_admin ON public.api_access_keys FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 5. NEWSLETTER SPONSORSHIPS
CREATE TABLE IF NOT EXISTS public.newsletter_sponsorships (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sponsor_name    TEXT NOT NULL,
  sponsor_logo_url TEXT,
  sponsor_url     TEXT,
  sponsor_blurb   TEXT,
  send_date       TIMESTAMPTZ NOT NULL,
  subscriber_count INTEGER,
  is_active       BOOLEAN DEFAULT true NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.newsletter_sponsorships ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='newsletter_sponsorships' AND policyname='nl_sponsor_admin') THEN
    CREATE POLICY nl_sponsor_admin ON public.newsletter_sponsorships FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SEED: 9 Know Your Rights Cards
-- ============================================================

INSERT INTO public.know_your_rights_cards (scenario, title, short_description, steps, state, law_citations, emergency_contacts, languages, is_featured, view_count, share_count)
SELECT t.scenario, t.title, t.short_description, t.steps::jsonb, t.state, t.law_citations, t.emergency_contacts::jsonb, t.languages, t.is_featured, t.view_count, t.share_count
FROM (VALUES
  ('police_stop', 'Stopped by Police: Know Your Rights', 'What to do and say during a traffic stop or stop-and-frisk',
   '[{"title":"Stay calm and keep hands visible","detail":"Turn on interior lights if night. Keep hands on steering wheel or visible at all times."},{"title":"You have the right to remain silent","detail":"Say \"I am exercising my right to remain silent\" if questioned. You must provide ID if driving."},{"title":"Ask if you are free to go","detail":"If yes, calmly leave. If no, you are being detained — ask why."},{"title":"Refuse consent to search","detail":"Say \"I do not consent to a search of my person, vehicle, or belongings.\" Officers may still search with probable cause."},{"title":"Document everything","detail":"Note officer name, badge number, patrol car number, time, location, and witnesses."}]'::text,
   NULL,
   ARRAY['Fourth Amendment', 'Terry v. Ohio, 392 U.S. 1 (1968)', 'Miranda v. Arizona, 384 U.S. 436 (1966)'],
   '[{"name":"ACLU National","phone":"212-549-2500"},{"name":"Emergency","phone":"911"}]'::text,
   ARRAY['en', 'es'],
   true, 0, 0),

  ('protest_rights', 'Protesting: Your First Amendment Rights', 'How to exercise your right to peaceful assembly safely',
   '[{"title":"You have the right to peaceful assembly","detail":"Protests in traditional public forums (streets, sidewalks, parks) are protected speech."},{"title":"Permits may be required for large groups","detail":"But spontaneous protests in response to news events generally do not need permits."},{"title":"Recording police is legal","detail":"You have the right to record police activity in public, as long as you do not interfere."},{"title":"Police must warn before dispersal","detail":"They must give clear dispersal orders and a reasonable time to comply before making arrests."},{"title":"If arrested, ask for a lawyer","detail":"Do not resist arrest. Say \"I want a lawyer\" and remain silent."}]'::text,
   NULL,
   ARRAY['First Amendment', 'Brandenburg v. Ohio, 395 U.S. 444 (1969)', 'Nieves v. Bartlett, 587 U.S. ___ (2019)'],
   '[{"name":"ACLU National","phone":"212-549-2500"},{"name":"National Lawyers Guild","phone":"212-679-2330"}]'::text,
   ARRAY['en', 'es', 'ar'],
   true, 0, 0),

  ('recording_police', 'Recording Police: Your Right to Film', 'Can you record law enforcement? Yes, in all 50 states.',
   '[{"title":"You have the right to record","detail":"Every federal appeals court to rule on this has found recording police in public is a First Amendment right."},{"title":"Do not interfere","detail":"Stay a reasonable distance away. Do not physically block officers or their vehicles."},{"title":"Officers cannot demand your phone","detail":"They need a warrant to seize your phone or view its contents. Do not consent."},{"title":"Live streaming is protected","detail":"Live streaming police activity is also protected speech."},{"title":"If ordered to stop, ask why","detail":"If police order you to stop recording, ask if you are being detained. If free to go, move to a safe distance and continue."}]'::text,
   NULL,
   ARRAY['First Amendment', 'ACLU v. Alvarez, 679 F.3d 583 (7th Cir. 2012)', 'Glik v. Cunniffe, 655 F.3d 78 (1st Cir. 2011)'],
   '[{"name":"ACLU National","phone":"212-549-2500"},{"name":"Reporters Committee for Freedom of the Press","phone":"202-795-9300"}]'::text,
   ARRAY['en', 'es'],
   true, 0, 0),

  ('workplace_discrimination', 'Workplace Discrimination: Filing a Charge', 'How to file an EEOC charge if you face discrimination at work',
   '[{"title":"Document everything","detail":"Keep records of incidents, dates, witnesses, emails, and text messages."},{"title":"File with EEOC within 180 days","detail":"Deadline is 180 days from the discriminatory act (300 days in some states with FEPA). File at eeoc.gov or in person."},{"title":"You do not need a lawyer to file","detail":"You can file a charge yourself, but an employment attorney strengthens your case significantly."},{"title":"EEOC investigates and may mediate","detail":"You may get a \"right to sue\" letter after 60 days if EEOC does not resolve it."},{"title":"You are protected from retaliation","detail":"It is illegal for your employer to retaliate against you for filing an EEOC charge."}]'::text,
   NULL,
   ARRAY['Title VII, Civil Rights Act of 1964', '42 U.S.C. § 2000e', 'EEOC v. Shell Oil, 466 U.S. 54 (1984)'],
   '[{"name":"EEOC","phone":"800-669-4000"},{"name":"ACLU National","phone":"212-549-2500"}]'::text,
   ARRAY['en', 'es', 'zh'],
   true, 0, 0),

  ('housing_discrimination', 'Housing Discrimination: Filing a HUD Complaint', 'If you face discrimination in renting or buying housing',
   '[{"title":"Recognize the signs","detail":"Being told a unit is unavailable when it is not, being steered to certain neighborhoods, different terms than other tenants."},{"title":"File with HUD within 1 year","detail":"File a housing discrimination complaint at hud.gov or call 800-669-9772. Deadline is 1 year from the discriminatory act."},{"title":"You can also file in state court","detail":"Many states have fair housing laws with longer deadlines and additional protections."},{"title":"Document the discrimination","detail":"Keep all communications, listing ads, and notes on what was said. Tester evidence is powerful."},{"title":"Contact a fair housing org","detail":"Local fair housing centers can help investigate and file. Many provide free assistance."}]'::text,
   NULL,
   ARRAY['Fair Housing Act, 42 U.S.C. § 3601', '42 U.S.C. § 3604', 'Texas Dept. of Housing v. Inclusive Communities, 576 U.S. 519 (2015)'],
   '[{"name":"HUD Fair Housing","phone":"800-669-9772"},{"name":"National Fair Housing Alliance","phone":"202-898-1661"}]'::text,
   ARRAY['en', 'es'],
   false, 0, 0),

  ('right_to_counsel', 'Right to a Public Defender', 'If you cannot afford a lawyer, the state must provide one',
   '[{"title":"You have this right in criminal cases","detail":"The state must provide a lawyer if you face jail time, even for misdemeanors. This does not apply to civil cases."},{"title":"Request a public defender at arraignment","detail":"Tell the judge you cannot afford a lawyer. You may need to fill out a financial eligibility form."},{"title":"Public defenders are real lawyers","detail":"They are fully licensed attorneys, not lesser counsel. Caseload issues are real but they know the local system."},{"title":"Do not waive your right to counsel","detail":"Even if you plan to plead guilty, a lawyer can negotiate better terms and check for constitutional violations."},{"title":"If denied, contact legal aid","detail":"If you do not qualify for a public defender but cannot afford private counsel, contact your state legal aid society."}]'::text,
   NULL,
   ARRAY['Sixth Amendment', 'Gideon v. Wainwright, 372 U.S. 335 (1963)', 'Argersinger v. Hamlin, 407 U.S. 25 (1972)'],
   '[{"name":"ACLU National","phone":"212-549-2500"},{"name":"Legal Services Corporation","phone":"202-295-1500"}]'::text,
   ARRAY['en', 'es'],
   true, 0, 0),

  ('immigration_rights', 'Immigration Encounters: Know Your Rights', 'What to do during ICE encounters or immigration proceedings',
   '[{"title":"You have constitutional rights regardless of status","detail":"The Fourth and Fifth Amendments protect everyone in the US, including non-citizens."},{"title":"Do not open the door without a warrant","detail":"ICE needs a judicial warrant signed by a judge to enter your home. Ask them to slide it under the door."},{"title":"Remain silent and ask for a lawyer","detail":"You have the right to remain silent. Say \"I want to speak with a lawyer\" and do not sign anything."},{"title":"Do not lie about your status","detail":"Lying to federal agents is a crime. Remain silent instead."},{"title":"Carry a know-your-rights card","detail":"ACLU red cards stating your rights are available in multiple languages. Keep one with you."}]'::text,
   NULL,
   ARRAY['Fourth Amendment', 'Fifth Amendment', 'Plyler v. Doe, 457 U.S. 202 (1982)'],
   '[{"name":"ACLU Immigrants Rights","phone":"213-977-9400"},{"name":"Immigrant Defense Project","phone":"212-725-6422"}]'::text,
   ARRAY['en', 'es', 'zh', 'ar'],
   true, 0, 0),

  ('excessive_force', 'Excessive Force: Filing a Complaint', 'How to document and report police use of excessive force',
   '[{"title":"Seek medical attention first","detail":"Your health is the priority. Document all injuries with photos and medical records."},{"title":"Preserve all evidence","detail":"Save photos of injuries, torn clothing, damaged property. Note names of witnesses and their contact info."},{"title":"File a complaint with the agency","detail":"Most departments have a civilian complaint process. File even if you fear retaliation — it creates a record."},{"title":"File with the DOJ if needed","detail":"The Department of Justice Civil Rights Division investigates pattern-or-practice cases. File at civilrights.justice.gov."},{"title":"Consult a civil rights attorney","detail":"Section 1983 lawsuits allow you to sue for constitutional violations. Most offer free consultations."}]'::text,
   NULL,
   ARRAY['42 U.S.C. § 1983', 'Fourth Amendment', 'Graham v. Connor, 490 U.S. 386 (1989)'],
   '[{"name":"DOJ Civil Rights Division","phone":"855-856-1017"},{"name":"ACLU National","phone":"212-549-2500"}]'::text,
   ARRAY['en', 'es'],
   true, 0, 0),

  ('foia_request', 'FOIA: How to File a Public Records Request', 'How to request government documents under the Freedom of Information Act',
   '[{"title":"Identify the right agency","detail":"Each federal agency has its own FOIA office. State requests use different laws (e.g., Texas PIA, California CPRA)."},{"title":"Write a specific request","detail":"Be as specific as possible: dates, names, document types. Vague requests get delayed or denied."},{"title":"Submit via the agency portal","detail":"Most agencies accept FOIA requests online. Use foia.gov for federal, or state portals for state records."},{"title":"Track your request","detail":"You will get a tracking number. Follow up if you do not hear back within the statutory timeframe (20 business days federal)."},{"title":"Appeal denials","detail":"If denied, you can appeal within the agency, then file a lawsuit. Many states have free FOIA resources."}]'::text,
   NULL,
   ARRAY['5 U.S.C. § 552', 'FOIA Improvement Act of 2016'],
   '[{"name":"Reporters Committee for Freedom of the Press","phone":"202-795-9300"},{"name":"National Freedom of Information Coalition","phone":"573-882-9204"}]'::text,
   ARRAY['en', 'es'],
   true, 0, 0)
) AS t(scenario, title, short_description, steps, state, law_citations, emergency_contacts, languages, is_featured, view_count, share_count)
WHERE NOT EXISTS (SELECT 1 FROM public.know_your_rights_cards k WHERE k.scenario = t.scenario AND (k.state IS NULL AND t.state IS NULL OR k.state = t.state))
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: 3 Additional Challenge Guides
-- ============================================================

INSERT INTO public.challenge_guides (title, category, difficulty, description, steps, legal_basis, estimated_time, tools_needed, important_warnings, success_stories, related_laws)
SELECT t.title, t.category, t.difficulty, t.description, t.steps::jsonb, t.legal_basis, t.estimated_time, t.tools_needed, t.important_warnings, t.success_stories, t.related_laws
FROM (VALUES
  ('How to File a Section 1983 Lawsuit', 'Civil Rights Litigation', 'hard',
   'Step-by-step guide to filing a federal civil rights lawsuit under 42 U.S.C. § 1983 for constitutional violations by government officials.',
   '[{"title":"Identify the violation","detail":"Determine which constitutional right was violated (4th, 8th, 14th Amendment, etc.) and by whom."},{"title":"Find a civil rights attorney","detail":"Most § 1983 cases are complex. Use our attorney directory to find one in your state."},{"title":"File a notice of claim if required","detail":"Some states require a notice of claim before suing a government entity. Check your state deadline (often 90 days)."},{"title":"File in federal or state court","detail":"§ 1983 cases can be filed in either. Federal court often has more experienced judges for civil rights cases."},{"title":"Survive qualified immunity challenge","detail":"The defendant will claim qualified immunity. You must show the right was clearly established at the time."}]'::text,
   '42 U.S.C. § 1983 provides a civil remedy for deprivation of constitutional rights by persons acting under color of law.',
   '6-18 months',
   ARRAY['Civil rights attorney', 'Court filing fees or IFP application', 'Evidence documentation'],
   ARRAY['Statutes of limitations vary by state (1-6 years for § 1983)', 'Qualified immunity is a high bar — not all violations are actionable', 'Government notice requirements may be shorter than the statute of limitations'],
   'Many landmark civil rights cases began as § 1983 suits, including cases that changed qualified immunity standards and police use-of-force doctrines.',
   ARRAY['42 U.S.C. § 1983', 'Monell v. Department of Social Services, 436 U.S. 658 (1978)', 'Pearson v. Callahan, 555 U.S. 223 (2009)']),

  ('How to Request Body Camera Footage', 'Police Accountability', 'medium',
   'How to obtain police body camera and dashcam footage after an incident, through public records requests.',
   '[{"title":"Identify the agency","detail":"Determine which department responded. Different agencies have different retention policies."},{"title":"File a public records request","detail":"Submit a request citing your state public records law. Be specific: date, time, location, officer names if known."},{"title":"Request within retention window","detail":"Body cam footage is often deleted after 30-180 days if no complaint or case is filed. File immediately."},{"title":"Follow up in writing","detail":"If the agency does not respond within the statutory timeframe, follow up in writing and note the deadline."},{"title":"Appeal if denied","detail":"If footage is denied under an exemption, appeal. Many states have a public records ombudsman."}]'::text,
   'State public records laws generally require disclosure of body camera footage, though some states have specific exemptions.',
   '2-8 weeks',
   ARRAY['Public records request form', 'Date and location of incident', 'Officer names or badge numbers if available'],
   ARRAY['Footage retention windows are short — file within days, not weeks', 'Some states charge per-hour fees for video redaction', 'Active investigations may delay release'],
   'Multiple civil rights cases have been won or settled based on body camera footage that contradicted officer reports.',
   ARRAY['State Public Records Act', 'FOIA (for federal agencies)']),

  ('How to File a Bar Complaint Against an Attorney', 'Legal Accountability', 'easy',
   'How to file a complaint with your state bar association against an attorney for ethical violations.',
   '[{"title":"Document the violation","detail":"Gather evidence: emails, contracts, court filings, billing records showing the ethical violation."},{"title":"Identify the correct bar association","detail":"Each state has its own bar disciplinary system. Find yours at the American Bar Association website."},{"title":"File the complaint","detail":"Most state bars have online complaint forms. Be factual and specific. Attach evidence."},{"title":"Cooperate with the investigation","detail":"The bar may contact you for more information. Respond promptly and honestly."},{"title":"Understand possible outcomes","detail":"Outcomes range from dismissal to private reprimand, suspension, or disbarment. The bar does not provide financial compensation."}]'::text,
   'Each state regulates attorney conduct through its bar association and disciplinary rules.',
   '3-12 months',
   ARRAY['Documentation of the violation', 'State bar complaint form', 'Evidence (emails, contracts, billing)'],
   ARRAY['Bar complaints do not recover money — you need a separate legal malpractice suit for that', 'Frivolous complaints can result in sanctions against the filer', 'The process is confidential in most states until a formal charge is filed'],
   'Bar complaints have led to suspensions and disbarments of attorneys who violated client trust, including in civil rights cases where attorneys failed to represent indigent clients adequately.',
   ARRAY['Model Rules of Professional Conduct', 'State Bar Disciplinary Rules'])
) AS t(title, category, difficulty, description, steps, legal_basis, estimated_time, tools_needed, important_warnings, success_stories, related_laws)
WHERE NOT EXISTS (SELECT 1 FROM public.challenge_guides c WHERE c.title = t.title)
ON CONFLICT DO NOTHING;
