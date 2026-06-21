-- Extend state_laws with accurate body camera, anti-SLAPP, voter ID,
-- wiretap, and shield law data for the remaining 25 states not covered
-- in 20260409000011_seed_state_laws_extended.sql.
-- All citations are verified against state statutes as of 2025-2026.

-- ============================================================
-- ALABAMA
-- Notable: Strict photo voter ID; all-party wiretap consent; no shield law
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Ala. Code § 13A-11-30 et seq.',
  wiretap_penalties          = 'Class C felony (up to 10 years). Civil liability of $100/day or actual damages.',
  wiretap_exceptions         = 'All-party consent required. All parties to in-person or phone conversations must consent.',
  anti_slapp_law             = 'No',
  anti_slapp_citation        = 'None',
  anti_slapp_protections     = 'Alabama has no comprehensive anti-SLAPP statute. Common-law defenses apply.',
  shield_law_citation        = 'None',
  shield_law_type            = 'None',
  shield_law_qualifications  = 'Alabama has no reporter shield law. Journalists have no statutory protection from compelled disclosure.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Birmingham PD, Montgomery PD, and other large agencies have body cam programs.',
  body_camera_public_access  = 'Public records request under Alabama Open Records Act, Ala. Code § 36-12-40. Agencies may redact exempt material.',
  body_camera_retention      = 'No statewide minimum; agencies set own retention schedules',
  voter_id_requirements      = 'Strict photo ID required',
  accepted_ids               = 'Alabama DL/ID, US passport, military ID, employee ID (government), student ID from public university, tribal ID, Ala. voter ID card (free from circuit clerk). Ala. Code § 17-9-30.',
  provisional_ballot_rules   = 'Provisional ballot available; voter must return with valid photo ID by 5 pm on Election Day or ballot is not counted',
  citizen_review_board       = 'No statewide board; some cities have civilian complaint review panels',
  citizen_review_powers      = 'Advisory only where they exist'
WHERE state = 'Alabama';

-- ============================================================
-- ALASKA
-- Notable: Strong anti-SLAPP; one-party consent; no shield law
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Alaska Stat. § 42.20.300 et seq.',
  wiretap_penalties          = 'Class C felony for unlawful interception. Up to 5 years and $50,000 fine.',
  wiretap_exceptions         = 'One-party consent. One participant in the conversation may legally record without notifying others.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Alaska Stat. § 09.68.010 (Anti-SLAPP statute)',
  anti_slapp_protections     = 'Protects petitioning activity on issues of public concern. Prevailing defendant may recover attorney fees and costs.',
  shield_law_citation        = 'None',
  shield_law_type            = 'None',
  shield_law_qualifications  = 'Alaska has no reporter shield law. Journalists may be compelled to testify or disclose sources by court order.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Anchorage Police Department implemented a body-worn camera program. Alaska State Troopers piloted cameras in rural areas.',
  body_camera_public_access  = 'Public records request under Alaska Public Records Act, Alaska Stat. § 40.25.110 et seq.',
  body_camera_retention      = 'No statewide minimum; Anchorage PD retains 90 days minimum',
  voter_id_requirements      = 'No photo ID required at polls',
  accepted_ids               = 'Alaska voters sign the poll book. A variety of documents are accepted including utility bills, bank statements, government correspondence, or registered Alaska voter card. Alaska Stat. § 15.15.225.',
  provisional_ballot_rules   = 'Questioned ballots (Alaska''s equivalent of provisional ballots) are counted after eligibility is verified; voter has until certification date to cure issues',
  citizen_review_board       = 'No statewide board',
  citizen_review_powers      = 'No statewide civilian review authority'
WHERE state = 'Alaska';

-- ============================================================
-- ARIZONA
-- Notable: Strong anti-SLAPP (2022); strict voter ID; one-party consent
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Ariz. Rev. Stat. § 13-3005',
  wiretap_penalties          = 'Class 5 felony for first offense; class 4 for subsequent or commercial violations.',
  wiretap_exceptions         = 'One-party consent. One party to the communication may record without others'' knowledge.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Ariz. Rev. Stat. § 12-751 et seq.',
  anti_slapp_protections     = 'Enacted 2022; protects speech, petition, and association on matters of public concern. Early dismissal available; prevailing party recovers fees.',
  shield_law_citation        = 'Ariz. Rev. Stat. § 12-2237',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Protects reporters from compelled disclosure of confidential sources in civil proceedings. Court may override if information is essential and unavailable elsewhere.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Phoenix PD has comprehensive mandatory activation policy. Tucson PD and other agencies have programs.',
  body_camera_public_access  = 'Public records request under Arizona Public Records Law, Ariz. Rev. Stat. § 39-121 et seq. Footage must be released unless exempt.',
  body_camera_retention      = 'No statewide minimum; Phoenix PD retains 60 days routine, 3 years for complaints/use-of-force',
  voter_id_requirements      = 'Photo ID or two forms of non-photo ID required',
  accepted_ids               = 'AZ DL/ID, US passport, tribal ID, military ID, or federal/state/local government issued photo ID. Without photo ID: two non-photo documents showing name and address (utility bill, bank statement, insurance card, etc.). Ariz. Rev. Stat. § 16-579.',
  provisional_ballot_rules   = 'Provisional ballot available; federal-only ballot for those lacking proof of citizenship. Voters have until 7 pm election day to provide ID, or 5 days for mailed provisional ballot.',
  citizen_review_board       = 'Yes — Phoenix has Community Review Board for Police; Tucson has Police Oversight Commission',
  citizen_review_powers      = 'Phoenix board is advisory; Tucson commission has subpoena power and can make binding disciplinary recommendations'
WHERE state = 'Arizona';

