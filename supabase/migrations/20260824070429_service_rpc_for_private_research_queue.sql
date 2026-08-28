create or replace function public.stage_research_candidate(
  p_source text,
  p_query text,
  p_title text,
  p_source_url text,
  p_payload jsonb,
  p_trust_status text
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare v_id uuid;
begin
  insert into private.research_candidates(source, query, title, source_url, payload, trust_status)
  values (p_source, p_query, p_title, p_source_url, coalesce(p_payload,'{}'::jsonb), p_trust_status)
  on conflict (source, source_url) do update
    set query = excluded.query,
        title = excluded.title,
        payload = excluded.payload,
        trust_status = excluded.trust_status,
        updated_at = now()
  returning id into v_id;
  return v_id;
end;
$$;
revoke all on function public.stage_research_candidate(text,text,text,text,jsonb,text) from public, anon, authenticated;
grant execute on function public.stage_research_candidate(text,text,text,text,jsonb,text) to service_role;
