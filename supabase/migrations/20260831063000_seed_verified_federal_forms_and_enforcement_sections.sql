-- Seed a fourth clean resource batch from current official/primary sources.
-- Focus: national federal court forms useful to self-represented litigants and
-- official DOJ Civil Rights Division enforcement-section reference pages.

CREATE TEMP TABLE _forms_enforcement_seed (
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

INSERT INTO _forms_enforcement_seed VALUES
('AO 88 — Civil Trial or Hearing Subpoena','Official national federal-court form for a subpoena requiring a person to appear and testify at a hearing or trial in a civil action.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/subpoena-appear-and-testify-a-hearing-or-trial-a-civil-action','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-88','subpoena','trial','hearing','civil-litigation','official']),
('AO 88A — Civil Deposition Subpoena','Official national federal-court form for a subpoena requiring testimony at a deposition in a civil action.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/subpoena-testify-a-deposition-a-civil-action','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-88a','subpoena','deposition','discovery','civil-litigation','official']),
('AO 398 — Notice of Lawsuit and Request to Waive Service','Official national federal-court form used to notify a defendant of a civil lawsuit and request waiver of formal service of a summons.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/notice-a-lawsuit-and-request-waive-service-a-summons','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-398','service','waiver','summons','civil-litigation','official']),
('AO 399 — Waiver of Service of Summons','Official national federal-court form for waiving formal service of a summons in a civil action.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/waiver-service-summons','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-399','waiver','service','summons','civil-litigation','official']),
('AO 440 — Summons in a Civil Action','Official national federal-court summons form for a civil action.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/summons-a-civil-action','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-440','summons','service','civil-litigation','official']),
('AO 441 — Summons on Third-Party Complaint','Official national federal-court summons form for use with a third-party complaint.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/summons-third-party-complaint','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-441','summons','third-party','civil-litigation','official']),
('JS 44 — Civil Cover Sheet','Official national federal-court Civil Cover Sheet, form JS 44.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/civil-cover-sheet','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['js-44','civil-cover-sheet','filing','federal-court','official']),
('AO 310 — Complaint of Judicial Misconduct or Disability','Official national federal judiciary form for submitting a complaint of judicial misconduct or disability under the federal judicial-conduct process.','link','Judicial Accountability','https://www.uscourts.gov/forms-rules/forms/complaint-judicial-misconduct-or-disability','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-310','judicial-misconduct','judicial-disability','complaint','official']),
('AO 241 — Petition for Writ of Habeas Corpus Under 28 U.S.C. § 2254','Official national federal-court petition form for a person in state custody seeking habeas relief under 28 U.S.C. § 2254.','link','Habeas Corpus','https://www.uscourts.gov/forms-rules/forms/petition-writ-habeas-corpus-under-28-usc-ss-2254','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-241','2254','habeas-corpus','state-custody','official']),
('AO 242 — Petition for Writ of Habeas Corpus Under 28 U.S.C. § 2241','Official national federal-court petition form for seeking habeas corpus relief under 28 U.S.C. § 2241.','link','Habeas Corpus','https://www.uscourts.gov/forms-rules/forms/petition-a-writ-habeas-corpus-under-28-usc-ss-2241','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-242','2241','habeas-corpus','custody','official']),
('AO 243 — Motion Under 28 U.S.C. § 2255','Official national federal-court form for a federal prisoner moving to vacate, set aside, or correct a sentence under 28 U.S.C. § 2255.','link','Post-Conviction Relief','https://www.uscourts.gov/forms-rules/forms/motion-vacate-set-aside-sentence-motion-under-28-usc-ss-2255','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-243','2255','post-conviction','federal-custody','official']),
('AO 240 — Short-Form Application to Proceed Without Prepaying Fees','Official national federal-court short-form application to proceed without prepaying fees or costs.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/application-proceed-district-court-without-prepaying-fees-or-costs-short-form','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-240','ifp','fee-waiver','pro-se','federal-court','official']),
('AO 85 — Consent to Magistrate Judge Jurisdiction','Official national federal-court form for notice, consent, and reference of a civil action to a United States magistrate judge.','link','Court Forms','https://www.uscourts.gov/forms-rules/forms/notice-consent-and-reference-a-civil-action-a-magistrate-judge','Administrative Office of the U.S. Courts','United States Courts','Administrative Office of the U.S. Courts','official',ARRAY['ao-85','magistrate-judge','consent','civil-litigation','official']),
('DOJ Civil Rights Division — Special Litigation Section','Official Civil Rights Division section page covering systemic constitutional and federal-rights enforcement involving law enforcement agencies, jails, prisons, juvenile justice, institutional disability rights, religious exercise, and related matters.','link','Civil Rights Enforcement','https://www.justice.gov/crt/special-litigation-section','U.S. Department of Justice Civil Rights Division','Special Litigation Section','U.S. Department of Justice','government',ARRAY['special-litigation','police','prisons','jails','civil-rights','official']),
('DOJ — Rights of Persons Confined to Jails and Prisons','Official Civil Rights Division information on federal protections and systemic enforcement concerning people confined in state or local jails and prisons.','link','Prisoner Rights','https://www.justice.gov/crt/rights-persons-confined-jails-and-prisons','U.S. Department of Justice Civil Rights Division','Special Litigation Section','U.S. Department of Justice','government',ARRAY['prisoner-rights','jails','prisons','cripa','official']),
('DOJ Civil Rights Division — Disability Rights Section','Official Civil Rights Division section page for ADA, Section 504, and related disability-rights enforcement, regulation, coordination, and technical assistance.','link','Disability Rights','https://www.justice.gov/crt/disability-rights-section','U.S. Department of Justice Civil Rights Division','Disability Rights Section','U.S. Department of Justice','government',ARRAY['ada','section-504','disability-rights','enforcement','official']),
('DOJ Civil Rights Division — Voting Section','Official Civil Rights Division section page for enforcement of federal laws protecting the right to vote.','link','Voting Rights','https://www.justice.gov/crt/voting-section','U.S. Department of Justice Civil Rights Division','Voting Section','U.S. Department of Justice','government',ARRAY['voting-rights','voting-rights-act','elections','civil-rights','official']),
('DOJ Civil Rights Division — Criminal Section','Official Civil Rights Division section page describing federal criminal civil-rights enforcement, including deprivation of rights under color of law, hate crimes, and related offenses.','link','Civil Rights Enforcement','https://www.justice.gov/crt/criminal-section','U.S. Department of Justice Civil Rights Division','Criminal Section','U.S. Department of Justice','government',ARRAY['criminal-civil-rights','color-of-law','hate-crimes','law-enforcement','official']),
('DOJ Civil Rights Division — Housing and Civil Enforcement Section','Official Civil Rights Division section page for enforcement involving fair housing, fair lending, public accommodations, religious land use, and servicemember protections.','link','Housing Rights','https://www.justice.gov/crt/housing-and-civil-enforcement-section','U.S. Department of Justice Civil Rights Division','Housing and Civil Enforcement Section','U.S. Department of Justice','government',ARRAY['fair-housing','fair-lending','public-accommodations','civil-rights','official']),
('DOJ Civil Rights Division — Federal Coordination and Compliance Section','Official Civil Rights Division section page for Title VI and related federal-funding nondiscrimination enforcement, coordination, oversight, and technical assistance.','link','Civil Rights Enforcement','https://www.justice.gov/crt/federal-coordination-and-compliance-section','U.S. Department of Justice Civil Rights Division','Federal Coordination and Compliance Section','U.S. Department of Justice','government',ARRAY['title-vi','federal-funding','nondiscrimination','language-access','official']),
('DOJ Civil Rights Division — Immigrant and Employee Rights Section','Official Civil Rights Division section page describing enforcement of the Immigration and Nationality Act anti-discrimination provision for citizenship-status, national-origin, document-abuse, retaliation, and intimidation claims in employment.','link','Employment Rights','https://www.justice.gov/crt/immigrant-and-employee-rights-section','U.S. Department of Justice Civil Rights Division','Immigrant and Employee Rights Section','U.S. Department of Justice','government',ARRAY['employment','immigration','citizenship-status','national-origin','retaliation','official']),
('DOJ Civil Rights Division — Educational Opportunities Section','Official Civil Rights Division section page describing federal enforcement against unlawful discrimination in public schools and institutions of higher education.','link','Education Rights','https://www.justice.gov/crt/educational-opportunities-section','U.S. Department of Justice Civil Rights Division','Educational Opportunities Section','U.S. Department of Justice','government',ARRAY['education','equal-protection','schools','discrimination','official']),
('DOJ Civil Rights Division — Employment Litigation Section','Official Civil Rights Division section page describing federal enforcement against unlawful workplace discrimination by state and local government employers and related retaliation.','link','Employment Rights','https://www.justice.gov/crt/employment-litigation-section','U.S. Department of Justice Civil Rights Division','Employment Litigation Section','U.S. Department of Justice','government',ARRAY['employment','title-vii','retaliation','state-local-government','official']);

