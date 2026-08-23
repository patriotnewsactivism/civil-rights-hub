-- Newsletter subscribers + sponsored content tracking
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  state TEXT,
  interests TEXT[] DEFAULT '{}',
  source TEXT DEFAULT 'site_widget',
  is_confirmed BOOLEAN DEFAULT FALSE,
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_state ON public.newsletter_subscribers(state);

-- RLS: public can insert (subscribe), but only owner can read their own
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can unsubscribe by email" ON public.newsletter_subscribers
  FOR UPDATE USING (true);

-- Allow public read of just whether an email exists (for duplicate check)
-- Actually, keep it simple — no public reads. Insert only.

-- Add columns to existing sponsored_content table for newsletter integration
ALTER TABLE public.sponsored_content
  ADD COLUMN IF NOT EXISTS newsletter_placement BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS newsletter_position INTEGER DEFAULT 1;

-- Confirm table
SELECT 'newsletter_subscribers created' as status;
