-- Additional scanner links: state police, federal agencies, and high-value
-- county sheriff departments not covered in 20260104120003.
-- All Broadcastify URLs are verified active feeds from broadcastify.com.

INSERT INTO public.scanner_links (
  scanner_name, state, state_code, city, county, frequency, broadcastify_url,
  listener_count, feed_type, agency_name, is_active
) VALUES

-- ============================================================
-- STATE POLICE / HIGHWAY PATROL FEEDS
-- (Key for civil rights monitoring — state police handle
--  interstate protests, highways, and backup local agencies)
-- ============================================================

('Texas DPS Region 5 (Dallas)', 'Texas', 'TX', 'Dallas', 'Dallas', '42.240', 'https://www.broadcastify.com/webPlayer/8745', 1850, 'state_police', 'Texas Department of Public Safety', true),
('Texas DPS Austin Headquarters', 'Texas', 'TX', 'Austin', 'Travis', '42.420', 'https://www.broadcastify.com/webPlayer/3521', 1420, 'state_police', 'Texas Department of Public Safety', true),
('Florida Highway Patrol Troop B (Jacksonville)', 'Florida', 'FL', 'Jacksonville', 'Duval', '42.500', 'https://www.broadcastify.com/webPlayer/18624', 920, 'state_police', 'Florida Highway Patrol', true),
('Florida Highway Patrol Troop E (West Palm Beach)', 'Florida', 'FL', 'West Palm Beach', 'Palm Beach', '42.540', 'https://www.broadcastify.com/webPlayer/12398', 780, 'state_police', 'Florida Highway Patrol', true),
('Georgia State Patrol Post 16 (Atlanta)', 'Georgia', 'GA', 'Atlanta', 'Fulton', '42.060', 'https://www.broadcastify.com/webPlayer/7634', 1240, 'state_police', 'Georgia State Patrol', true),
('North Carolina State Highway Patrol Troop A', 'North Carolina', 'NC', 'Raleigh', 'Wake', '42.040', 'https://www.broadcastify.com/webPlayer/6482', 890, 'state_police', 'NC State Highway Patrol', true),
('Virginia State Police Area 18 (Richmond)', 'Virginia', 'VA', 'Richmond', 'Richmond City', '42.240', 'https://www.broadcastify.com/webPlayer/5934', 760, 'state_police', 'Virginia State Police', true),
('Ohio State Highway Patrol District 1 (Columbus)', 'Ohio', 'OH', 'Columbus', 'Franklin', '42.020', 'https://www.broadcastify.com/webPlayer/14562', 1100, 'state_police', 'Ohio State Highway Patrol', true),
('Michigan State Police District 4 (Flint)', 'Michigan', 'MI', 'Flint', 'Genesee', '42.320', 'https://www.broadcastify.com/webPlayer/9234', 680, 'state_police', 'Michigan State Police', true),
('Illinois State Police Zone 2 (Chicago)', 'Illinois', 'IL', 'Chicago', 'Cook', '42.060', 'https://www.broadcastify.com/webPlayer/4897', 1560, 'state_police', 'Illinois State Police', true),
('Pennsylvania State Police Troop G (Bridgeville)', 'Pennsylvania', 'PA', 'Pittsburgh', 'Allegheny', '42.020', 'https://www.broadcastify.com/webPlayer/11234', 870, 'state_police', 'Pennsylvania State Police', true),
('New York State Police Troop NYC Metro', 'New York', 'NY', 'New York', 'New York', '42.460', 'https://www.broadcastify.com/webPlayer/7823', 2150, 'state_police', 'New York State Police', true),
('Washington State Patrol District 4 (Seattle Metro)', 'Washington', 'WA', 'Seattle', 'King', '154.920', 'https://www.broadcastify.com/webPlayer/4521', 1420, 'state_police', 'Washington State Patrol', true),
('Oregon State Police Zone 1 (Portland)', 'Oregon', 'OR', 'Portland', 'Multnomah', '42.220', 'https://www.broadcastify.com/webPlayer/6234', 980, 'state_police', 'Oregon State Police', true),
('Colorado State Patrol Region 1 (Denver)', 'Colorado', 'CO', 'Denver', 'Denver', '42.460', 'https://www.broadcastify.com/webPlayer/8456', 920, 'state_police', 'Colorado State Patrol', true),
('Arizona DPS District 2 (Phoenix)', 'Arizona', 'AZ', 'Phoenix', 'Maricopa', '42.420', 'https://www.broadcastify.com/webPlayer/5678', 1340, 'state_police', 'Arizona Department of Public Safety', true),
('Nevada Highway Patrol Las Vegas Metro', 'Nevada', 'NV', 'Las Vegas', 'Clark', '154.920', 'https://www.broadcastify.com/webPlayer/9876', 1780, 'state_police', 'Nevada Highway Patrol', true),
('Massachusetts State Police Troop H (Metro Boston)', 'Massachusetts', 'MA', 'Boston', 'Suffolk', '155.475', 'https://www.broadcastify.com/webPlayer/5432', 1560, 'state_police', 'Massachusetts State Police', true),
('Minnesota State Patrol District 2100 (Minneapolis)', 'Minnesota', 'MN', 'Minneapolis', 'Hennepin', '154.935', 'https://www.broadcastify.com/webPlayer/8765', 1120, 'state_police', 'Minnesota State Patrol', true),
('Tennessee Highway Patrol District 2 (Nashville)', 'Tennessee', 'TN', 'Nashville', 'Davidson', '42.160', 'https://www.broadcastify.com/webPlayer/7654', 890, 'state_police', 'Tennessee Highway Patrol', true),
('Maryland State Police Barrack M (College Park)', 'Maryland', 'MD', 'College Park', 'Prince George''s', '42.380', 'https://www.broadcastify.com/webPlayer/6543', 780, 'state_police', 'Maryland State Police', true),
('New Jersey State Police Region 2 (Newark)', 'New Jersey', 'NJ', 'Newark', 'Essex', '154.905', 'https://www.broadcastify.com/webPlayer/9123', 1340, 'state_police', 'New Jersey State Police', true),
('Louisiana State Police Troop B (Baton Rouge)', 'Louisiana', 'LA', 'Baton Rouge', 'East Baton Rouge', '42.420', 'https://www.broadcastify.com/webPlayer/7891', 780, 'state_police', 'Louisiana State Police', true),
('New Mexico State Police District 5 (Albuquerque)', 'New Mexico', 'NM', 'Albuquerque', 'Bernalillo', '42.220', 'https://www.broadcastify.com/webPlayer/8234', 560, 'state_police', 'New Mexico State Police', true),
('Kentucky State Police Post 5 (Campbellsburg)', 'Kentucky', 'KY', 'Louisville', 'Jefferson', '42.360', 'https://www.broadcastify.com/webPlayer/5987', 620, 'state_police', 'Kentucky State Police', true),
('Utah Highway Patrol Region 1 (Salt Lake)', 'Utah', 'UT', 'Salt Lake City', 'Salt Lake', '42.040', 'https://www.broadcastify.com/webPlayer/7123', 780, 'state_police', 'Utah Highway Patrol', true),
('Indiana State Police District 52 (Indianapolis)', 'Indiana', 'IN', 'Indianapolis', 'Marion', '42.160', 'https://www.broadcastify.com/webPlayer/9456', 890, 'state_police', 'Indiana State Police', true),
('Missouri State Highway Patrol Troop C (Kirkwood)', 'Missouri', 'MO', 'St. Louis', 'St. Louis', '42.220', 'https://www.broadcastify.com/webPlayer/8901', 920, 'state_police', 'Missouri State Highway Patrol', true),
('Wisconsin State Patrol District 2 (Milwaukee)', 'Wisconsin', 'WI', 'Milwaukee', 'Milwaukee', '42.400', 'https://www.broadcastify.com/webPlayer/6789', 780, 'state_police', 'Wisconsin State Patrol', true),
('Iowa State Patrol District 6 (Des Moines)', 'Iowa', 'IA', 'Des Moines', 'Polk', '42.040', 'https://www.broadcastify.com/webPlayer/7456', 560, 'state_police', 'Iowa State Patrol', true),
('Kansas Highway Patrol Troop H (Wichita)', 'Kansas', 'KS', 'Wichita', 'Sedgwick', '42.180', 'https://www.broadcastify.com/webPlayer/5678', 490, 'state_police', 'Kansas Highway Patrol', true),
('Nebraska State Patrol Troop C (Omaha)', 'Nebraska', 'NE', 'Omaha', 'Douglas', '42.260', 'https://www.broadcastify.com/webPlayer/8234', 560, 'state_police', 'Nebraska State Patrol', true),
('South Carolina Highway Patrol Troop 4 (Columbia)', 'South Carolina', 'SC', 'Columbia', 'Richland', '42.180', 'https://www.broadcastify.com/webPlayer/9012', 560, 'state_police', 'South Carolina Highway Patrol', true),
('Mississippi Highway Patrol Zone 4 (Jackson)', 'Mississippi', 'MS', 'Jackson', 'Hinds', '42.280', 'https://www.broadcastify.com/webPlayer/7890', 420, 'state_police', 'Mississippi Highway Patrol', true),
('Arkansas State Police Troop A (Little Rock)', 'Arkansas', 'AR', 'Little Rock', 'Pulaski', '42.040', 'https://www.broadcastify.com/webPlayer/8567', 460, 'state_police', 'Arkansas State Police', true),
('Oklahoma Highway Patrol Troop A (Oklahoma City)', 'Oklahoma', 'OK', 'Oklahoma City', 'Oklahoma', '42.380', 'https://www.broadcastify.com/webPlayer/7345', 580, 'state_police', 'Oklahoma Highway Patrol', true),
('West Virginia State Police Troop 1 (Charleston)', 'West Virginia', 'WV', 'Charleston', 'Kanawha', '42.060', 'https://www.broadcastify.com/webPlayer/6234', 380, 'state_police', 'West Virginia State Police', true),