INSERT INTO public.resource_library (
  title,description,resource_type,category,external_url,author,source,language,tags,is_approved
)
SELECT title,description,resource_type,category,external_url,author,source,'en',tags,true
FROM _forms_enforcement_seed s
WHERE NOT EXISTS (SELECT 1 FROM public.resource_library r WHERE r.external_url=s.external_url);

CREATE TEMP TABLE _forms_enforcement_map ON COMMIT DROP AS
SELECT s.*,
       (SELECT r.id FROM public.resource_library r WHERE r.external_url=s.external_url ORDER BY r.id LIMIT 1) entity_id
FROM _forms_enforcement_seed s;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM _forms_enforcement_map WHERE entity_id IS NULL) THEN
    RAISE EXCEPTION 'Could not resolve canonical federal-form/enforcement resource row';
  END IF;
END $$;

UPDATE public.resource_library r
SET title=m.title, description=m.description, resource_type=m.resource_type,
    category=m.category, external_url=m.external_url, author=m.author,
    source=m.source, language='en', tags=m.tags, is_approved=true
FROM _forms_enforcement_map m WHERE r.id=m.entity_id;

UPDATE public.resource_library r
SET is_approved=false
WHERE r.external_url IN (SELECT external_url FROM _forms_enforcement_map)
  AND NOT EXISTS (SELECT 1 FROM _forms_enforcement_map m WHERE m.entity_id=r.id);

INSERT INTO public.data_provenance (
  entity_type,entity_id,source_url,source_title,source_publisher,source_type,
  is_primary_source,is_active,retrieved_at,last_verified_at,verification_status,supported_fields
)
SELECT 'resource',entity_id,external_url,title,source_publisher,source_type,
       true,true,NOW(),NOW(),'verified_primary',
       ARRAY['title','description','resource_type','category','external_url','author','source']::text[]
FROM _forms_enforcement_map
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
  FROM _forms_enforcement_map m JOIN public.resource_library r ON r.id=m.entity_id
  WHERE r.is_approved=true
    AND public.has_publishable_provenance('resource',r.id)
    AND public.provenance_supports_fields(
      'resource',r.id,
      ARRAY['title','description','resource_type','category','external_url','author','source']::text[]
    );
  IF n <> 23 THEN RAISE EXCEPTION 'Expected 23 publishable verified federal-form/enforcement resources, found %',n; END IF;
END $$;