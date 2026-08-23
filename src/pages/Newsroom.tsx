import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { VerifiedDataHold } from "@/components/VerifiedDataHold";

const Newsroom = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Newsroom Verification Hold | Civil Rights Hub"
      description="Civil Rights Hub is rebuilding its newsroom so every displayed article, date, source attribution, and update timestamp maps to a real published source."
      canonicalUrl="https://civilrightshub.org/newsroom"
      robots="noindex, follow"
    />
    <Header />
    <main className="flex-1">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <VerifiedDataHold
          title="Newsroom cards are temporarily withheld"
          description="The legacy newsroom was a static demo dataset presented as a live news feed. It contained invented publication dates, unsupported summaries and urgency labels, and a timer that simulated a fresh 'updated' timestamp even when no reporting had changed."
          detail="The newsroom will return only with real article records, durable source URLs, actual publication/update timestamps, and a clear distinction between reporting, analysis, opinion, and external reference material."
        />
      </div>
    </main>
    <Footer />
  </div>
);

export default Newsroom;
