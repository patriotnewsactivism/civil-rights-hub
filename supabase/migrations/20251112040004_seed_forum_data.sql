-- Seed data for forum_threads and forum_posts tables

-- Insert forum threads
INSERT INTO public.forum_threads (
  id,
  user_id,
  username,
  title,
  content,
  category,
  view_count,
  post_count,
  last_post_at,
  is_pinned,
  is_locked,
  created_at
) VALUES

-- Pinned welcome thread
(
  '11111111-1111-1111-1111-111111111111',
  NULL,
  'Community Moderator',
  'Welcome to the Act Now Hub Community!',
  'Welcome to the Act Now Hub discussion board!

This is a community space for discussing civil rights issues, sharing information, organizing, and supporting each other. Please keep discussions respectful and focused on civil rights, police accountability, legal information, and community organizing.

**Forum Categories:**
- **General Discussion**: General civil rights topics
- **Legal Questions**: Questions about laws and rights (not legal advice)
- **Know Your Rights**: Education about constitutional rights
- **Organizing & Activism**: Coordination and movement building
- **Resource Sharing**: Share helpful resources and tools
- **Support**: Emotional support and community care

**Community Guidelines:**
1. Be respectful and constructive
2. No doxxing or sharing private information
3. No incitement to violence
4. Stay on topic within each category
5. This forum does not provide legal advice - consult an attorney for your specific situation

We''re here to support each other and build a stronger movement for justice. Welcome!',
  'General Discussion',
  2547,
  12,
  NOW() - INTERVAL '2 hours',
  true,
  false,
  NOW() - INTERVAL '30 days'
),

-- Know Your Rights threads
(
  '22222222-2222-2222-2222-222222222222',
  NULL,
  'CivilRightsEducator',
  'What to do if stopped by police - comprehensive guide',
  'I wanted to share a comprehensive guide on what to do if you are stopped by police, whether on foot or in a vehicle. Knowing your rights can protect you.

**If stopped while walking:**
1. Stay calm and keep hands visible
2. You have the right to remain silent except for providing name in some states
3. You have the right to refuse a search of your person or belongings
4. Ask "Am I free to go?" If yes, calmly walk away
5. If detained, ask why
6. Do not resist even if you believe the stop is unlawful
7. Remember details and write them down as soon as possible

**If stopped while driving:**
1. Pull over safely and turn off engine
2. Keep hands on steering wheel where officer can see them
3. You must provide license, registration, and insurance when asked
4. You have the right to remain silent for other questions
5. You can refuse consent to search your vehicle
6. If arrested, your vehicle may be searched without consent

**Recording police:**
- You have a First Amendment right to record police in public
- Keep a safe distance and don''t interfere with their work
- Clearly announce you are recording
- Do not delete footage if asked

**After an encounter:**
- Write down everything you remember immediately
- Get names and badge numbers
- Photograph any injuries
- File a complaint if your rights were violated
- Consider consulting an attorney

What experiences have others had? What additional tips would you add?',
  'Know Your Rights',
  3842,
  28,
  NOW() - INTERVAL '5 hours',
  false,
  false,
  NOW() - INTERVAL '15 days'
),

(
  '33333333-3333-3333-3333-333333333333',
  NULL,
  'LegalObserver',
  'Recording laws by state - important updates',
  'There have been some important developments in recording laws that everyone should know about:

**One-party consent states:** You can record conversations you''re part of without telling others. This includes most states.

**Two-party consent states:** All parties must consent to recording private conversations. These states are:
- California
- Connecticut
- Florida
- Illinois
- Maryland
- Massachusetts
- Michigan
- Montana
- Nevada
- New Hampshire
- Pennsylvania
- Washington

**IMPORTANT:** Even in two-party states, you can ALWAYS record police officers performing their duties in public. This is protected by the First Amendment.

**Recent developments:**
- Multiple federal courts have affirmed the right to record police
- Some states have passed laws explicitly protecting the right to record
- However, you can still be arrested for "interference" so maintain a safe distance

**Best practices:**
1. Clearly state you are recording
2. Don''t interfere with police activity
3. Maintain safe distance (usually 10-15 feet minimum)
4. Continue recording until encounter is completely over
5. Back up footage immediately to cloud storage

Has anyone had experiences with recording police? Share your stories and tips.',
  'Know Your Rights',
  2934,
  19,
  NOW() - INTERVAL '1 day',
  false,
  false,
  NOW() - INTERVAL '8 days'
),

