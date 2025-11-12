-- Seed sample civil rights legislation for demonstration purposes
INSERT INTO legislation (bill_number, title, description, level, state, category, status, introduced_date, last_action_date, last_action_description) VALUES
(
  'H.R. 82',
  'George Floyd Justice in Policing Act',
  'Addresses a wide range of policies and issues regarding policing practices and law enforcement accountability, including limits on qualified immunity, prohibition of racial profiling, ban on chokeholds, and mandatory use of dashboard cameras and body cameras.',
  'federal',
  NULL,
  ARRAY['Police Reform', 'Civil Rights', 'Accountability'],
  'in_committee',
  '2023-01-09',
  '2023-02-15',
  'Referred to the Subcommittee on Crime and Federal Government Surveillance'
),
(
  'S. 2981',
  'Fourth Amendment Is Not For Sale Act',
  'Prohibits law enforcement agencies and intelligence agencies from purchasing personal data from data brokers that would otherwise require a warrant to obtain.',
  'federal',
  NULL,
  ARRAY['Privacy', 'Fourth Amendment', 'Data Protection'],
  'in_committee',
  '2023-09-28',
  '2023-10-12',
  'Read twice and referred to the Committee on the Judiciary'
),
(
  'H.R. 3190',
  'Protecting Americans'' Data from Foreign Adversaries Act',
  'Restricts foreign adversaries from accessing Americans'' sensitive data and establishes privacy protections.',
  'federal',
  NULL,
  ARRAY['Privacy', 'Data Protection', 'National Security'],
  'passed_house',
  '2024-03-15',
  '2024-03-20',
  'Passed House by voice vote'
),
(
  'S. 1084',
  'Facial Recognition and Biometric Technology Moratorium Act',
  'Prohibits federal use of facial recognition technology and conditions federal grant funding to state and local entities on those entities adopting a similar prohibition.',
  'federal',
  NULL,
  ARRAY['Privacy', 'Surveillance', 'Technology'],
  'in_committee',
  '2023-03-30',
  '2023-04-15',
  'Read twice and referred to the Committee on Commerce, Science, and Transportation'
),
(
  'AB 1008',
  'Police Decertification',
  'Expands the authority of the Commission on Peace Officer Standards and Training to investigate allegations of serious misconduct and revoke officers'' certifications.',
  'state',
  'California',
  ARRAY['Police Reform', 'Accountability'],
  'signed',
  '2023-02-15',
  '2023-09-30',
  'Signed by Governor'
),
(
  'HB 1267',
  'Law Enforcement Body Camera Footage Access',
  'Requires law enforcement agencies to release body camera footage to the public within 14 days of a critical incident.',
  'state',
  'Colorado',
  ARRAY['Transparency', 'Police Reform', 'Public Records'],
  'signed',
  '2023-01-18',
  '2023-05-25',
  'Signed into law'
),
(
  'SB 98',
  'Police Use of Force Standards',
  'Establishes comprehensive standards for law enforcement use of force, including duty to intervene and de-escalation requirements.',
  'state',
  'New York',
  ARRAY['Police Reform', 'Civil Rights'],
  'passed_senate',
  '2024-01-10',
  '2024-02-14',
  'Passed Senate 42-21'
),
(
  'HB 5376',
  'First Amendment Protection Act',
  'Prohibits government retaliation against individuals exercising their First Amendment rights, including peaceful protest and recording of public officials.',
  'state',
  'Illinois',
  ARRAY['First Amendment', 'Civil Rights', 'Protest Rights'],
  'in_committee',
  '2024-02-05',
  '2024-03-12',
  'Assigned to Judiciary Committee'
),
(
  'SB 2',
  'Civil Asset Forfeiture Reform',
  'Raises the standard of proof required for civil asset forfeiture and requires a criminal conviction before property can be permanently seized.',
  'state',
  'Texas',
  ARRAY['Civil Rights', 'Property Rights', 'Criminal Justice'],
  'in_committee',
  '2023-11-15',
  '2024-01-20',
  'Public hearing held'
),
(
  'AB 481',
  'Military Equipment Acquisition',
  'Requires local governments to obtain approval from their governing body before acquiring military equipment and mandates public reporting.',
  'state',
  'California',
  ARRAY['Police Reform', 'Transparency', 'Militarization'],
  'signed',
  '2022-02-03',
  '2022-09-30',
  'Signed into law - currently in effect'
);

-- Insert sample action templates for these bills
INSERT INTO action_templates (bill_id, template_type, position, subject_line, body_text) VALUES
(
  (SELECT id FROM legislation WHERE bill_number = 'H.R. 82'),
  'email',
  'support',
  'Support H.R. 82 - George Floyd Justice in Policing Act',
  'Dear [Representative Name],

I am writing as your constituent to urge you to support H.R. 82, the George Floyd Justice in Policing Act.

This critical legislation addresses systemic issues in law enforcement by:
- Limiting qualified immunity that shields officers from accountability
- Banning chokeholds and other dangerous tactics
- Mandating the use of body cameras and dashboard cameras
- Prohibiting racial and religious profiling

These reforms are essential to rebuild trust between law enforcement and the communities they serve, while ensuring accountability for misconduct.

I respectfully ask that you co-sponsor and vote in favor of H.R. 82.

Thank you for your time and consideration.

Sincerely,
[Your Name]
[Your Address]
[Your City, State ZIP]'
),
(
  (SELECT id FROM legislation WHERE bill_number = 'S. 2981'),
  'email',
  'support',
  'Protect Our Privacy - Support S. 2981',
  'Dear Senator [Name],

I am writing to express my strong support for S. 2981, the Fourth Amendment Is Not For Sale Act.

The practice of law enforcement purchasing personal data from data brokers circumvents constitutional protections that would otherwise require a warrant. This legislation closes that loophole and ensures our Fourth Amendment rights are protected in the digital age.

Our personal information should not be for sale to the highest bidder, especially when it would normally require probable cause and a warrant to obtain.

I urge you to co-sponsor and vote in favor of S. 2981.

Thank you,
[Your Name]
[Your City, State]'
),
(
  (SELECT id FROM legislation WHERE bill_number = 'S. 1084'),
  'call_script',
  'support',
  NULL,
  'Hello, my name is [Your Name] and I am a constituent from [City].

I am calling to ask Senator [Name] to support S. 1084, the Facial Recognition and Biometric Technology Moratorium Act.

Facial recognition technology poses serious threats to our privacy and civil liberties. Studies have shown it is less accurate for people of color, leading to wrongful arrests. This technology is being deployed without proper safeguards or public debate.

S. 1084 would pause federal use of this technology until proper regulations are in place.

Will the Senator support this bill?

Thank you for your time.'
);