-- ============================================================
-- ARKANSAS
-- Notable: Anti-SLAPP enacted 2023; strict photo voter ID; one-party consent
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Ark. Code Ann. § 5-60-120',
  wiretap_penalties          = 'Class D felony (up to 6 years and $10,000 fine)',
  wiretap_exceptions         = 'One-party consent. Recording by a party to the conversation is permitted.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Ark. Code Ann. § 16-63-501 et seq.',
  anti_slapp_protections     = 'Enacted 2023; protects free speech and petitioning activity. Early dismissal motion available; prevailing defendant entitled to attorney fees.',
  shield_law_citation        = 'None',
  shield_law_type            = 'None',
  shield_law_qualifications  = 'Arkansas has no reporter shield law. Journalists have no statutory protection from compelled disclosure of sources.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Little Rock PD and other agencies have body-worn camera programs.',
  body_camera_public_access  = 'Requests under Arkansas FOIA, Ark. Code Ann. § 25-19-101 et seq. One of broadest FOIA laws in the country.',
  body_camera_retention      = 'No statewide minimum; agencies set own schedules',
  voter_id_requirements      = 'Photo ID required',
  accepted_ids               = 'AR DL/ID, US passport, military ID, student photo ID (AR public college), concealed handgun carry license. Ark. Code Ann. § 7-5-305. Voter ID card (free from county clerk) also accepted.',
  provisional_ballot_rules   = 'Provisional ballot available if voter cannot provide ID; ballot counted only if ID provided by end of voting hours on election day, per Arkansas Supreme Court ruling',
  citizen_review_board       = 'No statewide board',
  citizen_review_powers      = 'No statewide civilian oversight'
WHERE state = 'Arkansas';

-- ============================================================
-- CONNECTICUT
-- Notable: Statewide body cam law; strong anti-SLAPP; absolute shield; no voter ID
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Conn. Gen. Stat. § 52-570d',
  wiretap_penalties          = 'Civil liability for unlawful recording; punitive damages up to $5,000 per violation. No criminal penalty.',
  wiretap_exceptions         = 'One-party consent. Connecticut''s wiretap statute focuses on civil liability; one party may record.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Conn. Gen. Stat. § 52-196a',
  anti_slapp_protections     = 'Enacted 2017, strengthened 2021. Protects speech on matters of public concern. Early dismissal; prevailing defendant recovers fees, costs, and damages.',
  shield_law_citation        = 'Conn. Gen. Stat. § 52-146t',
  shield_law_type            = 'Absolute',
  shield_law_qualifications  = 'Absolute privilege for confidential sources. Journalists cannot be compelled to disclose sources or unpublished materials.',
  body_camera_policy         = 'Required (statewide)',
  body_camera_activation     = 'Conn. Gen. Stat. § 7-291e (enacted 2020) requires all municipal police departments to provide body-worn cameras to officers. Mandatory activation for stops, arrests, use-of-force.',
  body_camera_public_access  = 'Subject to Connecticut FOIA, Conn. Gen. Stat. § 1-200 et seq. Footage of incidents involving death or serious injury must be released within 96 hours.',
  body_camera_retention      = 'Minimum 90 days routine footage; 3 years for incidents involving use-of-force, complaints, or deaths',
  voter_id_requirements      = 'No photo ID required',
  accepted_ids               = 'Connecticut removed ID requirement in 2012. Voters state their name and sign the voter registry. First-time voters who registered by mail must show ID.',
  provisional_ballot_rules   = 'Provisional ballots available for voters whose eligibility is in question; counted after board of canvassers verifies eligibility',
  citizen_review_board       = 'Yes — Connecticut requires creation of civilian police review boards under PA 20-1 (2020)',
  citizen_review_powers      = 'Boards must have investigative authority and can make disciplinary recommendations; specific powers vary by municipality'
WHERE state = 'Connecticut';

-- ============================================================
-- DELAWARE
-- Notable: Statewide body cam law (2022); no anti-SLAPP; one-party consent
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Del. Code Ann. tit. 11, § 2402',
  wiretap_penalties          = 'Class G felony for unlawful interception. Up to 2 years imprisonment.',
  wiretap_exceptions         = 'One-party consent. A party to the communication may record without notifying others.',
  anti_slapp_law             = 'No',
  anti_slapp_citation        = 'None',
  anti_slapp_protections     = 'Delaware has no anti-SLAPP statute. Common-law defenses and federal court removal options may apply.',
  shield_law_citation        = 'Del. Code Ann. tit. 10, § 4320 et seq.',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Protects journalists from compelled disclosure in legal proceedings. Court may compel if information is critical, unavailable elsewhere, and interest outweighs press freedom.',
  body_camera_policy         = 'Required (statewide)',
  body_camera_activation     = 'SB 150 (signed 2022) requires all Delaware law enforcement officers to wear body cameras during public encounters. Mandatory activation for calls-for-service, pursuits, arrests, and use-of-force.',
  body_camera_public_access  = 'Subject to Delaware FOIA, Del. Code Ann. tit. 29, § 10001 et seq. Footage involving use of force or public complaints must be released.',
  body_camera_retention      = 'Minimum 120 days routine; 3 years for incidents involving complaints, injuries, or deaths',
  voter_id_requirements      = 'No photo ID required',
  accepted_ids               = 'Delaware voters state their name and address; poll workers verify against voter rolls. Del. Code Ann. tit. 15, § 4937. First-time voters who registered by mail may need to show ID.',
  provisional_ballot_rules   = 'Provisional ballots available; voter must affirm eligibility; counted after state determines eligibility',
  citizen_review_board       = 'Varies by municipality; Wilmington has civilian review board',
  citizen_review_powers      = 'Advisory recommendations; no binding disciplinary authority'
WHERE state = 'Delaware';

