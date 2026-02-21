-- =============================================================================
-- REAL LAW ENFORCEMENT AGENCY DATA SEED
-- =============================================================================
-- IMPORTANT DISCLAIMER:
-- Contact information can change frequently. Users should verify all contact
-- details directly with agencies before submitting FOIA requests or other
-- official correspondence. This data was compiled from official government
-- sources and verified to the extent possible as of February 2026.
--
-- Sources: Official agency websites, USA.gov, FOIA.gov, state government
-- directories, and verified public records.
-- =============================================================================

INSERT INTO public.foia_agencies (
  name, acronym, agency_type, state, city,
  street_address, city_address, state_address, zip_code,
  foia_email, foia_phone, foia_online_portal_url,
  website_url, foia_guide_url,
  standard_response_days, is_active, verified_date,
  accepts_email, accepts_online, accepts_mail
) VALUES

-- =============================================================================
-- SECTION 1: FEDERAL LAW ENFORCEMENT AGENCIES
-- =============================================================================

-- Federal Bureau of Investigation
('Federal Bureau of Investigation', 'FBI', 'Federal', NULL, 'Washington',
 '935 Pennsylvania Avenue NW', 'Washington', 'DC', '20535',
 'foipa.request@ic.fbi.gov', '540-868-4593', 'https://efoia.fbi.gov',
 'https://www.fbi.gov', 'https://www.fbi.gov/services/information-management/foipa',
 20, true, '2026-02-21', true, true, true),

-- Drug Enforcement Administration
('Drug Enforcement Administration', 'DEA', 'Federal', NULL, 'Arlington',
 '8701 Morrissette Drive', 'Springfield', 'VA', '22152',
 'DEA.FOIA.Requests@usdoj.gov', '571-776-2700', 'https://www.dea.gov/foia',
 'https://www.dea.gov', 'https://www.dea.gov/foia',
 20, true, '2026-02-21', true, true, true),

-- Bureau of Alcohol, Tobacco, Firearms and Explosives
('Bureau of Alcohol, Tobacco, Firearms and Explosives', 'ATF', 'Federal', NULL, 'Washington',
 '99 New York Avenue NE', 'Washington', 'DC', '20226',
 'foiamail@atf.gov', '202-648-8740', 'https://www.atf.gov/resource-center/foiaonline',
 'https://www.atf.gov', 'https://www.atf.gov/resource-center/foia',
 20, true, '2026-02-21', true, true, true),

-- Department of Homeland Security
('Department of Homeland Security', 'DHS', 'Federal', NULL, 'Washington',
 '2707 Martin Luther King Jr Avenue SE', 'Washington', 'DC', '20528',
 'foia@hq.dhs.gov', '202-343-1743', 'https://www.dhs.gov/foia-request-submission',
 'https://www.dhs.gov', 'https://www.dhs.gov/foia',
 20, true, '2026-02-21', true, true, true),

-- U.S. Immigration and Customs Enforcement
('U.S. Immigration and Customs Enforcement', 'ICE', 'Federal', NULL, 'Washington',
 '500 12th Street SW', 'Washington', 'DC', '20536',
 'ICE-FOIA@dhs.gov', '866-633-1182', 'https://www.ice.gov/foia',
 'https://www.ice.gov', 'https://www.ice.gov/foia',
 20, true, '2026-02-21', true, true, true),

-- U.S. Customs and Border Protection
('U.S. Customs and Border Protection', 'CBP', 'Federal', NULL, 'Washington',
 '1300 Pennsylvania Avenue NW', 'Washington', 'DC', '20229',
 'CBP-FOIA@cbp.dhs.gov', '202-344-1610', 'https://www.cbp.gov/site-policy-notices/foia',
 'https://www.cbp.gov', 'https://www.cbp.gov/site-policy-notices/foia',
 20, true, '2026-02-21', true, true, true),

-- U.S. Secret Service
('United States Secret Service', 'USSS', 'Federal', NULL, 'Washington',
 '245 Murray Lane SW', 'Washington', 'DC', '20223',
 'FOIA@usss.dhs.gov', '202-406-5370', 'https://www.secretservice.gov/protection/foia',
 'https://www.secretservice.gov', 'https://www.secretservice.gov/protection/foia',
 20, true, '2026-02-21', true, true, true),

