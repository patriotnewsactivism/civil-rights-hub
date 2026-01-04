-- Comprehensive Federal FOIA Agencies Directory
-- Source: FOIA.gov, agency websites, verified January 2026

-- Cabinet-level departments and major agencies

INSERT INTO public.foia_agencies (
  name, acronym, agency_type, foia_email, foia_phone, foia_online_portal_url,
  standard_response_days, website_url, foia_guide_url, verified_date
) VALUES

-- Department of Justice
('Department of Justice', 'DOJ', 'Federal', 'MRUFOIA.Requests@usdoj.gov', '202-514-3642',
 'https://www.justice.gov/oip/submit-foia-request',
 20, 'https://www.justice.gov', 'https://www.justice.gov/oip', '2026-01-04'),

-- FBI (under DOJ)
('Federal Bureau of Investigation', 'FBI', 'Federal', 'foipa.request@ic.fbi.gov', '540-868-4593',
 'https://efoia.fbi.gov',
 20, 'https://www.fbi.gov', 'https://www.fbi.gov/services/information-management/foipa', '2026-01-04'),

-- DEA (under DOJ)
('Drug Enforcement Administration', 'DEA', 'Federal', 'DEA.FOIA.Requests@usdoj.gov', '571-776-2700',
 'https://www.dea.gov/foia',
 20, 'https://www.dea.gov', 'https://www.dea.gov/foia', '2026-01-04'),

-- ATF (under DOJ)
('Bureau of Alcohol, Tobacco, Firearms and Explosives', 'ATF', 'Federal', 'foiamail@atf.gov', '202-648-8740',
 'https://www.atf.gov/resource-center/foiaonline',
 20, 'https://www.atf.gov', 'https://www.atf.gov/resource-center/foia', '2026-01-04'),

-- U.S. Marshals (under DOJ)
('United States Marshals Service', 'USMS', 'Federal', 'FOIA.USMS@usdoj.gov', '202-307-9054',
 NULL, 20, 'https://www.usmarshals.gov', 'https://www.usmarshals.gov/foia', '2026-01-04'),

-- Department of Homeland Security
('Department of Homeland Security', 'DHS', 'Federal', 'foia@hq.dhs.gov', '202-343-1743',
 'https://www.dhs.gov/foia-request-submission',
 20, 'https://www.dhs.gov', 'https://www.dhs.gov/foia', '2026-01-04'),

-- ICE (under DHS)
('U.S. Immigration and Customs Enforcement', 'ICE', 'Federal', 'ice-foia@dhs.gov', '866-633-1182',
 'https://www.ice.gov/foia',
 20, 'https://www.ice.gov', 'https://www.ice.gov/foia', '2026-01-04'),

-- CBP (under DHS)
('U.S. Customs and Border Protection', 'CBP', 'Federal', 'CBP-FOIA@cbp.dhs.gov', '202-344-1610',
 'https://www.cbp.gov/site-policy-notices/foia',
 20, 'https://www.cbp.gov', 'https://www.cbp.gov/site-policy-notices/foia', '2026-01-04'),

-- TSA (under DHS)
('Transportation Security Administration', 'TSA', 'Federal', 'foia.tsa@tsa.dhs.gov', '571-227-2300',
 'https://www.tsa.gov/foia-requests',
 20, 'https://www.tsa.gov', 'https://www.tsa.gov/foia-requests', '2026-01-04'),

-- Secret Service (under DHS)
('United States Secret Service', 'USSS', 'Federal', 'FOIA@usss.dhs.gov', '202-406-5370',
 'https://www.secretservice.gov/protection/foia',
 20, 'https://www.secretservice.gov', 'https://www.secretservice.gov/protection/foia', '2026-01-04'),

-- FEMA (under DHS)
('Federal Emergency Management Agency', 'FEMA', 'Federal', 'FEMA-FOIA-Requests@fema.dhs.gov', '202-646-3323',
 'https://www.fema.gov/foia-request',
 20, 'https://www.fema.gov', 'https://www.fema.gov/foia', '2026-01-04'),

-- Department of Defense
('Department of Defense', 'DOD', 'Federal', 'dod.foia@mail.mil', '571-372-0461',
 'https://www.esd.whs.mil/FOID/e-FOIA/',
 20, 'https://www.defense.gov', 'https://www.esd.whs.mil/FOID/', '2026-01-04'),

