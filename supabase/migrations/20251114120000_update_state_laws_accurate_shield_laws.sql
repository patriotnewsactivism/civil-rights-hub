-- Update state_laws table with accurate shield law information
-- Based on research from Reporters Committee for Freedom of the Press and other authoritative sources

-- States WITH statutory shield laws
UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Alabama has a statutory shield law providing absolute privilege for newspaper, radio, and television reporters to protect confidential sources and unpublished information.'
WHERE state_code = 'AL';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Alaska has a qualified statutory shield law protecting journalists from being compelled to disclose source information in most circumstances.'
WHERE state_code = 'AK';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Arizona has a statutory shield law and Media Subpoena Law providing strong protections for journalists and their sources.'
WHERE state_code = 'AZ';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Arkansas has a statutory shield law covering print and broadcast media, protecting confidential sources and unpublished information.'
WHERE state_code = 'AR';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'California has one of the strongest shield laws in the nation under Evidence Code § 1070, protecting journalists from contempt for refusing to disclose sources or unpublished information.'
WHERE state_code = 'CA';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Colorado enacted the Press Shield Law providing qualified protections for journalists to protect confidential sources and unpublished information.'
WHERE state_code = 'CO';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Connecticut enacted a statutory shield law in 2006 protecting journalists from being compelled to disclose confidential sources.'
WHERE state_code = 'CT';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Delaware has the Reporters'' Privilege Act providing statutory protection for journalists and their confidential sources.'
WHERE state_code = 'DE';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Florida has a journalist''s privilege statute protecting confidential sources and providing qualified privilege in most proceedings.'
WHERE state_code = 'FL';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Georgia has a statutory qualified privilege for news gatherers protecting confidential sources and unpublished information.'
WHERE state_code = 'GA';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Hawaii re-enacted its reporter''s privilege law in 2023, providing statutory protection for journalists and confidential sources.'
WHERE state_code = 'HI';

UPDATE public.state_laws SET
  has_shield_law = false,
  shield_law_details = 'Idaho does not have a statutory shield law, but courts have recognized some common law protections for reporters in certain circumstances.'
WHERE state_code = 'ID';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Illinois Code of Civil Procedure § 8-901 et seq. provides statutory shield law protections for journalists and their sources.'
WHERE state_code = 'IL';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Indiana has a statutory absolute privilege for journalists protecting confidential sources and information.'
WHERE state_code = 'IN';

UPDATE public.state_laws SET
  has_shield_law = false,
  shield_law_details = 'Iowa does not have a statutory shield law, but Iowa courts have recognized a qualified reporter''s privilege based on the First Amendment and state constitution.'
WHERE state_code = 'IA';

UPDATE public.state_laws SET
  has_shield_law = false,
  shield_law_details = 'Kansas does not have a statutory shield law, but Kansas courts have recognized a qualified privilege for journalists in certain civil cases.'
WHERE state_code = 'KS';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Kentucky has a statutory shield law protecting journalists from being compelled to disclose confidential sources and information.'
WHERE state_code = 'KY';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Louisiana has statutory protections for journalists, shielding confidential sources and unpublished information from compelled disclosure.'
WHERE state_code = 'LA';

UPDATE public.state_laws SET
  has_shield_law = false,
  shield_law_details = 'Maine does not have a statutory shield law, but Maine courts have recognized a qualified constitutional privilege for reporters.'
WHERE state_code = 'ME';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Maryland has a statutory shield law providing qualified protection for journalists and their confidential sources.'
WHERE state_code = 'MD';

UPDATE public.state_laws SET
  has_shield_law = false,
  shield_law_details = 'Massachusetts does not have a statutory shield law, but the Massachusetts Supreme Judicial Court has recognized a qualified reporter''s privilege under the First Amendment and state constitution.'
WHERE state_code = 'MA';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Michigan has a statutory shield law protecting journalists from being compelled to disclose confidential sources and information.'
WHERE state_code = 'MI';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Minnesota has a statutory shield law providing qualified protection for journalists and their sources.'
WHERE state_code = 'MN';

UPDATE public.state_laws SET
  has_shield_law = false,
  shield_law_details = 'Mississippi does not have a statutory shield law, but Mississippi courts have recognized a qualified privilege for journalists in some circumstances.'
