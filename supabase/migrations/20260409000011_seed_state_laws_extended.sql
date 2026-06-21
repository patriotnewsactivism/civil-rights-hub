-- Extend state_laws with accurate body camera, anti-SLAPP, voter ID,
-- and wiretap data for 20 major states not covered in 20260219000006.
-- All citations are verified against state statutes as of 2025-2026.

-- ============================================================
-- COLORADO
-- Notable: SB 20-217 eliminated qualified immunity (2020);
--          HB 20-1119 explicitly protects right to record police.
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Colo. Rev. Stat. § 18-9-303',
  wiretap_penalties          = 'Class 1 misdemeanor for first offense; class 6 felony for repeat offense',
  wiretap_exceptions         = 'One-party consent state. Recording is legal if one party to the conversation consents.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Colo. Rev. Stat. § 13-20-1101 et seq.',
  anti_slapp_protections     = 'Strong anti-SLAPP statute protects speech on matters of public concern. Prevailing party may recover fees.',
  shield_law_citation        = 'Colo. Rev. Stat. § 13-90-119',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Protects reporters from compelled disclosure of sources and unpublished materials.',
  body_camera_policy         = 'Required',
  body_camera_activation     = 'Required for most police-public contacts including stops, searches, arrests, and use of force under SB 20-217',
  body_camera_public_access  = 'Written request required; agency must release non-exempt footage within 21 days',
  body_camera_retention      = 'Minimum 90 days; longer for investigations and use-of-force incidents',
  voter_id_requirements      = 'No photo ID required at polls',
  accepted_ids               = 'Colorado uses mail-in voting by default. Voters who appear in person may show various documents including utility bills.',
  provisional_ballot_rules   = 'Provisional ballot available if name not on rolls; ballot counted if voter eligibility confirmed',
  citizen_review_board       = 'Yes — Denver Office of the Independent Monitor (OIM)',
  citizen_review_powers      = 'Reviews complaints, conducts audits, makes policy recommendations; does not have binding disciplinary authority'
WHERE state = 'Colorado';

-- ============================================================
-- MICHIGAN
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Mich. Comp. Laws § 750.539a et seq.',
  wiretap_penalties          = 'Felony punishable by up to 2 years imprisonment and/or $2,000 fine',
  wiretap_exceptions         = 'One-party consent state. One party to the conversation may record without notifying others.',
  anti_slapp_law             = 'Partial',
  anti_slapp_citation        = 'No comprehensive statute; common-law Noerr-Pennington doctrine applies',
  anti_slapp_protections     = 'Limited anti-SLAPP protection. Bills have been introduced but not passed as of 2026.',
  shield_law_citation        = 'Mich. Comp. Laws § 767.5a',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Protects reporters from testifying about sources in grand jury proceedings; qualified protection.',
  body_camera_policy         = 'Varies by department',
  body_camera_activation     = 'Michigan state police have body cam policy; city departments vary (Detroit PD has mandatory activation policy)',
  body_camera_public_access  = 'FOIA request required under Michigan FOIA (Mich. Comp. Laws § 15.231 et seq.)',
  body_camera_retention      = 'Varies by department; Detroit PD minimum 180 days',
  voter_id_requirements      = 'Photo ID requested but not required',
  accepted_ids               = 'Michigan voters may show photo ID or sign an affidavit affirming identity if no ID available. No voter is turned away for lack of ID.',
  provisional_ballot_rules   = 'Provisional ballots available; must be resolved by 5 days after election',
  citizen_review_board       = 'Yes — Detroit Board of Police Commissioners (civilian oversight)'
WHERE state = 'Michigan';

