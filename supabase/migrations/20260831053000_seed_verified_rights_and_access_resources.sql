-- Seed a second clean resource batch from current official/primary sources.
-- Focus: constitutional rights, federal court access, police-misconduct guidance,
-- disability complaints, public records, judicial accountability, and legal aid.

CREATE TEMP TABLE _rights_resource_seed (
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

INSERT INTO _rights_resource_seed VALUES
('e8f44f71-6c55-4ea4-a9dc-200000000001','First Amendment — Constitution Annotated','Official Congress.gov Constitution Annotated material covering the First Amendment and its protections for religion, speech, press, peaceable assembly, and petition.','link','Constitutional Rights','https://constitution.congress.gov/browse/amendment-1','Library of Congress / Congress.gov','Constitution Annotated','Library of Congress','government',ARRAY['first-amendment','speech','press','assembly','petition','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000002','Fourth Amendment — Constitution Annotated','Official Congress.gov Constitution Annotated material covering Fourth Amendment protections against unreasonable searches and seizures and the warrant requirement.','link','Constitutional Rights','https://constitution.congress.gov/browse/amendment-4','Library of Congress / Congress.gov','Constitution Annotated','Library of Congress','government',ARRAY['fourth-amendment','search','seizure','warrants','privacy','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000003','Fifth Amendment — Constitution Annotated','Official Congress.gov Constitution Annotated material covering the Fifth Amendment, including due process, self-incrimination, double jeopardy, grand jury, and takings protections.','link','Constitutional Rights','https://constitution.congress.gov/browse/amendment-5/','Library of Congress / Congress.gov','Constitution Annotated','Library of Congress','government',ARRAY['fifth-amendment','due-process','self-incrimination','double-jeopardy','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000004','Sixth Amendment — Constitution Annotated','Official Congress.gov Constitution Annotated material covering Sixth Amendment rights in criminal prosecutions, including speedy and public trial, jury, confrontation, compulsory process, notice, and counsel.','link','Constitutional Rights','https://constitution.congress.gov/browse/amendment-6/','Library of Congress / Congress.gov','Constitution Annotated','Library of Congress','government',ARRAY['sixth-amendment','criminal-procedure','counsel','speedy-trial','jury','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000005','Fourteenth Amendment — Constitution Annotated','Official Congress.gov Constitution Annotated material covering the Fourteenth Amendment, including citizenship, due process, incorporation, privileges or immunities, and equal protection.','link','Constitutional Rights','https://constitution.congress.gov/browse/amendment-14/','Library of Congress / Congress.gov','Constitution Annotated','Library of Congress','government',ARRAY['fourteenth-amendment','due-process','equal-protection','incorporation','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000006','Federal Rules of Evidence','Official U.S. Courts publication page for the Federal Rules of Evidence used in federal court proceedings.','link','Court Rules','https://www.uscourts.gov/forms-rules/current-rules-practice-procedure/federal-rules-evidence','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['federal-court','evidence','rules','trial','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000007','Federal Rules of Criminal Procedure','Official U.S. Courts publication page for the Federal Rules of Criminal Procedure governing federal criminal proceedings and prosecutions.','link','Court Rules','https://www.uscourts.gov/forms-rules/current-rules-practice-procedure/federal-rules-criminal-procedure','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['federal-court','criminal-procedure','rules','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000008','Find a Federal Court','Official U.S. Courts federal court finder for locating federal district, appellate, bankruptcy, and other court websites and locations.','link','Court Access','https://www.uscourts.gov/federal-court-finder/find','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['federal-court','court-locator','district-court','appeals','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000009','Find Civil Legal Aid','Legal Services Corporation resource for locating an LSC-funded civil legal aid organization serving a user’s area.','link','Legal Assistance','https://www.lsc.gov/','Legal Services Corporation','Legal Services Corporation','Legal Services Corporation','organization',ARRAY['legal-aid','civil-legal-aid','low-income','attorney','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000010','DOJ Guide to Law Enforcement Misconduct','Official Civil Rights Division resource describing federal investigation and prosecution of constitutional violations and related misconduct by law enforcement officials.','link','Police Accountability','https://www.justice.gov/crt/law-enforcement-misconduct','U.S. Department of Justice Civil Rights Division','Civil Rights Division','U.S. Department of Justice','government',ARRAY['police-misconduct','civil-rights','law-enforcement','doj','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000011','DOJ Police Misconduct Laws and Complaint Guidance','Official Civil Rights Division overview of federal criminal and civil laws addressing police misconduct and how to report possible violations to DOJ.','link','Police Accountability','https://www.justice.gov/crt/addressing-police-misconduct-laws-enforced-department-justice','U.S. Department of Justice Civil Rights Division','Civil Rights Division','U.S. Department of Justice','government',ARRAY['police-misconduct','complaint','civil-rights','doj','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000012','DOJ Pattern-or-Practice Law Enforcement Authority','Official Civil Rights Division information on federal authority addressing patterns or practices by law enforcement agencies that deprive people of federal rights.','link','Police Accountability','https://www.justice.gov/crt/conduct-law-enforcement-agencies','U.S. Department of Justice Civil Rights Division','Civil Rights Division','U.S. Department of Justice','government',ARRAY['pattern-or-practice','police','civil-rights','34-usc-12601','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000013','File an ADA Complaint','Official ADA.gov guidance explaining who may be the subject of an ADA complaint and how to submit a disability-discrimination complaint to the appropriate federal agency or DOJ.','link','Disability Rights','https://www.ada.gov/file-a-complaint/','U.S. Department of Justice Civil Rights Division','ADA.gov','U.S. Department of Justice','government',ARRAY['ada','disability-rights','complaint','discrimination','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000014','Search Federal Agency Websites Before Filing FOIA','Official FOIA.gov search tool for checking information already published across federal agency websites and FOIA libraries before submitting a new records request.','link','Public Records','https://www.foia.gov/search.html','U.S. Department of Justice Office of Information Policy','FOIA.gov','U.S. Department of Justice','government',ARRAY['foia','public-records','agency-search','records','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000015','Federal Judicial Conduct and Disability Complaints','Official U.S. Courts information about the Judicial Conduct and Disability Act process for complaints alleging misconduct or disability by covered federal judges.','link','Judicial Accountability','https://www.uscourts.gov/administration-policies/judicial-conduct-disability','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['judicial-conduct','federal-judge','complaint','accountability','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000016','Cameras in the Federal Courtroom Policy','Official U.S. Courts policy information concerning cameras, broadcasting, and courtroom proceedings in the federal judiciary.','link','Press & Court Access','https://www.uscourts.gov/administration-policies/judiciary-policies/cameras-courtroom-policy','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['cameras','courtroom','press','recording','federal-court','official']),
('e8f44f71-6c55-4ea4-a9dc-200000000017','Portable Communication Devices in Federal Courthouses','Official U.S. Courts policy information addressing portable communication devices in federal courthouses.','link','Press & Court Access','https://www.uscourts.gov/administration-policies/judiciary-policies/portable-communication-devices-courthouse','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['courthouse','phones','cameras','devices','press','official']);

INSERT INTO public.resource_library (
  id,title,description,resource_type,category,external_url,author,source,language,tags,is_approved
)
SELECT seed_id,title,description,resource_type,category,external_url,author,source,'en',tags,true
FROM _rights_resource_seed s
WHERE NOT EXISTS (SELECT 1 FROM public.resource_library r WHERE r.external_url=s.external_url);

CREATE TEMP TABLE _rights_resource_map ON COMMIT DROP AS
SELECT s.*,
       (SELECT r.id FROM public.resource_library r WHERE r.external_url=s.external_url ORDER BY r.id LIMIT 1) entity_id
FROM _rights_resource_seed s;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM _rights_resource_map WHERE entity_id IS NULL) THEN
    RAISE EXCEPTION 'Could not resolve canonical rights-resource row';
  END IF;
END $$;

UPDATE public.resource_library r
SET title=m.title, description=m.description, resource_type=m.resource_type,
    category=m.category, external_url=m.external_url, author=m.author,
    source=m.source, language='en', tags=m.tags, is_approved=true
FROM _rights_resource_map m WHERE r.id=m.entity_id;

UPDATE public.resource_library r
SET is_approved=false
WHERE r.external_url IN (SELECT external_url FROM _rights_resource_map)
  AND NOT EXISTS (SELECT 1 FROM _rights_resource_map m WHERE m.entity_id=r.id);

INSERT INTO public.data_provenance (
  entity_type,entity_id,source_url,source_title,source_publisher,source_type,
  is_primary_source,is_active,retrieved_at,last_verified_at,verification_status,supported_fields
)
SELECT 'resource',entity_id,external_url,title,source_publisher,source_type,
       true,true,NOW(),NOW(),'verified_primary',
       ARRAY['title','description','resource_type','category','external_url','author','source']::text[]
FROM _rights_resource_map
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
  FROM _rights_resource_map m JOIN public.resource_library r ON r.id=m.entity_id
  WHERE r.is_approved=true
    AND public.has_publishable_provenance('resource',r.id)
    AND public.provenance_supports_fields(
      'resource',r.id,
      ARRAY['title','description','resource_type','category','external_url','author','source']::text[]
    );
  IF n <> 17 THEN RAISE EXCEPTION 'Expected 17 publishable verified rights resources, found %',n; END IF;
END $$;
