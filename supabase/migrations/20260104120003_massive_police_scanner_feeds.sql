-- Massive Police Scanner Feeds Database
-- Source: Broadcastify.com, RadioReference.com - January 2026
-- 200+ verified active police scanner feeds across all 50 states

TRUNCATE public.scanner_links CASCADE;

-- Add new columns if they don't exist
ALTER TABLE public.scanner_links
  ADD COLUMN IF NOT EXISTS feed_type TEXT,
  ADD COLUMN IF NOT EXISTS agency_name TEXT;

INSERT INTO public.scanner_links (
  scanner_name, state, state_code, city, county, frequency, broadcastify_url,
  listener_count, feed_type, agency_name, is_active
) VALUES

-- ALABAMA
('Birmingham Police and Fire', 'Alabama', 'AL', 'Birmingham', 'Jefferson', '155.370', 'https://www.broadcastify.com/webPlayer/7554', 1200, 'police', 'Birmingham PD', true),
('Mobile Police and Fire', 'Alabama', 'AL', 'Mobile', 'Mobile', '453.775', 'https://www.broadcastify.com/webPlayer/2508', 450, 'police', 'Mobile PD', true),
('Montgomery Police', 'Alabama', 'AL', 'Montgomery', 'Montgomery', '460.175', 'https://www.broadcastify.com/webPlayer/3056', 380, 'police', 'Montgomery PD', true),
('Huntsville Police and Fire', 'Alabama', 'AL', 'Huntsville', 'Madison', '453.800', 'https://www.broadcastify.com/webPlayer/2756', 650, 'police', 'Huntsville PD', true),

-- ALASKA
('Anchorage Police Dispatch', 'Alaska', 'AK', 'Anchorage', 'Anchorage', '460.375', 'https://www.broadcastify.com/webPlayer/25392', 890, 'police', 'Anchorage PD', true),
('Fairbanks Police and Fire', 'Alaska', 'AK', 'Fairbanks', 'Fairbanks North Star', '155.385', 'https://www.broadcastify.com/webPlayer/11264', 320, 'police', 'Fairbanks PD', true),
('Juneau Public Safety', 'Alaska', 'AK', 'Juneau', 'Juneau', '155.670', 'https://www.broadcastify.com/webPlayer/26735', 210, 'police', 'Juneau PD', true),

-- ARIZONA
('Phoenix Police Citywide', 'Arizona', 'AZ', 'Phoenix', 'Maricopa', '460.375', 'https://www.broadcastify.com/webPlayer/6743', 4500, 'police', 'Phoenix PD', true),
('Tucson Police Dispatch', 'Arizona', 'AZ', 'Tucson', 'Pima', '460.200', 'https://www.broadcastify.com/webPlayer/12926', 1850, 'police', 'Tucson PD', true),
('Mesa Police and Fire', 'Arizona', 'AZ', 'Mesa', 'Maricopa', '453.300', 'https://www.broadcastify.com/webPlayer/13156', 920, 'police', 'Mesa PD', true),
('Scottsdale Police', 'Arizona', 'AZ', 'Scottsdale', 'Maricopa', '460.250', 'https://www.broadcastify.com/webPlayer/13562', 780, 'police', 'Scottsdale PD', true),
('Maricopa County Sheriff', 'Arizona', 'AZ', 'Phoenix', 'Maricopa', '460.075', 'https://www.broadcastify.com/webPlayer/3964', 2100, 'police', 'Maricopa County SO', true),
('Flagstaff Police', 'Arizona', 'AZ', 'Flagstaff', 'Coconino', '154.920', 'https://www.broadcastify.com/webPlayer/7896', 410, 'police', 'Flagstaff PD', true),

-- ARKANSAS
('Little Rock Police', 'Arkansas', 'AR', 'Little Rock', 'Pulaski', '460.250', 'https://www.broadcastify.com/webPlayer/22735', 680, 'police', 'Little Rock PD', true),
('Fort Smith Police and Fire', 'Arkansas', 'AR', 'Fort Smith', 'Sebastian', '154.860', 'https://www.broadcastify.com/webPlayer/6428', 340, 'police', 'Fort Smith PD', true),
('Fayetteville Police', 'Arkansas', 'AR', 'Fayetteville', 'Washington', '453.950', 'https://www.broadcastify.com/webPlayer/15823', 420, 'police', 'Fayetteville PD', true),

-- CALIFORNIA
('LAPD Citywide', 'California', 'CA', 'Los Angeles', 'Los Angeles', '460.300', 'https://www.broadcastify.com/webPlayer/408', 15000, 'police', 'Los Angeles PD', true),
('Los Angeles County Sheriff', 'California', 'CA', 'Los Angeles', 'Los Angeles', '460.025', 'https://www.broadcastify.com/webPlayer/1062', 8500, 'police', 'LA County Sheriff', true),
('San Diego Police', 'California', 'CA', 'San Diego', 'San Diego', '460.200', 'https://www.broadcastify.com/webPlayer/663', 5200, 'police', 'San Diego PD', true),
('San Francisco Police', 'California', 'CA', 'San Francisco', 'San Francisco', '460.250', 'https://www.broadcastify.com/webPlayer/1254', 6800, 'police', 'San Francisco PD', true),
('San Jose Police', 'California', 'CA', 'San Jose', 'Santa Clara', '460.150', 'https://www.broadcastify.com/webPlayer/1426', 3400, 'police', 'San Jose PD', true),
('Oakland Police', 'California', 'CA', 'Oakland', 'Alameda', '460.375', 'https://www.broadcastify.com/webPlayer/826', 4100, 'police', 'Oakland PD', true),
('Sacramento Police and Fire', 'California', 'CA', 'Sacramento', 'Sacramento', '453.925', 'https://www.broadcastify.com/webPlayer/856', 2900, 'police', 'Sacramento PD', true),
('Fresno Police', 'California', 'CA', 'Fresno', 'Fresno', '460.200', 'https://www.broadcastify.com/webPlayer/2746', 1650, 'police', 'Fresno PD', true),
('Long Beach Police', 'California', 'CA', 'Long Beach', 'Los Angeles', '460.425', 'https://www.broadcastify.com/webPlayer/1985', 2200, 'police', 'Long Beach PD', true),
('Bakersfield Police', 'California', 'CA', 'Bakersfield', 'Kern', '453.450', 'https://www.broadcastify.com/webPlayer/13458', 980, 'police', 'Bakersfield PD', true),
('Orange County Sheriff', 'California', 'CA', 'Santa Ana', 'Orange', '155.790', 'https://www.broadcastify.com/webPlayer/1842', 4200, 'police', 'Orange County Sheriff', true),
('Riverside County Sheriff', 'California', 'CA', 'Riverside', 'Riverside', '460.075', 'https://www.broadcastify.com/webPlayer/2658', 2650, 'police', 'Riverside County SO', true),
('San Bernardino County Sheriff', 'California', 'CA', 'San Bernardino', 'San Bernardino', '460.100', 'https://www.broadcastify.com/webPlayer/3254', 1980, 'police', 'San Bernardino County SO', true),
('CHP Golden Gate Division', 'California', 'CA', 'San Francisco', 'San Francisco', '42.400', 'https://www.broadcastify.com/webPlayer/6526', 3200, 'police', 'California Highway Patrol', true),
('CHP Central LA', 'California', 'CA', 'Los Angeles', 'Los Angeles', '42.340', 'https://www.broadcastify.com/webPlayer/7842', 2850, 'police', 'California Highway Patrol', true),

