create or replace function public.has_publishable_provenance(p_entity_type text, p_entity_id uuid)
returns boolean
language sql
stable
set search_path to ''
as $function$
  select exists (
    select 1 from public.data_provenance p
    where p.entity_type=p_entity_type
      and p.entity_id=p_entity_id
      and p.is_active=true
      and p.is_primary_source=true
      and p.verification_status='verified_primary'
      and p.last_verified_at is not null
      and (
        (p_entity_type='attorney' and p.source_type in ('bar_directory','government','official') and p.last_verified_at >= now()-interval '180 days') or
        (p_entity_type='activist' and p.source_type in ('organization','government','official') and p.last_verified_at >= now()-interval '365 days') or
        (p_entity_type='violation' and p.source_type in ('court_record','government','official')) or
        (p_entity_type='state_law' and p.source_type in ('government','official','court_record') and p.last_verified_at >= now()-interval '180 days') or
        (p_entity_type='federal_law' and p.source_type in ('government','official','court_record') and p.last_verified_at >= now()-interval '365 days') or
        (p_entity_type='scanner' and p.source_type in ('organization','official') and p.last_verified_at >= now()-interval '30 days') or
        (p_entity_type='scanner_frequency' and p.source_type in ('government','official','organization') and p.last_verified_at >= now()-interval '30 days') or
        (p_entity_type='resource' and p.source_type in ('organization','government','official','court_record') and p.last_verified_at >= now()-interval '365 days') or
        (p_entity_type='foia_agency' and p.source_type in ('government','official') and p.last_verified_at >= now()-interval '365 days') or
        (p_entity_type='agency' and p.source_type in ('government','official') and p.last_verified_at >= now()-interval '365 days') or
        (p_entity_type='press_incident' and p.source_type in ('court_record','government','official') and p.last_verified_at >= now()-interval '365 days')
      )
  );
$function$;
