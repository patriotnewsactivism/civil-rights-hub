-- Verified Civil Rights Attorney Organizations Directory
-- Source: Organization websites, Justia legal directories, verified through research
-- Date: January 4, 2026
-- IMPORTANT: Only includes verified organizations, no fabricated individual attorneys

-- Keep existing verified entries and add new verified organizations

-- National Civil Rights Organizations

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available,
  phone,
  email
) VALUES (
  'NAACP Legal Defense and Educational Fund',
  'NAACP LDF',
  'National',
  ARRAY['Voting Rights', 'Criminal Justice', 'Education Equity', 'Economic Justice', 'Police Accountability'],
  ARRAY['Impact Litigation', 'Class Actions', 'Appellate Advocacy', 'Supreme Court Cases'],
  'https://www.naacpldf.org/',
  'America''s premier civil rights law organization. Founded in 1940, LDF litigates cases involving racial discrimination and advocates for racial justice. Active in voting rights, criminal justice reform, education equity, and economic justice. Contact via website for legal assistance.',
  true,
  NULL, -- Contact via website
  NULL
)
ON CONFLICT (name, firm) DO UPDATE SET
  practice_areas = EXCLUDED.practice_areas,
  website = EXCLUDED.website,
  bio = EXCLUDED.bio,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Reporters Committee for Freedom of the Press - Legal Defense Network',
  'Reporters Committee for Freedom of the Press',
  'National',
  ARRAY['Press Freedom', 'First Amendment', 'FOIA', 'Shield Law Defense', 'Journalist Protection'],
  ARRAY['Subpoena Defense', 'Prior Restraint', 'Access to Courts', 'Source Protection', 'Records Access'],
  'https://www.rcfp.org/',
  '24/7 legal hotline for journalists and newsrooms. Provides direct pro bono representation, amicus briefs, and legal resources for press freedom issues. Leading organization protecting journalists'' rights since 1970. Call hotline for immediate legal assistance.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  practice_areas = EXCLUDED.practice_areas,
  specialties = EXCLUDED.specialties,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Lawyers'' Committee for Civil Rights Under Law',
  'Lawyers'' Committee for Civil Rights Under Law',
  'National',
  ARRAY['Voting Rights', 'Police Accountability', 'Fair Housing', 'Employment Discrimination', 'Educational Opportunity'],
  ARRAY['Pro Bono Network', 'Voting Rights Project', 'Criminal Justice', 'Fair Housing and Community Development'],
  'https://www.lawyerscommittee.org/',
  'Marshals the pro bono resources of the bar to fight racial discrimination and promote racial justice. Operates the largest pro bono network in the nation. Founded in 1963 at request of President Kennedy. Active in voting rights, police accountability, and economic justice.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  practice_areas = EXCLUDED.practice_areas,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'American Civil Liberties Union - National Office',
  'ACLU',
  'National',
  ARRAY['Civil Rights', 'First Amendment', 'Voting Rights', 'Police Accountability', 'LGBTQ+ Rights', 'Immigrants'' Rights', 'Reproductive Freedom', 'Criminal Law Reform'],
  ARRAY['Constitutional Law', 'Impact Litigation', 'Legislative Advocacy', 'Public Education'],
  'https://www.aclu.org/',
  'Guardian of American liberty, defending and preserving individual rights and liberties. 50 state affiliates. Legal assistance available through state chapters. Major areas: free speech, voting rights, privacy, LGBTQ rights, reproductive freedom, criminal justice reform, immigrants'' rights.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  practice_areas = EXCLUDED.practice_areas,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'National Lawyers Guild',
  'National Lawyers Guild',
  'National',
  ARRAY['Protest Rights', 'Police Accountability', 'Civil Rights', 'Labor Rights', 'Immigration'],
  ARRAY['Legal Observers', 'Mass Defense', 'Movement Lawyering', 'Activist Support'],
  'https://www.nlg.org/',
  'Progressive bar association providing legal support to social justice movements. Legal observer program at protests nationwide. Mass defense coordination. Chapters in cities across U.S. provide know-your-rights training and legal support for activists.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  practice_areas = EXCLUDED.practice_areas,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Civil Rights Corps',
  'Civil Rights Corps',
  'National',
  ARRAY['Police Misconduct', 'Criminal Justice Reform', 'Cash Bail Reform', 'Systemic Injustice'],
  ARRAY['Class Actions', 'Pattern and Practice Litigation', 'Bail Reform', 'Prosecutorial Accountability'],
  'https://civilrightscorps.org/',
  'Challenges systemic injustice in the U.S. legal system through impact litigation. Focus on ending cash bail, challenging police violence, and reforming criminal justice system. Class action expertise.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  practice_areas = EXCLUDED.practice_areas,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Lambda Legal Defense and Education Fund',
  'Lambda Legal',
  'National',
  ARRAY['LGBTQ+ Rights', 'HIV/AIDS Discrimination', 'Marriage Equality', 'Transgender Rights', 'Employment Discrimination'],
  ARRAY['Impact Litigation', 'Policy Advocacy', 'Public Education'],
  'https://www.lambdalegal.org/',
  'Oldest and largest legal organization committed to achieving full recognition of civil rights of LGBTQ+ people and those living with HIV. Offices in New York, Los Angeles, Chicago, Dallas, and Atlanta. Help Desk for legal questions.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  practice_areas = EXCLUDED.practice_areas,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Southern Poverty Law Center',
  'SPLC',
  'National',
  ARRAY['Hate Groups Monitoring', 'Immigrant Justice', 'LGBTQ+ Rights', 'Children''s Rights', 'Criminal Justice Reform'],
  ARRAY['Impact Litigation', 'Intelligence Project', 'Teaching Tolerance'],
  'https://www.splcenter.org/',
  'Dedicated to fighting hate and bigotry and seeking justice for the most vulnerable members of society. Tracks hate groups, provides resources to combat extremism, and litigates civil rights cases. Based in Montgomery, AL with offices nationwide.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  practice_areas = EXCLUDED.practice_areas,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Mexican American Legal Defense and Educational Fund',
  'MALDEF',
  'National',
  ARRAY['Voting Rights', 'Immigration', 'Education', 'Employment', 'Leadership Development'],
  ARRAY['Latino Civil Rights', 'Redistricting', 'English Learner Rights', 'Immigration Policy'],
  'https://www.maldef.org/',
  'Leading Latino civil rights organization. Promotes social change through advocacy, communications, community education, and litigation. Offices in Los Angeles, Sacramento, San Antonio, Chicago, and Washington D.C.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  practice_areas = EXCLUDED.practice_areas,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Asian Americans Advancing Justice - AAJC',
  'Advancing Justice - AAJC',
  'National',
  ARRAY['Immigration', 'Voting Rights', 'Anti-Hate Crime', 'Census', 'Civil Rights'],
  ARRAY['Language Access', 'Anti-Discrimination', 'Affirmative Litigation'],
  'https://www.advancingjustice-aajc.org/',
  'National affiliation of five civil rights organizations advocating for Asian American, Native Hawaiian, and Pacific Islander communities. Policy advocacy and direct legal services. Multiple affiliates: AAJC (D.C.), LA, Atlanta, Chicago, Asian Law Caucus.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  practice_areas = EXCLUDED.practice_areas,
  updated_at = now();