-- Organizing & Activism threads
(
  '44444444-4444-4444-4444-444444444444',
  NULL,
  'CommunityOrganizer',
  'Starting a local police accountability group - lessons learned',
  'After 2 years of organizing, our local police accountability group has made real progress. I wanted to share what worked for us in case it helps others:

**Getting Started:**
1. Start small - just a few committed people
2. Define clear goals (oversight board, policy changes, etc.)
3. Research what other cities have accomplished
4. Build relationships with sympathetic city council members
5. Connect with existing organizations (ACLU, NLG, local churches)

**Building Power:**
- Attend every city council meeting
- Submit public records requests regularly
- Document everything
- Hold community forums to hear concerns
- Train community members as legal observers
- Build coalition with other justice organizations

**Successes we''ve had:**
- Got body cameras mandated for all officers
- Established citizen review board with subpoena power
- Changed use of force policy
- Got budget reduced and funds redirected to mental health
- Elected reform-minded city council members

**Challenges:**
- Police union opposition
- Media trying to discredit movement
- Burnout and sustainability
- Internal disagreements on tactics
- Repression and surveillance

The key is persistence and staying organized. Small wins build momentum. Happy to answer questions!',
  'Organizing & Activism',
  1823,
  34,
  NOW() - INTERVAL '3 hours',
  false,
  false,
  NOW() - INTERVAL '12 days'
),

(
  '55555555-5555-5555-5555-555555555555',
  NULL,
  'ProtestSafetyCoordinator',
  'Protest safety and legal observer training',
  'With protest season heating up, I wanted to share some safety tips and information about legal observer training.

**Before the protest:**
- Write legal aid number on your arm in permanent marker
- Bring ID but consider leaving wallet at home
- Charge phone fully and bring portable charger
- Let someone know where you''re going
- Buddy system - don''t go alone

**What to bring:**
- Water and snacks
- Any necessary medications
- Face covering (many reasons)
- Eye protection
- Change of clothes in your car
- First aid supplies

**What NOT to bring:**
- Weapons of any kind
- Drugs or alcohol
- Unnecessary valuables

**If arrested:**
- Remain silent - seriously, say NOTHING except "I want a lawyer"
- Do not sign anything
- Do not agree to anything
- Ask for medical attention if needed
- Try to remember names/badge numbers

**Legal Observers:**
Legal observers are trained volunteers who:
- Document police actions at protests
- Provide witness reports for legal defense
- Monitor for civil rights violations
- Help connect arrestees with legal support

National Lawyers Guild offers legal observer training. Check if there''s a chapter in your area.

**Know your rights:**
- First Amendment protects your right to protest
- You can''t be arrested just for protesting peacefully
- Police need probable cause to arrest
- You don''t have to answer questions

Stay safe out there and protect each other!',
  'Organizing & Activism',
  2156,
  23,
  NOW() - INTERVAL '8 hours',
  false,
  false,
  NOW() - INTERVAL '5 days'
),

-- Legal Questions threads
(
  '66666666-6666-6666-6666-666666666666',
  NULL,
  'QuestionAsker',
  'Can I file a complaint if officer refused to provide badge number?',
  'I had an encounter with a police officer yesterday who I believe violated my rights. When I asked for his badge number, he refused to give it to me and walked away.

Can I still file a complaint even though I don''t have his badge number? What information do I need? Should I get a lawyer?

The encounter happened outside the Main Street subway station around 6pm on November 10th. I have some video but didn''t get a clear shot of his face.

Any advice appreciated. Not asking for legal advice, just wondering what my options are.',
  'Legal Questions',
  1634,
  15,
  NOW() - INTERVAL '4 hours',
  false,
  false,
  NOW() - INTERVAL '2 days'
),

