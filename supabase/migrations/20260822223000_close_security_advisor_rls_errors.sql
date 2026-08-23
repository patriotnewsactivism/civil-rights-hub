-- Close the six Supabase security-advisor RLS errors without broadening access.
-- Project: Civil Rights Hub (vrdnrbjnitptxrexdlao)

-- ---------------------------------------------------------------------------
-- Legacy / currently unverified public-content tables.
-- These remain service-role/admin maintainable, but browser roles get no direct
-- table access until a reviewed publication policy is designed for them.
-- ---------------------------------------------------------------------------
ALTER TABLE public.foia_response_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.know_your_rights_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_guides ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('foia_response_documents', 'know_your_rights_cards', 'challenge_guides')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END
$$;

-- ---------------------------------------------------------------------------
-- Social content studio: private per-user workspace.
-- ---------------------------------------------------------------------------
ALTER TABLE public.social_content_studio ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own social content" ON public.social_content_studio;
DROP POLICY IF EXISTS "Users can create own social content" ON public.social_content_studio;
DROP POLICY IF EXISTS "Users can update own social content" ON public.social_content_studio;
DROP POLICY IF EXISTS "Users can delete own social content" ON public.social_content_studio;

CREATE POLICY "Users can view own social content"
ON public.social_content_studio FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create own social content"
ON public.social_content_studio FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own social content"
ON public.social_content_studio FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own social content"
ON public.social_content_studio FOR DELETE
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- ---------------------------------------------------------------------------
-- FOIA campaigns: public campaigns can be browsed; authenticated users can
-- create campaigns they own. Membership rows are private to each participant.
-- Aggregate counters are maintained server-side rather than trusting browser
-- UPDATEs. Campaign edits can be introduced later through a constrained RPC.
-- ---------------------------------------------------------------------------
ALTER TABLE public.foia_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foia_campaign_participants ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('foia_campaigns', 'foia_campaign_participants')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END
$$;

CREATE POLICY "Public can browse active public FOIA campaigns"
ON public.foia_campaigns FOR SELECT
TO anon, authenticated
USING (
  (is_public = true AND status = 'active')
  OR created_by = (SELECT auth.uid())
);

CREATE POLICY "Authenticated users can create FOIA campaigns"
ON public.foia_campaigns FOR INSERT
TO authenticated
WITH CHECK (
  created_by = (SELECT auth.uid())
  AND COALESCE(featured, false) = false
  AND COALESCE(participant_count, 0) = 0
  AND COALESCE(request_count, 0) = 0
);

-- No direct browser UPDATE policy is intentionally created. This prevents a
-- campaign owner or participant from forging participant/request totals through
-- PostgREST. Aggregate changes happen only in the SECURITY DEFINER trigger below.

CREATE POLICY "Campaign owners can delete own FOIA campaigns"
ON public.foia_campaigns FOR DELETE
TO authenticated
USING (created_by = (SELECT auth.uid()));

CREATE POLICY "Users can view own campaign participation"
ON public.foia_campaign_participants FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can join active public campaigns"
ON public.foia_campaign_participants FOR INSERT
TO authenticated
WITH CHECK (
  user_id = (SELECT auth.uid())
  AND COALESCE(requests_filed, 0) BETWEEN 0 AND 1
  AND EXISTS (
    SELECT 1
    FROM public.foia_campaigns c
    WHERE c.id = campaign_id
      AND c.is_public = true
      AND c.status = 'active'
  )
);

CREATE POLICY "Users can update own campaign participation"
ON public.foia_campaign_participants FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (
  user_id = (SELECT auth.uid())
  AND COALESCE(requests_filed, 0) BETWEEN 0 AND 1
);

CREATE POLICY "Users can leave own campaign participation"
ON public.foia_campaign_participants FOR DELETE
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE OR REPLACE FUNCTION public.refresh_foia_campaign_counts(p_campaign_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  UPDATE public.foia_campaigns c
  SET participant_count = COALESCE(x.participant_count, 0),
      request_count = COALESCE(x.request_count, 0)
  FROM (
    SELECT
      p_campaign_id AS campaign_id,
      COUNT(*)::integer AS participant_count,
      COALESCE(SUM(p.requests_filed), 0)::integer AS request_count
    FROM public.foia_campaign_participants p
    WHERE p.campaign_id = p_campaign_id
  ) x
  WHERE c.id = x.campaign_id;
$$;

REVOKE ALL ON FUNCTION public.refresh_foia_campaign_counts(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.sync_foia_campaign_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_campaign_id uuid;
BEGIN
  v_campaign_id := COALESCE(NEW.campaign_id, OLD.campaign_id);
  PERFORM public.refresh_foia_campaign_counts(v_campaign_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.sync_foia_campaign_counts() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_sync_foia_campaign_counts ON public.foia_campaign_participants;
CREATE TRIGGER trg_sync_foia_campaign_counts
AFTER INSERT OR UPDATE OR DELETE ON public.foia_campaign_participants
FOR EACH ROW EXECUTE FUNCTION public.sync_foia_campaign_counts();

-- Normalize existing counters once from participant records.
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM public.foia_campaigns LOOP
    PERFORM public.refresh_foia_campaign_counts(r.id);
  END LOOP;
END
$$;
