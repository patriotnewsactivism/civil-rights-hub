-- Seed a third clean resource batch from current official/primary sources.
-- Focus: civil-rights causes of action, criminal civil-rights statutes, ADA and
-- Rehabilitation Act authority, FOIA/privacy law, FTCA procedure, complaint
-- processes, FOIA dispute resolution, and core federal-court forms.

CREATE TEMP TABLE _enforcement_resource_seed (
  seed_id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  category TEXT NOT NULL,
  external_url TEXT NOT NULL UNIQUE,
  author TEXT NOT NULL,
  source TEXT NOT NULL,
  source_publisher TEXT NOT NULL,
  source_type TEXT NOT NULL,
  tags TEXT[] NOT NULL
) ON COMMIT DROP;

INSERT INTO _enforcement_resource_seed VALUES
('e8f44f71-6c55-4ea4-a9dc-300000000001','18 U.S.C. § 241 — Conspiracy Against Rights','Official U.S. Code text for the federal criminal civil-rights statute addressing conspiracies to injure, oppress, threaten, or intimidate a person in the exercise or enjoyment of federal rights.','link','Federal Civil Rights Law','https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title18-section241','Office of the Law Revision Counsel, U.S. House of Representatives','United States Code','Office of the Law Revision Counsel','government',ARRAY['18-usc-241','civil-rights','criminal-law','conspiracy','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000002','18 U.S.C. § 242 — Deprivation of Rights Under Color of Law','Official U.S. Code text for the federal criminal statute addressing willful deprivation of federally protected rights under color of law.','link','Federal Civil Rights Law','https://uscode.house.gov/view.xhtml?edition=prelim&f=treesort&num=0&req=granuleid%3AUSC-prelim-title18-section242','Office of the Law Revision Counsel, U.S. House of Representatives','United States Code','Office of the Law Revision Counsel','government',ARRAY['18-usc-242','color-of-law','civil-rights','criminal-law','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000003','42 U.S.C. § 1983 — Civil Action for Deprivation of Rights','Official U.S. Code text for 42 U.S.C. § 1983, the federal civil cause of action for deprivation of constitutional or federal rights under color of state law.','link','Civil Rights Litigation','https://uscode.house.gov/view.xhtml?edition=prelim&f=treesort&num=0&req=%28title%3A42+section%3A1983+edition%3Aprelim%29+OR+%28granuleid%3AUSC-prelim-title42-section1983%29','Office of the Law Revision Counsel, U.S. House of Representatives','United States Code','Office of the Law Revision Counsel','government',ARRAY['42-usc-1983','section-1983','civil-rights','litigation','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000004','42 U.S.C. § 1985 — Conspiracy to Interfere with Civil Rights','Official U.S. Code text for 42 U.S.C. § 1985 concerning specified conspiracies to interfere with civil rights.','link','Civil Rights Litigation','https://uscode.house.gov/view.xhtml?edition=prelim&f=treesort&num=0&req=%28title%3A42+section%3A1985+edition%3Aprelim%29+OR+%28granuleid%3AUSC-prelim-title42-section1985%29','Office of the Law Revision Counsel, U.S. House of Representatives','United States Code','Office of the Law Revision Counsel','government',ARRAY['42-usc-1985','civil-rights','conspiracy','litigation','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000005','42 U.S.C. § 12132 — ADA Title II Discrimination','Official U.S. Code text for the ADA Title II prohibition on disability discrimination by public entities.','link','Disability Rights','https://uscode.house.gov/view.xhtml?edition=prelim&f=treesort&num=0&req=%28title%3A42+section%3A12132+edition%3Aprelim%29+OR+%28granuleid%3AUSC-prelim-title42-section12132%29','Office of the Law Revision Counsel, U.S. House of Representatives','United States Code','Office of the Law Revision Counsel','government',ARRAY['ada','title-ii','42-usc-12132','disability-rights','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000006','42 U.S.C. § 12203 — ADA Retaliation and Coercion','Official U.S. Code text for the ADA prohibition against retaliation, interference, coercion, intimidation, and threats relating to protected ADA rights.','link','Disability Rights','https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=%28title%3A42+section%3A12203+edition%3Aprelim%29','Office of the Law Revision Counsel, U.S. House of Representatives','United States Code','Office of the Law Revision Counsel','government',ARRAY['ada','retaliation','coercion','42-usc-12203','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000007','29 U.S.C. § 794 — Rehabilitation Act Section 504','Official U.S. Code text for Section 504 of the Rehabilitation Act addressing disability discrimination in federally funded programs and programs conducted by Executive agencies or the U.S. Postal Service.','link','Disability Rights','https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title29-section794','Office of the Law Revision Counsel, U.S. House of Representatives','United States Code','Office of the Law Revision Counsel','government',ARRAY['section-504','rehabilitation-act','29-usc-794','disability-rights','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000008','5 U.S.C. § 552 — Freedom of Information Act','Official U.S. Code text for the federal Freedom of Information Act governing public access to federal agency records.','link','Public Records','https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title5-section552%28b%29%283%29','Office of the Law Revision Counsel, U.S. House of Representatives','United States Code','Office of the Law Revision Counsel','government',ARRAY['foia','5-usc-552','public-records','federal','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000009','5 U.S.C. § 552a — Privacy Act','Official U.S. Code text for the Privacy Act provisions governing federal agency records maintained about individuals.','link','Privacy & Records','https://uscode.house.gov/view.xhtml?edition=prelim&hl=false&req=granuleid%3AUSC-prelim-title5-section552a','Office of the Law Revision Counsel, U.S. House of Representatives','United States Code','Office of the Law Revision Counsel','government',ARRAY['privacy-act','5-usc-552a','federal-records','privacy','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000010','28 U.S.C. § 1346 — United States as Defendant','Official U.S. Code text for federal district-court jurisdiction over specified claims against the United States, including the jurisdictional provision used with Federal Tort Claims Act cases.','link','Federal Jurisdiction','https://uscode.house.gov/view.xhtml?edition=prelim&f=treesort&num=0&req=%28title%3A28+section%3A1346+edition%3Aprelim%29+OR+%28granuleid%3AUSC-prelim-title28-section1346%29','Office of the Law Revision Counsel, U.S. House of Representatives','United States Code','Office of the Law Revision Counsel','government',ARRAY['28-usc-1346','ftca','jurisdiction','united-states','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000011','28 U.S.C. § 2675 — FTCA Administrative Claim Prerequisite','Official U.S. Code text for the Federal Tort Claims Act administrative-claim prerequisite and related requirements before filing certain tort suits against the United States.','link','Federal Tort Claims','https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title28-section2675','Office of the Law Revision Counsel, U.S. House of Representatives','United States Code','Office of the Law Revision Counsel','government',ARRAY['ftca','28-usc-2675','administrative-claim','federal-tort','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000012','28 CFR Part 35 — ADA Title II Regulations','Current eCFR text of the Department of Justice regulations implementing ADA Title II for state and local government services, programs, and activities.','link','Disability Rights','https://www.ecfr.gov/current/title-28/chapter-I/part-35','U.S. Department of Justice / Office of the Federal Register','Electronic Code of Federal Regulations','Office of the Federal Register','government',ARRAY['ada','title-ii','28-cfr-35','state-local-government','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000013','DOJ Guide to the Freedom of Information Act','Current Department of Justice Office of Information Policy legal guide covering FOIA procedure, exemptions, and litigation considerations.','link','Public Records','https://www.justice.gov/oip/doj-guide-freedom-information-act-0','U.S. Department of Justice Office of Information Policy','DOJ Guide to the FOIA','U.S. Department of Justice','government',ARRAY['foia','doj','exemptions','litigation','public-records','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000014','OGIS FOIA Mediation and Dispute Resolution','National Archives Office of Government Information Services resource explaining federal FOIA mediation, ombuds, conciliation, and facilitation services for requesters and agencies.','link','Public Records','https://www.archives.gov/ogis/mediation-program','Office of Government Information Services','National Archives OGIS','National Archives and Records Administration','government',ARRAY['foia','ogis','mediation','dispute-resolution','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000015','How to File an EEOC Charge of Employment Discrimination','Official EEOC guidance for initiating and filing a charge of employment discrimination, including filing channels and time-limit information.','link','Employment Rights','https://www.eeoc.gov/how-file-charge-employment-discrimination','U.S. Equal Employment Opportunity Commission','EEOC','U.S. Equal Employment Opportunity Commission','government',ARRAY['eeoc','employment-discrimination','charge','workplace-rights','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000016','HHS Office for Civil Rights — Filing a Complaint','Official HHS Office for Civil Rights entry point for civil-rights, conscience or religious-freedom, health-information privacy, and patient-safety confidentiality complaints.','link','Reporting & Complaints','https://www.hhs.gov/ocr/complaints/index.html','U.S. Department of Health and Human Services Office for Civil Rights','HHS OCR','U.S. Department of Health and Human Services','government',ARRAY['hhs','civil-rights','complaint','healthcare','privacy','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000017','U.S. Department of Education OCR — File a Complaint','Official Department of Education Office for Civil Rights complaint portal and guidance for discrimination and retaliation complaints involving covered education entities.','link','Education Rights','https://www.ed.gov/laws-and-policy/civil-rights-laws/file-complaint','U.S. Department of Education Office for Civil Rights','Education OCR','U.S. Department of Education','government',ARRAY['education','ocr','discrimination','retaliation','complaint','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000018','HUD Fair Housing Act — Housing Discrimination','Official HUD overview of housing discrimination prohibited by the Fair Housing Act, with access to HUD fair-housing complaint resources.','link','Housing Rights','https://www.hud.gov/helping-americans/fair-housing-act-overview','U.S. Department of Housing and Urban Development','HUD Fair Housing','U.S. Department of Housing and Urban Development','government',ARRAY['fair-housing','housing-discrimination','hud','complaint','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000019','Federal Court Fee-Waiver Application Forms','Official U.S. Courts collection of AO 239, AO 240, and related forms for requesting permission to proceed without prepaying court fees or costs.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/fee-waiver-application-forms','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['federal-court','fee-waiver','ifp','forms','pro-se','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000020','AO 239 — Application to Proceed Without Prepaying Fees or Costs','Official U.S. Courts long-form AO 239 application for requesting permission to proceed in district court without prepaying fees or costs.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/application-proceed-district-court-without-prepaying-fees-or-costs-long-form','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-239','ifp','fee-waiver','district-court','pro-se','official']),
('e8f44f71-6c55-4ea4-a9dc-300000000021','AO 88B — Civil Subpoena for Documents or Inspection','Official U.S. Courts AO 88B form for a subpoena to produce documents, electronically stored information, or objects, or to permit inspection of premises in a civil action.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/subpoena-produce-documents-information-or-objects-or-permit-inspection-premises-a-civil-action','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-88b','subpoena','discovery','documents','civil-litigation','official']);

INSERT INTO public.resource_library (
  id,title,description,resource_type,category,external_url,author,source,language,tags,is_approved
)
SELECT seed_id,title,description,resource_type,category,external_url,author,source,'en',tags,true
FROM _enforcement_resource_seed s
WHERE NOT EXISTS (SELECT 1 FROM public.resource_library r WHERE r.external_url=s.external_url);

CREATE TEMP TABLE _enforcement_resource_map ON COMMIT DROP AS
SELECT s.*,
       (SELECT r.id FROM public.resource_library r WHERE r.external_url=s.external_url ORDER BY r.id LIMIT 1) entity_id
FROM _enforcement_resource_seed s;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM _enforcement_resource_map WHERE entity_id IS NULL) THEN
    RAISE EXCEPTION 'Could not resolve canonical enforcement-resource row';
  END IF;
END $$;

UPDATE public.resource_library r
SET title=m.title, description=m.description, resource_type=m.resource_type,
    category=m.category, external_url=m.external_url, author=m.author,
    source=m.source, language='en', tags=m.tags, is_approved=true
FROM _enforcement_resource_map m WHERE r.id=m.entity_id;

UPDATE public.resource_library r
SET is_approved=false
WHERE r.external_url IN (SELECT external_url FROM _enforcement_resource_map)
  AND NOT EXISTS (SELECT 1 FROM _enforcement_resource_map m WHERE m.entity_id=r.id);

INSERT INTO public.data_provenance (
  entity_type,entity_id,source_url,source_title,source_publisher,source_type,
  is_primary_source,is_active,retrieved_at,last_verified_at,verification_status,supported_fields
)
SELECT 'resource',entity_id,external_url,title,source_publisher,source_type,
       true,true,NOW(),NOW(),'verified_primary',
       ARRAY['title','description','resource_type','category','external_url','author','source']::text[]
FROM _enforcement_resource_map
ON CONFLICT (entity_type,entity_id,source_url)
DO UPDATE SET source_title=EXCLUDED.source_title,
              source_publisher=EXCLUDED.source_publisher,
              source_type=EXCLUDED.source_type,
              is_primary_source=true,
              is_active=true,
              retrieved_at=NOW(),
              last_verified_at=NOW(),
              verification_status='verified_primary',
              supported_fields=EXCLUDED.supported_fields,
              updated_at=NOW();

DO $$
DECLARE n integer;
BEGIN
  SELECT count(DISTINCT r.external_url) INTO n
  FROM _enforcement_resource_map m JOIN public.resource_library r ON r.id=m.entity_id
  WHERE r.is_approved=true
    AND public.has_publishable_provenance('resource',r.id)
    AND public.provenance_supports_fields(
      'resource',r.id,
      ARRAY['title','description','resource_type','category','external_url','author','source']::text[]
    );
  IF n <> 21 THEN RAISE EXCEPTION 'Expected 21 publishable verified enforcement resources, found %',n; END IF;
END $$;