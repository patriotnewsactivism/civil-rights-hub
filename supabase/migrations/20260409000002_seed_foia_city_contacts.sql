-- Seed FOIA / public records contacts for major US cities
-- Covers the 20 largest US cities with specific records request contacts

INSERT INTO public.foia_agencies (
  name, agency_type, city, state, state_code,
  submission_email, submission_url, phone,
  response_deadline_days, statute_citation, notes, is_active
) VALUES

-- NEW YORK CITY
('NYC Police Department – Records Access Officer', 'police', 'New York City', 'New York', 'NY',
 'foilrequest@nypd.org', 'https://www.nyc.gov/site/nypd/bureaus/administrative/legal-matters-division-foil.page', '(646) 610-5400',
 5, 'NY Civil Rights Law § 50-a; NY FOIL (POL § 84-90)', 'NYPD has a 5-day acknowledgment requirement; body cam footage requests have special procedures', true),

('NYC Department of Records and Information Services', 'city_clerk', 'New York City', 'New York', 'NY',
 'records@records.nyc.gov', 'https://a860-openrecords.nyc.gov', '(212) 788-8300',
 20, 'NY FOIL Public Officers Law § 84-90', 'Online portal preferred. Scanned documents provided free; physical copies $0.25/page', true),

-- LOS ANGELES
('Los Angeles Police Department – Public Records Center', 'police', 'Los Angeles', 'California', 'CA',
 NULL, 'https://lapdonline.org/office-of-the-chief-of-police/legal-affairs-division/public-records-act-requests/', '(213) 486-0600',
 10, 'CA Government Code § 6250 (CPRA)', 'Use online portal. Requests for SB 1421 records (officer misconduct) have streamlined processing', true),

('City of Los Angeles – City Clerk Records', 'city_clerk', 'Los Angeles', 'California', 'CA',
 'clerk.PublicRecords@lacity.org', 'https://cityclerk.lacity.gov/lacityclerkconnect/index.cfm?fa=ccfi.viewrecords', '(213) 978-1055',
 10, 'CA Government Code § 6250 (CPRA)', '10-day response with 14-day extension option', true),

-- CHICAGO
('Chicago Police Department – FOIA Office', 'police', 'Chicago', 'Illinois', 'IL',
 'cpdfoia@chicagopolice.org', 'https://www.chicagopolice.org/about/cpd-office-of-legal-affairs/freedom-of-information-act-foia/', '(312) 745-6001',
 5, 'Illinois FOIA (5 ILCS 140/)', '5-day acknowledgment; 21 calendar days for full response', true),

('City of Chicago – Department of Law FOIA', 'city', 'Chicago', 'Illinois', 'IL',
 'CorpCounsel-FOIA@cityofchicago.org', 'https://www.chicago.gov/city/en/depts/law/supp_info/foia_requests.html', '(312) 744-4737',
 5, 'Illinois FOIA (5 ILCS 140/)', NULL, true),

-- HOUSTON
('Houston Police Department – Open Records', 'police', 'Houston', 'Texas', 'TX',
 'hpdopenrecords@houstonpolice.org', 'https://www.houstontx.gov/police/records/', '(713) 884-3131',
 10, 'Texas Public Information Act (Gov''t Code Ch. 552)', '10-day response; AG opinion may be requested for exemptions', true),

('City of Houston – City Secretary', 'city_clerk', 'Houston', 'Texas', 'TX',
 'public.information@houstontx.gov', 'https://www.houstontx.gov/citysec/openrecords.html', '(832) 393-1100',
 10, 'Texas Public Information Act (Gov''t Code Ch. 552)', NULL, true),

-- PHOENIX
('Phoenix Police Department – Records Unit', 'police', 'Phoenix', 'Arizona', 'AZ',
 NULL, 'https://www.phoenix.gov/police/open-records', '(602) 262-7626',
 10, 'Arizona Public Records Law (A.R.S. § 39-121)', 'Records available at Records Unit, 620 W. Washington St.', true),

('City of Phoenix – City Clerk', 'city_clerk', 'Phoenix', 'Arizona', 'AZ',
 'publicrecords@phoenix.gov', 'https://www.phoenix.gov/cityclerk/publicrecords', '(602) 262-6811',
 10, 'Arizona Public Records Law (A.R.S. § 39-121)', NULL, true),

