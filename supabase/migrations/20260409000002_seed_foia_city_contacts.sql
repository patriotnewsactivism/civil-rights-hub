-- Seed FOIA / public records contacts for major US cities
-- Covers 30 major US cities with specific records request contacts
-- Uses correct foia_agencies table schema

INSERT INTO public.foia_agencies (
  name, agency_type, city, state,
  foia_email, foia_online_portal_url, foia_phone,
  standard_response_days, notes, is_active,
  accepts_email, accepts_online, accepts_mail,
  website_url
) VALUES

-- NEW YORK CITY
('NYC Police Department – Records Access Officer', 'Municipal', 'New York City', 'New York',
 'foilrequest@nypd.org', 'https://www.nyc.gov/site/nypd/bureaus/administrative/legal-matters-division-foil.page', '(646) 610-5400',
 5, 'NYPD has a 5-day acknowledgment requirement. Body cam footage requests have special procedures. Governed by NY FOIL (POL § 84-90) and NY Civil Rights Law § 50-a.',
 true, true, true, true, 'https://www.nyc.gov/site/nypd/index.page'),

('NYC Department of Records and Information Services', 'Municipal', 'New York City', 'New York',
 'records@records.nyc.gov', 'https://a860-openrecords.nyc.gov', '(212) 788-8300',
 20, 'Online portal preferred. NY FOIL (POL § 84-90). Scanned documents provided free; physical copies $0.25/page.',
 true, true, true, true, 'https://www.nyc.gov/site/records/index.page'),

-- LOS ANGELES
('Los Angeles Police Department – Public Records Center', 'Municipal', 'Los Angeles', 'California',
 NULL, 'https://lapdonline.org/office-of-the-chief-of-police/legal-affairs-division/public-records-act-requests/', '(213) 486-0600',
 10, 'CA Government Code § 6250 (CPRA). Requests for SB 1421 records (officer misconduct) have streamlined processing.',
 true, false, true, true, 'https://lapdonline.org'),

('City of Los Angeles – City Clerk Records', 'Municipal', 'Los Angeles', 'California',
 'clerk.PublicRecords@lacity.org', 'https://cityclerk.lacity.gov/lacityclerkconnect/', '(213) 978-1055',
 10, 'CA Government Code § 6250 (CPRA). 10-day response with 14-day extension option.',
 true, true, true, true, 'https://cityclerk.lacity.gov'),

-- CHICAGO
('Chicago Police Department – FOIA Office', 'Municipal', 'Chicago', 'Illinois',
 'cpdfoia@chicagopolice.org', 'https://www.chicagopolice.org/about/cpd-office-of-legal-affairs/freedom-of-information-act-foia/', '(312) 745-6001',
 5, 'Illinois FOIA (5 ILCS 140/). 5-day acknowledgment; 21 calendar days for full response.',
 true, true, true, true, 'https://www.chicagopolice.org'),

('City of Chicago – Department of Law FOIA', 'Municipal', 'Chicago', 'Illinois',
 'CorpCounsel-FOIA@cityofchicago.org', 'https://www.chicago.gov/city/en/depts/law/supp_info/foia_requests.html', '(312) 744-4737',
 5, 'Illinois FOIA (5 ILCS 140/).',
 true, true, true, true, 'https://www.chicago.gov'),

-- HOUSTON
('Houston Police Department – Open Records', 'Municipal', 'Houston', 'Texas',
 'hpdopenrecords@houstonpolice.org', 'https://www.houstontx.gov/police/records/', '(713) 884-3131',
 10, 'Texas Public Information Act (Gov''t Code Ch. 552). 10-day response; AG opinion may be requested for exemptions.',
 true, true, true, true, 'https://www.houstontx.gov/police'),

('City of Houston – City Secretary Open Records', 'Municipal', 'Houston', 'Texas',
 'public.information@houstontx.gov', 'https://www.houstontx.gov/citysec/openrecords.html', '(832) 393-1100',
 10, 'Texas Public Information Act (Gov''t Code Ch. 552).',
 true, true, true, true, 'https://www.houstontx.gov'),

-- PHOENIX
('Phoenix Police Department – Records Unit', 'Municipal', 'Phoenix', 'Arizona',
 NULL, 'https://www.phoenix.gov/police/open-records', '(602) 262-7626',
 10, 'Arizona Public Records Law (A.R.S. § 39-121). Records available at Records Unit, 620 W. Washington St.',
 false, true, true, true, 'https://www.phoenix.gov/police'),

('City of Phoenix – City Clerk Public Records', 'Municipal', 'Phoenix', 'Arizona',
 'publicrecords@phoenix.gov', 'https://www.phoenix.gov/cityclerk/publicrecords', '(602) 262-6811',
 10, 'Arizona Public Records Law (A.R.S. § 39-121).',
 true, true, true, true, 'https://www.phoenix.gov/cityclerk'),

