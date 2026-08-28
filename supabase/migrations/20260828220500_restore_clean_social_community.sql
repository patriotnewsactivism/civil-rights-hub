-- Restore Civil Rights Hub social/community features from a clean, auditable state.
--
-- Production audit on 2026-08-28 found:
--   * 585 legacy posts owned by only two accounts, including a 500-row single-day seed burst
--   * 885 forum threads, 880 with NULL user_id, plus 5,007 forum replies
--   * 206 events, all with NULL organizer_id, including a 181-row single-day seed burst
--   * no storage policies for the public `posts` bucket
--   * permissive/incorrect RLS policies that allowed anonymous forum inserts,
--     cross-user story updates, broken followers visibility, and incorrect group-event visibility
--
-- The existing public social corpus is therefore quarantined in full before reopening.
-- Nothing is silently discarded: parent rows and dependent engagement records are snapshotted
-- into the private schema first. This migration then establishes a clean public slate and
-- a minimal, explicit RLS contract for future user-generated content.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS private.community_social_recovery_quarantine (
  id BIGSERIAL PRIMARY KEY,
  source_table TEXT NOT NULL,
  source_id TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  reason TEXT NOT NULL,
  quarantined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_table, source_id)
);

CREATE INDEX IF NOT EXISTS community_social_recovery_quarantine_source_idx
  ON private.community_social_recovery_quarantine (source_table, source_id);

-- Snapshot all currently exposed legacy social records and dependent engagement rows.
INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'comments', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.comments t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'likes', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.likes t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'post_bookmarks', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.post_bookmarks t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'post_shares', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.post_shares t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'post_reactions', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.post_reactions t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'poll_votes', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.poll_votes t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'forum_posts', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.forum_posts t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'thread_upvotes', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.thread_upvotes t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'thread_bookmarks', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.thread_bookmarks t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'thread_subscriptions', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.thread_subscriptions t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'thread_tags', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.thread_tags t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'event_rsvps', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.event_rsvps t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'posts', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.posts t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'forum_threads', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.forum_threads t
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.community_social_recovery_quarantine (source_table, source_id, snapshot, reason)
SELECT 'community_events', id::text, to_jsonb(t), 'Full social recovery quarantine before verified community relaunch.' FROM public.community_events t
ON CONFLICT (source_table, source_id) DO NOTHING;

-- Clear the contaminated public corpus. Cascades clean dependent records already snapshotted above.
DELETE FROM public.posts;
DELETE FROM public.forum_threads;
DELETE FROM public.community_events;

-- Reset social-derived profile counters contaminated by the quarantined corpus.
-- Keep relationship counts derived from surviving genuine follows rows.
UPDATE public.user_profiles AS profile
SET posts_created = 0,
    posts_count = 0,
    threads_created = 0,
    helpful_answers = 0,
    followers_count = (
      SELECT COUNT(*)::integer FROM public.follows f WHERE f.following_id = profile.user_id
    ),
    following_count = (
      SELECT COUNT(*)::integer FROM public.follows f WHERE f.follower_id = profile.user_id
    );

