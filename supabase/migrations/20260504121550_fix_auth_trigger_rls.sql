-- Fix: handle_new_user trigger error blocking signup
-- Root cause: RLS INSERT policy requires auth.uid() = user_id, but during signup
-- auth.uid() is NULL so the trigger insert is blocked by RLS.
-- Fix: Add exception handling so trigger failures never block signup,
-- and add service_role bypass policy.

-- Update function with proper error handling and SECURITY DEFINER + search_path
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
    'community',
    false
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user: could not create profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Grant service_role bypass so trigger (running as postgres) can always insert
DROP POLICY IF EXISTS "service_role_insert_profiles" ON public.user_profiles;
CREATE POLICY "service_role_insert_profiles"
  ON public.user_profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Also allow authenticated users to insert their own profile (needed for manual profile creation)
DROP POLICY IF EXISTS "Users can create their own profile" ON public.user_profiles;
CREATE POLICY "Users can create their own profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

NOTIFY pgrst, 'reload schema';