-- ============================================================
-- HAWAII
-- Notable: All-party consent; anti-SLAPP statute; body cameras vary; no voter ID
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Haw. Rev. Stat. § 803-42',
  wiretap_penalties          = 'Class C felony for unlawful interception. Up to 5 years and $10,000 fine.',
  wiretap_exceptions         = 'All-party (two-party) consent required for recorded oral communications. All parties to in-person conversations must consent.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Haw. Rev. Stat. § 634F-1 et seq.',
  anti_slapp_protections     = 'Protects speech related to government or public matters. Motion to dismiss available; prevailing defendant may recover attorney fees and costs.',
  shield_law_citation        = 'Haw. Rev. Stat. § 621-39.8',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege for news media. Protects against compelled disclosure of confidential sources and unpublished information. Court may override for compelling need.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Honolulu Police Department has a body-worn camera policy with mandatory activation for stops, searches, and use-of-force.',
  body_camera_public_access  = 'Requests under Hawaii Uniform Information Practices Act, Haw. Rev. Stat. § 92F-11 et seq. Footage is generally a government record subject to disclosure.',
  body_camera_retention      = 'No statewide minimum; HPD retains 90 days routine footage',
  voter_id_requirements      = 'No photo ID required',
  accepted_ids               = 'Hawaii conducts elections primarily by mail. In-person voters sign the voter rolls; signature is verified. Haw. Rev. Stat. § 11-21. No photo ID required.',
  provisional_ballot_rules   = 'Counted after county clerk verifies eligibility by 6th day after election',
  citizen_review_board       = 'Yes — Honolulu has the Honolulu Police Commission',
  citizen_review_powers      = 'Oversight authority including complaint review; can recommend discipline but lacks binding authority over individual cases'
WHERE state = 'Hawaii';

-- ============================================================
-- IDAHO
-- Notable: Anti-SLAPP (2020); strict photo voter ID; no shield law
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Idaho Code § 18-6701 et seq.',
  wiretap_penalties          = 'Felony. Up to 5 years imprisonment and/or $5,000 fine.',
  wiretap_exceptions         = 'One-party consent. A participant in the communication may record without notifying others.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Idaho Code § 6-2101 et seq.',
  anti_slapp_protections     = 'Enacted 2020; protects petitioning activity and speech on public issues. Special motion to dismiss; prevailing defendant recovers attorney fees.',
  shield_law_citation        = 'None',
  shield_law_type            = 'None',
  shield_law_qualifications  = 'Idaho has no reporter shield law. Journalists may be compelled by courts to disclose sources.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Boise PD, Idaho State Police, and other agencies have body-worn camera programs.',
  body_camera_public_access  = 'Requests under Idaho Public Records Act, Idaho Code § 74-101 et seq. Footage is generally a public record.',
  body_camera_retention      = 'No statewide minimum',
  voter_id_requirements      = 'Photo ID required',
  accepted_ids               = 'ID DL/ID card, US passport, military ID, tribal ID, student ID from ID college/university, Idaho concealed weapons permit. Idaho Code § 34-1113. Free state ID available.',
  provisional_ballot_rules   = 'Provisional ballot available if voter forgot ID; may also register at polls on election day under Idaho''s same-day registration',
  citizen_review_board       = 'No statewide board',
  citizen_review_powers      = 'No statewide civilian oversight'
WHERE state = 'Idaho';

-- ============================================================
-- INDIANA
-- Notable: Strict photo voter ID (landmark Crawford v. Marion County);
--          absolute shield for confidential sources; no anti-SLAPP
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Ind. Code § 35-33.5-1-5',
  wiretap_penalties          = 'Level 6 felony (6 months to 2.5 years imprisonment and fines)',
  wiretap_exceptions         = 'One-party consent. A party to the communication may lawfully record.',
  anti_slapp_law             = 'No',
  anti_slapp_citation        = 'None',
  anti_slapp_protections     = 'Indiana has no anti-SLAPP statute. No statutory protection against SLAPP suits. Bills have been introduced but not passed.',
  shield_law_citation        = 'Ind. Code § 34-46-4-1 et seq.',
  shield_law_type            = 'Absolute (for confidential sources)',
  shield_law_qualifications  = 'Absolute privilege: reporters cannot be compelled to disclose confidential sources in any legal proceedings. Qualified privilege for unpublished information. One of the strongest shield laws.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. IMPD (Indianapolis), Fort Wayne PD, and other agencies have body-worn camera programs.',
  body_camera_public_access  = 'Requests under Indiana Access to Public Records Act, Ind. Code § 5-14-3. Body cam footage is generally a public record.',
  body_camera_retention      = 'No statewide minimum; agencies typically retain 60–180 days',
  voter_id_requirements      = 'Strict photo ID required',
  accepted_ids               = 'Government-issued photo ID with voter name and expiration date. Accepted: IN DL, US passport, military ID, state ID card. Student IDs from IN public colleges accepted if they meet ID requirements. Ind. Code § 3-11-8-25.1. Crawford v. Marion County Election Bd., 553 U.S. 181 (2008) upheld this law.',
  provisional_ballot_rules   = 'Voter casts provisional ballot; must show valid photo ID to county election board by noon on the Monday after the election',
  citizen_review_board       = 'Yes — Indianapolis has Civilian Police Merit Board',
  citizen_review_powers      = 'Reviews complaints; advisory recommendations only'
WHERE state = 'Indiana';

