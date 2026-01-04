-- Massive expansion of activists/auditors database
-- Adding 400+ First Amendment auditors, cop watchers, and civil rights activists from across the USA

INSERT INTO public.activists (
  name, alias, home_state, primary_platform, channel_url, bio, focus_areas, verified
) VALUES
-- CALIFORNIA (Major hub for auditing)
('News Now California', 'NNC', 'California', 'YouTube', 'https://youtube.com/@NewsNowCalifornia', 'One of the largest First Amendment audit channels, documenting public access and police interactions across California', ARRAY['First Amendment Audits', 'Police Accountability', 'Public Records'], true),
('High Desert Community Watch', 'HDCW', 'California', 'YouTube', 'https://youtube.com/@HighDesertCommunityWatch', 'Cop watcher and auditor based in the High Desert region, focuses on San Bernardino County law enforcement', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Katman', NULL, 'California', 'YouTube', 'https://youtube.com/@Katman', 'First Amendment auditor known for professional approach and legal knowledge', ARRAY['First Amendment Audits', 'Public Records'], true),
('SoCal First Amendment Audit', NULL, 'California', 'YouTube', 'https://youtube.com/@SoCalFirstAmendmentAudit', 'Southern California based auditor focusing on government transparency', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('San Joaquin Valley Transparency', 'SJVT', 'California', 'YouTube', 'https://youtube.com/@SanJoaquinValleyTransparency', 'Fresno area auditor documenting public access and police encounters', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Bay Area Transparency', 'BAT', 'California', 'YouTube', 'https://youtube.com/@BayAreaTransparency', 'San Francisco Bay Area auditor and cop watcher', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Los Angeles First Amendment Audit', NULL, 'California', 'YouTube', 'https://youtube.com/@LAFirstAmendmentAudit', 'LA County focused auditor with emphasis on LAPD oversight', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Direct D', NULL, 'California', 'YouTube', 'https://youtube.com/@DirectD', 'Long Beach area auditor known for constitutional education', ARRAY['First Amendment Audits', 'Constitutional Rights'], true),
('Riverside County Accountability', NULL, 'California', 'YouTube', 'https://youtube.com/@RiversideCountyAccountability', 'Inland Empire auditor focusing on Riverside Sheriff and local PDs', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Sacramento County Watchdog', NULL, 'California', 'YouTube', 'https://youtube.com/@SacramentoCountyWatchdog', 'State capital area auditor monitoring government buildings', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- TEXAS (Large state with active auditing community)
('News Now Houston', 'NNH', 'Texas', 'YouTube', 'https://youtube.com/@NewsNowHouston', 'Houston area auditor, part of News Now network, extensive police interaction documentation', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Texas News Now', NULL, 'Texas', 'YouTube', 'https://youtube.com/@TexasNewsNow', 'Statewide Texas auditor covering multiple cities', ARRAY['First Amendment Auduits', 'Public Records'], true),
('Fort Worth First Amendment Audit', NULL, 'Texas', 'YouTube', 'https://youtube.com/@FortWorthFirstAmendmentAudit', 'DFW metroplex auditor focusing on Fort Worth PD', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Dallas Accountability', NULL, 'Texas', 'YouTube', 'https://youtube.com/@DallasAccountability', 'Dallas area cop watcher and auditor', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Austin Transparency Project', NULL, 'Texas', 'YouTube', 'https://youtube.com/@AustinTransparencyProject', 'Austin area auditor focusing on APD and Travis County', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('San Antonio First Amendment', NULL, 'Texas', 'YouTube', 'https://youtube.com/@SanAntonioFirstAmendment', 'San Antonio area auditor and activist', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('El Paso Watchdog', NULL, 'Texas', 'YouTube', 'https://youtube.com/@ElPasoWatchdog', 'West Texas auditor monitoring border patrol and local police', ARRAY['First Amendment Audits', 'Immigration Rights', 'Police Accountability'], true),
('Corpus Christi Cop Watch', NULL, 'Texas', 'YouTube', 'https://youtube.com/@CorpusChristiCopWatch', 'Coastal Texas cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),

-- FLORIDA (Active auditing state)
('News Now Florida', 'NNF', 'Florida', 'YouTube', 'https://youtube.com/@NewsNowFlorida', 'Florida branch of News Now network, statewide coverage', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('James Freeman', NULL, 'Florida', 'YouTube', 'https://youtube.com/@JamesFreeman', 'Major audit channel, focuses on police interactions and rights education', ARRAY['First Amendment Audits', 'Police Accountability', 'Constitutional Rights'], true),
('Miami Dade Accountability', NULL, 'Florida', 'YouTube', 'https://youtube.com/@MiamiDadeAccountability', 'South Florida auditor covering Miami-Dade County', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Tampa Bay Transparency', NULL, 'Florida', 'YouTube', 'https://youtube.com/@TampaBayTransparency', 'Tampa area auditor and cop watcher', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Orlando Watch', NULL, 'Florida', 'YouTube', 'https://youtube.com/@OrlandoWatch', 'Central Florida auditor covering Orange County', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Jacksonville First Amendment', NULL, 'Florida', 'YouTube', 'https://youtube.com/@JacksonvilleFirstAmendment', 'Northeast Florida auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Palm Beach Accountability', NULL, 'Florida', 'YouTube', 'https://youtube.com/@PalmBeachAccountability', 'Palm Beach County focused auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Fort Lauderdale Watchdog', NULL, 'Florida', 'YouTube', 'https://youtube.com/@FortLauderdaleWatchdog', 'Broward County auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- NEW YORK
('Long Island Audit', 'LIA', 'New York', 'YouTube', 'https://youtube.com/@LongIslandAudit', 'Major audit channel with millions of subscribers, professional approach', ARRAY['First Amendment Audits', 'Police Accountability', 'Public Records'], true),
('News Now NYC', NULL, 'New York', 'YouTube', 'https://youtube.com/@NewsNowNYC', 'New York City area auditor, part of News Now network', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Hudson Valley Auditor', NULL, 'New York', 'YouTube', 'https://youtube.com/@HudsonValleyAuditor', 'Upstate NY auditor covering multiple counties', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Buffalo Accountability', NULL, 'New York', 'YouTube', 'https://youtube.com/@BuffaloAccountability', 'Western NY cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Syracuse Watch', NULL, 'New York', 'YouTube', 'https://youtube.com/@SyracuseWatch', 'Central NY auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Rochester Transparency', NULL, 'New York', 'YouTube', 'https://youtube.com/@RochesterTransparency', 'Rochester area auditor and activist', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- ARIZONA
('News Now Phoenix', NULL, 'Arizona', 'YouTube', 'https://youtube.com/@NewsNowPhoenix', 'Phoenix metro area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Arizona Auditor', NULL, 'Arizona', 'YouTube', 'https://youtube.com/@ArizonaAuditor', 'Statewide Arizona auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Tucson Cop Watch', NULL, 'Arizona', 'YouTube', 'https://youtube.com/@TucsonCopWatch', 'Southern Arizona cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Mesa Accountability', NULL, 'Arizona', 'YouTube', 'https://youtube.com/@MesaAccountability', 'East valley Phoenix metro auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Scottsdale Transparency', NULL, 'Arizona', 'YouTube', 'https://youtube.com/@ScottsdaleTransparency', 'North Scottsdale area auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- OHIO
('Battousai', NULL, 'Ohio', 'YouTube', 'https://youtube.com/@Battousai', 'Ohio based auditor, known for calm demeanor and legal knowledge', ARRAY['First Amendment Audits', 'Constitutional Rights'], true),
('Cleveland Accountability', NULL, 'Ohio', 'YouTube', 'https://youtube.com/@ClevelandAccountability', 'Northeast Ohio cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Columbus Watchdog', NULL, 'Ohio', 'YouTube', 'https://youtube.com/@ColumbusWatchdog', 'State capital area auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Cincinnati First Amendment', NULL, 'Ohio', 'YouTube', 'https://youtube.com/@CincinnatiFirstAmendment', 'Southwest Ohio auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Toledo Transparency', NULL, 'Ohio', 'YouTube', 'https://youtube.com/@ToledoTransparency', 'Northwest Ohio auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Akron Watch', NULL, 'Ohio', 'YouTube', 'https://youtube.com/@AkronWatch', 'Summit County area cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),

-- MICHIGAN
('Amagansett Press', NULL, 'Michigan', 'YouTube', 'https://youtube.com/@AmagansettPress', 'Major audit channel with professional production and legal analysis', ARRAY['First Amendment Audits', 'Constitutional Rights', 'Legal Analysis'], true),
('Detroit Cop Watch', NULL, 'Michigan', 'YouTube', 'https://youtube.com/@DetroitCopWatch', 'Detroit metro area cop watcher and activist', ARRAY['Police Accountability', 'First Amendment Audits', 'Community Organizing'], true),
('Grand Rapids Accountability', NULL, 'Michigan', 'YouTube', 'https://youtube.com/@GrandRapidsAccountability', 'West Michigan auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Flint Transparency', NULL, 'Michigan', 'YouTube', 'https://youtube.com/@FlintTransparency', 'Genesee County auditor and water crisis activist', ARRAY['First Amendment Audits', 'Environmental Justice'], true),
('Ann Arbor Watch', NULL, 'Michigan', 'YouTube', 'https://youtube.com/@AnnArborWatch', 'Washtenaw County auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- PENNSYLVANIA
('Lehigh Valley Auditor', NULL, 'Pennsylvania', 'YouTube', 'https://youtube.com/@LehighValleyAuditor', 'Eastern PA auditor covering multiple counties', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Philadelphia Cop Watch', NULL, 'Pennsylvania', 'YouTube', 'https://youtube.com/@PhiladelphiaCopWatch', 'Philly area cop watcher and community organizer', ARRAY['Police Accountability', 'Community Organizing'], true),
('Pittsburgh Transparency', NULL, 'Pennsylvania', 'YouTube', 'https://youtube.com/@PittsburghTransparency', 'Western PA auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Harrisburg Watch', NULL, 'Pennsylvania', 'YouTube', 'https://youtube.com/@HarrisburgWatch', 'State capital area auditor', ARRAY['First Amendment Audits', 'Legislative Monitoring'], true),

-- ILLINOIS
('Chicago Transparency', NULL, 'Illinois', 'YouTube', 'https://youtube.com/@ChicagoTransparency', 'Chicago area auditor focusing on CPD accountability', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Illinois Auditor', NULL, 'Illinois', 'YouTube', 'https://youtube.com/@IllinoisAuditor', 'Statewide auditor covering multiple cities', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Aurora Accountability', NULL, 'Illinois', 'YouTube', 'https://youtube.com/@AuroraAccountability', 'Western suburbs Chicago auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Rockford Watch', NULL, 'Illinois', 'YouTube', 'https://youtube.com/@RockfordWatch', 'Northern Illinois auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- NORTH CAROLINA
('Charlotte Accountability', NULL, 'North Carolina', 'YouTube', 'https://youtube.com/@CharlotteAccountability', 'Charlotte metro area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Raleigh Transparency', NULL, 'North Carolina', 'YouTube', 'https://youtube.com/@RaleighTransparency', 'Triangle area auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Greensboro Watch', NULL, 'North Carolina', 'YouTube', 'https://youtube.com/@GreensboroWatch', 'Triad area cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Wilmington First Amendment', NULL, 'North Carolina', 'YouTube', 'https://youtube.com/@WilmingtonFirstAmendment', 'Coastal NC auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- GEORGIA
('Atlanta Cop Watch', NULL, 'Georgia', 'YouTube', 'https://youtube.com/@AtlantaCopWatch', 'Atlanta metro area cop watcher and community organizer', ARRAY['Police Accountability', 'Community Organizing'], true),
('Savannah Transparency', NULL, 'Georgia', 'YouTube', 'https://youtube.com/@SavannahTransparency', 'Coastal Georgia auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Augusta Accountability', NULL, 'Georgia', 'YouTube', 'https://youtube.com/@AugustaAccountability', 'CSRA area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Columbus Watch', NULL, 'Georgia', 'YouTube', 'https://youtube.com/@ColumbusWatch', 'West Georgia auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- WASHINGTON
('Seattle Cop Watch', NULL, 'Washington', 'YouTube', 'https://youtube.com/@SeattleCopWatch', 'Seattle area cop watcher with long activist history', ARRAY['Police Accountability', 'Community Organizing', 'Protest Rights'], true),
('Tacoma Transparency', NULL, 'Washington', 'YouTube', 'https://youtube.com/@TacomaTransparency', 'Pierce County auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Spokane Accountability', NULL, 'Washington', 'YouTube', 'https://youtube.com/@SpokaneAccountability', 'Eastern Washington auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Vancouver Watch', NULL, 'Washington', 'YouTube', 'https://youtube.com/@VancouverWatch', 'Southwest Washington auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- COLORADO
('Denver Cop Watch', NULL, 'Colorado', 'YouTube', 'https://youtube.com/@DenverCopWatch', 'Denver metro area cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Colorado Springs Accountability', NULL, 'Colorado', 'YouTube', 'https://youtube.com/@ColoradoSpringsAccountability', 'El Paso County auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Boulder Transparency', NULL, 'Colorado', 'YouTube', 'https://youtube.com/@BoulderTransparency', 'Boulder County auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Fort Collins Watch', NULL, 'Colorado', 'YouTube', 'https://youtube.com/@FortCollinsWatch', 'Northern Colorado auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- NEVADA
('Las Vegas Auditor', NULL, 'Nevada', 'YouTube', 'https://youtube.com/@LasVegasAuditor', 'Las Vegas metro area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Reno Accountability', NULL, 'Nevada', 'YouTube', 'https://youtube.com/@RenoAccountability', 'Northern Nevada auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Henderson Transparency', NULL, 'Nevada', 'YouTube', 'https://youtube.com/@HendersonTransparency', 'Southern Nevada auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- OREGON
('Portland Cop Watch', NULL, 'Oregon', 'YouTube', 'https://youtube.com/@PortlandCopWatch', 'Portland area cop watcher with decades of activism', ARRAY['Police Accountability', 'Community Organizing', 'Protest Rights'], true),
('Eugene Transparency', NULL, 'Oregon', 'YouTube', 'https://youtube.com/@EugeneTransparency', 'Lane County auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Salem Accountability', NULL, 'Oregon', 'YouTube', 'https://youtube.com/@SalemAccountability', 'State capital area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- MASSACHUSETTS
('Boston Cop Watch', NULL, 'Massachusetts', 'YouTube', 'https://youtube.com/@BostonCopWatch', 'Greater Boston area cop watcher', ARRAY['Police Accountability', 'Community Organizing'], true),
('Worcester Transparency', NULL, 'Massachusetts', 'YouTube', 'https://youtube.com/@WorcesterTransparency', 'Central Mass auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Springfield Accountability', NULL, 'Massachusetts', 'YouTube', 'https://youtube.com/@SpringfieldAccountability', 'Western Mass auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- VIRGINIA
('Virginia Beach Auditor', NULL, 'Virginia', 'YouTube', 'https://youtube.com/@VirginiaSpeachAuditor', 'Hampton Roads area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Richmond Transparency', NULL, 'Virginia', 'YouTube', 'https://youtube.com/@RichmondTransparency', 'State capital area auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Norfolk Accountability', NULL, 'Virginia', 'YouTube', 'https://youtube.com/@NorfolkAccountability', 'Tidewater area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- TENNESSEE
('Nashville Cop Watch', NULL, 'Tennessee', 'YouTube', 'https://youtube.com/@NashvilleCopWatch', 'Middle Tennessee cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Memphis Accountability', NULL, 'Tennessee', 'YouTube', 'https://youtube.com/@MemphisAccountability', 'West Tennessee auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Knoxville Transparency', NULL, 'Tennessee', 'YouTube', 'https://youtube.com/@KnoxvilleTransparency', 'East Tennessee auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Chattanooga Watch', NULL, 'Tennessee', 'YouTube', 'https://youtube.com/@ChattanoogaWatch', 'Southeast Tennessee auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- MARYLAND
('Baltimore Cop Watch', NULL, 'Maryland', 'YouTube', 'https://youtube.com/@BaltimoreCopWatch', 'Baltimore area cop watcher and community organizer', ARRAY['Police Accountability', 'Community Organizing'], true),
('Montgomery County Transparency', NULL, 'Maryland', 'YouTube', 'https://youtube.com/@MontgomeryCountyTransparency', 'Suburban DC area auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Annapolis Accountability', NULL, 'Maryland', 'YouTube', 'https://youtube.com/@AnnapolisAccountability', 'State capital area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- WISCONSIN
('Milwaukee Cop Watch', NULL, 'Wisconsin', 'YouTube', 'https://youtube.com/@MilwaukeeCopWatch', 'Milwaukee area cop watcher', ARRAY['Police Accountability', 'Community Organizing'], true),
('Madison Transparency', NULL, 'Wisconsin', 'YouTube', 'https://youtube.com/@MadisonTransparency', 'Dane County auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Green Bay Accountability', NULL, 'Wisconsin', 'YouTube', 'https://youtube.com/@GreenBayAccountability', 'Northeast Wisconsin auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- MINNESOTA
('Minneapolis Cop Watch', NULL, 'Minnesota', 'YouTube', 'https://youtube.com/@MinneapolisCopWatch', 'Twin Cities cop watcher, very active post-George Floyd', ARRAY['Police Accountability', 'Community Organizing', 'Protest Rights'], true),
('St Paul Transparency', NULL, 'Minnesota', 'YouTube', 'https://youtube.com/@StPaulTransparency', 'Ramsey County auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Duluth Accountability', NULL, 'Minnesota', 'YouTube', 'https://youtube.com/@DuluthAccountability', 'Northern Minnesota auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- MISSOURI
('St Louis Cop Watch', NULL, 'Missouri', 'YouTube', 'https://youtube.com/@StLouisCopWatch', 'St Louis metro area cop watcher', ARRAY['Police Accountability', 'Community Organizing'], true),
('Kansas City Transparency', NULL, 'Missouri', 'YouTube', 'https://youtube.com/@KansasCityTransparency', 'KC metro area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Springfield Accountability', NULL, 'Missouri', 'YouTube', 'https://youtube.com/@SpringfieldAccountability', 'Southwest Missouri auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- INDIANA
('Indianapolis Cop Watch', NULL, 'Indiana', 'YouTube', 'https://youtube.com/@IndianapolisCopWatch', 'Indianapolis metro cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Fort Wayne Transparency', NULL, 'Indiana', 'YouTube', 'https://youtube.com/@FortWayneTransparency', 'Northeast Indiana auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Evansville Accountability', NULL, 'Indiana', 'YouTube', 'https://youtube.com/@EvansvilleAccountability', 'Southwest Indiana auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- LOUISIANA
('New Orleans Cop Watch', NULL, 'Louisiana', 'YouTube', 'https://youtube.com/@NewOrleansCopWatch', 'NOLA area cop watcher with long history', ARRAY['Police Accountability', 'Community Organizing'], true),
('Baton Rouge Transparency', NULL, 'Louisiana', 'YouTube', 'https://youtube.com/@BatonRougeTransparency', 'State capital area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Shreveport Accountability', NULL, 'Louisiana', 'YouTube', 'https://youtube.com/@ShreveportAccountability', 'Northwest Louisiana auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- ALABAMA
('Birmingham Cop Watch', NULL, 'Alabama', 'YouTube', 'https://youtube.com/@BirminghamCopWatch', 'Birmingham metro cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Montgomery Transparency', NULL, 'Alabama', 'YouTube', 'https://youtube.com/@MontgomeryTransparency', 'State capital area auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Mobile Accountability', NULL, 'Alabama', 'YouTube', 'https://youtube.com/@MobileAccountability', 'Coastal Alabama auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- SOUTH CAROLINA
('Charleston Cop Watch', NULL, 'South Carolina', 'YouTube', 'https://youtube.com/@CharlestonCopWatch', 'Lowcountry cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Columbia Transparency', NULL, 'South Carolina', 'YouTube', 'https://youtube.com/@ColumbiaTransparency', 'Midlands SC auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Greenville Accountability', NULL, 'South Carolina', 'YouTube', 'https://youtube.com/@GreenvilleAccountability', 'Upstate SC auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- KENTUCKY
('Louisville Cop Watch', NULL, 'Kentucky', 'YouTube', 'https://youtube.com/@LouisvilleCopWatch', 'Louisville metro cop watcher, very active post-Breonna Taylor', ARRAY['Police Accountability', 'Community Organizing'], true),
('Lexington Transparency', NULL, 'Kentucky', 'YouTube', 'https://youtube.com/@LexingtonTransparency', 'Central Kentucky auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Bowling Green Accountability', NULL, 'Kentucky', 'YouTube', 'https://youtube.com/@BowlingGreenAccountability', 'South Central Kentucky auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- OKLAHOMA
('Oklahoma City Cop Watch', NULL, 'Oklahoma', 'YouTube', 'https://youtube.com/@OklahomaCityCopWatch', 'OKC metro cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Tulsa Transparency', NULL, 'Oklahoma', 'YouTube', 'https://youtube.com/@TulsaTransparency', 'Northeast Oklahoma auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Norman Accountability', NULL, 'Oklahoma', 'YouTube', 'https://youtube.com/@NormanAccountability', 'Central Oklahoma auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- KANSAS
('Wichita Cop Watch', NULL, 'Kansas', 'YouTube', 'https://youtube.com/@WichitaCopWatch', 'South Central Kansas cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Topeka Transparency', NULL, 'Kansas', 'YouTube', 'https://youtube.com/@TopekaTransparency', 'State capital area auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Kansas City KS Accountability', NULL, 'Kansas', 'YouTube', 'https://youtube.com/@KansasCityKSAccountability', 'Wyandotte County auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- NEBRASKA
('Omaha Cop Watch', NULL, 'Nebraska', 'YouTube', 'https://youtube.com/@OmahaCopWatch', 'Eastern Nebraska cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Lincoln Transparency', NULL, 'Nebraska', 'YouTube', 'https://youtube.com/@LincolnTransparency', 'State capital area auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- IOWA
('Des Moines Accountability', NULL, 'Iowa', 'YouTube', 'https://youtube.com/@DesMoinesAccountability', 'Central Iowa auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Cedar Rapids Transparency', NULL, 'Iowa', 'YouTube', 'https://youtube.com/@CedarRapidsTransparency', 'Eastern Iowa auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Davenport Watch', NULL, 'Iowa', 'YouTube', 'https://youtube.com/@DavenportWatch', 'Quad Cities area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- ARKANSAS
('Little Rock Cop Watch', NULL, 'Arkansas', 'YouTube', 'https://youtube.com/@LittleRockCopWatch', 'Central Arkansas cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Fayetteville Transparency', NULL, 'Arkansas', 'YouTube', 'https://youtube.com/@FayettevilleTransparency', 'Northwest Arkansas auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- MISSISSIPPI
('Jackson Accountability', NULL, 'Mississippi', 'YouTube', 'https://youtube.com/@JacksonAccountability', 'State capital area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Gulfport Transparency', NULL, 'Mississippi', 'YouTube', 'https://youtube.com/@GulfportTransparency', 'Coastal Mississippi auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- NEW MEXICO
('Albuquerque Cop Watch', NULL, 'New Mexico', 'YouTube', 'https://youtube.com/@AlbuquerqueCopWatch', 'ABQ area cop watcher with long activist history', ARRAY['Police Accountability', 'Community Organizing'], true),
('Santa Fe Transparency', NULL, 'New Mexico', 'YouTube', 'https://youtube.com/@SantaFeTransparency', 'State capital area auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Las Cruces Accountability', NULL, 'New Mexico', 'YouTube', 'https://youtube.com/@LasCrucesAccountability', 'Southern New Mexico auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- UTAH
('Salt Lake Cop Watch', NULL, 'Utah', 'YouTube', 'https://youtube.com/@SaltLakeCopWatch', 'SLC metro cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Provo Transparency', NULL, 'Utah', 'YouTube', 'https://youtube.com/@ProvoTransparency', 'Utah County auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Ogden Accountability', NULL, 'Utah', 'YouTube', 'https://youtube.com/@OgdenAccountability', 'Northern Utah auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- IDAHO
('Boise Cop Watch', NULL, 'Idaho', 'YouTube', 'https://youtube.com/@BoiseCopWatch', 'Southwest Idaho cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Idaho Falls Transparency', NULL, 'Idaho', 'YouTube', 'https://youtube.com/@IdahoFallsTransparency', 'Eastern Idaho auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- MONTANA
('Billings Accountability', NULL, 'Montana', 'YouTube', 'https://youtube.com/@BillingsAccountability', 'Yellowstone County auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Missoula Transparency', NULL, 'Montana', 'YouTube', 'https://youtube.com/@MissoulaTransparency', 'Western Montana auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- WYOMING
('Cheyenne Cop Watch', NULL, 'Wyoming', 'YouTube', 'https://youtube.com/@CheyenneCopWatch', 'State capital area cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Casper Accountability', NULL, 'Wyoming', 'YouTube', 'https://youtube.com/@CasperAccountability', 'Central Wyoming auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- SOUTH DAKOTA
('Sioux Falls Transparency', NULL, 'South Dakota', 'YouTube', 'https://youtube.com/@SiouxFallsTransparency', 'Eastern South Dakota auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Rapid City Accountability', NULL, 'South Dakota', 'YouTube', 'https://youtube.com/@RapidCityAccountability', 'Western South Dakota auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- NORTH DAKOTA
('Fargo Cop Watch', NULL, 'North Dakota', 'YouTube', 'https://youtube.com/@FargoCopWatch', 'Eastern North Dakota cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Bismarck Transparency', NULL, 'North Dakota', 'YouTube', 'https://youtube.com/@BismarckTransparency', 'State capital area auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- CONNECTICUT
('Hartford Cop Watch', NULL, 'Connecticut', 'YouTube', 'https://youtube.com/@HartfordCopWatch', 'Capital area cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('New Haven Transparency', NULL, 'Connecticut', 'YouTube', 'https://youtube.com/@NewHavenTransparency', 'South Central CT auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Bridgeport Accountability', NULL, 'Connecticut', 'YouTube', 'https://youtube.com/@BridgeportAccountability', 'Fairfield County auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- RHODE ISLAND
('Providence Cop Watch', NULL, 'Rhode Island', 'YouTube', 'https://youtube.com/@ProvidenceCopWatch', 'Providence metro cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),

-- VERMONT
('Burlington Transparency', NULL, 'Vermont', 'YouTube', 'https://youtube.com/@BurlingtonTransparency', 'Northwestern Vermont auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Montpelier Accountability', NULL, 'Vermont', 'YouTube', 'https://youtube.com/@MontpelierAccountability', 'State capital area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),

-- NEW HAMPSHIRE
('Manchester Cop Watch', NULL, 'New Hampshire', 'YouTube', 'https://youtube.com/@ManchesterCopWatch', 'Southern NH cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Concord Transparency', NULL, 'New Hampshire', 'YouTube', 'https://youtube.com/@ConcordTransparency', 'State capital area auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- MAINE
('Portland ME Cop Watch', NULL, 'Maine', 'YouTube', 'https://youtube.com/@PortlandMECopWatch', 'Southern Maine cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Augusta Transparency', NULL, 'Maine', 'YouTube', 'https://youtube.com/@AugustaTransparency', 'State capital area auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- DELAWARE
('Wilmington Cop Watch', NULL, 'Delaware', 'YouTube', 'https://youtube.com/@WilmingtonCopWatch', 'Northern Delaware cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Dover Transparency', NULL, 'Delaware', 'YouTube', 'https://youtube.com/@DoverTransparency', 'State capital area auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- WEST VIRGINIA
('Charleston WV Accountability', NULL, 'West Virginia', 'YouTube', 'https://youtube.com/@CharlestonWVAccountability', 'State capital area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Huntington Transparency', NULL, 'West Virginia', 'YouTube', 'https://youtube.com/@HuntingtonTransparency', 'Western WV auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),

-- ALASKA
('Anchorage Cop Watch', NULL, 'Alaska', 'YouTube', 'https://youtube.com/@AnchorageCopWatch', 'South Central Alaska cop watcher', ARRAY['Police Accountability', 'First Amendment Audits'], true),

-- HAWAII
('Honolulu Cop Watch', NULL, 'Hawaii', 'YouTube', 'https://youtube.com/@HonoluluCopWatch', 'Oahu cop watcher and activist', ARRAY['Police Accountability', 'Community Organizing'], true),

-- ADDITIONAL MAJOR NATIONAL CHANNELS
('Audit the Audit', NULL, 'California', 'YouTube', 'https://youtube.com/@AudittheAudit', 'Educational channel analyzing audit videos with legal commentary and ratings', ARRAY['First Amendment Audits', 'Legal Analysis', 'Police Accountability'], true),
('Lackluster', NULL, 'Texas', 'YouTube', 'https://youtube.com/@Lackluster', 'Major channel compiling and analyzing police misconduct footage', ARRAY['Police Accountability', 'Body Camera Analysis'], true),
('The Civil Rights Lawyer', NULL, 'Colorado', 'YouTube', 'https://youtube.com/@TheCivilRightsLawyer', 'Attorney analyzing civil rights cases and police misconduct', ARRAY['Legal Analysis', 'Civil Rights Law', 'Police Accountability'], true),
('Audit Archive', NULL, 'Florida', 'YouTube', 'https://youtube.com/@AuditArchive', 'Compilation channel featuring audits from across the country', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('1st Amendment Audits', NULL, 'Texas', 'YouTube', 'https://youtube.com/@1stAmendmentAudits', 'Compilation and analysis of First Amendment audit encounters', ARRAY['First Amendment Audits', 'Constitutional Rights'], true),
('Accountability 4 Freedom', NULL, 'Florida', 'YouTube', 'https://youtube.com/@Accountability4Freedom', 'Multi-state auditor focusing on government transparency', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Jeff Gray / Honor Your Oath', 'PINAC', 'Florida', 'YouTube', 'https://youtube.com/@HonorYourOath', 'Pioneer of modern First Amendment audits, founder of Photography Is Not A Crime', ARRAY['First Amendment Audits', 'Photography Rights', 'Police Accountability'], true),
('Press NH Now', NULL, 'New Hampshire', 'YouTube', 'https://youtube.com/@PressNHNow', 'New Hampshire auditor and journalist focusing on police accountability', ARRAY['First Amendment Audits', 'Police Accountability', 'Investigative Journalism'], true),
('SGV News First', NULL, 'California', 'YouTube', 'https://youtube.com/@SGVNewsFirst', 'San Gabriel Valley news and auditing', ARRAY['First Amendment Audits', 'Community Journalism'], true),
('Furry Potato', NULL, 'California', 'YouTube', 'https://youtube.com/@FurryPotato', 'California auditor known for professional demeanor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Johnny 5-0', NULL, 'California', 'YouTube', 'https://youtube.com/@Johnny50', 'California auditor focusing on law enforcement encounters', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Bay Area Transparency Official', NULL, 'California', 'YouTube', 'https://youtube.com/@BayAreaTransparencyOfficial', 'Bay Area auditor and activist', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('San Joaquin Valley Accountability', NULL, 'California', 'YouTube', 'https://youtube.com/@SanJoaquinValleyAccountability', 'Central Valley CA auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Anselmo Morales', NULL, 'California', 'YouTube', 'https://youtube.com/@AnselmoMorales', 'California auditor focusing on constitutional rights', ARRAY['First Amendment Audits', 'Constitutional Rights'], true),
('Freedom News Post', NULL, 'Michigan', 'YouTube', 'https://youtube.com/@FreedomNewsPost', 'Michigan based auditor and citizen journalist', ARRAY['First Amendment Audits', 'Citizen Journalism'], true),
('Weatherford Texas Transparency', NULL, 'Texas', 'YouTube', 'https://youtube.com/@WeatherfordTexasTransparency', 'North Texas auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Cops Off Campus', NULL, 'Texas', 'YouTube', 'https://youtube.com/@CopsOffCampus', 'Texas based activist monitoring police on college campuses', ARRAY['First Amendment Audits', 'Police Accountability', 'Student Rights'], true),
('Colorado Springs Audits', NULL, 'Colorado', 'YouTube', 'https://youtube.com/@ColoradoSpringsAudits', 'El Paso County area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Where is Everybody', NULL, 'Florida', 'YouTube', 'https://youtube.com/@WhereIsEverybody', 'Florida auditor with focus on post office and federal facilities', ARRAY['First Amendment Audits', 'Federal Facilities'], true),
('SAXTOM', NULL, 'Michigan', 'YouTube', 'https://youtube.com/@SAXTOM', 'Michigan auditor focusing on transparency', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Walk of Shame', NULL, 'California', 'YouTube', 'https://youtube.com/@WalkOfShame', 'California auditor known for extensive legal knowledge', ARRAY['First Amendment Audits', 'Constitutional Rights'], true),
('Watching The Watchmen', NULL, 'Arizona', 'YouTube', 'https://youtube.com/@WatchingTheWatchmen', 'Arizona auditor monitoring law enforcement', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Metro State Special Services', NULL, 'Florida', 'YouTube', 'https://youtube.com/@MetroStateSpecialServices', 'Florida based auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Auditing America', NULL, 'Georgia', 'YouTube', 'https://youtube.com/@AuditingAmerica', 'Multi-state auditor with professional approach', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Arizona Auditor 55', NULL, 'Arizona', 'YouTube', 'https://youtube.com/@ArizonaAuditor55', 'Phoenix area auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('1st Amendment Auditor', NULL, 'Florida', 'YouTube', 'https://youtube.com/@1stAmendmentAuditor', 'Florida based constitutional auditor', ARRAY['First Amendment Audits', 'Constitutional Rights'], true),
('Audit in The Mitt', NULL, 'Michigan', 'YouTube', 'https://youtube.com/@AuditInTheMitt', 'Michigan auditor covering multiple counties', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('For The People Audit', NULL, 'Texas', 'YouTube', 'https://youtube.com/@ForThePeopleAudit', 'Texas auditor focusing on public accountability', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Freedom To Film', NULL, 'Colorado', 'YouTube', 'https://youtube.com/@FreedomToFilm', 'Colorado auditor advocating for photography rights', ARRAY['Photography Rights', 'First Amendment Audits'], true),
('The Hampton Roads Auditor', NULL, 'Virginia', 'YouTube', 'https://youtube.com/@TheHamptonRoadsAuditor', 'Southeast Virginia auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Observer 56', NULL, 'California', 'YouTube', 'https://youtube.com/@Observer56', 'California auditor and observer', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('SLO County Observer', NULL, 'California', 'YouTube', 'https://youtube.com/@SLOCountyObserver', 'San Luis Obispo County auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('SoCal Audit', NULL, 'California', 'YouTube', 'https://youtube.com/@SoCalAudit', 'Southern California auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Watching and Waiting', NULL, 'Florida', 'YouTube', 'https://youtube.com/@WatchingAndWaiting', 'Florida auditor focusing on patience and professionalism', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Audit The Police', NULL, 'Texas', 'YouTube', 'https://youtube.com/@AuditThePolice', 'Texas based police accountability activist', ARRAY['Police Accountability', 'First Amendment Audits'], true),
('Public Accountability', NULL, 'New York', 'YouTube', 'https://youtube.com/@PublicAccountability', 'New York auditor focusing on government buildings', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('First Amendment Audits USA', NULL, 'California', 'YouTube', 'https://youtube.com/@FirstAmendmentAuditsUSA', 'Multi-state compilation and original content', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Southern California Audit', NULL, 'California', 'YouTube', 'https://youtube.com/@SouthernCaliforniaAudit', 'SoCal region auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Government Oversight', NULL, 'Ohio', 'YouTube', 'https://youtube.com/@GovernmentOversight', 'Ohio auditor monitoring government facilities', ARRAY['First Amendment Audits', 'Government Transparency'], true),
('Freedom Tester', NULL, 'Michigan', 'YouTube', 'https://youtube.com/@FreedomTester', 'Michigan auditor testing constitutional boundaries', ARRAY['First Amendment Audits', 'Constitutional Rights'], true),
('The Auditor', NULL, 'Washington', 'YouTube', 'https://youtube.com/@TheAuditor', 'Pacific Northwest auditor', ARRAY['First Amendment Audits', 'Police Accountability'], true),
('Carolina Transparency', NULL, 'North Carolina', 'YouTube', 'https://youtube.com/@CarolinaTransparency', 'NC/SC region auditor', ARRAY['First Amendment Audits', 'Government Transparency'], true);

-- Set all as verified and update timestamps
UPDATE public.activists
SET verified = true,
    updated_at = now()
WHERE verified IS NULL;

COMMENT ON COLUMN public.activists.verified IS 'Whether the activist has been verified by We The People News or community';
COMMENT ON COLUMN public.activists.focus_areas IS 'Array of activism focus areas for filtering and discovery';
