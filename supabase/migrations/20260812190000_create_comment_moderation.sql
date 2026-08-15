-- LLM-assisted troll-vs-genuine comment moderation.
-- This ASSISTS human moderators (surfaces a verdict for review) — it never
-- auto-deletes anything. A real person still makes the call in
-- ModeratorDashboard. That matters here specifically because false positives
-- would silence genuine critics/whistleblowers on a civil-rights site, which
-- would be worse than the trolling problem it's meant to help with.

CREATE TABLE IF NOT EXISTS public.comment_moderation_verdicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  label text NOT NULL CHECK (label IN ('genuine', 'troll', 'uncertain')),
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  reasoning text NOT NULL,
  provider_used text NOT NULL,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_decision text CHECK (reviewer_decision IN ('agree', 'overturn', NULL)),
  created_at timestamptz NOT NULL DEFAULT now(),
  -- one verdict per comment; a re-classification replaces it via upsert
  UNIQUE (comment_id)
);

CREATE INDEX IF NOT EXISTS idx_comment_moderation_label ON public.comment_moderation_verdicts(label);
CREATE INDEX IF NOT EXISTS idx_comment_moderation_comment ON public.comment_moderation_verdicts(comment_id);

ALTER TABLE public.comment_moderation_verdicts ENABLE ROW LEVEL SECURITY;

-- Only moderators/admins can read verdicts — this is moderation tooling,
-- not a public "troll score" to be weaponized against commenters.
CREATE POLICY "Moderators can view verdicts"
  ON public.comment_moderation_verdicts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role IN ('admin', 'moderator')
    )
  );

-- Writes only happen via the moderate-comment edge function using the
-- service role key, which bypasses RLS entirely — no INSERT/UPDATE policy
-- is needed (and none is added, so no other path can write here).

-- Moderators can record whether they agreed with or overturned the AI verdict,
-- to build a track record of how reliable the classifier actually is.
CREATE POLICY "Moderators can update review decision"
  ON public.comment_moderation_verdicts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role IN ('admin', 'moderator')
    )
  );
