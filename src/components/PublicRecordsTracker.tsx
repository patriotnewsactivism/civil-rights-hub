import { FOIABuilder } from "@/components/FOIABuilder";

/**
 * PublicRecordsTracker intentionally reuses the user-owned drafting/tracking workspace.
 * The previous implementation mixed unsourced statutory deadlines, agency contact data,
 * email-open pixels, campaign claims, and transparency scoring into the tracker. Those
 * surfaces remain withheld until they can be rebuilt from reviewed source evidence.
 */
export function PublicRecordsTracker() {
  return <FOIABuilder />;
}

export default PublicRecordsTracker;
