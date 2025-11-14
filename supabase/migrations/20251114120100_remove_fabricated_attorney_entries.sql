-- Remove fabricated attorney entries from the database
-- These entries were generated with fake contact information and non-existent organizations
-- Keeping only verified civil rights organizations and attorneys

-- Delete all the fabricated state-specific "Civil Liberties Response Team" entries
-- These were templated entries with the format "[State] Civil Liberties Response Team"
DELETE FROM public.attorneys
WHERE name LIKE '% Civil Liberties Response Team'
  AND firm = 'ACLU Civil Rights Litigation'
  AND email IS NULL
  AND phone IS NULL;

-- Delete all fabricated state-specific activist law firms that were generated
-- These include made-up firm names, fake phone numbers in format XXX-555-XXXX, and fake websites
DELETE FROM public.attorneys
WHERE (
  -- Fake phone numbers (555 is reserved for fictional use)
  phone LIKE '%-555-%'
  OR
  -- Fake organizational patterns
  firm IN (
    'Southern Justice Collective',
    'Northern Justice Project',
    'Desert Justice Law Center',
    'Ozark Civil Rights Law Group',
    'Golden State Rights Center',
    'Front Range Civil Rights Attorneys',
    'Constitution State Rights Lawyers',
    'First State Justice Center',
    'Sunshine State Legal Collective',
    'Peach State Justice Center',
    'Pacific Rights Law Group',
    'Gem State Rights Defense',
    'Lakefront Civil Rights Firm',
    'Crossroads Justice Collective',
    'Heartland Justice Partners',
    'Prairie Civil Liberties Group',
    'Bluegrass Rights Center',
    'Bayou Justice Advocates',
    'Pine Tree Rights Center',
    'Chesapeake Justice Partners',
    'Bay State Justice Network',
    'Great Lakes Civil Rights Firm',
    'Twin Cities Justice Cooperative',
    'Magnolia State Rights Center',
    'Gateway Civil Rights Group',
    'Big Sky Justice Collective',
    'Heartland Rights Advocates',
    'Silver State Justice Center',
    'Granite State Rights Lawyers',
    'Garden State Justice Collaborative',
    'Rio Grande Justice Center',
    'Liberty City Law Collective',
    'Piedmont Civil Liberties Project',
    'Red River Justice Network',
    'Buckeye Justice Advocates',
    'Red Dirt Rights Center',
    'Cascade Civil Rights Collective',
    'Keystone Justice Network',
    'Ocean State Rights Center',
    'Palmetto Civil Rights Advocates',
    'Prairie Freedom Lawyers',
    'Volunteer State Justice Network',
    'Lone Star Rights Center',
    'Wasatch Justice Collective',
    'Green Mountain Rights Center',
    'Commonwealth Justice Partners',
    'Cascade Freedom Attorneys',
    'Mountain State Justice Collective',
    'Badger State Rights Center',
    'High Plains Justice Network'
  )
);

-- Add comment explaining the cleanup
COMMENT ON TABLE public.attorneys IS 'Civil rights attorneys and organizations directory. Cleaned to remove fabricated entries with fake contact information. Contains only verified organizations.';
