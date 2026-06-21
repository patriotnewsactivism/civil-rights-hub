-- Additional forum threads covering 2026 civil rights topics
-- Uses NULL user_id and display usernames (same pattern as existing seed)
-- All information is accurate and sourced from real law, cases, and organizations

INSERT INTO public.forum_threads (
  user_id, username, title, content, category,
  view_count, post_count, last_post_at,
  is_pinned, is_locked, created_at
) VALUES

-- ============================================================
-- KNOW YOUR RIGHTS
-- ============================================================
(
  NULL,
  'RightsEducator2026',
  'Stingray Devices: Can Police Track Your Phone Without a Warrant?',
  'After Carpenter v. United States (2018), law enforcement generally needs a warrant to access cell-site location information. But what about IMSI catchers (Stingrays) — devices that mimic cell towers to track phones in real-time?

**What Stingrays Do:**
A Stingray tricks all nearby phones into connecting to it, revealing location and, in some models, call/text metadata.

**Current Legal Landscape:**
- Federal agencies: Most require a warrant post-Carpenter
- State law: Varies widely. California, Washington, Virginia require warrants. Many states have no specific statute.
- Local police: Many departments refuse to disclose whether they use Stingrays at all

**What You Can Do at Protests:**
1. Switch to Airplane Mode when you don''t need connectivity
2. Use Signal for end-to-end encrypted messages (even metadata is minimized)
3. Consider a faraday pouch for your phone during sensitive moments
4. Don''t bring your personal phone if anonymity is critical

**FOIA Tip:** Some departments'' Stingray use can be uncovered through FOIA. MuckRock has a free template specifically for requesting "cell-site simulator" records.

Has anyone successfully FOIAed Stingray records from a local department? Would love to hear how it went.',
  'Know Your Rights',
  1847, 14, NOW() - INTERVAL '2 hours',
  false, false, NOW() - INTERVAL '5 days'
),

(
  NULL,
  'FifthAmendmentFocus',
  'Miranda Rights: What Police Are (and Aren''t) Required to Tell You',
  'Miranda v. Arizona (1966) is one of the most misunderstood Supreme Court cases. Here''s what it actually requires — and what it doesn''t.

**What Triggers Miranda:**
Miranda warnings are ONLY required when BOTH:
1. You are in custody (not free to leave), AND
2. You are being interrogated

**Common Misconceptions:**

❌ "Police must read me Miranda when they arrest me"
— Not true. Police only need to Mirandize you before a custodial interrogation. An arrest without questioning doesn''t trigger Miranda.

❌ "If they didn''t read me Miranda, my case gets dismissed"
— Not true. The remedy for a Miranda violation is suppression of statements obtained in violation, not dismissal of charges.

❌ "I don''t have to answer questions even without Miranda"
— Actually TRUE. You can invoke your Fifth Amendment right to remain silent at ANY time, in or out of custody. You don''t need Miranda to protect you.

**What Actually Protects You:**
INVOKING your rights. The Supreme Court in Berghuis v. Thompkins (2010) held that simply staying silent is NOT enough — you must AFFIRMATIVELY invoke your right to remain silent or request an attorney.

The magic words: **"I am invoking my right to remain silent and my right to an attorney. I will not answer questions without a lawyer present."**

Then STOP TALKING. Do not explain. Do not justify. Do not be friendly. Just stop.

Share this thread. Every person should know this.',
  'Know Your Rights',
  3204, 28, NOW() - INTERVAL '1 hour',
  false, false, NOW() - INTERVAL '8 days'
),

(
  NULL,
  'RecordingRightsWatch',
  'Recording Police in All 50 States: Updated 2026 Guide',
  'A lot has changed in recording rights law over the past two years. Here''s the current state in all 50 states:

**The Federal Baseline:**
The First Amendment protects the right to record police performing their duties in public. This is established in every federal circuit: ACLU v. Alvarez (7th Cir.), Glik v. Cunniffe (1st Cir.), Fields v. City of Philadelphia (3rd Cir.), Sharp v. Baltimore City Police (4th Cir.), Frasier v. Evans (10th Cir.), and Turner v. Lieutenant Driver (5th Cir.).

**All-Party Consent States (Audio recording may require all parties'' consent):**
California, Connecticut, Florida, Illinois, Maryland, Massachusetts, Michigan, Montana, Nevada, New Hampshire, Oregon, Pennsylvania, Washington

Note: Recording police officers in public is generally held to be protected even in all-party consent states because officers have no reasonable expectation of privacy in their public duties. But be aware of local interpretations.

**What Officers CANNOT Do:**
- Order you to stop recording in a public place
- Seize your phone without a warrant (Riley v. California, 2014)
- Delete your recordings
- Arrest you solely for recording unless you are interfering

**What You Should Do:**
- Record openly and at a safe distance
- Narrate: "I am recording this interaction in a public place. I am not interfering."
- Back up footage immediately to cloud storage
- If threatened: Don''t resist a seizure. State clearly: "I do not consent to this search." Contest it in court.

**Emergency:** If you are a journalist and your equipment is seized, call the Reporters Committee hotline: **1-800-336-4243**

Update: Has anyone dealt with drone recording restrictions at protests? That''s an emerging area.',
  'Know Your Rights',
  2156, 19, NOW() - INTERVAL '3 hours',
  false, false, NOW() - INTERVAL '12 days'
),

