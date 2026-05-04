-- Fix: "Database error saving new user" on civilrightshub.org signup
-- Root cause: handle_new_user trigger was inserting role='community' 
-- but the user_profiles_role_check constraint only allows:
-- user, journalist, attorney, activist, moderator, admin
-- Additional: added EXCEPTION handling so any future trigger errors never block signup.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name, role, is_verified)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)
    ),
    'user',
    false
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user error for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Allow service_role to bypass RLS for profile creation
DROP POLICY IF EXISTS "service_role_insert_profiles" ON public.user_profiles;
CREATE POLICY "service_role_insert_profiles"
  ON public.user_profiles FOR INSERT TO service_role
  WITH CHECK (true);

NOTIFY pgrst, 'reload schema';