(
  '77777777-7777-7777-7777-777777777777',
  NULL,
  'ConcernedCitizen',
  'Questions about FOIA request process',
  'I''m trying to get body camera footage from an incident involving my son. I filed a FOIA request 3 weeks ago and haven''t heard back.

Questions:
1. How long can they legally take to respond?
2. Can they just ignore the request?
3. Do I need to pay fees upfront or after they find the records?
4. What if they say the footage doesn''t exist?

I''m in Illinois if that matters. Has anyone successfully gotten body camera footage? How long did it take?

Thanks for any guidance.',
  'Legal Questions',
  892,
  11,
  NOW() - INTERVAL '1 day',
  false,
  false,
  NOW() - INTERVAL '4 days'
),

-- Resource Sharing threads
(
  '88888888-8888-8888-8888-888888888888',
  NULL,
  'ResourceSharer',
  'Comprehensive list of civil rights legal resources',
  'I''ve compiled a list of free and low-cost legal resources for civil rights issues. Please add more in the comments!

**National Organizations:**
- ACLU - https://www.aclu.org/ (takes strategic cases)
- National Lawyers Guild - https://www.nlg.org/ (lawyer referrals, legal observers)
- Lawyers Committee for Civil Rights - https://lawyerscommittee.org/
- NAACP Legal Defense Fund - https://www.naacpldf.org/
- Southern Poverty Law Center - https://www.splcenter.org/

**Know Your Rights Resources:**
- ACLU Know Your Rights - https://www.aclu.org/know-your-rights
- EFF Digital Rights - https://www.eff.org/issues/know-your-rights
- Flex Your Rights - https://www.flexyourrights.org/

**Legal Aid:**
- Legal Services Corporation - https://www.lsc.gov/what-legal-aid/find-legal-aid
- Pro Bono Net - https://www.probono.net/
- Lawhelp.org - https://www.lawhelp.org/

**Police Accountability:**
- Mapping Police Violence - https://mappingpoliceviolence.org/
- Campaign Zero - https://www.joincampaignzero.org/
- Communities United Against Police Brutality - http://www.cuapb.org/

**Documentation Apps:**
- Mobile Justice (ACLU app for recording police)
- OpenWatch - document police misconduct

Please add local resources for your area in the comments!',
  'Resource Sharing',
  2483,
  27,
  NOW() - INTERVAL '6 hours',
  false,
  false,
  NOW() - INTERVAL '20 days'
),

-- Support threads
(
  '99999999-9999-9999-9999-999999999999',
  NULL,
  'SupportSeeker',
  'Dealing with trauma after police violence',
  'Content warning: police violence

I witnessed a really traumatic incident of police violence last month and I''m having a hard time dealing with it. I have nightmares, anxiety, and I feel angry all the time.

I''m not the direct victim but I saw everything and gave a witness statement. I feel guilty that it wasn''t me. I feel angry that nothing has happened to the officers. I feel helpless.

Has anyone else dealt with this? How did you cope? Are there resources for witnesses/bystanders?

I know I should probably talk to a therapist but wanted to hear from others who''ve been through this.',
  'Support',
  1245,
  18,
  NOW() - INTERVAL '2 days',
  false,
  false,
  NOW() - INTERVAL '7 days'
),

-- General Discussion threads
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NULL,
  'NewsFollower',
  'Major civil rights cases to watch in 2025',
  'There are several important civil rights cases working through federal courts right now. Here are the ones I''m following:

**Supreme Court:**
- Still waiting on decisions about qualified immunity reform
- Several voting rights cases from 2024 redistricting

**Federal Appeals Courts:**
- Multiple challenges to protest restrictions
- First Amendment recording cases
- Use of force standards