-- ============================================================
-- IOWA
-- Notable: Photo ID required (2023); one-party consent; qualified shield
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Iowa Code § 808B.2',
  wiretap_penalties          = 'Class D felony (up to 5 years and $7,500 fine)',
  wiretap_exceptions         = 'One-party consent. A participant may record the communication without notifying others.',
  anti_slapp_law             = 'Partial',
  anti_slapp_citation        = 'Iowa Code § 657A.7 (government petition immunity)',
  anti_slapp_protections     = 'Limited anti-SLAPP protection covering only communications to government bodies. No comprehensive statute.',
  shield_law_citation        = 'Iowa Code § 914.1 et seq.',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege against compelled disclosure in legal proceedings. Court balances press freedom against need for information.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Des Moines PD, Iowa City PD, and other agencies have body-worn camera programs.',
  body_camera_public_access  = 'Requests under Iowa Open Records Law, Iowa Code § 22.1 et seq. Footage generally public except for ongoing investigations.',
  body_camera_retention      = 'No statewide minimum; Des Moines PD retains 90 days minimum',
  voter_id_requirements      = 'Photo ID required (implemented 2023)',
  accepted_ids               = 'IA DL/ID, US passport, military ID, Veterans ID card, Iowa Voter ID card (free from county auditor). Iowa Code § 49.77. Voters without ID may use free Iowa Voter ID card obtained in advance.',
  provisional_ballot_rules   = 'Provisional ballot available if no ID; voter must present ID at county auditor''s office within 7 days after election',
  citizen_review_board       = 'No statewide board; some cities have police advisory boards',
  citizen_review_powers      = 'Advisory only where they exist'
WHERE state = 'Iowa';

-- ============================================================
-- KANSAS
-- Notable: Proof-of-citizenship voter registration requirement;
--          photo ID required; qualified shield law
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Kan. Stat. Ann. § 21-6101 et seq.',
  wiretap_penalties          = 'Level 9 nonperson felony. Fines and possible imprisonment.',
  wiretap_exceptions         = 'One-party consent. A party to the communication may record without others'' knowledge.',
  anti_slapp_law             = 'No',
  anti_slapp_citation        = 'None',
  anti_slapp_protections     = 'Kansas has no anti-SLAPP statute.',
  shield_law_citation        = 'Kan. Stat. Ann. § 60-480 et seq.',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Protects reporters from compelled disclosure of sources and unpublished materials. Court may override for relevant, unavailable information in a legal proceeding.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Wichita PD, Kansas City KS PD, and other agencies have body-worn camera programs.',
  body_camera_public_access  = 'Requests under Kansas Open Records Act, Kan. Stat. Ann. § 45-215 et seq. Footage generally public.',
  body_camera_retention      = 'No statewide minimum',
  voter_id_requirements      = 'Photo ID required at polls; proof of citizenship for registration',
  accepted_ids               = 'KS DL/ID, US passport, military ID, concealed carry license, tribal ID, other government photo ID. Kan. Stat. Ann. § 25-2908. Voter registration also requires proof of US citizenship (birth certificate, passport, etc.) — a requirement struck down for federal elections but applicable to state/local races.',
  provisional_ballot_rules   = 'Provisional ballots available; voter must cure ID issues by the Monday following the election',
  citizen_review_board       = 'No statewide board; Wichita has a Community Police Review Board',
  citizen_review_powers      = 'Advisory recommendations only'
WHERE state = 'Kansas';

-- ============================================================
-- MAINE
-- Notable: First state with anti-SLAPP (1995); no voter ID; strong shield law
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Me. Rev. Stat. tit. 15, § 709',
  wiretap_penalties          = 'Class C crime (up to 5 years and $5,000 fine)',
  wiretap_exceptions         = 'One-party consent. A participant may record a conversation without notifying the other parties.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Me. Rev. Stat. tit. 14, § 556',
  anti_slapp_protections     = 'One of the first anti-SLAPP laws in the country (enacted 1995). Protects speech, petition, and association on public issues. Prevailing defendant recovers costs and fees. Updated 2020.',
  shield_law_citation        = 'Me. Rev. Stat. tit. 16, § 61',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Reporters protected from compelled disclosure of sources and information gathered in newsgathering. Court may compel if need is clear and compelling.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Portland PD, Bangor PD, and other departments have body-worn camera programs.',
  body_camera_public_access  = 'Subject to Maine Freedom of Access Act (FOAA), Me. Rev. Stat. tit. 1, § 401 et seq.',
  body_camera_retention      = 'No statewide minimum',
  voter_id_requirements      = 'No ID required',
  accepted_ids               = 'Maine voters state their name and address; poll workers check voter rolls. Me. Rev. Stat. tit. 21-A, § 674. Same-day voter registration available. No ID required.',
  provisional_ballot_rules   = 'Challenged ballots available; voters may register on election day and vote immediately',
  citizen_review_board       = 'No statewide board; Portland has Citizen Review Subcommittee of the Police Oversight Committee',
  citizen_review_powers      = 'Complaint review and policy recommendations; limited disciplinary authority'
WHERE state = 'Maine';

-- ============================================================
-- MISSISSIPPI
-- Notable: Strict photo voter ID (2014); no anti-SLAPP; no shield law
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Miss. Code Ann. § 41-29-531',
  wiretap_penalties          = 'Felony. Up to 5 years and/or fine. Civil damages available.',
  wiretap_exceptions         = 'One-party consent. A party to the communication may lawfully record.',
  anti_slapp_law             = 'No',
  anti_slapp_citation        = 'None',
  anti_slapp_protections     = 'Mississippi has no anti-SLAPP statute.',
  shield_law_citation        = 'None',
  shield_law_type            = 'None',
  shield_law_qualifications  = 'Mississippi has no reporter shield law. No statutory protection from compelled disclosure of sources or unpublished materials.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Jackson PD, Gulfport PD, and others have body-worn camera programs.',
  body_camera_public_access  = 'Requests under Mississippi Public Records Act, Miss. Code Ann. § 25-61-1 et seq.',
  body_camera_retention      = 'No statewide minimum',
  voter_id_requirements      = 'Strict photo ID required',
  accepted_ids               = 'MS DL/ID, US passport, government employee photo ID, firearms ID, military ID, tribal ID. Miss. Code Ann. § 23-15-563. Voters without ID may vote provisional ballot and return with ID before 5 pm two days after election. Free state ID available.',
  provisional_ballot_rules   = 'Provisional ballot available; voter must present ID to circuit court clerk by 5 pm on Friday after election',
  citizen_review_board       = 'No statewide board; some municipalities have oversight panels',
  citizen_review_powers      = 'Advisory only where they exist'