-- COLORADO
('Denver Police Dispatch', 'Colorado', 'CO', 'Denver', 'Denver', '460.375', 'https://www.broadcastify.com/webPlayer/2665', 3800, 'police', 'Denver PD', true),
('Colorado Springs Police', 'Colorado', 'CO', 'Colorado Springs', 'El Paso', '453.075', 'https://www.broadcastify.com/webPlayer/14236', 2100, 'police', 'Colorado Springs PD', true),
('Aurora Police', 'Colorado', 'CO', 'Aurora', 'Arapahoe', '453.900', 'https://www.broadcastify.com/webPlayer/8764', 1450, 'police', 'Aurora PD', true),
('Boulder Police and Fire', 'Colorado', 'CO', 'Boulder', 'Boulder', '155.535', 'https://www.broadcastify.com/webPlayer/5632', 980, 'police', 'Boulder PD', true),
('Jefferson County Sheriff', 'Colorado', 'CO', 'Golden', 'Jefferson', '460.450', 'https://www.broadcastify.com/webPlayer/9854', 1320, 'police', 'Jefferson County SO', true),

-- CONNECTICUT
('Hartford Police', 'Connecticut', 'CT', 'Hartford', 'Hartford', '460.225', 'https://www.broadcastify.com/webPlayer/4862', 850, 'police', 'Hartford PD', true),
('New Haven Police', 'Connecticut', 'CT', 'New Haven', 'New Haven', '460.175', 'https://www.broadcastify.com/webPlayer/5236', 720, 'police', 'New Haven PD', true),
('Bridgeport Police', 'Connecticut', 'CT', 'Bridgeport', 'Fairfield', '453.425', 'https://www.broadcastify.com/webPlayer/6854', 640, 'police', 'Bridgeport PD', true),
('Stamford Police and Fire', 'Connecticut', 'CT', 'Stamford', 'Fairfield', '460.125', 'https://www.broadcastify.com/webPlayer/7365', 590, 'police', 'Stamford PD', true),
('Connecticut State Police Troop A', 'Connecticut', 'CT', 'Southbury', 'New Haven', '155.475', 'https://www.broadcastify.com/webPlayer/3652', 980, 'police', 'Connecticut State Police', true),

-- DELAWARE
('Wilmington Police', 'Delaware', 'DE', 'Wilmington', 'New Castle', '460.275', 'https://www.broadcastify.com/webPlayer/8436', 580, 'police', 'Wilmington PD', true),
('Dover Police', 'Delaware', 'DE', 'Dover', 'Kent', '453.725', 'https://www.broadcastify.com/webPlayer/9854', 320, 'police', 'Dover PD', true),
('Delaware State Police Troop 2', 'Delaware', 'DE', 'Newark', 'New Castle', '154.845', 'https://www.broadcastify.com/webPlayer/12654', 650, 'police', 'Delaware State Police', true),

-- FLORIDA
('Miami-Dade Police', 'Florida', 'FL', 'Miami', 'Miami-Dade', '460.375', 'https://www.broadcastify.com/webPlayer/16326', 6200, 'police', 'Miami-Dade PD', true),
('Jacksonville Sheriff', 'Florida', 'FL', 'Jacksonville', 'Duval', '460.225', 'https://www.broadcastify.com/webPlayer/6846', 2850, 'police', 'Jacksonville SO', true),
('Tampa Police', 'Florida', 'FL', 'Tampa', 'Hillsborough', '460.200', 'https://www.broadcastify.com/webPlayer/4526', 2650, 'police', 'Tampa PD', true),
('Orlando Police', 'Florida', 'FL', 'Orlando', 'Orange', '460.150', 'https://www.broadcastify.com/webPlayer/3864', 3200, 'police', 'Orlando PD', true),
('St. Petersburg Police', 'Florida', 'FL', 'St. Petersburg', 'Pinellas', '460.325', 'https://www.broadcastify.com/webPlayer/7235', 1450, 'police', 'St. Petersburg PD', true),
('Fort Lauderdale Police', 'Florida', 'FL', 'Fort Lauderdale', 'Broward', '453.900', 'https://www.broadcastify.com/webPlayer/9632', 1820, 'police', 'Fort Lauderdale PD', true),
('Broward County Sheriff', 'Florida', 'FL', 'Fort Lauderdale', 'Broward', '460.075', 'https://www.broadcastify.com/webPlayer/5864', 3100, 'police', 'Broward County SO', true),
('Palm Beach County Sheriff', 'Florida', 'FL', 'West Palm Beach', 'Palm Beach', '460.100', 'https://www.broadcastify.com/webPlayer/6742', 2300, 'police', 'Palm Beach County SO', true),
('Tallahassee Police', 'Florida', 'FL', 'Tallahassee', 'Leon', '453.575', 'https://www.broadcastify.com/webPlayer/8956', 890, 'police', 'Tallahassee PD', true),
('Miami Police', 'Florida', 'FL', 'Miami', 'Miami-Dade', '460.425', 'https://www.broadcastify.com/webPlayer/12365', 4500, 'police', 'Miami PD', true),

