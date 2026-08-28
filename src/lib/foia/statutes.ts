/**
 * State Public Records / FOIA Statutory Deadlines & Authority Metadata
 */

export interface StateFoiaStatute {
  state: string;
  stateCode: string;
  statuteName: string;
  statuteCitation: string;
  businessDaysDeadline: number;
  allowExtensionDays: number;
  feeWaiverStandard: string;
  appealAuthority: string;
}

export const STATE_FOIA_STATUTES: Record<string, StateFoiaStatute> = {
  Federal: {
    state: "Federal",
    stateCode: "US",
    statuteName: "Freedom of Information Act",
    statuteCitation: "5 U.S.C. § 552",
    businessDaysDeadline: 20,
    allowExtensionDays: 10,
    feeWaiverStandard: "Disclosure is in the public interest and contributes significantly to public understanding of government operations.",
    appealAuthority: "Head of Agency / Office of Government Information Services (OGIS)",
  },
  Alabama: {
    state: "Alabama",
    stateCode: "AL",
    statuteName: "Alabama Open Records Act",
    statuteCitation: "Ala. Code § 36-12-40",
    businessDaysDeadline: 10,
    allowExtensionDays: 15,
    feeWaiverStandard: "At discretion of agency custodian; standard copy fee limits apply.",
    appealAuthority: "Circuit Court of county where agency resides",
  },
  California: {
    state: "California",
    stateCode: "CA",
    statuteName: "California Public Records Act (CPRA)",
    statuteCitation: "Cal. Gov. Code §§ 7920.000 et seq.",
    businessDaysDeadline: 10,
    allowExtensionDays: 14,
    feeWaiverStandard: "Public interest served by disclosure clearly outweighs the public interest in withholding.",
    appealAuthority: "California Superior Court (Writ of Mandate)",
  },
  Florida: {
    state: "Florida",
    stateCode: "FL",
    statuteName: "Florida Sunshine Law / Public Records Act",
    statuteCitation: "Fla. Stat. ch. 119",
    businessDaysDeadline: 5,
    allowExtensionDays: 5,
    feeWaiverStandard: "Direct cost only; statutory exemption if primarily public interest reporting.",
    appealAuthority: "Circuit Court / Office of the Attorney General",
  },
  NewYork: {
    state: "New York",
    stateCode: "NY",
    statuteName: "Freedom of Information Law (FOIL)",
    statuteCitation: "N.Y. Pub. Off. Law §§ 84-90",
    businessDaysDeadline: 5,
    allowExtensionDays: 20,
    feeWaiverStandard: "Statutory limit to actual duplication cost unless waived in public interest.",
    appealAuthority: "Agency Appeals Officer followed by CPLR Article 78 proceeding",
  },
  Texas: {
    state: "Texas",
    stateCode: "TX",
    statuteName: "Texas Public Information Act (PIA)",
    statuteCitation: "Tex. Gov't Code ch. 552",
    businessDaysDeadline: 10,
    allowExtensionDays: 10,
    feeWaiverStandard: "Information primarily benefits the general public.",
    appealAuthority: "Office of the Attorney General, Open Records Division",
  },
  Virginia: {
    state: "Virginia",
    stateCode: "VA",
    statuteName: "Virginia Freedom of Information Act (VFOIA)",
    statuteCitation: "Va. Code Ann. § 2.2-3700 et seq.",
    businessDaysDeadline: 5,
    allowExtensionDays: 7,
    feeWaiverStandard: "Reasonable charges directly incurred in accessing and duplicating records.",
    appealAuthority: "General District or Circuit Court / Virginia FOIA Advisory Council",
  },
};

export function getStatuteForJurisdiction(jurisdictionName?: string | null): StateFoiaStatute {
  if (!jurisdictionName) return STATE_FOIA_STATUTES.Federal;
  const clean = jurisdictionName.replace(/\s+/g, "");
  return STATE_FOIA_STATUTES[clean] || STATE_FOIA_STATUTES.Federal;
}

export function calculateStatutoryDueDate(startDate: Date, businessDays: number): Date {
  const current = new Date(startDate.getTime());
  let added = 0;
  while (added < businessDays) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++;
    }
  }
  return current;
}
