drop trigger if exists "update_attorneys_updated_at" on "public"."attorneys";

drop policy "Anyone can view attorneys" on "public"."attorneys";

drop policy "Service role can manage attorneys" on "public"."attorneys";

drop index if exists "public"."idx_attorneys_city";

drop index if exists "public"."idx_attorneys_name";

drop index if exists "public"."idx_attorneys_practice_areas";

drop index if exists "public"."idx_attorneys_rating";

drop index if exists "public"."idx_attorneys_search";

drop index if exists "public"."idx_attorneys_state";

alter table "public"."attorneys" disable row level security;

alter table "public"."violations" add constraint "chk_violations_status" CHECK ((status = ANY (ARRAY['pending'::text, 'verified'::text, 'resolved'::text]))) not valid;

alter table "public"."violations" validate constraint "chk_violations_status";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;


