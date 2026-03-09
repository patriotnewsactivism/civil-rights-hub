-- Cleanup Fabricated Data Migration
-- PURPOSE: Remove auto-generated/hallucinated attorney entries and fake contact information

-- ============================================
-- STEP 1: CLEANUP FABRICATED ATTORNEY ENTRIES
-- ============================================

-- Remove attorneys with generated email patterns: @{lastname}law.com
DELETE FROM public.attorneys
WHERE email ~ '@[a-z]+law\.com$'
  AND email NOT LIKE '%@johnburrislaw.com'
  AND email NOT LIKE '%@hadsellstormer.com'
  AND email NOT LIKE '%@merrittlawfirm.com'
  AND email NOT LIKE '%@burtonlawfirm.com'
  AND email NOT LIKE '%@galipo.com'
  AND email NOT LIKE '%@steeringlaw.com'
  AND email NOT LIKE '%@merinlaw.com'
  AND email NOT LIKE '%@desimonelaw.com'
  AND email NOT LIKE '%@yateslawfirm.com'
  AND email NOT LIKE '%@horowitzlaw.com'
  AND email NOT LIKE '%@kmbllaw.com'
  AND email NOT LIKE '%@lpcdlaw.com'
  AND email NOT LIKE '%@josephtullylaw.com'
  AND email NOT LIKE '%@pointerbuelna.com'
  AND email NOT LIKE '%@earlysullivan.com';

-- Remove attorneys with fabricated bar numbers (2-letter state code + 5 digits pattern)
DELETE FROM public.attorneys
WHERE bar_number ~ '^[A-Z]{2}-[0-9]{5}$';

-- Remove attorneys with fake website patterns
DELETE FROM public.attorneys
WHERE website ~ '^https://www\.[a-z]+[a-z]+law\.com$'
  AND website NOT LIKE '%johnburrislaw.com'
  AND website NOT LIKE '%hadsellstormer.com'
  AND website NOT LIKE '%merrittlawfirm.com'
  AND website NOT LIKE '%steeringlaw.com'
  AND website NOT LIKE '%merinlaw.com'
  AND website NOT LIKE '%desimonelaw.com'
  AND website NOT LIKE '%thekatzfirm.com'
  AND website NOT LIKE '%horowitzlaw.com';

-- Remove attorneys with "Law Offices of {FirstName} {LastName}" pattern that have fabricated details
DELETE FROM public.attorneys
WHERE firm ~ '^Law Offices of [A-Z][a-z]+ [A-Z][a-z]+$'
  AND (
    email ~ '@[a-z]+law\.com$'
    OR bar_number ~ '^[A-Z]{2}-[0-9]{5}$'
    OR website ~ '^https://www\.[a-z]+[a-z]+law\.com$'
  );

-- Remove specific fabricated firm names
DELETE FROM public.attorneys
WHERE firm IN (
  'Southern Justice Collective', 'Northern Justice Project', 'Desert Justice Law Center',
  'Ozark Civil Rights Law Group', 'Golden State Rights Center', 'Front Range Civil Rights Attorneys',
  'Constitution State Rights Lawyers', 'First State Justice Center', 'Sunshine State Legal Collective',
  'Peach State Justice Center', 'Pacific Rights Law Group', 'Gem State Rights Defense',
  'Lakefront Civil Rights Firm', 'Crossroads Justice Collective', 'Heartland Justice Partners',
  'Prairie Civil Liberties Group', 'Bluegrass Rights Center', 'Bayou Justice Advocates',
  'Pine Tree Rights Center', 'Chesapeake Justice Partners', 'Bay State Justice Network',
  'Great Lakes Civil Rights Firm', 'Twin Cities Justice Cooperative', 'Magnolia State Rights Center',
  'Gateway Civil Rights Group', 'Big Sky Justice Collective', 'Heartland Rights Advocates',
  'Silver State Justice Center', 'Granite State Rights Lawyers', 'Garden State Justice Collaborative',
  'Rio Grande Justice Center', 'Liberty City Law Collective', 'Piedmont Civil Liberties Project',
  'Red River Justice Network', 'Buckeye Justice Advocates', 'Red Dirt Rights Center',
  'Cascade Civil Rights Collective', 'Keystone Justice Network', 'Ocean State Rights Center',
  'Palmetto Civil Rights Advocates', 'Prairie Freedom Lawyers', 'Volunteer State Justice Network',
  'Lone Star Rights Center', 'Wasatch Justice Collective', 'Green Mountain Rights Center',
  'Commonwealth Justice Partners', 'Cascade Freedom Attorneys', 'Mountain State Justice Collective',
  'Badger State Rights Center', 'High Plains Justice Network'
);

-- Remove attorneys with placeholder/example email domains
DELETE FROM public.attorneys
WHERE email LIKE '%@example.%'
   OR email LIKE '%@fake.%'
   OR email LIKE '%@placeholder.%'
   OR email LIKE '%@test.%'
   OR email LIKE '%@sample.%';

-- ============================================
-- STEP 2: CLEANUP FABRICATED ACTIVISTS
-- ============================================

DELETE FROM public.activists
WHERE channel_url LIKE '%example.%'
   OR channel_url LIKE '%fake.%'
   OR channel_url LIKE '%placeholder.%'
   OR channel_url LIKE '%test.%';

-- ============================================
-- STEP 3: VERIFY PRESERVED DATA
-- ============================================

DO $$
DECLARE
  attorney_count INTEGER;
  activist_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO attorney_count FROM public.attorneys;
  SELECT COUNT(*) INTO activist_count FROM public.activists;
  
  RAISE NOTICE 'Cleanup complete.';
  RAISE NOTICE 'Remaining Attorneys: %', attorney_count;
  RAISE NOTICE 'Remaining Activists: %', activist_count;
END $$;
