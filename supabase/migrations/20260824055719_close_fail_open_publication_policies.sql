drop policy if exists web_anon_select on public.attorneys;
create policy web_anon_select on public.attorneys for select to anon using (
  coalesce(is_verified,false)=true
  and public.has_publishable_provenance('attorney',id)
  and public.provenance_supports_populated_claims('attorney',id,to_jsonb(attorneys.*))
);
drop policy if exists web_authenticated_select on public.attorneys;
create policy web_authenticated_select on public.attorneys for select to authenticated using (
  coalesce(is_verified,false)=true
  and public.has_publishable_provenance('attorney',id)
  and public.provenance_supports_populated_claims('attorney',id,to_jsonb(attorneys.*))
);

drop policy if exists web_anon_select on public.resource_library;
create policy web_anon_select on public.resource_library for select to anon using (
  coalesce(is_approved,false)=true
  and public.has_publishable_provenance('resource',id)
  and public.provenance_supports_fields('resource',id,
    array['title','resource_type','category']::text[]
    || case when description is not null then array['description']::text[] else array[]::text[] end
    || case when author is not null then array['author']::text[] else array[]::text[] end
    || case when source is not null then array['source']::text[] else array[]::text[] end
    || case when external_url is not null then array['external_url']::text[] else array[]::text[] end
    || case when file_url is not null then array['file_url']::text[] else array[]::text[] end)
);
drop policy if exists web_authenticated_select on public.resource_library;
create policy web_authenticated_select on public.resource_library for select to authenticated using (
  coalesce(is_approved,false)=true
  and public.has_publishable_provenance('resource',id)
  and public.provenance_supports_fields('resource',id,
    array['title','resource_type','category']::text[]
    || case when description is not null then array['description']::text[] else array[]::text[] end
    || case when author is not null then array['author']::text[] else array[]::text[] end
    || case when source is not null then array['source']::text[] else array[]::text[] end
    || case when external_url is not null then array['external_url']::text[] else array[]::text[] end
    || case when file_url is not null then array['file_url']::text[] else array[]::text[] end)
);

drop policy if exists web_anon_select on public.foia_agencies;
create policy web_anon_select on public.foia_agencies for select to anon using (
  coalesce(is_active,false)=true
  and public.has_publishable_provenance('foia_agency',id)
  and public.provenance_supports_fields('foia_agency',id,
    array['name','agency_type']::text[]
    || case when acronym is not null then array['acronym']::text[] else array[]::text[] end
    || case when state is not null then array['state']::text[] else array[]::text[] end
    || case when website_url is not null then array['website_url']::text[] else array[]::text[] end
    || case when foia_guide_url is not null then array['foia_guide_url']::text[] else array[]::text[] end
    || case when foia_online_portal_url is not null then array['foia_online_portal_url']::text[] else array[]::text[] end)
);
drop policy if exists web_authenticated_select on public.foia_agencies;
create policy web_authenticated_select on public.foia_agencies for select to authenticated using (
  coalesce(is_active,false)=true
  and public.has_publishable_provenance('foia_agency',id)
  and public.provenance_supports_fields('foia_agency',id,
    array['name','agency_type']::text[]
    || case when acronym is not null then array['acronym']::text[] else array[]::text[] end
    || case when state is not null then array['state']::text[] else array[]::text[] end
    || case when website_url is not null then array['website_url']::text[] else array[]::text[] end
    || case when foia_guide_url is not null then array['foia_guide_url']::text[] else array[]::text[] end
    || case when foia_online_portal_url is not null then array['foia_online_portal_url']::text[] else array[]::text[] end)
);

drop policy if exists web_anon_select on public.scanner_frequencies;
create policy web_anon_select on public.scanner_frequencies for select to anon using (
  coalesce(verified,false)=true and public.has_publishable_provenance('scanner_frequency',id)
  and public.provenance_supports_fields('scanner_frequency',id,
    array['agency_name','state','frequency_mhz','source_type','source_url']::text[])
);
drop policy if exists web_authenticated_select on public.scanner_frequencies;
create policy web_authenticated_select on public.scanner_frequencies for select to authenticated using (
  coalesce(verified,false)=true and public.has_publishable_provenance('scanner_frequency',id)
  and public.provenance_supports_fields('scanner_frequency',id,
    array['agency_name','state','frequency_mhz','source_type','source_url']::text[])
);

drop policy if exists web_anon_select on public.press_freedom_incidents;
create policy web_anon_select on public.press_freedom_incidents for select to anon using (
  coalesce(verified,false)=true and public.has_publishable_provenance('press_incident',id)
  and public.provenance_supports_fields('press_incident',id,
    array['incident_date','state','target_type','violation_type','description','source_url']::text[])
);
drop policy if exists web_authenticated_select on public.press_freedom_incidents;
create policy web_authenticated_select on public.press_freedom_incidents for select to authenticated using (
  coalesce(verified,false)=true and public.has_publishable_provenance('press_incident',id)
  and public.provenance_supports_fields('press_incident',id,
    array['incident_date','state','target_type','violation_type','description','source_url']::text[])
);