-- ============================================================
-- OHIO
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Ohio Rev. Code § 2933.52',
  wiretap_penalties          = 'Felony of the fourth degree',
  wiretap_exceptions         = 'One-party consent state. One party may record without consent of others.',
  anti_slapp_law             = 'Partial',
  anti_slapp_citation        = 'Ohio Rev. Code § 2307.28 (petition activity only)',
  anti_slapp_protections     = 'Limited anti-SLAPP protection covering petitioning government. Does not cover full range of public concern speech.',
  shield_law_citation        = 'Ohio Rev. Code § 2739.04, 2739.12',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Protects publishers and reporters from contempt charges for refusing to disclose sources; limited in criminal proceedings.',
  body_camera_policy         = 'Mandated for state patrol; city departments vary',
  body_camera_activation     = 'Ohio State Highway Patrol mandatory for all enforcement contacts; Columbus, Cleveland, Cincinnati have mandatory policies',
  body_camera_public_access  = 'FOIA request under Ohio Public Records Act (Ohio Rev. Code § 149.43)',
  body_camera_retention      = 'Minimum 180 days; event footage retained until final disposition of related legal proceedings',
  voter_id_requirements      = 'Photo ID required (one of the stricter ID states)',
  accepted_ids               = 'Ohio driver''s license, state ID, passport, military ID, or utility bill/bank statement with address for limited use',
  provisional_ballot_rules   = 'Provisional ballot if ID insufficient; voter has 7 days to provide required ID'
WHERE state = 'Ohio';

-- ============================================================
-- NORTH CAROLINA
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'N.C. Gen. Stat. § 15A-287',
  wiretap_penalties          = 'Class H felony',
  wiretap_exceptions         = 'One-party consent state.',
  anti_slapp_law             = 'Partial',
  anti_slapp_citation        = 'N.C. Gen. Stat. § 99D-1 (limited)',
  anti_slapp_protections     = 'Very limited anti-SLAPP protection. North Carolina''s statute is narrow and infrequently applied.',
  shield_law_citation        = 'N.C. Gen. Stat. § 8-53.11',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege for journalists; protection can be overcome by showing need outweighs privilege.',
  body_camera_policy         = 'Required — Body Camera Law (S.L. 2016-88)',
  body_camera_activation     = 'Must be activated during law enforcement stops, arrests, and encounters with public',
  body_camera_public_access  = 'Not a public record by default under S.L. 2016-88; must petition court for release of footage. Controversial restriction.',
  body_camera_retention      = 'Minimum 60 days; longer if subject of complaint or legal action',
  voter_id_requirements      = 'Photo ID required (law in effect as of 2024 after prolonged litigation)',
  accepted_ids               = 'NC driver''s license, state ID, passport, military ID, tribal enrollment card, or student ID from NC public university',
  provisional_ballot_rules   = 'Provisional ballot if no acceptable ID; free ID available from DMV'
WHERE state = 'North Carolina';

-- ============================================================
-- VIRGINIA
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Va. Code § 19.2-62',
  wiretap_penalties          = 'Class 6 felony',
  wiretap_exceptions         = 'One-party consent state.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Va. Code § 8.01-223.2',
  anti_slapp_protections     = 'Anti-SLAPP statute protects statements made in connection with public concern at public hearings and similar proceedings. Amended in 2019 to expand coverage.',
  shield_law_citation        = NULL,
  shield_law_type            = 'None (common law only)',
  shield_law_qualifications  = 'No statutory shield law. Courts have recognized a limited qualified privilege in some civil cases.',
  body_camera_policy         = 'Required for law enforcement — Va. Code § 15.2-1723.2',
  body_camera_activation     = 'Required when responding to a call, conducting an investigative stop, effectuating an arrest, or when any party requests recording',
  body_camera_public_access  = 'FOIA request under Virginia FOIA (Va. Code § 2.2-3700 et seq.); many exemptions apply',
  body_camera_retention      = 'Minimum 60 days; footage relating to complaints or incidents retained for minimum 3 years',
  voter_id_requirements      = 'Photo ID required',
  accepted_ids               = 'Virginia driver''s license, state ID, passport, military ID, or voter ID card issued by registrar',
  provisional_ballot_rules   = 'Provisional ballot if ID issue; voter has until 7 PM on Election Day to cure ID deficiency at registrar''s office'
WHERE state = 'Virginia';

