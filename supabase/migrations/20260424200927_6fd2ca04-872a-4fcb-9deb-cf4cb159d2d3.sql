-- Digest subscriptions for weekly "Today near you" emails
CREATE TABLE public.digest_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  state TEXT,
  frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.digest_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own digest subscription"
  ON public.digest_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own digest subscription"
  ON public.digest_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own digest subscription"
  ON public.digest_subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own digest subscription"
  ON public.digest_subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_digest_subscriptions_updated_at
  BEFORE UPDATE ON public.digest_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_digest_subscriptions_enabled_state
  ON public.digest_subscriptions (enabled, state)
  WHERE enabled = true;