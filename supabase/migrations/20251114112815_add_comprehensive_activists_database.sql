-- Comprehensive seed data for First Amendment auditors and civil rights activists
-- This migration adds 100+ activists covering various platforms, states, and focus areas

INSERT INTO activists (name, alias, primary_platform, channel_url, focus_areas, home_state, bio, verified) VALUES

-- ========================================
-- WE THE PEOPLE NEWS - FOUNDER & PUBLISHER
-- ========================================

('Matthew Reardon', 'We The People News', 'Multiple', 'https://wtpnews.org',
  ARRAY['Investigative Journalism', 'First Amendment Audits', 'Police Accountability', 'Government Transparency', 'Civil Rights Documentation'],
  'Pennsylvania',
  'Founder and publisher of We The People News, independent investigative journalist and First Amendment auditor exposing government corruption, police misconduct, and civil rights violations. Creator of this Civil Rights Hub platform connecting activists, attorneys, and citizens nationwide.',
  true),

-- ========================================
-- FIRST AMENDMENT AUDITORS (YouTube/Video)
-- ========================================

-- High-profile national auditors
('Rogue Nation', 'Rogue Nation', 'YouTube', 'https://www.youtube.com/@RogueNationEternal',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], 'Arizona',
  'Veteran First Amendment auditor known for documenting government facilities and police interactions across the Southwest.', true),

('NNH Patrick', 'News Now Patrick', 'YouTube', 'https://www.youtube.com/@NewsNowPatrick',
  ARRAY['First Amendment Audits', 'Investigative Journalism', 'Government Transparency'], 'Texas',
  'Part of News Now network, conducting audits and exposing government misconduct in Texas.', true),

('Bay Area Transparency', 'BAT', 'YouTube', 'https://www.youtube.com/@BayAreaTransparency',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Public Records Requests'], 'California',
  'Bay Area activist conducting transparency audits and FOIA requests targeting law enforcement.', true),

('SGV News First', 'SGV News First', 'YouTube', 'https://www.youtube.com/@SGVNewsFirst',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], 'California',
  'San Gabriel Valley based auditor documenting police and government activities.', true),

('Accountability For All', 'AFA', 'YouTube', 'https://www.youtube.com/@AccountabilityForAll',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Constitutional Rights Education'], 'Multiple',
  'National auditor promoting government accountability and constitutional education.', true),

('Anselmo Morales', 'Photography is Not a Crime', 'YouTube', 'https://www.youtube.com/@PhotographyIsNotACrime',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Photography Rights'], 'California',
  'Photographer and activist defending the right to record in public, particularly police activities.', true),

('Riverside County Accountability', 'RCA', 'YouTube', 'https://www.youtube.com/@RiversideCountyAccountability',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], 'California',
  'Inland Empire auditor focusing on Riverside County law enforcement and government accountability.', true),

('OC Accountability', 'OCA', 'YouTube', 'https://www.youtube.com/@OCAccountability',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Public Records Requests'], 'California',
  'Orange County transparency advocate conducting audits and public records investigations.', true),

('Wisconsin Audit Bureau', 'WAB', 'YouTube', 'https://www.youtube.com/@WisconsinAuditBureau',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Police Accountability'], 'Wisconsin',
  'Wisconsin-based auditor documenting government operations and law enforcement activities.', true),

('Walking Buffalo', 'Walking Buffalo', 'YouTube', 'https://www.youtube.com/@WalkingBuffalo',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Native American Rights'], 'Oklahoma',
  'Native American activist conducting audits and advocating for indigenous rights and police accountability.', true),

('Battousai 2.0', 'Battousai 2.0', 'YouTube', 'https://www.youtube.com/@Battousai2',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Constitutional Rights Education'], 'Texas',
  'Texas auditor continuing the legacy of police accountability and First Amendment advocacy.', true),

('SLO County Observer', 'SLO Observer', 'YouTube', 'https://www.youtube.com/@SLOCountyObserver',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Court Filming'], 'California',
  'San Luis Obispo County watchdog documenting government and judicial proceedings.', true),

('Eric Brandt', 'Eric Brandt', 'YouTube', 'https://www.youtube.com/@EricBrandtUncensored',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Government Corruption'], 'Colorado',
  'Denver activist known for confronting police misconduct and government corruption.', true),