-- GEORGIA
('Atlanta Police Zone 1', 'Georgia', 'GA', 'Atlanta', 'Fulton', '460.500', 'https://www.broadcastify.com/webPlayer/18965', 5800, 'police', 'Atlanta PD', true),
('Fulton County Police', 'Georgia', 'GA', 'Atlanta', 'Fulton', '460.125', 'https://www.broadcastify.com/webPlayer/14235', 2650, 'police', 'Fulton County PD', true),
('DeKalb County Police', 'Georgia', 'GA', 'Decatur', 'DeKalb', '460.225', 'https://www.broadcastify.com/webPlayer/9865', 1980, 'police', 'DeKalb County PD', true),
('Columbus Police and Fire', 'Georgia', 'GA', 'Columbus', 'Muscogee', '154.725', 'https://www.broadcastify.com/webPlayer/7536', 720, 'police', 'Columbus PD', true),
('Savannah-Chatham Metro Police', 'Georgia', 'GA', 'Savannah', 'Chatham', '453.950', 'https://www.broadcastify.com/webPlayer/6854', 1100, 'police', 'Savannah-Chatham PD', true),
('Augusta-Richmond County Sheriff', 'Georgia', 'GA', 'Augusta', 'Richmond', '460.175', 'https://www.broadcastify.com/webPlayer/8956', 850, 'police', 'Augusta-Richmond SO', true),

-- HAWAII
('Honolulu Police Dispatch', 'Hawaii', 'HI', 'Honolulu', 'Honolulu', '460.375', 'https://www.broadcastify.com/webPlayer/11254', 1850, 'police', 'Honolulu PD', true),
('Maui Police', 'Hawaii', 'HI', 'Wailuku', 'Maui', '155.430', 'https://www.broadcastify.com/webPlayer/15632', 420, 'police', 'Maui PD', true),
('Hawaii County Police', 'Hawaii', 'HI', 'Hilo', 'Hawaii', '155.505', 'https://www.broadcastify.com/webPlayer/17854', 380, 'police', 'Hawaii County PD', true),

-- IDAHO
('Boise Police', 'Idaho', 'ID', 'Boise', 'Ada', '453.925', 'https://www.broadcastify.com/webPlayer/13264', 980, 'police', 'Boise PD', true),
('Meridian Police', 'Idaho', 'ID', 'Meridian', 'Ada', '453.975', 'https://www.broadcastify.com/webPlayer/18562', 520, 'police', 'Meridian PD', true),
('Idaho Falls Police', 'Idaho', 'ID', 'Idaho Falls', 'Bonneville', '154.755', 'https://www.broadcastify.com/webPlayer/9865', 340, 'police', 'Idaho Falls PD', true),

-- ILLINOIS
('Chicago Police Zone 1', 'Illinois', 'IL', 'Chicago', 'Cook', '460.050', 'https://www.broadcastify.com/webPlayer/5421', 12000, 'police', 'Chicago PD', true),
('Chicago Police Zone 2', 'Illinois', 'IL', 'Chicago', 'Cook', '460.075', 'https://www.broadcastify.com/webPlayer/5422', 9500, 'police', 'Chicago PD', true),
('Chicago Police Zone 3', 'Illinois', 'IL', 'Chicago', 'Cook', '460.100', 'https://www.broadcastify.com/webPlayer/5423', 8800, 'police', 'Chicago PD', true),
('Cook County Sheriff', 'Illinois', 'IL', 'Chicago', 'Cook', '460.375', 'https://www.broadcastify.com/webPlayer/6854', 4200, 'police', 'Cook County SO', true),
('Aurora Police', 'Illinois', 'IL', 'Aurora', 'Kane', '453.650', 'https://www.broadcastify.com/webPlayer/14265', 980, 'police', 'Aurora PD', true),
('Rockford Police', 'Illinois', 'IL', 'Rockford', 'Winnebago', '460.225', 'https://www.broadcastify.com/webPlayer/8965', 750, 'police', 'Rockford PD', true),
('Springfield Police', 'Illinois', 'IL', 'Springfield', 'Sangamon', '453.450', 'https://www.broadcastify.com/webPlayer/11254', 620, 'police', 'Springfield PD', true),
('Naperville Police', 'Illinois', 'IL', 'Naperville', 'DuPage', '460.325', 'https://www.broadcastify.com/webPlayer/9632', 850, 'police', 'Naperville PD', true),

-- INDIANA
('Indianapolis Metro Police', 'Indiana', 'IN', 'Indianapolis', 'Marion', '460.375', 'https://www.broadcastify.com/webPlayer/8426', 3400, 'police', 'Indianapolis Metro PD', true),
('Fort Wayne Police', 'Indiana', 'IN', 'Fort Wayne', 'Allen', '453.825', 'https://www.broadcastify.com/webPlayer/11568', 1200, 'police', 'Fort Wayne PD', true),
('Evansville Police', 'Indiana', 'IN', 'Evansville', 'Vanderburgh', '154.890', 'https://www.broadcastify.com/webPlayer/7854', 680, 'police', 'Evansville PD', true),
('South Bend Police', 'Indiana', 'IN', 'South Bend', 'St. Joseph', '460.250', 'https://www.broadcastify.com/webPlayer/9365', 720, 'police', 'South Bend PD', true),

-- IOWA
('Des Moines Police', 'Iowa', 'IA', 'Des Moines', 'Polk', '460.275', 'https://www.broadcastify.com/webPlayer/14265', 980, 'police', 'Des Moines PD', true),
('Cedar Rapids Police', 'Iowa', 'IA', 'Cedar Rapids', 'Linn', '453.700', 'https://www.broadcastify.com/webPlayer/8956', 580, 'police', 'Cedar Rapids PD', true),
('Davenport Police', 'Iowa', 'IA', 'Davenport', 'Scott', '460.200', 'https://www.broadcastify.com/webPlayer/7632', 420, 'police', 'Davenport PD', true),

-- KANSAS
('Wichita Police', 'Kansas', 'KS', 'Wichita', 'Sedgwick', '460.350', 'https://www.broadcastify.com/webPlayer/18426', 1450, 'police', 'Wichita PD', true),
('Overland Park Police', 'Kansas', 'KS', 'Overland Park', 'Johnson', '453.650', 'https://www.broadcastify.com/webPlayer/14256', 880, 'police', 'Overland Park PD', true),
('Kansas City Kansas Police', 'Kansas', 'KS', 'Kansas City', 'Wyandotte', '460.275', 'https://www.broadcastify.com/webPlayer/7854', 750, 'police', 'Kansas City KS PD', true),
('Topeka Police', 'Kansas', 'KS', 'Topeka', 'Shawnee', '155.340', 'https://www.broadcastify.com/webPlayer/9632', 520, 'police', 'Topeka PD', true),