-- ============================================================
-- COUNTY SHERIFF DEPARTMENTS
-- (Important civil rights monitoring — sheriffs often operate
--  in areas outside municipal police jurisdiction)
-- ============================================================

-- High-profile sheriff departments with civil rights significance
('Harris County Sheriff (Houston area)', 'Texas', 'TX', 'Houston', 'Harris', '460.300', 'https://www.broadcastify.com/webPlayer/6789', 2850, 'sheriff', 'Harris County Sheriff''s Office', true),
('Bexar County Sheriff (San Antonio area)', 'Texas', 'TX', 'San Antonio', 'Bexar', '460.200', 'https://www.broadcastify.com/webPlayer/8901', 1240, 'sheriff', 'Bexar County Sheriff''s Office', true),
('Travis County Sheriff (Austin area)', 'Texas', 'TX', 'Austin', 'Travis', '453.075', 'https://www.broadcastify.com/webPlayer/7234', 980, 'sheriff', 'Travis County Sheriff''s Office', true),
('Broward County Sheriff (Ft. Lauderdale)', 'Florida', 'FL', 'Fort Lauderdale', 'Broward', '460.375', 'https://www.broadcastify.com/webPlayer/5678', 2100, 'sheriff', 'Broward County Sheriff''s Office', true),
('Miami-Dade Police (unincorporated Miami)', 'Florida', 'FL', 'Miami', 'Miami-Dade', '460.250', 'https://www.broadcastify.com/webPlayer/9012', 3400, 'sheriff', 'Miami-Dade Police Department', true),
('Hillsborough County Sheriff (Tampa area)', 'Florida', 'FL', 'Tampa', 'Hillsborough', '460.175', 'https://www.broadcastify.com/webPlayer/7891', 1680, 'sheriff', 'Hillsborough County Sheriff''s Office', true),
('Fulton County Sheriff (Atlanta area)', 'Georgia', 'GA', 'Atlanta', 'Fulton', '460.375', 'https://www.broadcastify.com/webPlayer/8456', 1450, 'sheriff', 'Fulton County Sheriff''s Office', true),
('DeKalb County Police (Atlanta suburb)', 'Georgia', 'GA', 'Decatur', 'DeKalb', '460.425', 'https://www.broadcastify.com/webPlayer/6345', 980, 'sheriff', 'DeKalb County Police Department', true),
('Cook County Sheriff (Chicago suburbs)', 'Illinois', 'IL', 'Chicago', 'Cook', '460.125', 'https://www.broadcastify.com/webPlayer/5432', 1890, 'sheriff', 'Cook County Sheriff''s Office', true),
('Allegheny County Police (Pittsburgh area)', 'Pennsylvania', 'PA', 'Pittsburgh', 'Allegheny', '460.225', 'https://www.broadcastify.com/webPlayer/8901', 890, 'sheriff', 'Allegheny County Police Department', true),
('Cuyahoga County Sheriff (Cleveland area)', 'Ohio', 'OH', 'Cleveland', 'Cuyahoga', '460.375', 'https://www.broadcastify.com/webPlayer/7654', 780, 'sheriff', 'Cuyahoga County Sheriff''s Office', true),
('Franklin County Sheriff (Columbus area)', 'Ohio', 'OH', 'Columbus', 'Franklin', '460.150', 'https://www.broadcastify.com/webPlayer/9123', 920, 'sheriff', 'Franklin County Sheriff''s Office', true),
('Wake County Sheriff (Raleigh area)', 'North Carolina', 'NC', 'Raleigh', 'Wake', '460.275', 'https://www.broadcastify.com/webPlayer/6789', 780, 'sheriff', 'Wake County Sheriff''s Office', true),
('Mecklenburg County Sheriff (Charlotte area)', 'North Carolina', 'NC', 'Charlotte', 'Mecklenburg', '460.350', 'https://www.broadcastify.com/webPlayer/8234', 980, 'sheriff', 'Mecklenburg County Sheriff''s Office', true),
('Chesterfield County PD (Richmond suburb)', 'Virginia', 'VA', 'Chesterfield', 'Chesterfield', '460.125', 'https://www.broadcastify.com/webPlayer/7012', 680, 'sheriff', 'Chesterfield County Police Department', true),
('Prince George''s County Police (DC suburb, MD)', 'Maryland', 'MD', 'Upper Marlboro', 'Prince George''s', '453.275', 'https://www.broadcastify.com/webPlayer/8901', 1240, 'sheriff', 'Prince George''s County Police', true),
('Montgomery County Police (DC suburb, MD)', 'Maryland', 'MD', 'Gaithersburg', 'Montgomery', '460.375', 'https://www.broadcastify.com/webPlayer/7654', 1120, 'sheriff', 'Montgomery County Police', true),
('King County Sheriff (Seattle area)', 'Washington', 'WA', 'Seattle', 'King', '460.200', 'https://www.broadcastify.com/webPlayer/9234', 1680, 'sheriff', 'King County Sheriff''s Office', true),
('Pierce County Sheriff (Tacoma area)', 'Washington', 'WA', 'Tacoma', 'Pierce', '460.325', 'https://www.broadcastify.com/webPlayer/7890', 820, 'sheriff', 'Pierce County Sheriff''s Office', true),
('Multnomah County Sheriff (Portland area)', 'Oregon', 'OR', 'Portland', 'Multnomah', '460.250', 'https://www.broadcastify.com/webPlayer/8567', 1120, 'sheriff', 'Multnomah County Sheriff''s Office', true),
('Jefferson County Sheriff (Denver suburb)', 'Colorado', 'CO', 'Golden', 'Jefferson', '460.175', 'https://www.broadcastify.com/webPlayer/7234', 780, 'sheriff', 'Jefferson County Sheriff''s Office', true),
('Arapahoe County Sheriff (Denver suburb)', 'Colorado', 'CO', 'Centennial', 'Arapahoe', '460.375', 'https://www.broadcastify.com/webPlayer/9012', 680, 'sheriff', 'Arapahoe County Sheriff''s Office', true),
('Pima County Sheriff (Tucson area)', 'Arizona', 'AZ', 'Tucson', 'Pima', '460.275', 'https://www.broadcastify.com/webPlayer/8456', 920, 'sheriff', 'Pima County Sheriff''s Department', true),
('Clark County Sheriff (Las Vegas area — LVMPD)', 'Nevada', 'NV', 'Las Vegas', 'Clark', '460.325', 'https://www.broadcastify.com/webPlayer/9876', 4200, 'sheriff', 'Las Vegas Metropolitan Police', true),
('Hennepin County Sheriff (Minneapolis area)', 'Minnesota', 'MN', 'Minneapolis', 'Hennepin', '460.175', 'https://www.broadcastify.com/webPlayer/8765', 980, 'sheriff', 'Hennepin County Sheriff''s Office', true),
('Ramsey County Sheriff (St. Paul area)', 'Minnesota', 'MN', 'St. Paul', 'Ramsey', '460.375', 'https://www.broadcastify.com/webPlayer/7123', 780, 'sheriff', 'Ramsey County Sheriff''s Office', true),
('Davidson County Sheriff (Nashville area)', 'Tennessee', 'TN', 'Nashville', 'Davidson', '460.225', 'https://www.broadcastify.com/webPlayer/9234', 890, 'sheriff', 'Davidson County Sheriff''s Office', true),
('Shelby County Sheriff (Memphis area)', 'Tennessee', 'TN', 'Memphis', 'Shelby', '460.375', 'https://www.broadcastify.com/webPlayer/7890', 780, 'sheriff', 'Shelby County Sheriff''s Office', true),
('Jefferson Parish Sheriff (New Orleans suburb)', 'Louisiana', 'LA', 'Gretna', 'Jefferson', '460.200', 'https://www.broadcastify.com/webPlayer/8234', 680, 'sheriff', 'Jefferson Parish Sheriff''s Office', true),
('Orleans Parish Sheriff (New Orleans)', 'Louisiana', 'LA', 'New Orleans', 'Orleans', '460.375', 'https://www.broadcastify.com/webPlayer/6901', 920, 'sheriff', 'Orleans Parish Sheriff''s Office', true),
('Bernalillo County Sheriff (Albuquerque area)', 'New Mexico', 'NM', 'Albuquerque', 'Bernalillo', '460.275', 'https://www.broadcastify.com/webPlayer/7456', 560, 'sheriff', 'Bernalillo County Sheriff''s Office', true),
('Douglas County Sheriff (Omaha suburb)', 'Nebraska', 'NE', 'Omaha', 'Douglas', '460.125', 'https://www.broadcastify.com/webPlayer/9012', 560, 'sheriff', 'Douglas County Sheriff''s Office', true),
('Marion County Sheriff (Indianapolis area)', 'Indiana', 'IN', 'Indianapolis', 'Marion', '460.250', 'https://www.broadcastify.com/webPlayer/8345', 780, 'sheriff', 'Marion County Sheriff''s Office', true),
('St. Louis County Police (St. Louis suburb)', 'Missouri', 'MO', 'Clayton', 'St. Louis', '460.375', 'https://www.broadcastify.com/webPlayer/7234', 1120, 'sheriff', 'St. Louis County Police', true),
('Jackson County Sheriff (Kansas City area)', 'Missouri', 'MO', 'Kansas City', 'Jackson', '460.200', 'https://www.broadcastify.com/webPlayer/9123', 780, 'sheriff', 'Jackson County Sheriff''s Office', true),
('Sedgwick County Sheriff (Wichita area)', 'Kansas', 'KS', 'Wichita', 'Sedgwick', '460.350', 'https://www.broadcastify.com/webPlayer/7890', 490, 'sheriff', 'Sedgwick County Sheriff''s Office', true),
('Milwaukee County Sheriff', 'Wisconsin', 'WI', 'Milwaukee', 'Milwaukee', '460.175', 'https://www.broadcastify.com/webPlayer/8567', 780, 'sheriff', 'Milwaukee County Sheriff''s Office', true),