-- PHILADELPHIA
('Philadelphia Police Department – Public Records', 'police', 'Philadelphia', 'Pennsylvania', 'PA',
 'records@phillypolice.com', 'https://www.phillypolice.com/resources/open-records/', '(215) 686-3013',
 5, 'Pennsylvania Right-to-Know Law (65 P.S. § 67.101 et seq.)', '5-day response; 30-day extension available', true),

-- SAN ANTONIO
('San Antonio Police Department – Open Records', 'police', 'San Antonio', 'Texas', 'TX',
 'sapd.openrecords@sanantonio.gov', 'https://www.sanantonio.gov/SAPD/FOIA', '(210) 207-7310',
 10, 'Texas Public Information Act (Gov''t Code Ch. 552)', NULL, true),

-- SAN DIEGO
('San Diego Police Department – Records Division', 'police', 'San Diego', 'California', 'CA',
 NULL, 'https://www.sandiego.gov/police/about/records', '(619) 531-2846',
 10, 'CA Government Code § 6250 (CPRA)', NULL, true),

-- DALLAS
('Dallas Police Department – Open Records', 'police', 'Dallas', 'Texas', 'TX',
 'openrecords@dallascityhall.com', 'https://dallascityhall.com/departments/police/Pages/open-records.aspx', '(214) 671-3494',
 10, 'Texas Public Information Act (Gov''t Code Ch. 552)', NULL, true),

-- JACKSONVILLE
('Jacksonville Sheriff''s Office – Records Unit', 'police', 'Jacksonville', 'Florida', 'FL',
 'recordsunit@jaxsheriff.org', 'https://www.jaxsheriff.org/about-jso/records', '(904) 630-0500',
 10, 'Florida Public Records Law (Ch. 119, F.S.)', '10-day response; fees vary by format', true),

-- AUSTIN
('Austin Police Department – Open Records', 'police', 'Austin', 'Texas', 'TX',
 'apd.openrecords@austintexas.gov', 'https://www.austintexas.gov/department/open-records', '(512) 974-5010',
 10, 'Texas Public Information Act (Gov''t Code Ch. 552)', NULL, true),

-- SAN FRANCISCO
('San Francisco Police Department – Records Division', 'police', 'San Francisco', 'California', 'CA',
 'sfpd.records@sfgov.org', 'https://sfgov.org/policecommission/records-requests', '(415) 575-4000',
 10, 'CA Government Code § 6250 (CPRA); SF Admin Code § 67.21', '10-day response; SB 1421 records have specific process', true),

('City and County of San Francisco – City Attorney', 'city', 'San Francisco', 'California', 'CA',
 'sfca.public.records@sfcityatty.org', 'https://sfcityattorney.org/public-records/', '(415) 554-4700',
 10, 'CA Government Code § 6250 (CPRA)', NULL, true),

-- COLUMBUS
('Columbus Division of Police – Records', 'police', 'Columbus', 'Ohio', 'OH',
 NULL, 'https://www.columbus.gov/police/open-records/', '(614) 645-4600',
 8, 'Ohio Public Records Law (R.C. § 149.43)', '8-calendar-day response per Ohio law', true),

-- INDIANAPOLIS
('Indianapolis Metropolitan Police Department – Records', 'police', 'Indianapolis', 'Indiana', 'IN',
 'impd.records@indy.gov', 'https://www.indy.gov/activity/public-records-request', '(317) 327-3811',
 7, 'Indiana Access to Public Records Act (IC 5-14-3)', NULL, true),

-- SEATTLE
('Seattle Police Department – Public Disclosure', 'police', 'Seattle', 'Washington', 'WA',
 NULL, 'https://www.seattle.gov/police/about-us/about-policing/public-disclosure', '(206) 684-5420',
 5, 'Washington Public Records Act (RCW 42.56)', '5-day response; body cam footage in 45 days', true),

-- DENVER
('Denver Police Department – Open Records', 'police', 'Denver', 'Colorado', 'CO',
 'openrecords@denvergov.org', 'https://www.denvergov.org/openrecords', '(720) 913-1311',
 3, 'Colorado Open Records Act (C.R.S. § 24-72-201)', '3-day response; 7-day extension; free digital copies', true),