-- Restore media buckets and explicit object policies used by the social/profile UI.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'posts', 'posts', true, 52428800,
  ARRAY['image/jpeg','image/png','image/gif','image/webp','video/mp4','video/webm','audio/mpeg','audio/ogg','application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 'avatars', true, 5242880,
  ARRAY['image/jpeg','image/png','image/gif','image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Posts media is publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload post media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own post media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own post media" ON storage.objects;
DROP POLICY IF EXISTS community_posts_media_select ON storage.objects;
DROP POLICY IF EXISTS community_posts_media_insert ON storage.objects;
DROP POLICY IF EXISTS community_posts_media_update ON storage.objects;
DROP POLICY IF EXISTS community_posts_media_delete ON storage.objects;

CREATE POLICY community_posts_media_select
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'posts');

CREATE POLICY community_posts_media_insert
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'posts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY community_posts_media_update
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'posts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'posts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY community_posts_media_delete
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'posts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Avatars are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS community_avatars_select ON storage.objects;
DROP POLICY IF EXISTS community_avatars_insert ON storage.objects;
DROP POLICY IF EXISTS community_avatars_update ON storage.objects;
DROP POLICY IF EXISTS community_avatars_delete ON storage.objects;

CREATE POLICY community_avatars_select
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY community_avatars_insert
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY community_avatars_update
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY community_avatars_delete
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Replace the accumulated social policies with one explicit contract per operation.
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = ANY (ARRAY[
        'posts','comments','likes','post_bookmarks','post_shares','post_reactions','poll_votes',
        'stories','story_views','follows','user_profiles','forum_threads','forum_posts',
        'thread_upvotes','thread_bookmarks','thread_subscriptions','thread_tags','content_reports',
        'community_events','event_rsvps'
      ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END $$;

-- Posts: public posts are readable by everyone; follower-only posts use the actual follows table.
CREATE POLICY posts_public_select ON public.posts FOR SELECT TO anon, authenticated
USING (
  visibility = 'public'
  OR auth.uid() = user_id
  OR (
    visibility = 'followers'
    AND EXISTS (
      SELECT 1 FROM public.follows f
      WHERE f.follower_id = auth.uid()
        AND f.following_id = posts.user_id
    )
  )
);
CREATE POLICY posts_owner_insert ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY posts_owner_update ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY posts_owner_delete ON public.posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Comments and engagement inherit visibility from their parent post.
CREATE POLICY comments_visible_select ON public.comments FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = comments.post_id));
CREATE POLICY comments_owner_insert ON public.comments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.posts p WHERE p.id = comments.post_id));
CREATE POLICY comments_owner_update ON public.comments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY comments_owner_delete ON public.comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY likes_visible_select ON public.likes FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = likes.post_id));
CREATE POLICY likes_owner_insert ON public.likes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.posts p WHERE p.id = likes.post_id));
CREATE POLICY likes_owner_delete ON public.likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY reactions_visible_select ON public.post_reactions FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_reactions.post_id));
CREATE POLICY reactions_owner_insert ON public.post_reactions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_reactions.post_id));
CREATE POLICY reactions_owner_update ON public.post_reactions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY reactions_owner_delete ON public.post_reactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY shares_visible_select ON public.post_shares FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_shares.post_id));
CREATE POLICY shares_owner_insert ON public.post_shares FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_shares.post_id));
CREATE POLICY shares_owner_delete ON public.post_shares FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY bookmarks_owner_select ON public.post_bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY bookmarks_owner_insert ON public.post_bookmarks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY bookmarks_owner_delete ON public.post_bookmarks FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY poll_votes_visible_select ON public.poll_votes FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = poll_votes.poll_id));
CREATE POLICY poll_votes_owner_insert ON public.poll_votes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.posts p WHERE p.id = poll_votes.poll_id));
CREATE POLICY poll_votes_owner_delete ON public.poll_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Stories: signed-in users may only create/change/delete their own stories.
CREATE POLICY stories_live_select ON public.stories FOR SELECT TO anon, authenticated USING (expires_at > NOW());
CREATE POLICY stories_owner_insert ON public.stories FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY stories_owner_update ON public.stories FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY stories_owner_delete ON public.stories FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY story_views_owner_select ON public.story_views FOR SELECT TO authenticated
USING (
  auth.uid() = viewer_id
  OR EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_views.story_id AND s.user_id = auth.uid())
);
CREATE POLICY story_views_owner_insert ON public.story_views FOR INSERT TO authenticated WITH CHECK (auth.uid() = viewer_id);

