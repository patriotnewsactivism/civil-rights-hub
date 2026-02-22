-- Post-signup seeding functions and triggers
-- Handles automatic initialization of new user data including profile, notifications, achievements, and reputation

-- =====================================================
-- HELPER FUNCTION: Check if table exists
-- =====================================================
CREATE OR REPLACE FUNCTION public.table_exists(p_table_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = p_table_name
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- MAIN FUNCTION: Seed initial data for new users
-- =====================================================
CREATE OR REPLACE FUNCTION public.seed_initial_user_data()
RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_display_name TEXT;
  v_achievement_id UUID;
  v_profile_exists BOOLEAN;
BEGIN
  BEGIN
    -- Determine username and display name from user metadata or email
    v_username := COALESCE(
      NEW.raw_user_meta_data->>'username',
      NEW.raw_user_meta_data->>'preferred_username',
      lower(split_part(NEW.email, '@', 1))
    );
    
    v_display_name := COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      v_username
    );

    -- =====================================================
    -- 1. Create user_profiles entry if it doesn't exist
    -- =====================================================
    SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE user_id = NEW.id)
    INTO v_profile_exists;
    
    IF NOT v_profile_exists THEN
      INSERT INTO public.user_profiles (
        user_id,
        username,
        display_name,
        is_public,
        show_location,
        show_email,
        reputation_points,
        helper_score
      ) VALUES (
        NEW.id,
        v_username,
        v_display_name,
        TRUE,
        FALSE,
        FALSE,
        0,
        0
      )
      ON CONFLICT (user_id) DO NOTHING;
    END IF;

    -- =====================================================
    -- 2. Insert welcome notification
    -- =====================================================
    IF public.table_exists('notifications') THEN
      INSERT INTO public.notifications (
        user_id,
        type,
        content,
        is_read
      ) VALUES (
        NEW.id,
        'badge_earned',
        'Welcome to Civil Rights Hub! Complete your profile to unlock all features.',
        FALSE
      )
      ON CONFLICT DO NOTHING;
    END IF;

    -- =====================================================
    -- 3. Award "new_member" achievement (using user_achievements)
    -- =====================================================
    IF public.table_exists('user_achievements') AND public.table_exists('achievement_definitions') THEN
      -- Get the early_adopter or first_post achievement for new members
      SELECT id INTO v_achievement_id
      FROM public.achievement_definitions
      WHERE name = 'early_adopter' AND is_active = TRUE
      LIMIT 1;
      
      -- If early_adopter doesn't exist, try first_post
      IF v_achievement_id IS NULL THEN
        SELECT id INTO v_achievement_id
        FROM public.achievement_definitions
        WHERE name = 'first_post' AND is_active = TRUE
        LIMIT 1;
      END IF;
      
      -- Award the achievement if found
      IF v_achievement_id IS NOT NULL THEN
        INSERT INTO public.user_achievements (user_id, achievement_id)
        VALUES (NEW.id, v_achievement_id)
        ON CONFLICT (user_id, achievement_id) DO NOTHING;
      END IF;
    END IF;

    -- =====================================================
    -- 4. Award legacy user_badges "new_member" badge
    -- =====================================================
    IF public.table_exists('user_badges') THEN
      INSERT INTO public.user_badges (
        user_id,
        badge_type,
        badge_name,
        badge_description,
        badge_icon
      ) VALUES (
        NEW.id,
        'new_member',
        'New Member',
        'Welcome to the Civil Rights Hub community!',
        '🎉'
      )
      ON CONFLICT (user_id, badge_type) DO NOTHING;
    END IF;

    -- =====================================================
    -- 5. Initialize reputation and add first login points
    -- =====================================================
    IF public.table_exists('user_reputation') THEN
      INSERT INTO public.user_reputation (
        user_id,
        points,
        level,
        streak_days,
        last_activity_date,
        total_posts,
        total_comments,
        total_reactions_received
      ) VALUES (
        NEW.id,
        10,
        1,
        1,
        CURRENT_DATE,
        0,
        0,
        0
      )
      ON CONFLICT (user_id) DO UPDATE SET
        last_activity_date = CURRENT_DATE;
    END IF;

    -- =====================================================
    -- 6. Add reputation event for first login
    -- =====================================================
    IF public.table_exists('reputation_events') THEN
      INSERT INTO public.reputation_events (
        user_id,
        event_type,
        points,
        related_entity_type,
        related_entity_id
      ) VALUES (
        NEW.id,
        'daily_login',
        10,
        'user',
        NEW.id
      );
    END IF;

    -- =====================================================
    -- 7. Log initial activity
    -- =====================================================
    IF public.table_exists('user_activity') THEN
      INSERT INTO public.user_activity (
        user_id,
        activity_type,
        reference_id,
        reference_type
      ) VALUES (
        NEW.id,
        'post',
        NEW.id,
        'account_created'
      );
    END IF;

    RAISE NOTICE 'Successfully seeded initial data for user: %', NEW.id;
    
  EXCEPTION
    WHEN OTHERS THEN
      -- Log error but don't fail the signup
      RAISE WARNING 'Error seeding initial data for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- TRIGGER: Fire after new user creation