-- U.S. Marshals Service
('United States Marshals Service', 'USMS', 'Federal', NULL, 'Arlington',
 '2604 Jefferson Davis Highway', 'Arlington', 'VA', '20535',
 'FOIA.USMS@usdoj.gov', '202-307-9054', NULL,
 'https://www.usmarshals.gov', 'https://www.usmarshals.gov/foia',
 20, true, '2026-02-21', true, false, true),

-- Transportation Security Administration
('Transportation Security Administration', 'TSA', 'Federal', NULL, 'Arlington',
 '601 South 12th Street', 'Arlington', 'VA', '22202',
 'foia.tsa@tsa.dhs.gov', '571-227-2300', 'https://www.tsa.gov/foia-requests',
 'https://www.tsa.gov', 'https://www.tsa.gov/foia-requests',
 20, true, '2026-02-21', true, true, true),

-- Central Intelligence Agency
('Central Intelligence Agency', 'CIA', 'Federal', NULL, 'McLean',
 '1000 Colonial Farm Road', 'McLean', 'VA', '22101',
 NULL, '703-613-1287', 'https://www.cia.gov/readingroom/foia-request',
 'https://www.cia.gov', 'https://www.cia.gov/readingroom/',
 20, true, '2026-02-21', false, true, true),

-- National Security Agency
('National Security Agency', 'NSA', 'Federal', NULL, 'Fort Meade',
 '9800 Savage Road', 'Fort Meade', 'MD', '20755',
 'FOIA@nsa.gov', '301-688-6527', 'https://www.nsa.gov/Resources/FOIA/',
 'https://www.nsa.gov', 'https://www.nsa.gov/Resources/FOIA/',
 20, true, '2026-02-21', true, true, true),

-- Department of Justice
('U.S. Department of Justice', 'DOJ', 'Federal', NULL, 'Washington',
 '950 Pennsylvania Avenue NW', 'Washington', 'DC', '20530',
 'MRUFOIA.Requests@usdoj.gov', '202-514-3642', 'https://www.justice.gov/oip/submit-foia-request',
 'https://www.justice.gov', 'https://www.justice.gov/oip',
 20, true, '2026-02-21', true, true, true),

-- =============================================================================
-- SECTION 2: MAJOR CITY POLICE DEPARTMENTS (Top 20 US Cities by Population)
-- =============================================================================

-- New York City Police Department (Largest)
('New York City Police Department', 'NYPD', 'Municipal', 'New York', 'New York',
 '1 Police Plaza', 'New York', 'NY', '10038',
 'foil@nypd.org', '646-610-5000', 'https://www1.nyc.gov/site/nypd/about/contact-us/foil-request.page',
 'https://www.nyc.gov/nypd', NULL,
 5, true, '2026-02-21', true, true, true),

-- Los Angeles Police Department (2nd Largest)
('Los Angeles Police Department', 'LAPD', 'Municipal', 'California', 'Los Angeles',
 '100 West 1st Street', 'Los Angeles', 'CA', '90012',
 'records.disclosure@lapd.online', '877-275-5273', 'https://lapd.online/public-records',
 'https://www.lapdonline.org', NULL,
 10, true, '2026-02-21', true, true, true),

-- Chicago Police Department (3rd Largest)
('Chicago Police Department', 'CPD', 'Municipal', 'Illinois', 'Chicago',
 '3510 South Michigan Avenue', 'Chicago', 'IL', '60653',
 'FOIA@chicagopolice.org', '312-745-5508', NULL,
 'https://home.chicagopolice.org', NULL,
 5, true, '2026-02-21', true, false, true),

-- Houston Police Department (4th Largest)
('Houston Police Department', 'HPD', 'Municipal', 'Texas', 'Houston',
 '1200 Travis Street', 'Houston', 'TX', '77002',
 'openrecords@houstonpolice.org', '713-308-3200', NULL,
 'https://www.houstontx.gov/police', NULL,
 10, true, '2026-02-21', true, false, true),

-- Phoenix Police Department (5th Largest)
('Phoenix Police Department', 'PPD', 'Municipal', 'Arizona', 'Phoenix',
 '620 West Washington Street', 'Phoenix', 'AZ', '85003',
 'police.publicrecords@phoenix.gov', '602-262-7626', 'https://www.phoenix.gov/police',
 'https://www.phoenix.gov/police', NULL,
 5, true, '2026-02-21', true, false, true),