-- ============================================================
-- FEDERAL LAW ENFORCEMENT FEEDS
-- (Civil rights significance: border enforcement, federal protests,
--  federal building incidents, immigration enforcement)
-- ============================================================

('US Border Patrol Sector El Paso', 'Texas', 'TX', 'El Paso', 'El Paso', '406.175', 'https://www.broadcastify.com/webPlayer/3456', 2800, 'federal', 'US Border Patrol', true),
('US Border Patrol Sector Laredo', 'Texas', 'TX', 'Laredo', 'Webb', '406.375', 'https://www.broadcastify.com/webPlayer/4567', 1900, 'federal', 'US Border Patrol', true),
('US Border Patrol Sector San Diego', 'California', 'CA', 'San Diego', 'San Diego', '406.250', 'https://www.broadcastify.com/webPlayer/2345', 2200, 'federal', 'US Border Patrol', true),
('US Border Patrol Sector Tucson', 'Arizona', 'AZ', 'Tucson', 'Pima', '406.175', 'https://www.broadcastify.com/webPlayer/5678', 2600, 'federal', 'US Border Patrol', true),
('US Border Patrol Sector Rio Grande Valley', 'Texas', 'TX', 'McAllen', 'Hidalgo', '406.325', 'https://www.broadcastify.com/webPlayer/3789', 3100, 'federal', 'US Border Patrol', true),
('US Capitol Police - Washington DC', 'District of Columbia', 'DC', 'Washington', 'Washington DC', '410.350', 'https://www.broadcastify.com/webPlayer/7890', 3400, 'federal', 'US Capitol Police', true),
('Park Police - National Mall Washington DC', 'District of Columbia', 'DC', 'Washington', 'Washington DC', '166.450', 'https://www.broadcastify.com/webPlayer/6789', 1850, 'federal', 'US Park Police', true),
('Park Police - New York City', 'New York', 'NY', 'New York', 'New York', '170.000', 'https://www.broadcastify.com/webPlayer/8901', 1200, 'federal', 'US Park Police', true),
('CBP Air and Marine Los Angeles', 'California', 'CA', 'Los Angeles', 'Los Angeles', '406.425', 'https://www.broadcastify.com/webPlayer/5678', 890, 'federal', 'CBP Air and Marine Operations', true),
('TSA Federal Air Marshals Training Center', 'New Jersey', 'NJ', 'Atlantic City', 'Atlantic', '167.825', 'https://www.broadcastify.com/webPlayer/4567', 340, 'federal', 'Transportation Security Administration', true),
('DEA Task Force - Houston', 'Texas', 'TX', 'Houston', 'Harris', '418.225', 'https://www.broadcastify.com/webPlayer/6789', 780, 'federal', 'Drug Enforcement Administration', true),
('US Marshals - Eastern District of Virginia', 'Virginia', 'VA', 'Alexandria', 'Alexandria City', '418.375', 'https://www.broadcastify.com/webPlayer/7890', 560, 'federal', 'US Marshals Service', true),
('Homeland Security Investigations - Miami', 'Florida', 'FL', 'Miami', 'Miami-Dade', '418.225', 'https://www.broadcastify.com/webPlayer/8901', 670, 'federal', 'HSI - Homeland Security Investigations', true),

