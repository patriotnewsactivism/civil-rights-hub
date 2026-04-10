-- Additional demo posts seeded into the social feed
-- Only runs if at least one auth user exists (same pattern as 20260315000002)
-- Posts represent realistic civil rights community content

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Only seed if there is at least one registered user
  SELECT id INTO v_user_id FROM auth.users ORDER BY created_at LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No users found – skipping additional demo post seeding';
    RETURN;
  END IF;

  -- Skip if we already have many posts
  IF (SELECT COUNT(*) FROM public.posts) > 20 THEN
    RAISE NOTICE 'Posts already seeded – skipping';
    RETURN;
  END IF;

  INSERT INTO public.posts (content, user_id, created_at) VALUES

  (
    'COURT UPDATE: The 9th Circuit ruled today in Porter v. Bowen that requiring photo ID for absentee ballot requests in Wisconsin imposes an undue burden on voters with disabilities. Court applied the Anderson-Burdick balancing test and found the state failed to show sufficient justification. Huge win for voting rights. #voting-rights #disability-rights #ninth-circuit #first-amendment',
    v_user_id,
    NOW() - INTERVAL '3 hours'
  ),

  (
    'KNOW YOUR RIGHTS — Traffic Stop Edition (THREAD):

1. You DO have to provide your license, registration, and proof of insurance when asked.
2. You do NOT have to consent to a search of your vehicle.
3. You CAN record the interaction on your phone.
4. If asked to step out, you must comply — but you are NOT answering questions.
5. Say clearly: "Officer, am I free to go?"
6. If not: "I am invoking my right to remain silent and my right to counsel."
7. Do NOT argue or physically resist — comply and contest in court.

Save this. Share this. Know this.

#know-your-rights #traffic-stop #fourth-amendment #fifth-amendment',
    v_user_id,
    NOW() - INTERVAL '6 hours'
  ),

  (
    'MAJOR FOIA WIN in Illinois: After 14 months of requests and one lawsuit, the Chicago Police Department released nearly 3,200 pages of disciplinary records for 47 officers with 10+ complaints each. The documents show supervisors repeatedly ignored repeat misconduct findings. Publishing a full analysis next week. Follow for updates. #foia #police-accountability #chicago #transparency',
    v_user_id,
    NOW() - INTERVAL '9 hours'
  ),

  (
    'LEGAL RESOURCE: If you''re arrested at a protest, here''s what happens next and what you should do:

→ BOOKING: You will be photographed and fingerprinted. Do not resist.
→ INTERROGATION: Say ONLY "I am invoking my right to remain silent. I want a lawyer." Then STOP TALKING.
→ ARRAIGNMENT: Usually within 48-72 hours. You can request a public defender.
→ BAIL: Ask the National Lawyers Guild emergency number in your area BEFORE you are arraigned.
→ EVIDENCE: Start writing down everything you remember as soon as you can.

NLG National number: 212-679-6018
Save this in your contacts NOW.

#protest-rights #know-your-rights #fifth-amendment #nlg #legal-aid',
    v_user_id,
    NOW() - INTERVAL '12 hours'
  ),

  (
    'Recording police? Know these facts:

✅ ALL 50 states permit recording police in public spaces under the First Amendment.
✅ You can record from the sidewalk, your car, your property, a public park.
❌ Officers CANNOT order you to stop recording in a public place.
❌ Officers CANNOT seize your phone without a warrant.
❌ Officers CANNOT delete your recordings (Riley v. California, 2014).

If an officer grabs your phone: Don''t resist. Say "I do not consent to a search." Report to: reporters@rcfp.org

#recording-rights #first-amendment #know-your-rights #press-freedom',
    v_user_id,
    NOW() - INTERVAL '15 hours'
  ),

  (
    'ATTORNEY SPOTLIGHT: The National Lawyers Guild legal observer program is active in over 60 cities. Trained volunteers in bright green hats observe and document police conduct at demonstrations. They are NOT affiliated with protesters — they are neutral monitors there to protect everyone.

If you''re organizing a protest, you can REQUEST NLG legal observers at: https://nlg.org/legalobservers

If you''re arrested at a protest, call the NLG legal support line in your city BEFORE speaking to police.

#nlg #legal-observer #protest-rights #know-your-rights',
    v_user_id,
    NOW() - INTERVAL '18 hours'
  ),

  (
    'FOURTH AMENDMENT PRIMER — What "Reasonable Expectation of Privacy" Actually Means:

The Supreme Court in Katz v. United States (1967) established the test: a search occurs when the government violates a subjective expectation of privacy that society recognizes as reasonable.

Key holdings since:
• Cell phone contents: WARRANT required (Riley, 2014)
• Cell-site location data: WARRANT required (Carpenter, 2018)
• Home: WARRANT ALWAYS required (Payton, 1980)
• Car at a checkpoint: No warrant for exterior (Illinois v. Caballes)
• Public park: No reasonable expectation (Oliver v. US)

Know the law. Know your rights.

#fourth-amendment #search-and-seizure #know-your-rights #privacy',
    v_user_id,
    NOW() - INTERVAL '1 day'
  ),

  (
    'COMMUNITY WIN: After 18 months of organizing, Phoenix activists secured a city council vote banning the use of ketamine by Phoenix PD as a chemical restraint except in medical emergencies with full paramedic supervision. This follows multiple deaths after police-requested ketamine injections. The movement works.

#phoenix #police-reform #community-organizing #police-accountability',
    v_user_id,
    NOW() - INTERVAL '1 day 4 hours'
  ),

  (
    'IMMIGRATION RIGHTS REMINDER:

If ICE comes to your door:
→ Do NOT open the door unless they have a judicial warrant (signed by a judge, not an ICE agent)
→ Ask them to slide the warrant under the door
→ An "administrative warrant" (Form I-200/I-205) does NOT give them the right to enter
→ Remain silent — you have the right under the 5th Amendment

If you are detained:
→ Say "I am invoking my right to remain silent and my right to speak with an attorney"
→ Do not sign anything
→ Contact RAICES: (210) 222-0964 or your local immigration legal aid

#immigration-rights #ice #know-your-rights #fifth-amendment',
    v_user_id,
    NOW() - INTERVAL '1 day 8 hours'
  ),

  (
    'JUST PUBLISHED: Our full analysis of the new DOJ report on consent decrees and police reform in 12 cities. Key finding: cities with active consent decrees show a 34% reduction in excessive force complaints and a 28% reduction in civil settlements over 5 years. The data is clear — oversight works.

Read the full analysis at [link in bio] and share widely. The public needs to see this evidence when departments lobby against reform.

#police-reform #consent-decree #doj #transparency #data',
    v_user_id,
    NOW() - INTERVAL '2 days'
  ),

  (
    'SURVEILLANCE THREAD: What is a Stingray (IMSI Catcher)?

A "Stingray" is a device that mimics a cell tower, tricking nearby phones into connecting to it. Law enforcement uses them to:
• Track phone location in real-time
• Identify phones in an area
• Intercept calls and texts (some models)

Legal status:
• Federal: Most agencies require a warrant (after Carpenter)
• Many states: Still in legal gray area
• Many departments: Refuse to disclose their use

Protect yourself: Use airplane mode at protests. Signal for messages.

#surveillance #stingray #privacy #fourth-amendment #digital-security',
    v_user_id,
    NOW() - INTERVAL '2 days 6 hours'
  ),

  (
    'SECTION 1983 EXPLAINED — The Most Important Civil Rights Law You''ve Never Heard Of:

42 U.S.C. § 1983 allows you to sue STATE and LOCAL officials who violate your constitutional rights WHILE ACTING UNDER COLOR OF LAW.

To win, you need to show:
1. The defendant was acting under color of state law
2. The defendant deprived you of a constitutional or federal statutory right

The Obstacle: QUALIFIED IMMUNITY
Officers are often immune unless they violated a "clearly established" right. The doctrine was created by judges (not Congress) and has no basis in § 1983's text.

Fighting QI:
• Colorado eliminated it (2020)
• NM, NYC, NJ, and others have limited it
• Federal legislation has stalled

Know your rights. Know your remedies.

#section-1983 #qualified-immunity #civil-rights #know-your-rights',
    v_user_id,
    NOW() - INTERVAL '3 days'
  ),

  (
    'RESOURCE ALERT: The Reporters Committee for Freedom of the Press has a free 24/7 legal defense hotline for journalists facing legal threats, arrest at protests, equipment seizure, or subpoenas:

📞 1-800-336-4243

They''ve helped thousands of journalists. If you or someone you know is a journalist facing legal pressure from law enforcement — call immediately, before complying with any demand.

Also free: their letter generator for responding to open records denials and their state shield law guide. All at rcfp.org

#press-freedom #journalist #shield-law #first-amendment #reporters-committee',
    v_user_id,
    NOW() - INTERVAL '3 days 12 hours'
  ),

  (
    'KNOW YOUR RIGHTS — At a Checkpoint:

DUI / Sobriety Checkpoints:
• LEGAL in most states (Michigan Dept. of State Police v. Sitz, 1990)
• You MUST show ID and license if in a vehicle
• You do NOT have to answer incriminating questions
• You may recite: "Officer, I''m invoking my Fifth Amendment right to remain silent"

Border Checkpoints (within 100 miles of US border):
• CBP can question you about citizenship
• You are NOT required to consent to vehicle search
• You may ask: "Am I free to go?"

Immigration Checkpoints:
• Have your ID if you are a US citizen or have status
• Non-citizens must carry registration documents
• Remain calm. Refuse consent to search.

#know-your-rights #checkpoint #fourth-amendment #fifth-amendment #immigration',
    v_user_id,
    NOW() - INTERVAL '4 days'
  );

  RAISE NOTICE 'Successfully seeded additional demo posts';
END $$;