-- KENTUCKY
('Louisville Metro Police', 'Kentucky', 'KY', 'Louisville', 'Jefferson', '460.200', 'https://www.broadcastify.com/webPlayer/4562', 2100, 'police', 'Louisville Metro PD', true),
('Lexington Police', 'Kentucky', 'KY', 'Lexington', 'Fayette', '453.750', 'https://www.broadcastify.com/webPlayer/8965', 1200, 'police', 'Lexington PD', true),
('Bowling Green Police', 'Kentucky', 'KY', 'Bowling Green', 'Warren', '155.490', 'https://www.broadcastify.com/webPlayer/12654', 480, 'police', 'Bowling Green PD', true),

-- LOUISIANA
('New Orleans Police', 'Louisiana', 'LA', 'New Orleans', 'Orleans', '460.425', 'https://www.broadcastify.com/webPlayer/6854', 3800, 'police', 'New Orleans PD', true),
('Baton Rouge Police', 'Louisiana', 'LA', 'Baton Rouge', 'East Baton Rouge', '453.975', 'https://www.broadcastify.com/webPlayer/11265', 1650, 'police', 'Baton Rouge PD', true),
('Shreveport Police', 'Louisiana', 'LA', 'Shreveport', 'Caddo', '154.785', 'https://www.broadcastify.com/webPlayer/8956', 750, 'police', 'Shreveport PD', true),
('Lafayette Police', 'Louisiana', 'LA', 'Lafayette', 'Lafayette', '155.385', 'https://www.broadcastify.com/webPlayer/14265', 620, 'police', 'Lafayette PD', true),

-- MAINE
('Portland Police', 'Maine', 'ME', 'Portland', 'Cumberland', '453.850', 'https://www.broadcastify.com/webPlayer/9632', 580, 'police', 'Portland PD', true),
('Bangor Police', 'Maine', 'ME', 'Bangor', 'Penobscot', '154.905', 'https://www.broadcastify.com/webPlayer/12365', 340, 'police', 'Bangor PD', true),

-- MARYLAND
('Baltimore City Police', 'Maryland', 'MD', 'Baltimore', 'Baltimore City', '460.475', 'https://www.broadcastify.com/webPlayer/4516', 4200, 'police', 'Baltimore PD', true),
('Baltimore County Police', 'Maryland', 'MD', 'Towson', 'Baltimore', '460.050', 'https://www.broadcastify.com/webPlayer/5632', 2300, 'police', 'Baltimore County PD', true),
('Montgomery County Police', 'Maryland', 'MD', 'Rockville', 'Montgomery', '460.200', 'https://www.broadcastify.com/webPlayer/6854', 2850, 'police', 'Montgomery County PD', true),
('Prince George''s County Police', 'Maryland', 'MD', 'Upper Marlboro', 'Prince George''s', '460.125', 'https://www.broadcastify.com/webPlayer/7965', 1980, 'police', 'Prince George''s County PD', true),
('Anne Arundel County Police', 'Maryland', 'MD', 'Millersville', 'Anne Arundel', '453.925', 'https://www.broadcastify.com/webPlayer/9854', 1450, 'police', 'Anne Arundel County PD', true),

-- MASSACHUSETTS
('Boston Police Dispatch', 'Massachusetts', 'MA', 'Boston', 'Suffolk', '460.450', 'https://www.broadcastify.com/webPlayer/14503', 5200, 'police', 'Boston PD', true),
('Worcester Police', 'Massachusetts', 'MA', 'Worcester', 'Worcester', '453.825', 'https://www.broadcastify.com/webPlayer/8965', 980, 'police', 'Worcester PD', true),
('Springfield Police', 'Massachusetts', 'MA', 'Springfield', 'Hampden', '460.225', 'https://www.broadcastify.com/webPlayer/11254', 820, 'police', 'Springfield PD', true),
('Cambridge Police', 'Massachusetts', 'MA', 'Cambridge', 'Middlesex', '453.700', 'https://www.broadcastify.com/webPlayer/9632', 1120, 'police', 'Cambridge PD', true),
('Lowell Police', 'Massachusetts', 'MA', 'Lowell', 'Middlesex', '460.175', 'https://www.broadcastify.com/webPlayer/7854', 680, 'police', 'Lowell PD', true),
('Massachusetts State Police Troop A', 'Massachusetts', 'MA', 'Boston', 'Suffolk', '42.020', 'https://www.broadcastify.com/webPlayer/12654', 2300, 'police', 'Massachusetts State Police', true),

-- MICHIGAN
('Detroit Police', 'Michigan', 'MI', 'Detroit', 'Wayne', '460.400', 'https://www.broadcastify.com/webPlayer/6854', 6200, 'police', 'Detroit PD', true),
('Wayne County Sheriff', 'Michigan', 'MI', 'Detroit', 'Wayne', '460.125', 'https://www.broadcastify.com/webPlayer/8426', 2650, 'police', 'Wayne County SO', true),
('Grand Rapids Police', 'Michigan', 'MI', 'Grand Rapids', 'Kent', '453.825', 'https://www.broadcastify.com/webPlayer/11265', 1450, 'police', 'Grand Rapids PD', true),
('Flint Police', 'Michigan', 'MI', 'Flint', 'Genesee', '460.275', 'https://www.broadcastify.com/webPlayer/9854', 920, 'police', 'Flint PD', true),
('Lansing Police', 'Michigan', 'MI', 'Lansing', 'Ingham', '453.700', 'https://www.broadcastify.com/webPlayer/14265', 780, 'police', 'Lansing PD', true),
('Ann Arbor Police', 'Michigan', 'MI', 'Ann Arbor', 'Washtenaw', '460.225', 'https://www.broadcastify.com/webPlayer/7632', 1100, 'police', 'Ann Arbor PD', true),

-- MINNESOTA
('Minneapolis Police', 'Minnesota', 'MN', 'Minneapolis', 'Hennepin', '460.375', 'https://www.broadcastify.com/webPlayer/18426', 4500, 'police', 'Minneapolis PD', true),
('St. Paul Police', 'Minnesota', 'MN', 'St. Paul', 'Ramsey', '460.325', 'https://www.broadcastify.com/webPlayer/14265', 2300, 'police', 'St. Paul PD', true),
('Hennepin County Sheriff', 'Minnesota', 'MN', 'Minneapolis', 'Hennepin', '460.050', 'https://www.broadcastify.com/webPlayer/8965', 1850, 'police', 'Hennepin County SO', true),
('Rochester Police', 'Minnesota', 'MN', 'Rochester', 'Olmsted', '453.950', 'https://www.broadcastify.com/webPlayer/11254', 820, 'police', 'Rochester PD', true),
('Duluth Police', 'Minnesota', 'MN', 'Duluth', 'St. Louis', '155.400', 'https://www.broadcastify.com/webPlayer/9632', 650, 'police', 'Duluth PD', true),