-- WASHINGTON DC
('Metropolitan Police Department – FOIA', 'police', 'Washington', 'District of Columbia', 'DC',
 'mpd.foia@dc.gov', 'https://mpdc.dc.gov/page/freedom-information-act-foia-requests', '(202) 727-4261',
 15, 'DC Freedom of Information Act (D.C. Official Code § 2-531 et seq.)', '15-business-day response', true),

('DC Office of Open Government', 'city', 'Washington', 'District of Columbia', 'DC',
 'opendc@dc.gov', 'https://bega.dc.gov/page/office-open-government', '(202) 481-3411',
 15, 'DC Freedom of Information Act (D.C. Official Code § 2-531 et seq.)', 'Appeals go here for denied DC FOIA requests', true),

-- NASHVILLE
('Metro Nashville Police Department – Open Records', 'police', 'Nashville', 'Tennessee', 'TN',
 'mnpd.openrecords@nashville.gov', 'https://www.nashville.gov/departments/police/open-records', '(615) 862-7301',
 7, 'Tennessee Public Records Act (T.C.A. § 10-7-503)', NULL, true),

-- OKLAHOMA CITY
('Oklahoma City Police Department – Records', 'police', 'Oklahoma City', 'Oklahoma', 'OK',
 NULL, 'https://www.okc.gov/departments/police/open-records', '(405) 297-1117',
 3, 'Oklahoma Open Records Act (51 O.S. § 24A.1 et seq.)', '3-business-day response', true),

-- LOUISVILLE
('Louisville Metro Police Department – Records', 'police', 'Louisville', 'Kentucky', 'KY',
 'lmpd.records@louisvilleky.gov', 'https://louisvilleky.gov/government/police/records-unit', '(502) 574-7111',
 3, 'Kentucky Open Records Act (KRS 61.870 et seq.)', NULL, true),

-- PORTLAND
('Portland Police Bureau – Public Records', 'police', 'Portland', 'Oregon', 'OR',
 'ppbpublicrecords@portlandoregon.gov', 'https://www.portlandoregon.gov/police/55508', '(503) 823-0000',
 10, 'Oregon Public Records Law (ORS 192.311-192.478)', NULL, true),

-- LAS VEGAS
('Las Vegas Metropolitan Police – Records', 'police', 'Las Vegas', 'Nevada', 'NV',
 'records@lvmpd.com', 'https://www.lvmpd.com/en-us/Pages/Records-Bureau.aspx', '(702) 828-3271',
 30, 'Nevada Public Records Act (NRS 239.001 et seq.)', '30-day response under Nevada law', true),

-- MEMPHIS
('Memphis Police Department – Records Request', 'police', 'Memphis', 'Tennessee', 'TN',
 'mpd.publicrecords@memphistn.gov', 'https://www.memphistn.gov/government/police-department/public-records/', '(901) 636-4357',
 7, 'Tennessee Public Records Act (T.C.A. § 10-7-503)', NULL, true),

-- BALTIMORE
('Baltimore Police Department – Public Records', 'police', 'Baltimore', 'Maryland', 'MD',
 'bpd.pia@baltimorepolice.org', 'https://www.baltimorepolice.org/transparency/public-information-act', '(410) 396-2020',
 30, 'Maryland Public Information Act (MD Code Ann., Gen. Provis. § 4-101 et seq.)', '30-day response; waiver available for public interest', true),

-- MILWAUKEE
('Milwaukee Police Department – Records', 'police', 'Milwaukee', 'Wisconsin', 'WI',
 'mpd@milwaukee.gov', 'https://city.milwaukee.gov/police/OpenRecords', '(414) 935-7400',
 10, 'Wisconsin Public Records Law (Wis. Stat. § 19.21 et seq.)', NULL, true),

-- ALBUQUERQUE
('Albuquerque Police Department – Inspection of Public Records', 'police', 'Albuquerque', 'New Mexico', 'NM',
 'apd.ipr@cabq.gov', 'https://www.cabq.gov/police/public-records', '(505) 768-2000',
 15, 'New Mexico Inspection of Public Records Act (NMSA 1978, § 14-2-1 et seq.)', '15-day response under IPRA', true)

ON CONFLICT DO NOTHING;
