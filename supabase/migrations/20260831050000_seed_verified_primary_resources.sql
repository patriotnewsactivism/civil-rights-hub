-- Seed a clean, source-verified core resource library from official U.S. government sources.
--
-- Integrity rules:
--   * no fake community activity or synthetic personas;
--   * every published resource is anchored to the exact official URL displayed;
--   * only the fields directly supported by that source are marked as supported;
--   * duplicate legacy rows for the same URL remain retained but unpublished.

CREATE TEMP TABLE _verified_resource_seed (
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

INSERT INTO _verified_resource_seed (
  seed_id, title, description, resource_type, category, external_url,
  author, source, source_publisher, source_type, tags
) VALUES
('e8f44f71-6c55-4ea4-a9dc-100000000001','How to Make a FOIA Request','Official federal guidance on locating records, identifying the correct agency, and submitting a written Freedom of Information Act request.','link','Public Records','https://www.foia.gov/how-to.html','U.S. Department of Justice','FOIA.gov','U.S. Department of Justice','government',ARRAY['foia','public-records','federal','official']),
('e8f44f71-6c55-4ea4-a9dc-100000000002','Federal Rules of Civil Procedure','Official U.S. Courts publication page for the current Federal Rules of Civil Procedure governing civil proceedings in United States district courts.','link','Court Rules','https://www.uscourts.gov/forms-rules/current-rules-practice-procedure/federal-rules-civil-procedure','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['federal-court','civil-procedure','rules','litigation','official']),
('e8f44f71-6c55-4ea4-a9dc-100000000003','Federal Rules of Appellate Procedure','Official U.S. Courts publication page for the current Federal Rules of Appellate Procedure governing procedure in the United States courts of appeals.','link','Court Rules','https://www.uscourts.gov/forms-rules/current-rules-practice-procedure/federal-rules-appellate-procedure','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['federal-court','appeals','appellate-procedure','rules','official']),
('e8f44f71-6c55-4ea4-a9dc-100000000004','Federal Civil Court Forms','Official U.S. Courts collection of national civil forms, including summons, subpoenas, fee-waiver applications, civil cover sheets, and pro se forms.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/civil-forms','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['federal-court','civil','forms','pro-se','official']),
('e8f44f71-6c55-4ea4-a9dc-100000000005','Complaint for a Civil Case — Pro Se 1','Official national federal-court complaint form for a civil case, provided by the U.S. Courts for self-represented litigants and others preparing a civil complaint.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/complaint-a-civil-case','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['federal-court','complaint','pro-se','civil','form','official']),
('e8f44f71-6c55-4ea4-a9dc-100000000006','PACER — Federal Court Records','Official Public Access to Court Electronic Records service for locating and accessing federal court case information and filed documents.','link','Court Records','https://pacer.uscourts.gov/','Administrative Office of the U.S. Courts','PACER','Administrative Office of the U.S. Courts','official',ARRAY['pacer','federal-court','dockets','court-records','official']),
('e8f44f71-6c55-4ea4-a9dc-100000000007','Report a Civil Rights Violation to the U.S. Department of Justice','Official Department of Justice Civil Rights Division portal for submitting a report about a possible civil rights violation.','link','Reporting & Complaints','https://civilrights.justice.gov/report/','U.S. Department of Justice Civil Rights Division','Civil Rights Division','U.S. Department of Justice','government',ARRAY['civil-rights','complaint','doj','reporting','official']),
('e8f44f71-6c55-4ea4-a9dc-100000000008','DOJ Civil Rights Division Publications','Official Civil Rights Division collection of public guidance, training booklets, brochures, reports, and other civil-rights materials.','link','Legal Guides','https://www.justice.gov/crt/publications','U.S. Department of Justice Civil Rights Division','Civil Rights Division','U.S. Department of Justice','government',ARRAY['civil-rights','doj','guidance','publications','official']),
('e8f44f71-6c55-4ea4-a9dc-100000000009','ADA Title II Regulation — State and Local Government Services','Official Department of Justice Title II regulation supplement addressing nondiscrimination on the basis of disability in state and local government services.','pdf','Disability Rights','https://www.ada.gov/assets/pdfs/title_ii_reg_update.pdf','U.S. Department of Justice','ADA.gov','U.S. Department of Justice','government',ARRAY['ada','title-ii','disability-rights','state-government','local-government','official']),
('e8f44f71-6c55-4ea4-a9dc-100000000010','United States Code on GovInfo','Official GovInfo access point for searching and browsing the United States Code, the subject-matter codification of the general and permanent laws of the United States.','link','Federal Law','https://www.govinfo.gov/help/uscode','U.S. Government Publishing Office','GovInfo','U.S. Government Publishing Office','government',ARRAY['us-code','federal-law','statutes','govinfo','official']),
('e8f44f71-6c55-4ea4-a9dc-100000000011','Section 1983 Litigation, Third Edition','Federal Judicial Center publication on litigation under 42 U.S.C. § 1983, made publicly available through the U.S. Government Publishing Office.','pdf','Civil Rights Litigation','https://www.govinfo.gov/content/pkg/GOVPUB-JU13-PURL-gpo54237/pdf/GOVPUB-JU13-PURL-gpo54237.pdf','Federal Judicial Center','GovInfo','U.S. Government Publishing Office','government',ARRAY['section-1983','civil-rights','litigation','federal-court','official']);

INSERT INTO public.resource_library (
  id, title, description, resource_type, category, external_url,
  author, source, language, tags, is_approved
)
SELECT s.seed_id, s.title, s.description, s.resource_type, s.category, s.external_url,
       s.author, s.source, 'en', s.tags, true
FROM _verified_resource_seed s
WHERE NOT EXISTS (
  SELECT 1 FROM public.resource_library r WHERE r.external_url = s.external_url
);

CREATE TEMP TABLE _verified_resource_map ON COMMIT DROP AS
SELECT s.external_url, s.title, s.description, s.resource_type, s.category,
       s.author, s.source, s.source_publisher, s.source_type, s.tags,
       (SELECT r.id FROM public.resource_library r
        WHERE r.external_url = s.external_url ORDER BY r.id LIMIT 1) AS entity_id
FROM _verified_resource_seed s;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM _verified_resource_map WHERE entity_id IS NULL) THEN
    RAISE EXCEPTION 'Verified resource seed failed to resolve one or more canonical resource rows';
  END IF;
END
$$;

UPDATE public.resource_library r
SET title = m.title,
    description = m.description,
    resource_type = m.resource_type,
    category = m.category,
    external_url = m.external_url,
    author = m.author,
    source = m.source,
    language = 'en',
    tags = m.tags,
    is_approved = true
FROM _verified_resource_map m
WHERE r.id = m.entity_id;

UPDATE public.resource_library r
SET is_approved = false
WHERE r.external_url IN (SELECT external_url FROM _verified_resource_map)
  AND NOT EXISTS (SELECT 1 FROM _verified_resource_map m WHERE m.entity_id = r.id);

INSERT INTO public.data_provenance (
  entity_type, entity_id, source_url, source_title, source_publisher,
  source_type, is_primary_source, is_active, retrieved_at,
  last_verified_at, verification_status, supported_fields
)
SELECT 'resource', m.entity_id, m.external_url, m.title, m.source_publisher,
       m.source_type, true, true, NOW(), NOW(), 'verified_primary',
       ARRAY['title','description','resource_type','category','external_url','author','source']::TEXT[]
FROM _verified_resource_map m
ON CONFLICT (entity_type, entity_id, source_url)
DO UPDATE SET
  source_title = EXCLUDED.source_title,
  source_publisher = EXCLUDED.source_publisher,
  source_type = EXCLUDED.source_type,
  is_primary_source = true,
  is_active = true,
  retrieved_at = NOW(),
  last_verified_at = NOW(),
  verification_status = 'verified_primary',
  supported_fields = EXCLUDED.supported_fields,
  updated_at = NOW();

DO $$
DECLARE
  bad_count INTEGER;
BEGIN
  SELECT count(*) INTO bad_count
  FROM _verified_resource_map m
  JOIN public.resource_library r ON r.id = m.entity_id
  WHERE r.is_approved IS DISTINCT FROM true
     OR NOT public.has_publishable_provenance('resource', r.id)
     OR NOT public.provenance_supports_fields(
       'resource', r.id,
       ARRAY['title','description','resource_type','category','external_url','author','source']::TEXT[]
     );

  IF bad_count <> 0 THEN
    RAISE EXCEPTION 'Verified resource seed failed publication contract for % row(s)', bad_count;
  END IF;
END
$$;