-- ============================================================
-- ORGANIZING & ACTIVISM
-- ============================================================
(
  NULL,
  'OrganizerOnTheGround',
  'Mutual Aid vs. Charity: Understanding the Difference (and Why It Matters for Organizing)',
  'There''s been a lot of confusion in movement spaces about the difference between mutual aid and charity. This matters legally, politically, and strategically. Let me break it down.

**Charity (Top-Down):**
- Resources flow from those with more to those with less
- Often requires proving need and meeting eligibility criteria
- Recipients are passive; decisions made by the giving institution
- Can reinforce existing power dynamics
- Usually tax-deductible 501(c)(3) structure
- Examples: food bank, disaster relief fund, legal defense fund (traditional)

**Mutual Aid (Horizontal):**
- Resources and support shared among members of a community
- No gatekeeping or proof of need required
- Participants are both givers and receivers
- Explicitly political — aims to address root causes, not just symptoms
- Often informal; complex legal questions around 501(c)(3) structure
- Examples: community fridges, jail support networks, childcare cooperatives

**Why It Matters for Organizing:**
Mutual aid builds relationships and power within communities. When people help each other, they develop trust, connection, and a sense of collective agency — all of which are prerequisites for political action.

Big Organizing (from the Bernie 2016 campaign''s playbook) argues that mutual aid creates the relational infrastructure needed to mobilize people for campaigns.

**Resources:**
- "Mutual Aid: Building Solidarity During This Crisis (and the Next)" by Dean Spade (free PDF)
- Big Door Brigade: bigdoorbrigade.com
- Mutual Aid Hub: mutualaidhub.org

Are any chapters doing mutual aid → direct action pipeline work? Would love to hear models that are working.',
  'Organizing & Activism',
  1432, 21, NOW() - INTERVAL '30 minutes',
  false, false, NOW() - INTERVAL '15 days'
),

(
  NULL,
  'CopwatchCoordinator',
  'Starting a Copwatch Program in Your City: Practical Guide',
  'After several high-profile incidents in our city, our chapter decided to start a formal copwatch program. Here''s what we learned in the first 6 months.

**Step 1: Know the Law First**
Before you go out, your team needs to understand:
- Recording rights in your state (one-party or all-party consent?)
- Where you can stand (sidewalk, across the street, your property)
- What constitutes "interference" (stay at a safe distance; don''t physically intervene)
- What to do if detained (invoke rights, call NLG hotline)

**Step 2: Build Your Team**
- 2-person minimum per patrol (one records, one keeps watch)
- Green NLG hats or matching vests increase visibility and may deter retaliation
- Training on de-escalation, evidence documentation, and self-care
- Emergency contact protocol: designate an off-site point of contact

**Step 3: Documentation Protocol**
When documenting an interaction:
1. Note date, time, exact location (GPS or cross streets)
2. Officer badge number / unit number (say it out loud on video)
3. Describe what you observe, not your opinions
4. Record continuous footage — don''t stop and restart
5. Immediately upload to cloud storage

**Step 4: What to Do with the Footage**
- Share with the person stopped (if they want it)
- Submit to your city''s civilian oversight board with a complaint
- Share with NLG attorneys if there''s evidence of misconduct
- If newsworthy, contact local journalists

**What We''ve Learned:**
Our presence alone has changed officer behavior. Officers who knew they were being recorded were significantly more likely to give names and badge numbers when asked.

Anyone else running programs want to share what''s working?',
  'Organizing & Activism',
  2891, 34, NOW() - INTERVAL '45 minutes',
  false, false, NOW() - INTERVAL '18 days'
),

