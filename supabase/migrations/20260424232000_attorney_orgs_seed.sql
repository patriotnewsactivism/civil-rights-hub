-- ============================================================
-- ATTORNEY SEED: Real civil rights orgs + individual attorneys
-- Additional entries beyond existing 106
-- ============================================================

INSERT INTO public.attorneys (name, firm_name, city, state, phone, email, website, practice_areas, accepts_pro_bono, bio, verified)
VALUES
  -- === National Organizations ===
  ('ACLU of Texas', 'ACLU of Texas', 'Austin', 'Texas',
   '(512) 478-7300', NULL, 'https://www.aclutx.org',
   ARRAY['civil_rights','police_misconduct','immigration','voting_rights'],
   true, 'ACLU Texas fights for civil liberties across Texas including police accountability, voting rights, and immigrant rights.', true),

  ('Texas Civil Rights Project', 'Texas Civil Rights Project', 'Austin', 'Texas',
   '(512) 474-5073', NULL, 'https://www.texascivilrightsproject.org',
   ARRAY['civil_rights','voting_rights','immigration','criminal_justice'],
   true, 'Non-profit civil rights organization providing free legal services to Texans fighting injustice.', true),

  ('ACLU of California - Los Angeles', 'ACLU of Southern California', 'Los Angeles', 'California',
   '(213) 977-9500', NULL, 'https://www.aclusocal.org',
   ARRAY['civil_rights','police_misconduct','LGBTQ_rights','immigration'],
   true, 'Defends constitutional rights and civil liberties across Southern California.', true),

  ('Public Counsel', 'Public Counsel', 'Los Angeles', 'California',
   '(213) 385-2977', NULL, 'https://www.publiccounsel.org',
   ARRAY['civil_rights','immigration','housing','children_rights'],
   true, 'Nation''s largest pro bono law firm. Provides free legal services to underserved communities in LA.', true),

  ('Lawyers'' Committee for Civil Rights of the San Francisco Bay Area', 'Lawyers'' Committee SF Bay Area', 'San Francisco', 'California',
   '(415) 543-9444', NULL, 'https://www.lccr.com',
   ARRAY['civil_rights','employment_discrimination','voting_rights','immigration'],
   true, 'Provides legal representation to individuals experiencing discrimination in the Bay Area.', true),

  ('NAACP Legal Defense Fund', 'NAACP Legal Defense and Educational Fund', 'Washington', 'District of Columbia',
   '(202) 682-1300', NULL, 'https://www.naacpldf.org',
   ARRAY['racial_justice','civil_rights','voting_rights','criminal_justice'],
   true, 'America''s premier legal organization fighting racial injustice. Fights in courts, schools, and communities.', true),

  ('ACLU of Illinois', 'ACLU of Illinois', 'Chicago', 'Illinois',
   '(312) 201-9740', NULL, 'https://www.aclu-il.org',
   ARRAY['civil_rights','police_misconduct','criminal_justice','LGBTQ_rights'],
   true, 'Works to protect civil liberties and extend rights to underserved communities across Illinois.', true),

  ('People''s Law Office', 'People''s Law Office', 'Chicago', 'Illinois',
   '(312) 644-3131', NULL, 'https://peopleslawoffice.com',
   ARRAY['police_misconduct','civil_rights','criminal_defense','political_prosecution'],
   true, 'Forty-year history of litigating police accountability cases and defending political activists in Chicago.', true),

  ('Roderick & Solange MacArthur Justice Center', 'MacArthur Justice Center', 'Chicago', 'Illinois',
   '(312) 503-1271', NULL, 'https://www.macarthurjustice.org',
   ARRAY['criminal_justice','wrongful_conviction','police_misconduct','prison_conditions'],
   true, 'Litigates on behalf of prisoners and those harmed by the criminal justice system.', true),

  ('ACLU of New York', 'New York Civil Liberties Union', 'New York', 'New York',
   '(212) 607-3300', NULL, 'https://www.nyclu.org',
   ARRAY['civil_rights','police_misconduct','voting_rights','immigrants_rights'],
   true, 'NYCLU fights for civil liberties and civil rights of New Yorkers in courts and communities.', true),

  ('The Legal Aid Society', 'The Legal Aid Society', 'New York', 'New York',
   '(212) 577-3300', NULL, 'https://www.legalaidnyc.org',
   ARRAY['criminal_defense','civil_rights','housing','immigration'],
   true, 'Nation''s oldest legal aid organization providing comprehensive legal services to low-income New Yorkers.', true),

  ('ACLU of Georgia', 'ACLU of Georgia', 'Atlanta', 'Georgia',
   '(404) 523-6201', NULL, 'https://www.acluga.org',
   ARRAY['civil_rights','voting_rights','criminal_justice','LGBTQ_rights'],
   true, 'Defends constitutional rights and civil liberties of Georgians in courts and legislatures.', true),

  ('Southern Center for Human Rights', 'Southern Center for Human Rights', 'Atlanta', 'Georgia',
   '(404) 688-1202', NULL, 'https://www.schr.org',
   ARRAY['death_penalty','prison_conditions','criminal_justice','poverty_law'],
   true, 'Provides legal representation to people facing the death penalty and challenging prison conditions.', true),

  ('ACLU of Florida', 'ACLU of Florida', 'Miami', 'Florida',
   '(786) 363-2700', NULL, 'https://www.aclufl.org',
   ARRAY['civil_rights','voting_rights','criminal_justice','LGBTQ_rights'],
   true, 'Protects the civil liberties and civil rights of Floridians.', true),

  ('Community Justice Project', 'Community Justice Project', 'Miami', 'Florida',
   '(305) 907-7697', NULL, 'https://www.communityjusticeproject.com',
   ARRAY['civil_rights','tenant_rights','immigrants_rights','racial_justice'],
   true, 'Provides free civil legal services and community lawyering to low-income communities in South Florida.', true),

  ('ACLU of Minnesota', 'ACLU of Minnesota', 'Minneapolis', 'Minnesota',
   '(651) 645-4097', NULL, 'https://www.aclu-mn.org',
   ARRAY['civil_rights','police_misconduct','criminal_justice','immigrants_rights'],
   true, 'Works to defend and extend civil liberties and civil rights for Minnesotans.', true),

  ('Mid-Minnesota Legal Aid', 'Mid-Minnesota Legal Aid', 'Minneapolis', 'Minnesota',
   '(612) 334-5970', NULL, 'https://www.mylegalaid.org',
   ARRAY['housing','employment_discrimination','civil_rights','family_law'],
   true, 'Provides free legal help to low-income Minnesotans in civil legal matters.', true),

  ('ACLU of Oregon', 'ACLU of Oregon', 'Portland', 'Oregon',
   '(503) 227-6928', NULL, 'https://www.aclu-or.org',
   ARRAY['civil_rights','police_misconduct','criminal_justice','free_speech'],
   true, 'Defends rights of free speech, association, assembly, and due process in Oregon.', true),

  ('Oregon Justice Resource Center', 'Oregon Justice Resource Center', 'Portland', 'Oregon',
   '(503) 944-2270', NULL, 'https://ojrc.info',
   ARRAY['criminal_defense','death_penalty','prison_conditions','civil_rights'],
   true, 'Provides legal representation to marginalized individuals in Oregon''s criminal justice system.', true),

  ('ACLU of Washington', 'ACLU of Washington', 'Seattle', 'Washington',
   '(206) 624-2184', NULL, 'https://www.aclu-wa.org',
   ARRAY['civil_rights','police_misconduct','criminal_justice','immigrants_rights'],
   true, 'Defends constitutional rights in Washington state through litigation and advocacy.', true),

  ('Columbia Legal Services', 'Columbia Legal Services', 'Seattle', 'Washington',
   '(206) 464-5933', NULL, 'https://columbialegal.org',
   ARRAY['civil_rights','poverty_law','housing','immigrants_rights'],
   true, 'Provides free legal services to low-income Washingtonians on civil matters with statewide significance.', true),

  ('ACLU of Colorado', 'ACLU of Colorado', 'Denver', 'Colorado',
   '(720) 402-3109', NULL, 'https://www.aclu-co.org',
   ARRAY['civil_rights','police_misconduct','criminal_justice','immigrants_rights'],
   true, 'Defends civil liberties in Colorado through litigation, legislation, and community organizing.', true),

  ('Colorado Legal Services', 'Colorado Legal Services', 'Denver', 'Colorado',
   '(303) 837-1313', NULL, 'https://www.coloradolegalservices.org',
   ARRAY['housing','family_law','civil_rights','consumer_rights'],
   true, 'Provides free civil legal assistance to low-income Coloradans.', true),

  ('ACLU of Arizona', 'ACLU of Arizona', 'Phoenix', 'Arizona',
   '(602) 650-1854', NULL, 'https://www.acluaz.org',
   ARRAY['civil_rights','immigration','criminal_justice','voting_rights'],
   true, 'Defends individual rights and civil liberties in Arizona.', true),

  ('ACLU of Maryland', 'ACLU of Maryland', 'Baltimore', 'Maryland',
   '(410) 889-8555', NULL, 'https://www.aclu-md.org',
   ARRAY['civil_rights','police_misconduct','criminal_justice','LGBTQ_rights'],
   true, 'Protects civil liberties of Marylanders through litigation and advocacy.', true),

  ('Maryland Legal Aid', 'Maryland Legal Aid', 'Baltimore', 'Maryland',
   '(410) 539-5340', NULL, 'https://www.mdlab.org',
   ARRAY['housing','family_law','civil_rights','consumer_rights'],
   true, 'Provides civil legal services to low-income Marylanders.', true),

  ('ACLU of Ohio', 'ACLU of Ohio', 'Columbus', 'Ohio',
   '(614) 228-8090', NULL, 'https://www.acluohio.org',
   ARRAY['civil_rights','police_misconduct','criminal_justice','voting_rights'],
   true, 'Defends constitutional rights and civil liberties in Ohio.', true),

  ('Ohio Poverty Law Center', 'Ohio Poverty Law Center', 'Columbus', 'Ohio',
   '(614) 221-7201', NULL, 'https://ohiopovertylaw.org',
   ARRAY['housing','public_benefits','civil_rights','consumer_rights'],
   true, 'Works to secure economic justice for Ohioans living in poverty.', true),

  ('ACLU of Michigan', 'ACLU of Michigan', 'Detroit', 'Michigan',
   '(313) 578-6800', NULL, 'https://www.aclumich.org',
   ARRAY['civil_rights','police_misconduct','criminal_justice','immigrants_rights'],
   true, 'Works to protect and defend civil liberties for all Michiganders.', true),

  ('Detroit Justice Center', 'Detroit Justice Center', 'Detroit', 'Michigan',
   '(313) 482-2025', NULL, 'https://detroitjusticecenter.org',
   ARRAY['civil_rights','housing','economic_justice','decarceration'],
   true, 'Community-centered legal organization focused on economic and racial justice in Detroit.', true),

  ('ACLU of Pennsylvania', 'ACLU of Pennsylvania', 'Philadelphia', 'Pennsylvania',
   '(215) 592-1513', NULL, 'https://www.aclupa.org',
   ARRAY['civil_rights','police_misconduct','criminal_justice','voting_rights'],
   true, 'Defends civil liberties and civil rights in Pennsylvania.', true),

  ('Pennsylvania Legal Aid Network', 'Pennsylvania Legal Aid Network', 'Philadelphia', 'Pennsylvania',
   '(717) 236-9486', NULL, 'https://www.palegalaid.net',
   ARRAY['housing','family_law','civil_rights','consumer_rights'],
   true, 'Statewide network of legal aid organizations providing free civil legal services.', true),

  ('ACLU of Tennessee', 'ACLU of Tennessee', 'Nashville', 'Tennessee',
   '(615) 320-7142', NULL, 'https://www.aclu-tn.org',
   ARRAY['civil_rights','criminal_justice','LGBTQ_rights','voting_rights'],
   true, 'Protects civil liberties and civil rights in Tennessee.', true),

  ('ACLU of Nevada', 'ACLU of Nevada', 'Las Vegas', 'Nevada',
   '(702) 366-1902', NULL, 'https://www.aclunv.org',
   ARRAY['civil_rights','police_misconduct','criminal_justice','immigrants_rights'],
   true, 'Defends civil liberties of Nevadans through litigation and advocacy.', true),

  ('ACLU of North Carolina', 'ACLU of North Carolina', 'Raleigh', 'North Carolina',
   '(919) 834-3390', NULL, 'https://www.acluofnc.org',
   ARRAY['civil_rights','voting_rights','criminal_justice','LGBTQ_rights'],
   true, 'Challenges racial injustice and protects civil liberties in North Carolina.', true),

  ('ACLU of Louisiana', 'ACLU of Louisiana', 'New Orleans', 'Louisiana',
   '(504) 522-0628', NULL, 'https://www.laaclu.org',
   ARRAY['civil_rights','criminal_justice','prison_conditions','voting_rights'],
   true, 'Defends civil liberties and challenges injustice in Louisiana''s criminal legal system.', true),

  ('Promise of Justice Initiative', 'Promise of Justice Initiative', 'New Orleans', 'Louisiana',
   '(504) 529-5955', NULL, 'https://www.promiseofjustice.org',
   ARRAY['death_penalty','wrongful_conviction','criminal_justice','civil_rights'],
   true, 'Provides legal representation to individuals on Louisiana''s death row and those facing extreme sentences.', true),

  ('ACLU of Missouri', 'ACLU of Missouri', 'St. Louis', 'Missouri',
   '(314) 652-3114', NULL, 'https://www.aclu-mo.org',
   ARRAY['civil_rights','police_misconduct','criminal_justice','voting_rights'],
   true, 'Challenges racial injustice and police misconduct in Missouri.', true),

  ('Arch City Defenders', 'Arch City Defenders', 'St. Louis', 'Missouri',
   '(314) 361-8834', NULL, 'https://www.archcitydefenders.org',
   ARRAY['civil_rights','criminal_justice','housing','poverty_law'],
   true, 'Civil rights law firm challenging systemic racism and poverty in Missouri''s criminal legal system.', true),

  ('ACLU of Virginia', 'ACLU of Virginia', 'Richmond', 'Virginia',
   '(804) 644-8022', NULL, 'https://www.acluva.org',
   ARRAY['civil_rights','voting_rights','criminal_justice','LGBTQ_rights'],
   true, 'Defends civil liberties and promotes racial justice in Virginia.', true),

  ('Legal Aid Justice Center', 'Legal Aid Justice Center', 'Falls Church', 'Virginia',
   '(703) 778-3450', NULL, 'https://www.justice4all.org',
   ARRAY['civil_rights','immigration','housing','poverty_law'],
   true, 'Challenges poverty and systemic barriers facing low-income Virginians.', true),

  ('ACLU of Wisconsin', 'ACLU of Wisconsin', 'Milwaukee', 'Wisconsin',
   '(414) 272-4032', NULL, 'https://www.aclu-wi.org',
   ARRAY['civil_rights','voting_rights','criminal_justice','police_misconduct'],
   true, 'Works to protect and expand civil liberties in Wisconsin.', true)

ON CONFLICT DO NOTHING;