-- PHILADELPHIA
('Philadelphia Police Department – Public Records', 'Municipal', 'Philadelphia', 'Pennsylvania',
 'records@phillypolice.com', 'https://www.phillypolice.com/resources/open-records/', '(215) 686-3013',
 5, 'Pennsylvania Right-to-Know Law (65 P.S. § 67.101). 5-day response; 30-day extension available.',
 true, true, true, true, 'https://www.phillypolice.com'),

-- SAN ANTONIO
('San Antonio Police Department – Open Records', 'Municipal', 'San Antonio', 'Texas',
 'sapd.openrecords@sanantonio.gov', 'https://www.sanantonio.gov/SAPD/FOIA', '(210) 207-7310',
 10, 'Texas Public Information Act (Gov''t Code Ch. 552).',
 true, true, true, true, 'https://www.sanantonio.gov/SAPD'),

-- SAN DIEGO
('San Diego Police Department – Records Division', 'Municipal', 'San Diego', 'California',
 NULL, 'https://www.sandiego.gov/police/about/records', '(619) 531-2846',
 10, 'CA Government Code § 6250 (CPRA).',
 false, true, true, true, 'https://www.sandiego.gov/police'),

-- DALLAS
('Dallas Police Department – Open Records', 'Municipal', 'Dallas', 'Texas',
 'openrecords@dallascityhall.com', 'https://dallascityhall.com/departments/police/Pages/open-records.aspx', '(214) 671-3494',
 10, 'Texas Public Information Act (Gov''t Code Ch. 552).',
 true, true, true, true, 'https://dallascityhall.com/departments/police'),

-- JACKSONVILLE
('Jacksonville Sheriff''s Office – Records Unit', 'Municipal', 'Jacksonville', 'Florida',
 'recordsunit@jaxsheriff.org', 'https://www.jaxsheriff.org/about-jso/records', '(904) 630-0500',
 10, 'Florida Public Records Law (Ch. 119, F.S.). 10-day response; fees vary by format.',
 true, true, true, true, 'https://www.jaxsheriff.org'),

-- AUSTIN
('Austin Police Department – Open Records', 'Municipal', 'Austin', 'Texas',
 'apd.openrecords@austintexas.gov', 'https://www.austintexas.gov/department/open-records', '(512) 974-5010',
 10, 'Texas Public Information Act (Gov''t Code Ch. 552).',
 true, true, true, true, 'https://www.austintexas.gov/department/police'),

-- SAN FRANCISCO
('San Francisco Police Department – Records Division', 'Municipal', 'San Francisco', 'California',
 'sfpd.records@sfgov.org', 'https://sfgov.org/policecommission/records-requests', '(415) 575-4000',
 10, 'CA Government Code § 6250 (CPRA); SF Admin Code § 67.21. SB 1421 records have specific process.',
 true, true, true, true, 'https://www.sf.gov/departments/police-department'),

('City and County of San Francisco – City Attorney CPRA', 'Municipal', 'San Francisco', 'California',
 'sfca.public.records@sfcityatty.org', 'https://sfcityattorney.org/public-records/', '(415) 554-4700',
 10, 'CA Government Code § 6250 (CPRA).',
 true, true, true, true, 'https://sfcityattorney.org'),

-- COLUMBUS
('Columbus Division of Police – Records Section', 'Municipal', 'Columbus', 'Ohio',
 NULL, 'https://www.columbus.gov/police/open-records/', '(614) 645-4600',
 8, 'Ohio Public Records Law (R.C. § 149.43). 8-calendar-day response per Ohio law.',
 false, true, true, true, 'https://www.columbus.gov/police'),

-- INDIANAPOLIS
('Indianapolis Metropolitan Police Department – Records', 'Municipal', 'Indianapolis', 'Indiana',
 'impd.records@indy.gov', 'https://www.indy.gov/activity/public-records-request', '(317) 327-3811',
 7, 'Indiana Access to Public Records Act (IC 5-14-3).',
 true, true, true, true, 'https://www.indy.gov/agency/indianapolis-metropolitan-police-department'),

-- SEATTLE
('Seattle Police Department – Public Disclosure', 'Municipal', 'Seattle', 'Washington',
 NULL, 'https://www.seattle.gov/police/about-us/about-policing/public-disclosure', '(206) 684-5420',
 5, 'Washington Public Records Act (RCW 42.56). 5-day response; body cam footage within 45 days.',
 false, true, true, true, 'https://www.seattle.gov/police'),

-- DENVER
('Denver Police Department – Open Records', 'Municipal', 'Denver', 'Colorado',
 'openrecords@denvergov.org', 'https://www.denvergov.org/openrecords', '(720) 913-1311',
 3, 'Colorado Open Records Act (C.R.S. § 24-72-201). 3-day response; 7-day extension available; free digital copies.',
 true, true, true, true, 'https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Police-Department'),

-- WASHINGTON DC
('Metropolitan Police Department – FOIA Office', 'Municipal', 'Washington', 'District of Columbia',
 'mpd.foia@dc.gov', 'https://mpdc.dc.gov/page/freedom-information-act-foia-requests', '(202) 727-4261',
 15, 'DC Freedom of Information Act (D.C. Official Code § 2-531 et seq.). 15-business-day response.',
 true, true, true, true, 'https://mpdc.dc.gov'),

