import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PublicRecordsTracker } from "@/components/PublicRecordsTracker";

const PublicRecords = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Public Records Tracker | Civil Rights Hub"
      description="File FOIA and public records requests, send via secure email, track deadlines, and see when agencies open your emails."
      ogTitle="Public Records Tracker — Civil Rights Hub"
      ogDescription="File, track, and manage your FOIA requests with email delivery and read receipts."
    />
    <Header />
    <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
      <PublicRecordsTracker />
    </main>
    <Footer />
  </div>
);

export default PublicRecords;
