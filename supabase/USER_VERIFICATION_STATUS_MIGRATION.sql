-- ============================================================================
-- user_verification: add status/organization/credential_detail — run live 2026-08-03
--
-- UserProfile.tsx's verification-request form (journalist/attorney/activist
-- credential verification) already collected role, organization name, and a
-- free-text credential detail, and already checked request status
-- (pending/approved) — but the real user_verification table only had
-- badge_type/verification_type/verification_document_url/is_active/
-- verified_at/verified_by. No place to store the org/detail text the form
-- collects, and no pending/approved/rejected status column at all (is_active
-- alone can't express "rejected" vs "not yet reviewed"). Added the three
-- columns the existing code already expected.
--
-- Known gap, flagged not silently built: there is still no moderator/admin
-- UI anywhere in this app to review and approve/reject these requests —
-- submissions land in this table and stay status='pending' forever until
-- someone builds that review surface (or someone manually flips
-- status/is_active/verified_by/verified_at via SQL). Out of scope for this
-- pass — this is a new feature, not a schema-drift fix.
-- ============================================================================

alter table public.user_verification
  add column if not exists status text not null default 'pending',
  add column if not exists organization text,
  add column if not exists credential_detail text;

create index if not exists user_verification_status_idx on public.user_verification (status);