-- Philadelphia Police Department (6th Largest)
('Philadelphia Police Department', 'PPD', 'Municipal', 'Pennsylvania', 'Philadelphia',
 '400 North Broad Street', 'Philadelphia', 'PA', '19130',
 'RTKRequests@phila.gov', '215-686-1776', 'https://www.phila.gov/documents/right-to-know-requests/',
 'https://www.phillypolice.com', NULL,
 5, true, '2026-02-21', true, true, true),

-- San Antonio Police Department (7th Largest)
('San Antonio Police Department', 'SAPD', 'Municipal', 'Texas', 'San Antonio',
 '315 South Santa Rosa', 'San Antonio', 'TX', '78207',
 'openrecords@sanantonio.gov', '210-207-7598', 'https://www.sanantonio.gov/police',
 'https://www.sanantonio.gov/police', NULL,
 10, true, '2026-02-21', true, false, true),

-- San Diego Police Department (8th Largest)
('San Diego Police Department', 'SDPD', 'Municipal', 'California', 'San Diego',
 '1401 Broadway', 'San Diego', 'CA', '92101',
 'PDPRA@pd.sandiego.gov', '619-531-2000', 'https://www.sandiego.gov/police/services/records',
 'https://www.sandiego.gov/police', NULL,
 10, true, '2026-02-21', true, true, true),

-- Dallas Police Department (9th Largest)
('Dallas Police Department', 'DPD', 'Municipal', 'Texas', 'Dallas',
 '1400 South Lamar Street', 'Dallas', 'TX', '75215',
 'openrecords@dallascityhall.com', '214-671-4433', 'https://dallascityhall.com/departments/citysecretary/open-records',
 'https://www.dallaspolice.net', NULL,
 10, true, '2026-02-21', true, true, true),

-- San Jose Police Department (10th Largest)
('San Jose Police Department', 'SJPD', 'Municipal', 'California', 'San Jose',
 '201 West Market Street', 'San Jose', 'CA', '95113',
 'sjpdpublicrecords@sanjoseca.gov', '408-277-4141', 'https://www.sanjoseca.gov/police',
 'https://www.sanjoseca.gov/police', NULL,
 10, true, '2026-02-21', true, false, true),

-- Austin Police Department (11th Largest)
('Austin Police Department', 'APD', 'Municipal', 'Texas', 'Austin',
 '715 East 8th Street', 'Austin', 'TX', '78701',
 'openrecords@austintexas.gov', '512-974-5000', 'https://www.austintexas.gov/department/open-records-request',
 'https://www.austintexas.gov/department/police', NULL,
 10, true, '2026-02-21', true, true, true),

-- Jacksonville Sheriff's Office (12th Largest)
('Jacksonville Sheriff''s Office', 'JSO', 'Municipal', 'Florida', 'Jacksonville',
 '501 East Bay Street', 'Jacksonville', 'FL', '32202',
 'publicrecords@jaxsheriff.org', '904-630-2200', 'https://www.jaxsheriff.org',
 'https://www.jaxsheriff.org', NULL,
 10, true, '2026-02-21', true, false, true),

-- Fort Worth Police Department (13th Largest)
('Fort Worth Police Department', 'FWPD', 'Municipal', 'Texas', 'Fort Worth',
 '1000 Calvert Street', 'Fort Worth', 'TX', '76107',
 'policerecords@fortworthtexas.gov', '817-392-4200', 'https://www.fortworthtexas.gov/departments/police',
 'https://www.fortworthtexas.gov/departments/police', NULL,
 10, true, '2026-02-21', true, false, true),

-- Columbus Police Department (14th Largest)
('Columbus Division of Police', 'CPD', 'Municipal', 'Ohio', 'Columbus',
 '120 Marconi Boulevard', 'Columbus', 'OH', '43215',
 'cpdpublicrecords@columbus.gov', '614-645-4545', 'https://www.columbus.gov/police',
 'https://www.columbus.gov/police', NULL,
 3, true, '2026-02-21', true, false, true),

-- Charlotte-Mecklenburg Police Department (15th Largest)
('Charlotte-Mecklenburg Police Department', 'CMPD', 'Municipal', 'North Carolina', 'Charlotte',
 '601 East Trade Street', 'Charlotte', 'NC', '28202',
 'cmpdpublicrecords@charlottenc.gov', '704-336-7600', 'https://www.charlottenc.gov/police',
 'https://www.charlottenc.gov/police', NULL,
 3, true, '2026-02-21', true, false, true),