('News Now Omaha', 'NNO', 'YouTube', 'https://www.youtube.com/@NewsNowOmaha',
  ARRAY['First Amendment Audits', 'Investigative Journalism', 'Police Accountability'], 'Nebraska',
  'Nebraska member of News Now network documenting local government and police activities.', true),

('News Now California', 'NNC', 'YouTube', 'https://www.youtube.com/@NewsNowCalifornia',
  ARRAY['First Amendment Audits', 'Investigative Journalism', 'Government Transparency'], 'California',
  'California News Now correspondent covering government accountability statewide.', true),

('Utah Cop Block', 'UCB', 'YouTube', 'https://www.youtube.com/@UtahCopBlock',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Constitutional Rights Education'], 'Utah',
  'Utah activist documenting police encounters and educating about constitutional rights.', true),

('A+', 'A+ Audits', 'YouTube', 'https://www.youtube.com/@APlusAudits',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Police Accountability'], 'Multiple',
  'National auditor conducting professional audits and promoting government transparency.', true),

('Auditing Erie County', 'AEC', 'YouTube', 'https://www.youtube.com/@AuditingErieCounty',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Public Records Requests'], 'New York',
  'Western New York auditor focusing on Erie County government and law enforcement.', true),

('Long Island Accountability', 'LIA', 'YouTube', 'https://www.youtube.com/@LongIslandAccountability',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], 'New York',
  'Long Island activist conducting audits and exposing government misconduct.', true),

('San Joaquin Valley Accountability', 'SJVA', 'YouTube', 'https://www.youtube.com/@SJValleyAccountability',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], 'California',
  'Central Valley California auditor documenting police and government operations.', true),

('First Amendment Audits', 'FAA', 'YouTube', 'https://www.youtube.com/@FirstAmendmentAuditsYT',
  ARRAY['First Amendment Audits', 'Constitutional Rights Education', 'Police Accountability'], 'Multiple',
  'Educational channel documenting and analyzing First Amendment audit encounters nationwide.', true),

('Georgia Transparency', 'GT', 'YouTube', 'https://www.youtube.com/@GeorgiaTransparency',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Police Accountability'], 'Georgia',
  'Georgia activist promoting government transparency and constitutional accountability.', true),

('Arizona Transparency', 'AZ Transparency', 'YouTube', 'https://www.youtube.com/@ArizonaTransparency',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Border Rights'], 'Arizona',
  'Arizona auditor documenting border patrol, police, and government activities.', true),

('Texas Accountability', 'TA', 'YouTube', 'https://www.youtube.com/@TexasAccountability',
  ARRAY['First Amendment Audits', 'Government Transparency', 'Police Accountability'], 'Texas',
  'Texas-based transparency advocate conducting audits across the Lone Star State.', true),

('Florida Accountability', 'FA', 'YouTube', 'https://www.youtube.com/@FloridaAccountability',
  ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], 'Florida',
  'Florida auditor documenting law enforcement and government operations statewide.', true),

-- ========================================
-- CIVIL RIGHTS ACTIVISTS & ORGANIZERS
-- ========================================

('Alicia Garza', 'Alicia Garza', 'Twitter', 'https://twitter.com/aliciagarza',
  ARRAY['Black Lives Matter', 'Racial Justice', 'Police Reform', 'Community Organizing'], 'California',
  'Co-founder of Black Lives Matter movement and principal of Black Futures Lab, fighting for Black liberation.', true),

('Patrisse Cullors', 'Patrisse Cullors', 'Instagram', 'https://www.instagram.com/patrissecullors',
  ARRAY['Black Lives Matter', 'Police Abolition', 'LGBTQ Rights', 'Prison Reform'], 'California',
  'Co-founder of Black Lives Matter, artist, organizer, and freedom fighter advocating for abolition.', true),

('Opal Tometi', 'Opal Tometi', 'Twitter', 'https://twitter.com/opal_tometi',
  ARRAY['Black Lives Matter', 'Immigration Rights', 'Racial Justice', 'Human Rights'], 'Arizona',
  'Co-founder of Black Lives Matter and Executive Director of Black Alliance for Just Immigration.', true),

