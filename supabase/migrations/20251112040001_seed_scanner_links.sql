-- Seed data for scanner_links table - Police scanner feeds by location

INSERT INTO public.scanner_links (
  state,
  state_code,
  city,
  county,
  scanner_name,
  description,
  frequency,
  broadcastify_url,
  scanner_radio_url,
  other_url,
  link_type,
  listener_count,
  is_active,
  notes
) VALUES

-- California
('California', 'CA', 'Los Angeles', 'Los Angeles County', 'LAPD Dispatch', 'Los Angeles Police Department dispatch and tactical channels', '460.525 MHz', 'https://www.broadcastify.com/webPlayer/35012', NULL, NULL, 'broadcastify', 1500, true, 'High activity scanner covering LAPD operations'),
('California', 'CA', 'San Francisco', 'San Francisco County', 'SFPD and Fire', 'San Francisco Police and Fire Department', '460.300 MHz', 'https://www.broadcastify.com/webPlayer/328', NULL, NULL, 'broadcastify', 850, true, NULL),
('California', 'CA', 'Oakland', 'Alameda County', 'Oakland Police', 'Oakland Police Department all channels', '867.2625 MHz', 'https://www.broadcastify.com/webPlayer/18748', NULL, NULL, 'broadcastify', 420, true, NULL),
('California', 'CA', 'San Diego', 'San Diego County', 'San Diego Police', 'San Diego PD dispatch and detectives', '155.610 MHz', 'https://www.broadcastify.com/webPlayer/8161', NULL, NULL, 'broadcastify', 680, true, NULL),
('California', 'CA', 'Sacramento', 'Sacramento County', 'Sacramento Police and Sheriff', 'City and county law enforcement', '856.9625 MHz', 'https://www.broadcastify.com/webPlayer/9836', NULL, NULL, 'broadcastify', 320, true, NULL),

-- New York
('New York', 'NY', 'New York City', 'New York County', 'NYPD Bronx', 'NYPD Bronx Borough dispatch', '476.7875 MHz', 'https://www.broadcastify.com/webPlayer/19398', NULL, NULL, 'broadcastify', 2100, true, 'One of most listened NYC feeds'),
('New York', 'NY', 'New York City', 'Queens County', 'NYPD Queens', 'NYPD Queens Borough all precincts', '477.8625 MHz', 'https://www.broadcastify.com/webPlayer/19399', NULL, NULL, 'broadcastify', 1800, true, NULL),
('New York', 'NY', 'Buffalo', 'Erie County', 'Buffalo Police', 'Buffalo PD and Fire', '154.785 MHz', 'https://www.broadcastify.com/webPlayer/4630', NULL, NULL, 'broadcastify', 290, true, NULL),
('New York', 'NY', 'Rochester', 'Monroe County', 'Rochester Public Safety', 'Rochester Police, Fire, EMS', '460.475 MHz', 'https://www.broadcastify.com/webPlayer/7528', NULL, NULL, 'broadcastify', 240, true, NULL),

-- Texas
('Texas', 'TX', 'Houston', 'Harris County', 'Houston Police', 'HPD dispatch channels', '460.225 MHz', 'https://www.broadcastify.com/webPlayer/245', NULL, NULL, 'broadcastify', 950, true, NULL),
('Texas', 'TX', 'Dallas', 'Dallas County', 'Dallas Police', 'Dallas PD all divisions', '460.050 MHz', 'https://www.broadcastify.com/webPlayer/18772', NULL, NULL, 'broadcastify', 820, true, NULL),
('Texas', 'TX', 'Austin', 'Travis County', 'Austin-Travis County', 'Austin Police and Travis County Sheriff', '851.9125 MHz', 'https://www.broadcastify.com/webPlayer/4323', NULL, NULL, 'broadcastify', 540, true, NULL),
('Texas', 'TX', 'San Antonio', 'Bexar County', 'SAPD and Fire', 'San Antonio Police and Fire', '460.375 MHz', 'https://www.broadcastify.com/webPlayer/15763', NULL, NULL, 'broadcastify', 480, true, NULL),

-- Illinois
('Illinois', 'IL', 'Chicago', 'Cook County', 'Chicago Police Zone 10', 'CPD Zone 10 - South Side districts', '460.200 MHz', 'https://www.broadcastify.com/webPlayer/18046', NULL, NULL, 'broadcastify', 1450, true, 'Covers high-activity areas'),
('Illinois', 'IL', 'Chicago', 'Cook County', 'Chicago Police Citywide 1', 'CPD Citywide 1 - Major incidents', '460.525 MHz', 'https://www.broadcastify.com/webPlayer/33494', NULL, NULL, 'broadcastify', 1680, true, 'Most popular Chicago feed'),

