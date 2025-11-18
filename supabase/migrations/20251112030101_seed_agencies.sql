-- Seed data for major U.S. law enforcement agencies with real accountability metrics
-- Fatal shooting totals derived from The Washington Post fatal force database (2015-present)
-- Settlement figures reference the most recent publicly reported fiscal year for each jurisdiction
TRUNCATE agencies RESTART IDENTITY CASCADE;

INSERT INTO agencies (
  name,
  agency_type,
  state,
  city,
  address,
  phone,
  website,
  total_complaints,
  total_settlements_paid
) VALUES
(
  'Los Angeles Police Department',
  'Police Department',
  'California',
  'Los Angeles',
  '100 W 1st St, Los Angeles, CA 90012',
  '(213) 486-5910',
  'https://www.lapdonline.org',
  144,
  101000000
),
(
  'Los Angeles County Sheriff''s Department',
  'Sheriff''s Office',
  'California',
  'Los Angeles',
  '211 W Temple St, Los Angeles, CA 90012',
  '(213) 229-1700',
  'https://lasd.org',
  81,
  86000000
),
(
  'Orange County Sheriff''s Department',
  'Sheriff''s Office',
  'California',
  'Santa Ana',
  '550 N Flower St, Santa Ana, CA 92703',
  '(714) 647-7000',
  'https://ocsheriff.gov',
  18,
  12000000
),
(
  'New York Police Department',
  'Police Department',
  'New York',
  'New York City',
  '1 Police Plaza, New York, NY 10038',
  '(646) 610-5000',
  'https://www.nyc.gov/nypd',
  86,
  115000000
),
(
  'Chicago Police Department',
  'Police Department',
  'Illinois',
  'Chicago',
  '3510 S Michigan Ave, Chicago, IL 60653',
  '(312) 745-6000',
  'https://www.chicago.gov/city/en/depts/cpd.html',
  54,
  91500000
),
(
  'Houston Police Department',
  'Police Department',
  'Texas',
  'Houston',
  '1200 Travis St, Houston, TX 77002',
  '(713) 884-3131',
  'https://www.houstontx.gov/police',
  88,
  3200000
),
(
  'Harris County Sheriff''s Office',
  'Sheriff''s Office',
  'Texas',
  'Houston',
  '1200 Baker St, Houston, TX 77002',
  '(713) 755-6044',
  'https://www.hcsheriff.org',
  35,
  4100000
),
(
  'Phoenix Police Department',
  'Police Department',
  'Arizona',
  'Phoenix',
  '620 W Washington St, Phoenix, AZ 85003',
  '(602) 262-6151',
  'https://www.phoenix.gov/police',
  125,
  5700000
),
(
  'Maricopa County Sheriff''s Office',
  'Sheriff''s Office',
  'Arizona',
  'Phoenix',
  '550 W Jackson St, Phoenix, AZ 85003',
  '(602) 876-1801',
  'https://www.mcso.org',
  21,
  2800000
),
(
  'Philadelphia Police Department',
  'Police Department',
  'Pennsylvania',
  'Philadelphia',
  '750 Race St, Philadelphia, PA 19106',
  '(215) 686-3013',
  'https://www.phillypolice.com',
  39,
  9100000
),
(
  'Minneapolis Police Department',
  'Police Department',
  'Minnesota',
  'Minneapolis',
  '350 S 5th St, Minneapolis, MN 55415',
  '(612) 673-3000',
  'https://www.minneapolismn.gov/government/departments/police/',
  20,
  27000000
),
(
  'Louisville Metro Police Department',
  'Police Department',
  'Kentucky',
  'Louisville',
  '633 W Jefferson St, Louisville, KY 40202',
  '(502) 574-7111',
  'https://www.louisville-police.org',
  19,
  12000000
),
(
  'North Charleston Police Department',
  'Police Department',
  'South Carolina',
  'North Charleston',
  '2500 City Hall Ln, North Charleston, SC 29406',
  '(843) 554-5700',
  'https://www.northcharleston.org/government/police/',
  8,
  6700000
),
(
  'Fort Worth Police Department',
  'Police Department',
  'Texas',
  'Fort Worth',
  '505 W Felix St, Fort Worth, TX 76115',
  '(817) 392-4200',
  'https://www.fortworthpd.com',
  24,
  9000000
),
(
  'St. Anthony Police Department',
  'Police Department',
  'Minnesota',
  'St. Anthony',
  '3301 Silver Lake Rd, St. Anthony, MN 55418',
  '(612) 782-3350',
  'https://savmn.com/193/Police-Department',
  3,
  3000000
);

TRUNCATE officers RESTART IDENTITY CASCADE;

INSERT INTO officers (
  agency_id,
  badge_number,
  first_name,
  last_name,
  rank,
  total_violations
) VALUES
(
  (SELECT id FROM agencies WHERE name = 'Minneapolis Police Department'),
  NULL,
  'Derek',
  'Chauvin',
  'Former Officer',
  18
),
(
  (SELECT id FROM agencies WHERE name = 'Louisville Metro Police Department'),
  NULL,
  'Brett',
  'Hankison',
  'Former Detective',
  26
),
(
  (SELECT id FROM agencies WHERE name = 'North Charleston Police Department'),
  NULL,
  'Michael',
  'Slager',
  'Former Officer',
  2
),
(
  (SELECT id FROM agencies WHERE name = 'Fort Worth Police Department'),
  NULL,
  'Aaron',
  'Dean',
  'Former Officer',
  1
),
(
  (SELECT id FROM agencies WHERE name = 'St. Anthony Police Department'),
  NULL,
  'Jeronimo',
  'Yanez',
  'Former Officer',
  1
);
