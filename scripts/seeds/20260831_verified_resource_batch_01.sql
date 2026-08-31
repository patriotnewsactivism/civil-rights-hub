-- Civil Rights Hub verified resource batch 01
-- Sources reviewed 2026-08-31. Official federal government sources only.
-- Canonical identity is external_url. Existing rows are updated rather than duplicated.
-- Every published field below is backed by the same official primary URL recorded in data_provenance.

BEGIN;

CREATE TEMP TABLE _verified_resource_batch (
  title text NOT NULL,
  description text NOT NULL,
  resource_type text NOT NULL,
  category text NOT NULL,
  external_url text PRIMARY KEY,
  author text NOT NULL,
  source text NOT NULL,
  source_publisher text NOT NULL,
  source_type text NOT NULL DEFAULT 'government',
  tags text[] NOT NULL
) ON COMMIT DROP;

INSERT INTO _verified_resource_batch(title,description,resource_type,category,external_url,author,source,source_publisher,source_type,tags) VALUES
('Report a Civil Rights Violation to DOJ','Official U.S. Department of Justice Civil Rights Division portal for reporting possible civil-rights violations.','link','Reporting & Complaints','https://civilrights.justice.gov/','U.S. Department of Justice Civil Rights Division','DOJ Civil Rights Division','U.S. Department of Justice','government',ARRAY['civil-rights','complaint','reporting','doj','official']),
('DOJ Voting Rights Resources','Official Civil Rights Division resources for reporting voting issues and learning about federal voting-rights protections.','link','Voting Rights','https://www.civilrights.justice.gov/voting-resources','U.S. Department of Justice Civil Rights Division','DOJ Voting Resources','U.S. Department of Justice','government',ARRAY['voting','elections','civil-rights','doj','official']),
('DOJ Servicemembers and Veterans Initiative','Official Justice Department resource for servicemember and veteran rights involving employment, housing, voting, disability, and related civil-rights protections.','link','Servicemember Rights','https://www.justice.gov/servicemembers','U.S. Department of Justice','Servicemembers and Veterans Initiative','U.S. Department of Justice','government',ARRAY['servicemembers','veterans','scra','userra','civil-rights','official']),
('DOJ Civil Rights Division — What We Do','Official overview of Civil Rights Division enforcement work, including federal criminal civil-rights enforcement and complaint review.','link','Civil Rights Enforcement','https://www.justice.gov/crt/what-we-do','U.S. Department of Justice Civil Rights Division','Civil Rights Division','U.S. Department of Justice','government',ARRAY['civil-rights','enforcement','doj','criminal','official']),
('DOJ Police Misconduct Laws and Complaint Guidance','Official Justice Department explanation of federal laws addressing law-enforcement misconduct and routes for reporting alleged violations.','link','Police Accountability','https://www.justice.gov/crt/addressing-police-misconduct-laws-enforced-department-justice','U.S. Department of Justice Civil Rights Division','DOJ Police Misconduct Guidance','U.S. Department of Justice','government',ARRAY['police','misconduct','law-enforcement','civil-rights','complaint','official']),
('DOJ Rights of Persons with Disabilities','Official Civil Rights Division overview of federal disability-rights enforcement involving state and local institutions and integrated services.','link','Disability Rights','https://www.justice.gov/crt/rights-persons-disabilities','U.S. Department of Justice Civil Rights Division','DOJ Disability Rights','U.S. Department of Justice','government',ARRAY['disability','cripa','institutional-rights','civil-rights','official']),
('FOIA.gov — How to Make a FOIA Request','Official federal guidance explaining how to request agency records under the Freedom of Information Act.','link','Public Records','https://www.foia.gov/how-to.html','U.S. Department of Justice Office of Information Policy','FOIA.gov','U.S. Department of Justice','government',ARRAY['foia','public-records','federal','request','official']),
('FOIA.gov — Search Government Websites','Official FOIA.gov tool for searching government websites and FOIA libraries before submitting a records request.','link','Public Records','https://www.foia.gov/search.html','U.S. Department of Justice Office of Information Policy','FOIA.gov','U.S. Department of Justice','government',ARRAY['foia','government-records','search','public-records','official']),
('HUD — Report Housing Discrimination','Official HUD Office of Fair Housing and Equal Opportunity information for reporting housing discrimination.','link','Housing Rights','https://www.hud.gov/contactus/file-complaint','U.S. Department of Housing and Urban Development','HUD Fair Housing and Equal Opportunity','U.S. Department of Housing and Urban Development','government',ARRAY['housing','discrimination','fair-housing','complaint','hud','official']),
('HUD — Contact Fair Housing and Equal Opportunity Offices','Official HUD directory for contacting regional Fair Housing and Equal Opportunity offices and requesting disability-related assistance.','link','Housing Rights','https://www.hud.gov/contactus/fairhousing','U.S. Department of Housing and Urban Development','HUD Fair Housing and Equal Opportunity','U.S. Department of Housing and Urban Development','government',ARRAY['housing','fheo','contacts','fair-housing','disability','official']),
('HUD — Violence Against Women Act Housing Protections','Official HUD hub for VAWA housing protections, statutes, regulations, notices, and guidance.','link','Housing Rights','https://www.hud.gov/vawa','U.S. Department of Housing and Urban Development','HUD VAWA','U.S. Department of Housing and Urban Development','government',ARRAY['vawa','housing','survivors','civil-rights','official']),
('HUD — Your Rights Under VAWA','Official HUD guidance on housing protections and complaint options under the Violence Against Women Act.','link','Housing Rights','https://www.hud.gov/hud-partners/fair-housing-vawa','U.S. Department of Housing and Urban Development','HUD VAWA Rights','U.S. Department of Housing and Urban Development','government',ARRAY['vawa','housing','rights','complaint','official']),
('Pro Se 15 — Complaint for Violation of Civil Rights (Non-Prisoner)','Official U.S. Courts civil pro se complaint form for non-prisoner civil-rights actions.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/complaint-violation-civil-rights-non-prisoner','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['pro-se','civil-rights','complaint','federal-court','form','official']),
('U.S. Courts — Civil Forms','Official federal judiciary collection of civil forms including subpoenas, fee-waiver applications, and related litigation forms.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/civil-forms','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['federal-court','civil','forms','litigation','official']),
('U.S. Courts — Civil Pro Se Forms','Official federal judiciary collection of civil forms designed for self-represented litigants.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/civil-pro-se-forms','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['pro-se','civil','forms','federal-court','official']),
('D.C. District Court — Pro Se Help','Official U.S. District Court for the District of Columbia resources for self-represented prisoners and non-prisoners, including civil-rights and filing forms.','link','Court Access','https://www.dcd.uscourts.gov/pro-se-help','U.S. District Court for the District of Columbia','Pro Se Help','U.S. District Court for the District of Columbia','official',ARRAY['pro-se','court-access','civil-rights','forms','official']),
('EEOC — Harassment','Official EEOC guidance on unlawful workplace harassment under federal employment-discrimination laws.','link','Employment Rights','https://www.eeoc.gov/harassment','U.S. Equal Employment Opportunity Commission','EEOC','U.S. Equal Employment Opportunity Commission','government',ARRAY['employment','harassment','discrimination','eeoc','official']),
('EEOC — Resources for Employers','Official EEOC overview of federal employment-discrimination protections and employer responsibilities.','link','Employment Rights','https://www.eeoc.gov/employers','U.S. Equal Employment Opportunity Commission','EEOC','U.S. Equal Employment Opportunity Commission','government',ARRAY['employment','employers','discrimination','eeoc','official']),
('EEOC — Employees and Applicants','Official EEOC resource for employees and job applicants on discrimination, harassment, accommodation, retaliation, and filing a charge.','link','Employment Rights','https://www.eeoc.gov/employees','U.S. Equal Employment Opportunity Commission','EEOC','U.S. Equal Employment Opportunity Commission','government',ARRAY['employment','employees','applicants','discrimination','eeoc','official']),
('EEOC — Prohibited Employment Policies and Practices','Official EEOC guidance on prohibited discriminatory employment practices, including harassment and discriminatory job decisions.','link','Employment Rights','https://www.eeoc.gov/prohibited-employment-policiespractices','U.S. Equal Employment Opportunity Commission','EEOC','U.S. Equal Employment Opportunity Commission','government',ARRAY['employment','discrimination','harassment','hiring','eeoc','official']),
('EEOC — Youth Worker Rights','Official EEOC guidance for young workers on discrimination, harassment, retaliation, and workplace accommodations.','link','Employment Rights','https://www.eeoc.gov/youth/your-rights','U.S. Equal Employment Opportunity Commission','EEOC Youth','U.S. Equal Employment Opportunity Commission','government',ARRAY['employment','youth','harassment','retaliation','eeoc','official']),
('EEOC — Employee Rights for Small Business Workplaces','Official EEOC summary of employee rights against discrimination and retaliation and rights to legally required accommodations.','link','Employment Rights','https://www.eeoc.gov/employers/small-business/employee-rights','U.S. Equal Employment Opportunity Commission','EEOC','U.S. Equal Employment Opportunity Commission','government',ARRAY['employment','employee-rights','accommodation','retaliation','eeoc','official']),
('Education OCR — How to File a Discrimination Complaint','Official Department of Education Office for Civil Rights instructions for filing discrimination complaints.','link','Education Rights','https://www.ed.gov/laws-and-policy/civil-rights-laws/file-complaint/how-file-discrimination-complaint-ocr','U.S. Department of Education Office for Civil Rights','Education OCR','U.S. Department of Education','government',ARRAY['education','ocr','complaint','discrimination','official']),
('Education OCR — How Complaints Are Handled','Official Department of Education Office for Civil Rights explanation of its complaint-processing procedures.','link','Education Rights','https://www.ed.gov/laws-and-policy/civil-rights-laws/file-complaint/how-the-office-for-civil-rights-handles-complaints','U.S. Department of Education Office for Civil Rights','Education OCR','U.S. Department of Education','government',ARRAY['education','ocr','complaint-process','civil-rights','official']),
('Education OCR — Shared Ancestry and Ethnic Characteristics','Official Department of Education civil-rights guidance on Title VI protections involving shared ancestry or ethnic characteristics.','link','Education Rights','https://www.ed.gov/laws-and-policy/civil-rights-laws/title-vi/title-vi-key-issues/discrimination-based-shared-ancestry-or-ethnic-characteristics','U.S. Department of Education Office for Civil Rights','Education OCR Title VI','U.S. Department of Education','government',ARRAY['education','title-vi','ancestry','ethnicity','discrimination','official']),
('Education — School Climate and Student Discipline: Know the Law','Official Department of Education resources on civil-rights protections and student discipline.','link','Education Rights','https://www.ed.gov/teaching-and-administration/safe-learning-environments/school-safety-and-security/school-climate-and-student-discipline/school-climate-and-student-discipline-resources-know-the-law','U.S. Department of Education','Student Discipline Resources','U.S. Department of Education','government',ARRAY['education','student-discipline','title-vi','civil-rights','official']),
('Education OCR — Title VI','Official Department of Education overview of Title VI protections against race, color, and national-origin discrimination in federally funded education programs.','link','Education Rights','https://www.ed.gov/laws-and-policy/civil-rights-laws/title-vi','U.S. Department of Education Office for Civil Rights','Education OCR Title VI','U.S. Department of Education','government',ARRAY['education','title-vi','race','national-origin','civil-rights','official']),
('Education OCR — How Civil Rights Complaints Are Resolved','Official Department of Education explanation of how OCR receives and resolves discrimination complaints.','link','Education Rights','https://www.ed.gov/laws-and-policy/civil-rights-laws/ensuring-equal-access/how-eds-office-civil-rights-resolves-complaints','U.S. Department of Education Office for Civil Rights','Education OCR','U.S. Department of Education','government',ARRAY['education','ocr','complaints','resolution','civil-rights','official']),
('Education OCR — Regulations Enforced by OCR','Official Department of Education listing of federal civil-rights regulations enforced by the Office for Civil Rights.','link','Education Rights','https://www.ed.gov/about/ed-offices/ocr/regulations-enforced-by-the-office-for-civil-rights','U.S. Department of Education Office for Civil Rights','Education OCR Regulations','U.S. Department of Education','government',ARRAY['education','ocr','regulations','civil-rights','official']),
('Department of Labor — Retaliation Protections','Official Wage and Hour Division guidance on retaliation protections for workers exercising rights under laws enforced by WHD.','link','Employment Rights','https://www.dol.gov/agencies/whd/retaliation','U.S. Department of Labor Wage and Hour Division','Wage and Hour Division','U.S. Department of Labor','government',ARRAY['employment','retaliation','worker-rights','dol','official']),
('ADA Requirements — Effective Communication','Official ADA.gov guidance on effective communication requirements for state and local governments and public accommodations.','link','Disability Rights','https://www.ada.gov/resources/effective-communication/','U.S. Department of Justice Civil Rights Division','ADA.gov','U.S. Department of Justice','government',ARRAY['ada','effective-communication','disability','accessibility','official']),
('ADA Title II Web and Mobile Accessibility Rule Webinar','Official ADA.gov overview webinar for the Title II web and mobile application accessibility rule and current compliance-date information.','link','Disability Rights','https://www.ada.gov/title-ii-web-rule/','U.S. Department of Justice Civil Rights Division','ADA.gov','U.S. Department of Justice','government',ARRAY['ada','title-ii','web-accessibility','mobile','official']),
('ADA.gov — Guidance on Web Accessibility','Official Justice Department guidance on ADA accessibility obligations for web content.','link','Disability Rights','https://www.ada.gov/resources/web-guidance/','U.S. Department of Justice Civil Rights Division','ADA.gov','U.S. Department of Justice','government',ARRAY['ada','web-accessibility','title-ii','title-iii','official']),
('ADA.gov — Service Animals','Official ADA.gov overview of service-animal requirements under the Americans with Disabilities Act.','link','Disability Rights','https://www.ada.gov/topics/service-animals/','U.S. Department of Justice Civil Rights Division','ADA.gov','U.S. Department of Justice','government',ARRAY['ada','service-animals','disability','public-access','official']),
('ADA.gov — Protecting the Rights of Voters with Disabilities','Official Justice Department guidance on the ADA and other federal protections for voters with disabilities.','link','Voting Rights','https://www.ada.gov/resources/protecting-voter-rights/','U.S. Department of Justice Civil Rights Division','ADA.gov','U.S. Department of Justice','government',ARRAY['ada','voting','disability','elections','accessibility','official']),
('ADA Title II Web Accessibility Rule Fact Sheet','Official ADA.gov fact sheet summarizing the rule on accessibility of web content and mobile applications provided by state and local governments.','link','Disability Rights','https://www.ada.gov/resources/2024-03-08-web-rule/','U.S. Department of Justice Civil Rights Division','ADA.gov','U.S. Department of Justice','government',ARRAY['ada','title-ii','web-accessibility','wcag','official']),
('ADA.gov — Service Animals Frequently Asked Questions','Official Justice Department answers to frequently asked questions about service animals and ADA requirements.','link','Disability Rights','https://www.ada.gov/resources/service-animals-faqs/','U.S. Department of Justice Civil Rights Division','ADA.gov','U.S. Department of Justice','government',ARRAY['ada','service-animals','faq','disability','official']);

-- Insert only missing canonical URLs.
INSERT INTO public.resource_library(title,description,resource_type,category,external_url,author,source,language,tags,is_approved)
SELECT title,description,resource_type,category,external_url,author,source,'en',tags,true
FROM _verified_resource_batch b
WHERE NOT EXISTS (SELECT 1 FROM public.resource_library r WHERE r.external_url=b.external_url);

-- Resolve one canonical row per official URL and refresh it from reviewed source data.
CREATE TEMP TABLE _verified_resource_map ON COMMIT DROP AS
SELECT b.*, (
  SELECT r.id FROM public.resource_library r
  WHERE r.external_url=b.external_url
  ORDER BY r.id LIMIT 1
) AS entity_id
FROM _verified_resource_batch b;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM _verified_resource_map WHERE entity_id IS NULL) THEN
    RAISE EXCEPTION 'verified resource batch could not resolve a canonical resource row';
  END IF;
END $$;

UPDATE public.resource_library r
SET title=m.title,
    description=m.description,
    resource_type=m.resource_type,
    category=m.category,
    external_url=m.external_url,
    author=m.author,
    source=m.source,
    language='en',
    tags=m.tags,
    is_approved=true,
    approved_by=NULL
FROM _verified_resource_map m
WHERE r.id=m.entity_id;

-- Any duplicate rows for the same URL stay hidden.
UPDATE public.resource_library r
SET is_approved=false
WHERE r.external_url IN (SELECT external_url FROM _verified_resource_map)
  AND NOT EXISTS (SELECT 1 FROM _verified_resource_map m WHERE m.entity_id=r.id);

INSERT INTO public.data_provenance(
  entity_type,entity_id,source_url,source_title,source_publisher,source_type,
  is_primary_source,is_active,retrieved_at,last_verified_at,verification_status,supported_fields
)
SELECT 'resource',entity_id,external_url,title,source_publisher,source_type,
       true,true,NOW(),NOW(),'verified_primary',
       ARRAY['title','description','resource_type','category','external_url','author','source']::text[]
FROM _verified_resource_map
ON CONFLICT (entity_type,entity_id,source_url)
DO UPDATE SET source_title=EXCLUDED.source_title,
              source_publisher=EXCLUDED.source_publisher,
              source_type=EXCLUDED.source_type,
              is_primary_source=true,
              is_active=true,
              retrieved_at=EXCLUDED.retrieved_at,
              last_verified_at=EXCLUDED.last_verified_at,
              verification_status='verified_primary',
              supported_fields=EXCLUDED.supported_fields;

-- Fail closed unless every canonical row passes the same publication gates used by RLS.
DO $$
DECLARE bad_count integer;
BEGIN
  SELECT count(*) INTO bad_count
  FROM _verified_resource_map m
  JOIN public.resource_library r ON r.id=m.entity_id
  WHERE NOT (
    coalesce(r.is_approved,false)=true
    AND public.has_publishable_provenance('resource',r.id)
    AND public.provenance_supports_fields('resource',r.id,
      ARRAY['title','resource_type','category']::text[]
      || CASE WHEN r.description IS NOT NULL THEN ARRAY['description']::text[] ELSE ARRAY[]::text[] END
      || CASE WHEN r.author IS NOT NULL THEN ARRAY['author']::text[] ELSE ARRAY[]::text[] END
      || CASE WHEN r.source IS NOT NULL THEN ARRAY['source']::text[] ELSE ARRAY[]::text[] END
      || CASE WHEN r.external_url IS NOT NULL THEN ARRAY['external_url']::text[] ELSE ARRAY[]::text[] END
      || CASE WHEN r.file_url IS NOT NULL THEN ARRAY['file_url']::text[] ELSE ARRAY[]::text[] END)
  );
  IF bad_count <> 0 THEN
    RAISE EXCEPTION 'verified resource publication gate failed for % row(s)', bad_count;
  END IF;
END $$;

COMMIT;