-- Florida
('Florida', 'FL', 'Miami', 'Miami-Dade County', 'Miami-Dade Police', 'Metro-Dade PD and Fire Rescue', '155.625 MHz', 'https://www.broadcastify.com/webPlayer/12839', NULL, NULL, 'broadcastify', 620, true, NULL),
('Florida', 'FL', 'Orlando', 'Orange County', 'Orlando Police', 'Orlando PD dispatch', '460.425 MHz', 'https://www.broadcastify.com/webPlayer/9415', NULL, NULL, 'broadcastify', 410, true, NULL),
('Florida', 'FL', 'Tampa', 'Hillsborough County', 'Tampa Police', 'Tampa PD all zones', '460.100 MHz', 'https://www.broadcastify.com/webPlayer/11726', NULL, NULL, 'broadcastify', 380, true, NULL),

-- Georgia
('Georgia', 'GA', 'Atlanta', 'Fulton County', 'Atlanta Police North', 'APD North Precinct dispatch', '460.250 MHz', 'https://www.broadcastify.com/webPlayer/1234', NULL, NULL, 'broadcastify', 580, true, NULL),
('Georgia', 'GA', 'Atlanta', 'DeKalb County', 'DeKalb County Police', 'DeKalb County PD', '866.8125 MHz', 'https://www.broadcastify.com/webPlayer/20385', NULL, NULL, 'broadcastify', 340, true, NULL),

-- Pennsylvania
('Pennsylvania', 'PA', 'Philadelphia', 'Philadelphia County', 'Philadelphia Police', 'PPD citywide operations', '460.475 MHz', 'https://www.broadcastify.com/webPlayer/20235', NULL, NULL, 'broadcastify', 890, true, NULL),
('Pennsylvania', 'PA', 'Pittsburgh', 'Allegheny County', 'Pittsburgh Public Safety', 'Pittsburgh PD, Fire, EMS', '460.125 MHz', 'https://www.broadcastify.com/webPlayer/8753', NULL, NULL, 'broadcastify', 420, true, NULL),

-- Washington
('Washington', 'WA', 'Seattle', 'King County', 'Seattle Police', 'Seattle PD dispatch and tactical', '154.785 MHz', 'https://www.broadcastify.com/webPlayer/15332', NULL, NULL, 'broadcastify', 720, true, NULL),
('Washington', 'WA', 'Tacoma', 'Pierce County', 'Pierce County Sheriff', 'Pierce County SO and Fire', '856.2375 MHz', 'https://www.broadcastify.com/webPlayer/7264', NULL, NULL, 'broadcastify', 280, true, NULL),

-- Arizona
('Arizona', 'AZ', 'Phoenix', 'Maricopa County', 'Phoenix Police', 'Phoenix PD dispatch channels', '460.350 MHz', 'https://www.broadcastify.com/webPlayer/16286', NULL, NULL, 'broadcastify', 650, true, NULL),
('Arizona', 'AZ', 'Tucson', 'Pima County', 'Tucson Police and Fire', 'TPD and Tucson Fire', '460.075 MHz', 'https://www.broadcastify.com/webPlayer/4837', NULL, NULL, 'broadcastify', 320, true, NULL),

-- Massachusetts
('Massachusetts', 'MA', 'Boston', 'Suffolk County', 'Boston Police', 'Boston PD all districts', '460.400 MHz', 'https://www.broadcastify.com/webPlayer/24844', NULL, NULL, 'broadcastify', 780, true, NULL),

-- Michigan
('Michigan', 'MI', 'Detroit', 'Wayne County', 'Detroit Police', 'Detroit PD dispatch', '860.4875 MHz', 'https://www.broadcastify.com/webPlayer/28236', NULL, NULL, 'broadcastify', 540, true, NULL),

-- Minnesota
('Minnesota', 'MN', 'Minneapolis', 'Hennepin County', 'Minneapolis Police', 'MPD dispatch and special operations', '460.500 MHz', 'https://www.broadcastify.com/webPlayer/20564', NULL, NULL, 'broadcastify', 720, true, 'High interest due to civil rights activity'),
('Minnesota', 'MN', 'St. Paul', 'Ramsey County', 'St. Paul Police', 'St. Paul PD all precincts', '460.425 MHz', 'https://www.broadcastify.com/webPlayer/4762', NULL, NULL, 'broadcastify', 310, true, NULL),

