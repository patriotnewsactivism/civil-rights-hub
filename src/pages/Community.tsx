import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function Community() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Community Network - Civil Rights Hub",
    "description": "Connect with journalists, activists, and attorneys across the civil rights movement",
    "url": "https://civilrightshub.org/community"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title="Community Network - Civil Rights Hub | Connect with Activists & Attorneys"
        description="Connect with journalists, activists, and attorneys across the civil rights movement. Share updates, send messages, and build your network in the fight for justice."
        keywords="civil rights community, activist network, attorney network, civil rights activists, legal community, social justice network"
        canonicalUrl="https://civilrightshub.org/community"
        ogUrl="https://civilrightshub.org/community"
        ogTitle="Community Network - Civil Rights Hub"
        ogDescription="Connect with journalists, activists, and attorneys across the civil rights movement"
        structuredData={structuredData}
      />
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Community Network</h1>
        <p className="text-muted-foreground">
          Connect with journalists, activists, and attorneys across the civil rights movement
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Features Pending Database Setup</AlertTitle>
        <AlertDescription>
          The community features (social feed, messages, events, etc.) require database migrations to be applied first.
          Please run the pending database migrations from the BUILD_PLAN.md to enable these features.
        </AlertDescription>
      </Alert>
    </div>
  );
}