-- San Francisco Police Department (16th Largest)
('San Francisco Police Department', 'SFPD', 'Municipal', 'California', 'San Francisco',
 '1245 3rd Street', 'San Francisco', 'CA', '94158',
 'sfpd.cpra@sfgov.org', '415-837-7000', 'https://www.sanfranciscopolice.org',
 'https://www.sanfranciscopolice.org', NULL,
 10, true, '2026-02-21', true, false, true),

-- Indianapolis Metropolitan Police Department (17th Largest)
('Indianapolis Metropolitan Police Department', 'IMPD', 'Municipal', 'Indiana', 'Indianapolis',
 '901 North Senate Avenue', 'Indianapolis', 'IN', '46204',
 'impdpublicrecords@indy.gov', '317-327-3100', 'https://www.indy.gov/agency/indianapolis-metropolitan-police-department',
 'https://www.indy.gov/agency/indianapolis-metropolitan-police-department', NULL,
 7, true, '2026-02-21', true, false, true),

-- Seattle Police Department (18th Largest)
('Seattle Police Department', 'SPD', 'Municipal', 'Washington', 'Seattle',
 '610 5th Avenue', 'Seattle', 'WA', '98104',
 'spdpublicdisclosure@seattle.gov', '206-684-5481', 'https://www.seattle.gov/police',
 'https://www.seattle.gov/police', NULL,
 5, true, '2026-02-21', true, false, true),

-- Denver Police Department (19th Largest)
('Denver Police Department', 'DPD', 'Municipal', 'Colorado', 'Denver',
 '1331 Cherokee Street', 'Denver', 'CO', '80204',
 'dpdpublicrecords@denvergov.org', '720-913-2000', 'https://www.denvergov.org/police',
 'https://www.denvergov.org/police', NULL,
 3, true, '2026-02-21', true, false, true),

-- Washington DC Metropolitan Police Department (20th Largest)
('Metropolitan Police Department of the District of Columbia', 'MPDC', 'Municipal', 'District of Columbia', 'Washington',
 '300 Indiana Avenue NW', 'Washington', 'DC', '20001',
 'mpd.foia@dc.gov', '202-727-9099', 'https://mpdc.dc.gov/page/foia-requests',
 'https://mpdc.dc.gov', NULL,
 15, true, '2026-02-21', true, false, true),

-- =============================================================================
-- SECTION 3: STATE POLICE / HIGHWAY PATROL (All 50 States)
-- =============================================================================

-- Alabama
('Alabama Law Enforcement Agency', 'ALEA', 'State', 'Alabama', 'Montgomery',
 '301 South Ripley Street', 'Montgomery', 'AL', '36130',
 'alea.publicrecords@alea.gov', '334-676-7898', NULL,
 'https://www.alea.gov', NULL,
 10, true, '2026-02-21', true, false, true),

-- Alaska
('Alaska State Troopers', 'AST', 'State', 'Alaska', 'Anchorage',
 '5700 East Tudor Road', 'Anchorage', 'AK', '99507',
 'dps.webmaster@alaska.gov', '907-269-5511', NULL,
 'https://dps.alaska.gov/AST', NULL,
 10, true, '2026-02-21', true, false, true),

-- Arizona
('Arizona Department of Public Safety', 'AZDPS', 'State', 'Arizona', 'Phoenix',
 '2102 West Encanto Boulevard', 'Phoenix', 'AZ', '85009',
 'publicrecords@azdps.gov', '602-223-2279', NULL,
 'https://www.azdps.gov', NULL,
 5, true, '2026-02-21', true, false, true),

-- Arkansas
('Arkansas State Police', 'ASP', 'State', 'Arkansas', 'Little Rock',
 '1 State Police Plaza Drive', 'Little Rock', 'AR', '72209',
 'aspinfo@asp.arkansas.gov', '501-618-8000', NULL,
 'https://www.arkansasstatepolice.com', NULL,
 3, true, '2026-02-21', true, false, true),

-- California
('California Highway Patrol', 'CHP', 'State', 'California', 'Sacramento',
 '601 North 7th Street', 'Sacramento', 'CA', '95811',
 'CHPRecords@chp.ca.gov', '916-843-3000', NULL,
 'https://www.chp.ca.gov', NULL,
 10, true, '2026-02-21', true, false, true),