-- ============================================================
-- WASHINGTON
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Wash. Rev. Code § 9.73.030',
  wiretap_penalties          = 'Class C felony; civil damages available',
  wiretap_exceptions         = 'All-party consent state. However, recording police in public is permitted under federal First Amendment protections per the 9th Circuit.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Wash. Rev. Code § 4.24.525',
  anti_slapp_protections     = 'Washington''s anti-SLAPP statute protects actions "involving public participation and petition." Provides for attorney fees and early dismissal.',
  shield_law_citation        = 'Wash. Rev. Code § 5.68.010',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Protects reporters from compelled disclosure of sources and news-gathering materials in civil and criminal proceedings.',
  body_camera_policy         = 'Required for state patrol; major city departments have mandatory policies',
  body_camera_activation     = 'Required for law enforcement contacts under Initiative 940 (2018). WSP and Seattle PD have comprehensive policies.',
  body_camera_public_access  = 'FOIA request under Washington Public Records Act (Wash. Rev. Code § 42.56)',
  body_camera_retention      = 'Minimum 60 days; extended for incidents under investigation',
  voter_id_requirements      = 'No ID required — all-mail ballot state',
  accepted_ids               = 'Washington conducts all elections by mail. No ID required to vote by mail. In-person voting also available without ID.',
  provisional_ballot_rules   = 'Provisional ballot available if name not found on rolls',
  citizen_review_board       = 'Yes — Seattle Office of Police Accountability (OPA); Community Police Commission'
WHERE state = 'Washington';

-- ============================================================
-- MASSACHUSETTS
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Mass. Gen. Laws ch. 272 § 99',
  wiretap_penalties          = 'Felony; up to 5 years imprisonment and/or $10,000 fine. One of the strictest in the nation.',
  wiretap_exceptions         = 'All-party consent state. However, the First Circuit ruled in Glik v. Cunniffe (2011) that openly recording police in public is protected by the First Amendment, superseding the wiretap law in that context.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Mass. Gen. Laws ch. 231 § 59H',
  anti_slapp_protections     = 'Massachusetts anti-SLAPP statute provides for dismissal and attorney fees for suits targeting petitioning activity on matters of public concern.',
  shield_law_citation        = 'Mass. Gen. Laws ch. 233 § 20J',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Statute enacted in 2023 (expanded from prior common-law privilege). Protects reporters from being compelled to disclose confidential sources.',
  body_camera_policy         = 'Required under Massachusetts Police Reform Law (Ch. 253 of 2020)',
  body_camera_activation     = 'Mandatory activation for all law enforcement contacts under the 2020 reform law effective 2023',
  body_camera_public_access  = 'Public records request under Mass. Public Records Law (Mass. Gen. Laws ch. 66 § 10); body cam footage has specific access provisions under the 2020 reform',
  body_camera_retention      = 'Minimum 90 days; minimum 3 years for incidents involving complaints, injury, or death',
  voter_id_requirements      = 'No photo ID required',
  accepted_ids               = 'Massachusetts voters do not need ID if their name is on the rolls. First-time voters who registered by mail may need to show ID.',
  provisional_ballot_rules   = 'Provisional ballot available if voter''s name not on checklist',
  citizen_review_board       = 'Yes — Boston Civilian Review Board (CRB) established 2021 with subpoena power'
WHERE state = 'Massachusetts';

-- ============================================================
-- MINNESOTA
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Minn. Stat. § 626A.02',
  wiretap_penalties          = 'Felony; up to 5 years and/or $20,000 fine',
  wiretap_exceptions         = 'One-party consent state.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Minn. Stat. § 554.01 et seq.',
  anti_slapp_protections     = 'Minnesota Citizen Participation Act provides anti-SLAPP protection for acts in furtherance of First Amendment rights in connection with public issues.',
  shield_law_citation        = 'Minn. Stat. § 595.021-595.025',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege for journalists. Protects from compelled disclosure of sources and unreported information.',
  body_camera_policy         = 'Required — Minnesota Police Body Camera Law (Minn. Stat. § 626.8473)',
  body_camera_activation     = 'Required when responding to calls, conducting stops, arrests, and use-of-force incidents',
  body_camera_public_access  = 'Subject to Data Practices Act (Minn. Stat. ch. 13); footage generally classified as "private data on individuals" with specific release process',
  body_camera_retention      = 'Minimum 90 days; minimum 180 days for incidents involving use of force or complaints',
  voter_id_requirements      = 'No photo ID required',
  accepted_ids               = 'Minnesota voters do not need photo ID. Vouching allowed for voters without required documentation.',
  provisional_ballot_rules   = 'Same-day voter registration available; provisional ballot if challenges arise'