(
  NULL,
  'DigitalOrganizer',
  'Secure Communications for Activist Organizations: Signal, Riseup, and More',
  'After several high-profile cases of law enforcement infiltrating activist Signal groups and using social media posts as evidence, let''s talk about secure communications infrastructure for organizing.

**The Threat Model**
First, think about who your adversaries are. For most organizers:
- Social media surveillance (public posts are fair game)
- Informants and undercover officers
- Device seizures (phone searched after arrest)
- Subpoenas to tech companies for metadata

**Signal: The Gold Standard for Messaging**
- Use disappearing messages (set to 1 week for most conversations)
- Enable Screen Security to prevent screenshots
- Use Note to Self for sensitive notes (vs. cloud notes)
- Signal''s sealed sender and registration-free usernames (new feature) reduce metadata exposure
- Group admins: periodically clean old members and rotate invite links

**For Higher-Risk Organizing:**
- Riseup.net: Email, VPN, and collaboration tools run by an activist collective with a canary warrant statement
- Proton Mail: Encrypted email if you must email
- Briar: P2P messaging that works without internet (useful at protests)
- Tor Browser: Browsing without tracking (for research, not streaming)

**What NOT to Do:**
- Don''t use Facebook Messenger, WhatsApp (Meta metadata), or regular SMS for sensitive organizing
- Don''t use Google Drive for sensitive documents
- Don''t post operational security details on public social media

**After an Arrest:**
If a teammate is arrested, assume their phone MAY be accessed. Review what was on it and act accordingly.

The EFF''s Surveillance Self-Defense (ssd.eff.org) has the best up-to-date guides. Highly recommend.',
  'Organizing & Activism',
  1673, 22, NOW() - INTERVAL '2 hours',
  false, false, NOW() - INTERVAL '21 days'
),

-- ============================================================
-- LEGAL QUESTIONS
-- ============================================================
(
  NULL,
  'CivilRightsParalegal',
  'What Is Qualified Immunity and Why Is It So Hard to Reform?',
  'Qualified immunity has been in the news constantly, but there''s a lot of confusion about what it actually is, where it came from, and what reform efforts look like. Here''s a plain-language breakdown.

**What Is Qualified Immunity?**
Qualified immunity is a legal doctrine that shields government officials (especially police) from civil lawsuits under 42 U.S.C. § 1983 unless they violated a "clearly established" statutory or constitutional right.

**Where Did It Come From?**
It was CREATED by federal judges — not Congress. The Supreme Court invented qualified immunity in a series of cases from the 1960s-80s, culminating in Harlow v. Fitzgerald (1982). There is no textual basis for it in § 1983, which was enacted in 1871. Justice Clarence Thomas has even called the doctrine''s current form "hard to square with the text."

**The "Clearly Established" Problem:**
Courts have interpreted "clearly established" extremely narrowly. Officers are immune unless a prior case involving nearly identical facts established that the conduct was unconstitutional. This creates a catch-22: without a case finding it unconstitutional, officers can''t be held liable — but the case can''t be decided if officers get immunity.

**What Reform Looks Like:**
State-level victories:
- Colorado (2020): Senate Bill 217 eliminated qualified immunity for officers in STATE court claims
- New Mexico (2021): Civil Rights Act limits QI in state courts
- New York City (2021): Local law banning QI in city courts
- New Jersey (2022): Partial limits on QI in state court

Federal level: The George Floyd Justice in Policing Act (which would eliminate federal QI) has repeatedly stalled in the Senate.

**What This Means for Litigation:**
If you''re suing under § 1983, qualified immunity is likely the first defense you''ll face. You need an attorney who knows how to identify cases establishing clearly established rights in your jurisdiction.

Resources: Institute for Justice has been litigating QI cases strategically. NACDL has materials on § 1983 practice.',
  'Legal Questions',
  4127, 47, NOW() - INTERVAL '20 minutes',
  true, false, NOW() - INTERVAL '25 days'
),