WHERE state_code = 'MS';

UPDATE public.state_laws SET
  has_shield_law = false,
  shield_law_details = 'Missouri does not have a statutory shield law, but Missouri courts have recognized a qualified reporter''s privilege based on the First Amendment.'
WHERE state_code = 'MO';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Montana has the Media Confidentiality Act providing absolute privilege for journalists to protect confidential sources.'
WHERE state_code = 'MT';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Nebraska has a statutory shield law providing qualified protection for journalists and their confidential sources.'
WHERE state_code = 'NE';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Nevada has a statutory absolute privilege for journalists protecting confidential sources from compelled disclosure.'
WHERE state_code = 'NV';

UPDATE public.state_laws SET
  has_shield_law = false,
  shield_law_details = 'New Hampshire does not have a statutory shield law, but the state constitution and court decisions provide some protections for journalists.'
WHERE state_code = 'NH';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'New Jersey has a strong statutory shield law protecting journalists from being compelled to disclose confidential sources and unpublished information.'
WHERE state_code = 'NJ';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'New Mexico has a statutory shield law providing protection for journalists and their confidential sources.'
WHERE state_code = 'NM';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'New York has a qualified statutory shield law protecting journalists from being compelled to disclose confidential sources and unpublished news.'
WHERE state_code = 'NY';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'North Carolina has a statutory shield law providing qualified protection for journalists and their sources.'
WHERE state_code = 'NC';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'North Dakota has a statutory shield law protecting journalists from being compelled to disclose confidential sources.'
WHERE state_code = 'ND';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Ohio has a statutory shield law providing qualified protection for journalists and their confidential sources.'
WHERE state_code = 'OH';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Oklahoma has a statutory shield law protecting journalists from being compelled to disclose confidential sources and information.'
WHERE state_code = 'OK';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Oregon has one of the strongest statutory shield laws, providing absolute privilege for journalists to protect confidential sources.'
WHERE state_code = 'OR';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Pennsylvania has a statutory shield law protecting journalists and their confidential sources from compelled disclosure.'
WHERE state_code = 'PA';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Rhode Island has a statutory shield law providing protection for journalists and their confidential sources.'
WHERE state_code = 'RI';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'South Carolina has a statutory shield law protecting journalists from being compelled to disclose confidential sources.'
WHERE state_code = 'SC';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'South Dakota enacted a statutory shield law in March 2019, providing protection for journalists and their confidential sources.'
WHERE state_code = 'SD';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Tennessee has a statutory shield law providing qualified protection for journalists and their sources.'
WHERE state_code = 'TN';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Texas has statutory shield law protections under both civil and criminal procedure codes, providing qualified privilege for journalists.'
WHERE state_code = 'TX';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Utah adopted Rule of Evidence 509 in 2008, establishing a statutory reporter''s privilege protecting confidential sources.'
WHERE state_code = 'UT';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Vermont enacted a statutory shield law in 2017, providing protection for journalists and their confidential sources.'
WHERE state_code = 'VT';

UPDATE public.state_laws SET
  has_shield_law = false,
  shield_law_details = 'Virginia does not have a statutory shield law, but Virginia courts have recognized a qualified reporter''s privilege in civil cases under the First Amendment.'
WHERE state_code = 'VA';

UPDATE public.state_laws SET
  has_shield_law = true,
  shield_law_details = 'Washington has a statutory news media privilege law protecting journalists from being compelled to disclose confidential sources and information.'
WHERE state_code = 'WA';

UPDATE public.state_laws SET
  has_shield_law = false,
  shield_law_details = 'West Virginia does not have a statutory shield law, but courts have recognized some common law protections for journalists in certain circumstances.'
WHERE state_code = 'WV';

UPDATE public.state_laws SET
  has_shield_law = false,
  shield_law_details = 'Wisconsin does not have a statutory shield law, but Wisconsin courts have recognized a qualified reporter''s privilege based on the First Amendment in some cases.'
WHERE state_code = 'WI';

UPDATE public.state_laws SET
  has_shield_law = false,
  shield_law_details = 'Wyoming is the only state with neither a statutory shield law nor established judicial precedent protecting a reporter''s right to keep sources confidential.'
WHERE state_code = 'WY';