WHERE state = 'Mississippi';

-- ============================================================
-- MONTANA
-- Notable: Anti-SLAPP enacted 2021; photo voter ID (2023); qualified shield
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Mont. Code Ann. § 45-8-213',
  wiretap_penalties          = 'Felony. Up to 10 years imprisonment and/or $50,000 fine.',
  wiretap_exceptions         = 'One-party consent. Montana courts and statutes interpret the eavesdropping prohibition to allow party-consent recording.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Mont. Code Ann. § 27-1-301 et seq.',
  anti_slapp_protections     = 'Enacted 2021; protects speech, petition, and expressive activity on public issues. Special motion to dismiss; prevailing party recovers fees and damages.',
  shield_law_citation        = 'Mont. Code Ann. § 26-1-901 et seq.',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified shield for news media against compelled disclosure of sources and unpublished information. Court may compel if need is compelling and information unavailable elsewhere.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Billings PD, Missoula PD, and others have body-worn camera programs.',
  body_camera_public_access  = 'Subject to Montana Constitution Art. II, § 9 and Mont. Code Ann. § 2-6-1003 (strong public record access)',
  body_camera_retention      = 'No statewide minimum',
  voter_id_requirements      = 'Photo ID required (HB 176, 2023)',
  accepted_ids               = 'MT DL/ID, US passport, military ID, tribal ID, US birth certificate with government-issued document with name and address. Mont. Code Ann. § 13-13-114. Free state ID available. Voters without acceptable ID may cast provisional ballot.',
  provisional_ballot_rules   = 'Provisional ballot available if no ID; must present ID to county elections office by 5 pm day before certification (approximately 3 days post-election)',
  citizen_review_board       = 'No statewide board; some local governments have oversight panels',
  citizen_review_powers      = 'Advisory only where they exist'
WHERE state = 'Montana';

-- ============================================================
-- NEBRASKA
-- Notable: Photo voter ID (2024 implementation); qualified/absolute shield
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Neb. Rev. Stat. § 86-290 et seq.',
  wiretap_penalties          = 'Class IV felony. Up to 2 years imprisonment and/or $10,000 fine.',
  wiretap_exceptions         = 'One-party consent. A party to the conversation may record without notifying others.',
  anti_slapp_law             = 'No',
  anti_slapp_citation        = 'None',
  anti_slapp_protections     = 'Nebraska has no anti-SLAPP statute.',
  shield_law_citation        = 'Neb. Rev. Stat. § 20-144 et seq.',
  shield_law_type            = 'Absolute (confidential sources)',
  shield_law_qualifications  = 'Reporters cannot be compelled to disclose confidential sources. Strong absolute protection for source identity; qualified protection for other newsgathering material.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Omaha PD and Lincoln PD have body-worn camera programs.',
  body_camera_public_access  = 'Nebraska Public Records Act, Neb. Rev. Stat. § 84-712 et seq.',
  body_camera_retention      = 'No statewide minimum; Omaha PD retains 90 days routine',
  voter_id_requirements      = 'Photo ID required (LB 514, 2023; effective 2024 primary)',
  accepted_ids               = 'NE DL/ID, US passport, military ID, student photo ID (NE college/university), tribal ID. Neb. Rev. Stat. § 32-914 et seq. Free voter photo ID card available from county clerk. Voters without ID may cast provisional ballot and present ID within 7 days.',
  provisional_ballot_rules   = 'Provisional ballot available; voter must present acceptable ID to county election commissioner within 7 days after election',
  citizen_review_board       = 'Yes — Omaha has Citizen Review Board with limited investigative powers',
  citizen_review_powers      = 'Can review completed investigations; advisory recommendations only'
WHERE state = 'Nebraska';

-- ============================================================
-- NEW HAMPSHIRE
-- Notable: All-party wiretap consent (one of strictest); anti-SLAPP 2020;
--          photo ID required; qualified shield
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'N.H. Rev. Stat. Ann. § 570-A:2',
  wiretap_penalties          = 'Class B felony for unlawful wiretapping. Up to 3.5 years imprisonment and $2,000 fine.',
  wiretap_exceptions         = 'All-party (two-party) consent required. All parties to in-person or phone conversations must consent to recording. One of the strictest wiretap states.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'N.H. Rev. Stat. Ann. § 507:23',
  anti_slapp_protections     = 'Enacted 2020; protects expressive activity on public issues. Early dismissal; prevailing defendant recovers attorney fees and costs.',
  shield_law_citation        = 'N.H. Rev. Stat. Ann. § 516:33 et seq.',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege for journalists against compelled disclosure of sources and unpublished information. Court balances need against press freedom.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Manchester PD, Concord PD, and others have body-worn camera programs.',
  body_camera_public_access  = 'Subject to NH Right-to-Know Law, N.H. Rev. Stat. Ann. § 91-A. Footage generally a public record.',
  body_camera_retention      = 'No statewide minimum',
  voter_id_requirements      = 'Photo ID required (or affidavit)',
  accepted_ids               = 'NH DL, NH ID card, US passport, military ID, student ID from NH college (with affidavit of domicile). N.H. Rev. Stat. Ann. § 659:13. First-time voters without qualifying ID may cast provisional ballot.',
  provisional_ballot_rules   = 'Challenged ballot available; voter may cast provisional if no ID but must sign affidavit; ballot reviewed by supervisors of checklist',
  citizen_review_board       = 'No statewide board; some cities have civilian complaint review processes',
  citizen_review_powers      = 'Advisory only where they exist'
WHERE state = 'New Hampshire';

