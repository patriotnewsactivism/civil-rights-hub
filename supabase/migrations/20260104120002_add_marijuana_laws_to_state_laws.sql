-- Add comprehensive marijuana/cannabis laws to state_laws table
-- Data sourced from NORML, MPP, state legislature websites - January 2026

ALTER TABLE public.state_laws
  ADD COLUMN IF NOT EXISTS marijuana_status TEXT, -- 'Fully Legal', 'Medical Only', 'Decriminalized', 'Illegal', 'CBD Only'
  ADD COLUMN IF NOT EXISTS marijuana_possession_limit TEXT,
  ADD COLUMN IF NOT EXISTS marijuana_cultivation_limit TEXT,
  ADD COLUMN IF NOT EXISTS marijuana_medical_conditions TEXT[],
  ADD COLUMN IF NOT EXISTS marijuana_decrim_amount TEXT,
  ADD COLUMN IF NOT EXISTS marijuana_decrim_penalty TEXT,
  ADD COLUMN IF NOT EXISTS marijuana_felony_threshold TEXT,
  ADD COLUMN IF NOT EXISTS marijuana_home_cultivation_allowed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS marijuana_dispensaries_operational BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS marijuana_social_consumption_allowed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS marijuana_employment_protections BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS marijuana_expungement_available BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS marijuana_notes TEXT,
  ADD COLUMN IF NOT EXISTS marijuana_last_updated DATE DEFAULT now();

-- Update all 50 states with current marijuana laws (January 2026)

-- FULLY LEGAL STATES (Adult-Use Recreational + Medical)

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 1 ounce (28g) in public, up to 10 ounces at home',
  marijuana_cultivation_limit = '6 plants per person, 12 per household',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = true,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2014. No public consumption. Employers cannot discriminate based on off-duty use for most positions.',
  marijuana_last_updated = '2026-01-04'
WHERE state = 'Colorado';

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 1 ounce in public, up to 8 ounces at home',
  marijuana_cultivation_limit = '4 plants per residence',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = true,
  marijuana_employment_protections = false,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2014. Social consumption lounges permitted in some jurisdictions. Employment protections limited.',
  marijuana_last_updated = '2026-01-04'
WHERE state = 'Washington';

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 2 ounces in public, up to 8 ounces at home',
  marijuana_cultivation_limit = '4 plants per household',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2015. Home cultivation allowed but with restrictions.',
  marijuana_last_updated = '2026-01-04'
WHERE state = 'Oregon';

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 1 ounce',
  marijuana_cultivation_limit = '6 plants',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2016. Local jurisdictions may ban dispensaries.',
  marijuana_last_updated = '2026-01-04'
WHERE state = 'California';

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 1 ounce',
  marijuana_cultivation_limit = '6 plants per person, 12 per household',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2016. No public consumption.',
  marijuana_last_updated = '2026-01-04'
WHERE state = 'Nevada';

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 1 ounce',
  marijuana_cultivation_limit = '3 mature and 3 immature plants (if 25+ miles from dispensary)',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2017. Home cultivation only if 25+ miles from nearest dispensary.',
  marijuana_last_updated = '2026-01-04'
WHERE state IN ('Massachusetts', 'Maine');

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 1 ounce',
  marijuana_cultivation_limit = '6 plants per person, 12 per household',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2018.',
  marijuana_last_updated = '2026-01-04'
WHERE state IN ('Michigan', 'Vermont');

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 3 ounces in public, up to 5 pounds at home',
  marijuana_cultivation_limit = '3 mature and 3 immature plants per person, 6 mature and 6 immature per household',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = true,
  marijuana_employment_protections = true,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2020. Extensive expungement provisions. Employment protections for off-duty use.',
  marijuana_last_updated = '2026-01-04'
WHERE state = 'Illinois';

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 2 ounces',
  marijuana_cultivation_limit = '6 plants per person, 12 per household',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2021.',
  marijuana_last_updated = '2026-01-04'
WHERE state IN ('Arizona', 'Montana', 'New Jersey');

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 3 ounces',
  marijuana_cultivation_limit = '3 mature and 3 immature plants (when retail not available)',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = true,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2021. Strong employment protections. Automatic expungement.',
  marijuana_last_updated = '2026-01-04'
WHERE state = 'New York';

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 2 ounces in public, up to 10 ounces at home',
  marijuana_cultivation_limit = '6 plants per person, 12 per household',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = true,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2021. Strong social equity provisions.',
  marijuana_last_updated = '2026-01-04'