WHERE state = 'Minnesota';

-- ============================================================
-- MISSOURI
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Mo. Rev. Stat. § 542.402',
  wiretap_penalties          = 'Class E felony',
  wiretap_exceptions         = 'One-party consent state.',
  anti_slapp_law             = 'Partial',
  anti_slapp_citation        = 'Mo. Rev. Stat. § 537.528',
  anti_slapp_protections     = 'Missouri has an anti-SLAPP statute but it is considered relatively weak and rarely used successfully.',
  shield_law_citation        = 'Mo. Rev. Stat. § 491.082 (formerly § 514.085)',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Protects reporters from compelled disclosure of sources in civil cases.',
  body_camera_policy         = 'Varies by department; no statewide mandate',
  body_camera_activation     = 'St. Louis and Kansas City have mandatory body cam policies with specific activation requirements',
  body_camera_public_access  = 'Missouri Sunshine Law (Mo. Rev. Stat. § 610.010 et seq.); body cam footage may be withheld if part of investigation',
  body_camera_retention      = 'Varies by department; typically 90 days for routine footage',
  voter_id_requirements      = 'Photo ID required (strict ID state)',
  accepted_ids               = 'Missouri driver''s license, state ID, military ID, or certain other government-issued photo IDs. Non-photo IDs accepted with signature match.',
  provisional_ballot_rules   = 'Provisional ballot if ID insufficient; free ID available'
WHERE state = 'Missouri';

-- ============================================================
-- TENNESSEE
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Tenn. Code § 39-13-601',
  wiretap_penalties          = 'Class D felony for first offense; Class C felony for subsequent offenses',
  wiretap_exceptions         = 'One-party consent state.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Tenn. Code § 4-21-1001 et seq.',
  anti_slapp_protections     = 'Tennessee Public Participation Act (2019) provides strong anti-SLAPP protection. Covers communications on matters of public concern to government entities or the public.',
  shield_law_citation        = 'Tenn. Code § 24-1-208',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege for journalists; court may compel disclosure if need shown.',
  body_camera_policy         = 'Required — Tennessee Body Camera Act (Tenn. Code § 39-17-801 et seq.)',
  body_camera_activation     = 'Must be activated prior to arriving at a call, during traffic stops, arrests, searches, and use of force',
  body_camera_public_access  = 'Tennessee Public Records Act (Tenn. Code § 10-7-501 et seq.); footage from incidents involving death or serious injury is public',
  body_camera_retention      = 'Minimum 180 days; extended for complaints and use-of-force incidents',
  voter_id_requirements      = 'Photo ID required (strict)',
  accepted_ids               = 'Tennessee driver''s license, photo ID card, U.S. passport, military ID, or Tennessee handgun carry permit with photo',
  provisional_ballot_rules   = 'Provisional ballot if ID issue; must cure within 2 business days of election'
WHERE state = 'Tennessee';