-- Regional/City-Specific Organizations

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Chicago Lawyers'' Committee for Civil Rights',
  'Chicago Lawyers'' Committee',
  'Illinois',
  ARRAY['Voting Rights', 'Police Accountability', 'Fair Housing', 'Immigrants'' Rights'],
  ARRAY['Pro Bono Network', 'Midwest Voting Rights Program', 'Community Advocacy'],
  'https://www.clccrul.org/',
  'Mobilizes the legal community to advocate for and protect civil rights in Chicago and throughout the Midwest. Midwest Voting Rights Program reduces barriers to voting. Pro bono network leverages private attorneys.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  state = EXCLUDED.state,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Lawyers'' Committee for Civil Rights of the San Francisco Bay Area',
  'Lawyers'' Committee SF Bay Area',
  'California',
  ARRAY['Immigrants'' Rights', 'Economic Justice', 'Education Equity', 'Criminal Justice Reform'],
  ARRAY['Impact Litigation', 'Policy Advocacy', 'Pro Bono Partnerships'],
  'https://lccrsf.org/',
  'Advances, protects, and promotes the civil rights of communities of color, immigrants, and low-income individuals through litigation, policy advocacy, and pro bono partnerships.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  state = EXCLUDED.state,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Lawyers for Civil Rights Boston',
  'Lawyers for Civil Rights',
  'Massachusetts',
  ARRAY['Immigrants'' Rights', 'Racial Justice', 'Education', 'Workers'' Rights'],
  ARRAY['Impact Litigation', 'Policy Reform', 'Community Engagement'],
  'https://lawyersforcivilrights.org/',
  'Uses the power of the law to fight discrimination and create pathways to opportunity for communities of color and immigrants in New England.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  state = EXCLUDED.state,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Washington Lawyers'' Committee for Civil Rights and Urban Affairs',
  'Washington Lawyers'' Committee',
  'DC',
  ARRAY['Fair Housing', 'Equal Employment', 'Public Education', 'Disability Rights'],
  ARRAY['Pro Bono Network', 'Community Development', 'Prisoner Rights'],
  'https://www.washlaw.org/',
  'Works to create legal, economic, and social equity in the Washington D.C. metropolitan area through litigation, client counseling, and public policy advocacy.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  state = 'DC',
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Public Counsel',
  'Public Counsel',
  'California',
  ARRAY['Immigrants'' Rights', 'Homelessness', 'Children''s Rights', 'Community Development', 'Veterans'' Rights'],
  ARRAY['Pro Bono Legal Services', 'Impact Litigation', 'Policy Advocacy'],
  'https://www.publiccounsel.org/',
  'Nation''s largest pro bono law firm. Serves the most vulnerable members of Los Angeles community through direct representation, impact litigation, and policy advocacy. 50+ years serving Southern California.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  state = EXCLUDED.state,
  updated_at = now();