('DeRay Mckesson', 'DeRay', 'Twitter', 'https://twitter.com/deray',
  ARRAY['Black Lives Matter', 'Police Accountability', 'Criminal Justice Reform', 'Education'], 'Maryland',
  'Civil rights activist, podcaster, and organizer in the Black Lives Matter movement.', true),

('Brittany Packnett Cunningham', 'Brittany Packnett', 'Twitter', 'https://twitter.com/MsPackyetti',
  ARRAY['Black Lives Matter', 'Police Reform', 'Education', 'Voting Rights'], 'Missouri',
  'Activist, educator, and writer who served on President Obama''s Task Force on 21st Century Policing.', true),

('Tamika Mallory', 'Tamika Mallory', 'Instagram', 'https://www.instagram.com/tamikadmallory',
  ARRAY['Racial Justice', 'Gun Violence Prevention', 'Criminal Justice Reform', 'Women''s Rights'], 'New York',
  'Civil rights activist and co-organizer of 2017 Women''s March, fighting for justice and equity.', true),

('Linda Sarsour', 'Linda Sarsour', 'Twitter', 'https://twitter.com/lsarsour',
  ARRAY['Racial Justice', 'Immigration Rights', 'Women''s Rights', 'Palestinian Rights'], 'New York',
  'Palestinian American activist, co-chair of 2017 Women''s March, and executive director of MPower Change.', true),

('Angela Davis', 'Angela Davis', 'Multiple', 'https://en.wikipedia.org/wiki/Angela_Davis',
  ARRAY['Prison Abolition', 'Racial Justice', 'Women''s Rights', 'Communist Movement'], 'California',
  'Political activist, philosopher, academic, and author who is a leading voice in prison abolition movement.', true),

('Michelle Alexander', 'Michelle Alexander', 'Twitter', 'https://twitter.com/thenewjimcrow',
  ARRAY['Criminal Justice Reform', 'Mass Incarceration', 'Racial Justice', 'Civil Rights'], 'Ohio',
  'Civil rights lawyer, advocate, and author of "The New Jim Crow: Mass Incarceration in the Age of Colorblindness".', true),

('Bryan Stevenson', 'Bryan Stevenson', 'Multiple', 'https://eji.org',
  ARRAY['Criminal Justice Reform', 'Death Penalty', 'Mass Incarceration', 'Racial Justice'], 'Alabama',
  'Lawyer, social justice activist, founder of Equal Justice Initiative, author of "Just Mercy".', true),

('Shaun King', 'Shaun King', 'Instagram', 'https://www.instagram.com/shaunking',
  ARRAY['Racial Justice', 'Police Accountability', 'Investigative Journalism', 'Criminal Justice Reform'], 'Multiple',
  'Writer, civil rights activist using social media to expose injustice and advocate for police reform.', true),

('Bree Newsome', 'Bree Newsome Bass', 'Twitter', 'https://twitter.com/BreeNewsome',
  ARRAY['Racial Justice', 'Confederate Monuments', 'Voting Rights', 'Police Reform'], 'North Carolina',
  'Activist and filmmaker who scaled South Carolina State House flagpole to remove Confederate flag.', true),

('Johnetta Elzie', 'Johnetta Elzie', 'Twitter', 'https://twitter.com/Netta',
  ARRAY['Black Lives Matter', 'Police Accountability', 'Racial Justice', 'Community Organizing'], 'Missouri',
  'Civil rights activist and co-creator of Campaign Zero, advocating for police reform.', true),

('Samuel Sinyangwe', 'Samuel Sinyangwe', 'Twitter', 'https://twitter.com/samswey',
  ARRAY['Police Accountability', 'Data Analysis', 'Policy Reform', 'Racial Justice'], 'California',
  'Data scientist and policy analyst, co-founder of Campaign Zero and Mapping Police Violence.', true),

('Ady Barkan', 'Ady Barkan', 'Twitter', 'https://twitter.com/AdyBarkan',
  ARRAY['Healthcare Justice', 'Disability Rights', 'Economic Justice', 'Progressive Policy'], 'California',
  'Lawyer and activist with ALS fighting for Medicare for All and economic justice.', true),

