-- HISTORICAL MIGRATION TOMBSTONE
--
-- Version 20260803180000 (`more_comparison_data`) is already recorded as applied
-- in the Civil Rights Hub production Supabase project (vrdnrbjnitptxrexdlao).
--
-- The original remote migration bulk-seeded state_rights_comparison with
-- unsourced state-by-state claims about body-camera mandates, civilian review
-- boards, and hate-crime laws. Those claims do not satisfy the current
-- provenance standard and the corresponding public surface is fail-closed by
-- later integrity migrations.
--
-- This local file intentionally preserves the historical migration VERSION
-- without making the unsafe legacy seed executable again in new environments.
-- Do not replace this tombstone with generated or unsourced legal data.
--
-- Production already contains the historical effects of the original migration;
-- later migrations revoke/hold public access until source-level verification is
-- complete.

SELECT 1;
