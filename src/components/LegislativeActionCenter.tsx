import { VerifiedDataHold } from "@/components/VerifiedDataHold";

export function LegislativeActionCenter() {
  return (
    <section id="legislative-action" className="py-20">
      <div className="container mx-auto max-w-4xl px-4">
        <VerifiedDataHold
          title="Legislative tracking is temporarily withheld"
          description="The legacy action center labels a bundled 2021–2023 bill list as verified current legislative data and includes stale status/action fields plus unsupported support/oppose counters. It is not a live Congress.gov or state-legislature feed."
          detail="The replacement will retrieve each bill from its official docket, store the source URL and retrieval time, and separate official vote/action history from Civil Rights Hub advocacy templates."
        />
      </div>
    </section>
  );
}