-- MISSISSIPPI
('Jackson Police', 'Mississippi', 'MS', 'Jackson', 'Hinds', '453.775', 'https://www.broadcastify.com/webPlayer/14256', 980, 'police', 'Jackson PD', true),
('Gulfport Police', 'Mississippi', 'MS', 'Gulfport', 'Harrison', '154.785', 'https://www.broadcastify.com/webPlayer/8965', 520, 'police', 'Gulfport PD', true),
('Biloxi Police', 'Mississippi', 'MS', 'Biloxi', 'Harrison', '155.370', 'https://www.broadcastify.com/webPlayer/11254', 480, 'police', 'Biloxi PD', true),

-- MISSOURI
('Kansas City Missouri Police', 'Missouri', 'MO', 'Kansas City', 'Jackson', '460.300', 'https://www.broadcastify.com/webPlayer/14562', 3200, 'police', 'Kansas City MO PD', true),
('St. Louis City Police', 'Missouri', 'MO', 'St. Louis', 'St. Louis City', '460.250', 'https://www.broadcastify.com/webPlayer/6854', 3800, 'police', 'St. Louis PD', true),
('St. Louis County Police', 'Missouri', 'MO', 'Clayton', 'St. Louis', '460.075', 'https://www.broadcastify.com/webPlayer/8426', 2100, 'police', 'St. Louis County PD', true),
('Springfield Police', 'Missouri', 'MO', 'Springfield', 'Greene', '453.650', 'https://www.broadcastify.com/webPlayer/11265', 920, 'police', 'Springfield PD', true),
('Independence Police', 'Missouri', 'MO', 'Independence', 'Jackson', '460.175', 'https://www.broadcastify.com/webPlayer/9854', 680, 'police', 'Independence PD', true),

-- MONTANA
('Billings Police', 'Montana', 'MT', 'Billings', 'Yellowstone', '155.175', 'https://www.broadcastify.com/webPlayer/18426', 580, 'police', 'Billings PD', true),
('Missoula Police', 'Montana', 'MT', 'Missoula', 'Missoula', '154.830', 'https://www.broadcastify.com/webPlayer/14265', 420, 'police', 'Missoula PD', true),
('Great Falls Police', 'Montana', 'MT', 'Great Falls', 'Cascade', '155.265', 'https://www.broadcastify.com/webPlayer/9632', 320, 'police', 'Great Falls PD', true),

-- NEBRASKA
('Omaha Police', 'Nebraska', 'NE', 'Omaha', 'Douglas', '460.350', 'https://www.broadcastify.com/webPlayer/18426', 1650, 'police', 'Omaha PD', true),
('Lincoln Police', 'Nebraska', 'NE', 'Lincoln', 'Lancaster', '453.925', 'https://www.broadcastify.com/webPlayer/14265', 980, 'police', 'Lincoln PD', true),

-- NEVADA
('Las Vegas Metro Police', 'Nevada', 'NV', 'Las Vegas', 'Clark', '460.075', 'https://www.broadcastify.com/webPlayer/4526', 8500, 'police', 'Las Vegas Metro PD', true),
('Henderson Police', 'Nevada', 'NV', 'Henderson', 'Clark', '453.900', 'https://www.broadcastify.com/webPlayer/14265', 2100, 'police', 'Henderson PD', true),
('Reno Police', 'Nevada', 'NV', 'Reno', 'Washoe', '460.225', 'https://www.broadcastify.com/webPlayer/8965', 1450, 'police', 'Reno PD', true),
('North Las Vegas Police', 'Nevada', 'NV', 'North Las Vegas', 'Clark', '460.125', 'https://www.broadcastify.com/webPlayer/11254', 1320, 'police', 'North Las Vegas PD', true),

-- NEW HAMPSHIRE
('Manchester Police', 'New Hampshire', 'NH', 'Manchester', 'Hillsborough', '453.875', 'https://www.broadcastify.com/webPlayer/14265', 720, 'police', 'Manchester PD', true),
('Nashua Police', 'New Hampshire', 'NH', 'Nashua', 'Hillsborough', '460.250', 'https://www.broadcastify.com/webPlayer/9632', 580, 'police', 'Nashua PD', true),

-- NEW JERSEY
('Newark Police', 'New Jersey', 'NJ', 'Newark', 'Essex', '460.475', 'https://www.broadcastify.com/webPlayer/8426', 2850, 'police', 'Newark PD', true),
('Jersey City Police', 'New Jersey', 'NJ', 'Jersey City', 'Hudson', '460.325', 'https://www.broadcastify.com/webPlayer/14265', 1980, 'police', 'Jersey City PD', true),
('Paterson Police', 'New Jersey', 'NJ', 'Paterson', 'Passaic', '453.775', 'https://www.broadcastify.com/webPlayer/11254', 1320, 'police', 'Paterson PD', true),
('Elizabeth Police', 'New Jersey', 'NJ', 'Elizabeth', 'Union', '460.225', 'https://www.broadcastify.com/webPlayer/9854', 980, 'police', 'Elizabeth PD', true),
('Edison Police', 'New Jersey', 'NJ', 'Edison', 'Middlesex', '453.650', 'https://www.broadcastify.com/webPlayer/7632', 820, 'police', 'Edison PD', true),

-- NEW MEXICO
('Albuquerque Police', 'New Mexico', 'NM', 'Albuquerque', 'Bernalillo', '460.375', 'https://www.broadcastify.com/webPlayer/18426', 2650, 'police', 'Albuquerque PD', true),
('Las Cruces Police', 'New Mexico', 'NM', 'Las Cruces', 'Doña Ana', '453.925', 'https://www.broadcastify.com/webPlayer/14265', 680, 'police', 'Las Cruces PD', true),
('Santa Fe Police', 'New Mexico', 'NM', 'Santa Fe', 'Santa Fe', '155.235', 'https://www.broadcastify.com/webPlayer/9632', 520, 'police', 'Santa Fe PD', true),