-- Network relationships.
CREATE POLICY follows_public_select ON public.follows FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY follows_owner_insert ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id AND follower_id <> following_id);
CREATE POLICY follows_owner_delete ON public.follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- Forum: no anonymous creation. New rows must belong to the authenticated account.
CREATE POLICY forum_threads_public_select ON public.forum_threads FOR SELECT TO anon, authenticated USING (NOT is_deleted);
CREATE POLICY forum_threads_owner_insert ON public.forum_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY forum_threads_owner_update ON public.forum_threads FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY forum_threads_owner_delete ON public.forum_threads FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY forum_posts_public_select ON public.forum_posts FOR SELECT TO anon, authenticated
USING (NOT is_deleted AND EXISTS (SELECT 1 FROM public.forum_threads t WHERE t.id = forum_posts.thread_id AND NOT t.is_deleted));
CREATE POLICY forum_posts_owner_insert ON public.forum_posts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.forum_threads t WHERE t.id = forum_posts.thread_id AND NOT t.is_deleted AND NOT t.is_locked));
CREATE POLICY forum_posts_owner_update ON public.forum_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY forum_posts_owner_delete ON public.forum_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY thread_upvotes_public_select ON public.thread_upvotes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY thread_upvotes_owner_insert ON public.thread_upvotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY thread_upvotes_owner_delete ON public.thread_upvotes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY thread_bookmarks_owner_select ON public.thread_bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY thread_bookmarks_owner_insert ON public.thread_bookmarks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY thread_bookmarks_owner_delete ON public.thread_bookmarks FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY thread_subscriptions_owner_select ON public.thread_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY thread_subscriptions_owner_insert ON public.thread_subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY thread_subscriptions_owner_update ON public.thread_subscriptions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY thread_subscriptions_owner_delete ON public.thread_subscriptions FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY thread_tags_public_select ON public.thread_tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY thread_tags_authenticated_insert ON public.thread_tags FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.forum_threads t WHERE t.id = thread_tags.thread_id AND NOT t.is_deleted));

-- Reports require an authenticated reporter. Service-role moderation bypasses RLS.
CREATE POLICY content_reports_owner_select ON public.content_reports FOR SELECT TO authenticated USING (auth.uid() = reporter_id);
CREATE POLICY content_reports_owner_insert ON public.content_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);

-- Events are community-submitted, not platform-verified. Public listings are visible; private listings remain owner-only.
CREATE POLICY community_events_public_select ON public.community_events FOR SELECT TO anon
USING (is_public = true AND is_published = true AND COALESCE(is_cancelled, false) = false);
CREATE POLICY community_events_member_select ON public.community_events FOR SELECT TO authenticated
USING ((is_public = true AND is_published = true AND COALESCE(is_cancelled, false) = false) OR organizer_id = auth.uid());
CREATE POLICY community_events_owner_insert ON public.community_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY community_events_owner_update ON public.community_events FOR UPDATE TO authenticated USING (auth.uid() = organizer_id) WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY community_events_owner_delete ON public.community_events FOR DELETE TO authenticated USING (auth.uid() = organizer_id);

-- RSVP details are private to the attendee; aggregate count is maintained on community_events.
CREATE POLICY event_rsvps_owner_select ON public.event_rsvps FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY event_rsvps_owner_insert ON public.event_rsvps FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY event_rsvps_owner_update ON public.event_rsvps FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY event_rsvps_owner_delete ON public.event_rsvps FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.refresh_community_event_rsvp_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE target_event UUID;
BEGIN
  target_event := COALESCE(NEW.event_id, OLD.event_id);
  UPDATE public.community_events e
  SET rsvp_count = (
    SELECT COUNT(*)::integer
    FROM public.event_rsvps r
    WHERE r.event_id = target_event
      AND r.status = 'going'
  )
  WHERE e.id = target_event;
  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.refresh_community_event_rsvp_count() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS refresh_community_event_rsvp_count_trigger ON public.event_rsvps;
CREATE TRIGGER refresh_community_event_rsvp_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.event_rsvps
FOR EACH ROW EXECUTE FUNCTION public.refresh_community_event_rsvp_count();

