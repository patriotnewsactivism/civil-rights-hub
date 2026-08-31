-- Civil Rights Hub verified resource batch 02
-- Sources reviewed 2026-08-31. Primary government or authoritative organization-controlled sources only.
-- Canonical identity is external_url. Existing rows are updated rather than duplicated.
-- Every published field below is backed by the source URL recorded in data_provenance.

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
  source_type text NOT NULL,
  tags text[] NOT NULL
) ON COMMIT DROP;

INSERT INTO _verified_resource_batch(title,description,resource_type,category,external_url,author,source,source_publisher,source_type,tags) VALUES
('LSC — Find Civil Legal Aid Near You','Legal Services Corporation locator for LSC-funded civil legal-aid organizations serving low-income people throughout the United States and territories.','link','Legal Assistance','https://www.lsc.gov/about-lsc/what-legal-aid/i-need-legal-help','Legal Services Corporation','LSC I Need Legal Help','Legal Services Corporation','nonprofit',ARRAY['legal-aid','civil-legal-help','low-income','locator','official']),
('ABA Lawyer Referral Directory','American Bar Association directory for finding state and local bar-association lawyer referral services.','link','Legal Assistance','https://www.americanbar.org/groups/lawyer_referral/resources/lawyer-referral-directory/','American Bar Association','ABA Lawyer Referral Directory','American Bar Association','nonprofit',ARRAY['lawyer-referral','attorney','bar-association','legal-help','official']),
('ABA Free Legal Answers','American Bar Association virtual legal clinic where qualifying users can submit civil legal questions for brief advice from volunteer attorneys.','link','Legal Assistance','https://www.americanbar.org/groups/probono_public_service/projects_awards/free-legal-answers/','American Bar Association','ABA Free Legal Answers','American Bar Association','nonprofit',ARRAY['pro-bono','legal-advice','civil-law','attorney','official']),
('PACER — Find a Federal Court Case','Official federal judiciary guide to locating federal court case records by specific court or nationwide PACER index.','link','Court Access','https://pacer.uscourts.gov/find-case','Administrative Office of the U.S. Courts','PACER Find a Case','Administrative Office of the U.S. Courts','government',ARRAY['pacer','federal-courts','case-search','court-records','official']),
('PACER — Court CM/ECF Lookup','Official federal judiciary lookup for court-specific CM/ECF access, filing systems, contact information, and technical details.','link','Court Access','https://pacer.uscourts.gov/file-case/court-cmecf-lookup','Administrative Office of the U.S. Courts','PACER Court CM/ECF Lookup','Administrative Office of the U.S. Courts','government',ARRAY['cm-ecf','federal-courts','electronic-filing','court-access','official']),
('DOJ Special Litigation — Cases and Matters','Official Civil Rights Division docket of corrections, juvenile justice, disability, law-enforcement, religious-exercise, and indigent-defense cases and matters.','link','Civil Rights Enforcement','https://www.justice.gov/crt/special-litigation-section-cases-and-matters','U.S. Department of Justice Civil Rights Division','Special Litigation Section Cases and Matters','U.S. Department of Justice','government',ARRAY['civil-rights','corrections','law-enforcement','juvenile-justice','indigent-defense','official']),
('DOJ RLUIPA — Institutionalized Persons Protections','Official Civil Rights Division explanation of federal protections for religious exercise by people confined in prisons, jails, juvenile facilities, and other covered institutions.','link','Prisoner Rights','https://www.justice.gov/crt/religious-land-use-and-institutionalized-persons-act-0','U.S. Department of Justice Civil Rights Division','RLUIPA Institutionalized Persons','U.S. Department of Justice','government',ARRAY['prisoner-rights','religion','rluipa','jails','prisons','official']),
('Federal Bureau of Prisons — Administrative Remedy Program','Official Bureau of Prisons program statement describing the administrative remedy process for federal inmates seeking formal review of confinement-related issues.','link','Prisoner Rights','https://www.bop.gov/policy/progstat/1330_013.pdf','Federal Bureau of Prisons','Administrative Remedy Program Statement 1330.13','U.S. Department of Justice Federal Bureau of Prisons','government',ARRAY['federal-prison','grievance','administrative-remedy','bop','official']),
('Reporters Committee Open Government Guide','Authoritative Reporters Committee guide covering open-records and open-meetings law in all 50 states and the District of Columbia.','link','Public Records','https://www.rcfp.org/open-government-guide/','Reporters Committee for Freedom of the Press','Open Government Guide','Reporters Committee for Freedom of the Press','nonprofit',ARRAY['open-records','open-meetings','state-law','journalism','official']),
('Reporters Committee — Police, Protesters, and the Press','Reporters Committee legal guide for journalists covering protests, including press rights, common charges, and practical legal considerations.','link','Press Freedom','https://www.rcfp.org/resources/police-protesters-and-the-press/','Reporters Committee for Freedom of the Press','Police, Protesters, and the Press','Reporters Committee for Freedom of the Press','nonprofit',ARRAY['press-freedom','protests','journalists','police','first-amendment','official']),
('Texas Attorney General — Public Information Act Resources','Official Texas Attorney General hub for Public Information Act guidance, rulings, handbooks, and open-government resources.','link','Public Records','https://www.texasattorneygeneral.gov/open-government/office-attorney-general-and-public-information-act','Office of the Attorney General of Texas','Texas Public Information Act Resources','Office of the Attorney General of Texas','government',ARRAY['texas','public-records','open-government','pia','official']),
('Texas Attorney General — Public Information Act Overview','Official Texas Attorney General overview of requester rights and the process for obtaining or withholding government records under the Public Information Act.','link','Public Records','https://www.texasattorneygeneral.gov/open-government/members-public/overview-public-information-act','Office of the Attorney General of Texas','Overview of the Public Information Act','Office of the Attorney General of Texas','government',ARRAY['texas','public-records','requester-rights','pia','official']),
('DOJ OIP — FOIA Resources','Official Office of Information Policy collection of FOIA statutes, exemption resources, guidance, and government-wide reference materials.','link','Public Records','https://www.justice.gov/oip/foia-resources','U.S. Department of Justice Office of Information Policy','FOIA Resources','U.S. Department of Justice','government',ARRAY['foia','public-records','exemptions','guidance','official']),
('DOJ FOIA Reference Guide','Official Department of Justice reference guide explaining how to request DOJ records and key FOIA procedures and exemptions.','link','Public Records','https://www.justice.gov/oip/department-justice-freedom-information-act-reference-guide','U.S. Department of Justice Office of Information Policy','DOJ FOIA Reference Guide','U.S. Department of Justice','government',ARRAY['foia','doj','request-guide','public-records','official']),
('Vote.gov — Register to Vote or Update Registration','Official federal voter-registration portal with state and territory instructions and links addressing common voting questions.','link','Voting Rights','https://vote.gov/','U.S. General Services Administration','Vote.gov','U.S. General Services Administration','government',ARRAY['voting','registration','elections','voter-rights','official']),
('U.S. Election Assistance Commission — Voting Accessibility','Official EAC resources on accessible voting, disability access, election administration, and voter accessibility research.','link','Voting Rights','https://www.eac.gov/voting-accessibility','U.S. Election Assistance Commission','Voting Accessibility','U.S. Election Assistance Commission','government',ARRAY['voting','disability','accessibility','elections','official']),
('U.S. Election Assistance Commission — Voters Portal','Official EAC voter portal with registration, voting, poll-worker, and state and local election information.','link','Voting Rights','https://www.eac.gov/voters','U.S. Election Assistance Commission','EAC Voters','U.S. Election Assistance Commission','government',ARRAY['voting','elections','registration','voter-information','official']),
('EAC — Voter Resources and Helpful Links','Official Election Assistance Commission collection of voter, election-system, constitutional, and state and local election resources.','link','Voting Rights','https://www.eac.gov/voters/voter-resources-helpful-links','U.S. Election Assistance Commission','Voter Resources and Helpful Links','U.S. Election Assistance Commission','government',ARRAY['voting','elections','voter-resources','official']),
('FVAP Voting Assistance Guide','Official Federal Voting Assistance Program guide for absentee voting by service members, eligible family members, and U.S. citizens overseas.','link','Voting Rights','https://www.fvap.gov/guide','Federal Voting Assistance Program','Voting Assistance Guide','U.S. Department of Defense','government',ARRAY['voting','military','overseas-voters','absentee','official']),
('EEOC — Retaliation','Official EEOC guidance explaining federal protections against retaliation for asserting employment-discrimination rights or participating in EEO proceedings.','link','Employment Rights','https://www.eeoc.gov/retaliation','U.S. Equal Employment Opportunity Commission','EEOC Retaliation','U.S. Equal Employment Opportunity Commission','government',ARRAY['employment','retaliation','eeo','discrimination','official']),
('EEOC — Religious Discrimination','Official EEOC guidance on religious discrimination, harassment, and accommodation under federal employment law.','link','Employment Rights','https://www.eeoc.gov/religious-discrimination','U.S. Equal Employment Opportunity Commission','EEOC Religious Discrimination','U.S. Equal Employment Opportunity Commission','government',ARRAY['employment','religion','discrimination','accommodation','official']),
('EEOC Enforcement Guidance — Retaliation and Related Issues','Official EEOC enforcement guidance addressing anti-retaliation provisions under the federal statutes enforced by the Commission.','link','Employment Rights','https://www.eeoc.gov/laws/guidance/enforcement-guidance-retaliation-and-related-issues','U.S. Equal Employment Opportunity Commission','Enforcement Guidance on Retaliation and Related Issues','U.S. Equal Employment Opportunity Commission','government',ARRAY['employment','retaliation','enforcement-guidance','eeoc','official']),
('Department of Labor WHD — How to File a Complaint','Official Wage and Hour Division instructions for filing a confidential worker complaint and understanding the investigation process.','link','Employment Rights','https://www.dol.gov/agencies/whd/contact/complaints?lang=en','U.S. Department of Labor Wage and Hour Division','How to File a Complaint','U.S. Department of Labor','government',ARRAY['employment','worker-rights','complaint','wages','official']),
('Department of Labor WHD — Worker Rights','Official Wage and Hour Division portal covering rights and protections for workers under laws enforced by WHD.','link','Employment Rights','https://www.dol.gov/agencies/whd/workers','U.S. Department of Labor Wage and Hour Division','Worker Rights','U.S. Department of Labor','government',ARRAY['employment','worker-rights','wages','labor','official']),
('Department of Labor WHD — Resources for Workers','Official Wage and Hour Division resource library for workers, including complaint materials, rights cards, and multilingual information.','link','Employment Rights','https://www.dol.gov/agencies/whd/workers-resources','U.S. Department of Labor Wage and Hour Division','Resources for Workers','U.S. Department of Labor','government',ARRAY['employment','worker-resources','labor','multilingual','official']),
('Department of Labor — Whistleblower Protections','Official Department of Labor overview of federal whistleblower and anti-retaliation protections and related enforcement resources.','link','Employment Rights','https://www.dol.gov/general/topics/whistleblower','U.S. Department of Labor','Whistleblower Protections','U.S. Department of Labor','government',ARRAY['employment','whistleblower','retaliation','worker-rights','official']),
('Education OCR — Disability Discrimination','Official Department of Education Office for Civil Rights hub for Section 504 and ADA Title II disability-discrimination protections in education.','link','Education Rights','https://www.ed.gov/laws-and-policy/civil-rights-laws/disability-discrimination','U.S. Department of Education Office for Civil Rights','Disability Discrimination','U.S. Department of Education','government',ARRAY['education','disability','section-504','ada-title-ii','official']),
('Education OCR — Disability Discrimination Laws Overview','Official OCR overview of Section 504 and ADA Title II protections and enforcement in educational programs and public educational entities.','link','Education Rights','https://www.ed.gov/laws-and-policy/civil-rights-laws/disability-discrimination/disability-discrimination-overview-of-laws','U.S. Department of Education Office for Civil Rights','Disability Discrimination Overview of Laws','U.S. Department of Education','government',ARRAY['education','disability','section-504','ada-title-ii','official']),
('Education OCR — Disability Discrimination FAQs','Official OCR answers to frequently asked questions about Section 504, ADA Title II, accommodations, access, and disability discrimination in school settings.','link','Education Rights','https://www.ed.gov/laws-and-policy/civil-rights-laws/disability-discrimination/frequently-asked-questions-disability-discrimination','U.S. Department of Education Office for Civil Rights','Disability Discrimination FAQs','U.S. Department of Education','government',ARRAY['education','disability','section-504','accommodations','official']),
('Education OCR — Section 504 Free Appropriate Public Education','Official OCR guidance on FAPE obligations for qualified K-12 students with disabilities under Section 504 and ADA Title II.','link','Education Rights','https://www.ed.gov/laws-and-policy/civil-rights-laws/disability-discrimination/disability-discrimination-key-issues/disability-discrimination-providing-free-appropriate-public-education-fape','U.S. Department of Education Office for Civil Rights','Providing a Free Appropriate Public Education','U.S. Department of Education','government',ARRAY['education','disability','fape','section-504','official']),
('Education OCR — Programs and Facilities Accessibility','Official OCR guidance and resources addressing physical and program accessibility for people with disabilities in schools, colleges, and universities.','link','Education Rights','https://www.ed.gov/laws-and-policy/civil-rights-laws/disability-discrimination/disability-discrimination-key-issues/disability-discrimination-programs-and-facilities-accessibility','U.S. Department of Education Office for Civil Rights','Programs and Facilities Accessibility','U.S. Department of Education','government',ARRAY['education','disability','accessibility','facilities','official']);

INSERT INTO public.resource_library(title,description,resource_type,category,external_url,author,source,language,tags,is_approved)
SELECT title,description,resource_type,category,external_url,author,source,'en',tags,true
FROM _verified_resource_batch b
WHERE NOT EXISTS (SELECT 1 FROM public.resource_library r WHERE r.external_url=b.external_url);

CREATE TEMP TABLE _verified_resource_map ON COMMIT DROP AS
SELECT b.*, (SELECT r.id FROM public.resource_library r WHERE r.external_url=b.external_url ORDER BY r.id LIMIT 1) AS entity_id
FROM _verified_resource_batch b;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM _verified_resource_map WHERE entity_id IS NULL) THEN
    RAISE EXCEPTION 'verified resource batch could not resolve a canonical resource row';
  END IF;
END $$;

UPDATE public.resource_library r
SET title=m.title, description=m.description, resource_type=m.resource_type, category=m.category,
    external_url=m.external_url, author=m.author, source=m.source, language='en', tags=m.tags,
    is_approved=true, approved_by=NULL
FROM _verified_resource_map m
WHERE r.id=m.entity_id;

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