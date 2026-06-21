-- Seed realistic forum post replies for threads created in 20260409000010
-- and the existing welcome/pinned thread from 20251112040004.
-- Uses NULL user_id + display usernames (same pattern as thread seed).
-- References threads by title via subquery for idempotent inserts.

DO $$
DECLARE
  v_thread_id uuid;
BEGIN

  -- ============================================================
  -- REPLIES: Stingray Devices thread
  -- ============================================================
  SELECT id INTO v_thread_id FROM public.forum_threads
  WHERE title ILIKE '%Stingray%' LIMIT 1;

  IF v_thread_id IS NOT NULL THEN
    INSERT INTO public.forum_posts (thread_id, user_id, username, content, created_at)
    VALUES
    (v_thread_id, NULL, 'DigitalDefender_ATL',
'Yes! I successfully FOIAed Stingray records from Atlanta PD last year. Key tips:

1. Use the specific term "cell-site simulator" OR "IMSI catcher" OR "Stingray" — some departments will deny requests for one term but not another.
2. Request any contracts with Harris Corporation or Digital Air Strike (the main manufacturers).
3. Request any NDAs signed with the FBI — these are the ones they try to hide behind. The ACLU has already won cases showing those NDAs don''t override state FOIA laws.

Atlanta''s response took 4 months and came back with heavy redactions, but we could see the purchase records and see they had the device. That alone was newsworthy.',
    NOW() - INTERVAL '4 days'),

    (v_thread_id, NULL, 'CryptoActivist_PDX',
'The Signal recommendation is solid. A few additional opsec points for protests:

- **GrapheneOS** on a Pixel is significantly harder to track than stock Android. Worth it if you''re doing regular direct action work.
- Stingrays capture IMSI numbers — the identifier tied to your SIM, not your phone itself. Swapping your SIM or using an eSIM profile frequently defeats some models.
- **The "airplane mode" trick** doesn''t fully work on all phones. Some continue to broadcast a passive signal. Powering fully off is more reliable.
- Consider a dedicated "protest phone" — cheap Android with no personal accounts, just Signal registered to a Google Voice number.',
    NOW() - INTERVAL '3 days'),

    (v_thread_id, NULL, 'ATTYCivilRights_CHI',
'Important legal note: In *Carpenter v. United States* (2018), the Supreme Court held 5-4 that cell-site location information (CSLI) requires a warrant. But Stingrays are different — they intercept real-time signals rather than requesting historical records from carriers.

The state of the law on real-time Stingray warrants is:
- **Federal**: DOJ policy requires a warrant since 2015, but this is policy, not a court ruling
- **State statutes**: About 20 states now require warrants specifically for cell-site simulators
- **Case law is still developing** — challenges have been raised in U.S. v. Diggs (7th Cir.) and similar cases

The strongest argument against warrantless Stingray use is the "mosaic theory" from Carpenter — that tracking someone''s location in real time is a serious privacy intrusion requiring probable cause.',
    NOW() - INTERVAL '2 days'),

    (v_thread_id, NULL, 'PrivacyOrg_StaffWriter',
'Sharing EFF''s guide here because it''s the most thorough resource on counter-surveillance at protests: eff.org/pages/surveillance-self-defense

The key thing to understand is that Stingrays don''t just track you — in "active mode" they can intercept calls and SMS messages. Signal protects against that because it uses end-to-end encryption even if your signal is intercepted.

Also: **the Freedom of Information Project at MuckRock** (muckrock.com) has helped file hundreds of Stingray FOIA requests nationwide. Their templates are free and you can track every response publicly. Highly recommend.',
    NOW() - INTERVAL '1 day');
  END IF;

  -- ============================================================
  -- REPLIES: Miranda Rights thread
  -- ============================================================
  SELECT id INTO v_thread_id FROM public.forum_threads
  WHERE title ILIKE '%Miranda%' LIMIT 1;

  IF v_thread_id IS NOT NULL THEN
    INSERT INTO public.forum_posts (thread_id, user_id, username, content, created_at)
    VALUES
    (v_thread_id, NULL, 'PublicDefender_KC',
'As a public defender, I can''t stress this enough: **exercise your rights explicitly and out loud**.

Courts have held (*Berghuis v. Thompkins*, 2010) that you must INVOKE your right to silence explicitly — simply staying quiet is not enough. You have to say it: "I am invoking my right to remain silent" and "I want a lawyer."

Once you say those words, ALL questioning must stop until your attorney is present. If police continue questioning and obtain statements, your attorney can move to suppress them.

The worst mistake people make is trying to "explain" themselves to police during an arrest. Anything you say, even something that seems helpful, can and will be used against you.',
    NOW() - INTERVAL '5 days'),

    (v_thread_id, NULL, 'KnowYourRights_Educator',
'Two critical cases everyone should know:

**Salinas v. Texas (2013)**: The Supreme Court held that if you''re NOT in custody and you voluntarily answer some questions but stay silent on others, your silence CAN be used against you at trial — unless you explicitly invoke the Fifth Amendment.

Lesson: Even outside of custody, if you''re going to stop answering questions, say out loud: "I am invoking my Fifth Amendment right to remain silent."

**Illinois v. Perkins (1990)**: An undercover officer placed in a cell to question a suspect does NOT have to give Miranda warnings. This is because the person doesn''t know they''re talking to police, so there''s no coercive environment.

Lesson: Don''t discuss your case with anyone in jail. That person may be working for the police.',
    NOW() - INTERVAL '3 days'),

    (v_thread_id, NULL, 'NLG_Volunteer_NY',
'One more practical point: **write the NLG number on your arm in permanent marker before going to any action**.

The National Lawyers Guild hotline numbers by region:
- National backup: 212-679-6018
- NYC: 212-679-6018
- LA: 323-696-2299
- Chicago: 773-309-1198
- Bay Area: 415-285-1011
- DC: 202-679-6018
- Find your local chapter: nlg.org/chapters

When you''re in a detention facility, you may not have access to your phone contacts. Having the number on your arm ensures you can make your call count.',
    NOW() - INTERVAL '1 day');
  END IF;

  -- ============================================================
  -- REPLIES: Recording Police in All 50 States thread
  -- ============================================================
  SELECT id INTO v_thread_id FROM public.forum_threads
  WHERE title ILIKE '%Recording Police in All 50%' LIMIT 1;

  IF v_thread_id IS NOT NULL THEN
    INSERT INTO public.forum_posts (thread_id, user_id, username, content, created_at)
    VALUES
    (v_thread_id, NULL, 'FirstAmendmentAudit_TX',
'Just wanted to add some field experience to this thread. I''ve been doing First Amendment audits in Texas for 3 years.

In Texas (one-party consent state), I have never been successfully prosecuted for recording police, but I''ve had guns drawn, been detained, been told to stop recording, been threatened with arrest for "interfering" — all of which were illegal.

**Practical tips for Texas auditors:**
1. Stay on public property — sidewalk, public park, road median
2. Don''t block traffic or pedestrian flow
3. Stay back at least 20-30 feet from active police activity unless you have a legitimate reason to be closer
4. Say clearly: "I am a member of the press/I am documenting this interaction. I have a First Amendment right to record you in public."
5. Keep recording no matter what. The fact that you kept recording is your evidence.

Courts have consistently upheld the right to record. *Turner v. Driver* (5th Cir. 2017) specifically confirmed First Amendment protection for recording police in Texas.',
    NOW() - INTERVAL '6 days'),

    (v_thread_id, NULL, 'ACLU_StaffWriter',
'Important update for two-party consent states:

Courts have repeatedly distinguished between **wiretap laws** (designed to prevent secret recording of private conversations) and **recording police in public**.

The key case is *ACLU v. Alvarez* (7th Cir. 2012), which held that Illinois''s wiretap law (two-party consent) could NOT be used to prosecute people for recording police in public because:
1. Police have no reasonable expectation of privacy in their public duties
2. A law prohibiting recording police in public raises severe First Amendment concerns

Federal circuits that have ruled on this: 1st, 3rd, 5th, 7th, 9th, and 11th Circuits have all recognized a First Amendment right to record police.

Even if your state has a two-party consent wiretap law, it generally CANNOT be used to prohibit recording police performing their public duties in public places.',
    NOW() - INTERVAL '4 days'),

    (v_thread_id, NULL, 'CopWatcher_Seattle',
'Something crucial that doesn''t get discussed enough: **cloud backup everything in real time**.

When I''m filming, I have Google Photos set to auto-upload on cellular. That way, even if my phone is seized, smashed, or "lost" in evidence, the footage is already in the cloud.

Also: **consider livestreaming** instead of just recording. If you''re on YouTube, Facebook Live, Twitch, or Bambuser, every second is simultaneously broadcast. No deletion possible.

For phones seized incident to arrest: **Riley v. California** (2014) — police CANNOT search your phone without a warrant, even incident to arrest. Assert this explicitly: "I do not consent to any search of my device. You need a warrant."',
    NOW() - INTERVAL '2 days');
  END IF;

  -- ============================================================
  -- REPLIES: Qualified Immunity thread
  -- ============================================================
  SELECT id INTO v_thread_id FROM public.forum_threads
  WHERE title ILIKE '%Qualified Immunity%' LIMIT 1;

  IF v_thread_id IS NOT NULL THEN
    INSERT INTO public.forum_posts (thread_id, user_id, username, content, created_at)
    VALUES
    (v_thread_id, NULL, 'CivilRightsLitigator_CO',
'Colorado is the most significant state development here. SB 20-217 (2020) eliminated qualified immunity for state civil rights claims AND allowed individual officer liability.

What this means practically:
- Officers in Colorado CAN be sued personally under the Colorado state civil rights act
- The "clearly established law" defense that kills most federal § 1983 claims does NOT apply
- Colorado officers must carry liability insurance or the agency must cover individual judgments

Since 2020, there have been more successful civil rights settlements in Colorado than in almost any other state. The threat of personal liability has changed behavior.

New Mexico passed a similar law in 2021 (New Mexico Civil Rights Act). These state-level reforms are the most promising path forward given the Supreme Court''s unwillingness to revisit *Harlow v. Fitzgerald*.',
    NOW() - INTERVAL '4 days'),

    (v_thread_id, NULL, 'ConLawProfessor_DC',
'For those who want to understand why QI is so hard to abolish federally:

The doctrine was created by the Supreme Court itself in *Pierson v. Ray* (1967) and expanded in *Harlow v. Fitzgerald* (1982). Congress did NOT create qualified immunity — it''s purely judge-made law interpreting 42 U.S.C. § 1983.

This means Congress could abolish it tomorrow by statute. The George Floyd Justice in Policing Act would have done so, but it failed in the Senate.

Justice Thomas wrote a notable concurrence in *Ziglar v. Abbasi* (2017) questioning whether QI has any legitimate historical basis, and repeated this in *Lombardo v. St. Louis* (2021). If the Court revisits QI, Thomas may be the unlikely vote to curtail it.',
    NOW() - INTERVAL '2 days');
  END IF;

  -- ============================================================
  -- REPLIES: Secure Comms for Activists thread
  -- ============================================================
  SELECT id INTO v_thread_id FROM public.forum_threads
  WHERE title ILIKE '%Secure Comm%' OR title ILIKE '%Digital Security%' LIMIT 1;

  IF v_thread_id IS NOT NULL THEN
    INSERT INTO public.forum_posts (thread_id, user_id, username, content, created_at)
    VALUES
    (v_thread_id, NULL, 'SecurityTrainer_EFF',
'Threat modeling is the most important concept in digital security and it gets skipped over constantly.

Start by asking: **who is your adversary, and what are their capabilities?**

- **Local police**: Limited technical resources. OSINT (public social media mining) is their main tool. Threat: low-medium.
- **FBI/federal agencies**: Significant technical capability, legal process tools (national security letters, court orders). Threat: medium-high for organized groups.
- **State fusion centers**: Monitor protest groups, share data with local police and federal agencies. Often less technically sophisticated than FBI but broad surveillance mandates.

For most activists, the realistic threat is local law enforcement using your PUBLIC social media to build a case. The fix: lock down your social media, use separate accounts for activism, never post your own or others'' faces at protests without permission.',
    NOW() - INTERVAL '5 days'),

    (v_thread_id, NULL, 'ProtonMail_User_MN',
'A few specifics on encrypted email:

**ProtonMail vs. Tutanota vs. Gmail**:
- ProtonMail and Tutanota: end-to-end encrypted by default. Swiss and German law respectively — stronger privacy protections than US.
- Gmail: NOT end-to-end encrypted. Google can read your emails, and they respond to legal requests.

**Important caveat**: Email encryption only helps when BOTH sender and recipient use encrypted mail. If you send ProtonMail to a Gmail address, Google has a copy.

For truly sensitive communications: Signal. Email is structurally not ideal for high-security communications because of metadata (who you emailed, when, how often) even if the content is encrypted.

EFF''s Surveillance Self-Defense guide (ssd.eff.org) is the best free resource for this. Specifically, their "Activist Threat Model" page.',
    NOW() - INTERVAL '3 days'),

    (v_thread_id, NULL, 'FrontlineActivist_Houston',
'Real-world addition to this thread: what to do when police show up at an organizing meeting.

1. **Don''t answer the door** if they don''t have a warrant. "Do you have a warrant?" is your first and sometimes only question.
2. If they have a warrant: comply, don''t resist, but say nothing beyond confirming your identity if required by state law.
3. **Designate a legal liaison** for your group before any action — someone whose only job is to call the NLG and document what happens.
4. **Never use the main meeting space for sensitive planning**. Use a Signal group for anything you don''t want documented.
5. **Know your state''s eavesdropping laws**. In most states, police cannot record inside a private space without a warrant or consent.',
    NOW() - INTERVAL '1 day');
  END IF;

  -- ============================================================
  -- REPLIES: FOIA Best Practices thread
  -- ============================================================
  SELECT id INTO v_thread_id FROM public.forum_threads
  WHERE title ILIKE '%FOIA%Best Practices%' OR title ILIKE '%FOIA Tips%' OR title ILIKE '%FOIA%Guide%' LIMIT 1;

  IF v_thread_id IS NOT NULL THEN
    INSERT INTO public.forum_posts (thread_id, user_id, username, content, created_at)
    VALUES
    (v_thread_id, NULL, 'MuckRock_User_Boston',
'The best resource nobody mentions: **MuckRock.com**.

Free to use, they help you:
- File FOIA requests at federal, state, and local level
- Track responses and deadlines
- Access thousands of already-completed requests (search before filing — someone may have gotten what you need already)
- Get help writing request language from experienced FOIA journalists

I''ve filed 40+ requests through them. The database of completed requests alone is an incredible research tool.',
    NOW() - INTERVAL '5 days'),

    (v_thread_id, NULL, 'DataJournalist_WNYC',
'Pro tip on request strategy: **be specific but not too narrow**.

Bad: "All records related to police misconduct" — too broad, will be denied or take forever.
Also bad: "All records related to the arrest of John Smith on March 5, 2024 at 3pm at Oak Street" — may miss related records filed under different categories.

Good: "All complaints, disciplinary records, internal affairs investigations, and use-of-force reports involving Officer Jane Doe (badge #1234) from January 1, 2020 to present."

Also: always request the **fee waiver** if you''re a journalist, researcher, or nonprofit. Federal FOIA waives fees for news media and educational requesters. State laws vary.',
    NOW() - INTERVAL '3 days'),

    (v_thread_id, NULL, 'OpenGovAdvocate_DC',
'If your FOIA is denied or heavily redacted, here are your appeal options:

**Federal FOIA:**
1. Administrative appeal to the agency head (required before court)
2. FOIA ombudsman: the Office of Government Information Services (OGIS) at NARA — free mediation
3. Federal District Court lawsuit — FOIA lawsuits have fee-shifting, so attorneys will take them if there''s a solid case

**State FOIA denials:**
- Most states have an ombudsman or attorney general''s office that handles appeals
- Sunshine laws vary widely — some have teeth (California, Texas, Florida), some don''t
- Reporters Committee for Freedom of the Press has a free FOIA defense hotline: 1-800-336-4243

**Key exemptions to know:**
- Exemption 6: Personal privacy. Agencies overuse this.
- Exemption 7(C): Law enforcement personal privacy. Used constantly to redact officer names.
- Courts have held that on-duty officer names in use-of-force reports are generally NOT protected under Exemption 7(C) — *Lahr v. NTSB* (9th Cir.).',
    NOW() - INTERVAL '1 day');
  END IF;

  -- ============================================================
  -- REPLIES: Copwatch Startup Guide thread
  -- ============================================================
  SELECT id INTO v_thread_id FROM public.forum_threads
  WHERE title ILIKE '%Copwatch%' OR title ILIKE '%Police Watch%' LIMIT 1;

  IF v_thread_id IS NOT NULL THEN
    INSERT INTO public.forum_posts (thread_id, user_id, username, content, created_at)
    VALUES
    (v_thread_id, NULL, 'CopwatchVet_Oakland',
'Been doing copwatch in Oakland since 2009. Biggest lessons learned:

**On equipment:**
- Body-worn cameras are better than phones for extended patrols — longer battery, better mounting.
- A second observer is critical. One person films, one person observes and takes notes.
- Keep a printed incident log. Notes taken at the scene are admissible evidence.

**On safety:**
- Walk, don''t run. Running can be interpreted as fleeing.
- Stay on public sidewalks and roads. Never enter private property without permission, even to better document an incident.
- Wear hi-vis gear. It makes you visible and signals that you intend to be seen.

**On community:**
- Build relationships with community members before incidents happen. When you show up, people should recognize and trust you.
- Connect with the National Police Accountability Project (NPAP) — they have resources specifically for copwatch groups.',
    NOW() - INTERVAL '6 days'),

    (v_thread_id, NULL, 'CommunityOrganizer_CHI',
'Adding resources that helped our group launch:

1. **People''s Justice Project** has a copwatch training guide — free PDF
2. **Witness.org** — great resources specifically on video documentation for human rights
3. **Filming Cops** (filmingcops.com) — legal resources and case law database
4. **National Lawyers Guild** — find your local chapter and build a relationship BEFORE you need them

One thing nobody told us: you should have a written **media policy** for your group. What do you do with footage? Who can release it? Under what circumstances? Having this policy in writing protects your members and your credibility.',
    NOW() - INTERVAL '3 days');
  END IF;

  -- ============================================================
  -- REPLIES: Legal Aid Hotlines Directory thread
  -- ============================================================
  SELECT id INTO v_thread_id FROM public.forum_threads
  WHERE title ILIKE '%Legal Aid%Hotline%' OR title ILIKE '%Hotline%Directory%' LIMIT 1;

  IF v_thread_id IS NOT NULL THEN
    INSERT INTO public.forum_posts (thread_id, user_id, username, content, created_at)
    VALUES
    (v_thread_id, NULL, 'LegalAidWorker_LA',
'Adding some that aren''t on the main list:

**LGBTQ+ specific:**
- Lambda Legal Help Desk: 212-809-8585 (Mon-Fri)
- Transgender Law Center: transgenderlawcenter.org/intake
- National Center for Lesbian Rights: 800-528-6257

**Disability Rights:**
- Disability Rights Advocates: 510-665-8644
- DREDF (Disability Rights Education & Defense Fund): 510-644-2555
- Protection & Advocacy organizations: Each state has one, federally funded — find yours at ndrn.org

**Workers Rights:**
- Toward Justice (multi-state worker rights): 720-441-2236
- National Employment Law Project: nelp.org/legal-resources
- Workers Defense Project (TX): 512-225-2979

**Immigration:**
- RAICES: 888-724-2371 (24/7 for detained individuals)
- CLINIC (Catholic Legal Immigration Network): clinic.org/find-an-attorney
- American Immigration Council legal resources: americanimmigrationcouncil.org',
    NOW() - INTERVAL '4 days'),

    (v_thread_id, NULL, 'NLG_Portland',
'For anyone arrested at a protest — specifically in Oregon/Pacific Northwest:

**Oregon:**
- NLG Portland: 503-417-0680 (action line)
- Don''t Talk to Police Oregon: publicsafety911.org

**Washington State:**
- NLG Seattle: 206-285-0372 (mass arrest line)
- ACLU Washington: 206-624-2184

**California:**
- NLG Bay Area: 415-285-1011
- NLG LA: 323-696-2299
- ACLU of Southern California: 213-977-9500
- ACLU of Northern California: 415-621-2493

IMPORTANT: Tell the arresting officer immediately that you want a lawyer and then stop talking. The lawyer line won''t help you if you''ve already given a statement.',
    NOW() - INTERVAL '2 days');
  END IF;

  -- ============================================================
  -- REPLIES: Mutual Aid vs Charity thread
  -- ============================================================
  SELECT id INTO v_thread_id FROM public.forum_threads
  WHERE title ILIKE '%Mutual Aid%' LIMIT 1;

  IF v_thread_id IS NOT NULL THEN
    INSERT INTO public.forum_posts (thread_id, user_id, username, content, created_at)
    VALUES
    (v_thread_id, NULL, 'MutualAidOrganizer_Detroit',
'Real talk from someone who''s run both a mutual aid network and worked at a 501(c)(3): the **accountability structure** is the core difference, not just the words.

In mutual aid, the people receiving support are also the people running the network. There''s no separation between "helper" and "helped." When we decide what support to offer, the people who need it most have the most voice.

At a traditional nonprofit, the board and major donors have the most power. Even with the best intentions, that creates a structure where people experiencing harm have the least say in solutions.

This isn''t about demonizing nonprofits — many do essential work. But when we say mutual aid, we mean a specific thing: horizontal, community-controlled, non-hierarchical.',
    NOW() - INTERVAL '5 days'),

    (v_thread_id, NULL, 'BigDoorBrigade_Reader',
'The **Big Door Brigade** (bigdoorbrigade.com) has the best plain-language resources on this. Their "So You Want to Do Mutual Aid?" zine is free and covers:

- How to structure a mutual aid pod
- How to handle money without a 501(c)(3)
- How to avoid burnout
- How to respond when police/government interfere

Dean Spade''s book "Mutual Aid: Building Solidarity During This Crisis (and the Next)" is also excellent — free PDF available from his website.',
    NOW() - INTERVAL '2 days');
  END IF;

  -- ============================================================
  -- REPLIES: Welcome Thread
  -- ============================================================
  SELECT id INTO v_thread_id FROM public.forum_threads
  WHERE id = '11111111-1111-1111-1111-111111111111';

  IF v_thread_id IS NOT NULL THEN
    INSERT INTO public.forum_posts (thread_id, user_id, username, content, created_at)
    VALUES
    (v_thread_id, NULL, 'FirstTimePoster_ATL',
'Just found this site after being stopped and questioned by police at a protest last week. I had no idea I could refuse to answer questions! The Know Your Rights section is incredible — everyone needs this information. Thank you for building this.',
    NOW() - INTERVAL '3 days'),

    (v_thread_id, NULL, 'CivilRightsAttorney_MI',
'Wonderful resource. One note for anyone reading: the information here is educational, not legal advice. If you have a specific situation involving police misconduct, an arrest, or a civil rights violation, please consult a qualified attorney. The lawyer finder on this site is a great starting point — many of us offer free initial consultations.',
    NOW() - INTERVAL '2 days'),

    (v_thread_id, NULL, 'JournalistAlliance_PNW',
'The journalist arrest protocol post in this forum should be pinned. I''ve shared it with three newsrooms this week. This site fills a genuine gap — most civil rights resources are either too academic or too specific to one state.',
    NOW() - INTERVAL '1 day');
  END IF;

END $$;

-- Update post_count for threads that received new replies
UPDATE public.forum_threads SET
  post_count = (SELECT COUNT(*) FROM public.forum_posts fp WHERE fp.thread_id = forum_threads.id),
  last_post_at = (SELECT MAX(fp.created_at) FROM public.forum_posts fp WHERE fp.thread_id = forum_threads.id)
WHERE id IN (
  SELECT DISTINCT thread_id FROM public.forum_posts
  WHERE created_at > NOW() - INTERVAL '8 days'
);