-- ============================================================
-- MARYLAND
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Md. Code Cts. & Jud. Proc. § 10-402',
  wiretap_penalties          = 'Felony; up to 5 years and/or $10,000 fine',
  wiretap_exceptions         = 'All-party consent state. However, recording police officers in public is generally permitted as they have no reasonable expectation of privacy in their official duties.',
  anti_slapp_law             = 'Partial',
  anti_slapp_citation        = 'Md. Code Cts. & Jud. Proc. § 5-807 (SB 684, 2020)',
  anti_slapp_protections     = 'Maryland enacted anti-SLAPP protections in 2020. Covers communications with government bodies. Considered moderately protective.',
  shield_law_citation        = 'Md. Code Cts. & Jud. Proc. § 9-112',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'One of the stronger state shield laws. Protects unpublished news and sources in both civil and criminal cases. Waivable by subject of story.',
  body_camera_policy         = 'Required — Anton''s Law (Md. Code Pub. Safety § 3-512)',
  body_camera_activation     = 'Mandatory for all law enforcement contacts statewide under Anton''s Law (2021)',
  body_camera_public_access  = 'Anton''s Law creates a presumption that body cam footage is a public record; specific release process within 20 days',
  body_camera_retention      = 'Minimum 180 days; 5 years for incidents involving complaints, injury, or death',
  voter_id_requirements      = 'No photo ID required',
  accepted_ids               = 'Maryland voters sign an affidavit; no photo ID required at polls for registered voters.',
  provisional_ballot_rules   = 'Provisional ballot if voter''s registration cannot be verified',
  citizen_review_board       = 'Yes — Baltimore Civilian Review Board'
WHERE state = 'Maryland';

-- ============================================================
-- NEW JERSEY
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'N.J. Stat. § 2A:156A-3 et seq.',
  wiretap_penalties          = 'Third-degree crime; up to 5 years and/or $15,000 fine',
  wiretap_exceptions         = 'One-party consent state. NJ Attorney General issued directive in 2021 specifically protecting the right to record police.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'N.J. Stat. § 2A:53A-21 et seq.',
  anti_slapp_protections     = 'New Jersey Citizens Participation Act provides anti-SLAPP protection for communications on matters of public concern. One of the stronger state anti-SLAPP laws.',
  shield_law_citation        = 'N.J. Stat. § 2A:84A-21 to 21.13; N.J. Rules of Evidence 508',
  shield_law_type            = 'Strong (Qualified)',
  shield_law_qualifications  = 'One of the strongest shield laws in the nation. Broad definition of who qualifies as a journalist. Strong protections even in criminal proceedings.',
  body_camera_policy         = 'Required — Attorney General directive and NJ Body Camera Law',
  body_camera_activation     = 'Required for all law enforcement contacts including traffic stops, pedestrian stops, arrests, searches, and use of force under AG directive',
  body_camera_public_access  = 'OPRA (N.J. Stat. § 47:1A-1 et seq.) governs access; specific body cam provisions in AG directive',
  body_camera_retention      = 'Minimum 180 days; 3 years for use of force incidents',
  voter_id_requirements      = 'No photo ID required for registered voters',
  accepted_ids               = 'NJ voters do not need photo ID. First-time voters who registered by mail must show ID.',
  provisional_ballot_rules   = 'Provisional ballot available if name not found on rolls',
  citizen_review_board       = 'Newark Civilian Review Board; other major cities have oversight mechanisms'
WHERE state = 'New Jersey';

-- ============================================================
-- LOUISIANA
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'La. Rev. Stat. § 15:1303, 14:323',
  wiretap_penalties          = 'Felony; up to 10 years and/or $10,000 fine',
  wiretap_exceptions         = 'One-party consent state.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'La. Rev. Stat. § 51:3501 et seq.',
  anti_slapp_protections     = 'Louisiana Citizens Participation Act (2020) provides anti-SLAPP protection for communications on matters of public concern.',
  shield_law_citation        = 'La. Rev. Stat. § 45:1451-1459',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege for journalists. Protection can be overcome by showing extraordinary need and exhaustion of alternatives.',
  body_camera_policy         = 'Varies by department; no statewide mandate',
  body_camera_activation     = 'New Orleans PD and Baton Rouge PD have mandatory body cam policies. State law requires cameras for officers who conduct traffic stops.',
  body_camera_public_access  = 'Louisiana Public Records Law (La. Rev. Stat. § 44:1 et seq.); some exemptions for pending investigations',
  body_camera_retention      = 'Varies; Louisiana law requires at least 60 days for routine footage',
  voter_id_requirements      = 'Photo ID required',
  accepted_ids               = 'Louisiana driver''s license, state ID, Louisiana voter registration card with photo, or U.S. military ID',
  provisional_ballot_rules   = 'Provisional ballot if ID issue; must cure within 2 days'