**State Courts:**
- Police misconduct cases in several states
- Challenges to surveillance technology
- Voting access cases

What cases are you watching? What outcomes are you hoping for?

I''ll try to post updates as decisions come down.',
  'General Discussion',
  1876,
  22,
  NOW() - INTERVAL '10 hours',
  false,
  false,
  NOW() - INTERVAL '6 days'
);


-- Insert forum posts (replies to threads)
INSERT INTO public.forum_posts (
  thread_id,
  user_id,
  username,
  parent_post_id,
  content,
  like_count,
  created_at
) VALUES

-- Replies to Welcome thread
(
  '11111111-1111-1111-1111-111111111111',
  NULL,
  'NewMember',
  NULL,
  'Thank you for creating this space! I''ve been looking for a community like this to connect with others working on police accountability.',
  12,
  NOW() - INTERVAL '28 days'
),

(
  '11111111-1111-1111-1111-111111111111',
  NULL,
  'Activist2024',
  NULL,
  'Glad to be here. Looking forward to learning from everyone and sharing resources from my city.',
  8,
  NOW() - INTERVAL '25 days'
),

-- Replies to "What to do if stopped by police" thread
(
  '22222222-2222-2222-2222-222222222222',
  NULL,
  'PersonalExperience',
  NULL,
  'This is great advice. I would add: if you''re recording, verbally state the date, time, and location. This helps establish the context of the recording.',
  24,
  NOW() - INTERVAL '14 days'
),

(
  '22222222-2222-2222-2222-222222222222',
  NULL,
  'LegalAidWorker',
  NULL,
  'One thing to emphasize: even if you know your rights were violated, DO NOT RESIST. You can fight it later in court with a lawyer. Resisting can lead to additional charges and escalation.',
  31,
  NOW() - INTERVAL '13 days'
),

(
  '22222222-2222-2222-2222-222222222222',
  NULL,
  'CommunityMember',
  NULL,
  'What about minors? Do they have the same rights? My teenager walks home from school and I worry.',
  15,
  NOW() - INTERVAL '12 days'
),

(
  '22222222-2222-2222-2222-222222222222',
  NULL,
  'CivilRightsEducator',
  NULL,
  'Great question! Minors have the same constitutional rights. However, schools have different rules. In public spaces, minors should:
- Provide name if asked (in stop-and-identify states)
- Can remain silent for other questions
- Police should not question minors without parent present except in emergencies
- Minors can refuse consent to search

Make sure your teen knows they can ask to call a parent if detained.',
  28,
  NOW() - INTERVAL '11 days'
),

-- Replies to organizing thread
(
  '44444444-4444-4444-4444-444444444444',
  NULL,
  'AspiringOrganizer',
  NULL,
  'This is so inspiring! How did you handle conflicts within the group? Did everyone agree on tactics?',
  18,
  NOW() - INTERVAL '11 days'
),

(
  '44444444-4444-4444-4444-444444444444',
  NULL,
  'CommunityOrganizer',
  NULL,
  'Great question. No, we definitely didn''t always agree! We had people who wanted more confrontational tactics and others who preferred working within the system.

What helped us:
1. Regular meetings to air disagreements
2. Consensus decision-making for major actions
3. Allowing multiple tactics - different groups can do different things
4. Shared commitment to core goals
5. Rotating facilitation so no one person dominated

It wasn''t always easy but staying focused on concrete wins helped keep everyone together.',
  22,
  NOW() - INTERVAL '10 days'
),

(
  '44444444-4444-4444-4444-444444444444',
  NULL,
  'DocumentationPro',
  NULL,
  'The public records requests are key! We''ve found so much through FOIA - everything from use of force statistics to internal emails showing policy violations. Agencies often give stuff up rather than fight in court.',
  19,
  NOW() - INTERVAL '9 days'
),

