-- Seed real civil rights and police accountability legislation
-- Federal bills reference Congress.gov; state bills reference official legislature portals.
TRUNCATE action_templates RESTART IDENTITY CASCADE;
TRUNCATE legislation RESTART IDENTITY CASCADE;

INSERT INTO legislation (
  bill_number,
  title,
  description,
  level,
  state,
  category,
  status,
  introduced_date,
  last_action_date,
  last_action_description,
  vote_count_yes,
  vote_count_no,
  support_count,
  oppose_count
) VALUES
(
  'H.R. 40',
  'Commission to Study and Develop Reparation Proposals for African Americans Act',
  'Establishes a federal commission to examine the legacy of slavery and discrimination in the United States and recommend appropriate remedies, including proposals for reparations.',
  'federal',
  NULL,
  ARRAY['Civil Rights', 'Reparations'],
  'in_committee',
  '2023-01-09',
  '2023-04-14',
  'Referred to the Subcommittee on the Constitution and Limited Government.',
  0,
  0,
  196,
  0
),
(
  'H.R. 1280',
  'George Floyd Justice in Policing Act of 2021',
  'Bans chokeholds, limits qualified immunity, creates a national misconduct registry, and requires body cameras for federal officers.',
  'federal',
  NULL,
  ARRAY['Police Reform', 'Accountability'],
  'passed_house',
  '2021-02-24',
  '2021-06-23',
  'Motion to invoke cloture on the motion to proceed in the Senate not agreed to.',
  220,
  212,
  220,
  212
),
(
  'S. 492',
  'Facial Recognition and Biometric Technology Moratorium Act of 2023',
  'Imposes a federal moratorium on facial recognition technology and conditions certain grants on adopting similar safeguards.',
  'federal',
  NULL,
  ARRAY['Privacy', 'Surveillance'],
  'in_committee',
  '2023-02-16',
  '2023-02-16',
  'Read twice and referred to the Committee on Commerce, Science, and Transportation.',
  0,
  0,
  6,
  0
),
(
  'SB 2 (2021)',
  'California Peace Officer Decertification Act',
  'Creates a statewide process to decertify officers for serious misconduct and expands oversight by the Commission on Peace Officer Standards and Training.',
  'state',
  'California',
  ARRAY['Police Reform', 'Accountability'],
  'signed',
  '2020-12-07',
  '2021-09-30',
  'Signed by Governor Gavin Newsom.',
  28,
  9,
  28,
  9
),
(
  'SB20-217',
  'Colorado Enhance Law Enforcement Integrity Act',
  'Bans chokeholds, requires body cameras, mandates public reporting of police use of force, and removes qualified immunity as a defense in state court.',
  'state',
  'Colorado',
  ARRAY['Accountability', 'Transparency'],
  'signed',
  '2020-06-09',
  '2020-06-19',
  'Signed by Governor Jared Polis.',
  52,
  13,
  52,
  13
),
(
  'S.8496',
  'New York Eric Garner Anti-Chokehold Act',
  'Makes the use of chokeholds that result in serious injury or death a class C felony in New York State.',
  'state',
  'New York',
  ARRAY['Police Reform', 'Civil Rights'],
  'signed',
  '2020-05-28',
  '2020-06-12',
  'Signed by Governor Andrew Cuomo.',
  62,
  0,
  62,
  0
);

INSERT INTO action_templates (bill_id, template_type, position, subject_line, body_text)
VALUES
(
  (SELECT id FROM legislation WHERE bill_number = 'H.R. 40'),
  'email',
  'support',
  'Support H.R. 40 and authorize a reparations study',
  'Dear Representative,\n\nPlease support H.R. 40 to establish a federal commission that examines the enduring legacy of slavery and proposes reparative policies. This bill is a crucial first step toward acknowledging systemic harms and charting a path for restorative justice.\n\nSincerely,\n[Your Name]\n[City, State]'
),
(
  (SELECT id FROM legislation WHERE bill_number = 'H.R. 1280'),
  'call',
  'support',
  NULL,
  'Hello, my name is [Your Name] and I live in [City]. I am asking [Representative/Senator] [Name] to champion the George Floyd Justice in Policing Act. The bill reforms qualified immunity, bans chokeholds, and creates a national misconduct registry—key steps for accountability. Please make this legislation a priority. Thank you.'
),
(
  (SELECT id FROM legislation WHERE bill_number = 'S. 492'),
  'email',
  'support',
  'Protect civil liberties: Support S. 492',
  'Dear Senator,\n\nPlease cosponsor S. 492 to pause government use of facial recognition technology until Congress adopts meaningful safeguards. The technology routinely misidentifies people of color and threatens privacy. A moratorium prevents further harm while standards are developed.\n\nThank you for standing up for civil liberties.\n\nSincerely,\n[Your Name]\n[City, State]'
),
(
  (SELECT id FROM legislation WHERE bill_number = 'SB 2 (2021)'),
  'email',
  'support',
  'Thank you for implementing SB 2',
  'Dear Senator Bradford,\n\nThank you for sponsoring California''s SB 2 to decertify officers who commit serious misconduct. Please ensure POST has the resources to enforce this law swiftly and transparently.\n\nSincerely,\n[Your Name]\n[City, State]'
),
(
  (SELECT id FROM legislation WHERE bill_number = 'SB20-217'),
  'call',
  'support',
  NULL,
  'Hello, I''m [Your Name] from [City]. I''m calling to thank Senator Garcia for sponsoring SB20-217 and to ask for continued oversight so Colorado''s body camera and reporting requirements stay strong. Transparency is vital for rebuilding public trust. Thank you.'
),
(
  (SELECT id FROM legislation WHERE bill_number = 'S.8496'),
  'email',
  'support',
  'Ensure strong enforcement of New York''s chokehold ban',
  'Dear Senator Benjamin,\n\nThank you for passing the Eric Garner Anti-Chokehold Act. Please work with oversight agencies to guarantee officers are held accountable when chokeholds are used unlawfully. Constituents are watching implementation closely.\n\nSincerely,\n[Your Name]\n[City, State]'
);