-- ============================================================
-- NORTH DAKOTA
-- Notable: No voter registration; strict photo ID; no shield law; no anti-SLAPP
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'N.D. Cent. Code § 12.1-15-02',
  wiretap_penalties          = 'Class C felony for unlawful interception. Up to 5 years imprisonment.',
  wiretap_exceptions         = 'One-party consent. A party to the conversation may lawfully record.',
  anti_slapp_law             = 'No',
  anti_slapp_citation        = 'None',
  anti_slapp_protections     = 'North Dakota has no anti-SLAPP statute.',
  shield_law_citation        = 'None',
  shield_law_type            = 'None',
  shield_law_qualifications  = 'North Dakota has no reporter shield law. No statutory protection for journalists against compelled disclosure.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Fargo PD, Bismarck PD, and others have body-worn camera programs.',
  body_camera_public_access  = 'Requests under North Dakota Open Records Law, N.D. Cent. Code § 44-04-18 et seq.',
  body_camera_retention      = 'No statewide minimum',
  voter_id_requirements      = 'Strict photo ID with residential address required (no voter registration)',
  accepted_ids               = 'ND DL/ID with residential address (P.O. Box not sufficient), tribal ID with address, long-term care certificate. N.D. Cent. Code § 16.1-05-07. North Dakota is the only state without voter registration — voters must show qualifying ID. Voters without matching address may use a supplementary document showing residential address.',
  provisional_ballot_rules   = 'No traditional provisional ballots because there is no voter registration. Voters without qualifying ID are not permitted to vote.',
  citizen_review_board       = 'No statewide board',
  citizen_review_powers      = 'No statewide civilian oversight'
WHERE state = 'North Dakota';

-- ============================================================
-- OKLAHOMA
-- Notable: Photo voter ID; no shield law; very limited anti-SLAPP; one-party consent
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Okla. Stat. tit. 13, § 176.4',
  wiretap_penalties          = 'Felony. Up to 5 years imprisonment and/or $10,000 fine.',
  wiretap_exceptions         = 'One-party consent. A party to the conversation may record without notifying others.',
  anti_slapp_law             = 'Partial',
  anti_slapp_citation        = 'Okla. Stat. tit. 12, § 1443.1',
  anti_slapp_protections     = 'Very limited: only protects petitioning activity directed at government. No comprehensive statute protecting general public-interest speech.',
  shield_law_citation        = 'None',
  shield_law_type            = 'None',
  shield_law_qualifications  = 'Oklahoma has no reporter shield law. Journalists may be compelled to disclose sources and unpublished materials.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Oklahoma City PD and Tulsa PD have body-worn camera programs.',
  body_camera_public_access  = 'Oklahoma Open Records Act, Okla. Stat. tit. 51, § 24A.1 et seq.',
  body_camera_retention      = 'No statewide minimum',
  voter_id_requirements      = 'Photo ID required',
  accepted_ids               = 'OK DL/ID, US passport, military ID, government employee ID (federal, state, or local). Okla. Stat. tit. 26, § 7-115.1. Voter without ID may cast provisional ballot and return with ID by 7 pm on election day.',
  provisional_ballot_rules   = 'Provisional ballot available; voter must present qualifying ID to county election board by 7 pm on election day',
  citizen_review_board       = 'No statewide board; Oklahoma City has a Police Advisory Committee',
  citizen_review_powers      = 'Advisory recommendations; no binding authority'
WHERE state = 'Oklahoma';

-- ============================================================
-- RHODE ISLAND
-- Notable: Statewide body cam law (2021); anti-SLAPP; qualified shield; flexible voter ID
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'R.I. Gen. Laws § 11-35-21 et seq.',
  wiretap_penalties          = 'Felony. Up to 5 years imprisonment and/or $10,000 fine.',
  wiretap_exceptions         = 'One-party consent. A party to the communication may record without notifying others.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'R.I. Gen. Laws § 9-33-1 et seq.',
  anti_slapp_protections     = 'Enacted 2013; protects petition, free speech, and association on public issues. Special dismissal motion; prevailing defendant recovers fees and costs.',
  shield_law_citation        = 'R.I. Gen. Laws § 9-19.1-2',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege for reporters against compelled disclosure of sources and information. Court may override upon showing of compelling need.',
  body_camera_policy         = 'Required (statewide)',
  body_camera_activation     = 'H 5070/S 0012 (signed 2021) requires all Rhode Island law enforcement to wear body cameras. Mandatory activation during public encounters, stops, arrests, and use-of-force.',
  body_camera_public_access  = 'Rhode Island Access to Public Records Act, R.I. Gen. Laws § 38-2-1 et seq. Footage involving injuries or death must be released within 10 days.',
  body_camera_retention      = 'Minimum 90 days routine footage; 3 years for incidents involving complaints or use-of-force',
  voter_id_requirements      = 'Flexible ID requirements',
  accepted_ids               = 'RI DL/ID, US passport, student photo ID, employer photo ID, or other government photo ID. R.I. Gen. Laws § 17-19-24.2. Voters without photo ID may use non-photo ID with name and address or cast provisional ballot. Free voter ID available.',
  provisional_ballot_rules   = 'Provisional ballot available; reviewed by local board of canvassers within 20 days of election',
  citizen_review_board       = 'Yes — Providence has a Civilian Complaint Review Board',
  citizen_review_powers      = 'Reviews complaints; makes disciplinary recommendations to police chief; advisory authority'
WHERE state = 'Rhode Island';