-- Replies to badge number complaint thread
(
  '66666666-6666-6666-6666-666666666666',
  NULL,
  'HelpfulMember',
  NULL,
  'Yes, you can absolutely still file a complaint! Provide:
- Date, time, and exact location
- Physical description of officer
- Badge/car number if visible in video
- What happened

The department should be able to identify the officer from your description and the assignment records showing who was in that area at that time.',
  16,
  NOW() - INTERVAL '2 days'
),

(
  '66666666-6666-6666-6666-666666666666',
  NULL,
  'FormerLEO',
  NULL,
  'Officers are generally required to provide their name and badge number when asked. Refusing to do so may itself be a policy violation. Definitely file the complaint. Also consider filing a FOIA request for:
- Officer assignments for that date/time/location
- Any body camera footage from officers in that area
- CAD reports for calls at that location

This can help identify the officer.',
  21,
  NOW() - INTERVAL '2 days'
),

(
  '66666666-6666-6666-6666-666666666666',
  NULL,
  'QuestionAsker',
  NULL,
  'Thank you both! I will file the complaint today and submit a FOIA request. I appreciate the guidance.',
  8,
  NOW() - INTERVAL '1 day'
),

-- Replies to FOIA questions thread
(
  '77777777-7777-7777-7777-777777777777',
  NULL,
  'FOIAExpert',
  NULL,
  'In Illinois, agencies must respond within 5 business days (even if just to acknowledge receipt and say they need more time). They then have a "reasonable time" to produce records, usually interpreted as 30-60 days max.

If they don''t respond, you can:
1. Send a follow-up letter
2. File a complaint with the Public Access Counselor
3. File suit in court

Don''t pay fees upfront - they''ll bill you after producing records. Get a cost estimate first if you''re concerned about price.',
  19,
  NOW() - INTERVAL '4 days'
),

(
  '77777777-7777-7777-7777-777777777777',
  NULL,
  'BodyCamActivist',
  NULL,
  'Body camera requests can be tricky. Some departments will say footage doesn''t exist if:
- Cameras weren''t turned on (violation of policy but happens)
- Footage was deleted (retention period varies)
- They are deliberately stonewalling

Ask specifically:
- Do you have the footage?
- If not, why not? (policy violation?)
- What is your retention period?
- When will footage be deleted?

If they''re stalling, consider getting a lawyer to send a preservation letter.',
  23,
  NOW() - INTERVAL '3 days'
),

-- Replies to trauma support thread
(
  '99999999-9999-9999-9999-999999999999',
  NULL,
  'TraumaSurvivor',
  NULL,
  'I''m so sorry you''re going through this. What you''re experiencing is completely normal and valid. Witnessing violence is traumatic even when you''re not the direct target.

Some things that helped me:
- Therapy (specifically trauma-focused therapy like EMDR)
- Support groups for witnesses/survivors
- Channeling anger into organizing/action
- Taking breaks from the work when needed
- Connecting with others who understand

The anger and helplessness are real. Please don''t minimize what you''ve been through. You matter too.',
  27,
  NOW() - INTERVAL '6 days'
),

(
  '99999999-9999-9999-9999-999999999999',
  NULL,
  'TherapistAlly',
  NULL,
  'Vicarious trauma is very real. Look for therapists who specialize in trauma and understand police violence. Some organizations offer free/low-cost counseling for witnesses and activists:
- National Queer and Trans Therapists of Color Network
- Therapy for Black Girls
- Open Path Collective (reduced fee therapy)
- Local activist support groups

Also consider:
- Mindfulness and grounding techniques
- Limiting exposure to triggering content
- Physical activity
- Creative expression

Take care of yourself. This work requires us to be sustainable.',
  18,
  NOW() - INTERVAL '5 days'
),

(
  '99999999-9999-9999-9999-999999999999',
  NULL,
  'SupportSeeker',
  NULL,
  'Thank you everyone. It helps to know I''m not alone in feeling this way. I''m going to look into the therapy resources and maybe find a local support group. I appreciate this community.',
  12,
  NOW() - INTERVAL '5 days'
);