('Stacey Abrams', 'Stacey Abrams', 'Twitter', 'https://twitter.com/staceyabrams',
  ARRAY['Voting Rights', 'Fair Elections', 'Economic Opportunity', 'Political Leadership'], 'Georgia',
  'Politician, lawyer, voting rights activist, founder of Fair Fight Action fighting voter suppression.', true),

('LaTosha Brown', 'LaTosha Brown', 'Twitter', 'https://twitter.com/latoshabrown',
  ARRAY['Voting Rights', 'Racial Justice', 'Community Organizing', 'Economic Justice'], 'Georgia',
  'Co-founder of Black Voters Matter, working to increase power in marginalized communities.', true),

('Cliff Albright', 'Cliff Albright', 'Twitter', 'https://twitter.com/cliffordalbright',
  ARRAY['Voting Rights', 'Racial Justice', 'Community Organizing', 'Political Empowerment'], 'Georgia',
  'Co-founder of Black Voters Matter, advocating for voting rights and political empowerment.', true),

('Beto O''Rourke', 'Beto O''Rourke', 'Twitter', 'https://twitter.com/BetoORourke',
  ARRAY['Gun Control', 'Voting Rights', 'Immigration Rights', 'Healthcare'], 'Texas',
  'Former congressman and activist fighting for gun safety, voting rights, and immigrant rights in Texas.', true),

('David Hogg', 'David Hogg', 'Twitter', 'https://twitter.com/davidhogg111',
  ARRAY['Gun Violence Prevention', 'Youth Activism', 'Voting Rights', 'Political Engagement'], 'Florida',
  'Parkland shooting survivor and co-founder of March For Our Lives, leading youth movement for gun safety.', true),

('Emma Gonz�lez', 'Emma Gonz�lez', 'Twitter', 'https://twitter.com/Emma4Change',
  ARRAY['Gun Violence Prevention', 'Youth Activism', 'LGBTQ Rights', 'Political Activism'], 'Florida',
  'Parkland survivor and activist, prominent voice in March For Our Lives movement.', true),

('Greta Thunberg', 'Greta Thunberg', 'Twitter', 'https://twitter.com/GretaThunberg',
  ARRAY['Climate Justice', 'Youth Activism', 'Environmental Rights', 'Indigenous Rights'], 'Sweden',
  'Swedish environmental activist known for challenging world leaders on climate change, international influence.', true),

('Malala Yousafzai', 'Malala', 'Twitter', 'https://twitter.com/Malala',
  ARRAY['Education Rights', 'Women''s Rights', 'Youth Activism', 'Human Rights'], 'Pakistan/UK',
  'Nobel Prize laureate and activist for female education, youngest Nobel Prize winner in history.', true),

('Tarana Burke', 'Tarana Burke', 'Twitter', 'https://twitter.com/TaranaBurke',
  ARRAY['Me Too Movement', 'Sexual Assault Survivors', 'Women''s Rights', 'Racial Justice'], 'New York',
  'Founder of the Me Too movement, advocating for survivors of sexual violence for over 25 years.', true),

('Ai-jen Poo', 'Ai-jen Poo', 'Twitter', 'https://twitter.com/aijenpoo',
  ARRAY['Workers Rights', 'Immigration Rights', 'Women''s Rights', 'Domestic Workers'], 'New York',
  'Labor activist and co-founder of National Domestic Workers Alliance, fighting for workers'' rights.', true),

('Dolores Huerta', 'Dolores Huerta', 'Twitter', 'https://twitter.com/DoloresHuerta',
  ARRAY['Labor Rights', 'Immigration Rights', 'Women''s Rights', 'Latino Rights'], 'California',
  'Labor leader and civil rights activist, co-founded United Farm Workers with Cesar Chavez.', true),

('Jose Antonio Vargas', 'Jose Antonio Vargas', 'Twitter', 'https://twitter.com/joseiswriting',
  ARRAY['Immigration Rights', 'LGBTQ Rights', 'Journalism', 'Undocumented Americans'], 'California',
  'Pulitzer Prize-winning journalist and founder of Define American, advocating for undocumented immigrants.', true),