-- =====================================================

-- Drop the existing trigger if it exists (from earlier migration)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the old function if we want to consolidate
DROP FUNCTION IF EXISTS public.create_user_profile();

-- Create new trigger for comprehensive user seeding
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.seed_initial_user_data();

-- =====================================================
-- MANUAL SEEDING FUNCTION: For existing users
-- =====================================================
CREATE OR REPLACE FUNCTION public.seed_existing_user(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB := '{"success": true, "actions": []}'::JSONB;
  v_achievement_id UUID;
  v_profile_exists BOOLEAN;
BEGIN
  BEGIN
    -- Verify user exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'User not found'
      );
    END IF;

    -- Check if profile exists
    SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE user_id = p_user_id)
    INTO v_profile_exists;

    -- 1. Create user profile if missing
    IF NOT v_profile_exists THEN
      INSERT INTO public.user_profiles (
        user_id,
        username,
        display_name,
        is_public,
        reputation_points
      )
      SELECT 
        id,
        lower(split_part(email, '@', 1)),
        COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
        TRUE,
        0
      FROM auth.users
      WHERE id = p_user_id
      ON CONFLICT (user_id) DO NOTHING;
      
      v_result := jsonb_set(v_result, '{actions}', v_result->'actions' || '"created_profile"');
    END IF;

    -- 2. Add welcome notification if not exists
    IF public.table_exists('notifications') THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.notifications 
        WHERE user_id = p_user_id AND type = 'badge_earned'
      ) THEN
        INSERT INTO public.notifications (
          user_id,
          type,
          content,
          is_read
        ) VALUES (
          p_user_id,
          'badge_earned',
          'Welcome to Civil Rights Hub! Your account has been set up.',
          TRUE  -- Mark as read for existing users
        );
        v_result := jsonb_set(v_result, '{actions}', v_result->'actions' || '"created_notification"');
      END IF;
    END IF;

    -- 3. Award early_adopter or first_post achievement
    IF public.table_exists('user_achievements') AND public.table_exists('achievement_definitions') THEN
      SELECT id INTO v_achievement_id
      FROM public.achievement_definitions
      WHERE name = 'early_adopter' AND is_active = TRUE;
      
      IF v_achievement_id IS NOT NULL THEN
        INSERT INTO public.user_achievements (user_id, achievement_id)
        VALUES (p_user_id, v_achievement_id)
        ON CONFLICT (user_id, achievement_id) DO NOTHING;
        
        IF FOUND THEN
          v_result := jsonb_set(v_result, '{actions}', v_result->'actions' || '"awarded_early_adopter"');
        END IF;
      END IF;
    END IF;

    -- 4. Award new_member badge
    IF public.table_exists('user_badges') THEN
      INSERT INTO public.user_badges (
        user_id,
        badge_type,
        badge_name,
        badge_description,
        badge_icon
      ) VALUES (
        p_user_id,
        'new_member',
        'New Member',
        'Welcome to the Civil Rights Hub community!',
        '🎉'
      )
      ON CONFLICT (user_id, badge_type) DO NOTHING;
      
      IF FOUND THEN
        v_result := jsonb_set(v_result, '{actions}', v_result->'actions' || '"awarded_badge"');
      END IF;
    END IF;

    -- 5. Initialize reputation
    IF public.table_exists('user_reputation') THEN
      INSERT INTO public.user_reputation (
        user_id,
        points,
        level,
        streak_days,
        last_activity_date
      ) VALUES (
        p_user_id,
        10,
        1,
        1,
        CURRENT_DATE
      )
      ON CONFLICT (user_id) DO NOTHING;
      
      IF FOUND THEN
        v_result := jsonb_set(v_result, '{actions}', v_result->'actions' || '"initialized_reputation"');
      END IF;
    END IF;

    -- 6. Add reputation event
    IF public.table_exists('reputation_events') THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.reputation_events 
        WHERE user_id = p_user_id AND event_type = 'daily_login'
      ) THEN
        INSERT INTO public.reputation_events (
          user_id,
          event_type,
          points
        ) VALUES (
          p_user_id,
          'daily_login',
          10
        );
        v_result := jsonb_set(v_result, '{actions}', v_result->'actions' || '"added_reputation_event"');
      END IF;
    END IF;

    RETURN v_result;

  EXCEPTION
    WHEN OTHERS THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM,
        'actions', v_result->'actions'
      );
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- BULK MIGRATION FUNCTION: Seed all existing users
-- =====================================================
CREATE OR REPLACE FUNCTION public.seed_all_existing_users()
RETURNS JSONB AS $$
DECLARE
  v_user RECORD;
  v_total_count INTEGER := 0;
  v_success_count INTEGER := 0;
  v_error_count INTEGER := 0;
  v_result JSONB;