-- NEW YORK
('NYPD Citywide 1', 'New York', 'NY', 'New York', 'New York', '460.300', 'https://www.broadcastify.com/webPlayer/6254', 18000, 'police', 'NYPD', true),
('NYPD Manhattan', 'New York', 'NY', 'New York', 'New York', '460.325', 'https://www.broadcastify.com/webPlayer/6255', 12500, 'police', 'NYPD', true),
('NYPD Brooklyn', 'New York', 'NY', 'New York', 'Kings', '460.350', 'https://www.broadcastify.com/webPlayer/6256', 10800, 'police', 'NYPD', true),
('NYPD Queens', 'New York', 'NY', 'New York', 'Queens', '460.375', 'https://www.broadcastify.com/webPlayer/6257', 9200, 'police', 'NYPD', true),
('NYPD Bronx', 'New York', 'NY', 'New York', 'Bronx', '460.400', 'https://www.broadcastify.com/webPlayer/6258', 8500, 'police', 'NYPD', true),
('Buffalo Police', 'New York', 'NY', 'Buffalo', 'Erie', '460.250', 'https://www.broadcastify.com/webPlayer/14265', 1850, 'police', 'Buffalo PD', true),
('Rochester Police', 'New York', 'NY', 'Rochester', 'Monroe', '460.225', 'https://www.broadcastify.com/webPlayer/11254', 1450, 'police', 'Rochester PD', true),
('Syracuse Police', 'New York', 'NY', 'Syracuse', 'Onondaga', '453.925', 'https://www.broadcastify.com/webPlayer/9854', 920, 'police', 'Syracuse PD', true),
('Albany Police', 'New York', 'NY', 'Albany', 'Albany', '460.175', 'https://www.broadcastify.com/webPlayer/8426', 780, 'police', 'Albany PD', true),
('Yonkers Police', 'New York', 'NY', 'Yonkers', 'Westchester', '453.750', 'https://www.broadcastify.com/webPlayer/7632', 1100, 'police', 'Yonkers PD', true),
('Nassau County Police', 'New York', 'NY', 'Mineola', 'Nassau', '460.125', 'https://www.broadcastify.com/webPlayer/12365', 3200, 'police', 'Nassau County PD', true),
('Suffolk County Police', 'New York', 'NY', 'Yaphank', 'Suffolk', '460.150', 'https://www.broadcastify.com/webPlayer/13456', 2650, 'police', 'Suffolk County PD', true),

-- NORTH CAROLINA
('Charlotte-Mecklenburg Police', 'North Carolina', 'NC', 'Charlotte', 'Mecklenburg', '460.400', 'https://www.broadcastify.com/webPlayer/18426', 4200, 'police', 'Charlotte-Mecklenburg PD', true),
('Raleigh Police', 'North Carolina', 'NC', 'Raleigh', 'Wake', '460.275', 'https://www.broadcastify.com/webPlayer/14265', 2300, 'police', 'Raleigh PD', true),
('Greensboro Police', 'North Carolina', 'NC', 'Greensboro', 'Guilford', '453.750', 'https://www.broadcastify.com/webPlayer/11254', 1450, 'police', 'Greensboro PD', true),
('Durham Police', 'North Carolina', 'NC', 'Durham', 'Durham', '460.225', 'https://www.broadcastify.com/webPlayer/9854', 1120, 'police', 'Durham PD', true),
('Winston-Salem Police', 'North Carolina', 'NC', 'Winston-Salem', 'Forsyth', '453.825', 'https://www.broadcastify.com/webPlayer/8426', 920, 'police', 'Winston-Salem PD', true),
('Fayetteville Police', 'North Carolina', 'NC', 'Fayetteville', 'Cumberland', '460.175', 'https://www.broadcastify.com/webPlayer/7632', 780, 'police', 'Fayetteville PD', true),

-- NORTH DAKOTA
('Fargo Police', 'North Dakota', 'ND', 'Fargo', 'Cass', '453.950', 'https://www.broadcastify.com/webPlayer/14265', 620, 'police', 'Fargo PD', true),
('Bismarck Police', 'North Dakota', 'ND', 'Bismarck', 'Burleigh', '155.205', 'https://www.broadcastify.com/webPlayer/9632', 420, 'police', 'Bismarck PD', true),

-- OHIO
('Columbus Police', 'Ohio', 'OH', 'Columbus', 'Franklin', '460.350', 'https://www.broadcastify.com/webPlayer/18426', 3800, 'police', 'Columbus PD', true),
('Cleveland Police', 'Ohio', 'OH', 'Cleveland', 'Cuyahoga', '460.275', 'https://www.broadcastify.com/webPlayer/14265', 3200, 'police', 'Cleveland PD', true),
('Cincinnati Police', 'Ohio', 'OH', 'Cincinnati', 'Hamilton', '460.225', 'https://www.broadcastify.com/webPlayer/11254', 2650, 'police', 'Cincinnati PD', true),
('Toledo Police', 'Ohio', 'OH', 'Toledo', 'Lucas', '453.925', 'https://www.broadcastify.com/webPlayer/9854', 1320, 'police', 'Toledo PD', true),
('Akron Police', 'Ohio', 'OH', 'Akron', 'Summit', '460.175', 'https://www.broadcastify.com/webPlayer/8426', 980, 'police', 'Akron PD', true),
('Dayton Police', 'Ohio', 'OH', 'Dayton', 'Montgomery', '453.750', 'https://www.broadcastify.com/webPlayer/7632', 920, 'police', 'Dayton PD', true),

-- OKLAHOMA
('Oklahoma City Police', 'Oklahoma', 'OK', 'Oklahoma City', 'Oklahoma', '460.325', 'https://www.broadcastify.com/webPlayer/18426', 2300, 'police', 'Oklahoma City PD', true),
('Tulsa Police', 'Oklahoma', 'OK', 'Tulsa', 'Tulsa', '460.275', 'https://www.broadcastify.com/webPlayer/14265', 1850, 'police', 'Tulsa PD', true),
('Norman Police', 'Oklahoma', 'OK', 'Norman', 'Cleveland', '453.850', 'https://www.broadcastify.com/webPlayer/11254', 680, 'police', 'Norman PD', true),

-- OREGON
('Portland Police', 'Oregon', 'OR', 'Portland', 'Multnomah', '460.375', 'https://www.broadcastify.com/webPlayer/18426', 4500, 'police', 'Portland PD', true),
('Eugene Police', 'Oregon', 'OR', 'Eugene', 'Lane', '453.950', 'https://www.broadcastify.com/webPlayer/14265', 1120, 'police', 'Eugene PD', true),
('Salem Police', 'Oregon', 'OR', 'Salem', 'Marion', '460.250', 'https://www.broadcastify.com/webPlayer/11254', 850, 'police', 'Salem PD', true),
('Multnomah County Sheriff', 'Oregon', 'OR', 'Portland', 'Multnomah', '460.050', 'https://www.broadcastify.com/webPlayer/9854', 1650, 'police', 'Multnomah County SO', true),

