-- ============================================================
-- GAMIFICATION + SOCIAL SEED
-- Creates missing tables and seeds initial data
-- ============================================================

-- civic_scores table
CREATE TABLE IF NOT EXISTS public.civic_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  score INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  level TEXT NOT NULL DEFAULT 'Newcomer',
  violations_filed INTEGER DEFAULT 0,
  foias_filed INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  connections_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.civic_scores ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users can read all civic scores" ON public.civic_scores FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can manage their own civic score" ON public.civic_scores FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- popular_tags table
CREATE TABLE IF NOT EXISTS public.popular_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag TEXT NOT NULL UNIQUE,
  usage_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.popular_tags ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Everyone can read popular tags" ON public.popular_tags FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO public.popular_tags (tag, usage_count) VALUES
  ('#KnowYourRights', 284),
  ('#FilmThePolice', 189),
  ('#FOIA', 156),
  ('#1stAmendment', 142),
  ('#4thAmendment', 118),
  ('#PoliceAccountability', 107),
  ('#CivilRights', 98),
  ('#ProtestRights', 87),
  ('#PressFreedom', 74),
  ('#BailFund', 63),
  ('#Section1983', 58),
  ('#QualifiedImmunity', 51),
  ('#ACLU', 47),
  ('#BlackLivesMatter', 142),
  ('#StopAndFrisk', 38),
  ('#BodyCam', 72),
  ('#CommunityPolicing', 44),
  ('#5thAmendment', 39),
  ('#Miranda', 67),
  ('#LegalObserver', 29),
  ('#AuditorNation', 83),
  ('#FreeSpeech', 91),
  ('#ImmigrantRights', 55),
  ('#VotingRights', 48),
  ('#PoliceReform', 76)
ON CONFLICT (tag) DO UPDATE SET usage_count = EXCLUDED.usage_count;

-- poll_votes table
CREATE TABLE IF NOT EXISTS public.poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  option_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id, option_id)
);

ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users can read all poll votes" ON public.poll_votes FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users can insert own poll votes" ON public.poll_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed some public posts (no user_id since these are anonymous/system posts)
-- These show up in the Social Feed as community starter posts
INSERT INTO public.posts (content, post_type, tags, like_count, comment_count, is_public)
SELECT
  content, post_type::text, tags, like_count, comment_count, true
FROM (VALUES
  ('🚨 KNOW YOUR RIGHTS: You have the right to film police in public spaces. The First Amendment protects recording law enforcement. If an officer tells you to stop filming, you can calmly say: "I''m filming for my protection and yours." Don''t block or interfere. #FilmThePolice #1stAmendment #KnowYourRights',
   'text', ARRAY['#FilmThePolice','#1stAmendment','#KnowYourRights'], 247, 38, 0),

  ('📋 FOIA TIP: When requesting police body cam footage, be SPECIFIC. Include: date, time, location, officer badge number if known. Ask for ALL footage including interior vehicle cameras. Request in writing. They have 20 days under federal FOIA (state laws vary). #FOIA #PoliceAccountability',
   'text', ARRAY['#FOIA','#PoliceAccountability','#BodyCam'], 183, 27, 0),

  ('⚖️ The 4th Amendment protects you from unreasonable searches and seizures. Police generally need:\n✅ A warrant (signed by a judge)\n✅ Your consent (you can say no!)\n✅ Probable cause + exigent circumstances\n\nIf they search you without any of these, that evidence may be suppressed. #4thAmendment #KnowYourRights',
   'text', ARRAY['#4thAmendment','#KnowYourRights','#Section1983'], 312, 52, 0),

  ('🔴 URGENT: If you are stopped by police, remember:\n1. Stay calm, don''t argue\n2. Ask: "Am I free to go?"\n3. If not: "I am invoking my right to remain silent"\n4. Ask for an attorney immediately if arrested\n5. Document everything AFTER the encounter\n\n#Miranda #KnowYourRights #CivilRights',
   'text', ARRAY['#Miranda','#KnowYourRights','#CivilRights'], 428, 67, 0),

  ('📣 COMMUNITY ALERT: Section 1983 lawsuits are how citizens hold police accountable in federal court. You can sue individual officers AND municipalities for constitutional violations. The key challenge: qualified immunity. But recent rulings have narrowed that defense. Find a civil rights attorney if your rights were violated. #Section1983 #QualifiedImmunity #PoliceAccountability',
   'text', ARRAY['#Section1983','#QualifiedImmunity','#PoliceAccountability'], 198, 31, 0),

  ('🗳️ VOTING RIGHTS UPDATE: Courts have struck down several voter suppression laws in 2025-2026. Know your state''s current ID requirements. You have the right to a provisional ballot if your registration is questioned. Poll workers CANNOT ask about your citizenship status. #VotingRights #CivilRights',
   'text', ARRAY['#VotingRights','#CivilRights'], 156, 22, 0),

  ('📸 LEGAL OBSERVERS: National Lawyers Guild trains and deploys legal observers (green-hat wearers) at protests. They document police misconduct, support protesters, and cannot give legal advice on scene. If you see a green hat, they''re there to help. Consider training to become one. #LegalObserver #ProtestRights',
   'text', ARRAY['#LegalObserver','#ProtestRights','#1stAmendment'], 134, 18, 0),

  ('🏛️ THE CONSENT DECREE TRACKER: Several major police departments are under federal consent decrees requiring reform:\n• Chicago PD (2019)\n• Baltimore PD (2017)\n• Seattle PD (2012)\n• Oakland PD (2003)\n\nConsent decrees mean federal judges are monitoring compliance. These are HUGE wins — won by communities, not politicians. #PoliceReform #PoliceAccountability',
   'text', ARRAY['#PoliceReform','#PoliceAccountability','#Section1983'], 267, 43, 0),

  ('🧠 QUICK LEGAL LESSON: The difference between Terry stops (stop & frisk) and arrests:\n\nTerry stop: Brief detention on reasonable suspicion. Must be temporary. You must identify yourself in some states.\n\nArrest: Full custody. Requires probable cause. Miranda rights apply.\n\nPolice often try to make Terry stops feel like arrests. Know the difference. #StopAndFrisk #KnowYourRights #4thAmendment',
   'text', ARRAY['#StopAndFrisk','#KnowYourRights','#4thAmendment'], 289, 47, 0),

  ('🎙️ PRESS FREEDOM: Journalists have the same First Amendment rights at protests as the general public — PLUS the right not to reveal sources (in most states). If you''re filming as a journalist, clearly identify yourself. The Reporters Committee has a 24/7 legal defense hotline: 1-800-336-4243. #PressFreedom #1stAmendment #AuditorNation',
   'text', ARRAY['#PressFreedom','#1stAmendment','#AuditorNation'], 176, 29, 0)
) AS v(content, post_type, tags, like_count, comment_count, is_public)
WHERE NOT EXISTS (SELECT 1 FROM public.posts WHERE content = v.content);
