import { VerifiedDataHold } from "@/components/VerifiedDataHold";

export const CaseSearch = () => (
  <section id="case-search" className="py-20 bg-muted/50">
    <div className="container mx-auto max-w-4xl px-4">
      <VerifiedDataHold
        title="Case-law search is temporarily withheld"
        description="The legacy feature sent legal queries directly to a general-purpose language model and returned generated case summaries and citations without retrieving or validating court records."
        detail="The replacement must search authoritative court or government sources first, preserve the retrieved source for each result, and treat AI as a summarizer of cited material rather than a source of new legal facts."
      />
    </div>
  </section>
);