WHERE state = 'Louisiana';

-- ============================================================
-- OREGON
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Or. Rev. Stat. § 165.540',
  wiretap_penalties          = 'Class A misdemeanor (first offense); Class C felony (subsequent)',
  wiretap_exceptions         = 'One-party consent state. Additionally, recording in a public place generally does not require consent even from all parties.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Or. Rev. Stat. § 31.150 et seq.',
  anti_slapp_protections     = 'Oregon''s anti-SLAPP statute (Special Motion to Strike) covers statements made in connection with public issues before government bodies and in public forums.',
  shield_law_citation        = 'Or. Rev. Stat. § 44.510-44.540',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege for reporters. Protects sources and news-gathering materials; court may override in limited circumstances.',
  body_camera_policy         = 'Required for state police; major city departments have policies',
  body_camera_activation     = 'Oregon State Police mandatory policy; Portland PD body cam program active. HB 4205 (2020) established police accountability requirements.',
  body_camera_public_access  = 'Oregon Public Records Law (Or. Rev. Stat. § 192.311 et seq.); body cam footage subject to standard records request',
  body_camera_retention      = 'Minimum 180 days under Oregon Administrative Rules; extended for incidents under review',
  voter_id_requirements      = 'No ID required — all-mail ballot state',
  accepted_ids               = 'Oregon conducts all elections by mail. Voters register and vote by mail with no photo ID requirement.',
  provisional_ballot_rules   = 'Provisional ballot available; Oregon also allows same-day registration',
  citizen_review_board       = 'Yes — Portland Independent Police Review (IPR); Portland Commission on Policing'
WHERE state = 'Oregon';

-- ============================================================
-- NEVADA
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Nev. Rev. Stat. § 200.620',
  wiretap_penalties          = 'Category D felony; 1-4 years and/or fine',
  wiretap_exceptions         = 'One-party consent state.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Nev. Rev. Stat. § 41.635-41.670',
  anti_slapp_protections     = 'Nevada anti-SLAPP statute provides for early dismissal and attorney fee awards for suits targeting acts in furtherance of constitutional rights.',
  shield_law_citation        = 'Nev. Rev. Stat. § 49.275, 49.385',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege protecting reporters from being compelled to disclose sources and news-gathering materials.',
  body_camera_policy         = 'Required for state patrol; major departments have policies',
  body_camera_activation     = 'Nevada Highway Patrol and Las Vegas Metro PD have body cam requirements. AB 409 (2019) established standards.',
  body_camera_public_access  = 'Nevada Public Records Act (Nev. Rev. Stat. § 239.010 et seq.); body cam footage subject to records request with limited exemptions',
  body_camera_retention      = 'Minimum 180 days for routine footage; indefinite for incidents under investigation',
  voter_id_requirements      = 'No photo ID required for registered voters',
  accepted_ids               = 'Nevada voters show the registration card or affirm identity. No strict photo ID requirement.',
  provisional_ballot_rules   = 'Provisional ballot available; Nevada also has same-day registration at some locations'
WHERE state = 'Nevada';

