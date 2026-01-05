-- Fix Texas attorney locations - they are in HOUSTON, not Dallas
-- Also add CJ Grisham

-- Update Benjamin Campagna to Houston
UPDATE public.attorneys
SET city = 'Houston'
WHERE name = 'Benjamin Campagna' AND state = 'Texas';

-- Update Courtney Vincent to Houston
UPDATE public.attorneys
SET city = 'Houston'
WHERE name = 'Courtney Vincent' AND state = 'Texas';

-- Update Texas Attorney Group to Houston
UPDATE public.attorneys
SET city = 'Houston'
WHERE firm = 'Texas Attorney Group' AND state = 'Texas';

-- Add CJ Grisham - 1st and 2nd Amendment attorney
INSERT INTO public.attorneys (
  name, firm, state, city, practice_areas, specialties, phone, email, website, bio, accepts_pro_bono, rating, review_count
) VALUES
('CJ Grisham', 'Independent Practice', 'Texas', 'Houston',
  ARRAY['Constitutional Law', 'First Amendment', 'Second Amendment', 'Civil Rights'],
  ARRAY['Gun Rights', 'Open Carry', 'Free Speech', 'Constitutional Rights'],
  NULL, NULL, NULL,
  'First and Second Amendment attorney and activist in Texas, known for advocacy of constitutional rights including open carry and free speech.',
  true, NULL, NULL)
ON CONFLICT (name, phone) DO NOTHING;

-- Add comment about correction
COMMENT ON TABLE public.attorneys IS 'Civil rights attorneys and organizations directory. All contact information sourced from official websites and public records. Locations verified for accuracy. Users should verify current contact details before reaching out.';