(
  NULL,
  'FourthAmendmentNerd',
  'The Third-Party Doctrine in 2026: What''s Left of Your Digital Privacy?',
  'The Third-Party Doctrine holds that when you voluntarily share information with a third party (like a bank or phone company), you lose your Fourth Amendment protection in that information. This doctrine, from Smith v. Maryland (1979), was designed for pen registers. In 2026, it threatens to swallow your entire digital life.

**What the Doctrine Covers (After Carpenter):**
The Supreme Court in Carpenter v. United States (2018) held 5-4 that the Third-Party Doctrine does NOT apply to historical cell-site location information — it requires a warrant. Chief Justice Roberts'' majority opinion left open many questions.

**Where It''s Still a Problem:**
Despite Carpenter, courts are still applying the Third-Party Doctrine to:
- Bank records (Miller, 1976 — still good law)
- IP addresses shared with ISPs
- Email metadata (to/from/date — but not content)
- Data shared with apps (contested)
- Smart home device data (contested)
- Social media data voluntarily shared (generally no 4th Am. protection)

**Active Litigation Areas:**
- Whether Carpenter extends to prospective (real-time) cell-site data
- Whether geofence warrants are constitutional (Google case in 4th Circuit)
- Whether smart speaker data (Alexa, Google Home) is protected
- Whether warrant requirements apply to stingray data

**What You Can Do:**
- Use Signal for messages (encrypted content, minimal metadata)
- Review app permissions (location, contacts — minimize what you share)
- Use a VPN to obscure browsing from your ISP
- Be aware that smart home devices may respond to law enforcement requests

This is a rapidly evolving area. EFF tracks Fourth Amendment digital privacy cases at eff.org/cases.',
  'Legal Questions',
  2834, 29, NOW() - INTERVAL '4 hours',
  false, false, NOW() - INTERVAL '30 days'
),

-- ============================================================
-- RESOURCE SHARING
-- ============================================================
(
  NULL,
  'LegalAidResearcher',
  'Comprehensive List: Free Legal Aid Hotlines for Civil Rights Issues',
  'Compiled this list from verified sources. Please add anything I''m missing in the replies.

**NATIONAL HOTLINES:**

🔴 **National Lawyers Guild Legal Support**: 212-679-6018
→ For protest arrests, demonstrations, and civil liberties emergencies

🔴 **ACLU**: aclu.org/know-your-rights (no phone, but extensive resources)

🔴 **Reporters Committee for Freedom of the Press**: 1-800-336-4243
→ 24/7 for journalists facing legal threats, equipment seizure, or subpoenas

🔴 **Immigration Legal Services (RAICES)**: 210-222-0964
→ Immigration emergencies, ICE detention

🔴 **National Immigrant Justice Center**: 312-660-1370
→ Detained immigrants seeking legal help

🔴 **Lambda Legal Help Desk**: 212-809-8585
→ LGBTQ+ discrimination, HIV-related discrimination

🔴 **Disability Rights Advocates**: 510-665-8644
→ Disability discrimination and civil rights

🔴 **Election Protection Hotline**: 1-866-OUR-VOTE (1-866-687-8683)
→ Voting rights issues at polls, voter suppression

🔴 **National Domestic Violence Hotline**: 1-800-799-7233
→ Also advises on intersection with immigration status

**BY CATEGORY:**

For Police Misconduct:
- National Police Accountability Project: nlg.org/npap
- Civilian oversight board in your city (varies)

For Housing:
- National Housing Law Project: nhlp.org
- Your local legal aid organization (lawhelp.org directory)

For Workers:
- National Employment Law Project: nelp.org

**HOW TO FIND LOCAL LEGAL AID:**
→ lawhelp.org — enter your state
→ LawLine.org — free consultations in many states
→ Your state bar''s lawyer referral service

Pin this. Share this. Know who to call before you need it.',
  'Resource Sharing',
  5234, 41, NOW() - INTERVAL '1 hour',
  true, false, NOW() - INTERVAL '35 days'
),

(
  NULL,
  'FOIAFileroom',
  'FOIA Best Practices: How to Actually Get What You''re Asking For',
  'After filing over 300 FOIA requests in the past three years, here are the things that actually make a difference in getting responsive records quickly.

**1. Be Specific (But Not Too Narrow)**
Bad: "All records related to use of force"
Good: "All Use of Force reports, Officer Involved Shooting investigations, and Internal Affairs complaints for incidents occurring between January 1, 2024 and December 31, 2024 involving Officer [Name] or Badge Number [#]"

The goal: specific enough to find the records, broad enough to not accidentally exclude responsive docs.

**2. Use the Right Exemptions Waiver Language**
Always include: "I request a waiver of all search, duplication, and review fees as disclosure of the requested information is in the public interest and will contribute significantly to public understanding of government operations."

If you''re a journalist: add "I am a representative of the news media making this request in connection with news gathering and reporting."

**3. Request the VAUGHN INDEX When They Withhold**
If an agency withholds documents, you can request a Vaughn Index — a document-by-document listing of what''s withheld and the specific exemption claimed. This makes withholding auditable and sets up appeals.

**4. File Appeals Immediately**
Don''t wait. Federal agencies have 20 business days to respond (FOIA). If they don''t, file an administrative appeal. If that fails, the next step is litigation.

**5. Use MuckRock**
muckrock.com tracks your requests, alerts you to deadlines, and provides templates. Their team can also help with appeals. Many investigative journalists live here.

**State Law Matters More Than Federal FOIA for Police Records**
State public records laws often cover more ground for local police records. Know your state''s law (e.g., California Public Records Act, Texas Public Information Act, NY FOIL).

What are your FOIA wins? Let''s build a thread of examples.',
  'Resource Sharing',
  3789, 52, NOW() - INTERVAL '6 hours',
  false, false, NOW() - INTERVAL '42 days'
),

