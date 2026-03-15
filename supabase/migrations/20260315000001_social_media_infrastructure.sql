-- Social Media Infrastructure: poll_data column, poll_votes table, storage buckets,
-- popular_tags table (if not exists), and all supporting indexes/policies.

-- =====================================================
-- 1. ADD poll_data COLUMN TO POSTS
-- =====================================================

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS poll_data JSONB DEFAULT NULL;

-- =====================================================
-- 2. CREATE poll_votes TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.poll_votes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_id   TEXT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (post_id, user_id, option_id)
);

ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view poll votes"
  ON public.poll_votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.poll_votes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their votes"
  ON public.poll_votes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_poll_votes_post ON public.poll_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user ON public.poll_votes(user_id);

-- =====================================================
-- 3. POPULAR TAGS TABLE (if not already created)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.popular_tags (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag       TEXT UNIQUE NOT NULL,
  use_count INTEGER NOT NULL DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.popular_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Popular tags are viewable by everyone"
  ON public.popular_tags FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update tag counts"
  ON public.popular_tags FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_popular_tags_count ON public.popular_tags(use_count DESC);

-- Seed core hashtags if not present
INSERT INTO public.popular_tags (tag, use_count, last_used) VALUES
  ('#first-amendment',     250, NOW()),
  ('#police-misconduct',   200, NOW()),
  ('#foia',                185, NOW()),
  ('#recording-rights',    160, NOW()),
  ('#protest-rights',      145, NOW()),
  ('#qualified-immunity',  130, NOW()),
  ('#excessive-force',     120, NOW()),
  ('#false-arrest',        110, NOW()),
  ('#civil-rights',        300, NOW()),
  ('#know-your-rights',    275, NOW()),
  ('#transparency',        180, NOW()),
  ('#accountability',      165, NOW()),
  ('#fourth-amendment',    155, NOW()),
  ('#fifth-amendment',     140, NOW()),
  ('#bodycam',             125, NOW()),
  ('#copwatch',            115, NOW())
ON CONFLICT (tag) DO UPDATE SET
  use_count = GREATEST(popular_tags.use_count, EXCLUDED.use_count),
  last_used = NOW();

-- =====================================================
-- 4. STORAGE BUCKET FOR POST MEDIA
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'posts',
  'posts',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg','image/png','image/gif','image/webp','video/mp4','video/webm','audio/mpeg','audio/ogg','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for posts bucket
CREATE POLICY "Posts media is publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'posts');

CREATE POLICY "Authenticated users can upload post media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own post media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- 5. AVATAR STORAGE BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg','image/png','image/gif','image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatars are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- 6. ENSURE POSTS TABLE HAS NEEDED COLUMNS
-- =====================================================

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- =====================================================
-- 7. FUNCTION: auto-update popular_tags on post insert
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_popular_tags_from_post()
RETURNS TRIGGER AS $$
DECLARE
  hashtag TEXT;
  tags TEXT[];
BEGIN
  -- Extract hashtags from content
  SELECT ARRAY(
    SELECT LOWER(m[1])
    FROM regexp_matches(NEW.content, '#([a-zA-Z0-9_-]+)', 'g') AS m
  ) INTO tags;

  FOREACH hashtag IN ARRAY tags LOOP
    INSERT INTO public.popular_tags (tag, use_count, last_used)
    VALUES ('#' || hashtag, 1, NOW())
    ON CONFLICT (tag) DO UPDATE SET
      use_count = popular_tags.use_count + 1,
      last_used = NOW();
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_popular_tags ON public.posts;
CREATE TRIGGER trigger_update_popular_tags
  AFTER INSERT ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_popular_tags_from_post();