WHERE state = 'Connecticut';

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 1 ounce',
  marijuana_cultivation_limit = '6 plants per person, 12 per household',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2022.',
  marijuana_last_updated = '2026-01-04'
WHERE state IN ('Rhode Island', 'New Mexico');

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 2 ounces',
  marijuana_cultivation_limit = '12 plants per household',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = true,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2023. Strong social equity program.',
  marijuana_last_updated = '2026-01-04'
WHERE state = 'Maryland';

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 2 ounces',
  marijuana_cultivation_limit = '12 plants per household',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2023.',
  marijuana_last_updated = '2026-01-04'
WHERE state IN ('Missouri', 'Delaware');

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 2.5 ounces',
  marijuana_cultivation_limit = '12 plants per household',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = true,
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2024.',
  marijuana_last_updated = '2026-01-04'
WHERE state = 'Minnesota';

UPDATE public.state_laws SET
  marijuana_status = 'Fully Legal',
  marijuana_possession_limit = 'Up to 2 ounces in public, up to 10 ounces at home',
  marijuana_cultivation_limit = '6 plants per person, 12 per household',
  marijuana_home_cultivation_allowed = true,
  marijuana_dispensaries_operational = false, -- Sales begin 2025
  marijuana_social_consumption_allowed = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = true,
  marijuana_notes = 'Recreational legal since 2023. Retail sales launching 2025.',
  marijuana_last_updated = '2026-01-04'
WHERE state = 'Ohio';

-- MEDICAL ONLY STATES

UPDATE public.state_laws SET
  marijuana_status = 'Medical Only',
  marijuana_possession_limit = 'Varies by patient certification (typically up to 2.5 ounces per 14 days)',
  marijuana_medical_conditions = ARRAY['Cancer', 'Glaucoma', 'HIV/AIDS', 'Hepatitis C', 'ALS', 'Crohn''s Disease', 'Alzheimer''s', 'PTSD', 'Chronic Pain'],
  marijuana_home_cultivation_allowed = false,
  marijuana_dispensaries_operational = true,
  marijuana_employment_protections = false,
  marijuana_expungement_available = false,
  marijuana_notes = 'Medical program operational. No home cultivation. Reciprocity for out-of-state patients.',
  marijuana_last_updated = '2026-01-04'
WHERE state IN ('Florida', 'Pennsylvania', 'Arkansas', 'Louisiana', 'Oklahoma', 'West Virginia');

UPDATE public.state_laws SET
  marijuana_status = 'Medical Only',
  marijuana_possession_limit = 'Up to 3 ounces per month for patients',
  marijuana_medical_conditions = ARRAY['Cancer', 'HIV/AIDS', 'Epilepsy', 'PTSD', 'Chronic Pain', 'Multiple Sclerosis'],
  marijuana_home_cultivation_allowed = true,
  marijuana_cultivation_limit = '12 plants for patients',
  marijuana_dispensaries_operational = true,
  marijuana_employment_protections = false,
  marijuana_expungement_available = false,
  marijuana_notes = 'Medical program with home cultivation rights for patients.',
  marijuana_last_updated = '2026-01-04'
WHERE state IN ('Alaska', 'Hawaii');

UPDATE public.state_laws SET
  marijuana_status = 'Medical Only',
  marijuana_possession_limit = 'Varies by condition and physician recommendation',
  marijuana_medical_conditions = ARRAY['Cancer', 'HIV/AIDS', 'Multiple Sclerosis', 'Epilepsy', 'PTSD', 'Chronic Pain', 'Terminal Illness'],
  marijuana_home_cultivation_allowed = false,
  marijuana_dispensaries_operational = true,
  marijuana_employment_protections = false,
  marijuana_expungement_available = false,
  marijuana_notes = 'Medical program operational. Restrictive compared to other medical states.',
  marijuana_last_updated = '2026-01-04'
WHERE state IN ('Alabama', 'Mississippi', 'North Dakota', 'South Dakota', 'Utah');

-- DECRIMINALIZED STATES

UPDATE public.state_laws SET
  marijuana_status = 'Decriminalized',
  marijuana_decrim_amount = 'Up to 1 ounce',
  marijuana_decrim_penalty = 'Civil infraction, $100 fine',
  marijuana_felony_threshold = 'Over 5 pounds',
  marijuana_home_cultivation_allowed = false,
  marijuana_dispensaries_operational = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = false,
  marijuana_notes = 'Decriminalized small amounts but no legal market. Possession remains illegal but civil offense.',
  marijuana_last_updated = '2026-01-04'
