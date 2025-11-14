-- Add disclaimers and helpful comments to tables with data quality concerns

-- Scanner links table - note about verification needed
COMMENT ON TABLE public.scanner_links IS 'Police scanner feed links by location. NOTE: Scanner feed availability changes frequently. Feed IDs and URLs should be verified at Broadcastify.com before relying on them. Some feeds may require subscription or may be offline.';

COMMENT ON COLUMN public.scanner_links.is_active IS 'Indicates if scanner feed was active at time of entry. Should be verified before use as feeds go online/offline frequently.';

COMMENT ON COLUMN public.scanner_links.listener_count IS 'Approximate listener count at time of entry. This number is not updated in real-time.';

-- Add note to attorneys table about verification
COMMENT ON TABLE public.attorneys IS 'Civil rights attorneys and organizations directory. Contains verified national and state-level organizations. Contact information should be verified before use. For most current information, visit organization websites directly.';

-- Add note about state laws being current as of migration date
COMMENT ON TABLE public.state_laws IS 'State-specific civil rights laws including recording consent requirements and journalist shield laws. Shield law information current as of November 2024. State laws change - verify current status before relying on this information.';

-- Federal laws note
COMMENT ON TABLE public.federal_laws IS 'Major U.S. federal civil rights statutes. Information current as of 2024. For most current statutory text and amendments, consult official government sources like govinfo.gov.';

-- Add warning to forum tables about moderation
COMMENT ON TABLE public.forum_threads IS 'Community discussion forum threads. Requires moderation for public-facing deployment.';
COMMENT ON TABLE public.forum_posts IS 'Forum thread replies. Requires moderation for public-facing deployment.';

-- Add note about FOIA templates
COMMENT ON TABLE public.foia_templates IS 'FOIA and public records request templates. Templates are for guidance only and may need to be updated based on current law and agency procedures. Verify submission methods and deadlines before use.';