-- Army
('Department of the Army', 'ARMY', 'Federal', 'usarmy.pentagon.hqda-oacsim.mbx.foia@army.mil', '703-428-6718',
 'https://www.rmda.army.mil/foia/request.html',
 20, 'https://www.army.mil', 'https://www.rmda.army.mil/foia/', '2026-01-04'),

-- Navy
('Department of the Navy', 'NAVY', 'Federal', 'SECNAV_DONFIOA@navy.mil', '202-685-6545',
 'https://www.secnav.navy.mil/foia/Pages/default.aspx',
 20, 'https://www.navy.mil', 'https://www.secnav.navy.mil/foia/', '2026-01-04'),

-- Air Force
('Department of the Air Force', 'USAF', 'Federal', 'AF.FOIA@us.af.mil', '240-612-5414',
 'https://www.foia.af.mil/',
 20, 'https://www.af.mil', 'https://www.foia.af.mil/', '2026-01-04'),

-- State Department
('Department of State', 'STATE', 'Federal', 'FOIArequest@state.gov', '202-261-8484',
 'https://foia.state.gov/',
 20, 'https://www.state.gov', 'https://foia.state.gov/', '2026-01-04'),

-- CIA
('Central Intelligence Agency', 'CIA', 'Federal', NULL, '703-613-1287',
 'https://www.cia.gov/readingroom/foia-request',
 20, 'https://www.cia.gov', 'https://www.cia.gov/readingroom/', '2026-01-04'),

-- NSA
('National Security Agency', 'NSA', 'Federal', 'FOIA@nsa.gov', '301-688-6527',
 'https://www.nsa.gov/Resources/FOIA/',
 20, 'https://www.nsa.gov', 'https://www.nsa.gov/Resources/FOIA/', '2026-01-04'),

-- Department of Treasury
('Department of the Treasury', 'TREASURY', 'Federal', 'foia@treasury.gov', '202-622-0930',
 'https://home.treasury.gov/footer/freedom-of-information-act',
 20, 'https://home.treasury.gov', 'https://home.treasury.gov/footer/freedom-of-information-act', '2026-01-04'),

-- IRS (under Treasury)
('Internal Revenue Service', 'IRS', 'Federal', '*FOIA@irs.gov', '202-317-5900',
 'https://www.irs.gov/privacy-disclosure/foia-submit-request',
 20, 'https://www.irs.gov', 'https://www.irs.gov/privacy-disclosure/foia', '2026-01-04'),

-- EPA
('Environmental Protection Agency', 'EPA', 'Federal', 'hq.foia@epa.gov', '202-566-1667',
 'https://www.epa.gov/foia/submit-foia-request',
 20, 'https://www.epa.gov', 'https://www.epa.gov/foia', '2026-01-04'),

-- Department of Labor
('Department of Labor', 'DOL', 'Federal', 'foia-public@dol.gov', '202-693-5427',
 'https://www.dol.gov/agencies/oasam/centers-offices/civil-rights-center/foia',
 20, 'https://www.dol.gov', 'https://www.dol.gov/general/foia', '2026-01-04'),

-- OSHA (under DOL)
('Occupational Safety and Health Administration', 'OSHA', 'Federal', 'foia.requests@dol.gov', '202-693-5427',
 'https://www.osha.gov/foia',
 20, 'https://www.osha.gov', 'https://www.osha.gov/foia', '2026-01-04'),

-- Department of Health and Human Services
('Department of Health and Human Services', 'HHS', 'Federal', 'FOIARequest@hhs.gov', '202-690-7453',
 'https://www.hhs.gov/foia/request/index.html',
 20, 'https://www.hhs.gov', 'https://www.hhs.gov/foia/', '2026-01-04'),

-- FDA (under HHS)
('Food and Drug Administration', 'FDA', 'Federal', 'FOIA@fda.hhs.gov', '301-796-3900',
 'https://www.fda.gov/regulatory-information/freedom-information/how-make-foia-request',
 20, 'https://www.fda.gov', 'https://www.fda.gov/regulatory-information/freedom-information', '2026-01-04'),

