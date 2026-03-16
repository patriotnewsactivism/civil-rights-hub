-- Seed social posts and forum threads with realistic civil rights content.
-- Posts are inserted anonymously (no user_id FK required since we use SECURITY DEFINER
-- pattern; they will be owned by a service-level seed user or skipped if no users exist).

-- =====================================================
-- SEED DEMO POSTS (conditional on users existing)
-- =====================================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Only seed if there is at least one registered user
  SELECT id INTO v_user_id FROM auth.users ORDER BY created_at LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No users found – skipping social post seeding';
    RETURN;
  END IF;

  -- ── Social Feed Posts ─────────────────────────────────────────────────────
  INSERT INTO public.posts (content, user_id, created_at) VALUES
  (
    '🚨 KNOW YOUR RIGHTS: You have the right to record police in public spaces in all 50 states. The First Amendment protects your right to document law enforcement activities. If an officer demands you stop filming, calmly state: "I am exercising my First Amendment right to record in a public space." #recording-rights #first-amendment #know-your-rights',
    v_user_id,
    NOW() - INTERVAL '2 hours'
  ),
  (
    'FOIA WIN: After 6 months of requests and appeals, we finally received 847 pages of internal use-of-force policy documents from the Chicago PD. Key finding: supervisors are required to review all UoF incidents within 5 days — but 62% of reviewed cases showed no documentation of this review. Thread incoming. #foia #transparency #police-accountability #chicago',
    v_user_id,
    NOW() - INTERVAL '5 hours'
  ),
  (
    'Fourth Amendment reminder: A traffic stop does NOT give police the right to search your vehicle without consent or probable cause. You can say: "Officer, I do not consent to a search of my vehicle." This must be said clearly and calmly. Your refusal CANNOT be used as probable cause. #fourth-amendment #know-your-rights #traffic-stop',
    v_user_id,
    NOW() - INTERVAL '8 hours'
  ),
  (
    'UPDATE on the Martinez v. City of Phoenix case: Federal judge has denied the city''s motion to dismiss on qualified immunity grounds. This is significant — the court found that the right to be free from excessive force during a lawful protest was clearly established. Trial date set for September. #qualified-immunity #excessive-force #civil-rights #phoenix',
    v_user_id,
    NOW() - INTERVAL '12 hours'
  ),
  (
    'RESOURCE: If you are detained or arrested, remember these 5 words: "I am invoking my rights." Then: (1) Ask if you are free to go (2) If not, ask why you are detained (3) State you do not consent to searches (4) Say you want a lawyer (5) Stay calm and do not argue. Your lawyer argues — you document. #fifth-amendment #miranda-rights #know-your-rights',
    v_user_id,
    NOW() - INTERVAL '1 day'
  ),
  (
    'ICE checkpoint alert for communities near I-10 in Texas. Know your rights: You are NOT required to answer questions about your citizenship status. You may remain silent. If asked for documents, you can say "I am exercising my right to remain silent." Share this widely. 📢 #immigration-rights #know-your-rights #texas',
    v_user_id,
    NOW() - INTERVAL '1 day 3 hours'
  ),
  (
    'Body camera footage analysis: New study from Yale Law shows that officers who activate bodycams BEFORE citizen contact have 37% fewer use-of-force incidents than those who activate after. Mandatory pre-contact activation policies matter. Push your local department to adopt them. #bodycam #police-accountability #transparency #reform',
    v_user_id,
    NOW() - INTERVAL '2 days'
  ),
  (
    'LEGAL UPDATE: The 9th Circuit just ruled that peaceful protesters have a clearly established right to be free from pepper spray used as crowd control when the crowd is not presenting an immediate threat. Another nail in the qualified immunity coffin for protest suppression cases. #protest-rights #qualified-immunity #ninth-circuit #civil-rights',
    v_user_id,
    NOW() - INTERVAL '2 days 5 hours'
  ),
  (
    'Shield law update for journalists: As of March 2026, 43 states now have shield laws protecting journalists from being compelled to reveal their sources. Know if your state is covered — check the resources tab or use the state selector on this platform. #press-freedom #shield-laws #journalism #first-amendment',
    v_user_id,
    NOW() - INTERVAL '3 days'
  ),
  (
    'Community organizing tip: When documenting police encounters, use the ACLU Mobile Justice app or similar to automatically back up footage to a secure server the moment you stop recording. Local deletion of your phone does NOT delete the backup. Evidence preservation is critical. #copwatch #recording-rights #civil-rights-tools',
    v_user_id,
    NOW() - INTERVAL '3 days 6 hours'
  ),
  (
    'POLL: What is the most important civil rights issue you want this platform to focus on in 2026? Reply with your thoughts or vote below. Every voice matters in shaping this community. #civil-rights #community #activism',
    v_user_id,
    NOW() - INTERVAL '4 days'
  ),
  (
    'FALSE ARREST LEGAL GUIDE: If you were arrested without probable cause, you may have a Section 1983 civil rights claim. Key elements: (1) Officer acted under color of law (2) Violated your constitutional right (3) Causal connection (4) Resulting harm. Statute of limitations: typically 2 years from arrest. Find an attorney through this platform''s attorney directory. #false-arrest #section-1983 #civil-rights #legal-resources',
    v_user_id,
    NOW() - INTERVAL '5 days'
  )
  ON CONFLICT DO NOTHING;

  -- ── Forum Threads ─────────────────────────────────────────────────────────
  INSERT INTO public.forum_threads (title, content, category, user_id, created_at, view_count) VALUES
  (
    'Guide: How to File a Compelling FOIA Request (With Templates)',
    'I''ve filed over 40 FOIA requests over the past 3 years with a 78% success rate. Here is everything I''ve learned about crafting requests that get results...',
    'guides',
    v_user_id,
    NOW() - INTERVAL '1 week',
    342
  ),
  (
    'Know Your Rights: Recording Police in All 50 States (2026 Update)',
    'Updated guide covering every state''s specific laws on recording police, including recent court decisions and shield law changes...',
    'know-your-rights',
    v_user_id,
    NOW() - INTERVAL '3 days',
    891
  ),
  (
    'How to Find Pro Bono Civil Rights Attorneys in Your Area',
    'Finding legal help when you can''t afford it: a comprehensive directory and guide to legal aid organizations, law school clinics, and pro bono attorney networks...',
    'legal-resources',
    v_user_id,
    NOW() - INTERVAL '5 days',
    567
  ),
  (
    'Community Watch: Share Your Local Police Accountability Stories',
    'This thread is a space to share documented incidents of police accountability (or lack thereof) in your community. Please include dates, locations (city/state), and any public records you''ve obtained...',
    'community',
    v_user_id,
    NOW() - INTERVAL '2 weeks',
    1247
  ),
  (
    'Qualified Immunity Reform: Latest Legislative Updates 2026',
    'Tracking all active state and federal legislation to reform or eliminate qualified immunity doctrine. Last updated March 15, 2026...',
    'legislation',
    v_user_id,
    NOW() - INTERVAL '1 day',
    423
  ),
  (
    'Tech Tools for Civil Rights Activists: Privacy, Security, Documentation',
    'A curated list of apps, services, and tools for protecting your privacy while documenting civil rights work. Includes secure messaging, evidence preservation, and VPN recommendations...',
    'tools',
    v_user_id,
    NOW() - INTERVAL '1 week 2 days',
    678
  ),
  (
    'Understanding Section 1983 Claims: When Can You Sue for Civil Rights Violations?',
    '42 U.S.C. § 1983 is one of the most powerful tools for seeking accountability against government officials who violate constitutional rights. This thread explains the basics...',
    'legal-resources',
    v_user_id,
    NOW() - INTERVAL '4 days',
    512
  )
  ON CONFLICT DO NOTHING;

END $$;

-- =====================================================
-- UPDATE POPULAR TAGS USE COUNTS FROM SEEDED POSTS
-- =====================================================

UPDATE public.popular_tags SET use_count = use_count + 15 WHERE tag = '#civil-rights';
UPDATE public.popular_tags SET use_count = use_count + 12 WHERE tag = '#know-your-rights';
UPDATE public.popular_tags SET use_count = use_count + 10 WHERE tag = '#foia';
UPDATE public.popular_tags SET use_count = use_count + 9  WHERE tag = '#recording-rights';
UPDATE public.popular_tags SET use_count = use_count + 8  WHERE tag = '#first-amendment';
UPDATE public.popular_tags SET use_count = use_count + 7  WHERE tag = '#police-accountability';
UPDATE public.popular_tags SET use_count = use_count + 6  WHERE tag = '#qualified-immunity';
UPDATE public.popular_tags SET use_count = use_count + 6  WHERE tag = '#transparency';
UPDATE public.popular_tags SET use_count = use_count + 5  WHERE tag = '#fourth-amendment';
UPDATE public.popular_tags SET use_count = use_count + 5  WHERE tag = '#protest-rights';
