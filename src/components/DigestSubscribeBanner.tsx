// NOTE (2026-08-03): this component's real implementation depends on a `digest_subscriptions`
// table that does not exist in the live database — confirmed via direct REST probe
// (PGRST205 "Could not find the table 'public.digest_subscriptions'"). It was previously
// rendered on the homepage and silently failed with an error toast on every subscribe attempt.
//
// Disabled here (renders nothing) until the backend actually exists. The exact DDL + RLS
// needed to ship this feature for real is in supabase/MISSING_TABLES_MIGRATION.sql at the
// repo root — once that migration has been run, restore the previous implementation from
// git history (commit before 2026-08-03) and delete this stub.
export function DigestSubscribeBanner() {
  return null;
}