-- CDC (under HHS)
('Centers for Disease Control and Prevention', 'CDC', 'Federal', 'foiarequest@cdc.gov', '770-488-6277',
 'https://www.cdc.gov/od/foia/index.htm',
 20, 'https://www.cdc.gov', 'https://www.cdc.gov/od/foia/', '2026-01-04'),

-- CMS (under HHS)
('Centers for Medicare & Medicaid Services', 'CMS', 'Federal', 'FOIA_Requests@cms.hhs.gov', '410-786-5353',
 'https://www.cms.gov/foia',
 20, 'https://www.cms.gov', 'https://www.cms.gov/foia', '2026-01-04'),

-- Department of Education
('Department of Education', 'ED', 'Federal', 'EDFOIAManager@ed.gov', '202-401-8365',
 'https://www2.ed.gov/policy/gen/leg/foia/foiatoc.html',
 20, 'https://www.ed.gov', 'https://www2.ed.gov/policy/gen/leg/foia/', '2026-01-04'),

-- Department of Transportation
('Department of Transportation', 'DOT', 'Federal', 'foia@dot.gov', '202-366-4542',
 'https://www.transportation.gov/foia',
 20, 'https://www.transportation.gov', 'https://www.transportation.gov/foia', '2026-01-04'),

-- FAA (under DOT)
('Federal Aviation Administration', 'FAA', 'Federal', '9-AWA-FOIA-PUBLIC@faa.gov', '202-267-3100',
 'https://www.faa.gov/foia',
 20, 'https://www.faa.gov', 'https://www.faa.gov/foia', '2026-01-04'),

-- NHTSA (under DOT)
('National Highway Traffic Safety Administration', 'NHTSA', 'Federal', 'foia@dot.gov', '202-366-2870',
 'https://www.nhtsa.gov/foia',
 20, 'https://www.nhtsa.gov', 'https://www.nhtsa.gov/foia', '2026-01-04'),

-- Department of Energy
('Department of Energy', 'DOE', 'Federal', 'hq.foia@hq.doe.gov', '202-586-5955',
 'https://www.energy.gov/management/office-management/operational-management/freedom-information-act',
 20, 'https://www.energy.gov', 'https://www.energy.gov/management/freedom-information-act', '2026-01-04'),

-- Department of Veterans Affairs
('Department of Veterans Affairs', 'VA', 'Federal', 'vacofoiarequest@va.gov', '202-461-4860',
 'https://www.va.gov/foia/',
 20, 'https://www.va.gov', 'https://www.va.gov/foia/', '2026-01-04'),

-- Department of Agriculture
('Department of Agriculture', 'USDA', 'Federal', 'foia@dm.usda.gov', '202-690-3054',
 'https://www.dm.usda.gov/foia/',
 20, 'https://www.usda.gov', 'https://www.dm.usda.gov/foia/', '2026-01-04'),

-- Department of Commerce
('Department of Commerce', 'DOC', 'Federal', 'foia@doc.gov', '202-482-3258',
 'https://www.commerce.gov/foia',
 20, 'https://www.commerce.gov', 'https://www.commerce.gov/foia', '2026-01-04'),

-- Census Bureau (under DOC)
('U.S. Census Bureau', 'CENSUS', 'Federal', 'foia@census.gov', '301-763-3030',
 'https://www.census.gov/about/policies/foia.html',
 20, 'https://www.census.gov', 'https://www.census.gov/about/policies/foia.html', '2026-01-04'),

-- Department of Interior
('Department of the Interior', 'DOI', 'Federal', 'foia@ios.doi.gov', '202-208-5342',
 'https://www.doi.gov/foia',
 20, 'https://www.doi.gov', 'https://www.doi.gov/foia', '2026-01-04'),

-- National Park Service (under DOI)
('National Park Service', 'NPS', 'Federal', 'NPS_FOIA_Coordinator@nps.gov', '202-354-1892',
 'https://www.nps.gov/aboutus/foia/index.htm',
 20, 'https://www.nps.gov', 'https://www.nps.gov/aboutus/foia/', '2026-01-04'),

-- Department of Housing and Urban Development
('Department of Housing and Urban Development', 'HUD', 'Federal', 'foia@hud.gov', '202-708-3054',
 'https://www.hud.gov/program_offices/administration/foia',
 20, 'https://www.hud.gov', 'https://www.hud.gov/program_offices/administration/foia', '2026-01-04'),

-- Independent Agencies