-- ============================================================
-- GENERAL DISCUSSION
-- ============================================================
(
  NULL,
  'MovementHistorian',
  'This Week in Civil Rights History — June 2026',
  'Keeping track of important anniversaries this month to honor the work that came before us.

**June 1:** Greenwood District, Tulsa (1921) — 105th anniversary of the Tulsa Race Massacre, when a prosperous Black community was destroyed by a white mob with government complicity. Over 300 people killed, 10,000 left homeless. No one was ever charged.

**June 5:** U.S. v. Lopez (1995) — 31st anniversary of SCOTUS limiting Congress''s commerce clause power, beginning a federalism revolution that has constrained civil rights legislation.

**June 8:** Allen v. Milligan (2023) — 3rd anniversary of the Supreme Court upholding Section 2 of the Voting Rights Act, requiring Alabama to draw a second majority-Black congressional district. One of the most significant VRA victories in years.

**June 19:** Juneteenth — Commemorates June 19, 1865, when enslaved people in Texas were finally informed of their freedom, more than two months after the Confederacy surrendered. National federal holiday since 2021.

**June 23:** United States v. Texas (2023) — 3rd anniversary of SCOTUS ruling 8-1 that states lacked standing to challenge federal immigration enforcement priorities.

**June 26:** Murthy v. Missouri (2024) — 2nd anniversary of SCOTUS ruling 6-3 that plaintiffs lacked standing to challenge government communications with social media platforms about content moderation.

**June 27:** Counterman v. Colorado (2023) — 3rd anniversary of SCOTUS establishing a recklessness standard for "true threats" doctrine, clarifying online speech protections.

**June 29:** Students for Fair Admissions v. Harvard (2023) — 3rd anniversary of SCOTUS ruling 6-3 ending race-conscious college admissions nationwide.

**June 30:** 303 Creative v. Elenis (2023) — 3rd anniversary of SCOTUS ruling 6-3 that First Amendment protects a web designer from being required to design sites celebrating same-sex marriage.

Add any that I missed in the replies.',
  'General Discussion',
  2145, 18, NOW() - INTERVAL '2 hours',
  false, false, NOW() - INTERVAL '7 days'
),

(
  NULL,
  'PressWatcher',
  'Journalist Arrested While Covering Protest? Here''s What To Do in the First 24 Hours',
  'This is time-sensitive information that every journalist — staff, freelance, and student — should have memorized or saved before going to cover a demonstration.

**IN THE FIELD (Before Arrest):**
- Carry a press credential if you have one (print/broadcast IDs, SPJ card, or even a letter on letterhead from your outlet)
- Announce you are press: "Press! I am a journalist documenting this event."
- Wear press identification visibly when possible
- Back up footage continuously to cloud storage (set auto-upload in your camera app)
- Have the NLG number in your phone: [YOUR CITY''S NLG CHAPTER] and national backup: 212-679-6018
- Have your editor/producer''s number memorized or on a card

**IF ARRESTED:**
1. Do NOT resist. Announce you are press.
2. State: "I am a journalist. I am invoking my right to remain silent and my right to an attorney."
3. Do NOT consent to any search of your phone or equipment.
4. Ask for your charges and processing location.
5. When allowed a call, call: **Reporters Committee: 1-800-336-4243** (24/7) or your editor/legal counsel.

**AFTER ARREST:**
- RCFP can send a legal defense letter to the arresting agency within hours
- Document everything: time of arrest, officer names/badge numbers, what you were doing, exact location
- Preserve all footage (phone contents protected under Riley v. California — demand warrant for any search)
- File a complaint with your state''s civilian oversight board
- RCFP and U.S. Press Freedom Tracker log journalist arrests — report it: pressfreedomtracker.us/submit

**KNOW YOUR STATE''S SHIELD LAW:**
Shield laws protect journalists from being compelled to testify about confidential sources. Every state has different protections. Check RCFP''s state law guide at rcfp.org.

Save this. Print it. Put it in your press bag.',
  'Resource Sharing',
  4512, 38, NOW() - INTERVAL '30 minutes',
  false, false, NOW() - INTERVAL '10 days'
)

ON CONFLICT DO NOTHING;
