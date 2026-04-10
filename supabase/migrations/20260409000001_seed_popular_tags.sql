-- Seed popular_tags with civil rights movement hashtags
-- and add user_verification table if not already present

-- =====================================================
-- 1. USER VERIFICATION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_verification (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            TEXT NOT NULL,
  organization    TEXT NOT NULL,
  credential_detail TEXT,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by     UUID REFERENCES auth.users(id),
  reviewed_at     TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_verification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verification requests"
  ON public.user_verification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can submit verification requests"
  ON public.user_verification FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_verification_user ON public.user_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verification_status ON public.user_verification(status);

-- =====================================================
-- 2. POPULAR TAGS SEED DATA
-- =====================================================

INSERT INTO public.popular_tags (tag, use_count, last_used) VALUES
  ('#civil-rights', 1247, NOW() - INTERVAL '1 hour'),
  ('#know-your-rights', 1089, NOW() - INTERVAL '2 hours'),
  ('#police-accountability', 876, NOW() - INTERVAL '30 minutes'),
  ('#first-amendment', 754, NOW() - INTERVAL '3 hours'),
  ('#foia', 621, NOW() - INTERVAL '4 hours'),
  ('#fourth-amendment', 598, NOW() - INTERVAL '5 hours'),
  ('#recording-rights', 534, NOW() - INTERVAL '6 hours'),
  ('#protest-rights', 489, NOW() - INTERVAL '7 hours'),
  ('#transparency', 445, NOW() - INTERVAL '8 hours'),
  ('#qualified-immunity', 398, NOW() - INTERVAL '9 hours'),
  ('#bodycam', 367, NOW() - INTERVAL '10 hours'),
  ('#immigration-rights', 342, NOW() - INTERVAL '11 hours'),
  ('#fifth-amendment', 318, NOW() - INTERVAL '12 hours'),
  ('#free-speech', 296, NOW() - INTERVAL '13 hours'),
  ('#excessive-force', 284, NOW() - INTERVAL '14 hours'),
  ('#wrongful-arrest', 271, NOW() - INTERVAL '15 hours'),
  ('#press-freedom', 258, NOW() - INTERVAL '16 hours'),
  ('#police-reform', 247, NOW() - INTERVAL '17 hours'),
  ('#miranda-rights', 234, NOW() - INTERVAL '18 hours'),
  ('#aclu', 221, NOW() - INTERVAL '19 hours'),
  ('#legal-aid', 209, NOW() - INTERVAL '20 hours'),
  ('#black-lives-matter', 198, NOW() - INTERVAL '21 hours'),
  ('#voting-rights', 187, NOW() - INTERVAL '22 hours'),
  ('#disability-rights', 174, NOW() - INTERVAL '23 hours'),
  ('#housing-rights', 162, NOW() - INTERVAL '1 day'),
  ('#workers-rights', 151, NOW() - INTERVAL '25 hours'),
  ('#acab', 143, NOW() - INTERVAL '26 hours'),
  ('#defund-police', 134, NOW() - INTERVAL '27 hours'),
  ('#prison-reform', 125, NOW() - INTERVAL '28 hours'),
  ('#community-organizing', 116, NOW() - INTERVAL '29 hours')
ON CONFLICT (tag) DO UPDATE
  SET use_count = EXCLUDED.use_count,
      last_used = EXCLUDED.last_used;