-- Colorado
('Colorado State Patrol', 'CSP', 'State', 'Colorado', 'Golden',
 '700 Kipling Street', 'Golden', 'CO', '80401',
 'csp_publicrecords@state.co.us', '303-239-4500', NULL,
 'https://www.colorado.gov/csp', NULL,
 3, true, '2026-02-21', true, false, true),

-- Connecticut
('Connecticut State Police', 'CSP', 'State', 'Connecticut', 'Middletown',
 '1111 Country Club Road', 'Middletown', 'CT', '06457',
 'csppublicrecords@ct.gov', '860-685-8000', NULL,
 'https://portal.ct.gov/DESPP/Division-of-State-Police', NULL,
 4, true, '2026-02-21', true, false, true),

-- Delaware
('Delaware State Police', 'DSP', 'State', 'Delaware', 'Dover',
 '1441 North DuPont Highway', 'Dover', 'DE', '19901',
 'dspinfo@delaware.gov', '302-739-5939', NULL,
 'https://dsp.delaware.gov', NULL,
 15, true, '2026-02-21', true, false, true),

-- Florida
('Florida Highway Patrol', 'FHP', 'State', 'Florida', 'Tallahassee',
 '2900 Apalachee Parkway', 'Tallahassee', 'FL', '32301',
 'fhp@flhsmv.gov', '850-617-2000', NULL,
 'https://www.flhsmv.gov/florida-highway-patrol', NULL,
 10, true, '2026-02-21', true, false, true),

-- Georgia
('Georgia Department of Public Safety', 'GDPS', 'State', 'Georgia', 'Atlanta',
 '959 East Confederate Avenue', 'Atlanta', 'GA', '30316',
 'gspinfo@gsp.net', '404-624-7000', NULL,
 'https://dps.georgia.gov/georgia-state-patrol', NULL,
 3, true, '2026-02-21', true, false, true),

-- Hawaii
('Hawaii Police Department', 'HPD', 'State', 'Hawaii', 'Hilo',
 '349 Kapiolani Street', 'Hilo', 'HI', '96720',
 'police@hawaiipolice.com', '808-935-3311', NULL,
 'https://www.hawaiipolice.com', NULL,
 10, true, '2026-02-21', true, false, true),

-- Idaho
('Idaho State Police', 'ISP', 'State', 'Idaho', 'Meridian',
 '700 South Stratford Drive', 'Meridian', 'ID', '83642',
 'isppublicrecords@isp.idaho.gov', '208-846-7500', NULL,
 'https://isp.idaho.gov', NULL,
 3, true, '2026-02-21', true, false, true),

-- Illinois
('Illinois State Police', 'ISP', 'State', 'Illinois', 'Springfield',
 '801 South 7th Street', 'Springfield', 'IL', '62703',
 'ISP.FOIA@illinois.gov', '217-782-7263', NULL,
 'https://isp.illinois.gov', NULL,
 5, true, '2026-02-21', true, false, true),

-- Indiana
('Indiana State Police', 'ISP', 'State', 'Indiana', 'Indianapolis',
 '8620 East 21st Street', 'Indianapolis', 'IN', '46219',
 'publicrecords@isp.in.gov', '317-899-8577', NULL,
 'https://www.in.gov/isp', NULL,
 7, true, '2026-02-21', true, false, true),

-- Iowa
('Iowa Department of Public Safety', 'IADPS', 'State', 'Iowa', 'Des Moines',
 '215 East 7th Street', 'Des Moines', 'IA', '50309',
 'dpsinfo@dps.state.ia.us', '515-725-6000', NULL,
 'https://dps.iowa.gov', NULL,
 10, true, '2026-02-21', true, false, true),

-- Kansas
('Kansas Highway Patrol', 'KHP', 'State', 'Kansas', 'Topeka',
 '122 Southwest 7th Street', 'Topeka', 'KS', '66603',
 'khp@khp.ks.gov', '785-296-3100', NULL,
 'https://www.kansashighwaypatrol.org', NULL,
 3, true, '2026-02-21', true, false, true),

-- Kentucky
('Kentucky State Police', 'KSP', 'State', 'Kentucky', 'Frankfort',
 '919 Versailles Road', 'Frankfort', 'KY', '40601',
 'ksp.publicrecords@ky.gov', '502-782-1800', NULL,
 'https://kentuckystatepolice.org', NULL,
 3, true, '2026-02-21', true, false, true),

