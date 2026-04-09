-- Seed city_permit_info table with protest permit requirements for major US cities
-- Includes permit thresholds, lead times, fees, and contacts

-- Ensure table exists with needed columns
CREATE TABLE IF NOT EXISTS public.city_permit_info (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city                  TEXT NOT NULL,
  state                 TEXT NOT NULL,
  state_code            TEXT NOT NULL,
  permit_required       BOOLEAN NOT NULL DEFAULT false,
  size_threshold        TEXT,
  lead_time_days        INTEGER,
  application_url       TEXT,
  fee_amount            TEXT,
  contact_phone         TEXT,
  contact_email         TEXT,
  contact_department    TEXT,
  notes                 TEXT,
  legal_basis           TEXT,
  no_permit_zones       TEXT,
  created_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.city_permit_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "City permit info is viewable by everyone"
  ON public.city_permit_info FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_city_permit_state ON public.city_permit_info(state_code);
CREATE INDEX IF NOT EXISTS idx_city_permit_city ON public.city_permit_info(city);

-- =====================================================
-- SEED DATA: Major US cities protest permit requirements
-- =====================================================

INSERT INTO public.city_permit_info (
  city, state, state_code, permit_required, size_threshold,
  lead_time_days, application_url, fee_amount, contact_phone,
  contact_email, contact_department, notes, legal_basis, no_permit_zones
) VALUES

('New York City', 'New York', 'NY', true, 'Over 20 participants on city streets; any march blocking traffic',
 10, 'https://www.nyc.gov/site/nypd/services/law-enforcement/permits-parade.page', 'None (free)',
 '(646) 610-5400', 'paradepermits@nypd.org', 'NYPD Special Events Unit',
 'Sidewalk rallies do not require a permit regardless of size. Street closures and marches always require permits. Apply at least 10 days before; 36 hours for spontaneous protests.',
 'NYC Admin Code § 10-110', 'First Amendment activity on public sidewalks never requires a permit'),

('Los Angeles', 'California', 'CA', true, 'Marches on streets or events over 1,000 people',
 10, 'https://lapdonline.org/special-events-permit/', 'None (free for political speech)',
 '(213) 486-0600', NULL, 'LAPD Special Events Division',
 'Sidewalk protests do not require permits. Street marches need LAPD coordination. Parks require Recreation and Parks permit.',
 'LA Municipal Code § 103.111', 'Political speech on public sidewalks is always permitted without a permit'),

('Chicago', 'Illinois', 'IL', true, 'Events on Chicago Park District property or marches closing streets',
 10, 'https://www.chicago.gov/city/en/depts/dca/supp_info/permit_applications.html', 'Free for political events',
 '(312) 744-3600', 'specialevents@cityofchicago.org', 'Mayor''s Office of Special Events',
 'Small protests on sidewalks do not require permits. Millennium Park and Grant Park require Chicago Park District permits. City sidewalks are generally open.',
 'Chicago Municipal Code § 10-8-335', NULL),

('Houston', 'Texas', 'TX', false, 'Spontaneous protests on public sidewalks never require a permit',
 NULL, 'https://www.houstontx.gov/specialevents/', 'Varies by event type',
 '(832) 394-8800', NULL, 'City of Houston Special Events Office',
 'Texas law strongly protects protest rights. Permit required only for large events closing streets. Sidewalk protests are protected without permits.',
 'Texas Government Code § 411.209; Houston Code of Ordinances Ch. 22', NULL),

('Phoenix', 'Arizona', 'AZ', true, 'Events exceeding 25 people in city parks or closing streets',
 7, 'https://www.phoenix.gov/parkssite/Pages/SpecialEvents.aspx', '$25–$200 depending on size',
 '(602) 262-6861', 'specialevents@phoenix.gov', 'Phoenix Parks and Recreation',
 'Street protests require PEMS (Parks, Environment & Mobility Services) permit. Sidewalk protests do not require permits.',
 'Phoenix City Code § 23-30', NULL),

('Philadelphia', 'Pennsylvania', 'PA', true, 'Marches and events over 50 participants or closing streets',
 10, 'https://www.phila.gov/departments/office-of-transportation-and-infrastructure-systems/', 'Free for political speech events',
 '(215) 686-5500', NULL, 'Philadelphia Streets Department',
 'The City of Brotherly Love has historically been protective of protest rights. Spontaneous protests in response to breaking news may be exempt from permit requirements.',
 'Philadelphia Code § 12-400', 'Independence Hall area has National Park Service jurisdiction'),

('San Antonio', 'Texas', 'TX', false, 'Generally no permit required for sidewalk protests',
 NULL, 'https://www.sanantonio.gov/specialevents', 'Varies',
 '(210) 207-0211', NULL, 'San Antonio Special Events Office',
 'Texas law protects protest rights broadly. Street closures require city coordination.',
 'Texas Government Code; San Antonio UDC', NULL),

('San Diego', 'California', 'CA', true, 'Groups of 75+ in city parks or events closing streets',
 10, 'https://www.sandiego.gov/parks-and-recreation/permits/special-events', 'Free–$100',
 '(619) 685-1300', 'parkspermits@sandiego.gov', 'San Diego Parks and Recreation',
 'California CPRA provides strong free speech protections. Park protests over 75 require permits; sidewalk protests do not.',
 'CA Government Code; San Diego Municipal Code § 63.1001', NULL),

('Dallas', 'Texas', 'TX', true, 'Events of 75+ participants or street use',
 5, 'https://dallascityhall.com/departments/public-works/Pages/Special-Events.aspx', 'Free for political speech',
 '(214) 948-4250', NULL, 'City of Dallas Special Events',
 'Dallas historically respects protest rights. 5-day lead time recommended; emergency permits available.',
 'Texas Government Code; Dallas City Code Ch. 42A', NULL),

('San Francisco', 'California', 'CA', true, 'Events over 25 people in parks or street marches',
 7, 'https://sfrecpark.org/permits/special-event-permit/', 'Varies; often waived for political speech',
 '(415) 831-5500', 'recpark.permits@sfgov.org', 'SF Recreation and Parks',
 'SF is generally protest-friendly. Golden Gate Park, Civic Center Plaza, and UN Plaza require permits. Sidewalks do not.',
 'SF Park Code; CA Government Code', 'Federal property (Presidio, Golden Gate NRA) requires NPS permit'),

('Seattle', 'Washington', 'WA', true, 'Events over 50 participants or any street use',
 10, 'https://www.seattle.gov/transportation/projects-and-programs/programs/permits-and-exceptions/major-events-transportation-management-plans', 'Free',
 '(206) 684-0816', 'specialevents@seattle.gov', 'Seattle SDOT Special Events',
 'Seattle strongly protects protest rights. Capitol Hill area has historically been a protest hub. Spontaneous protests may be exempt.',
 'Seattle SMC 15.52', NULL),

('Denver', 'Colorado', 'CO', true, 'Street marches; events over 25 in Denver parks',
 7, 'https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Parks-Recreation/Permits', 'Free–$100',
 '(720) 865-0900', NULL, 'Denver Parks and Recreation',
 'Colorado broadly protects protest rights. Denver has First Amendment Rally Zones at Civic Center Park.',
 'Denver Revised Municipal Code § 49-246', 'Civic Center Park has designated First Amendment areas'),

('Washington', 'District of Columbia', 'DC', true, 'Events on National Mall or DC public spaces over 25 participants',
 5, 'https://www.nps.gov/subjects/permitsmtreatyarea/index.htm', 'Free for First Amendment activities',
 '(202) 245-4715', 'ncro_permits@nps.gov', 'National Park Service – National Capital Region',
 'The National Mall is federal property requiring NPS permits. DC sidewalks and streets use separate DC permits. First Amendment activities on NPS lands are expedited.',
 'DC Code § 22-1307; 36 CFR Part 7', 'White House sidewalk area has special Secret Service jurisdiction'),

('Nashville', 'Tennessee', 'TN', true, 'Events over 25 in Metro parks or street closures',
 7, 'https://www.nashville.gov/departments/metro-parks/permits', 'Free–$50',
 '(615) 862-8400', NULL, 'Nashville Metro Parks',
 'Tennessee has strong free speech protections. Legislative Plaza near State Capitol has open access.',
 'TCA § 39-17-301', NULL),

('Austin', 'Texas', 'TX', true, 'Events over 75 on city property or street use',
 7, 'https://www.austintexas.gov/department/special-events', 'Free for political speech',
 '(512) 974-1000', 'specialevents@austintexas.gov', 'City of Austin Special Events',
 'Austin''s Congress Avenue and the Capitol grounds (state jurisdiction) are common protest sites. Downtown sidewalks do not require permits.',
 'Texas Government Code; Austin City Code Ch. 14-8', 'Texas State Capitol grounds are under DPS jurisdiction'),

('Portland', 'Oregon', 'OR', true, 'Street use or events over 50 in city parks',
 5, 'https://www.portlandoregon.gov/transportation/64073', 'Free',
 '(503) 823-5185', NULL, 'Portland Bureau of Transportation',
 'Portland has very strong protest traditions and First Amendment protections. Oregon law strictly limits permit requirements.',
 'Oregon Constitution Art. I § 8; ORS 131.020', NULL),

('Las Vegas', 'Nevada', 'NV', true, 'Events over 25 on Clark County or Las Vegas city property',
 10, 'https://www.lasvegasnevada.gov/Residents/City-Hall/Special-Events-Permits', 'Varies',
 '(702) 229-6581', NULL, 'Las Vegas Special Events',
 'The Strip is actually unincorporated Clark County jurisdiction. Fremont Street area is city of Las Vegas.',
 'NRS 244.354; Clark County Code', 'Las Vegas Strip (Tropicana to Sahara) is Clark County jurisdiction'),

('Memphis', 'Tennessee', 'TN', true, 'Events over 50 in Shelby County parks or street use',
 7, 'https://www.memphistn.gov/government/parks/', 'Free–$50',
 '(901) 636-4200', NULL, 'Memphis Parks Division',
 'Memphis has strong civil rights heritage. National Civil Rights Museum area often hosts demonstrations.',
 'TCA § 39-17-301', NULL),

('Baltimore', 'Maryland', 'MD', true, 'Events over 50 closing streets or in city parks',
 10, 'https://transportation.baltimorecity.gov/permits/special-events', 'Free',
 '(410) 396-6002', NULL, 'Baltimore City Department of Transportation',
 'Maryland broadly protects protest rights. Baltimore''s Inner Harbor area may require additional permits.',
 'MD Code Ann., Crim. Law § 6-402', NULL),

('Milwaukee', 'Wisconsin', 'WI', true, 'Events over 25 on Milwaukee County parks or streets',
 7, 'https://county.milwaukee.gov/EN/Parks/Explore/Special-Events', 'Free–$25',
 '(414) 257-5100', NULL, 'Milwaukee County Parks',
 'Wisconsin has strong protest protections. State Capitol grounds have special rules under the Capitol Police.',
 'Wis. Stat. § 947.06', 'State Capitol area regulated by WI Capitol Police (608) 266-8797'),

('Albuquerque', 'New Mexico', 'NM', false, 'Sidewalk protests generally do not require permits',
 NULL, 'https://www.cabq.gov/parksandrecreation/permits', 'Free–$25',
 '(505) 768-5300', NULL, 'Albuquerque Parks and Recreation',
 'New Mexico has very open protest laws. Old Town Plaza and Civic Plaza are popular protest locations.',
 'NMSA 1978 § 30-20-13', NULL),

('Tucson', 'Arizona', 'AZ', true, 'Events over 50 in city parks or street use',
 7, 'https://www.tucsonaz.gov/parks/rentals-permits/special-events', 'Varies',
 '(520) 791-4873', NULL, 'Tucson Parks and Recreation',
 NULL, 'Arizona Constitution Art. 2 § 6; Tucson City Code', NULL),

('Atlanta', 'Georgia', 'GA', true, 'Events over 50 on city property or street closures',
 10, 'https://www.atlantaga.gov/government/departments/city-planning/special-events', 'Free–$100',
 '(404) 546-0311', NULL, 'City of Atlanta Office of Special Events',
 'Georgia has strong protest protections. Underground Atlanta and Centennial Olympic Park area often used.',
 'Georgia Constitution Art. I § 1 ¶ V; Atlanta City Code', NULL),

('Miami', 'Florida', 'FL', true, 'Events over 50 or any street use in Miami-Dade or City of Miami',
 7, 'https://www.miamigov.com/Services/Permits-Inspections/Special-Events', 'Free for political speech',
 '(305) 416-1085', NULL, 'City of Miami Office of Special Events',
 'Florida broadly protects protest rights. Bayfront Park and Bicentennial Park are common sites. Florida SB 1 (2021) controversially increased penalties for some protest activities.',
 'Florida Constitution Art. I § 5; Miami City Code', 'Bayfront Park requires Miami-Dade County Parks permit'),

('Minneapolis', 'Minnesota', 'MN', true, 'Events over 50 or street use in Minneapolis',
 5, 'https://www.minneapolismn.gov/resident-services/permits-licenses/permits/special-event-permits/', 'Free',
 '(612) 673-3000', 'specialevents@minneapolismn.gov', 'Minneapolis Special Events',
 'Minneapolis has strong protest traditions following George Floyd protests. George Floyd Square area has special considerations.',
 'Minnesota Statute § 609.715', NULL),

('Columbus', 'Ohio', 'OH', true, 'Events over 50 or street use',
 7, 'https://www.columbus.gov/specialevents/', 'Free–$50',
 '(614) 645-7670', NULL, 'Columbus Special Events',
 'Ohio has broad protest protections. Statehouse grounds are state jurisdiction.',
 'Ohio Const. Art. I § 3; Columbus City Code § 2309', 'Ohio Statehouse grounds under OCSO (614) 466-6282')

ON CONFLICT DO NOTHING;
