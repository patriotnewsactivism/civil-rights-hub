# Civil Rights Hub production migration run — 2026-08-30

This temporary operations marker intentionally triggers the guarded `Civil Rights Hub Supabase Migration` workflow from the dedicated `ops/run-supabase-migrations` branch.

Purpose:
- apply the already-reviewed pending production migrations on Supabase project `vrdnrbjnitptxrexdlao`;
- apply the clean social/community recovery and runtime reconciliation migrations;
- verify provenance/security smoke tests and the production social runtime contract;
- deploy the fail-closed Edge Functions included in the guarded migration workflow.

No application behavior is changed by this marker file itself.
