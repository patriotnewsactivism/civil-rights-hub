-- Migration: Comment Moderation System (LLM-based classification)

-- Add moderation columns to comments table
ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'rejected')),
  ADD COLUMN IF NOT EXISTS moderation_label TEXT DEFAULT 'pending' CHECK (moderation_label IN ('pending', 'genuine', 'troll', 'bad_faith')),
  ADD COLUMN IF NOT EXISTS moderation_confidence NUMERIC DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS moderation_reasoning TEXT,
  ADD COLUMN IF NOT EXISTS moderation_categories TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS moderation_provider TEXT,
  ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ;

-- Add moderation columns to violation_comments table
ALTER TABLE public.violation_comments
  ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'rejected')),
  ADD COLUMN IF NOT EXISTS moderation_label TEXT DEFAULT 'pending' CHECK (moderation_label IN ('pending', 'genuine', 'troll', 'bad_faith')),
  ADD COLUMN IF NOT EXISTS moderation_confidence NUMERIC DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS moderation_reasoning TEXT,
  ADD COLUMN IF NOT EXISTS moderation_categories TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS moderation_provider TEXT,
  ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ;

-- Create audit log table for AI comment moderation
CREATE TABLE IF NOT EXISTS public.comment_moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL,
  comment_type TEXT NOT NULL DEFAULT 'social' CHECK (comment_type IN ('social', 'violation', 'forum')),
  content_text TEXT NOT NULL,
  classification TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  reasoning TEXT NOT NULL,
  categories TEXT[] DEFAULT '{}',
  recommended_action TEXT NOT NULL,
  provider_used TEXT NOT NULL,
  human_overridden BOOLEAN DEFAULT false,
  overridden_by UUID REFERENCES auth.users(id),
  override_action TEXT,
  override_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for efficient moderation queries
CREATE INDEX IF NOT EXISTS idx_comments_mod_status ON public.comments(moderation_status);
CREATE INDEX IF NOT EXISTS idx_violation_comments_mod_status ON public.violation_comments(moderation_status);
CREATE INDEX IF NOT EXISTS idx_mod_logs_comment_id ON public.comment_moderation_logs(comment_id);
CREATE INDEX IF NOT EXISTS idx_mod_logs_created_at ON public.comment_moderation_logs(created_at DESC);

-- Enable RLS on audit logs
ALTER TABLE public.comment_moderation_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit logs
CREATE POLICY "Authenticated users can view moderation logs"
  ON public.comment_moderation_logs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert moderation logs"
  ON public.comment_moderation_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Moderators can update moderation logs"
  ON public.comment_moderation_logs FOR UPDATE
  USING (auth.role() = 'authenticated');