WHERE state IN ('North Carolina', 'Nebraska');

UPDATE public.state_laws SET
  marijuana_status = 'Decriminalized',
  marijuana_decrim_amount = 'Up to 10 grams',
  marijuana_decrim_penalty = 'Civil citation, fine varies by locality',
  marijuana_felony_threshold = 'Over 50 grams',
  marijuana_home_cultivation_allowed = false,
  marijuana_dispensaries_operational = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = false,
  marijuana_notes = 'Some cities have decriminalized. State law still prohibits.',
  marijuana_last_updated = '2026-01-04'
WHERE state IN ('Virginia');

-- CBD ONLY STATES

UPDATE public.state_laws SET
  marijuana_status = 'CBD Only',
  marijuana_possession_limit = 'CBD products with <0.3% THC only',
  marijuana_medical_conditions = ARRAY['Severe epilepsy', 'Seizure disorders'],
  marijuana_home_cultivation_allowed = false,
  marijuana_dispensaries_operational = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = false,
  marijuana_notes = 'Only low-THC CBD products legal for limited medical conditions.',
  marijuana_last_updated = '2026-01-04'
WHERE state IN ('Texas', 'Wisconsin', 'Tennessee', 'Kentucky', 'Indiana', 'Kansas', 'South Carolina', 'Georgia');

-- ILLEGAL STATES (No program of any kind)

UPDATE public.state_laws SET
  marijuana_status = 'Illegal',
  marijuana_possession_limit = 'None - all possession illegal',
  marijuana_decrim_amount = NULL,
  marijuana_felony_threshold = 'Any amount can be prosecuted as misdemeanor; larger amounts as felony',
  marijuana_home_cultivation_allowed = false,
  marijuana_dispensaries_operational = false,
  marijuana_employment_protections = false,
  marijuana_expungement_available = false,
  marijuana_notes = 'All marijuana possession, use, and sale prohibited. Criminal penalties apply.',
  marijuana_last_updated = '2026-01-04'
WHERE state IN ('Idaho', 'Wyoming', 'Iowa');

-- Special Cases with unique situations

UPDATE public.state_laws SET
  marijuana_status = 'Medical Only',
  marijuana_possession_limit = 'Up to 2.5 ounces for patients',
  marijuana_medical_conditions = ARRAY['Cancer', 'Glaucoma', 'HIV/AIDS', 'Hepatitis C', 'ALS', 'PTSD', 'Chronic Pain', 'Severe Nausea'],
  marijuana_home_cultivation_allowed = false,
  marijuana_dispensaries_operational = true,
  marijuana_decrim_amount = 'Up to 2 ounces',
  marijuana_decrim_penalty = 'Civil fine $25',
  marijuana_employment_protections = false,
  marijuana_expungement_available = false,
  marijuana_notes = 'Medical program + decriminalized for small amounts. Possession <2oz is $25 civil fine.',
  marijuana_last_updated = '2026-01-04'
WHERE state = 'New Hampshire';

UPDATE public.state_laws SET
  marijuana_status = 'Medical Only',
  marijuana_possession_limit = 'Up to 4 ounces per month for registered patients',
  marijuana_medical_conditions = ARRAY['Cancer', 'HIV/AIDS', 'Epilepsy', 'PTSD', 'Chronic Pain', 'Multiple Sclerosis', 'Inflammatory Bowel Disease'],
  marijuana_home_cultivation_allowed = true,
  marijuana_cultivation_limit = '5 plants for patients only',
  marijuana_dispensaries_operational = true,
  marijuana_employment_protections = false,
  marijuana_expungement_available = false,
  marijuana_notes = 'Medical program with limited home cultivation. No decrim for non-patients.',
  marijuana_last_updated = '2026-01-04'
WHERE state = 'New Mexico';

-- Create index for marijuana status searches
CREATE INDEX IF NOT EXISTS idx_state_laws_marijuana_status ON public.state_laws(marijuana_status);

COMMENT ON COLUMN public.state_laws.marijuana_status IS 'Current marijuana legal status: Fully Legal, Medical Only, Decriminalized, CBD Only, or Illegal';
COMMENT ON COLUMN public.state_laws.marijuana_last_updated IS 'Date when marijuana law information was last verified';