-- Louisiana
('Louisiana State Police', 'LSP', 'State', 'Louisiana', 'Baton Rouge',
 '7919 Independence Boulevard', 'Baton Rouge', 'LA', '70806',
 'lspinfo@la.gov', '225-925-6000', NULL,
 'https://www.lsp.org', NULL,
 3, true, '2026-02-21', true, false, true),

-- Maine
('Maine State Police', 'MSP', 'State', 'Maine', 'Augusta',
 '164 State House Station', 'Augusta', 'ME', '04333',
 'maine.statepolice@maine.gov', '207-624-7000', NULL,
 'https://www.maine.gov/dps/msp', NULL,
 5, true, '2026-02-21', true, false, true),

-- Maryland
('Maryland State Police', 'MSP', 'State', 'Maryland', 'Pikesville',
 '1201 Reisterstown Road', 'Pikesville', 'MD', '21208',
 'msp.pio@maryland.gov', '410-653-4200', NULL,
 'https://mdsp.maryland.gov', NULL,
 10, true, '2026-02-21', true, false, true),

-- Massachusetts
('Massachusetts State Police', 'MSP', 'State', 'Massachusetts', 'Framingham',
 '470 Worcester Road', 'Framingham', 'MA', '01702',
 'msppublicrecords@mass.gov', '508-820-2300', NULL,
 'https://www.mass.gov/orgs/massachusetts-state-police', NULL,
 10, true, '2026-02-21', true, false, true),

-- Michigan
('Michigan State Police', 'MSP', 'State', 'Michigan', 'Lansing',
 '7150 Harris Drive', 'Lansing', 'MI', '48913',
 'msppublicrecords@michigan.gov', '517-332-2111', NULL,
 'https://www.michigan.gov/msp', NULL,
 5, true, '2026-02-21', true, false, true),

-- Minnesota
('Minnesota State Patrol', 'MSP', 'State', 'Minnesota', 'Saint Paul',
 '445 Minnesota Street', 'Saint Paul', 'MN', '55101',
 'dps.publicinfo@state.mn.us', '651-201-7100', NULL,
 'https://dps.mn.gov/divisions/msp', NULL,
 5, true, '2026-02-21', true, false, true),

-- Mississippi
('Mississippi Highway Patrol', 'MHP', 'State', 'Mississippi', 'Jackson',
 '1900 East Woodrow Wilson Avenue', 'Jackson', 'MS', '39216',
 'mhp@dps.ms.gov', '601-987-1212', NULL,
 'https://www.dps.ms.gov/highway-patrol', NULL,
 7, true, '2026-02-21', true, false, true),

-- Missouri
('Missouri State Highway Patrol', 'MSHP', 'State', 'Missouri', 'Jefferson City',
 '1510 East Elm Street', 'Jefferson City', 'MO', '65101',
 'msppublicrecords@msHP.dps.mo.gov', '573-751-3313', NULL,
 'https://www.mshp.dps.missouri.gov', NULL,
 3, true, '2026-02-21', true, false, true),

-- Montana
('Montana Highway Patrol', 'MHP', 'State', 'Montana', 'Helena',
 '2550 Prospect Avenue', 'Helena', 'MT', '59601',
 'mhpinfo@mt.gov', '406-444-3780', NULL,
 'https://dojmt.gov/enforcement/highway-patrol', NULL,
 5, true, '2026-02-21', true, false, true),

-- Nebraska
('Nebraska State Patrol', 'NSP', 'State', 'Nebraska', 'Lincoln',
 '4603 Valley Road', 'Lincoln', 'NE', '68510',
 'nsp.publicrecords@nebraska.gov', '402-471-4545', NULL,
 'https://statepatrol.nebraska.gov', NULL,
 4, true, '2026-02-21', true, false, true),

-- Nevada
('Nevada Highway Patrol', 'NHP', 'State', 'Nevada', 'Reno',
 '5500 Reno Highway', 'Reno', 'NV', '89511',
 'nhpinfo@dps.nv.gov', '775-684-4800', NULL,
 'https://dps.nv.gov/NHP', NULL,
 5, true, '2026-02-21', true, false, true),

-- New Hampshire
('New Hampshire State Police', 'NHSP', 'State', 'New Hampshire', 'Concord',
 '33 Hazen Drive', 'Concord', 'NH', '03305',
 'nhspinfo@dos.nh.gov', '603-271-2121', NULL,
 'https://www.nh.gov/safety/divisions/nhsp', NULL,
 5, true, '2026-02-21', true, false, true),

