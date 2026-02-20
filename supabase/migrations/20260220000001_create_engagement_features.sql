-- Add parent_comment_id to comments table for threaded comments
ALTER TABLE comments
ADD COLUMN IF NOT EXISTS parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE;

-- Create post_reactions table
CREATE TABLE IF NOT EXISTS post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type text NOT NULL CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry', 'fire', 'celebrate')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (post_id, user_id, reaction_type)
);

-- Create mentions table
CREATE TABLE IF NOT EXISTS mentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  mentioned_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false,
  CHECK (post_id IS NOT NULL OR comment_id IS NOT NULL)
);

-- Create post_polls table
CREATE TABLE IF NOT EXISTS post_polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]',
  ends_at timestamptz,
  allow_multiple boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create poll_votes table
CREATE TABLE IF NOT EXISTS poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES post_polls(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (poll_id, user_id, option_id)
);

-- Create post_links table for link previews
CREATE TABLE IF NOT EXISTS post_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  url text NOT NULL,
  title text,
  description text,
  image_url text,
  site_name text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for post_reactions
CREATE POLICY "Anyone can view post reactions"
  ON post_reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert their own reactions"
  ON post_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
  ON post_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for mentions
CREATE POLICY "Anyone can view mentions"
  ON mentions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert mentions"
  ON mentions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own mentions (mark as read)"
  ON mentions FOR UPDATE
  USING (auth.uid() = mentioned_user_id);

-- RLS Policies for post_polls
CREATE POLICY "Anyone can view polls"
  ON post_polls FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert polls"
  ON post_polls FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for poll_votes
CREATE POLICY "Anyone can view poll votes"
  ON poll_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert their own votes"
  ON poll_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON poll_votes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for post_links
CREATE POLICY "Anyone can view post links"
  ON post_links FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert post links"
  ON post_links FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_post_reactions_post ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user ON post_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_mentions_user ON mentions(mentioned_user_id);
CREATE INDEX IF NOT EXISTS idx_mentions_post ON mentions(post_id);
CREATE INDEX IF NOT EXISTS idx_mentions_comment ON mentions(comment_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user ON poll_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_links_post ON post_links(post_id);

-- Function to increment vote count in poll options
CREATE OR REPLACE FUNCTION increment_poll_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE post_polls
  SET options = jsonb_set(
    options,
    ARRAY[
      (SELECT idx - 1 FROM generate_series(1, jsonb_array_length(options)) AS idx
       WHERE options->idx - 1->>'id' = NEW.option_id)
    ],
    jsonb_set(
      options->(SELECT idx - 1 FROM generate_series(1, jsonb_array_length(options)) AS idx
                WHERE options->idx - 1->>'id' = NEW.option_id),
      '{vote_count}',
      COALESCE((options->(SELECT idx - 1 FROM generate_series(1, jsonb_array_length(options)) AS idx
                         WHERE options->idx - 1->>'id' = NEW.option_id)->>'vote_count')::int, 0) + 1
    )
  )
  WHERE id = NEW.poll_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update vote counts
CREATE TRIGGER trigger_increment_poll_vote
  AFTER INSERT ON poll_votes
  FOR EACH ROW
  EXECUTE FUNCTION increment_poll_vote_count();

-- Function to decrement vote count when vote is deleted
CREATE OR REPLACE FUNCTION decrement_poll_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE post_polls
  SET options = jsonb_set(
    options,
    ARRAY[
      (SELECT idx - 1 FROM generate_series(1, jsonb_array_length(options)) AS idx
       WHERE options->idx - 1->>'id' = OLD.option_id)
    ],
    jsonb_set(
      options->(SELECT idx - 1 FROM generate_series(1, jsonb_array_length(options)) AS idx
                WHERE options->idx - 1->>'id' = OLD.option_id),
      '{vote_count}',
      GREATEST(COALESCE((options->(SELECT idx - 1 FROM generate_series(1, jsonb_array_length(options)) AS idx
                         WHERE options->idx - 1->>'id' = OLD.option_id)->>'vote_count')::int, 0) - 1, 0)
    )
  )
  WHERE id = OLD.poll_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to decrement vote counts on delete
CREATE TRIGGER trigger_decrement_poll_vote
  AFTER DELETE ON poll_votes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_poll_vote_count();

-- Function to handle mention notifications
CREATE OR REPLACE FUNCTION notify_mention()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, reference_id, created_at)
  VALUES (
    NEW.mentioned_user_id,
    'mention',
    COALESCE(NEW.post_id, NEW.comment_id),
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for mention notifications (if notifications table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_notify_mention') THEN
      CREATE TRIGGER trigger_notify_mention
        AFTER INSERT ON mentions
        FOR EACH ROW
        EXECUTE FUNCTION notify_mention();
    END IF;
  END IF;
END $$;
