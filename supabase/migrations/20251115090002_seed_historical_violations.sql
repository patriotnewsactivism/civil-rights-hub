-- Seed the violations table with documented historical civil rights incidents

INSERT INTO public.violations (
  id,
  user_id,
  title,
  description,
  location_state,
  location_city,
  incident_date,
  latitude,
  longitude,
  media_urls,
  status
) VALUES
(
  '11111111-1111-4111-8111-111111111101',
  NULL,
  'Murder of George Floyd during Minneapolis arrest',
  'Former Minneapolis Police Officer Derek Chauvin knelt on George Floyd''s neck for over nine minutes on May 25, 2020, leading to Floyd''s death and sparking nationwide protests. The DOJ and Minnesota Attorney General pursued criminal charges, and the city approved a $27M settlement with the family.',
  'Minnesota',
  'Minneapolis',
  '2020-05-25T00:00:00Z',
  44.977800,
  -93.265000,
  ARRAY[
    'https://www.nytimes.com/article/george-floyd.html',
    'https://www.justice.gov/opa/pr/federal-grand-jury-indicts-former-minneapolis-police-officers-civil-rights-charges'
  ],
  'verified'
),
(
  '22222222-2222-4222-8222-222222222202',
  NULL,
  'No-knock raid killing Breonna Taylor in Louisville',
  'Louisville Metro Police officers executing a disputed no-knock warrant shot and killed Breonna Taylor inside her home on March 13, 2020. The incident prompted federal civil-rights charges against involved officers and contributed to statewide reforms limiting no-knock warrants.',
  'Kentucky',
  'Louisville',
  '2020-03-13T00:00:00Z',
  38.254200,
  -85.759400,
  ARRAY[
    'https://www.nytimes.com/article/breonna-taylor-police.html',
    'https://www.justice.gov/opa/pr/four-current-and-former-louisville-kentucky-police-officers-federal-charges-related-death'
  ],
  'verified'
),
(
  '33333333-3333-4333-8333-333333333303',
  NULL,
  'Daunte Wright shooting during Brooklyn Center traffic stop',
  'Officer Kim Potter of the Brooklyn Center Police Department fatally shot 20-year-old Daunte Wright on April 11, 2021 after drawing a handgun while shouting taser commands. The event triggered curfews and a federal probe into aggressive protest policing.',
  'Minnesota',
  'Brooklyn Center',
  '2021-04-11T00:00:00Z',
  45.076100,
  -93.332500,
  ARRAY[
    'https://www.nbcnews.com/news/us-news/daunte-wright-police-officer-kim-potter-found-guilty-manslaughter-n1286518',
    'https://www.nytimes.com/2021/04/12/us/daunte-wright-brooklyn-center-shooting.html'
  ],
  'verified'
),
(
  '44444444-4444-4444-8444-444444444404',
  NULL,
  'Atatiana Jefferson killed by Fort Worth police sniper fire',
  'Fort Worth Officer Aaron Dean shot Atatiana Jefferson through a window during a wellness check on October 12, 2019 despite failing to identify himself. Dean was later convicted of manslaughter and sentenced to nearly 12 years in prison.',
  'Texas',
  'Fort Worth',
  '2019-10-12T00:00:00Z',
  32.755500,
  -97.330800,
  ARRAY[
    'https://www.texastribune.org/2019/10/12/fort-worth-police-shooting-resident-home-atatiana-jefferson/',
    'https://www.npr.org/2022/12/20/1144561813/aaron-dean-atatiana-jefferson-fort-worth'
  ],
  'verified'
),
(
  '55555555-5555-4555-8555-555555555505',
  NULL,
  'Tyre Nichols beaten by Memphis SCORPION unit',
  'Five Memphis Police Department officers from the SCORPION unit repeatedly kicked and struck Tyre Nichols after a Jan. 7, 2023 traffic stop, leading to his death three days later. The officers were fired, charged with murder, and the unit was permanently disbanded.',
  'Tennessee',
  'Memphis',
  '2023-01-07T00:00:00Z',
  35.149500,
  -90.049000,
  ARRAY[
    'https://www.nytimes.com/interactive/2023/01/27/us/tyre-nichols-video-memphis.html',
    'https://www.justice.gov/opa/pr/federal-grand-jury-indicts-five-former-memphis-police-officers-civil-rights-offenses'
  ],
  'verified'
),
(
  '66666666-6666-4666-8666-666666666606',
  NULL,
  'Standing Rock water cannon attack on Indigenous water protectors',
  'Law enforcement officers with the Morton County Sheriff''s Office and private contractors sprayed hundreds of Standing Rock water protectors with water cannons, tear gas, and impact munitions on November 20, 2016, during sub-freezing weather while clearing Highway 1806.',
  'North Dakota',
  'Cannon Ball',
  '2016-11-20T00:00:00Z',
  46.384700,
  -100.623500,
  ARRAY[
    'https://www.theguardian.com/us-news/2016/nov/21/dakota-access-pipeline-protesters-injured-police',
    'https://www.cpr.org/2021/11/01/standing-rock-protesters-police-brutality-lawsuit-settlement/'
  ],
  'verified'
)
ON CONFLICT (id) DO NOTHING;
