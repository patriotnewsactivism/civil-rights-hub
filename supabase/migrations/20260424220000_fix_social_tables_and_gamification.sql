-- Fix: create poll_votes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  option_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id, option_id)
);

ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can read all poll votes"
  ON public.poll_votes FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can insert own poll votes"
  ON public.poll_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix: create user_follows view/alias pointing to follows table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_follows'
  ) THEN
    -- Create a view alias so both "follows" and "user_follows" work
    EXECUTE 'CREATE VIEW public.user_follows AS SELECT id, follower_id, following_id, created_at FROM public.follows';
  END IF;
END $$;

-- Fix: create civic_scores table for gamification
CREATE TABLE IF NOT EXISTS public.civic_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  score INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  level TEXT NOT NULL DEFAULT 'Newcomer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.civic_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can read all civic scores"
  ON public.civic_scores FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can manage their own civic score"
  ON public.civic_scores FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Fix: create popular_tags table
CREATE TABLE IF NOT EXISTS public.popular_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag TEXT NOT NULL UNIQUE,
  usage_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.popular_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Everyone can read popular tags"
  ON public.popular_tags FOR SELECT USING (true);

-- Seed some popular tags
INSERT INTO public.popular_tags (tag, usage_count) VALUES
  ('#KnowYourRights', 142),
  ('#FilmThePolice', 89),
  ('#FOIA', 76),
  ('#1stAmendment', 71),
  ('#4thAmendment', 58),
  ('#PoliceAccountability', 53),
  ('#CivilRights', 48),
  ('#ProtestRights', 41),
  ('#PressFreed om', 37),
  ('#BailFund', 29)
ON CONFLICT (tag) DO UPDATE SET usage_count = EXCLUDED.usage_count;