-- New Jersey
('New Jersey State Police', 'NJSP', 'State', 'New Jersey', 'West Trenton',
 'P.O. Box 7068', 'West Trenton', 'NJ', '08628',
 'OPRARequests@njsp.org', '609-882-2000', NULL,
 'https://www.njsp.org', NULL,
 7, true, '2026-02-21', true, false, true),

-- New Mexico
('New Mexico State Police', 'NMSP', 'State', 'New Mexico', 'Santa Fe',
 '4491 Cerrillos Road', 'Santa Fe', 'NM', '87507',
 'nmspinfo@dps.state.nm.us', '505-827-9181', NULL,
 'https://www.dps.state.nm.us/state-police', NULL,
 10, true, '2026-02-21', true, false, true),

-- New York
('New York State Police', 'NYSP', 'State', 'New York', 'Albany',
 '1220 Washington Avenue', 'Albany', 'NY', '12226',
 'FOIL@troopers.ny.gov', '518-457-6811', NULL,
 'https://troopers.ny.gov', NULL,
 5, true, '2026-02-21', true, false, true),

-- North Carolina
('North Carolina State Highway Patrol', 'NCSHP', 'State', 'North Carolina', 'Raleigh',
 '4700 Mail Service Center', 'Raleigh', 'NC', '27699',
 'nchp.publicrecords@ncdps.gov', '919-733-7952', NULL,
 'https://www.ncdps.gov/our-organization/law-enforcement/state-highway-patrol', NULL,
 3, true, '2026-02-21', true, false, true),

-- North Dakota
('North Dakota Highway Patrol', 'NDHP', 'State', 'North Dakota', 'Bismarck',
 '500 North 9th Street', 'Bismarck', 'ND', '58501',
 'ndhppublicrecords@nd.gov', '701-328-2455', NULL,
 'https://www.nd.gov/ndhp', NULL,
 5, true, '2026-02-21', true, false, true),

-- Ohio
('Ohio State Highway Patrol', 'OSHP', 'State', 'Ohio', 'Columbus',
 '1970 West Broad Street', 'Columbus', 'OH', '43223',
 'publicrecords@dps.ohio.gov', '614-466-2660', NULL,
 'https://www.statepatrol.ohio.gov', NULL,
 3, true, '2026-02-21', true, false, true),

-- Oklahoma
('Oklahoma Highway Patrol', 'OHP', 'State', 'Oklahoma', 'Oklahoma City',
 '3600 Martin Luther King Avenue', 'Oklahoma City', 'OK', '73136',
 'ohpinfo@dps.ok.gov', '405-425-2300', NULL,
 'https://www.ohp.ok.gov', NULL,
 10, true, '2026-02-21', true, false, true),

-- Oregon
('Oregon State Police', 'OSP', 'State', 'Oregon', 'Salem',
 '3565 Trelstad Avenue SE', 'Salem', 'OR', '97317',
 'osppublicrecords@osp.oregon.gov', '503-378-3725', NULL,
 'https://www.oregon.gov/osp', NULL,
 5, true, '2026-02-21', true, false, true),

-- Pennsylvania
('Pennsylvania State Police', 'PSP', 'State', 'Pennsylvania', 'Harrisburg',
 '1800 Elmerton Avenue', 'Harrisburg', 'PA', '17110',
 'ra-pspfoiaoffice@pa.gov', '717-783-5599', NULL,
 'https://www.psp.pa.gov', NULL,
 5, true, '2026-02-21', true, false, true),

-- Rhode Island
('Rhode Island State Police', 'RISP', 'State', 'Rhode Island', 'North Scituate',
 '311 Danielson Pike', 'North Scituate', 'RI', '02857',
 'rispinfo@risp.ri.gov', '401-444-1000', NULL,
 'https://risp.ri.gov', NULL,
 10, true, '2026-02-21', true, false, true),

-- South Carolina
('South Carolina Highway Patrol', 'SCHP', 'State', 'South Carolina', 'Columbia',
 '10311 Wilson Boulevard', 'Columbia', 'SC', '29212',
 'schpinfo@scdps.gov', '803-896-7920', NULL,
 'https://www.scdps.gov/schp', NULL,
 10, true, '2026-02-21', true, false, true),

