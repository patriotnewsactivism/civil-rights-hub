import { VerifiedDataHold } from "@/components/VerifiedDataHold";

export const AITools = () => (
  <section id="ai-tools" className="py-8 bg-background">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <VerifiedDataHold
          title="Source-grounded legal assistant rebuild in progress"
          description="The previous general-purpose AI legal assistant is disabled. Civil Rights Hub will not present generated legal answers as a research tool until responses can be grounded in current, reviewable legal authority with citations."
          detail="Use the Rights References and direct primary-source links while this tool is rebuilt."
        />
      </div>
    </div>
  </section>
);