('DC Office of Open Government', 'Municipal', 'Washington', 'District of Columbia',
 'opendc@dc.gov', 'https://bega.dc.gov/page/office-open-government', '(202) 481-3411',
 15, 'DC Freedom of Information Act. Appeals go here for denied DC FOIA requests.',
 true, true, true, true, 'https://bega.dc.gov'),

-- NASHVILLE
('Metro Nashville Police Department – Open Records', 'Municipal', 'Nashville', 'Tennessee',
 'mnpd.openrecords@nashville.gov', 'https://www.nashville.gov/departments/police/open-records', '(615) 862-7301',
 7, 'Tennessee Public Records Act (T.C.A. § 10-7-503).',
 true, true, true, true, 'https://www.nashville.gov/departments/police'),

-- PORTLAND
('Portland Police Bureau – Public Records', 'Municipal', 'Portland', 'Oregon',
 'ppbpublicrecords@portlandoregon.gov', 'https://www.portlandoregon.gov/police/55508', '(503) 823-0000',
 10, 'Oregon Public Records Law (ORS 192.311-192.478).',
 true, true, true, true, 'https://www.portland.gov/police'),

-- LAS VEGAS (Clark County Sheriff - LVMPD)
('Las Vegas Metropolitan Police Department – Records Bureau', 'County', 'Las Vegas', 'Nevada',
 'records@lvmpd.com', 'https://www.lvmpd.com/en-us/Pages/Records-Bureau.aspx', '(702) 828-3271',
 30, 'Nevada Public Records Act (NRS 239.001 et seq.). 30-day response under Nevada law.',
 true, true, true, true, 'https://www.lvmpd.com'),

-- MEMPHIS
('Memphis Police Department – Public Records', 'Municipal', 'Memphis', 'Tennessee',
 'mpd.publicrecords@memphistn.gov', 'https://www.memphistn.gov/government/police-department/public-records/', '(901) 636-4357',
 7, 'Tennessee Public Records Act (T.C.A. § 10-7-503).',
 true, true, true, true, 'https://www.memphistn.gov/government/police-department'),

-- BALTIMORE
('Baltimore Police Department – Public Information Act', 'Municipal', 'Baltimore', 'Maryland',
 'bpd.pia@baltimorepolice.org', 'https://www.baltimorepolice.org/transparency/public-information-act', '(410) 396-2020',
 30, 'Maryland Public Information Act (MD Code Ann., Gen. Provis. § 4-101). 30-day response; fee waiver available for public interest.',
 true, true, true, true, 'https://www.baltimorepolice.org'),

-- MILWAUKEE
('Milwaukee Police Department – Open Records', 'Municipal', 'Milwaukee', 'Wisconsin',
 'mpd@milwaukee.gov', 'https://city.milwaukee.gov/police/OpenRecords', '(414) 935-7400',
 10, 'Wisconsin Public Records Law (Wis. Stat. § 19.21 et seq.).',
 true, true, true, true, 'https://city.milwaukee.gov/police'),

-- ALBUQUERQUE
('Albuquerque Police Department – Inspection of Public Records', 'Municipal', 'Albuquerque', 'New Mexico',
 'apd.ipr@cabq.gov', 'https://www.cabq.gov/police/public-records', '(505) 768-2000',
 15, 'New Mexico Inspection of Public Records Act (NMSA 1978, § 14-2-1 et seq.). 15-day response under IPRA.',
 true, true, true, true, 'https://www.cabq.gov/police'),

-- MINNEAPOLIS
('Minneapolis Police Department – Open Records', 'Municipal', 'Minneapolis', 'Minnesota',
 'openrecords@minneapolismn.gov', 'https://www.minneapolismn.gov/resident-services/permits-licenses/all-records-requests/', '(612) 673-2911',
 10, 'Minnesota Government Data Practices Act (Minn. Stat. Ch. 13).',
 true, true, true, true, 'https://www.minneapolismn.gov/government/departments/police'),

-- ATLANTA
('Atlanta Police Department – Open Records', 'Municipal', 'Atlanta', 'Georgia',
 'apd.openrecords@atlantaga.gov', 'https://www.atlantaga.gov/government/departments/police-department/openrecords', '(404) 546-6900',
 3, 'Georgia Open Records Act (O.C.G.A. § 50-18-70). 3-business-day response.',
 true, true, true, true, 'https://www.atlantaga.gov/government/departments/police-department'),

-- MIAMI
('Miami Police Department – Public Records', 'Municipal', 'Miami', 'Florida',
 'mpd.publicrecords@miamigov.com', 'https://www.miamigov.com/Services/Permits-Inspections/Public-Records', '(305) 603-6000',
 10, 'Florida Public Records Law (Ch. 119, F.S.).',
 true, true, true, true, 'https://www.miamigov.com/Services/Public-Safety/Police-Department')

ON CONFLICT DO NOTHING;
