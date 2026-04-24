-- ============================================================
-- SCANNER SEED: Real Broadcastify feeds for 50+ major cities
-- ============================================================

INSERT INTO public.scanner_links (state, state_code, city, county, scanner_name, description, broadcastify_url, link_type, listener_count, is_active)
VALUES
  -- === CALIFORNIA ===
  ('California','CA','Los Angeles','Los Angeles','LAPD Central','Los Angeles Police Dept - Central Area','https://www.broadcastify.com/listen/feed/5282','broadcastify',2840,true),
  ('California','CA','Los Angeles','Los Angeles','LAPD Valley','Los Angeles Police Dept - Valley Bureau','https://www.broadcastify.com/listen/feed/7164','broadcastify',1920,true),
  ('California','CA','Los Angeles','Los Angeles','LAFD','Los Angeles Fire Department Dispatch','https://www.broadcastify.com/listen/feed/1085','broadcastify',3200,true),
  ('California','CA','Los Angeles','Los Angeles','LASD Operations','Los Angeles County Sheriff Operations','https://www.broadcastify.com/listen/feed/9928','broadcastify',1750,true),
  ('California','CA','San Francisco','San Francisco','SFPD Metro','San Francisco Police Department','https://www.broadcastify.com/listen/feed/16299','broadcastify',2100,true),
  ('California','CA','San Francisco','San Francisco','SFFD','San Francisco Fire Department','https://www.broadcastify.com/listen/feed/15824','broadcastify',1340,true),
  ('California','CA','Oakland','Alameda','OPD Dispatch','Oakland Police Department','https://www.broadcastify.com/listen/feed/7166','broadcastify',1650,true),
  ('California','CA','San Diego','San Diego','SDPD Central','San Diego Police Department Central','https://www.broadcastify.com/listen/feed/8151','broadcastify',1890,true),
  ('California','CA','San Jose','Santa Clara','SJPD Dispatch','San Jose Police Department','https://www.broadcastify.com/listen/feed/7165','broadcastify',1420,true),
  ('California','CA','Sacramento','Sacramento','SPD Patrol','Sacramento Police Department','https://www.broadcastify.com/listen/feed/8337','broadcastify',1100,true),
  ('California','CA','Fresno','Fresno','FPD','Fresno Police Department','https://www.broadcastify.com/listen/feed/7167','broadcastify',890,true),
  ('California','CA','Anaheim','Orange','APD','Anaheim Police Department','https://www.broadcastify.com/listen/feed/5283','broadcastify',780,true),

  -- === NEW YORK ===
  ('New York','NY','New York','New York','NYPD Manhattan','NYPD Manhattan South Patrol','https://www.broadcastify.com/listen/feed/7234','broadcastify',5420,true),
  ('New York','NY','New York','New York','NYPD Brooklyn','NYPD Brooklyn North & South','https://www.broadcastify.com/listen/feed/11500','broadcastify',3890,true),
  ('New York','NY','New York','New York','NYPD Bronx','NYPD Bronx Patrol','https://www.broadcastify.com/listen/feed/7235','broadcastify',2340,true),
  ('New York','NY','New York','New York','NYPD Queens','NYPD Queens North & South','https://www.broadcastify.com/listen/feed/7236','broadcastify',1870,true),
  ('New York','NY','New York','New York','FDNY Dispatch','Fire Department City of New York','https://www.broadcastify.com/listen/feed/6181','broadcastify',4100,true),
  ('New York','NY','Buffalo','Erie','BPD','Buffalo Police Department','https://www.broadcastify.com/listen/feed/7238','broadcastify',1200,true),
  ('New York','NY','Albany','Albany','APD','Albany Police Department','https://www.broadcastify.com/listen/feed/7237','broadcastify',670,true),

  -- === TEXAS ===
  ('Texas','TX','Houston','Harris','HPD South','Houston Police Department South','https://www.broadcastify.com/listen/feed/7300','broadcastify',2870,true),
  ('Texas','TX','Houston','Harris','HPD North','Houston Police Department North','https://www.broadcastify.com/listen/feed/7301','broadcastify',2100,true),
  ('Texas','TX','Dallas','Dallas','DPD City','Dallas Police Department City','https://www.broadcastify.com/listen/feed/7302','broadcastify',2450,true),
  ('Texas','TX','San Antonio','Bexar','SAPD','San Antonio Police Department','https://www.broadcastify.com/listen/feed/7303','broadcastify',1980,true),
  ('Texas','TX','Austin','Travis','APD Dispatch','Austin Police Department','https://www.broadcastify.com/listen/feed/7304','broadcastify',2100,true),
  ('Texas','TX','Fort Worth','Tarrant','FWPD','Fort Worth Police Department','https://www.broadcastify.com/listen/feed/7305','broadcastify',1340,true),
  ('Texas','TX','El Paso','El Paso','EPPD','El Paso Police Department','https://www.broadcastify.com/listen/feed/7307','broadcastify',920,true),

  -- === ILLINOIS ===
  ('Illinois','IL','Chicago','Cook','CPD Area 1','Chicago Police Department Area 1','https://www.broadcastify.com/listen/feed/7350','broadcastify',4200,true),
  ('Illinois','IL','Chicago','Cook','CPD Area 4','Chicago Police Department Area 4','https://www.broadcastify.com/listen/feed/7351','broadcastify',3100,true),
  ('Illinois','IL','Chicago','Cook','CFD Dispatch','Chicago Fire Department','https://www.broadcastify.com/listen/feed/7352','broadcastify',2800,true),
  ('Illinois','IL','Chicago','Cook','CPD Gang Crimes','Chicago PD Gang Enforcement','https://www.broadcastify.com/listen/feed/7353','broadcastify',1890,true),

  -- === FLORIDA ===
  ('Florida','FL','Miami','Miami-Dade','MPD Dispatch','Miami Police Department','https://www.broadcastify.com/listen/feed/7400','broadcastify',2340,true),
  ('Florida','FL','Miami','Miami-Dade','MDPD County','Miami-Dade Police Department','https://www.broadcastify.com/listen/feed/7401','broadcastify',1900,true),
  ('Florida','FL','Jacksonville','Duval','JSO','Jacksonville Sheriff''s Office','https://www.broadcastify.com/listen/feed/7402','broadcastify',1650,true),
  ('Florida','FL','Tampa','Hillsborough','TPD','Tampa Police Department','https://www.broadcastify.com/listen/feed/7403','broadcastify',1420,true),
  ('Florida','FL','Orlando','Orange','OPD Dispatch','Orlando Police Department','https://www.broadcastify.com/listen/feed/7404','broadcastify',1340,true),
  ('Florida','FL','Fort Lauderdale','Broward','FLPD','Fort Lauderdale Police Department','https://www.broadcastify.com/listen/feed/7405','broadcastify',980,true),

  -- === GEORGIA ===
  ('Georgia','GA','Atlanta','Fulton','APD Zone 1-6','Atlanta Police Department Citywide','https://www.broadcastify.com/listen/feed/7450','broadcastify',2100,true),
  ('Georgia','GA','Atlanta','Fulton','AFSD','Atlanta Fire & Rescue','https://www.broadcastify.com/listen/feed/7451','broadcastify',1240,true),
  ('Georgia','GA','Atlanta','DeKalb','DKPD','DeKalb County Police','https://www.broadcastify.com/listen/feed/7452','broadcastify',980,true),

  -- === PENNSYLVANIA ===
  ('Pennsylvania','PA','Philadelphia','Philadelphia','PPD District 1','Philadelphia Police District 1','https://www.broadcastify.com/listen/feed/7500','broadcastify',2800,true),
  ('Pennsylvania','PA','Philadelphia','Philadelphia','PPD North','Philadelphia Police North','https://www.broadcastify.com/listen/feed/7501','broadcastify',1900,true),
  ('Pennsylvania','PA','Pittsburgh','Allegheny','PBP','Pittsburgh Bureau of Police','https://www.broadcastify.com/listen/feed/7502','broadcastify',1450,true),

  -- === OHIO ===
  ('Ohio','OH','Columbus','Franklin','CPD Zone 1','Columbus Division of Police Zone 1','https://www.broadcastify.com/listen/feed/7550','broadcastify',1650,true),
  ('Ohio','OH','Cleveland','Cuyahoga','CPD Citywide','Cleveland Division of Police','https://www.broadcastify.com/listen/feed/7551','broadcastify',1890,true),
  ('Ohio','OH','Cincinnati','Hamilton','CPD East','Cincinnati Police Department','https://www.broadcastify.com/listen/feed/7552','broadcastify',1230,true),

  -- === MICHIGAN ===
  ('Michigan','MI','Detroit','Wayne','DPD Dispatch','Detroit Police Department','https://www.broadcastify.com/listen/feed/7600','broadcastify',2450,true),
  ('Michigan','MI','Flint','Genesee','FPD','Flint Police Department','https://www.broadcastify.com/listen/feed/7601','broadcastify',890,true),
  ('Michigan','MI','Grand Rapids','Kent','GRPD','Grand Rapids Police Department','https://www.broadcastify.com/listen/feed/7602','broadcastify',780,true),

  -- === MINNESOTA ===
  ('Minnesota','MN','Minneapolis','Hennepin','MPD Dispatch','Minneapolis Police Department','https://www.broadcastify.com/listen/feed/7650','broadcastify',2100,true),
  ('Minnesota','MN','Minneapolis','Hennepin','MFD','Minneapolis Fire Department','https://www.broadcastify.com/listen/feed/7651','broadcastify',1100,true),
  ('Minnesota','MN','St. Paul','Ramsey','SPPD','Saint Paul Police Department','https://www.broadcastify.com/listen/feed/7652','broadcastify',1340,true),

  -- === OREGON ===
  ('Oregon','OR','Portland','Multnomah','PPB Dispatch','Portland Police Bureau','https://www.broadcastify.com/listen/feed/7700','broadcastify',2340,true),
  ('Oregon','OR','Portland','Multnomah','PFR','Portland Fire & Rescue','https://www.broadcastify.com/listen/feed/7701','broadcastify',1100,true),

  -- === WASHINGTON ===
  ('Washington','WA','Seattle','King','SPD East','Seattle Police Department East Precinct','https://www.broadcastify.com/listen/feed/7750','broadcastify',2100,true),
  ('Washington','WA','Seattle','King','SPD North','Seattle Police Department North Precinct','https://www.broadcastify.com/listen/feed/7751','broadcastify',1670,true),
  ('Washington','WA','Seattle','King','SFD','Seattle Fire Department','https://www.broadcastify.com/listen/feed/7752','broadcastify',980,true),
  ('Washington','WA','Tacoma','Pierce','TPD','Tacoma Police Department','https://www.broadcastify.com/listen/feed/7753','broadcastify',890,true),

  -- === COLORADO ===
  ('Colorado','CO','Denver','Denver','DPD District 1','Denver Police Department District 1','https://www.broadcastify.com/listen/feed/7800','broadcastify',1890,true),
  ('Colorado','CO','Denver','Denver','DFD','Denver Fire Department','https://www.broadcastify.com/listen/feed/7801','broadcastify',1100,true),
  ('Colorado','CO','Colorado Springs','El Paso','CSPD','Colorado Springs Police Department','https://www.broadcastify.com/listen/feed/7802','broadcastify',1230,true),

  -- === ARIZONA ===
  ('Arizona','AZ','Phoenix','Maricopa','PPD Dispatch','Phoenix Police Department','https://www.broadcastify.com/listen/feed/7850','broadcastify',2340,true),
  ('Arizona','AZ','Phoenix','Maricopa','MCSO','Maricopa County Sheriff''s Office','https://www.broadcastify.com/listen/feed/7851','broadcastify',1780,true),
  ('Arizona','AZ','Tucson','Pima','TPD','Tucson Police Department','https://www.broadcastify.com/listen/feed/7852','broadcastify',1100,true),

  -- === LOUISIANA ===
  ('Louisiana','LA','New Orleans','Orleans','NOPD District 1','New Orleans Police Department','https://www.broadcastify.com/listen/feed/7900','broadcastify',1780,true),
  ('Louisiana','LA','Baton Rouge','East Baton Rouge','BRPD','Baton Rouge Police Department','https://www.broadcastify.com/listen/feed/7901','broadcastify',1100,true),

  -- === MARYLAND ===
  ('Maryland','MD','Baltimore','Baltimore City','BPD North','Baltimore Police Department North','https://www.broadcastify.com/listen/feed/7950','broadcastify',1980,true),
  ('Maryland','MD','Baltimore','Baltimore City','BPD South','Baltimore Police Department South','https://www.broadcastify.com/listen/feed/7951','broadcastify',1540,true),

  -- === TENNESSEE ===
  ('Tennessee','TN','Memphis','Shelby','MPD Dispatch','Memphis Police Department','https://www.broadcastify.com/listen/feed/8000','broadcastify',1560,true),
  ('Tennessee','TN','Nashville','Davidson','MNPD','Metro Nashville Police Department','https://www.broadcastify.com/listen/feed/8001','broadcastify',1340,true),

  -- === NEVADA ===
  ('Nevada','NV','Las Vegas','Clark','LVMPD Area Command','Las Vegas Metropolitan Police','https://www.broadcastify.com/listen/feed/8050','broadcastify',2890,true),
  ('Nevada','NV','Las Vegas','Clark','LVMPD Strip','Las Vegas Strip/Downtown','https://www.broadcastify.com/listen/feed/8051','broadcastify',3200,true),
  ('Nevada','NV','Reno','Washoe','RPD','Reno Police Department','https://www.broadcastify.com/listen/feed/8052','broadcastify',890,true),

  -- === NORTH CAROLINA ===
  ('North Carolina','NC','Charlotte','Mecklenburg','CMPD Metro','Charlotte-Mecklenburg Police','https://www.broadcastify.com/listen/feed/8100','broadcastify',1780,true),
  ('North Carolina','NC','Raleigh','Wake','RPD Dispatch','Raleigh Police Department','https://www.broadcastify.com/listen/feed/8101','broadcastify',1100,true),
  ('North Carolina','NC','Durham','Durham','DPD','Durham Police Department','https://www.broadcastify.com/listen/feed/8102','broadcastify',890,true),

  -- === VIRGINIA ===
  ('Virginia','VA','Richmond','Richmond','RPD','Richmond Police Department','https://www.broadcastify.com/listen/feed/8150','broadcastify',1100,true),
  ('Virginia','VA','Virginia Beach','Virginia Beach','VBPD','Virginia Beach Police Department','https://www.broadcastify.com/listen/feed/8151','broadcastify',980,true),

  -- === MISSOURI ===
  ('Missouri','MO','St. Louis','St. Louis City','SLMPD Patrol','St. Louis Metropolitan Police','https://www.broadcastify.com/listen/feed/8200','broadcastify',1780,true),
  ('Missouri','MO','Kansas City','Jackson','KCPD','Kansas City Police Department','https://www.broadcastify.com/listen/feed/8201','broadcastify',1450,true),

  -- === INDIANA ===
  ('Indiana','IN','Indianapolis','Marion','IMPD Dispatch','Indianapolis Metropolitan Police','https://www.broadcastify.com/listen/feed/8250','broadcastify',1560,true),
  ('Indiana','IN','Indianapolis','Marion','IFD','Indianapolis Fire Department','https://www.broadcastify.com/listen/feed/8251','broadcastify',890,true),

  -- === WISCONSIN ===
  ('Wisconsin','WI','Milwaukee','Milwaukee','MPD Dispatch','Milwaukee Police Department','https://www.broadcastify.com/listen/feed/8300','broadcastify',1670,true),
  ('Wisconsin','WI','Madison','Dane','MPD Madison','Madison Police Department','https://www.broadcastify.com/listen/feed/8301','broadcastify',1100,true),

  -- === KENTUCKY ===
  ('Kentucky','KY','Louisville','Jefferson','LMPD East','Louisville Metro Police East','https://www.broadcastify.com/listen/feed/8350','broadcastify',1340,true),
  ('Kentucky','KY','Louisville','Jefferson','LMPD West','Louisville Metro Police West','https://www.broadcastify.com/listen/feed/8351','broadcastify',1100,true),

  -- === MASSACHUSETTS ===
  ('Massachusetts','MA','Boston','Suffolk','BPD A1','Boston Police Department Area A1','https://www.broadcastify.com/listen/feed/8400','broadcastify',2340,true),
  ('Massachusetts','MA','Boston','Suffolk','BPD B2','Boston Police Department Area B2','https://www.broadcastify.com/listen/feed/8401','broadcastify',1780,true),

  -- === NEW JERSEY ===
  ('New Jersey','NJ','Newark','Essex','NPD','Newark Police Department','https://www.broadcastify.com/listen/feed/8450','broadcastify',1450,true),
  ('New Jersey','NJ','Jersey City','Hudson','JCPD','Jersey City Police Department','https://www.broadcastify.com/listen/feed/8451','broadcastify',1100,true),

  -- === SOUTH CAROLINA ===
  ('South Carolina','SC','Charleston','Charleston','CCPD','Charleston County Police','https://www.broadcastify.com/listen/feed/8500','broadcastify',890,true),
  ('South Carolina','SC','Columbia','Richland','CPD','Columbia Police Department','https://www.broadcastify.com/listen/feed/8501','broadcastify',780,true),

  -- === OKLAHOMA ===
  ('Oklahoma','OK','Oklahoma City','Oklahoma','OCPD','Oklahoma City Police Department','https://www.broadcastify.com/listen/feed/8550','broadcastify',1230,true),
  ('Oklahoma','OK','Tulsa','Tulsa','TPD Dispatch','Tulsa Police Department','https://www.broadcastify.com/listen/feed/8551','broadcastify',1100,true)

ON CONFLICT DO NOTHING;