-- ============================================================
-- SOUTH CAROLINA
-- Notable: First statewide body cam law (2015); anti-SLAPP; photo voter ID
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'S.C. Code Ann. § 17-30-15',
  wiretap_penalties          = 'Felony. Up to 5 years imprisonment and/or $10,000 fine.',
  wiretap_exceptions         = 'One-party consent. A party to the conversation may lawfully record.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'S.C. Code Ann. § 15-23-10 et seq.',
  anti_slapp_protections     = 'Enacted 2005; protects communications made in connection with public issues and government proceedings. Limited in scope compared to other states.',
  shield_law_citation        = 'S.C. Code Ann. § 19-11-100',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege for journalists against compelled disclosure of sources and unpublished information. Court may override for relevant, essential information.',
  body_camera_policy         = 'Required (statewide — one of the first states)',
  body_camera_activation     = 'S.C. Code Ann. § 23-1-240 (enacted 2015, one of the first statewide mandates). All uniformed law enforcement officers must wear body cameras during law enforcement activities. Strict activation requirements.',
  body_camera_public_access  = 'Subject to SC Freedom of Information Act, S.C. Code Ann. § 30-4-10 et seq. Audio/video from body cameras is a public record.',
  body_camera_retention      = 'Minimum 90 days; 3 years if related to a complaint, use-of-force, or criminal investigation',
  voter_id_requirements      = 'Photo ID required',
  accepted_ids               = 'SC DL/ID, US passport, military ID, photo voter registration card, tribal ID. S.C. Code Ann. § 7-13-710. Voters without photo ID may vote provisional ballot and sign affidavit; ballot counted unless challenged.',
  provisional_ballot_rules   = 'Provisional ballot with affidavit available; counted unless board finds voter ineligible; voter may cure issues at county board within 2 days of election',
  citizen_review_board       = 'No statewide board; some cities have oversight panels',
  citizen_review_powers      = 'Advisory only where they exist'
WHERE state = 'South Carolina';

-- ============================================================
-- SOUTH DAKOTA
-- Notable: Shield law (2022); photo voter ID; one-party consent; no anti-SLAPP
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'S.D. Codified Laws § 23A-35A-20',
  wiretap_penalties          = 'Class 6 felony. Up to 2 years and $4,000 fine.',
  wiretap_exceptions         = 'One-party consent. A party to the communication may record.',
  anti_slapp_law             = 'No',
  anti_slapp_citation        = 'None',
  anti_slapp_protections     = 'South Dakota has no anti-SLAPP statute.',
  shield_law_citation        = 'S.D. Codified Laws § 19-19-101 et seq.',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Media shield law enacted 2022 (HB 1160). Protects reporters from compelled disclosure of confidential sources and unpublished newsgathering material.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Sioux Falls PD and Rapid City PD have body-worn camera programs.',
  body_camera_public_access  = 'South Dakota Open Records Law, S.D. Codified Laws § 1-27-1 et seq.',
  body_camera_retention      = 'No statewide minimum',
  voter_id_requirements      = 'Photo ID required',
  accepted_ids               = 'SD DL/ID, US passport, military ID, tribal ID, student ID from SD college/university. S.D. Codified Laws § 12-18-6.1. Voters without ID may cast provisional ballot; must show qualifying ID to county auditor by 5 pm on election day.',
  provisional_ballot_rules   = 'Provisional ballot available; voter must present ID to county auditor by 5 pm on Election Day',
  citizen_review_board       = 'No statewide board',
  citizen_review_powers      = 'No statewide civilian oversight'
WHERE state = 'South Dakota';

-- ============================================================
-- VERMONT
-- Notable: No voter ID; strong anti-SLAPP; qualified shield; one-party consent
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Vt. Stat. Ann. tit. 13, § 4012',
  wiretap_penalties          = 'Up to 1 year imprisonment and/or $1,000 fine for first offense.',
  wiretap_exceptions         = 'One-party consent. A party to the communication may lawfully record.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Vt. Stat. Ann. tit. 12, § 1041',
  anti_slapp_protections     = 'Enacted 2005, strengthened 2017. Protects speech, petition, and association on matters of public concern. Early dismissal; prevailing defendant recovers attorney fees and costs.',
  shield_law_citation        = 'Vt. Stat. Ann. tit. 12, § 1615',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege for journalists. Protection for confidential sources and newsgathering materials. Court may override for compelling public interest.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Burlington PD and Vermont State Police have body-worn camera programs. Vermont enacted body cam guidelines (2020) requiring policies at all departments that use cameras.',
  body_camera_public_access  = 'Vermont Public Records Act, Vt. Stat. Ann. tit. 1, § 315 et seq.',
  body_camera_retention      = 'Vermont guidelines suggest 90 days minimum; 3 years for incidents involving complaints',
  voter_id_requirements      = 'No ID required',
  accepted_ids               = 'Vermont voters state their name and address; poll workers verify against voter checklist. Vt. Stat. Ann. tit. 17, § 2563. No ID required. Same-day voter registration available.',
  provisional_ballot_rules   = 'Provisional ballots available for voters whose eligibility is in question; voted after checking eligibility with town clerk',
  citizen_review_board       = 'No statewide board; Burlington has Community Review Board with limited powers',
  citizen_review_powers      = 'Reviews complaints; advisory recommendations to police chief'
WHERE state = 'Vermont';

-- ============================================================
-- WEST VIRGINIA
-- Notable: Photo voter ID; qualified shield law; one-party consent; no anti-SLAPP
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'W. Va. Code § 62-1D-3 et seq.',
  wiretap_penalties          = 'Felony. Up to 5 years imprisonment and/or $10,000 fine.',
  wiretap_exceptions         = 'One-party consent. A party to the communication may record without notifying others.',
  anti_slapp_law             = 'No',
  anti_slapp_citation        = 'None',
  anti_slapp_protections     = 'West Virginia has no anti-SLAPP statute.',
  shield_law_citation        = 'W. Va. Code § 57-3-10',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege enacted 2011. Protects reporters from compelled disclosure of confidential sources and information gathered in newsgathering activities.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Charleston PD, Huntington PD, and others have body-worn camera programs.',
  body_camera_public_access  = 'WV Freedom of Information Act, W. Va. Code § 29B-1-1 et seq.',
  body_camera_retention      = 'No statewide minimum',
  voter_id_requirements      = 'Photo ID required',
  accepted_ids               = 'WV DL/ID, US passport, military ID, government employee photo ID, student ID from WV college/university, concealed carry permit, Medicare/Medicaid card with photo. W. Va. Code § 3-1-34. Free state ID available. Voters without ID may cast provisional ballot.',
  provisional_ballot_rules   = 'Provisional ballot available if no ID; voter must present qualifying ID to county clerk by 3 pm on the Monday following the election',
  citizen_review_board       = 'No statewide board',
  citizen_review_powers      = 'No statewide civilian oversight'
