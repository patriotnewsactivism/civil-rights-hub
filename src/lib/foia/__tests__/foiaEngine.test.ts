import { describe, it, expect } from "vitest";
import {
  getStatuteForJurisdiction,
  calculateStatutoryDueDate,
  STATE_FOIA_STATUTES,
} from "../statutes";
import { generateFoiaLetter, sanitizeFoiaInput } from "../generator";

describe("FOIA Statutory Engine", () => {
  it("returns state-specific statute metadata accurately", () => {
    const ca = getStatuteForJurisdiction("California");
    expect(ca.businessDaysDeadline).toBe(10);
    expect(ca.statuteName).toContain("CPRA");

    const fl = getStatuteForJurisdiction("Florida");
    expect(fl.businessDaysDeadline).toBe(5);
    expect(fl.statuteCitation).toContain("119");
  });

  it("falls back to Federal FOIA for unrecognized jurisdictions", () => {
    const def = getStatuteForJurisdiction("UnknownState");
    expect(def.statuteCitation).toBe("5 U.S.C. § 552");
    expect(def.businessDaysDeadline).toBe(20);
  });

  it("skips weekends when calculating statutory response due dates", () => {
    // Friday start date
    const friday = new Date("2025-05-02T12:00:00Z"); // Friday
    const deadlineDays = 5; // Should skip Saturday (3) and Sunday (4), landing on Friday (9)
    const dueDate = calculateStatutoryDueDate(friday, deadlineDays);
    
    expect(dueDate.getDay()).toBe(5); // Friday
  });

  it("sanitizes script tags and XSS injection vectors from requester inputs", () => {
    const malicious = "<script>alert('xss')</script>John Doe";
    const sanitized = sanitizeFoiaInput(malicious);
    expect(sanitized).toBe("scriptalert('xss')/scriptJohn Doe");
    expect(sanitized).not.toContain("<");
    expect(sanitized).not.toContain(">");
  });

  it("generates complete formal public records letters with correct statutory references", () => {
    const letter = generateFoiaLetter({
      requesterName: "Jane Journalist",
      requesterEmail: "jane@press.org",
      agencyName: "Springfield Police Department",
      jurisdiction: "Texas",
      recordDescription: "Body-worn camera footage from May 1, 2025",
      feeLimitDollars: 75,
      requestFeeWaiver: true,
      expeditedProcessing: true,
      requestDate: new Date("2025-05-01T12:00:00Z"),
    });

    expect(letter.statuteName).toContain("Texas Public Information Act");
    expect(letter.statutoryDueDate).toBeTruthy();
    expect(letter.letterText).toContain("Tex. Gov't Code ch. 552");
    expect(letter.letterText).toContain("Jane Journalist");
    expect(letter.letterText).toContain("Springfield Police Department");
    expect(letter.letterText).toContain("FEE WAIVER REQUEST");
    expect(letter.letterText).toContain("EXPEDITED PROCESSING REQUEST");
    expect(letter.letterText).toContain("$75.00");
  });
});