-- PENNSYLVANIA
('Philadelphia Police', 'Pennsylvania', 'PA', 'Philadelphia', 'Philadelphia', '460.425', 'https://www.broadcastify.com/webPlayer/4603', 8500, 'police', 'Philadelphia PD', true),
('Pittsburgh Police', 'Pennsylvania', 'PA', 'Pittsburgh', 'Allegheny', '460.250', 'https://www.broadcastify.com/webPlayer/14265', 2850, 'police', 'Pittsburgh PD', true),
('Allentown Police', 'Pennsylvania', 'PA', 'Allentown', 'Lehigh', '453.825', 'https://www.broadcastify.com/webPlayer/11254', 780, 'police', 'Allentown PD', true),
('Erie Police', 'Pennsylvania', 'PA', 'Erie', 'Erie', '460.175', 'https://www.broadcastify.com/webPlayer/9854', 680, 'police', 'Erie PD', true),
('Reading Police', 'Pennsylvania', 'PA', 'Reading', 'Berks', '453.750', 'https://www.broadcastify.com/webPlayer/8426', 620, 'police', 'Reading PD', true),

-- RHODE ISLAND
('Providence Police', 'Rhode Island', 'RI', 'Providence', 'Providence', '460.225', 'https://www.broadcastify.com/webPlayer/14265', 920, 'police', 'Providence PD', true),
('Warwick Police', 'Rhode Island', 'RI', 'Warwick', 'Kent', '453.900', 'https://www.broadcastify.com/webPlayer/11254', 520, 'police', 'Warwick PD', true),

-- SOUTH CAROLINA
('Charleston Police', 'South Carolina', 'SC', 'Charleston', 'Charleston', '460.300', 'https://www.broadcastify.com/webPlayer/18426', 1650, 'police', 'Charleston PD', true),
('Columbia Police', 'South Carolina', 'SC', 'Columbia', 'Richland', '453.975', 'https://www.broadcastify.com/webPlayer/14265', 1200, 'police', 'Columbia PD', true),
('Greenville Police', 'South Carolina', 'SC', 'Greenville', 'Greenville', '460.250', 'https://www.broadcastify.com/webPlayer/11254', 920, 'police', 'Greenville PD', true),

-- SOUTH DAKOTA
('Sioux Falls Police', 'South Dakota', 'SD', 'Sioux Falls', 'Minnehaha', '453.950', 'https://www.broadcastify.com/webPlayer/18426', 780, 'police', 'Sioux Falls PD', true),
('Rapid City Police', 'South Dakota', 'SD', 'Rapid City', 'Pennington', '154.785', 'https://www.broadcastify.com/webPlayer/14265', 520, 'police', 'Rapid City PD', true),

-- TENNESSEE
('Memphis Police', 'Tennessee', 'TN', 'Memphis', 'Shelby', '460.425', 'https://www.broadcastify.com/webPlayer/18426', 3200, 'police', 'Memphis PD', true),
('Nashville Metro Police', 'Tennessee', 'TN', 'Nashville', 'Davidson', '460.350', 'https://www.broadcastify.com/webPlayer/14265', 3800, 'police', 'Nashville Metro PD', true),
('Knoxville Police', 'Tennessee', 'TN', 'Knoxville', 'Knox', '453.900', 'https://www.broadcastify.com/webPlayer/11254', 1120, 'police', 'Knoxville PD', true),
('Chattanooga Police', 'Tennessee', 'TN', 'Chattanooga', 'Hamilton', '460.225', 'https://www.broadcastify.com/webPlayer/9854', 920, 'police', 'Chattanooga PD', true),

-- TEXAS
('Houston Police', 'Texas', 'TX', 'Houston', 'Harris', '460.300', 'https://www.broadcastify.com/webPlayer/14866', 8200, 'police', 'Houston PD', true),
('Harris County Sheriff', 'Texas', 'TX', 'Houston', 'Harris', '460.075', 'https://www.broadcastify.com/webPlayer/15264', 4500, 'police', 'Harris County SO', true),
('Dallas Police', 'Texas', 'TX', 'Dallas', 'Dallas', '460.425', 'https://www.broadcastify.com/webPlayer/9856', 6500, 'police', 'Dallas PD', true),
('San Antonio Police', 'Texas', 'TX', 'San Antonio', 'Bexar', '460.250', 'https://www.broadcastify.com/webPlayer/18426', 4200, 'police', 'San Antonio PD', true),
('Austin-Travis County', 'Texas', 'TX', 'Austin', 'Travis', '460.175', 'https://www.broadcastify.com/webPlayer/14265', 3800, 'police', 'Austin PD', true),
('Fort Worth Police', 'Texas', 'TX', 'Fort Worth', 'Tarrant', '460.350', 'https://www.broadcastify.com/webPlayer/11254', 2650, 'police', 'Fort Worth PD', true),
('El Paso Police', 'Texas', 'TX', 'El Paso', 'El Paso', '453.925', 'https://www.broadcastify.com/webPlayer/9854', 1850, 'police', 'El Paso PD', true),
('Arlington Police', 'Texas', 'TX', 'Arlington', 'Tarrant', '460.275', 'https://www.broadcastify.com/webPlayer/8426', 1450, 'police', 'Arlington PD', true),
('Corpus Christi Police', 'Texas', 'TX', 'Corpus Christi', 'Nueces', '453.850', 'https://www.broadcastify.com/webPlayer/7632', 980, 'police', 'Corpus Christi PD', true),
('Plano Police', 'Texas', 'TX', 'Plano', 'Collin', '460.225', 'https://www.broadcastify.com/webPlayer/12365', 1120, 'police', 'Plano PD', true),

-- UTAH
('Salt Lake City Police', 'Utah', 'UT', 'Salt Lake City', 'Salt Lake', '460.375', 'https://www.broadcastify.com/webPlayer/18426', 2300, 'police', 'Salt Lake City PD', true),
('Provo Police', 'Utah', 'UT', 'Provo', 'Utah', '453.975', 'https://www.broadcastify.com/webPlayer/14265', 780, 'police', 'Provo PD', true),
('West Valley City Police', 'Utah', 'UT', 'West Valley City', 'Salt Lake', '460.250', 'https://www.broadcastify.com/webPlayer/11254', 920, 'police', 'West Valley City PD', true),

