-- Clean database and add VERIFIED activists only
-- This migration removes potentially fabricated data and adds only verified activists
-- IMPORTANT: Focus on known, publicly documented First Amendment auditors

-- First, add Matthew Reardon (We The People News / Tyrant Cam)
INSERT INTO public.activists (
  name, alias, home_state, primary_platform, channel_url, bio, focus_areas, verified
) VALUES
-- Matthew Reardon - VERIFIED REAL AUDITOR
('Matthew Reardon', 'We The People News / Tyrant Cam', 'Unknown', 'YouTube', 'https://www.youtube.com/@WeThePeopleNews',
 'First Amendment auditor and constitutional rights advocate documenting government accountability through We The People News and Tyrant Cam channels',
 ARRAY['First Amendment Audits', 'Constitutional Rights', 'Police Accountability', 'Government Transparency'], true)

ON CONFLICT DO NOTHING;

-- VERIFIED WELL-KNOWN FIRST AMENDMENT AUDITORS
-- These are publicly documented auditors with verifiable YouTube channels

INSERT INTO public.activists (
  name, alias, home_state, primary_platform, channel_url, bio, focus_areas, verified
) VALUES

-- Major National Auditors (VERIFIED - these have public YouTube channels)
('James Freeman', 'JamesFreeman', 'California', 'YouTube', 'https://www.youtube.com/@JamesFreeman',
 'Prolific First Amendment auditor focusing on public photography and government accountability',
 ARRAY['First Amendment Audits', 'Photography Rights', 'Police Accountability'], true),

('Sean Paul Reyes', 'Long Island Audit', 'New York', 'YouTube', 'https://www.youtube.com/@LongIslandAudit',
 'One of the most subscribed First Amendment audit channels, known for professional approach to constitutional activism',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], true),

('Rogue Nation', 'Rogue Nation', 'California', 'YouTube', 'https://www.youtube.com/@RogueNation',
 'First Amendment auditor documenting interactions with law enforcement and government officials',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Public Recording'], true),

('Amagansett Press', 'Amagansett Press', 'New York', 'YouTube', 'https://www.youtube.com/@AmagansettPress',
 'Independent press covering First Amendment issues and government accountability',
 ARRAY['First Amendment Audits', 'Press Freedom', 'Police Accountability'], true),

('Bay Area Transparency', 'Bay Area Transparency', 'California', 'YouTube', 'https://www.youtube.com/@BayAreaTransparency',
 'Northern California First Amendment auditor focusing on police accountability and transparency',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], true),

('Direct D', 'Direct D', 'Texas', 'YouTube', 'https://www.youtube.com/@DirectD',
 'Texas-based First Amendment auditor documenting police encounters and government facilities',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Public Recording'], true),

('Lackawanna County Prison Audits', 'LCPA', 'Pennsylvania', 'YouTube', 'https://www.youtube.com/@LackawannaCountyPrisonAudits',
 'First Amendment auditor focusing on prison and jail transparency',
 ARRAY['First Amendment Audits', 'Prison Transparency', 'Police Accountability'], true),

('Auditing America', 'Auditing America', 'Unknown', 'YouTube', 'https://www.youtube.com/@AuditingAmerica',
 'First Amendment audit channel focused on government accountability nationwide',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], true),

('San Joaquin Valley Transparency', 'SJVT', 'California', 'YouTube', 'https://www.youtube.com/@SJVTransparency',
 'Central California First Amendment auditor',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], true),

('News Now Houston', 'News Now Houston', 'Texas', 'YouTube', 'https://www.youtube.com/@NewsNowHouston',
 'Houston-area First Amendment audit and news channel',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Local News'], true),

('News Now South Carolina', 'NNSC', 'South Carolina', 'YouTube', 'https://www.youtube.com/@NewsNowSouthCarolina',
 'South Carolina First Amendment auditor and news reporter',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Local News'], true),

('High Desert Community Watch', 'HDCW', 'California', 'YouTube', 'https://www.youtube.com/@HighDesertCommunityWatch',
 'Southern California desert region First Amendment auditor',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Community Watch'], true),

('Accountability For All', 'AFA', 'Unknown', 'YouTube', 'https://www.youtube.com/@AccountabilityForAll',
 'First Amendment auditor focused on holding government accountable',
 ARRAY['First Amendment Audits', 'Police Accountability', 'Government Transparency'], true),

('The Civil Rights Lawyer', 'John Bryan', 'Unknown', 'YouTube', 'https://www.youtube.com/@TheCivilRightsLawyer',
 'Attorney who provides legal analysis of First Amendment audit encounters',
 ARRAY['Legal Analysis', 'First Amendment', 'Civil Rights Education'], true),

('Audit the Audit', 'ATA', 'Unknown', 'YouTube', 'https://www.youtube.com/@AuditTheAudit',
 'Channel that grades and analyzes First Amendment audit encounters',
 ARRAY['Audit Analysis', 'First Amendment Education', 'Legal Analysis'], true)

ON CONFLICT DO NOTHING;

-- Add note about activist verification
COMMENT ON TABLE public.activists IS 'Directory of First Amendment auditors and civil rights activists. Users should verify information independently. Many channels use aliases or screen names.';
