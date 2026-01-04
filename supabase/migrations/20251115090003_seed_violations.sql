-- Seed historically documented civil rights violations for the public feed

INSERT INTO public.violations (
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
  NULL,
  'CNN crew arrested while reporting Minneapolis protests',
  'Minnesota State Patrol troopers arrested CNN reporter Omar Jimenez and his production crew live on air despite their compliance with dispersal orders.',
  'Minnesota',
  'Minneapolis',
  '2020-05-29T11:00:00Z',
  44.970700,
  -93.247000,
  ARRAY['https://www.cnn.com/2020/05/29/media/cnn-reporter-omar-jimenez-arrested/index.html'],
  'verified'
),
(
  NULL,
  'Atlanta police tase and arrest college students during protest curfew',
  'Atlanta officers smashed the windows of a car carrying students Taniyah Pilgrim and Messiah Young, fired Tasers at them, and jailed them for violating an emergency curfew later ruled unconstitutional.',
  'Georgia',
  'Atlanta',
  '2020-05-30T02:30:00Z',
  33.749000,
  -84.388000,
  ARRAY['https://www.nytimes.com/2020/06/02/us/atlanta-police-fired-tasing-students.html'],
  'verified'
),
(
  NULL,
  'Federal officers fracture protester skull outside Portland federal courthouse',
  'Department of Homeland Security tactical agents shot Donovan La Bella in the head with an impact munition while he held a speaker above his head, fracturing his skull.',
  'Oregon',
  'Portland',
  '2020-07-11T06:45:00Z',
  45.517500,
  -122.678900,
  ARRAY['https://www.opb.org/news/article/federal-officers-portland-protester-injured/'],
  'verified'
),
(
  NULL,
  'Standing Rock water protectors charged under antiquated riot statute',
  'More than a dozen Indigenous water protectors faced felony riot and conspiracy counts for documenting police actions during the 2016 resistance to the Dakota Access Pipeline.',
  'North Dakota',
  'Cannon Ball',
  '2016-10-27T18:00:00Z',
  46.383100,
  -100.635800,
  ARRAY['https://theintercept.com/2017/06/22/dakota-access-pipeline-standing-rock-charges/'],
  'verified'
),
(
  NULL,
  'Georgia activists hit with sweeping RICO charges over "Stop Cop City" movement',
  'State Attorney General Chris Carr used Georgia’s RICO law to indict 61 community organizers, medics, and legal observers connected to protests against the Atlanta Public Safety Training Center.',
  'Georgia',
  'Atlanta',
  '2023-08-29T14:00:00Z',
  33.745700,
  -84.373300,
  ARRAY['https://www.npr.org/2023/09/05/1197470298/georgia-rico-indictment-cop-city-protesters'],
  'verified'
);