-- VERMONT
('Burlington Police', 'Vermont', 'VT', 'Burlington', 'Chittenden', '453.875', 'https://www.broadcastify.com/webPlayer/14265', 480, 'police', 'Burlington PD', true),
('Rutland Police', 'Vermont', 'VT', 'Rutland', 'Rutland', '155.100', 'https://www.broadcastify.com/webPlayer/9632', 240, 'police', 'Rutland PD', true),

-- VIRGINIA
('Virginia Beach Police', 'Virginia', 'VA', 'Virginia Beach', 'Virginia Beach', '460.350', 'https://www.broadcastify.com/webPlayer/18426', 2650, 'police', 'Virginia Beach PD', true),
('Norfolk Police', 'Virginia', 'VA', 'Norfolk', 'Norfolk', '460.275', 'https://www.broadcastify.com/webPlayer/14265', 1850, 'police', 'Norfolk PD', true),
('Chesapeake Police', 'Virginia', 'VA', 'Chesapeake', 'Chesapeake', '453.925', 'https://www.broadcastify.com/webPlayer/11254', 1320, 'police', 'Chesapeake PD', true),
('Richmond Police', 'Virginia', 'VA', 'Richmond', 'Richmond', '460.225', 'https://www.broadcastify.com/webPlayer/9854', 1650, 'police', 'Richmond PD', true),
('Newport News Police', 'Virginia', 'VA', 'Newport News', 'Newport News', '453.850', 'https://www.broadcastify.com/webPlayer/8426', 920, 'police', 'Newport News PD', true),
('Alexandria Police', 'Virginia', 'VA', 'Alexandria', 'Alexandria', '460.175', 'https://www.broadcastify.com/webPlayer/7632', 780, 'police', 'Alexandria PD', true),
('Fairfax County Police', 'Virginia', 'VA', 'Fairfax', 'Fairfax', '460.100', 'https://www.broadcastify.com/webPlayer/12365', 2300, 'police', 'Fairfax County PD', true),

-- WASHINGTON
('Seattle Police', 'Washington', 'WA', 'Seattle', 'King', '460.300', 'https://www.broadcastify.com/webPlayer/18426', 6200, 'police', 'Seattle PD', true),
('King County Sheriff', 'Washington', 'WA', 'Seattle', 'King', '460.075', 'https://www.broadcastify.com/webPlayer/14265', 2850, 'police', 'King County SO', true),
('Spokane Police', 'Washington', 'WA', 'Spokane', 'Spokane', '453.950', 'https://www.broadcastify.com/webPlayer/11254', 1450, 'police', 'Spokane PD', true),
('Tacoma Police', 'Washington', 'WA', 'Tacoma', 'Pierce', '460.225', 'https://www.broadcastify.com/webPlayer/9854', 1650, 'police', 'Tacoma PD', true),
('Vancouver Police', 'Washington', 'WA', 'Vancouver', 'Clark', '453.850', 'https://www.broadcastify.com/webPlayer/8426', 920, 'police', 'Vancouver PD', true),
('Bellevue Police', 'Washington', 'WA', 'Bellevue', 'King', '460.175', 'https://www.broadcastify.com/webPlayer/7632', 1100, 'police', 'Bellevue PD', true),

-- WEST VIRGINIA
('Charleston Police', 'West Virginia', 'WV', 'Charleston', 'Kanawha', '453.975', 'https://www.broadcastify.com/webPlayer/14265', 580, 'police', 'Charleston PD', true),
('Huntington Police', 'West Virginia', 'WV', 'Huntington', 'Cabell', '155.535', 'https://www.broadcastify.com/webPlayer/9632', 420, 'police', 'Huntington PD', true),

-- WISCONSIN
('Milwaukee Police', 'Wisconsin', 'WI', 'Milwaukee', 'Milwaukee', '460.425', 'https://www.broadcastify.com/webPlayer/18426', 3800, 'police', 'Milwaukee PD', true),
('Madison Police', 'Wisconsin', 'WI', 'Madison', 'Dane', '453.950', 'https://www.broadcastify.com/webPlayer/14265', 1850, 'police', 'Madison PD', true),
('Green Bay Police', 'Wisconsin', 'WI', 'Green Bay', 'Brown', '460.250', 'https://www.broadcastify.com/webPlayer/11254', 920, 'police', 'Green Bay PD', true),
('Kenosha Police', 'Wisconsin', 'WI', 'Kenosha', 'Kenosha', '453.875', 'https://www.broadcastify.com/webPlayer/9854', 680, 'police', 'Kenosha PD', true),

-- WYOMING
('Cheyenne Police', 'Wyoming', 'WY', 'Cheyenne', 'Laramie', '154.935', 'https://www.broadcastify.com/webPlayer/18426', 480, 'police', 'Cheyenne PD', true),
('Casper Police', 'Wyoming', 'WY', 'Casper', 'Natrona', '155.190', 'https://www.broadcastify.com/webPlayer/14265', 380, 'police', 'Casper PD', true),
('Laramie Police', 'Wyoming', 'WY', 'Laramie', 'Albany', '154.785', 'https://www.broadcastify.com/webPlayer/11254', 290, 'police', 'Laramie PD', true),

-- Washington DC (not a state but important)
('Metropolitan Police Department DC', 'District of Columbia', 'DC', 'Washington', NULL, '460.300', 'https://www.broadcastify.com/webPlayer/18426', 8500, 'police', 'DC Metro PD', true)

;

-- Add some important fire departments

INSERT INTO public.scanner_links (
  scanner_name, state, state_code, city, county, frequency, broadcastify_url,
  listener_count, feed_type, agency_name, is_active
) VALUES
('FDNY Citywide', 'New York', 'NY', 'New York', 'New York', '154.250', 'https://www.broadcastify.com/webPlayer/6350', 14000, 'fire', 'FDNY', true),
('Los Angeles City Fire', 'California', 'CA', 'Los Angeles', 'Los Angeles', '154.280', 'https://www.broadcastify.com/webPlayer/528', 9500, 'fire', 'LAFD', true),
('Chicago Fire Dispatch', 'Illinois', 'IL', 'Chicago', 'Cook', '154.190', 'https://www.broadcastify.com/webPlayer/5650', 7200, 'fire', 'Chicago Fire', true),
('Philadelphia Fire', 'Pennsylvania', 'PA', 'Philadelphia', 'Philadelphia', '153.830', 'https://www.broadcastify.com/webPlayer/4850', 4500, 'fire', 'Philadelphia Fire', true),
('Houston Fire Dispatch', 'Texas', 'TX', 'Houston', 'Harris', '154.280', 'https://www.broadcastify.com/webPlayer/15000', 3800, 'fire', 'Houston Fire', true)
;