-- Social Security Administration
('Social Security Administration', 'SSA', 'Federal', 'foia@ssa.gov', '410-965-1727',
 'https://www.ssa.gov/foia/',
 20, 'https://www.ssa.gov', 'https://www.ssa.gov/foia/', '2026-01-04'),

-- FCC
('Federal Communications Commission', 'FCC', 'Federal', 'foia@fcc.gov', '202-418-0212',
 'https://www.fcc.gov/general/foia',
 20, 'https://www.fcc.gov', 'https://www.fcc.gov/general/foia', '2026-01-04'),

-- FTC
('Federal Trade Commission', 'FTC', 'Federal', 'foia@ftc.gov', '202-326-2430',
 'https://www.ftc.gov/about-ftc/foia',
 20, 'https://www.ftc.gov', 'https://www.ftc.gov/about-ftc/foia', '2026-01-04'),

-- SEC
('Securities and Exchange Commission', 'SEC', 'Federal', 'FOIAPA@sec.gov', '202-551-7900',
 'https://www.sec.gov/foia',
 20, 'https://www.sec.gov', 'https://www.sec.gov/foia', '2026-01-04'),

-- NASA
('National Aeronautics and Space Administration', 'NASA', 'Federal', 'hq-foia@nasa.gov', '202-358-0718',
 'https://www.nasa.gov/FOIA/',
 20, 'https://www.nasa.gov', 'https://www.nasa.gov/FOIA/', '2026-01-04'),

-- USPS
('United States Postal Service', 'USPS', 'Federal', 'FOIA.mdr@usps.gov', '202-268-2608',
 'https://about.usps.com/who/legal/foia/',
 20, 'https://www.usps.com', 'https://about.usps.com/who/legal/foia/', '2026-01-04'),

-- EEOC
('Equal Employment Opportunity Commission', 'EEOC', 'Federal', 'foia@eeoc.gov', '202-663-4660',
 'https://www.eeoc.gov/foia',
 20, 'https://www.eeoc.gov', 'https://www.eeoc.gov/foia', '2026-01-04'),

-- NLRB
('National Labor Relations Board', 'NLRB', 'Federal', 'FOIA@nlrb.gov', '202-273-3847',
 'https://www.nlrb.gov/foia',
 20, 'https://www.nlrb.gov', 'https://www.nlrb.gov/foia', '2026-01-04'),

-- OSHA already listed above under DOL

-- SBA
('Small Business Administration', 'SBA', 'Federal', 'foia@sba.gov', '202-401-8203',
 'https://www.sba.gov/about-sba/sba-performance/open-government/foia',
 20, 'https://www.sba.gov', 'https://www.sba.gov/about-sba/sba-performance/open-government/foia', '2026-01-04'),

-- Consumer Financial Protection Bureau
('Consumer Financial Protection Bureau', 'CFPB', 'Federal', 'CFPB_FOIA@cfpb.gov', '855-275-3642',
 'https://www.consumerfinance.gov/foia-requests/',
 20, 'https://www.consumerfinance.gov', 'https://www.consumerfinance.gov/foia-requests/', '2026-01-04'),

-- Office of Personnel Management
('Office of Personnel Management', 'OPM', 'Federal', 'FOIA@opm.gov', '202-606-1153',
 'https://www.opm.gov/information-management/foia/',
 20, 'https://www.opm.gov', 'https://www.opm.gov/information-management/foia/', '2026-01-04'),

-- General Services Administration
('General Services Administration', 'GSA', 'Federal', 'foia@gsa.gov', '855-675-3642',
 'https://www.gsa.gov/reference/freedom-of-information-act-foia',
 20, 'https://www.gsa.gov', 'https://www.gsa.gov/reference/freedom-of-information-act-foia', '2026-01-04'),

-- National Archives
('National Archives and Records Administration', 'NARA', 'Federal', 'foia@nara.gov', '301-837-3642',
 'https://www.archives.gov/foia',
 20, 'https://www.archives.gov', 'https://www.archives.gov/foia', '2026-01-04'),

-- Library of Congress
('Library of Congress', 'LOC', 'Federal', 'foia@loc.gov', '202-707-8800',
 'https://www.loc.gov/foia/',
 20, 'https://www.loc.gov', 'https://www.loc.gov/foia/', '2026-01-04')

;