-- Specialized Organizations

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'The Innocence Project',
  'Innocence Project',
  'National',
  ARRAY['Criminal Justice', 'Wrongful Convictions', 'Post-Conviction Relief'],
  ARRAY['DNA Exonerations', 'Criminal Justice Reform', 'Compensation for Exonerees'],
  'https://innocenceproject.org/',
  'Works to free the innocent, prevent wrongful convictions, and create fair, compassionate, and equitable systems of justice. Has helped exonerate hundreds of wrongfully convicted individuals through DNA testing and other evidence.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  practice_areas = EXCLUDED.practice_areas,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Center for Constitutional Rights',
  'CCR',
  'National',
  ARRAY['Constitutional Rights', 'Human Rights', 'Racial Justice', 'Immigrants'' Rights', 'National Security'],
  ARRAY['Impact Litigation', 'International Human Rights', 'Movement Support'],
  'https://ccrjustice.org/',
  'Dedicated to advancing and protecting rights guaranteed by U.S. Constitution and Universal Declaration of Human Rights. Uses litigation to empower movements and communities.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  practice_areas = EXCLUDED.practice_areas,
  updated_at = now();

INSERT INTO public.attorneys (
  name,
  firm,
  state,
  practice_areas,
  specialties,
  website,
  bio,
  pro_bono_available
) VALUES (
  'Brennan Center for Justice at NYU Law',
  'Brennan Center',
  'New York',
  ARRAY['Voting Rights', 'Criminal Justice', 'Money in Politics', 'Liberty and National Security'],
  ARRAY['Policy Research', 'Litigation', 'Legislative Advocacy'],
  'https://www.brennancenter.org/',
  'Nonpartisan law and policy institute at NYU School of Law. Works to reform systems of democracy and justice through litigation, policy solutions, and public education. Leading authority on voting rights, money in politics, and criminal justice reform.',
  true
)
ON CONFLICT (name, firm) DO UPDATE SET
  state = EXCLUDED.state,
  practice_areas = EXCLUDED.practice_areas,
  updated_at = now();

-- Add comment about verification
COMMENT ON TABLE public.attorneys IS 'Verified civil rights legal organizations. All entries verified from organization websites. For individual attorney referrals, contact organizations directly or visit state bar association referral services.';

-- Create index for pro bono filtering
CREATE INDEX IF NOT EXISTS idx_attorneys_pro_bono ON public.attorneys(pro_bono_available) WHERE pro_bono_available = true;