-- Public profiles: expose only user-controlled public profile fields; do not expose email.
CREATE POLICY user_profiles_public_select ON public.user_profiles FOR SELECT TO anon, authenticated
USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY user_profiles_owner_insert ON public.user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_profiles_owner_update ON public.user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Prevent self-promotion into trusted roles or fabricated verification/reputation state.
CREATE OR REPLACE FUNCTION public.protect_user_profile_system_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF current_user NOT IN ('postgres', 'service_role') AND COALESCE(auth.role(), '') <> 'service_role' THEN
    IF TG_OP = 'INSERT' THEN
      NEW.role := 'user';
      NEW.is_verified := false;
      NEW.reputation_points := 0;
      NEW.helper_score := 0;
      NEW.threads_created := 0;
      NEW.posts_created := 0;
      NEW.helpful_answers := 0;
      NEW.followers_count := 0;
      NEW.following_count := 0;
      NEW.posts_count := 0;
      NEW.violations_count := 0;
      NEW.messages_sent_count := 0;
    ELSE
      NEW.role := OLD.role;
      NEW.is_verified := OLD.is_verified;
      NEW.reputation_points := OLD.reputation_points;
      NEW.helper_score := OLD.helper_score;
      NEW.threads_created := OLD.threads_created;
      NEW.posts_created := OLD.posts_created;
      NEW.helpful_answers := OLD.helpful_answers;
      NEW.followers_count := OLD.followers_count;
      NEW.following_count := OLD.following_count;
      NEW.posts_count := OLD.posts_count;
      NEW.violations_count := OLD.violations_count;
      NEW.messages_sent_count := OLD.messages_sent_count;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_user_profile_system_fields_trigger ON public.user_profiles;
CREATE TRIGGER protect_user_profile_system_fields_trigger
BEFORE INSERT OR UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_user_profile_system_fields();

-- Replace broad table grants with minimum browser privileges.
REVOKE ALL ON public.posts, public.comments, public.likes, public.post_bookmarks, public.post_shares,
  public.post_reactions, public.poll_votes, public.stories, public.story_views, public.follows,
  public.forum_threads, public.forum_posts, public.thread_upvotes, public.thread_bookmarks,
  public.thread_subscriptions, public.thread_tags, public.content_reports, public.community_events,
  public.event_rsvps FROM anon, authenticated;

GRANT SELECT ON public.posts, public.comments, public.likes, public.post_shares, public.post_reactions,
  public.poll_votes, public.stories, public.follows, public.forum_threads, public.forum_posts,
  public.thread_upvotes, public.thread_tags, public.community_events TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON public.posts, public.comments, public.post_reactions,
  public.stories, public.forum_threads, public.forum_posts, public.community_events TO authenticated;
GRANT INSERT, DELETE ON public.likes, public.post_bookmarks, public.post_shares, public.poll_votes,
  public.story_views, public.follows, public.thread_upvotes, public.thread_bookmarks,
  public.thread_tags, public.content_reports, public.event_rsvps TO authenticated;
GRANT SELECT ON public.post_bookmarks, public.story_views, public.thread_bookmarks,
  public.thread_subscriptions, public.content_reports, public.event_rsvps TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.thread_subscriptions TO authenticated;
GRANT UPDATE ON public.event_rsvps TO authenticated;

REVOKE ALL ON public.user_profiles FROM anon, authenticated;
GRANT SELECT (
  id, user_id, username, display_name, bio, avatar_url, location_state, location_city,
  is_public, show_location, show_email, reputation_points, helper_score, threads_created,
  posts_created, helpful_answers, website_url, twitter_handle, created_at, updated_at,
  role, is_verified, last_seen_at, location, followers_count, following_count, posts_count,
  violations_count, messages_sent_count
) ON public.user_profiles TO anon, authenticated;
GRANT INSERT (
  user_id, username, display_name, bio, avatar_url, location_state, location_city,
  is_public, show_location, show_email, website_url, twitter_handle, location
) ON public.user_profiles TO authenticated;
GRANT UPDATE (
  username, display_name, bio, avatar_url, location_state, location_city,
  is_public, show_location, show_email, website_url, twitter_handle, location
) ON public.user_profiles TO authenticated;

COMMENT ON TABLE private.community_social_recovery_quarantine IS
  'Reversible snapshots of the pre-relaunch social corpus quarantined on 2026-08-28 after production audits identified pervasive synthetic seed content.';