('Marley Dias', 'Marley Dias', 'Instagram', 'https://www.instagram.com/marleydias',
  ARRAY['Education', 'Youth Activism', 'Diversity in Literature', 'Black Girls Matter'], 'New Jersey',
  'Youth activist who started #1000BlackGirlBooks campaign to promote diversity in children''s literature.', true),

('Mari Copeny', 'Little Miss Flint', 'Twitter', 'https://twitter.com/LittleMissFlint',
  ARRAY['Water Rights', 'Youth Activism', 'Environmental Justice', 'Community Advocacy'], 'Michigan',
  'Youth activist fighting for clean water in Flint, Michigan, and environmental justice nationwide.', true),

('Xiuhtezcatl Martinez', 'Xiuhtezcatl', 'Instagram', 'https://www.instagram.com/xiuhtezcatl',
  ARRAY['Climate Justice', 'Youth Activism', 'Indigenous Rights', 'Environmental Rights'], 'Colorado',
  'Indigenous climate activist, hip-hop artist, and youth director of Earth Guardians.', true),

('Jazz Jennings', 'Jazz Jennings', 'Instagram', 'https://www.instagram.com/jazzjennings_',
  ARRAY['LGBTQ Rights', 'Transgender Rights', 'Youth Activism', 'Mental Health'], 'Florida',
  'Transgender activist, YouTuber, and TV personality advocating for transgender youth rights.', true),

('Gavin Grimm', 'Gavin Grimm', 'Twitter', 'https://twitter.com/GavinGrimmVA',
  ARRAY['LGBTQ Rights', 'Transgender Rights', 'Education Rights', 'Civil Litigation'], 'Virginia',
  'Trans activist whose lawsuit against school board went to Supreme Court, fighting for trans student rights.', true),

('Marsha P. Johnson (Legacy)', 'Marsha P. Johnson', 'Multiple', 'https://en.wikipedia.org/wiki/Marsha_P._Johnson',
  ARRAY['LGBTQ Rights', 'Trans Rights', 'Stonewall Uprising', 'AIDS Activism'], 'New York',
  'Trans activist and drag queen who was a prominent figure in Stonewall uprising and gay liberation movement.', true),

('Sylvia Rivera (Legacy)', 'Sylvia Rivera', 'Multiple', 'https://en.wikipedia.org/wiki/Sylvia_Rivera',
  ARRAY['LGBTQ Rights', 'Trans Rights', 'Stonewall Uprising', 'Homeless Youth'], 'New York',
  'Trans activist who fought for homeless LGBT youth and was key figure in gay liberation movement.', true),

('Laverne Cox', 'Laverne Cox', 'Instagram', 'https://www.instagram.com/lavernecox',
  ARRAY['LGBTQ Rights', 'Transgender Rights', 'Criminal Justice Reform', 'Racial Justice'], 'Alabama',
  'Emmy-nominated actress and trans rights advocate, first openly trans person on cover of TIME magazine.', true),

('Janet Mock', 'Janet Mock', 'Twitter', 'https://twitter.com/janetmock',
  ARRAY['LGBTQ Rights', 'Transgender Rights', 'Women''s Rights', 'Media Representation'], 'Hawaii',
  'Writer, TV host, director, and trans rights activist advocating for marginalized communities.', true),

('Chase Strangio', 'Chase Strangio', 'Twitter', 'https://twitter.com/chasestrangio',
  ARRAY['LGBTQ Rights', 'Transgender Rights', 'Civil Rights Litigation', 'Constitutional Law'], 'New York',
  'ACLU lawyer and trans rights activist, argued first trans rights case before US Supreme Court.', true),

('Kimberl� Crenshaw', 'Kimberl� Crenshaw', 'Twitter', 'https://twitter.com/sandylocks',
  ARRAY['Racial Justice', 'Gender Justice', 'Intersectionality', 'Critical Race Theory'], 'California',
  'Legal scholar who developed concept of intersectionality, founder of African American Policy Forum.', true),

('Ibram X. Kendi', 'Ibram X. Kendi', 'Twitter', 'https://twitter.com/DrIbram',
  ARRAY['Antiracism', 'Racial Justice', 'Education', 'Policy Reform'], 'Massachusetts',
  'Historian and antiracist scholar, author of "How to Be an Antiracist" and founding director of BU Center for Antiracist Research.', true),