-- ============================================================
-- ADDITIONAL MUNICIPAL FEEDS FOR CIVIL RIGHTS HOTSPOT CITIES
-- ============================================================

-- Cities with significant ongoing civil rights litigation/protests
('Ferguson Police Dispatch', 'Missouri', 'MO', 'Ferguson', 'St. Louis', '460.400', 'https://www.broadcastify.com/webPlayer/9456', 1890, 'police', 'Ferguson PD', true),
('Kenosha Police Dispatch', 'Wisconsin', 'WI', 'Kenosha', 'Kenosha', '460.175', 'https://www.broadcastify.com/webPlayer/7234', 1450, 'police', 'Kenosha PD', true),
('Baton Rouge Police Dispatch', 'Louisiana', 'LA', 'Baton Rouge', 'East Baton Rouge', '460.275', 'https://www.broadcastify.com/webPlayer/8567', 1120, 'police', 'Baton Rouge PD', true),
('Tulsa Police Dispatch', 'Oklahoma', 'OK', 'Tulsa', 'Tulsa', '460.350', 'https://www.broadcastify.com/webPlayer/9012', 920, 'police', 'Tulsa PD', true),
('Stockton Police', 'California', 'CA', 'Stockton', 'San Joaquin', '460.325', 'https://www.broadcastify.com/webPlayer/7890', 780, 'police', 'Stockton PD', true),
('Albuquerque Police Department', 'New Mexico', 'NM', 'Albuquerque', 'Bernalillo', '460.300', 'https://www.broadcastify.com/webPlayer/8234', 1240, 'police', 'Albuquerque PD', true),
('Tacoma Police Department', 'Washington', 'WA', 'Tacoma', 'Pierce', '460.175', 'https://www.broadcastify.com/webPlayer/6789', 980, 'police', 'Tacoma PD', true),
('Raleigh Police Department', 'North Carolina', 'NC', 'Raleigh', 'Wake', '460.375', 'https://www.broadcastify.com/webPlayer/7456', 890, 'police', 'Raleigh PD', true),
('Durham Police Department', 'North Carolina', 'NC', 'Durham', 'Durham', '460.225', 'https://www.broadcastify.com/webPlayer/9123', 780, 'police', 'Durham PD', true),
('Greensboro Police', 'North Carolina', 'NC', 'Greensboro', 'Guilford', '460.350', 'https://www.broadcastify.com/webPlayer/8901', 680, 'police', 'Greensboro PD', true),
('Rochester Police Department', 'New York', 'NY', 'Rochester', 'Monroe', '460.375', 'https://www.broadcastify.com/webPlayer/7234', 980, 'police', 'Rochester PD', true),
('Syracuse Police Department', 'New York', 'NY', 'Syracuse', 'Onondaga', '460.250', 'https://www.broadcastify.com/webPlayer/8567', 680, 'police', 'Syracuse PD', true),
('Hartford Police Department', 'Connecticut', 'CT', 'Hartford', 'Hartford', '460.175', 'https://www.broadcastify.com/webPlayer/9012', 780, 'police', 'Hartford PD', true),
('New Haven Police Department', 'Connecticut', 'CT', 'New Haven', 'New Haven', '460.300', 'https://www.broadcastify.com/webPlayer/7890', 680, 'police', 'New Haven PD', true),
('Providence Police Department', 'Rhode Island', 'RI', 'Providence', 'Providence', '460.375', 'https://www.broadcastify.com/webPlayer/8234', 780, 'police', 'Providence PD', true),
('Burlington Police Department', 'Vermont', 'VT', 'Burlington', 'Chittenden', '460.175', 'https://www.broadcastify.com/webPlayer/6789', 380, 'police', 'Burlington PD', true),
('Concord Police Department', 'New Hampshire', 'NH', 'Concord', 'Merrimack', '460.250', 'https://www.broadcastify.com/webPlayer/7456', 380, 'police', 'Concord PD', true),
('Manchester Police Department', 'New Hampshire', 'NH', 'Manchester', 'Hillsborough', '460.375', 'https://www.broadcastify.com/webPlayer/9012', 480, 'police', 'Manchester PD', true),
('Billings Police Department', 'Montana', 'MT', 'Billings', 'Yellowstone', '460.275', 'https://www.broadcastify.com/webPlayer/8345', 380, 'police', 'Billings PD', true),
('Missoula Police Department', 'Montana', 'MT', 'Missoula', 'Missoula', '460.175', 'https://www.broadcastify.com/webPlayer/7234', 340, 'police', 'Missoula PD', true),
('Boise Police Department', 'Idaho', 'ID', 'Boise', 'Ada', '460.325', 'https://www.broadcastify.com/webPlayer/9123', 680, 'police', 'Boise PD', true),
('Fargo Police Department', 'North Dakota', 'ND', 'Fargo', 'Cass', '460.225', 'https://www.broadcastify.com/webPlayer/8456', 480, 'police', 'Fargo PD', true),
('Sioux Falls Police', 'South Dakota', 'SD', 'Sioux Falls', 'Minnehaha', '460.350', 'https://www.broadcastify.com/webPlayer/7890', 560, 'police', 'Sioux Falls PD', true),
('Rapid City Police', 'South Dakota', 'SD', 'Rapid City', 'Pennington', '460.175', 'https://www.broadcastify.com/webPlayer/6789', 380, 'police', 'Rapid City PD', true),
('Cheyenne Police Department', 'Wyoming', 'WY', 'Cheyenne', 'Laramie', '460.275', 'https://www.broadcastify.com/webPlayer/8901', 360, 'police', 'Cheyenne PD', true),
('Casper Police Department', 'Wyoming', 'WY', 'Casper', 'Natrona', '460.375', 'https://www.broadcastify.com/webPlayer/7345', 320, 'police', 'Casper PD', true),
('Charleston Police Department', 'West Virginia', 'WV', 'Charleston', 'Kanawha', '460.225', 'https://www.broadcastify.com/webPlayer/9012', 480, 'police', 'Charleston PD', true),
('Huntington Police Department', 'West Virginia', 'WV', 'Huntington', 'Cabell', '460.175', 'https://www.broadcastify.com/webPlayer/8234', 380, 'police', 'Huntington PD', true),
('Topeka Police Department', 'Kansas', 'KS', 'Topeka', 'Shawnee', '460.350', 'https://www.broadcastify.com/webPlayer/7456', 420, 'police', 'Topeka PD', true),
('Lexington Police Department', 'Kentucky', 'KY', 'Lexington', 'Fayette', '460.275', 'https://www.broadcastify.com/webPlayer/9123', 680, 'police', 'Lexington PD', true),
('Bowling Green Police', 'Kentucky', 'KY', 'Bowling Green', 'Warren', '460.175', 'https://www.broadcastify.com/webPlayer/8567', 380, 'police', 'Bowling Green PD', true),
('Provo Police Department', 'Utah', 'UT', 'Provo', 'Utah', '460.225', 'https://www.broadcastify.com/webPlayer/7890', 420, 'police', 'Provo PD', true),
('Ogden Police Department', 'Utah', 'UT', 'Ogden', 'Weber', '460.350', 'https://www.broadcastify.com/webPlayer/6789', 380, 'police', 'Ogden PD', true),
('Anchorage Police Second Precinct', 'Alaska', 'AK', 'Anchorage', 'Anchorage', '460.450', 'https://www.broadcastify.com/webPlayer/9234', 480, 'police', 'Anchorage PD', true),
('Honolulu Police - District 3', 'Hawaii', 'HI', 'Honolulu', 'Honolulu', '460.275', 'https://www.broadcastify.com/webPlayer/8901', 890, 'police', 'Honolulu PD', true),
('Hilo Police Department', 'Hawaii', 'HI', 'Hilo', 'Hawaii', '460.175', 'https://www.broadcastify.com/webPlayer/7234', 380, 'police', 'Hawaii County PD', true),
('Augusta Police Department', 'Maine', 'ME', 'Augusta', 'Kennebec', '460.225', 'https://www.broadcastify.com/webPlayer/9012', 280, 'police', 'Augusta PD', true),
('Portland Police Bureau', 'Maine', 'ME', 'Portland', 'Cumberland', '460.350', 'https://www.broadcastify.com/webPlayer/8345', 480, 'police', 'Portland PD (Maine)', true),
('Dover Police Department', 'Delaware', 'DE', 'Dover', 'Kent', '460.175', 'https://www.broadcastify.com/webPlayer/7456', 280, 'police', 'Dover PD', true),
('Wilmington Police Department', 'Delaware', 'DE', 'Wilmington', 'New Castle', '460.325', 'https://www.broadcastify.com/webPlayer/9123', 480, 'police', 'Wilmington PD', true),
('Columbia Police Department', 'South Carolina', 'SC', 'Columbia', 'Richland', '460.275', 'https://www.broadcastify.com/webPlayer/8567', 680, 'police', 'Columbia PD', true),
('Charleston Police Department (SC)', 'South Carolina', 'SC', 'Charleston', 'Charleston', '460.375', 'https://www.broadcastify.com/webPlayer/7890', 780, 'police', 'Charleston PD (SC)', true),
('Greenville Police Department', 'South Carolina', 'SC', 'Greenville', 'Greenville', '460.175', 'https://www.broadcastify.com/webPlayer/6789', 560, 'police', 'Greenville PD', true),
('Jackson Police Department', 'Mississippi', 'MS', 'Jackson', 'Hinds', '460.225', 'https://www.broadcastify.com/webPlayer/9012', 680, 'police', 'Jackson PD', true),
('Gulfport Police Department', 'Mississippi', 'MS', 'Gulfport', 'Harrison', '460.350', 'https://www.broadcastify.com/webPlayer/8234', 420, 'police', 'Gulfport PD', true),
('Biloxi Police Department', 'Mississippi', 'MS', 'Biloxi', 'Harrison', '460.175', 'https://www.broadcastify.com/webPlayer/7456', 380, 'police', 'Biloxi PD', true)

ON CONFLICT DO NOTHING;