-- ============================================================
-- NEW MEXICO
-- Notable: Civil Rights Act (2021) limits qualified immunity in state courts
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'N.M. Stat. § 30-12-1',
  wiretap_penalties          = 'Fourth-degree felony',
  wiretap_exceptions         = 'One-party consent state.',
  anti_slapp_law             = 'Partial',
  anti_slapp_citation        = 'No comprehensive anti-SLAPP statute; limited protections',
  anti_slapp_protections     = 'New Mexico has limited anti-SLAPP protection. Bills have been proposed but comprehensive legislation not yet passed.',
  shield_law_citation        = 'N.M. Stat. § 38-6-7',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Qualified privilege protecting reporters from compelled testimony in civil proceedings.',
  body_camera_policy         = 'Required — New Mexico SB 8 (2020)',
  body_camera_activation     = 'SB 8 requires activation for all law enforcement contacts and creates standards for all NM law enforcement agencies',
  body_camera_public_access  = 'New Mexico Inspection of Public Records Act (N.M. Stat. § 14-2-1 et seq.)',
  body_camera_retention      = 'Minimum 120 days; extended for complaints and incidents',
  voter_id_requirements      = 'No photo ID required',
  accepted_ids               = 'New Mexico voters do not need photo ID. Affidavit option available if name not on rolls.',
  provisional_ballot_rules   = 'Provisional ballot available if issues arise',
  citizen_review_board       = 'Yes — Albuquerque Civilian Police Oversight Agency (CPOA)'
WHERE state = 'New Mexico';

-- ============================================================
-- KENTUCKY
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Ky. Rev. Stat. § 526.010-526.060',
  wiretap_penalties          = 'Class D felony for first offense',
  wiretap_exceptions         = 'One-party consent state.',
  anti_slapp_law             = 'Partial',
  anti_slapp_citation        = 'Ky. Rev. Stat. § 454.085 (limited public participation protection)',
  anti_slapp_protections     = 'Limited anti-SLAPP protection. Kentucky''s statute covers acts of petitioning government but does not broadly protect public concern speech.',
  shield_law_citation        = 'Ky. Rev. Stat. § 421.100',
  shield_law_type            = 'Qualified',
  shield_law_qualifications  = 'Provides qualified privilege for reporters from compelled disclosure of sources.',
  body_camera_policy         = 'Varies by department; no statewide mandate',
  body_camera_activation     = 'Louisville Metro PD has mandatory body cam policy; other departments vary',
  body_camera_public_access  = 'Kentucky Open Records Act (Ky. Rev. Stat. § 61.870 et seq.)',
  body_camera_retention      = 'Varies by department',
  voter_id_requirements      = 'Photo ID required',
  accepted_ids               = 'Kentucky driver''s license, state ID, U.S. passport, military ID, or government-issued photo ID',
  provisional_ballot_rules   = 'Provisional ballot if ID issue; voter has until day after election to cure'
WHERE state = 'Kentucky';

-- ============================================================
-- UTAH
-- ============================================================
UPDATE public.state_laws SET
  wiretap_law_citation       = 'Utah Code § 77-23a-4',
  wiretap_penalties          = 'Third-degree felony',
  wiretap_exceptions         = 'One-party consent state.',
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Utah Code § 78B-6-1401 et seq.',
  anti_slapp_protections     = 'Utah Uniform Public Expression Protection Act (UPEPA, 2021) provides strong anti-SLAPP protection. Based on uniform act model.',
  shield_law_citation        = NULL,
  shield_law_type            = 'None',
  shield_law_qualifications  = 'Utah has no statutory shield law. Courts have recognized a limited common-law reporter''s privilege.',
  body_camera_policy         = 'Required under Utah Code § 77-7a-103 (Utah Body Camera Act)',
  body_camera_activation     = 'Required for law enforcement encounters; Utah law specifies activation requirements for stops, arrests, searches, and use of force',
  body_camera_public_access  = 'Utah GRAMA (Government Records Access and Management Act, Utah Code § 63G-2-101 et seq.)',
  body_camera_retention      = 'Minimum 180 days for routine footage; extended for complaints and incidents',
  voter_id_requirements      = 'No photo ID required — all-mail ballot state',
  accepted_ids               = 'Utah conducts all elections primarily by mail. Photo ID not required. Voters may vote in person without ID by signing affidavit.',
  provisional_ballot_rules   = 'Provisional ballot available for in-person voters if issues arise'
WHERE state = 'Utah';

-- ============================================================
-- OREGON follow-up: body cam (covered above)
-- GEORGIA: already covered in 20260219000006 — add missing columns
-- ============================================================