BEGIN
  FOR v_user IN 
    SELECT id FROM auth.users 
    WHERE id NOT IN (SELECT user_id FROM public.user_profiles WHERE user_id IS NOT NULL)
       OR id NOT IN (SELECT user_id FROM public.user_reputation WHERE user_id IS NOT NULL)
  LOOP
    v_total_count := v_total_count + 1;
    
    v_result := public.seed_existing_user(v_user.id);
    
    IF (v_result->>'success')::BOOLEAN THEN
      v_success_count := v_success_count + 1;
    ELSE
      v_error_count := v_error_count + 1;
      RAISE WARNING 'Failed to seed user %: %', v_user.id, v_result->>'error';
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'total_users_processed', v_total_count,
    'successful', v_success_count,
    'errors', v_error_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- GRANT EXECUTE PERMISSIONS
-- =====================================================
GRANT EXECUTE ON FUNCTION public.seed_existing_user(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.seed_all_existing_users() TO service_role;
GRANT EXECUTE ON FUNCTION public.table_exists(TEXT) TO service_role;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON FUNCTION public.seed_initial_user_data() IS 
'Trigger function that automatically seeds initial data for new users after signup. Creates profile, notifications, achievements, and reputation entries. Errors are caught to prevent signup failures.';

COMMENT ON FUNCTION public.seed_existing_user(UUID) IS 
'Manually seed initial data for an existing user. Useful for migrating users created before the trigger was in place. Returns JSONB with success status and actions taken.';

COMMENT ON FUNCTION public.seed_all_existing_users() IS 
'Bulk operation to seed all existing users who are missing initial data. Returns summary of processed users.';

COMMENT ON FUNCTION public.table_exists(TEXT) IS 
'Helper function to check if a table exists in the public schema. Used for safe conditional operations.';