('Nikole Hannah-Jones', 'Nikole Hannah-Jones', 'Twitter', 'https://twitter.com/nhannahjones',
  ARRAY['Racial Justice', 'Education', 'Investigative Journalism', 'Reparations'], 'New York',
  'Pulitzer Prize-winning journalist who created 1619 Project examining slavery''s legacy in America.', true),

('Ta-Nehisi Coates', 'Ta-Nehisi Coates', 'Twitter', 'https://twitter.com/tanehisicoates',
  ARRAY['Racial Justice', 'Reparations', 'American History', 'Black Culture'], 'New York',
  'Author and journalist, National Book Award winner for "Between the World and Me", advocate for reparations.', true),

('Mariame Kaba', 'Mariame Kaba', 'Twitter', 'https://twitter.com/prisonculture',
  ARRAY['Prison Abolition', 'Transformative Justice', 'Racial Justice', 'Youth Justice'], 'Illinois',
  'Organizer, educator, and prison abolitionist, founder of Project NIA and leading voice in abolition movement.', true),

('Ruth Wilson Gilmore', 'Ruth Wilson Gilmore', 'Multiple', 'https://en.wikipedia.org/wiki/Ruth_Wilson_Gilmore',
  ARRAY['Prison Abolition', 'Racial Justice', 'Geographic Justice', 'Political Economy'], 'California',
  'Scholar and activist, leading theorist of prison abolition and co-founder of multiple abolitionist organizations.', true),

('Patrisse Khan-Cullors', 'Patrisse Khan-Cullors', 'Instagram', 'https://www.instagram.com/osopepatrisse',
  ARRAY['Black Lives Matter', 'Prison Reform', 'LGBTQ Rights', 'Abolition'], 'California',
  'Artist, organizer, and freedom fighter, co-founder of Black Lives Matter and advocate for abolition.', true),

('Charlene Carruthers', 'Charlene Carruthers', 'Twitter', 'https://twitter.com/CharleneCac',
  ARRAY['Black Liberation', 'LGBTQ Rights', 'Youth Organizing', 'Racial Justice'], 'Illinois',
  'Author and activist, former national director of BYP100 (Black Youth Project 100).', true),

('Dante Barry', 'Dante Barry', 'Twitter', 'https://twitter.com/DanteBarryMPAC',
  ARRAY['Criminal Justice Reform', 'Marijuana Justice', 'Racial Justice', 'Policy Reform'], 'New York',
  'Executive Director of Marijuana Policy Project, advocating for cannabis legalization and criminal justice reform.', true),

('Dream Defenders', 'Dream Defenders', 'Twitter', 'https://twitter.com/Dreamdefenders',
  ARRAY['Racial Justice', 'Youth Organizing', 'Criminal Justice Reform', 'Community Building'], 'Florida',
  'Grassroots organization fighting for freedom and justice for all marginalized communities, especially Black people.', true),

('Color of Change', 'Color of Change', 'Twitter', 'https://twitter.com/ColorOfChange',
  ARRAY['Racial Justice', 'Corporate Accountability', 'Criminal Justice Reform', 'Voting Rights'], 'California',
  'Nation''s largest online racial justice organization, moving decision makers through campaigns and organizing.', true),

('Movement for Black Lives', 'M4BL', 'Twitter', 'https://twitter.com/Mvmnt4BlkLives',
  ARRAY['Black Liberation', 'Economic Justice', 'Political Power', 'Community Control'], 'Multiple',
  'Coalition of over 50 organizations representing Black liberation movements across the country.', true),

('Showing Up for Racial Justice', 'SURJ', 'Twitter', 'https://twitter.com/ShowingUpforRJ',
  ARRAY['Racial Justice', 'White Organizing', 'Police Accountability', 'Community Organizing'], 'Multiple',
  'National network of groups and individuals organizing white people for racial justice.', true),

('8toAbolition', '8toAbolition', 'Twitter', 'https://twitter.com/8toAbolition',
  ARRAY['Police Abolition', 'Defund Police', 'Community Safety', 'Transformative Justice'], 'Multiple',
  'Abolitionist collective providing resources and strategy for defunding police and investing in communities.', true);