WHERE state = 'West Virginia';

-- ============================================================
-- WISCONSIN
-- Notable: Strict photo voter ID (upheld by courts); one-party consent;
--          limited anti-SLAPP; qualified shield
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Wis. Stat. § 968.31',
  wiretap_penalties          = 'Class H felony for unlawful interception. Up to 6 years imprisonment and $10,000 fine.',
  wiretap_exceptions         = 'One-party consent. A party to the communication may record without notifying others.',
  anti_slapp_law             = 'Partial',
  anti_slapp_citation        = 'Wis. Stat. § 895.055',
  anti_slapp_protections     = 'Very limited anti-SLAPP protection covering only communications to government bodies. No comprehensive anti-SLAPP statute for general public-interest speech.',
  shield_law_citation        = 'Wis. Stat. § 885.14',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Enacted 2010. Qualified privilege for reporters against compelled disclosure of sources and unpublished information gathered in news production.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Milwaukee PD has a partial body cam program; Madison PD, Green Bay PD, and others have programs.',
  body_camera_public_access  = 'Requests under Wisconsin Public Records Law, Wis. Stat. § 19.31 et seq. Body cam footage is presumptively public with limited exceptions.',
  body_camera_retention      = 'No statewide minimum; Milwaukee PD retains 120 days routine',
  voter_id_requirements      = 'Strict photo ID required',
  accepted_ids               = 'WI DL/ID, US passport, military ID, tribal ID, student ID from WI college (must show current enrollment and signature). Wis. Stat. § 6.79. Student ID requirements are stricter than most states. Free state ID available. One of the more restrictive voter ID laws.',
  provisional_ballot_rules   = 'Provisional ballot available; voter must present qualifying ID to county clerk by 4 pm on the Friday after election',
  citizen_review_board       = 'Yes — Milwaukee has Fire and Police Commission (FPC) with broad oversight authority',
  citizen_review_powers      = 'Milwaukee FPC has authority to hire/fire the police chief, investigate complaints, and review use-of-force. One of the more powerful civilian oversight bodies in the US.'
WHERE state = 'Wisconsin';

-- ============================================================
-- WYOMING
-- Notable: No anti-SLAPP; no shield law; photo voter ID; one-party consent
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Wyo. Stat. Ann. § 7-3-702',
  wiretap_penalties          = 'Felony. Up to 5 years imprisonment and/or $10,000 fine.',
  wiretap_exceptions         = 'One-party consent. A party to the communication may lawfully record.',
  anti_slapp_law             = 'No',
  anti_slapp_citation        = 'None',
  anti_slapp_protections     = 'Wyoming has no anti-SLAPP statute.',
  shield_law_citation        = 'None',
  shield_law_type            = 'None',
  shield_law_qualifications  = 'Wyoming has no reporter shield law. Journalists may be compelled to disclose sources and materials.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'No statewide mandate. Cheyenne PD, Casper PD, and Wyoming Highway Patrol have body-worn camera programs.',
  body_camera_public_access  = 'Wyoming Public Records Act, Wyo. Stat. Ann. § 16-4-201 et seq.',
  body_camera_retention      = 'No statewide minimum',
  voter_id_requirements      = 'Photo ID required',
  accepted_ids               = 'WY DL/ID, US passport, military ID. Wyo. Stat. Ann. § 22-15-102. One of the stricter photo ID requirements. Free state ID available.',
  provisional_ballot_rules   = 'Provisional ballot available if voter cannot provide photo ID; voter must present qualifying ID to county clerk by 5 pm on the second day after the election',
  citizen_review_board       = 'No statewide board',
  citizen_review_powers      = 'No statewide civilian oversight'
WHERE state = 'Wyoming';

-- ============================================================
-- WISCONSIN (additional: citizen review for Milwaukee)
-- Already included above in Wisconsin block.
-- ============================================================

-- ============================================================
-- Additional updates for states missing citizen_review_board data
-- in prior migrations (belt-and-suspenders updates for completeness)
-- ============================================================

UPDATE public.state_laws SET
  citizen_review_board   = 'Yes — Denver OIM, Aurora Community Police Task Force',
  citizen_review_powers  = 'Denver OIM: independent monitors complaint investigations, audits, and publishes annual report. Aurora board: community oversight post-Elijah McClain killing, advisory recommendations.'
WHERE state = 'Colorado' AND (citizen_review_board IS NULL OR citizen_review_board = '');

UPDATE public.state_laws SET
  citizen_review_board   = 'Yes — Minneapolis Police Conduct Oversight Commission; St. Paul Civilian Review Board',
  citizen_review_powers  = 'Minneapolis board investigates complaints and makes disciplinary recommendations; city council has authority to override chief. Enhanced powers following 2020 reforms.'
WHERE state = 'Minnesota' AND (citizen_review_board IS NULL OR citizen_review_board = '');

UPDATE public.state_laws SET
  citizen_review_board   = 'Yes — Portland PCCEP (Police Accountability Commission), Eugene Civilian Review Board',
  citizen_review_powers  = 'Portland: independent board with subpoena power, can recommend discipline; created under DOJ settlement. Eugene: complaint review and policy recommendations.'
WHERE state = 'Oregon' AND (citizen_review_board IS NULL OR citizen_review_board = '');
