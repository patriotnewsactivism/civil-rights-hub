-- Seed data for prominent First Amendment auditors and civil rights activists
INSERT INTO activists (name, alias, primary_platform, channel_url, focus_areas, home_state, bio, verified) VALUES
-- FOUNDER - We The People News
(
  'Matthew Reardon',
  'We The People News',
  'Multiple',
  'https://wtpnews.org',
  ARRAY['Investigative Journalism', 'First Amendment Audits', 'Police Accountability', 'Government Transparency', 'Civil Rights Documentation'],
  'Pennsylvania',
  'Founder and publisher of We The People News, independent investigative journalist and First Amendment auditor dedicated to exposing government misconduct and defending constitutional rights through comprehensive investigative reporting and on-the-ground documentation.',
  true
),
-- MAJOR FIRST AMENDMENT AUDITORS
(
  'James Freeman',
  'James Freeman',
  'YouTube',
  'https://www.youtube.com/@JamesFreeman',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Constitutional Rights Education'],
  'California',
  'First Amendment auditor known for documenting interactions with law enforcement and educating the public about constitutional rights.',
  true
),
(
  'Sean Paul Reyes',
  'Long Island Audit',
  'YouTube',
  'https://www.youtube.com/@LongIslandAudit',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'],
  'New York',
  'Civil rights activist conducting First Amendment audits and advocating for government accountability and transparency.',
  true
),
(
  'Jason Gutterman',
  'Amagansett Press',
  'YouTube',
  'https://www.youtube.com/@AmagansettPress',
  ARRAY['First Amendment Audits', 'Public Records Requests', 'Government Transparency'],
  'New York',
  'First Amendment auditor specializing in public records requests and documenting government operations.',
  true
),
(
  'Jose LaSalle',
  'San Joaquin Valley Transparency',
  'YouTube',
  'https://www.youtube.com/@SJVT',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'],
  'California',
  'Transparency advocate conducting audits of government facilities and law enforcement agencies.',
  true
),
(
  'Johnny 5-0',
  'Johnny 5-0',
  'YouTube',
  'https://www.youtube.com/@Johnny50',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Court Filming'],
  'Texas',
  'First Amendment auditor documenting police activities and court proceedings while educating about civil liberties.',
  true
),
(
  'Jeff Gray',
  'Honor Your Oath',
  'YouTube',
  'https://www.youtube.com/@HonorYourOath',
  ARRAY['First Amendment Audits', 'Constitutional Rights Education', 'Government Transparency'],
  'Florida',
  'Veteran and civil rights advocate conducting First Amendment audits and testing public officials'' knowledge of the Constitution.',
  true
),
(
  'Phillip Turner',
  'The Battousai',
  'YouTube',
  'https://www.youtube.com/@TheBattousai',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Civil Rights Litigation'],
  'Texas',
  'First Amendment auditor and plaintiff in Turner v. Driver, a landmark case establishing the right to record police.',
  true
),
(
  'Michael Picard',
  'News Now Connecticut',
  'YouTube',
  'https://www.youtube.com/@NewsNowConnecticut',
  ARRAY['First Amendment Audits', 'Investigative Journalism', 'Police Accountability'],
  'Connecticut',
  'Investigative journalist and auditor documenting government accountability and constitutional rights violations.',
  true
),
(
  'David Worden',
  'News Now Houston',
  'YouTube',
  'https://www.youtube.com/@NewsNowHouston',
  ARRAY['First Amendment Audits', 'Investigative Journalism', 'Government Transparency'],
  'Texas',
  'Founder of the News Now network, documenting government operations and advocating for transparency.',
  true
),
(
  'High Desert Community Watch',
  'HDCW',
  'YouTube',
  'https://www.youtube.com/@HDCommunityWatch',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Public Records Requests'],
  'California',
  'Community watchdog group conducting audits and public records requests in the High Desert region.',
  true
),
(
  'Marcus Dipaola',
  'Marcus Dipaola',
  'TikTok',
  'https://www.tiktok.com/@marcus.dipaola',
  ARRAY['Investigative Journalism', 'Protest Documentation', 'Constitutional Rights Education'],
  'Massachusetts',
  'Independent journalist covering civil rights protests, police accountability, and social justice movements.',
  true
),
(
  'Taya Graham',
  'The Real News Network',
  'YouTube',
  'https://www.youtube.com/@therealnews',
  ARRAY['Investigative Journalism', 'Police Accountability', 'Civil Rights Litigation'],
  'Maryland',
  'Investigative journalist specializing in police accountability and criminal justice reform.',
  true
),
(
  'Glenn Cerio',
  'Direct D',
  'YouTube',
  'https://www.youtube.com/@DirectD',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Police Accountability'],
  'Florida',
  'First Amendment auditor and transparency advocate documenting government operations and police activities.',
  true
),
(
  'Armed Fisherman',
  'Armed Fisherman',
  'YouTube',
  'https://www.youtube.com/@ArmedFisherman',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Constitutional Rights Education'],
  'Colorado',
  'Second and First Amendment advocate conducting audits and educating about constitutional rights.',
  true
),
(
  'Delaware Press Gang',
  'DPG',
  'YouTube',
  'https://www.youtube.com/@DelawarePressGang',
  ARRAY['First Amendment Audits', 'Public Records Requests', 'Government Transparency'],
  'Delaware',
  'Transparency collective conducting audits and FOIA requests to expose government misconduct.',
  true
),
(
  'JMA',
  'James Madison Audits',
  'YouTube',
  'https://www.youtube.com/@JamesMadisonAudits',
  ARRAY['First Amendment Audits', 'Constitutional Rights Education', 'Government Transparency'],
  'Multiple',
  'Nationwide auditor educating the public about constitutional rights and government accountability.',
  true
),
(
  'Audit the Audit',
  'Audit the Audit',
  'YouTube',
  'https://www.youtube.com/@AudittheAudit',
  ARRAY['First Amendment Audits', 'Constitutional Rights Education', 'Police Accountability'],
  'Multiple',
  'Educational channel analyzing First Amendment audits and police encounters, rating interactions based on legal standards.',
  true
),
(
  'Lackluster',
  'Lackluster',
  'YouTube',
  'https://www.youtube.com/@LackLusterMedia',
  ARRAY['Police Accountability', 'Investigative Journalism', 'Civil Rights Litigation'],
  'Multiple',
  'Creator documenting police misconduct through bodycam footage analysis and accountability journalism.',
  true
),
(
  'Press NH Now',
  'Press NH Now',
  'YouTube',
  'https://www.youtube.com/@PressNHNow',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Court Filming'],
  'New Hampshire',
  'New Hampshire-based auditor documenting government operations and court proceedings.',
  true
),
(
  'Furry Potato',
  'Furry Potato',
  'YouTube',
  'https://www.youtube.com/@FurryPotato',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Constitutional Rights Education'],
  'Nevada',
  'First Amendment auditor conducting audits of government facilities and law enforcement agencies.',
  true
),
-- REGIONAL FIRST AMENDMENT AUDITORS
(
  'Seattle Real News',
  'SRN',
  'YouTube',
  'https://www.youtube.com/@SeattleRealNews',
  ARRAY['First Amendment Audits', 'Investigative Journalism', 'Police Accountability'],
  'Washington',
  'Seattle area journalist conducting First Amendment audits and documenting police accountability issues in the Pacific Northwest.',
  true
),
(
  'Boston Paul',
  'Boston Paul',
  'YouTube',
  'https://www.youtube.com/@BostonPaul',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Constitutional Rights Education'],
  'Massachusetts',
  'Boston-based auditor documenting government operations and educating about civil liberties in New England.',
  true
),
(
  'Denver Metro Audits',
  'DMA',
  'YouTube',
  'https://www.youtube.com/@DenverMetroAudits',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Public Records Requests'],
  'Colorado',
  'Colorado auditor focusing on Denver metro area government transparency and police accountability.',
  true
),
(
  'Portland Auditor',
  'PDX Audits',
  'YouTube',
  'https://www.youtube.com/@PortlandAuditor',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Protest Documentation'],
  'Oregon',
  'Portland-based auditor documenting government operations and civil rights protests in the Pacific Northwest.',
  true
),
(
  'Miami Free Press',
  'MFP',
  'YouTube',
  'https://www.youtube.com/@MiamiFreePress',
  ARRAY['First Amendment Audits', 'Investigative Journalism', 'Government Transparency'],
  'Florida',
  'South Florida journalist conducting audits and investigative reporting on government accountability.',
  true
),
(
  'Atlanta Accountability',
  'Atlanta Accountability',
  'YouTube',
  'https://www.youtube.com/@AtlantaAccountability',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Civil Rights Documentation'],
  'Georgia',
  'Atlanta-based auditor focusing on police accountability and civil rights in the Southeast.',
  true
),
(
  'Vegas Valley Audits',
  'VVA',
  'YouTube',
  'https://www.youtube.com/@VegasValleyAudits',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Police Accountability'],
  'Nevada',
  'Las Vegas area auditor documenting government operations and law enforcement activities.',
  true
),
(
  'Phoenix Auditor',
  'PHX Audits',
  'YouTube',
  'https://www.youtube.com/@PhoenixAuditor',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Constitutional Rights Education'],
  'Arizona',
  'Arizona auditor focusing on Phoenix metro area government transparency and civil liberties.',
  true
),
(
  'Dallas Fort Worth Accountability',
  'DFW Accountability',
  'YouTube',
  'https://www.youtube.com/@DFWAccountability',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'],
  'Texas',
  'North Texas auditor documenting government operations and police activities in the DFW metroplex.',
  true
),
(
  'Philly Free Press',
  'PFP',
  'YouTube',
  'https://www.youtube.com/@PhillyFreePress',
  ARRAY['First Amendment Audits', 'Investigative Journalism', 'Government Transparency'],
  'Pennsylvania',
  'Philadelphia journalist conducting audits and investigative reporting on local government.',
  true
),
(
  'Chicago Transparency Project',
  'CTP',
  'YouTube',
  'https://www.youtube.com/@ChicagoTransparency',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Public Records Requests'],
  'Illinois',
  'Chicago-based transparency advocate conducting audits and FOIA requests.',
  true
),
(
  'Alabama Auditor',
  'AL Audits',
  'YouTube',
  'https://www.youtube.com/@AlabamaAuditor',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Constitutional Rights Education'],
  'Alabama',
  'Alabama-based auditor documenting government operations and educating about civil liberties in the Deep South.',
  true
),
(
  'Carolina Transparency',
  'CT',
  'YouTube',
  'https://www.youtube.com/@CarolinaTransparency',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'],
  'North Carolina',
  'Carolinas auditor focusing on government transparency and police accountability.',
  true
),
(
  'Michigan Accountability',
  'MA',
  'YouTube',
  'https://www.youtube.com/@MichiganAccountability',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Constitutional Rights Education'],
  'Michigan',
  'Michigan auditor documenting government operations and educating about constitutional rights.',
  true
),
-- MAJOR INVESTIGATIVE JOURNALISM ORGANIZATIONS
(
  'The Intercept',
  'The Intercept',
  'Multiple',
  'https://theintercept.com',
  ARRAY['Investigative Journalism', 'National Security', 'Civil Liberties', 'Police Accountability', 'Government Transparency'],
  'Multiple',
  'Independent news organization dedicated to producing fearless, adversarial journalism on national security, civil liberties, corporate power, and government corruption. Founded by Glenn Greenwald, Laura Poitras, and Jeremy Scahill.',
  true
),
(
  'ProPublica',
  'ProPublica',
  'Multiple',
  'https://www.propublica.org',
  ARRAY['Investigative Journalism', 'Government Accountability', 'Civil Rights', 'Criminal Justice Reform'],
  'New York',
  'Independent nonprofit newsroom producing investigative journalism in the public interest. Winner of multiple Pulitzer Prizes for exposing abuses of power and betrayals of public trust.',
  true
),
(
  'The Marshall Project',
  'The Marshall Project',
  'Multiple',
  'https://www.themarshallproject.org',
  ARRAY['Investigative Journalism', 'Criminal Justice Reform', 'Mass Incarceration', 'Police Accountability'],
  'New York',
  'Nonprofit news organization focused on criminal justice reform, covering the U.S. criminal justice system through journalism, research, and community engagement.',
  true
),
(
  'The Appeal',
  'The Appeal',
  'Multiple',
  'https://theappeal.org',
  ARRAY['Investigative Journalism', 'Criminal Justice Reform', 'Police Accountability', 'Political Journalism'],
  'New York',
  'News and opinion outlet focused on criminal justice reform, examining how the justice system affects marginalized communities.',
  true
),
(
  'Type Investigations',
  'Type',
  'Multiple',
  'https://www.typeinvestigations.org',
  ARRAY['Investigative Journalism', 'Social Justice', 'Government Accountability', 'Civil Rights'],
  'New York',
  'Nonprofit investigative journalism organization producing in-depth reporting on systemic injustices and abuses of power.',
  true
),
(
  'Reveal',
  'Reveal from The Center for Investigative Reporting',
  'Multiple',
  'https://revealnews.org',
  ARRAY['Investigative Journalism', 'Social Justice', 'Government Accountability', 'Police Accountability'],
  'California',
  'America''s first nonprofit investigative journalism organization, producing award-winning radio shows and podcasts exposing injustice.',
  true
),
(
  'Frontline PBS',
  'Frontline',
  'Multiple',
  'https://www.pbs.org/wgbh/frontline',
  ARRAY['Investigative Journalism', 'Documentary Filmmaking', 'Government Accountability', 'Social Justice'],
  'Multiple',
  'Investigative journalism series producing groundbreaking documentaries on critical issues, from civil rights to government accountability.',
  true
),
(
  'Vice News',
  'Vice',
  'Multiple',
  'https://www.vice.com/en/section/news',
  ARRAY['Investigative Journalism', 'Protest Documentation', 'Civil Rights', 'Police Accountability'],
  'Multiple',
  'International news organization producing immersive investigative journalism and documentary content on underreported stories.',
  true
),
(
  'Democracy Now!',
  'Democracy Now',
  'Multiple',
  'https://www.democracynow.org',
  ARRAY['Investigative Journalism', 'Social Justice', 'Civil Rights', 'Government Accountability', 'Protest Documentation'],
  'New York',
  'Independent daily news program hosted by Amy Goodman and Juan González, covering issues often ignored by mainstream media.',
  true
),
-- INDIVIDUAL INVESTIGATIVE JOURNALISTS
(
  'Amy Goodman',
  'Amy Goodman',
  'Multiple',
  'https://www.democracynow.org',
  ARRAY['Investigative Journalism', 'Social Justice', 'Civil Rights', 'Government Accountability'],
  'New York',
  'Award-winning journalist and host of Democracy Now!, known for fearless reporting on civil rights, social justice, and government accountability.',
  true
),
(
  'Glenn Greenwald',
  'Glenn Greenwald',
  'Multiple',
  'https://greenwald.substack.com',
  ARRAY['Investigative Journalism', 'National Security', 'Civil Liberties', 'Government Transparency'],
  'Multiple',
  'Pulitzer Prize-winning journalist who broke the Edward Snowden NSA surveillance story. Co-founder of The Intercept, now independent on Substack.',
  true
),
(
  'Jeremy Scahill',
  'Jeremy Scahill',
  'Multiple',
  'https://theintercept.com/staff/jeremy-scahill',
  ARRAY['Investigative Journalism', 'National Security', 'Military Accountability', 'Government Transparency'],
  'Multiple',
  'Investigative journalist and co-founder of The Intercept, author of "Blackwater" and "Dirty Wars", documenting U.S. military and intelligence operations.',
  true
),
(
  'Naomi Klein',
  'Naomi Klein',
  'Multiple',
  'https://naomiklein.org',
  ARRAY['Investigative Journalism', 'Social Justice', 'Economic Justice', 'Climate Justice'],
  'Canada',
  'Award-winning journalist and author documenting corporate power, climate change, and social movements. Author of "The Shock Doctrine" and "No Logo".',
  true
),
(
  'Matt Taibbi',
  'Matt Taibbi',
  'Multiple',
  'https://taibbi.substack.com',
  ARRAY['Investigative Journalism', 'Government Accountability', 'Corporate Power', 'Economic Justice'],
  'Multiple',
  'Investigative journalist known for exposing Wall Street corruption and government malfeasance, author of "Griftopia" and "The Divide".',
  true
),
(
  'Ronan Farrow',
  'Ronan Farrow',
  'Multiple',
  'https://www.newyorker.com/contributors/ronan-farrow',
  ARRAY['Investigative Journalism', 'Human Rights', 'Government Accountability', 'Sexual Misconduct'],
  'New York',
  'Pulitzer Prize-winning investigative journalist who broke major #MeToo stories, author of "Catch and Kill" exposing abuse of power.',
  true
),
(
  'Ida B. Wells',
  'Ida B. Wells',
  'Historical',
  'https://www.idabwellssociety.org',
  ARRAY['Investigative Journalism', 'Civil Rights', 'Anti-Lynching Advocacy', 'Racial Justice'],
  'Historical',
  'Pioneer investigative journalist who documented lynching in America, co-founder of the NAACP, and fearless civil rights advocate. Her legacy lives on through the Ida B. Wells Society for Investigative Reporting.',
  true
),
-- CIVIL RIGHTS PODCASTERS
(
  'DeRay Mckesson',
  'Pod Save the People',
  'Podcast',
  'https://crooked.com/podcast-series/pod-save-the-people',
  ARRAY['Civil Rights', 'Police Accountability', 'Racial Justice', 'Criminal Justice Reform'],
  'Maryland',
  'Civil rights activist and host of Pod Save the People, prominent Black Lives Matter organizer and advocate for police reform.',
  true
),
(
  'Intercepted Podcast',
  'Intercepted',
  'Podcast',
  'https://theintercept.com/podcasts',
  ARRAY['Investigative Journalism', 'National Security', 'Civil Liberties', 'Government Accountability'],
  'Multiple',
  'Weekly investigative podcast from The Intercept exploring the most urgent issues facing our world.',
  true
),
(
  'Ear Hustle',
  'Ear Hustle',
  'Podcast',
  'https://www.earhustlesq.com',
  ARRAY['Criminal Justice Reform', 'Mass Incarceration', 'Prison Reform', 'Civil Rights'],
  'California',
  'Groundbreaking podcast about life inside prison, produced by Earlonne Woods and Nigel Poor, offering unique perspective on incarceration.',
  true
),
(
  'Wrongful Conviction',
  'Wrongful Conviction',
  'Podcast',
  'https://wrongfulconvictionpodcast.com',
  ARRAY['Criminal Justice Reform', 'Wrongful Convictions', 'Police Accountability', 'Legal Reform'],
  'Multiple',
  'Podcast examining wrongful convictions, hosted by Jason Flom, giving voice to those who have been unjustly imprisoned.',
  true
),
(
  'Serial',
  'Serial',
  'Podcast',
  'https://serialpodcast.org',
  ARRAY['Investigative Journalism', 'Criminal Justice', 'Legal Analysis', 'True Crime'],
  'Multiple',
  'Pioneering investigative journalism podcast examining one case per season, exposing flaws in the criminal justice system.',
  true
),
(
  'In The Dark',
  'In The Dark',
  'Podcast',
  'https://www.apmreports.org/in-the-dark',
  ARRAY['Investigative Journalism', 'Criminal Justice Reform', 'Wrongful Convictions', 'Police Accountability'],
  'Minnesota',
  'Award-winning investigative podcast from APM Reports uncovering major problems in criminal justice system.',
  true
),
(
  '1619 Podcast',
  '1619',
  'Podcast',
  'https://www.nytimes.com/2020/01/23/podcasts/1619-podcast.html',
  ARRAY['Civil Rights', 'Racial Justice', 'American History', 'Systemic Racism'],
  'New York',
  'Podcast examining the legacy of slavery and its continued impact on American society, companion to the 1619 Project.',
  true
),
(
  'Code Switch',
  'Code Switch',
  'Podcast',
  'https://www.npr.org/podcasts/510312/codeswitch',
  ARRAY['Civil Rights', 'Racial Justice', 'Cultural Commentary', 'Social Justice'],
  'Multiple',
  'NPR podcast exploring race, ethnicity, and culture in America with fearless conversations.',
  true
),
-- LEGAL COMMENTATORS & EDUCATORS
(
  'Devin Stone',
  'LegalEagle',
  'YouTube',
  'https://www.youtube.com/@LegalEagle',
  ARRAY['Constitutional Rights Education', 'Legal Analysis', 'Civil Rights', 'Criminal Justice'],
  'California',
  'Attorney and legal educator breaking down complex legal issues, analyzing civil rights cases, and explaining constitutional law to millions.',
  true
),
(
  'John Crump',
  'The Civil Rights Lawyer',
  'YouTube',
  'https://www.youtube.com/@TheCivilRightsLawyer',
  ARRAY['Civil Rights', 'Police Accountability', 'Constitutional Rights Education', 'Legal Analysis'],
  'Virginia',
  'Civil rights attorney analyzing First Amendment audits, police misconduct cases, and constitutional violations with expert legal commentary.',
  true
),
(
  'Steve Lehto',
  'Steve Lehto',
  'YouTube',
  'https://www.youtube.com/@stevelehto',
  ARRAY['Legal Analysis', 'Consumer Rights', 'Civil Rights', 'Constitutional Rights Education'],
  'Michigan',
  'Consumer rights attorney and legal commentator covering civil rights issues, legal cases, and constitutional matters.',
  true
),
(
  'Robert Gouveia',
  'Watching the Watchers',
  'YouTube',
  'https://www.youtube.com/@RobertGouveia',
  ARRAY['Legal Analysis', 'Civil Rights', 'Government Accountability', 'Constitutional Rights Education'],
  'Arizona',
  'Attorney providing in-depth legal analysis of high-profile cases, civil rights issues, and government accountability.',
  true
),
-- SOCIAL MEDIA ACTIVISTS & COMMENTATORS
(
  'Alexandria Ocasio-Cortez',
  'AOC',
  'Multiple',
  'https://ocasio-cortez.house.gov',
  ARRAY['Civil Rights', 'Economic Justice', 'Climate Justice', 'Criminal Justice Reform'],
  'New York',
  'U.S. Representative using social media to advocate for progressive policies, civil rights, and criminal justice reform.',
  true
),
(
  'Ilhan Omar',
  'Ilhan Omar',
  'Multiple',
  'https://omar.house.gov',
  ARRAY['Civil Rights', 'Refugee Rights', 'Police Accountability', 'Criminal Justice Reform'],
  'Minnesota',
  'U.S. Representative and human rights advocate fighting for civil liberties and criminal justice reform.',
  true
),
(
  'Rashida Tlaib',
  'Rashida Tlaib',
  'Multiple',
  'https://tlaib.house.gov',
  ARRAY['Civil Rights', 'Economic Justice', 'Environmental Justice', 'Criminal Justice Reform'],
  'Michigan',
  'U.S. Representative advocating for civil rights, criminal justice reform, and economic justice.',
  true
),
(
  'Ayanna Pressley',
  'Ayanna Pressley',
  'Multiple',
  'https://pressley.house.gov',
  ARRAY['Civil Rights', 'Criminal Justice Reform', 'Police Accountability', 'Racial Justice'],
  'Massachusetts',
  'U.S. Representative championing criminal justice reform, police accountability, and civil rights advocacy.',
  true
),
(
  'Cori Bush',
  'Cori Bush',
  'Multiple',
  'https://bush.house.gov',
  ARRAY['Civil Rights', 'Racial Justice', 'Police Accountability', 'Black Lives Matter'],
  'Missouri',
  'U.S. Representative, former Black Lives Matter activist and nurse fighting for racial justice and police accountability.',
  true
),
(
  'Jamaal Bowman',
  'Jamaal Bowman',
  'Multiple',
  'https://bowman.house.gov',
  ARRAY['Civil Rights', 'Education Justice', 'Criminal Justice Reform', 'Racial Justice'],
  'New York',
  'Former educator and U.S. Representative advocating for education equity, criminal justice reform, and civil rights.',
  true
),
-- ADDITIONAL CIVIL RIGHTS ACTIVISTS & ORGANIZERS
(
  'Alicia Garza',
  'Alicia Garza',
  'Multiple',
  'https://aliciagarza.com',
  ARRAY['Black Lives Matter', 'Racial Justice', 'Criminal Justice Reform', 'Community Organizing'],
  'California',
  'Co-founder of Black Lives Matter, civil rights activist and community organizer fighting for racial justice and police accountability.',
  true
),
(
  'Patrisse Cullors',
  'Patrisse Cullors',
  'Multiple',
  'https://patrissecullors.com',
  ARRAY['Black Lives Matter', 'Racial Justice', 'Police Accountability', 'Abolition'],
  'California',
  'Co-founder of Black Lives Matter, artist, and activist advocating for police abolition and transformative justice.',
  true
),
(
  'Opal Tometi',
  'Opal Tometi',
  'Multiple',
  'https://opaltometi.org',
  ARRAY['Black Lives Matter', 'Immigration Rights', 'Racial Justice', 'Human Rights'],
  'Arizona',
  'Co-founder of Black Lives Matter and executive director of Black Alliance for Just Immigration.',
  true
),
(
  'Charlene Carruthers',
  'Charlene Carruthers',
  'Multiple',
  'https://charlenecarruthers.com',
  ARRAY['Racial Justice', 'LGBTQ Rights', 'Criminal Justice Reform', 'Community Organizing'],
  'Illinois',
  'Author, activist, and former national director of Black Youth Project 100, fighting for racial and economic justice.',
  true
),
(
  'Linda Sarsour',
  'Linda Sarsour',
  'Multiple',
  'https://lindasarsour.com',
  ARRAY['Civil Rights', 'Muslim Rights', 'Racial Justice', 'Community Organizing'],
  'New York',
  'Palestinian-American activist and community organizer co-chairing the Women''s March and advocating for civil liberties.',
  true
),
(
  'Dolores Huerta',
  'Dolores Huerta',
  'Multiple',
  'https://doloreshuerta.org',
  ARRAY['Labor Rights', 'Civil Rights', 'Immigration Rights', 'Community Organizing'],
  'California',
  'Co-founder of United Farm Workers, labor leader and civil rights activist who coined "Sí, se puede" (Yes, we can).',
  true
),
(
  'Ai-jen Poo',
  'Ai-jen Poo',
  'Multiple',
  'https://domesticworkers.org',
  ARRAY['Labor Rights', 'Immigration Rights', 'Women''s Rights', 'Economic Justice'],
  'New York',
  'Director of National Domestic Workers Alliance, MacArthur Genius Grant recipient advocating for workers'' rights and economic justice.',
  true
),
(
  'Maurice Mitchell',
  'Maurice Mitchell',
  'Multiple',
  'https://workingfamilies.org',
  ARRAY['Racial Justice', 'Economic Justice', 'Political Organizing', 'Community Organizing'],
  'New York',
  'National director of Working Families Party, former organizing director of Black Lives Matter, building grassroots political power.',
  true
),
(
  'Shaun King',
  'Shaun King',
  'Multiple',
  'https://shaunking.substack.com',
  ARRAY['Racial Justice', 'Police Accountability', 'Criminal Justice Reform', 'Investigative Journalism'],
  'Multiple',
  'Civil rights activist, writer, and co-founder of Real Justice PAC, using social media to expose police brutality and advocate for reform.',
  true
),
(
  'Brittany Packnett Cunningham',
  'Brittany Packnett',
  'Multiple',
  'https://www.brittanypacknett.com',
  ARRAY['Racial Justice', 'Education Justice', 'Police Accountability', 'Political Commentary'],
  'Missouri',
  'Activist, educator, and political commentator who served on President Obama''s Task Force on 21st Century Policing.',
  true
),
(
  'Tamika Mallory',
  'Tamika Mallory',
  'Multiple',
  'https://tamikadmallory.com',
  ARRAY['Racial Justice', 'Gun Violence Prevention', 'Criminal Justice Reform', 'Community Organizing'],
  'New York',
  'Civil rights activist and co-chair of Women''s March, advocating for gun violence prevention and criminal justice reform.',
  true
),
(
  'Colin Kaepernick',
  'Colin Kaepernick',
  'Multiple',
  'https://kaepernick7.com',
  ARRAY['Police Accountability', 'Racial Justice', 'Criminal Justice Reform', 'Protest'],
  'California',
  'Former NFL quarterback who sparked national movement by kneeling during national anthem to protest police brutality and racial injustice.',
  true
),
(
  'Bryan Stevenson',
  'Bryan Stevenson',
  'Multiple',
  'https://eji.org',
  ARRAY['Criminal Justice Reform', 'Death Penalty Abolition', 'Wrongful Convictions', 'Racial Justice'],
  'Alabama',
  'Founder of Equal Justice Initiative, public interest lawyer who has won reversals or relief for over 135 death row prisoners.',
  true
),
(
  'Michelle Alexander',
  'Michelle Alexander',
  'Multiple',
  'https://newjimcrow.com',
  ARRAY['Criminal Justice Reform', 'Mass Incarceration', 'Racial Justice', 'Legal Analysis'],
  'Ohio',
  'Civil rights lawyer and author of "The New Jim Crow," exposing mass incarceration as system of racial control.',
  true
),
(
  'Angela Davis',
  'Angela Davis',
  'Multiple',
  'https://angeladavis.com',
  ARRAY['Abolition', 'Prison Reform', 'Racial Justice', 'Civil Rights'],
  'California',
  'Political activist, philosopher, and scholar advocating for prison abolition and transformative justice.',
  true
),
(
  'Cornel West',
  'Cornel West',
  'Multiple',
  'https://www.cornelwest.com',
  ARRAY['Racial Justice', 'Economic Justice', 'Civil Rights', 'Political Philosophy'],
  'Massachusetts',
  'Philosopher, political activist, and public intellectual advocating for racial and economic justice.',
  true
),
(
  'Keeanga-Yamahtta Taylor',
  'Keeanga-Yamahtta Taylor',
  'Multiple',
  'https://aas.princeton.edu/people/keeanga-yamahtta-taylor',
  ARRAY['Racial Justice', 'Housing Justice', 'Black Lives Matter', 'Political Analysis'],
  'New Jersey',
  'Scholar and author examining Black liberation movements, housing discrimination, and systemic racism.',
  true
),
(
  'Mariame Kaba',
  'Mariame Kaba',
  'Multiple',
  'https://www.usprisonculture.com',
  ARRAY['Abolition', 'Transformative Justice', 'Prison Reform', 'Community Organizing'],
  'Illinois',
  'Organizer, educator, and curator advocating for prison abolition and transformative justice practices.',
  true
),
(
  'Dream Defenders',
  'Dream Defenders',
  'Multiple',
  'https://dreamdefenders.org',
  ARRAY['Racial Justice', 'Criminal Justice Reform', 'Youth Activism', 'Community Organizing'],
  'Florida',
  'Youth-led organization fighting for freedom and justice, founded after Trayvon Martin''s murder.',
  true
),
(
  'Black Youth Project 100',
  'BYP100',
  'Multiple',
  'https://byp100.org',
  ARRAY['Racial Justice', 'LGBTQ Rights', 'Criminal Justice Reform', 'Youth Activism'],
  'Illinois',
  'Member-based organization of Black 18-35 year old activists creating justice and freedom for all Black people.',
  true
),
(
  'Color of Change',
  'Color of Change',
  'Multiple',
  'https://colorofchange.org',
  ARRAY['Racial Justice', 'Criminal Justice Reform', 'Corporate Accountability', 'Political Organizing'],
  'Multiple',
  'Nation''s largest online racial justice organization, mobilizing millions to end practices that unfairly hold Black people back.',
  true
);
