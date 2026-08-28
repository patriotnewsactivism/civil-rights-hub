-- ARCHIVED / NEVER APPLY
-- This migration version was never recorded in the Civil Rights Hub production migration ledger.
-- It was superseded by the reviewed provenance system beginning with
-- supabase/migrations/20260822180500_source_provenance_gate.sql and its subsequent hardening migrations.
-- Kept here only for historical/audit context so the Supabase CLI will not replay it.

-- Provenance Gate Migration
-- Enforces fail-closed verification, quarantines legacy unverified/unprovenanced data,
-- and creates audit-ready provenance metadata for public directory records.

CREATE TABLE IF NOT EXISTS public.provenance_quarantine (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_table TEXT NOT NULL,
    record_id TEXT NOT NULL,
    legacy_payload JSONB NOT NULL,
    quarantine_reason TEXT NOT NULL,
    quarantined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    reviewed BOOLEAN NOT NULL DEFAULT false,
    reviewer_notes TEXT
);

ALTER TABLE IF EXISTS public.attorneys
    ADD COLUMN IF NOT EXISTS provenance_source TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS provenance_verified_at TIMESTAMPTZ DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS provenance_verified_by TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'standard',
    ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT DEFAULT NULL;

ALTER TABLE IF EXISTS public.scanner_links
    ADD COLUMN IF NOT EXISTS provenance_source TEXT DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS provenance_verified_at TIMESTAMPTZ DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS provenance_verified_by TEXT DEFAULT NULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attorneys' AND column_name = 'is_verified') THEN
        INSERT INTO public.provenance_quarantine (source_table, record_id, legacy_payload, quarantine_reason)
        SELECT
            'attorneys',
            id::text,
            to_jsonb(a),
            'Legacy verification lacked primary source provenance gate.'
        FROM public.attorneys a
        WHERE a.is_verified = true
          AND (a.provenance_source IS NULL OR a.provenance_source = '')
        ON CONFLICT DO NOTHING;

        UPDATE public.attorneys
        SET is_verified = false
        WHERE provenance_source IS NULL OR provenance_source = '';
    END IF;
END $$;

ALTER TABLE public.provenance_quarantine ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public cannot read quarantined legacy records" ON public.provenance_quarantine;
CREATE POLICY "Public cannot read quarantined legacy records"
    ON public.provenance_quarantine
    FOR SELECT
    TO authenticated
    USING (false);
