import { getStatuteForJurisdiction, calculateStatutoryDueDate } from "./statutes";

export interface FoiaRequestInput {
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  requesterAddress?: string;
  agencyName: string;
  agencyAddress?: string;
  jurisdiction: string;
  recordDescription: string;
  feeLimitDollars?: number;
  requestFeeWaiver?: boolean;
  expeditedProcessing?: boolean;
  requestDate?: Date;
}

/**
 * Sanitizes text input to neutralize HTML and prevent PDF injection attacks.
 */
export function sanitizeFoiaInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "") // Strip HTML tags
    .replace(/\r\n|\r/g, "\n") // Normalize newlines
    .trim();
}

export interface GeneratedFoiaLetter {
  statuteName: string;
  statuteCitation: string;
  responseDeadlineFormatted: string;
  statutoryDueDate: string;
  businessDaysDeadline: number;
  letterText: string;
}

export function generateFoiaLetter(input: FoiaRequestInput): GeneratedFoiaLetter {
  const reqDate = input.requestDate || new Date();
  const statute = getStatuteForJurisdiction(input.jurisdiction);
  const dueDate = calculateStatutoryDueDate(reqDate, statute.businessDaysDeadline);
  
  const safeRequesterName = sanitizeFoiaInput(input.requesterName) || "[Requester Name]";
  const safeEmail = sanitizeFoiaInput(input.requesterEmail) || "[Requester Email]";
  const safePhone = sanitizeFoiaInput(input.requesterPhone || "");
  const safeAddress = sanitizeFoiaInput(input.requesterAddress || "");
  const safeAgency = sanitizeFoiaInput(input.agencyName) || "[Agency Records Custodian]";
  const safeAgencyAddress = sanitizeFoiaInput(input.agencyAddress || "");
  const safeDescription = sanitizeFoiaInput(input.recordDescription) || "[Detailed description of requested public records]";
  
  const feeCap = input.feeLimitDollars !== undefined && input.feeLimitDollars > 0 ? input.feeLimitDollars : 50;
  const formattedDate = reqDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const formattedDueDate = dueDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  let waiverClause = "";
  if (input.requestFeeWaiver) {
    waiverClause = `\nFEE WAIVER REQUEST:\nI hereby request a full waiver of all search and duplication fees. ${statute.feeWaiverStandard} This request is made for non-commercial, public accountability purposes.\n`;
  }

  let expeditedClause = "";
  if (input.expeditedProcessing) {
    expeditedClause = `\nEXPEDITED PROCESSING REQUEST:\nI request expedited processing because there is an urgent public need to inform the community concerning actual or alleged government activity.\n`;
  }

  const letterText = `${formattedDate}

TO:
Public Records Officer / Custodian of Records
${safeAgency}
${safeAgencyAddress ? safeAgencyAddress + "\n" : ""}
FROM:
${safeRequesterName}
${safeAddress ? safeAddress + "\n" : ""}Email: ${safeEmail}${safePhone ? "\nPhone: " + safePhone : ""}

RE: Formal Public Records Request under ${statute.statuteName} (${statute.statuteCitation})

Dear Records Custodian:

Pursuant to the provisions of ${statute.statuteName} (${statute.statuteCitation}), I hereby formally request access to and certified copies of the following public records:

${safeDescription}

STATUTORY DEADLINE:
Pursuant to ${statute.statuteCitation}, your agency is required to respond to this request within ${statute.businessDaysDeadline} business days (statutory target date: ${formattedDueDate}).
${waiverClause}${expeditedClause}
FEE LIMITATION:
If fees are assessed beyond standard waiver provisions, please notify me in advance if total costs will exceed $${feeCap}.00.

FORMAT OF RECORDS:
To reduce duplication costs and expedite transmission, please provide these records electronically in their native digital format via email to ${safeEmail}.

If you determine that any portion of the requested records is exempt from disclosure, please redact only the specific exempt portion and disclose all reasonably segregable non-exempt material, citing the exact statutory exemption supporting each redaction.

Thank you for your timely assistance and commitment to government transparency.

Respectfully submitted,

${safeRequesterName}`;

  return {
    statuteName: statute.statuteName,
    statuteCitation: statute.statuteCitation,
    responseDeadlineFormatted: `${statute.businessDaysDeadline} business days`,
    statutoryDueDate: formattedDueDate,
    businessDaysDeadline: statute.businessDaysDeadline,
    letterText,
  };
}