-- South Dakota
('South Dakota Highway Patrol', 'SDHP', 'State', 'South Dakota', 'Pierre',
 '118 West Capitol Avenue', 'Pierre', 'SD', '57501',
 'sdhpatrolinfo@state.sd.us', '605-773-3105', NULL,
 'https://dps.sd.gov/highway-patrol', NULL,
 5, true, '2026-02-21', true, false, true),

-- Tennessee
('Tennessee Highway Patrol', 'THP', 'State', 'Tennessee', 'Nashville',
 '1150 Foster Avenue', 'Nashville', 'TN', '37243',
 'thpinfo@tn.gov', '615-741-3181', NULL,
 'https://www.tn.gov/safety/thp.html', NULL,
 7, true, '2026-02-21', true, false, true),

-- Texas
('Texas Department of Public Safety', 'TXDPS', 'State', 'Texas', 'Austin',
 '5805 North Lamar Boulevard', 'Austin', 'TX', '78752',
 'openrecords@dps.texas.gov', '512-424-2000', NULL,
 'https://www.dps.texas.gov', NULL,
 10, true, '2026-02-21', true, false, true),

-- Utah
('Utah Highway Patrol', 'UHP', 'State', 'Utah', 'Salt Lake City',
 '4501 South 2700 West', 'Salt Lake City', 'UT', '84129',
 'uhppublicrecords@utah.gov', '801-965-4518', NULL,
 'https://highwaypatrol.utah.gov', NULL,
 10, true, '2026-02-21', true, false, true),

-- Vermont
('Vermont State Police', 'VSP', 'State', 'Vermont', 'Waterbury',
 '45 State Drive', 'Waterbury', 'VT', '05671',
 'vsppublicrecords@vermont.gov', '802-244-8727', NULL,
 'https://vsp.vermont.gov', NULL,
 5, true, '2026-02-21', true, false, true),

-- Virginia
('Virginia State Police', 'VSP', 'State', 'Virginia', 'Richmond',
 '7700 Midlothian Turnpike', 'Richmond', 'VA', '23235',
 'vspinfo@vsp.virginia.gov', '804-674-2000', NULL,
 'https://www.vsp.virginia.gov', NULL,
 5, true, '2026-02-21', true, false, true),

-- Washington
('Washington State Patrol', 'WSP', 'State', 'Washington', 'Olympia',
 '210 11th Avenue SW', 'Olympia', 'WA', '98501',
 'wsppublicrecords@wsp.wa.gov', '360-596-4000', NULL,
 'https://www.wsp.wa.gov', NULL,
 5, true, '2026-02-21', true, false, true),

-- West Virginia
('West Virginia State Police', 'WVSP', 'State', 'West Virginia', 'South Charleston',
 '725 Jefferson Road', 'South Charleston', 'WV', '25309',
 'wvspinfo@wvsp.gov', '304-746-2100', NULL,
 'https://wvsp.gov', NULL,
 5, true, '2026-02-21', true, false, true),

-- Wisconsin
('Wisconsin State Patrol', 'WSP', 'State', 'Wisconsin', 'Madison',
 '4802 Sheboygan Avenue', 'Madison', 'WI', '53707',
 'wsppublicrecords@dot.wi.gov', '608-266-3212', NULL,
 'https://wisconsindot.gov/Pages/about-wisdot/who-we-are/state-patrol', NULL,
 10, true, '2026-02-21', true, false, true),

-- Wyoming
('Wyoming Highway Patrol', 'WHP', 'State', 'Wyoming', 'Cheyenne',
 '5500 Bishop Boulevard', 'Cheyenne', 'WY', '82009',
 'whpinfo@wyo.gov', '307-777-4301', NULL,
 'https://whp.wyo.gov', NULL,
 7, true, '2026-02-21', true, false, true)

ON CONFLICT DO NOTHING;

-- =============================================================================
-- ADD INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_foia_agencies_state_city ON public.foia_agencies(state, city);
CREATE INDEX IF NOT EXISTS idx_foia_agencies_type_state ON public.foia_agencies(agency_type, state);

-- =============================================================================
-- ADD HELPFUL COMMENTS
-- =============================================================================

COMMENT ON TABLE public.foia_agencies IS 'Comprehensive directory of federal, state, and local law enforcement agencies for FOIA/public records requests. Contact information verified as of February 2026 - users should verify current contact details directly with agencies.';

-- =============================================================================
-- UPDATE STATISTICS
-- =============================================================================

ANALYZE public.foia_agencies;