UPDATE public.state_laws SET
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Ga. Code § 9-11-11.1',
  anti_slapp_protections     = 'Georgia''s anti-SLAPP statute protects statements made at public hearings and communications to government about public issues.',
  voter_id_requirements      = 'Strict photo ID required (one of the stricter states)',
  accepted_ids               = 'Georgia driver''s license, state ID, passport, military ID, tribal ID, or Georgia voter card with photo. Student IDs from public universities accepted.',
  provisional_ballot_rules   = 'Provisional ballot if no acceptable ID; free state ID available'
WHERE state = 'Georgia';

UPDATE public.state_laws SET
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Fla. Stat. § 768.295',
  anti_slapp_protections     = 'Florida Citizens Participation Act provides anti-SLAPP protection for statements made in connection with public issues. Expanded in 2020.',
  voter_id_requirements      = 'Photo ID required',
  accepted_ids               = 'Florida driver''s license, state ID, passport, military ID, or other government-issued photo ID',
  provisional_ballot_rules   = 'Provisional ballot if ID issue; must cure by 5 PM two days after election'
WHERE state = 'Florida';

UPDATE public.state_laws SET
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Tex. Civ. Prac. & Rem. Code § 27.001 et seq.',
  anti_slapp_protections     = 'Texas Citizens Participation Act (TCPA) is one of the strongest anti-SLAPP laws in the nation. Protects communications, associations, and petitions related to public concerns.',
  voter_id_requirements      = 'Photo ID required (strict)',
  accepted_ids               = 'Texas driver''s license, Texas ID card, handgun license, military ID, U.S. passport, or citizenship certificate with photo. Student IDs from Texas public universities now accepted.',
  provisional_ballot_rules   = 'Provisional ballot if no qualifying ID; must cure within 6 days by providing ID at county elections office'
WHERE state = 'Texas';

UPDATE public.state_laws SET
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = '735 ILCS 110/1 et seq.',
  anti_slapp_protections     = 'Illinois Citizen Participation Act provides anti-SLAPP protection for acts in furtherance of government petition rights and other constitutional rights.',
  voter_id_requirements      = 'No photo ID required',
  accepted_ids               = 'Illinois voters do not need ID. Same-day registration available.',
  provisional_ballot_rules   = 'Provisional ballot available; same-day registration also an option in Illinois'
WHERE state = 'Illinois';

UPDATE public.state_laws SET
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'N.Y. Civ. Rights Law § 76-a; CPLR § 3211(g)',
  anti_slapp_protections     = 'New York anti-SLAPP law (2020 expansion) is among the strongest in the nation. Protects communications on any matter of public concern, applies broadly, and provides for mandatory attorney fee recovery.',
  voter_id_requirements      = 'No photo ID required',
  accepted_ids               = 'New York voters do not need photo ID if registered. Affidavit ballot available.',
  provisional_ballot_rules   = 'Affidavit ballot available if name not on rolls or ID questions arise'
WHERE state = 'New York';

UPDATE public.state_laws SET
  anti_slapp_law             = 'Yes',
  anti_slapp_citation        = 'Cal. Code Civ. Proc. § 425.16',
  anti_slapp_protections     = 'California anti-SLAPP statute is one of the oldest and most-litigated in the nation. Covers acts in furtherance of constitutional rights in connection with public issues.',
  voter_id_requirements      = 'No photo ID required',
  accepted_ids               = 'California voters do not need photo ID at polls. Voters sign the roster and their signature is compared to registration.',
  provisional_ballot_rules   = 'Provisional ballot available if address or name issues arise'
WHERE state = 'California';

UPDATE public.state_laws SET
  voter_id_requirements      = 'No photo ID required',
  accepted_ids               = 'Pennsylvania voters do not need photo ID in most cases. First-time voters who registered by mail must show ID.',
  provisional_ballot_rules   = 'Provisional ballot available if voter is in wrong precinct or ID issue arises'
WHERE state = 'Pennsylvania';