-- Colorado
('Colorado', 'CO', 'Denver', 'Denver County', 'Denver Police', 'Denver PD and Sheriff', '460.350 MHz', 'https://www.broadcastify.com/webPlayer/17374', NULL, NULL, 'broadcastify', 580, true, NULL),

-- Oregon
('Oregon', 'OR', 'Portland', 'Multnomah County', 'Portland Police', 'Portland PD and Multnomah County Sheriff', '155.505 MHz', 'https://www.broadcastify.com/webPlayer/32281', NULL, NULL, 'broadcastify', 640, true, NULL),

-- North Carolina
('North Carolina', 'NC', 'Charlotte', 'Mecklenburg County', 'Charlotte-Mecklenburg PD', 'CMPD all divisions', '851.8625 MHz', 'https://www.broadcastify.com/webPlayer/6742', NULL, NULL, 'broadcastify', 420, true, NULL),

-- Louisiana
('Louisiana', 'LA', 'New Orleans', 'Orleans Parish', 'New Orleans Police', 'NOPD citywide', '460.525 MHz', 'https://www.broadcastify.com/webPlayer/18537', NULL, NULL, 'broadcastify', 510, true, NULL),

-- Nevada
('Nevada', 'NV', 'Las Vegas', 'Clark County', 'Las Vegas Metro Police', 'LVMPD and Henderson PD', '155.610 MHz', 'https://www.broadcastify.com/webPlayer/9822', NULL, NULL, 'broadcastify', 890, true, 'Covers Las Vegas Strip area'),

-- Missouri
('Missouri', 'MO', 'St. Louis', 'St. Louis County', 'St. Louis County Police', 'County PD all precincts', '155.790 MHz', 'https://www.broadcastify.com/webPlayer/4821', NULL, NULL, 'broadcastify', 380, true, NULL),
('Missouri', 'MO', 'Kansas City', 'Jackson County', 'Kansas City Police', 'KCPD dispatch', '460.275 MHz', 'https://www.broadcastify.com/webPlayer/8463', NULL, NULL, 'broadcastify', 340, true, NULL),

-- Tennessee
('Tennessee', 'TN', 'Memphis', 'Shelby County', 'Memphis Police', 'Memphis PD all precincts', '460.200 MHz', 'https://www.broadcastify.com/webPlayer/14827', NULL, NULL, 'broadcastify', 390, true, NULL),

-- Virginia
('Virginia', 'VA', 'Virginia Beach', 'Virginia Beach City', 'Virginia Beach Police', 'VBPD dispatch and tactical', '155.505 MHz', 'https://www.broadcastify.com/webPlayer/12648', NULL, NULL, 'broadcastify', 280, true, NULL),

-- Wisconsin
('Wisconsin', 'WI', 'Milwaukee', 'Milwaukee County', 'Milwaukee Police', 'Milwaukee PD all districts', '460.450 MHz', 'https://www.broadcastify.com/webPlayer/5973', NULL, NULL, 'broadcastify', 420, true, NULL),

-- Ohio
('Ohio', 'OH', 'Columbus', 'Franklin County', 'Columbus Police', 'Columbus Division of Police', '460.325 MHz', 'https://www.broadcastify.com/webPlayer/18452', NULL, NULL, 'broadcastify', 380, true, NULL),
('Ohio', 'OH', 'Cleveland', 'Cuyahoga County', 'Cleveland Police', 'Cleveland PD all zones', '460.125 MHz', 'https://www.broadcastify.com/webPlayer/4738', NULL, NULL, 'broadcastify', 350, true, NULL),

-- Maryland
('Maryland', 'MD', 'Baltimore', 'Baltimore City', 'Baltimore Police', 'Baltimore PD citywide', '460.350 MHz', 'https://www.broadcastify.com/webPlayer/6844', NULL, NULL, 'broadcastify', 520, true, NULL),

-- Indiana
('Indiana', 'IN', 'Indianapolis', 'Marion County', 'Indianapolis Metro Police', 'IMPD all districts', '154.950 MHz', 'https://www.broadcastify.com/webPlayer/2348', NULL, NULL, 'broadcastify', 410, true, NULL),

-- Alabama
('Alabama', 'AL', 'Birmingham', 'Jefferson County', 'Birmingham Police', 'Birmingham PD dispatch', '460.225 MHz', 'https://www.broadcastify.com/webPlayer/3827', NULL, NULL, 'broadcastify', 240, true, NULL);
